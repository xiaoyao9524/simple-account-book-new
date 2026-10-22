import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Segmented, Toast, Button, Dialog } from 'antd-mobile';

import { DragDropProvider, type DragEndEvent } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';

import useCategoryList from '@/hooks/useCategoryList'

import { CategoryTypeEnum, type CategoryType, CategoryEnableEnum, checkIsCategoryType } from '@/enums/categoryEnum'
import type {
  CategoryVO
} from '@/types/category';
import { batchUpdateCategory, batchDeleteCategory } from '@/api/category'

import NavBar from '@/components/NavBar/NavBar';
import SortableCategoryItem from './components/SortableCategoryItem';
import './style.scss';

export default function CategorySetting() {
  const navigate = useNavigate();
  const location = useLocation();
  const [type, setType] = useState<CategoryType>(() => {
    const localType = location.state?.type;

    if (!localType) {
      return CategoryTypeEnum.EXPEND;
    }

    const type = Number(localType) as CategoryType;

    if (!checkIsCategoryType(type)) {
      return CategoryTypeEnum.EXPEND;
    }

    return type;
  });

  const {
    enableIncomeCategorys,
    disableIncomeCategorys,
    enableExpendCategorys,
    disableExpendCategorys,
    updateCategory
  } = useCategoryList();
  const currentCategoryList = useMemo<CategoryVO[]>(() => {
    const list = type === CategoryTypeEnum.INCOME ? enableIncomeCategorys : enableExpendCategorys;

    return list.filter(i => i.enable === CategoryEnableEnum.ENABLE);
  }, [type, enableIncomeCategorys, enableExpendCategorys]);

  const currentNoSelectCategoryList = useMemo<CategoryVO[]>(() => {
    const list = type === CategoryTypeEnum.INCOME ? disableIncomeCategorys : disableExpendCategorys;
    return list.filter(i => i.enable === CategoryEnableEnum.DISABLE);
  }, [type, disableExpendCategorys, disableIncomeCategorys]);

  const handlerUpdateCategory = useCallback(async (newCategorys: CategoryVO[]) => {
    const res = await batchUpdateCategory(newCategorys);
    if (res) {
      Toast.show({ content: '保存成功', icon: 'success' });
      updateCategory();
    }
  }, [updateCategory])

  const handlerEnableCategory = useCallback(async (item: CategoryVO) => {
    const maxSort = Math.max(...currentCategoryList.map(i => i.sort));
    const res = await batchUpdateCategory([
      {
        ...item,
        enable: CategoryEnableEnum.ENABLE,
        sort: maxSort + 1
      }
    ])

    if (res) {
      Toast.show({ content: '保存成功', icon: 'success' });
      updateCategory();
    }
  }, [currentCategoryList, updateCategory]);

  const handlerDisableCategory = useCallback(async (item: CategoryVO) => {
    const res = await batchUpdateCategory([
      {
        ...item,
        enable: CategoryEnableEnum.DISABLE
      }
    ])

    if (res) {
      Toast.show({ content: '保存成功', icon: 'success' });
      updateCategory();
    }
  }, [updateCategory])

  const handlerConfirmDel = useCallback(async (item: CategoryVO) => {
    const res = await batchDeleteCategory([item.id]);

    if (res) {
      Toast.show({
        content: "删除成功",
        icon: 'success'
      })
      updateCategory();
    }
  }, [updateCategory])

  const handlerDelDialog = useCallback(async (item: CategoryVO) => {
    const dialog = Dialog.show({
      content: '确定删除该类别吗？',
      closeOnAction: true,
      actions: [
        [
          {
            key: 'cancel',
            text: '取消',
            style: {
              background:' var(--background-color)',
              boxShadow: 'none'
            },
            onClick: () => {
              dialog.close();
            }
          },
          {
            key: 'delete',
            text: '删除',
            bold: true,
            danger: true,
            onClick: () => {
              handlerConfirmDel(item);
            }
          }
        ]
      ]
    })
  }, [handlerConfirmDel]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    if (event.canceled) return;
    const { source } = event.operation;

    if (isSortable(source)) {
      const { initialIndex, index } = source;
      if (initialIndex !== index) {
        const newItems = [...currentCategoryList];
        const [moveItem] = newItems.splice(initialIndex, 1);
        newItems.splice(index, 0, moveItem);

        newItems.forEach((item, idx) => {
          item.sort = idx;
        });
        handlerUpdateCategory(newItems);
      }
    }
  }, [currentCategoryList, handlerUpdateCategory]);

  return (
    <div className="category-setting">
      <NavBar style={{ position: 'fixed', top: 0, zIndex: 5, width: '100%' }}>
        类别设置
      </NavBar>

      <div className="tabs">
        <Segmented
          value={type}
          onChange={(val) => {
            setType(val as CategoryType);
          }}
          options={[
            { label: '支出', value: CategoryTypeEnum.EXPEND },
            { label: '收入', value: CategoryTypeEnum.INCOME },
          ]}
        />
      </div>

      <div className="category-list-wrapper">
        <DragDropProvider
          onDragEnd={handleDragEnd}
        >
          <ul className="current-category-list">
            {currentCategoryList.map((item, index) => (
              <SortableCategoryItem
                key={item.id}
                {...item}
                index={index}
                onDelete={handlerDisableCategory}
              />
            ))}
          </ul>
        </DragDropProvider>
      </div>

      {currentNoSelectCategoryList.length > 0 && (
        <div className="category-list-wrapper">
          <h3 className="more-title">更多类别</h3>
          <ul className="more-category-list">
            {currentNoSelectCategoryList.map((item) => (
              <li className="category-item" key={item.id}>
                <div
                  className="operation-icon-wrapper"
                  onClick={() => { handlerEnableCategory(item) }}
                >
                  <span className="icon iconfont-base icon-add" />
                </div>
                <div className="category-icon-wrapper">
                  <span className={`icon iconfont icon-${item.icon}`} />
                </div>
                <p className="category-title">{item.title} {item.uId !== null && <span className="category-user-icon" style={{ color: '#ccc' }}>(自定义)</span>}</p>
                {
                  item.uId !== null && (
                    <div className="del-btn-wrapper">
                      <Button
                        color="warning"
                        size="small"
                        onClick={() => { handlerDelDialog(item) }}
                      >
                        删除
                      </Button>
                    </div>
                  )
                }
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="add-category-btn-wrapper">
        <Button
          block
          color="primary"
          onClick={() => navigate(`/insertCategory`, { state: { type } })}
        >
          新增
        </Button>
      </div>
    </div>
  );
}
