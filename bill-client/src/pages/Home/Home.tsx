import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import dayjs, { type Dayjs } from 'dayjs';
import { Toast, DatePicker, Dialog, SwipeAction, List, NoticeBar } from 'antd-mobile';
import useSystemStore from '@/store/useSystemStore';
import useUserStore from '@/store/useUserStore';
import { getBillListByDate, batchDeleteBill } from '@/api/bill';
import type { BillItem } from '@/types/bill';
import TabBar from '@/components/TabBar/TabBar';
import NoLogin from '@/components/NoLogin/NoLogin';
import './style.scss';
import { CategoryTypeEnum } from '@/enums/categoryEnum';

interface BillListItem {
  date: string;
  totalPrice: number;
  list: BillItem[];
}

export default function Home() {
  const navigate = useNavigate();
  const isMobile = useSystemStore(s => s.isMobile);
  const userInfo = useUserStore(state => state.userInfo);

  const [date, setDate] = useState<Dayjs>(dayjs());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [list, setList] = useState<BillItem[]>([]);
  const [year, month] = useMemo(() => {
    return date.format('YYYY-MM').split('-');
  }, [date])

  const renderList = useMemo<BillListItem[]>(() => {
    const map: Record<string, BillListItem> = {};

    for (const item of list) {
      const { date } = item;

      const parent = map[date];

      if (parent) {
        if (item.category.type === CategoryTypeEnum.INCOME) {
          parent.totalPrice += Number(item.price);
        } else {
          parent.totalPrice -= Number(item.price);
        }
        map[date].list.push(item);
      } else {
        const newParent: BillListItem = {
          date,
          totalPrice: Number(item.price),
          list: [item]
        }

        map[date] = newParent;
      }
    }

    return Object.values(map);
  }, [list])

  const { totalIncome, totalExpand } = useMemo(() => {
    let totalIncome = 0;
    let totalExpand = 0;

    for (const item of list) {
      if (item.category.type === CategoryTypeEnum.INCOME) {
        totalIncome += item.price;
      } else {
        totalExpand += item.price;
      }
    }

    return {
      totalIncome: (totalIncome + '').includes('.') ? totalIncome.toFixed(2) : totalIncome + '',
      totalExpand: (totalExpand + '').includes('.') ? totalExpand.toFixed(2) : totalExpand + ''
    }
  }, [list])


  const getBillList = useCallback(async () => {
    try {
      const res = await getBillListByDate({ date: `${year}-${month}` });

      if (res) {
        setList(res.data);
      }
    } catch (err) {
      Toast.show({ content: (err as Error).message, icon: 'fail' });
    }
  }, [month, year])

  useEffect(() => {
    void Promise.resolve().then(getBillList);
  }, [getBillList]);

  function handlerEdit(item: BillItem) {
    navigate('/bookkeeping', { state: item });
  }

  const handlerDelete = useCallback(async (item: BillItem) => {
    const res = await batchDeleteBill([item.id]);

    if (res) {
      Toast.show({ content: res.message, icon: 'success' });
      getBillList();
    }

  }, [getBillList])

  const confirmDelete = useCallback(async (item: BillItem) => {
    const confirmed = await Dialog.confirm({
      title: '删除',
      content: '你确定要删除该项吗？',

    });
    if (confirmed) {
      handlerDelete(item);
    }
  }, [handlerDelete])

  return (
    <div className="home">
      {userInfo.username === '' ? (
        <NoLogin />
      ) : (
        <>
          <div className="home-container">
            {!isMobile && (
              <NoticeBar content="请使用移动模式/设备打开此页以获得更好的体验。" />
            )}
            <header className="head-container">
              <ul className="header-list">
                <li
                  className="header-item date-item"
                  onClick={() => setDatePickerVisible(true)}
                >
                  <p className="title">{year}年</p>
                  <p className="value">
                    {month}月
                    <span className="icon iconfont-base icon-down" />
                  </p>
                </li>
                <li className="header-item">
                  <p className="title">收入</p>
                  <p className="value">{totalIncome}</p>
                </li>
                <li className="header-item">
                  <p className="title">支出</p>
                  <p className="value">{totalExpand}</p>
                </li>
              </ul>
            </header>

            <div className="book-list-wrapper">
              {renderList.map((billItem) => (
                <List key={billItem.date} header={
                  <div className="bill-item-header">
                    <p className="date">{billItem.date}</p>
                    <p className={`price-total ${Number(billItem.totalPrice) < 0 ? 'minus' : ''}`}>
                      {billItem.totalPrice}
                    </p>
                  </div>
                }>
                  {billItem.list.map((item) => (
                    <SwipeAction
                      key={item.id}
                      rightActions={[
                        { key: 'edit', text: '编辑', color: 'primary' },
                        { key: 'delete', text: '删除', color: 'danger' },
                      ]}
                      onAction={(action) => {
                        if (action.key === 'edit') handlerEdit(item);
                        if (action.key === 'delete') confirmDelete(item);
                      }}
                    >
                      <List.Item
                        className={'bill-item'}
                        extra={<span className={`extra ${item.type === CategoryTypeEnum.INCOME ? '' : 'minus'}`}>{`${item.category.type === CategoryTypeEnum.EXPEND ? '-' : ''}${item.price}`}</span>}
                      >
                        <span className={`icon iconfont icon-${item.category.icon}`} />
                        <span className={'title'}>{item.remark || item.category.title}</span>
                      </List.Item>
                    </SwipeAction>
                  ))}
                </List>
              ))}
            </div>

            <DatePicker
              visible={datePickerVisible}
              value={date.toDate()}
              precision="month"
              onConfirm={(d) => {
                setDate(dayjs(d));
                setDatePickerVisible(false);
              }}
              onClose={() => setDatePickerVisible(false)}
            />
          </div>
        </>
      )}
      <TabBar />
    </div>
  );
}
