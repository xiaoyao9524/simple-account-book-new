import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Segmented, Toast, Dialog, Button } from 'antd-mobile';
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useStore } from '@/store/useStore';
import type {
  CategoryItem as ICategoryItemProps,
  CategoryItemWithSortIndex,
} from '@/types/category';
import {
  getAllCategoryList,
  updateCategory,
  checkBillByCategoryId,
  deleteCategory,
  addCategoryToCurrent,
} from '@/api/category';
import NavBar from '@/components/NavBar/NavBar';
import SortableCategoryItem from './components/SortableCategoryItem';
import './style.scss';

type Tab = '支出' | '收入';

export default function CategorySetting() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { tab?: Tab } | null;

  const expenditureIcons = useStore((s) => s.userInfo.category.expenditureList);
  const incomeIcons = useStore((s) => s.userInfo.category.incomeList);
  const setUserCategory = useStore((s) => s.setUserCategory);
  const updateUserCategory = useStore((s) => s.updateUserCategory);
  const deleteUserCategory = useStore((s) => s.deleteUserCategory);

  const [tab, setTab] = useState<Tab>('支出');
  const [currentExpenditureList, setCurrentExpenditureList] = useState(
    [...expenditureIcons]
  );
  const [currentIncomeList, setCurrentIncomeList] = useState([...incomeIcons]);
  const [allExpenditureCategoryList, setAllExpenditureCategoryList] = useState<
    ICategoryItemProps[]
  >([]);
  const [allIncomeCategoryList, setAllIncomeCategoryList] = useState<
    ICategoryItemProps[]
  >([]);

  useEffect(() => {
    setCurrentExpenditureList([...expenditureIcons]);
  }, [expenditureIcons]);

  useEffect(() => {
    setCurrentIncomeList([...incomeIcons]);
  }, [incomeIcons]);

  useEffect(() => {
    if (state?.tab) {
      setTab(state.tab);
    }
  }, [state]);

  const currentCategory = useMemo(() => {
    const isExpenditure = tab === '支出';
    const currentList = isExpenditure ? currentExpenditureList : currentIncomeList;
    const allList = isExpenditure ? allExpenditureCategoryList : allIncomeCategoryList;
    const currentIds = currentList.map((item) => item.id);
    return {
      selectedCategory: [...currentList].sort((a, b) => a.sortIndex - b.sortIndex),
      noSelectedCategory: allList.filter((item) => !currentIds.includes(item.id)),
    };
  }, [
    tab,
    currentExpenditureList,
    currentIncomeList,
    allExpenditureCategoryList,
    allIncomeCategoryList,
  ]);

  const saveCurrentCategorySort = useCallback(
    async (newCategory: {
      expenditureList: CategoryItemWithSortIndex[];
      incomeList: CategoryItemWithSortIndex[];
    }) => {
      const params = {
        expenditureList: newCategory.expenditureList.map((i) => i.id),
        incomeList: newCategory.incomeList.map((i) => i.id),
      };
      try {
        const res = await updateCategory(params);
        if (res.status === 200) {
          setUserCategory(res.data);
        } else {
          Toast.show({ content: res.message, icon: 'fail' });
        }
      } catch (err) {
        Toast.show({ content: (err as Error).message, icon: 'fail' });
      }
    },
    [setUserCategory]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const isExpenditure = tab === '支出';
      const oldList = isExpenditure ? currentExpenditureList : currentIncomeList;
      const oldIndex = oldList.findIndex((i) => i.id === active.id);
      const newIndex = oldList.findIndex((i) => i.id === over.id);
      const newItems = arrayMove(oldList, oldIndex, newIndex);
      newItems.forEach((item, index) => {
        item.sortIndex = index;
      });
      if (isExpenditure) {
        setCurrentExpenditureList(newItems);
      } else {
        setCurrentIncomeList(newItems);
      }
      const newCategory = {
        expenditureList: isExpenditure ? newItems : currentExpenditureList,
        incomeList: isExpenditure ? currentIncomeList : newItems,
      };
      saveCurrentCategorySort(newCategory);
    },
    [tab, currentExpenditureList, currentIncomeList, saveCurrentCategorySort]
  );

  const fetchAllCategoryList = useCallback(async () => {
    try {
      const res = await getAllCategoryList();
      if (res.status === 200) {
        setAllExpenditureCategoryList(res.data.expenditureList);
        setAllIncomeCategoryList(res.data.incomeList);
      } else {
        Toast.show({ content: res.message, icon: 'fail' });
      }
    } catch (err) {
      Toast.show({ content: (err as Error).message, icon: 'fail' });
    }
  }, []);

  useEffect(() => {
    fetchAllCategoryList();
  }, [fetchAllCategoryList]);

  const handlerAdd = useCallback(
    async (category: ICategoryItemProps) => {
      try {
        const res = await addCategoryToCurrent({ categoryId: category.id });
        if (res.status === 200 && res.data) {
          await updateUserCategory();
        } else {
          Toast.show({ content: res.message, icon: 'fail' });
        }
      } catch (err) {
        Toast.show({ content: (err as Error).message, icon: 'fail' });
      }
    },
    [updateUserCategory]
  );

  const toDelBillPage = useCallback(
    (category: CategoryItemWithSortIndex) => {
      Dialog.confirm({
        title: '警告',
        content: '删除类别会同时删除该类别下所有记账信息',
        onConfirm: () => {
          navigate(`/deleteCategoryAndBill?categoryId=${category.id}`);
        },
      });
    },
    [navigate]
  );

  const fetchDeleteCategoryItem = useCallback(
    async (category: CategoryItemWithSortIndex) => {
      try {
        const res = await deleteCategory({ id: category.id });
        if (res.status === 200) {
          await updateUserCategory();
          fetchAllCategoryList();
        } else {
          Toast.show({ content: res.message, icon: 'fail' });
        }
      } catch (err) {
        Toast.show({ content: (err as Error).message, icon: 'fail' });
      }
    },
    [updateUserCategory, fetchAllCategoryList]
  );

  const handlerDelCategoryClick = useCallback(
    async (category: CategoryItemWithSortIndex) => {
      try {
        const res = await checkBillByCategoryId(category.id);
        if (res.status === 200) {
          if (res.data.existBill) {
            toDelBillPage(category);
          } else {
            fetchDeleteCategoryItem(category);
          }
        } else {
          Toast.show({ content: res.message, icon: 'fail' });
        }
      } catch (err) {
        Toast.show({ content: (err as Error).message, icon: 'fail' });
      }
    },
    [toDelBillPage, fetchDeleteCategoryItem]
  );

  const showAlert = (item: ICategoryItemProps) => {
    Dialog.confirm({
      title: '删除',
      content: `确认删除"${item.title}"吗？`,
      confirmText: '确认',
      onConfirm: async () => {
        try {
          const res = await deleteCategory({ id: item.id });
          if (res.status === 200) {
            Toast.show({ content: res.message, icon: 'success' });
            deleteUserCategory(item);
            fetchAllCategoryList();
          } else {
            Toast.show({ content: res.message, icon: 'fail' });
          }
        } catch (err) {
          Toast.show({ content: (err as Error).message, icon: 'fail' });
        }
      },
    });
  };

  return (
    <div className="category-setting">
      <NavBar style={{ position: 'fixed', top: 0, zIndex: 5, width: '100%' }}>
        类别设置
      </NavBar>

      <div className="tabs">
        <Segmented
          value={tab}
          onChange={(val) => setTab(val as Tab)}
          options={[
            { label: '支出', value: '支出' },
            { label: '收入', value: '收入' },
          ]}
        />
      </div>

      <div className="category-list-wrapper">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={currentCategory.selectedCategory.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="current-category-list">
              {currentCategory.selectedCategory.map((item) => (
                <SortableCategoryItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  icon={item.icon}
                  categoryType={item.categoryType}
                  isDefault={item.isDefault}
                  onDelete={() => handlerDelCategoryClick(item)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>

      {currentCategory.noSelectedCategory.length > 0 && (
        <div className="category-list-wrapper">
          <h3 className="more-title">更多类别</h3>
          <ul className="more-category-list">
            {currentCategory.noSelectedCategory.map((item) => (
              <li className="category-item" key={item.id}>
                <div
                  className="operation-icon-wrapper"
                  onClick={() => handlerAdd(item)}
                >
                  <span className="icon iconfont-base icon-add" />
                </div>
                <div className="category-icon-wrapper">
                  <span className={`icon iconfont icon-${item.icon}`} />
                </div>
                <p className="category-title">{item.title}</p>
                <div className="del-btn-wrapper">
                  {item.isDefault === 1 ? null : (
                    <Button
                      color="warning"
                      size="small"
                      onClick={() => showAlert(item)}
                    >
                      删除
                    </Button>
                  )}
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
          onClick={() => navigate('/insertCategory', { state: { type: tab } })}
        >
          新增
        </Button>
      </div>
    </div>
  );
}
