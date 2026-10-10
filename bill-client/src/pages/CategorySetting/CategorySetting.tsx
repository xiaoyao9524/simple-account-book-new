import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Segmented, Toast, Button } from 'antd-mobile';

import { DragDropProvider, type DragEndEvent } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';

import useCategoryStore from '@/store/useCategoryStore'

import { CategoryTypeEnum, type CategoryType, CategoryEnableEnum, checkIsCategoryType } from '@/enums/categoryEnum'
import type {
  CategoryVO
} from '@/types/category';
import { batchUpdateCategory } from '@/api/category'

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
  const incomeCategorys = useCategoryStore(state => state.incomeList);
  const expendCategorys = useCategoryStore(state => state.expendList);
  const updateCategory = useCategoryStore((s) => s.updateList);

  const { enableIncomeCategorys, disableIncomeCategorys, enableExpendCategorys, disableExpendCategorys } = useMemo(() => {
    const enableIncomeCategorys: CategoryVO[] = [];
    const disableIncomeCategorys: CategoryVO[] = [];
    for (const item of incomeCategorys) {
      if (item.enable === CategoryEnableEnum.ENABLE) {
        enableIncomeCategorys.push(item);
      } else {
        disableIncomeCategorys.push(item);
      }
    }
    enableIncomeCategorys.sort((a, b) => a.sort - b.sort);
    const enableExpendCategorys: CategoryVO[] = [];
    const disableExpendCategorys: CategoryVO[] = [];

    for (const item of expendCategorys) {
      if (item.enable) {
        enableExpendCategorys.push(item);
      } else {
        disableExpendCategorys.push(item);
      }
    }

    enableExpendCategorys.sort((a, b) => a.sort - b.sort);

    return {
      enableIncomeCategorys,
      disableIncomeCategorys,
      enableExpendCategorys,
      disableExpendCategorys
    }
  }, [incomeCategorys, expendCategorys]);

  const test = useCallback(() => {
    console.log('enableIncomeCategorys', enableIncomeCategorys);
    console.log('disableIncomeCategorys', disableIncomeCategorys);
    console.log('enableExpendCategorys', enableExpendCategorys);
    console.log('disableExpendCategorys', disableExpendCategorys);
  }, [enableIncomeCategorys, disableIncomeCategorys, enableExpendCategorys, disableExpendCategorys]);

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

      <button style={{ position: 'fixed', top: 0, right: 0, zIndex: 10 }} onClick={test}>测试</button>

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
                id={item.id}
                index={index}
                title={item.title}
                icon={item.icon}
                type={item.type}
                onDelete={() => {/*handlerDelCategoryClick(item)*/ }}
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
                  onClick={() => {/*handlerAdd(item)*/ }}
                >
                  <span className="icon iconfont-base icon-add" />
                </div>
                <div className="category-icon-wrapper">
                  <span className={`icon iconfont icon-${item.icon}`} />
                </div>
                <p className="category-title">{item.title}</p>
                <div className="del-btn-wrapper">
                  <Button
                    color="warning"
                    size="small"
                    onClick={() => {/*showAlert(item)*/ }}
                  >
                    删除
                  </Button>
                </div>
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
