package com.xy.simple_accountbook.bill.service.impl;

import com.xy.simple_accountbook.bill.common.context.UserContext;
import com.xy.simple_accountbook.bill.common.enums.CategoryEnableEnum;
import com.xy.simple_accountbook.bill.common.enums.ResponseCodeEnum;
import com.xy.simple_accountbook.bill.dto.request.bill.InsertBillRequest;
import com.xy.simple_accountbook.bill.dto.request.bill.UpdateBillRequest;
import com.xy.simple_accountbook.bill.entity.*;
import com.xy.simple_accountbook.bill.exception.BusinessException;
import com.xy.simple_accountbook.bill.mapper.*;
import com.xy.simple_accountbook.bill.mapper.result.BillQueryResult;
import com.xy.simple_accountbook.bill.service.BillService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BillServiceImpl implements BillService {

    private final BillMapper billMapper;
    private final BillUserMapper billUserMapper;
    private final CategoryMapper categoryMapper;
    private final UserCategoryMapper userCategoryMapper;
    private final UserMapper userMapper;

    @Override
    public List<BillQueryResult> queryByDateAndUid(YearMonth yearMonth) {
        Long uId = UserContext.getUserId();
//        YearMonth yearMonth = YearMonth.from(date);

        String start = yearMonth.atDay(1).format(DateTimeFormatter.ISO_LOCAL_DATE);
        String end = yearMonth.plusMonths(1).atDay(1).format(DateTimeFormatter.ISO_LOCAL_DATE);

        return billMapper.queryByDateAndUid(start, end, uId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void insert(InsertBillRequest bill) {
        Long uId = UserContext.getUserId();

        CategoryEntity categoryEntity = categoryMapper.findCategoryById(bill.getCategoryId());

        if (categoryEntity == null || (categoryEntity.getUId() != null && !categoryEntity.getUId().equals(uId))) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "分类不存在");
        }

        BillEntity billEntity = new BillEntity();

        billEntity.setType(bill.getType());
        billEntity.setCategoryId(bill.getCategoryId());
        billEntity.setPrice(bill.getPrice());
        billEntity.setDate(bill.getDate());
        String remark = bill.getRemark();
        billEntity.setRemark(remark == null ? "" : remark);

        int affected = billMapper.insert(billEntity);

        if (affected == 0) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "插入失败");
        }

        BillUserEntity billUserEntity = new BillUserEntity();

        billUserEntity.setBillId(billEntity.getId());
        billUserEntity.setUId(uId);

        int billUserAffected = billUserMapper.insert(billUserEntity);

        if (billUserAffected == 0) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "插入失败");
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(UpdateBillRequest bill) {
        Long uId = UserContext.getUserId();

        BillUserEntity billUserEntity = billUserMapper.findByBillIdAndUId(bill.getId(), uId);

        if (billUserEntity == null) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "未找到该账单");
        }

        CategoryEntity categoryEntity = categoryMapper.findCategoryById(bill.getCategoryId());

        if (categoryEntity == null) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "分类不存在");
        }

        UserCategoryEntity userCategoryEntity = userCategoryMapper.findByCategoryIdAndUid(categoryEntity.getId(), uId);

        if (userCategoryEntity == null) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "分类不存在");
        }

        BillEntity updateBillEntity = new BillEntity();
        updateBillEntity.setId(billUserEntity.getBillId());
        updateBillEntity.setType(bill.getType());
        updateBillEntity.setCategoryId(bill.getCategoryId());
        updateBillEntity.setPrice(bill.getPrice());
        updateBillEntity.setDate(bill.getDate());
        updateBillEntity.setRemark(bill.getRemark());

        int affect = billMapper.update(updateBillEntity);

        if (affect == 0) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "修改失败");
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Integer batchDelete(List<Long> delBillIds) {
        if (delBillIds == null || delBillIds.isEmpty()) {
            return 0;
        }
        Long uId = UserContext.getUserId();
        // 先查出BillUser
        List<BillUserEntity> delBillUserEntitys = billUserMapper.queryByBillIdsAndUId(delBillIds, uId);

        if (delBillUserEntitys.size() != delBillIds.size()) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "该项记账不存在");
        }

        int affects = billMapper.batchDelete(delBillIds);

        if (affects != delBillIds.size()) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "删除失败");
        }

        List<Long> delBillUserIds = delBillUserEntitys.stream().map(BillUserEntity::getId).toList();

        int affectsBillUser = billUserMapper.batchDeleteByIdsAndUId(delBillUserIds, uId);

        if (affectsBillUser != delBillUserEntitys.size()) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "删除失败");
        }

        return affectsBillUser;
    }

    @Override
    public List<BillQueryResult> queryByCategoryId(Long categoryId) {
        Long uId = UserContext.getUserId();

        return billMapper.queryByCategoryIdAndUid(categoryId, uId);

    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean transferCategoryId(Long categoryId, Long newCategoryId) {
        if (categoryId.equals(newCategoryId)) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "新旧分类不能相同");
        }
        Long uId = UserContext.getUserId();
        CategoryEntity oldCategoryEntity = categoryMapper.findCategoryById(categoryId);
        if (oldCategoryEntity == null || (oldCategoryEntity.getUId() != null && !oldCategoryEntity.getUId().equals(uId))) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "分类不存在");
        }

        CategoryEntity newCategoryEntity = categoryMapper.findCategoryById(newCategoryId);
        if (newCategoryEntity == null || (newCategoryEntity.getUId() != null && !newCategoryEntity.getUId().equals(uId))) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "分类不存在");
        }

        List<BillQueryResult> transferBillEntitys = billMapper.queryByCategoryIdAndUid(categoryId, uId);
        if (transferBillEntitys.isEmpty()) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "未查询到账单");
        }

        List<Long> transferBillIds = transferBillEntitys.stream().map(BillQueryResult::getId).toList();

        int affect = billMapper.batchUpdateCategoryId(transferBillIds, newCategoryId);

        if (affect != transferBillIds.size()) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "账单转移失败");
        }

        // 最后还得把category删除
        if (oldCategoryEntity.getUId() != null) {
            // 删自建分类
//            List<Long> delCategoryIdList = new ArrayList<Long>();
//            delCategoryIdList.add(categoryId);

            UserCategoryEntity delUserCategory = userCategoryMapper.findByCategoryIdAndUid(categoryId, uId);
            if (delUserCategory == null) {
                throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "该分类不存在");
            }
            List<Long> delUserCategoryIdList = new ArrayList<Long>();
            delUserCategoryIdList.add(delUserCategory.getId());

