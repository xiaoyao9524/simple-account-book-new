import { useMemo } from 'react';
import useCategoryStore from '@/store/useCategoryStore'
import type { CategoryVO } from '@/types/category'
import { CategoryEnableEnum } from '@/enums/categoryEnum'

 const useCategoryList = () => {
  const incomeCategorys = useCategoryStore(state => state.incomeList);
  const expendCategorys = useCategoryStore(state => state.expendList);

  const updateCategory = useCategoryStore((s) => s.updateList);

  const { enableIncomeCategorys, disableIncomeCategorys, enableExpendCategorys, disableExpendCategorys } = useMemo(() => {
    const enableIncomeCategorys: CategoryVO[] = [];
    const disableIncomeCategorys: CategoryVO[] = [];
    for (const item of incomeCategorys) {
      if (item.enable === CategoryEnableEnum.ENABLE) {
        enableIncomeCategorys.push(item);
      } else {
        disableIncomeCategorys.push(item);
      }
    }
    enableIncomeCategorys.sort((a, b) => a.sort - b.sort);
    const enableExpendCategorys: CategoryVO[] = [];
    const disableExpendCategorys: CategoryVO[] = [];

    for (const item of expendCategorys) {
      if (item.enable) {
        enableExpendCategorys.push(item);
      } else {
        disableExpendCategorys.push(item);
      }
    }

    enableExpendCategorys.sort((a, b) => a.sort - b.sort);

    return {
      enableIncomeCategorys,
      disableIncomeCategorys,
      enableExpendCategorys,
      disableExpendCategorys
    }
  }, [incomeCategorys, expendCategorys]);

  return {
    enableIncomeCategorys,
    disableIncomeCategorys,
    enableExpendCategorys,
    disableExpendCategorys,
    updateCategory
  }
}

export default useCategoryList;
