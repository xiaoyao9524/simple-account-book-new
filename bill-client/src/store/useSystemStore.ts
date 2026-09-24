import { create } from 'zustand';
import type { SystemInfo } from '@/types/system'


export interface SystemStore extends SystemInfo {
  tabBarShow: boolean;
  setSystemInfo: (systemInfo: SystemInfo) => void;
  // setIsMobile: (isMobile: boolean) => void;
  // setIsAndroid: (isAndroid: boolean) => void;
  // setIsIOS: (isIOS: boolean) => void;
  seTabBarShow: (tabBarShow: boolean) => void;
}

const useSystemStore = create<SystemStore>((set) => ({
  isMobile: false,
  isAndroid: false,
  isIOS: false,
  tabBarShow: false,
  setSystemInfo: (systemInfo: SystemInfo) => set(() => ({ ...systemInfo })),
  // setIsMobile: (isMobile: boolean) => set(() => ({ isMobile })),
  // setIsAndroid: (isAndroid: boolean) => set(() => ({ isAndroid })),
  // setIsIOS: (isIOS: boolean) => set(() => ({ isIOS })),
  seTabBarShow: (tabBarShow: boolean) => set(() => ({ tabBarShow })),
}))

export default useSystemStore;
