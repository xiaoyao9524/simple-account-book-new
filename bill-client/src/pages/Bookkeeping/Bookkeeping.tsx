import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Segmented } from 'antd-mobile';
import useUserStore from '@/store/useUserStore'
import useCategoryStore from '@/store/useCategoryStore'

import {CategoryTypeEnum, type CategoryType} from '@/enums/categoryEnum'
import type {CategoryVO} from '@/types/category'

import NavBar from '@/components/NavBar/NavBar';
import NoLogin from '@/components/NoLogin/NoLogin';
import Calculator, { type CalculatorOnConfirmResult, type CalculatorRefProps } from '@/components/Calculator/Calculator';

import './style.scss';

export default function Bookkeeping() {
  const navigate = useNavigate();
  // const location = useLocation();
  const userInfo = useUserStore(state => state.userInfo);
  const incomeCategorys = useCategoryStore(state => state.incomeList);
  const expendCategorys = useCategoryStore(state => state.expendList);
  const updateCategoryList = useCategoryStore(state => state.updateList);

  const [currentIcon, setCurrentIcon] = useState<CategoryVO | null>(null);
  const [tab, setTab] = useState<CategoryType>(CategoryTypeEnum.EXPEND);
  const calculatorInstance = useRef<CalculatorRefProps>(null);
  // const [category, setCategory] = useState<CategoryItem | undefined>(undefined);

  const currentIcons = useMemo(
    () => (tab === CategoryTypeEnum.INCOME ? incomeCategorys : expendCategorys),
    [tab, incomeCategorys, expendCategorys]
  );

  useEffect(() => {
    if (!incomeCategorys.length || !expendCategorys.length) {
      updateCategoryList().then(() => {
        console.log(incomeCategorys, expendCategorys)
      });
    }
  }, [updateCategoryList, incomeCategorys, expendCategorys]);

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
