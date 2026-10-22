import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Segmented, Toast } from 'antd-mobile';
import useUserStore from '@/store/useUserStore'
import useCategoryList from '@/hooks/useCategoryList';

import { CategoryTypeEnum, type CategoryType } from '@/enums/categoryEnum'
import type { BillItem } from '@/types/bill';

import NavBar from '@/components/NavBar/NavBar';
import NoLogin from '@/components/NoLogin/NoLogin';
import Calculator, { type CalculatorOnConfirmResult, type CalculatorRefProps } from '@/components/Calculator/Calculator';

import { insertBill, updateBill } from '@/api/bill'

import './style.scss';

export default function Bookkeeping() {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useUserStore(state => state.userInfo);
  const {
    enableExpendCategorys,
    enableIncomeCategorys,
    updateCategory
  } = useCategoryList();
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [type, setType] = useState<CategoryType>(CategoryTypeEnum.EXPEND);
  const calculatorInstance = useRef<CalculatorRefProps>(null);

  const currentIcons = useMemo(
    () => (type === CategoryTypeEnum.INCOME ? enableIncomeCategorys : enableExpendCategorys),
    [type, enableIncomeCategorys, enableExpendCategorys]
  );

  useEffect(() => {
    if (!enableIncomeCategorys.length || !enableExpendCategorys.length) {
      updateCategory();
    }
  }, [enableIncomeCategorys, enableExpendCategorys, updateCategory]);

  useEffect(() => {
    const editData = location.state as BillItem | null;

    if (!editData) {
      return
    }

    Promise.resolve(() => { })
      .then(() => {
        const { date, price, remark, type, category } = editData;

        setType(type);
        setCategoryId(category.id);

        setTimeout(() => {
          calculatorInstance.current?.setData({
            date,
            price,
            remark
          })
        }, 20)
      })
  }, [location.state]);

  const handlerConfirm = useCallback(async (calculatorResult: CalculatorOnConfirmResult) => {

    if (!categoryId) {
      return Toast.show({
        content: "请选择分类",
        icon: 'fail'
      })
    }
    const param = {
      type,
      categoryId,
      ...calculatorResult
    }

    const res = location.state ? await updateBill({
      id: (location.state as BillItem).id,
      ...param
    }) : await insertBill(param);

    if (res) {
      Toast.show({
        icon: 'success',
        content: '保存成功'
      })
      navigate(-1);
    }
  }, [categoryId, type, location.state, navigate])

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

          <div className="icon-box" style={{ paddingBottom: categoryId ? '390px' : '' }}>
            <ul className="icon-list">
              {currentIcons.map((i) => (
                <li
                  className={`icon-item ${categoryId === i.id ? 'active' : ''}`}
                  key={i.id}
                  onClick={() => setCategoryId(i.id)}
                >
                  <div className="icon-container">
                    <span className={`icon iconfont icon-${i.icon}`} />
                  </div>
                  <p className="icon-title">{i.title}</p>
                </li>
              ))}
              <li
                className="icon-item"
                onClick={() => navigate(`/categorySetting`, { state: { type } })}
              >
                <div className="icon-container">
                  <span className="icon iconfont-base icon-shezhi" />
                </div>
                <p className="icon-title">设置</p>
              </li>
            </ul>
          </div>

          {categoryId && (
            <Calculator
              ref={calculatorInstance}
              style={{ position: 'fixed', bottom: 0, zIndex: 1 }}
              onConfirm={handlerConfirm}
            />
          )}
        </div>
      )}
    </div>
  );
}