//            categoryMapper.batchDeleteCategory(delCategoryIdList, uId);
            userCategoryMapper.batchUpdateEnable(delUserCategoryIdList, CategoryEnableEnum.DISABLED, uId);
        } else {
            // 删默认分类
            UserCategoryEntity delUserCategory = userCategoryMapper.findByCategoryIdAndUid(categoryId, uId);
            if (delUserCategory == null) {
                throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "该分类不存在");
            }
            List<Long> disabledUserCategoryIds = new ArrayList<>();
            disabledUserCategoryIds.add(delUserCategory.getId());
            userCategoryMapper.batchUpdateEnable(disabledUserCategoryIds, CategoryEnableEnum.DISABLED, uId);
        }



        return affect != 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteBillAndCategory(Long categoryId){
        Long uId = UserContext.getUserId();
        CategoryEntity delCategoryEntity = categoryMapper.findCategoryById(categoryId);

        if (delCategoryEntity == null || (delCategoryEntity.getUId() != null && !delCategoryEntity.getUId().equals(uId))) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "该分类不存在");
        }

        List<BillQueryResult> delBillList = billMapper.queryByCategoryIdAndUid(categoryId, uId);



        UserCategoryEntity delUserCategoryEntity = userCategoryMapper.findByCategoryIdAndUid(categoryId, uId);

        if (delUserCategoryEntity == null) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "该分类不存在");
        }

        if (!delBillList.isEmpty()) {
            billMapper.batchDelete(delBillList.stream().map(BillQueryResult::getId).collect(Collectors.toList()));
        }

        userCategoryMapper.batchUpdateEnable(List.of(delUserCategoryEntity.getId()), CategoryEnableEnum.DISABLED,  uId);
    }

    @Override
    public Long getBillDay () {
        Long uId = UserContext.getUserId();
        UserEntity userEntity = userMapper.findByUId(uId);

        if (userEntity == null) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "该用户不存在");
        }

        LocalDateTime createTime = userEntity.getCreateTime();
        LocalDate createDate = createTime.toLocalDate();
        LocalDate today = LocalDate.now();

        return ChronoUnit.DAYS.between(createDate, today);
    }

    @Override
    public Long getBillCount() {
        Long uId = UserContext.getUserId();

        UserEntity userEntity = userMapper.findByUId(uId);

        if (userEntity == null) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "该用户不存在");
        }

        return billUserMapper.queryBillCount(uId);
    }
}
