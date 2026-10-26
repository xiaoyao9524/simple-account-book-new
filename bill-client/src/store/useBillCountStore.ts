import { create } from 'zustand';
import { getBillCount } from '@/api/bill'

export interface CategoryStore {
  billCount: number;
  updateBillCount: () => void;
}

const useBillCountStore = create<CategoryStore>((set) => ({
  billCount: 0,
  updateBillCount: async () => {
    const res = await getBillCount();

    if (res && typeof res.data === 'number') {
      set({
        billCount: res.data
      })
    }
  }
}))

export default useBillCountStore;
