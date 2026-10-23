import { useState, useMemo, useImperativeHandle, type Ref } from 'react'
import { Popup, Button } from 'antd-mobile'

import useCategoryList from '@/hooks/useCategoryList'
import { type CategoryType, CategoryTypeEnum } from '@/enums/categoryEnum';
import type { CategoryVO } from '@/types/category';
import "./style.scss"

export interface CategorySelectRef {
  open: () => void;
  close: () => void;
}

export interface CategorySelectProps {
  type: CategoryType;
  ref?: Ref<CategorySelectRef>;
  disabledIds?: number[];
  onConfirm?: (category: CategoryVO) => void;
}

const CategorySelect = ({ref, type, disabledIds = [], onConfirm}: CategorySelectProps) => {
  const [visible, setVisible] = useState(false);

  const [category, setCategory] = useState<CategoryVO | null>(null);

  const {
    enableExpendCategorys,
    enableIncomeCategorys
  } = useCategoryList();

  const currentIcons = useMemo(
    () => (type === CategoryTypeEnum.INCOME ? enableIncomeCategorys : enableExpendCategorys),
    [type, enableIncomeCategorys, enableExpendCategorys]
  );

  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true);
    },
     close: () => {
      setVisible(false);
     }
  }))

  return (
    <Popup
      visible={visible}
      onMaskClick={() => {
        setVisible(false)
      }}
      onClose={() => {
        setVisible(false)
      }}
      bodyStyle={{
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        height: '70vh',
      }}
    >
      <div className="category-select icon-box">
        <ul className="icon-list">
          {currentIcons.map((i) => (
            <li
              className={`icon-item ${category?.id === i.id ? 'active' : ''}`}
              key={i.id}
              style={{opacity: disabledIds.includes(i.id) ? '.5' : ''}}
              onClick={() => {
                if (disabledIds.includes(i.id)) {
                  return
                }
                setCategory(i)
              }}
            >
              <div className="icon-container">
                <span className={`icon iconfont icon-${i.icon}`} />
              </div>
              <p className="icon-title">{i.title}</p>
            </li>
          ))}
        </ul>
        <div className="confirm-btn-wrapper">
          <Button
            block
            color="primary"
            disabled={!category}
            onClick={async () => {
              if (onConfirm) {
                onConfirm(category as CategoryVO);
              }
            }}
          >
            确认
          </Button>
        </div>
      </div>
    </Popup>
  )
}

export default CategorySelect;
