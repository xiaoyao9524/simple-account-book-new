import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { List, Button, Dialog, Toast, Modal } from 'antd-mobile';
// import { useStore } from '@/store/useStore';
import useCategoryStore from '@/store/useCategoryStore';
import { getBillByCategoryId, transferCategory } from '@/api/bill';
import useQuery from '@/hooks/useQuery';
import type { BillItem } from '@/types/bill';
import './style.scss';
import { CategoryTypeEnum, type CategoryType } from '@/enums/categoryEnum';

import NavBar from '@/components/NavBar/NavBar';
import CategorySelect, { type CategorySelectRef } from '@/components/CategorySelect';
import type { CategoryVO } from '@/types/category';

export interface LocationType {
  mode: 'transfer' | 'deleted',
  type: CategoryType,
  categoryId: number
}

const DeleteCategoryAndBill = () => {
  const query = useQuery<{ categoryId?: string, type?: string }>();
  const location = useLocation();
  const state = location.state as LocationType;
  const categorySelectInstance = useRef<CategorySelectRef>(null);
  const type = useMemo(() => {
    if (state.type === CategoryTypeEnum.EXPEND) {
      return CategoryTypeEnum.EXPEND
    }

    return CategoryTypeEnum.INCOME
  }, [state.type])
  const navigate = useNavigate();
  const updateUserCategory = useCategoryStore(s => s.updateList);

  const [list, setList] = useState<BillItem[]>([]);

  useEffect(() => {
    if (!state) {
      navigate(-1);
    }
  }, [state, navigate])

  const fetchBillList = useCallback(async () => {
    if (!state || !state.categoryId) {
      return;
    }
    const res = await getBillByCategoryId({
      categoryId: state.categoryId,
    });
    if (res) {
      setList(res.data);
    }
  }, [state]);

  useEffect(() => {
    Promise.resolve()
      .then(fetchBillList);

  }, [fetchBillList]);

  const renderList = useMemo(() => {
    const obj: Record<string, BillItem[]> = {};
    for (const item of list) {
      if (obj[item.date]) {
        obj[item.date].push(item);
      } else {
        obj[item.date] = [item];
      }
    }
    return Object.keys(obj)
      .map((key) => ({ date: key, list: obj[key] }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [list]);

  const handlerDelete = useCallback(
    async (categoryId: number) => {
      // try {
      //   const res = await deleteCategoryAndBill(categoryId);
      //   if (res.status === 200 && res.data) {
      //     await updateUserCategory();
      //     navigate(-1);
      //   } else {
      //     Toast.show({ content: res.message, icon: 'fail' });
      //   }
      // } catch (err) {
      //   Toast.show({ content: (err as Error).message, icon: 'fail' });
      // }
    },
    [updateUserCategory, navigate]
  );

  const showAlert = useCallback(() => {
    Dialog.confirm({
      title: '警告',
      content: '确定要删除该分类以及该分类下全部记账信息吗？',
      onConfirm: () => handlerDelete(Number(query.categoryId)),
    });
  }, [handlerDelete, query.categoryId]);

  const handlerTransferConfirm = useCallback(async (category: CategoryVO) => {
    if (category.id === state.categoryId) {
      Toast.show({
        content: '不能选择当前分类',
        icon: 'fail'
      })
      return
    }
    const result = await Dialog.confirm({
      content: `确认要转移该类别下所有的账单吗?`
    })

    if (result) {
      const param = {
        categoryId: state.categoryId,
        newCategoryId: category.id
      }

      const res = await transferCategory(param)

      if (res) {
        Toast.show({
          content: '转移成功'
        })
        updateUserCategory();
        navigate(-1);
      }
    }
  }, [state.categoryId, updateUserCategory, navigate])

  useEffect(() => {
    // if (!query.categoryId) {
    //   navigate(-1);
    // }
  }, [query.categoryId, navigate]);

  return (
    <div className="delete-category-and-bill">
      <NavBar style={{ position: 'fixed', top: 0, zIndex: 5, width: '100%' }}>
        类别设置
      </NavBar>
      <div className="book-list-wrapper">
        {renderList.map((billItem) => (
          <List
            key={billItem.date}
            header={
              <div className="bill-item-header">
                <p className="date">{billItem.date}</p>
                <p className="price-total">
                  {billItem.list
                    .map((i) => (i.type === CategoryTypeEnum.INCOME ? i.price : -i.price))
                    .reduce((total, num) => total + num)}
                </p>
              </div>
            }
          >
            {billItem.list.map((item) => (
              <List.Item
                key={item.id}
                extra={`${item.type === CategoryTypeEnum.EXPEND ? '-' : ''}${item.price}`}
              >
                {item.remark || item.category.title}
              </List.Item>
            ))}
          </List>
        ))}
        <div className="btn-wrapper">
          {state.mode === 'transfer' ? <Button color="warning" block onClick={() => {

            categorySelectInstance.current?.open();
          }}>
            确认转移
          </Button> : <Button color="warning" block onClick={showAlert}>
            删除全部
          </Button>}
        </div>
      </div>
      <CategorySelect ref={categorySelectInstance} disabledIds={[state.categoryId]} type={type} onConfirm={handlerTransferConfirm} />
    </div>
  );
}

export default DeleteCategoryAndBill;
