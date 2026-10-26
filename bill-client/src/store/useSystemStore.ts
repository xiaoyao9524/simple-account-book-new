import { create } from 'zustand';
import type { SystemInfo } from '@/types/system'
import { getBillDay } from '@/api/bill'

export interface SystemStore extends SystemInfo {
  tabBarShow: boolean;
  billDay: number;
  updateBillDay: () => void;
  setSystemInfo: (systemInfo: SystemInfo) => void;
  seTabBarShow: (tabBarShow: boolean) => void;
}

const useSystemStore = create<SystemStore>((set) => ({
  billDay: 0,
  isMobile: false,
  isAndroid: false,
  isIOS: false,
  tabBarShow: false,
  setSystemInfo: (systemInfo: SystemInfo) => set(() => ({ ...systemInfo })),
  seTabBarShow: (tabBarShow: boolean) => set(() => ({ tabBarShow })),
  updateBillDay: async () => {
    const res = await getBillDay();

    // console.log('billDay: ', billDay, typeof billDay);

    if (res && typeof res.data === 'number') {
      set({
        billDay: res.data
      })
    }
  }
}))

export default useSystemStore;
