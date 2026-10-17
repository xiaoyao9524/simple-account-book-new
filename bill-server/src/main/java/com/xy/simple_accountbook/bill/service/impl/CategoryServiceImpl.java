package com.xy.simple_accountbook.bill.service.impl;

import com.xy.simple_accountbook.bill.common.context.UserContext;
import com.xy.simple_accountbook.bill.common.enums.CategoryEnableEnum;
import com.xy.simple_accountbook.bill.common.enums.CategoryTypeEnum;
import com.xy.simple_accountbook.bill.common.enums.ResponseCodeEnum;
import com.xy.simple_accountbook.bill.dto.request.category.InsertCategoryRequest;
import com.xy.simple_accountbook.bill.entity.CategoryEntity;
import com.xy.simple_accountbook.bill.entity.UserCategoryEntity;
import com.xy.simple_accountbook.bill.entity.vo.CategoryVO;
import com.xy.simple_accountbook.bill.exception.BusinessException;
import com.xy.simple_accountbook.bill.mapper.CategoryMapper;
import com.xy.simple_accountbook.bill.mapper.UserCategoryMapper;
import com.xy.simple_accountbook.bill.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryMapper categoryMapper;

    private final UserCategoryMapper userCategoryMapper;

    @Override
    public List<CategoryVO> queryUserCategory() {
        Long userId = UserContext.getUserId();

        List<CategoryVO> categoryList = categoryMapper.queryUserCategories(userId);

        return categoryList;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void insertCategory(InsertCategoryRequest category) {
        Long uId = UserContext.getUserId();

        String title = category.getTitle();
        CategoryTypeEnum type = category.getType();

        /* 检查是否有同名的title*/
        int count = categoryMapper.countByTitleTypeAndUIdOrSystem(uId, title, type);

        if (count > 0) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "不可重复添加分类");
        }

        categoryMapper.insertCategory(uId, category);

        Long insertId = category.getId();

        if (insertId == null) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "插入分类失败");
        }

        UserCategoryEntity userCategory = new UserCategoryEntity();

        Integer maxSort = userCategoryMapper.queryMaxSortByUId(uId, type);

        userCategory.setUId(uId);
        userCategory.setCategoryId(insertId);
        userCategory.setEnable(CategoryEnableEnum.ENABLED);
        userCategory.setSort(maxSort == null ? 1 : maxSort + 1);

        userCategoryMapper.insertOne(userCategory);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchUpdateCategory(List<CategoryVO> categoryVos) {
        if (categoryVos == null || categoryVos.isEmpty()) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "无参数");
        }
        Long uId = UserContext.getUserId();

        List<Long> categoryIds = categoryVos.stream().map(CategoryVO::getId).toList();

        Map<Long, CategoryEntity> categoryEntityMap = categoryMapper.queryByIds(categoryIds)
                .stream()
                .collect(
                        Collectors.toMap(CategoryEntity::getId,
                                c -> c,
                                (existing, replacement) -> existing
                        ));

        Map<Long, UserCategoryEntity> userCategoryEntityMap = userCategoryMapper.queryByCategoryIdsAndUid(categoryIds, uId)
                .stream()
                .collect(
                        Collectors.toMap(
                                UserCategoryEntity::getCategoryId,
                                c -> c,
                                (existing, replacement) -> existing
                        ));

        List<CategoryEntity> updateCategoryList = new ArrayList<>();
        List<UserCategoryEntity> updateUserCategoryList = new ArrayList<>();

        categoryVos.forEach(category -> {
            CategoryEntity categoryEntity = categoryEntityMap.get(category.getId()); // categoryMapper.findCategoryById(category.getId());

            if (categoryEntity == null) {
                throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "该分类不存在");
            }

            if (categoryEntity.getUId() == null) {
                // 默认分类title和icon不能修改
                if (!category.getTitle().equals(categoryEntity.getTitle()) || !category.getIcon().equals(categoryEntity.getIcon())) {
                    throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "默认分类无法修改");
                }
            }

            if (categoryEntity.getUId() != null && !uId.equals(categoryEntity.getUId())) {
                throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "该分类不存在");
            }

            UserCategoryEntity userCategoryEntity = userCategoryEntityMap.get(category.getId()); // userCategoryMapper.findByCategoryIdAndUid(category.getId(), uId);

            if (userCategoryEntity == null) {
                throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "该分类不存在");
            }

            CategoryEntity updateCategoryEntity = new CategoryEntity();

            updateCategoryEntity.setId(category.getId());
            updateCategoryEntity.setUId(uId);
            updateCategoryEntity.setTitle(category.getTitle());
            updateCategoryEntity.setIcon(category.getIcon());

            updateCategoryList.add(updateCategoryEntity);

            UserCategoryEntity updateUserCategoryEntity = new UserCategoryEntity();

            updateUserCategoryEntity.setId(userCategoryEntity.getId());
            updateUserCategoryEntity.setUId(uId);
            updateUserCategoryEntity.setCategoryId(categoryEntity.getId());
            updateUserCategoryEntity.setEnable(category.getEnable());
            updateUserCategoryEntity.setSort(category.getSort());

            updateUserCategoryList.add(updateUserCategoryEntity);

        });
        categoryMapper.batchUpdateCategory(updateCategoryList);

        userCategoryMapper.batchUpdateUserCategory(updateUserCategoryList);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchDeleteCategory(List<Long> ids) {
        Long uId = UserContext.getUserId();
        // 先查出来所有的categoryEntity
        List<CategoryEntity> delCategoryEntitys = categoryMapper.queryByIds(ids);
        // 数量对不上 → 有 ID 不存在
        if (delCategoryEntitys.size() != ids.size()) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "部分分类不存在");
        }
        // 检查是否有默认分类和其他用户的分类
        for (int i = 0; i < delCategoryEntitys.size(); i++) {
            CategoryEntity delCategory = delCategoryEntitys.get(i);
            Long _delUid = delCategory.getUId();

            if (_delUid == null) {
                throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "第\"" + i +"\"项为默认分类不可删除");
            }
            if (!uId.equals(_delUid)) {
                throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "第\"" + i + "\"项不存在");
            }
        }

        List<UserCategoryEntity> delUserCategoryEntitys = userCategoryMapper.queryByCategoryIdsAndUid(ids, uId);

        if (delUserCategoryEntitys.isEmpty() || delUserCategoryEntitys.size() != delCategoryEntitys.size()) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "部分分类不存在");
        }

//        sql中查出来的已经过滤过uid了，这里先不判断
//        for (int i = 0; i < delUserCategoryEntitys.size();i++) {
//            UserCategoryEntity delUserCategoryEntity = delUserCategoryEntitys.get(i);
//
//            if (!uId.equals(delUserCategoryEntity.getUId())) {
//                throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "部分分类不存在");
//            }
//        }

        List<Long> delUserCategoryIds = delUserCategoryEntitys.stream().map(UserCategoryEntity::getId).collect(Collectors.toList());

        categoryMapper.batchDeleteCategory(ids, uId);
        userCategoryMapper.batchDeleteUserCategory(delUserCategoryIds, uId);
    }

    @Override
    public CategoryEntity findCategoryById (Long id) {
        return categoryMapper.findCategoryById(id);
    }
}
