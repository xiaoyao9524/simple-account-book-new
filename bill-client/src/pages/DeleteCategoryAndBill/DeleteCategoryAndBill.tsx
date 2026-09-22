import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Button, Dialog, Toast } from 'antd-mobile';
import { useStore } from '@/store/useStore';
import { getBillListByCategoryId, deleteCategoryAndBill } from '@/api/category';
import { useQuery } from '@/hooks/useQuery';
import type { BillItem } from '@/types/bill';
import './style.scss';

export default function DeleteCategoryAndBill() {
  const query = useQuery() as { categoryId?: string };
  const navigate = useNavigate();
  const updateUserCategory = useStore((s) => s.updateUserCategory);

  const [list, setList] = useState<BillItem[]>([]);

  const fetchBillList = useCallback(async () => {
    if (!query.categoryId) return;
    try {
      const res = await getBillListByCategoryId({
        categoryId: Number(query.categoryId),
      });
      if (res.status === 200) {
        setList(res.data.billList);
      } else {
        Toast.show({ content: res.message, icon: 'fail' });
      }
    } catch (err) {
      Toast.show({ content: (err as Error).message, icon: 'fail' });
    }
  }, [query.categoryId]);

  useEffect(() => {
    fetchBillList();
  }, [fetchBillList]);

  const renderList = useMemo(() => {
    const obj: Record<string, BillItem[]> = {};
    for (const item of list) {
      if (obj[item.billTime]) {
        obj[item.billTime].push(item);
      } else {
        obj[item.billTime] = [item];
      }
    }
    return Object.keys(obj)
      .map((key) => ({ date: key, list: obj[key] }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [list]);

  const handlerDelete = useCallback(
    async (categoryId: number) => {
      try {
        const res = await deleteCategoryAndBill(categoryId);
        if (res.status === 200 && res.data) {
          await updateUserCategory();
          navigate(-1);
        } else {
          Toast.show({ content: res.message, icon: 'fail' });
        }
      } catch (err) {
        Toast.show({ content: (err as Error).message, icon: 'fail' });
      }
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

  useEffect(() => {
    if (!query.categoryId) {
      navigate(-1);
    }
  }, [query.categoryId, navigate]);

  return (
    <div className="delete-category-and-bill">
      <div className="book-list-wrapper">
        {renderList.map((billItem) => (
          <List
            key={billItem.date}
            header={
              <div className="bill-item-header">
                <p className="date">{billItem.date}</p>
                <p className="price-total">
                  {billItem.list
                    .map((i) => (i.categoryType === 0 ? i.price : -i.price))
                    .reduce((total, num) => total + num)}
                </p>
              </div>
            }
          >
            {billItem.list.map((item) => (
              <List.Item
                key={item.id}
                extra={`${item.categoryType === 1 ? '-' : ''}${item.price}`}
              >
                {item.remark || item.category.title}
              </List.Item>
            ))}
          </List>
        ))}
        <div className="btn-wrapper">
          <Button color="warning" onClick={showAlert}>
            删除全部
          </Button>
        </div>
      </div>
    </div>
  );
}
