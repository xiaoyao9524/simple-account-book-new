import { create } from 'zustand';
import { CategoryTypeEnum } from '@/enums/categoryEnum'
import type { CategoryVO } from '@/types/category'
import { queryUserCategory } from '@/api/category'

export interface CategoryStore {
  incomeList: CategoryVO[];
  expendList: CategoryVO[];
  updateList: () => Promise<any>;
}

const useCategoryStore = create<CategoryStore>((set) => ({
  incomeList: [],
  expendList: [],
  updateList: async () => {
    const res = await queryUserCategory();

    if (res) {
      const incomeList: CategoryVO[] = [];
      const expendList: CategoryVO[] = [];

      for (const icon of res.data) {
        if (icon.type === CategoryTypeEnum.INCOME) {
          incomeList.push(icon);
        } else {
          expendList.push(icon);
        }
      }

      set({
        incomeList,
        expendList
      })
    }
  }
}))

export default useCategoryStore;
