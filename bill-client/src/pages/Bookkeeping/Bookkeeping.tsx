import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Segmented, Toast } from 'antd-mobile';
import { useStore } from '@/store/useStore';
import NavBar from '@/components/NavBar/NavBar';
import NoLogin from '@/components/NoLogin/NoLogin';
import Calculator, { type CalculatorOnConfirmResult, type CalculatorRefProps } from '@/components/Calculator/Calculator';
import type { CategoryItem } from '@/types/category';
import type { InsertBillProps, UpdateBillProps, BillItem } from '@/types/bill';
import { insertBill, updateBill } from '@/api/bill';
import './style.scss';

type Tab = '支出' | '收入';

const tabEnum: Record<Tab, number> = { '收入': 0, '支出': 1 };

export default function Bookkeeping() {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useStore((s) => s.userInfo);
  const expenditureIcons = useStore((s) => s.userInfo.category.expenditureList);
  const incomeIcons = useStore((s) => s.userInfo.category.incomeList);

  const currentId = useRef<number | null>(null);
  const [tab, setTab] = useState<Tab>('支出');
  const calculatorInstance = useRef<CalculatorRefProps>(null);
  const [category, setCategory] = useState<CategoryItem | undefined>(undefined);

  const currentIcons = useMemo(
    () => (tab === '收入' ? incomeIcons : expenditureIcons),
    [tab, incomeIcons, expenditureIcons]
  );

  useEffect(() => {
    const editData = location.state as BillItem | null;
    if (editData) {
      setData(editData);
    }
  }, [location.state]);

  useEffect(() => {
    if (!category && currentIcons.length > 0) {
      setCategory(currentIcons[0]);
    }
  }, [currentIcons, category]);

  function handlerConfirm(calculatorResult: CalculatorOnConfirmResult) {
    const { price, date, remark } = calculatorResult;
    const billDetail = {
      categoryType: tabEnum[tab],
      categoryId: category!.id,
      price,
      billTime: date,
      remark,
    };
    if (currentId.current) {
      _updateBill({ ...billDetail, id: currentId.current });
    } else {
      _insertBill(billDetail);
    }
  }

  async function _insertBill(insertBillData: InsertBillProps) {
    try {
      const res = await insertBill(insertBillData);
      if (res.status === 200) {
        navigate(-1);
      } else {
        Toast.show({ content: res.message, icon: 'fail' });
      }
    } catch (err) {
      Toast.show({ content: (err as Error).message, icon: 'fail' });
    }
  }

  async function _updateBill(billDetail: UpdateBillProps) {
    try {
      const res = await updateBill(billDetail);
      if (res.status === 200) {
        if (res.data) {
          Toast.show({ content: res.message, icon: 'success' });
          navigate(-1);
        } else {
          Toast.show({ content: res.message, icon: 'fail' });
        }
      } else {
        Toast.show({ content: res.message, icon: 'fail' });
      }
    } catch (err) {
      Toast.show({ content: (err as Error).message, icon: 'fail' });
    }
  }

  function setData(data: BillItem) {
    const { id, categoryType, category: cat } = data;
    currentId.current = id;
    setTab(categoryType === 1 ? '支出' : '收入');
    setCategory(cat);
    if (calculatorInstance.current) {
      calculatorInstance.current.setData(data);
    }
  }

  return (
    <div className="bookkeeping">
      <NavBar style={{ position: 'fixed', top: 0, zIndex: 1, width: '100%' }}>
        记账
      </NavBar>

      {userInfo.username === '' ? (
        <NoLogin />
      ) : (
        <div>
          <div className="tabs">
            <Segmented
              value={tab}
              onChange={(val) => {
                const newTab = val as Tab;
                setTab(newTab);
                const icons = newTab === '支出' ? expenditureIcons : incomeIcons;
                setCategory(icons[0]);
              }}
              options={[
                { label: '支出', value: '支出' },
                { label: '收入', value: '收入' },
              ]}
            />
          </div>

          <div className="icon-box">
            <ul className="icon-list">
              {currentIcons.map((i) => (
                <li
                  className={`icon-item ${category?.title === i.title ? 'active' : ''}`}
                  key={i.title}
                  onClick={() => setCategory(i)}
                >
                  <div className="icon-container">
                    <span className={`icon iconfont icon-${i.icon}`} />
                  </div>
                  <p className="icon-title">{i.title}</p>
                </li>
              ))}
              <li
                className="icon-item"
                onClick={() => navigate('/categorySetting', { state: { tab } })}
              >
                <div className="icon-container">
                  <span className="icon iconfont-base icon-shezhi" />
                </div>
                <p className="icon-title">设置</p>
              </li>
            </ul>
          </div>

          {category && (
            <Calculator
              ref={calculatorInstance}
              onConfirm={handlerConfirm}
              style={{ position: 'fixed', bottom: 0, zIndex: 1 }}
            />
          )}
        </div>
      )}
    </div>
  );
}
