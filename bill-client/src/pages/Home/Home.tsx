import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs, { type Dayjs } from 'dayjs';
import { Toast, DatePicker, Dialog, SwipeAction, List, NoticeBar } from 'antd-mobile';
import { useStore } from '@/store/useStore';
import { getBillListByDate, deleteBill } from '@/api/bill';
import type { BillItem } from '@/types/bill';
import TabBar from '@/components/TabBar/TabBar';
import NoLogin from '@/components/NoLogin/NoLogin';
import './style.scss';

interface BillListItem {
  date: string;
  totalPrice: string;
  list: BillItem[];
}

function handlerList(list: BillItem[]): BillListItem[] {
  const obj: Record<string, BillItem[]> = {};
  for (const item of list) {
    if (obj[item.billTime]) {
      obj[item.billTime].push(item);
    } else {
      obj[item.billTime] = [item];
    }
  }
  return Object.keys(obj)
    .map((key) => ({
      date: key,
      totalPrice: obj[key]
        .map((i) => (i.categoryType === 0 ? i.price : -i.price))
        .reduce((total, num) => total + num)
        .toFixed(2),
      list: obj[key],
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export default function Home() {
  const navigate = useNavigate();
  const isMobile = useStore((s) => s.system.isMobile);
  const userInfo = useStore((s) => s.userInfo);

  const [date, setDate] = useState<Dayjs>(dayjs());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [incomePrice, setIncomePrice] = useState(0);
  const [expenditurePrice, setExpenditurePrice] = useState(0);
  const [list, setList] = useState<BillListItem[]>([]);
  const [year, month] = date.format('YYYY-MM').split('-');

  useEffect(() => {
    getBillList();
  }, [year, month]);

  async function getBillList() {
    try {
      const res = await getBillListByDate({ date: `${year}-${month}` });
      if (res.status === 200) {
        let income = 0;
        let expenditure = 0;
        for (const item of res.data.list) {
          if (item.categoryType === 0) {
            income += item.price;
          } else {
            expenditure += item.price;
          }
        }
        setIncomePrice(income);
        setExpenditurePrice(expenditure);
        setList(handlerList(res.data.list));
      } else {
        Toast.show({ content: res.message, icon: 'fail' });
      }
    } catch (err) {
      Toast.show({ content: (err as Error).message, icon: 'fail' });
    }
  }

  function handlerEdit(item: BillItem) {
    navigate('/bookkeeping', { state: item });
  }

  async function handlerDelete(item: BillItem) {
    try {
      const res = await deleteBill({ id: item.id });
      if (res.status === 200) {
        Toast.show({ content: '删除成功', icon: 'success' });
        getBillList();
      } else {
        Toast.show({ content: res.message, icon: 'fail' });
      }
    } catch (err) {
      Toast.show({ content: (err as Error).message, icon: 'fail' });
    }
  }

  async function confirmDelete(item: BillItem) {
    const confirmed = await Dialog.confirm({
      title: '删除',
      content: '你确定要删除该项吗？',
    });
    if (confirmed) {
      handlerDelete(item);
    }
  }

  return (
    <div className="home">
      {userInfo.username === '' ? (
        <NoLogin />
      ) : (
        <div>
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
                <p className="value">{incomePrice.toFixed(2)}</p>
              </li>
              <li className="header-item">
                <p className="title">支出</p>
                <p className="value">{expenditurePrice.toFixed(2)}</p>
              </li>
            </ul>
          </header>

          <div className="book-list-wrapper">
            {list.map((billItem) => (
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
                      extra={`${item.categoryType === 1 ? '-' : ''}${item.price}`}
                    >
                      {item.remark || item.category.title}
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
      )}
      <TabBar />
    </div>
  );
}
