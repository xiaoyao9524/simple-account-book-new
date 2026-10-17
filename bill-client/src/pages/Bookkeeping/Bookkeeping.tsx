import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Segmented, Toast } from 'antd-mobile';
import useUserStore from '@/store/useUserStore'
import useCategoryList from '@/hooks/useCategoryList';

import { CategoryTypeEnum, type CategoryType } from '@/enums/categoryEnum'
import type { CategoryVO } from '@/types/category'

import NavBar from '@/components/NavBar/NavBar';
import NoLogin from '@/components/NoLogin/NoLogin';
import Calculator, { type CalculatorOnConfirmResult, type CalculatorRefProps } from '@/components/Calculator/Calculator';

import { insertBill } from '@/api/bill'

import './style.scss';

export default function Bookkeeping() {
  const navigate = useNavigate();
  // const location = useLocation();
  const userInfo = useUserStore(state => state.userInfo);
  const {
    enableExpendCategorys,
    // disableExpendCategorys,
    enableIncomeCategorys,
    // disableIncomeCategorys,
    updateCategory
  } = useCategoryList();
  // const incomeCategorys = useCategoryStore(state => state.incomeList);
  // const expendCategorys = useCategoryStore(state => state.expendList);
  // const updateCategoryList = useCategoryStore(state => state.updateList);

  const [category, setCategory] = useState<CategoryVO | null>(null);
  const [type, setType] = useState<CategoryType>(CategoryTypeEnum.EXPEND);
  const calculatorInstance = useRef<CalculatorRefProps>(null);
  // const [category, setCategory] = useState<CategoryItem | undefined>(undefined);

  const currentIcons = useMemo(
    () => (type === CategoryTypeEnum.INCOME ? enableIncomeCategorys : enableExpendCategorys),
    [type, enableIncomeCategorys, enableExpendCategorys]
  );

  useEffect(() => {
    if (!enableIncomeCategorys.length || !enableExpendCategorys.length) {
      updateCategory();
    }
  }, [enableIncomeCategorys, enableExpendCategorys, updateCategory]);

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

  const handlerConfirm = useCallback(async (calculatorResult: CalculatorOnConfirmResult) => {

    if (!category) {
      return Toast.show({
        content: "请选择分类",
        icon: 'fail'
      })
    }
    const param = {
      type,
      categoryId: category.id,
      ...calculatorResult
    }
    console.log(param);

    const res = await insertBill(param);

    if (res) {
      Toast.show({
        icon: 'success',
        content: '保存成功'
      })
    }
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
  }, [category, type])

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

          <div className="icon-box" style={{ paddingBottom: category ? '390px' : '' }}>
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
                onClick={() => navigate(`/categorySetting`, { state: { type } })}
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
              style={{ position: 'fixed', bottom: 0, zIndex: 1 }}
              onConfirm={handlerConfirm}
            />
          )}
        </div>
      )}
    </div>
  );
}
