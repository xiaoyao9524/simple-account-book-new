import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Segmented, Toast } from 'antd-mobile';
import { useStore } from '@/store/useStore';
import useUserStore from '@/store/useUserStore'
import useIconStore from '@/store/useIconStore'

import {CategoryTypeEnum, type CategoryType} from '@/enums/categoryEnum'
import type {IconVO} from '@/types/Icon'

import NavBar from '@/components/NavBar/NavBar';
import NoLogin from '@/components/NoLogin/NoLogin';
import Calculator, { type CalculatorOnConfirmResult, type CalculatorRefProps } from '@/components/Calculator/Calculator';


import type { CategoryItem } from '@/types/category';
import type { InsertBillProps, UpdateBillProps, BillItem } from '@/types/bill';
import { insertBill, updateBill } from '@/api/bill';

import './style.scss';

// type Tab = '支出' | '收入';

// const tabEnum: Record<Tab, number> = { '收入': 0, '支出': 1 };

export default function Bookkeeping() {
  const navigate = useNavigate();
  // const location = useLocation();
  const userInfo = useUserStore(state => state.userInfo);
  const incomeIcons = useIconStore(state => state.incomeList);
  const expendIcons = useIconStore(state => state.expendList);
  const updateIconList = useIconStore(state => state.updateList);
  // const userInfo = useStore((s) => s.userInfo);
  // const expenditureIcons = useStore((s) => s.userInfo.category.expenditureList);
  // const incomeIcons = useStore((s) => s.userInfo.category.incomeList);

  // const currentId = useRef<number | null>(null);
  const [currentIcon, setCurrentIcon] = useState<IconVO | null>(null);
  const [tab, setTab] = useState<CategoryType>(CategoryTypeEnum.EXPEND);
  const calculatorInstance = useRef<CalculatorRefProps>(null);
  // const [category, setCategory] = useState<CategoryItem | undefined>(undefined);

  const currentIcons = useMemo(
    () => (tab === CategoryTypeEnum.INCOME ? incomeIcons : expendIcons),
    [tab, incomeIcons, expendIcons]
  );

  useEffect(() => {
    if (!incomeIcons.length || !expendIcons.length) {
      updateIconList().then(() => {
        console.log(incomeIcons, expendIcons)
      });
    }
  }, [updateIconList, incomeIcons, expendIcons]);

  // useEffect(() => {
  //   const editData = location.state as BillItem | null;
  //   if (editData) {
  //     setData(editData);
  //   }
  // }, [location.state]);

  // useEffect(() => {
  //   if (!category && currentIcons.length > 0) {
  //     setCategory(currentIcons[0]);
  //   }
  // }, [currentIcons, category]);

  function handlerConfirm(calculatorResult: CalculatorOnConfirmResult) {
    console.log(calculatorResult)
    // const { price, date, remark } = calculatorResult;
    // const billDetail = {
    //   categoryType: tabEnum[tab],
    //   categoryId: category!.id,
    //   price,
    //   billTime: date,
    //   remark,
    // };
    // if (currentId.current) {
    //   _updateBill({ ...billDetail, id: currentId.current });
    // } else {
    //   _insertBill(billDetail);
    // }
  }

  // async function _insertBill(insertBillData: InsertBillProps) {
  //   try {
  //     const res = await insertBill(insertBillData);
  //     if (res.status === 200) {
  //       navigate(-1);
  //     } else {
  //       Toast.show({ content: res.message, icon: 'fail' });
  //     }
  //   } catch (err) {
  //     Toast.show({ content: (err as Error).message, icon: 'fail' });
  //   }
  // }

  // async function _updateBill(billDetail: UpdateBillProps) {
  //   try {
  //     const res = await updateBill(billDetail);
  //     if (res.status === 200) {
  //       if (res.data) {
  //         Toast.show({ content: res.message, icon: 'success' });
  //         navigate(-1);
  //       } else {
  //         Toast.show({ content: res.message, icon: 'fail' });
  //       }
  //     } else {
  //       Toast.show({ content: res.message, icon: 'fail' });
  //     }
  //   } catch (err) {
  //     Toast.show({ content: (err as Error).message, icon: 'fail' });
  //   }
  // }

  // function setData(data: BillItem) {
  //   const { id, categoryType, category: cat } = data;
  //   currentId.current = id;
  //   setTab(categoryType === 1 ? '支出' : '收入');
  //   setCategory(cat);
  //   if (calculatorInstance.current) {
  //     calculatorInstance.current.setData(data);
  //   }
  // }

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
                setTab(val as CategoryType);
              }}
              options={[
                { label: '支出', value: CategoryTypeEnum.EXPEND },
                { label: '收入', value: CategoryTypeEnum.INCOME },
              ]}
            />
          </div>

          <div className="icon-box" style={{paddingBottom: currentIcon ? '390px' : ''}}>
            <ul className="icon-list">
              {currentIcons.map((i) => (
                <li
                  className={`icon-item ${currentIcon?.title === i.title ? 'active' : ''}`}
                  key={i.title}
                  onClick={() => setCurrentIcon(i)}
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

          {currentIcon && (
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
