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

      for (const category of res.data) {
        if (typeof category.sort !== 'number') {
          category.sort = 0;
        }
        if (category.type === CategoryTypeEnum.INCOME) {
          incomeList.push(category);
        } else {
          expendList.push(category);
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
