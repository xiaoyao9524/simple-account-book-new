import { create } from 'zustand';
import { CategoryTypeEnum } from '@/enums/categoryEnum'
import type { IconVO } from '@/types/Icon'
import { queryDefaultIcons } from '@/api/icon'

export interface IconStore {
  incomeList: IconVO[];
  expendList: IconVO[];
  updateList: () => Promise<any>;
}

const useIconStore = create<IconStore>((set) => ({
  incomeList: [],
  expendList: [],
  updateList: async () => {
    const res = await queryDefaultIcons();

    if (res) {
      const incomeList: IconVO[] = [];
      const expendList: IconVO[] = [];

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

export default useIconStore;
