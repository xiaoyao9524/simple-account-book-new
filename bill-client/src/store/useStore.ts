import { create } from 'zustand';
import type { UserInfo } from '@/types/user';
import type { CategoryItem, CategoryItemWithSortIndex, UpdateCategoryResultData } from '@/types/category';
import { checkSystemInfo } from '@/utils/system';
import { updateCurrentUserCategory } from '@/api/category';

interface SystemState {
  isMobile: boolean;
  isAndroid: boolean;
  isIOS: boolean;
  tabBarShow: boolean;
}

interface StoreState {
  system: SystemState;
  userInfo: UserInfo;
  token: string;
  setSystemInfo: () => void;
  setTabBarShow: (show: boolean) => void;
  setToken: (token: string) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  loadUserDataFromLocal: () => void;
  setUserCategory: (category: UpdateCategoryResultData) => void;
  deleteUserCategory: (category: CategoryItem) => void;
  updateUserCategory: () => Promise<void>;
}

const defaultUserInfo: UserInfo = {
  username: '',
  avatar: '',
  bookkeepingDays: 0,
  bookkeepCount: 0,
  category: {
    expenditureList: [],
    incomeList: [],
  },
};

const defaultSystemState: SystemState = {
  isMobile: false,
  isAndroid: false,
  isIOS: false,
  tabBarShow: true,
};

export const useStore = create<StoreState>((set) => ({
  system: { ...defaultSystemState },
  userInfo: { ...defaultUserInfo },
  token: '',

  setSystemInfo: () => {
    const { isIOS, isAndroid, isMobile } = checkSystemInfo();
    set((state) => ({
      system: { ...state.system, isIOS, isAndroid, isMobile },
    }));
  },

  setTabBarShow: (show: boolean) => {
    set((state) => ({
      system: { ...state.system, tabBarShow: show },
    }));
  },

  setToken: (token: string) => {
    localStorage.setItem('token', JSON.stringify(token));
    set({ token });
  },

  setUserInfo: (userInfo: UserInfo) => {
    const sortedExpenditure = [...userInfo.category.expenditureList].sort(
      (a, b) => a.sortIndex - b.sortIndex
    );
    const sortedIncome = [...userInfo.category.incomeList].sort(
      (a, b) => a.sortIndex - b.sortIndex
    );
    const sortedUserInfo: UserInfo = {
      ...userInfo,
      category: {
        expenditureList: sortedExpenditure,
        incomeList: sortedIncome,
      },
    };
    localStorage.setItem('userInfo', JSON.stringify(sortedUserInfo));
    set({ userInfo: sortedUserInfo });
  },

  loadUserDataFromLocal: () => {
    const localUserInfoStr = localStorage.getItem('userInfo');
    if (localUserInfoStr) {
      try {
        const localUserInfo = JSON.parse(localUserInfoStr) as UserInfo;
        const localToken = localStorage.getItem('token');
        if (!localToken || !localUserInfo) {
          throw new Error('读取 localStorage 失败！');
        }
        set({ userInfo: localUserInfo, token: localToken });
      } catch {
        set({ userInfo: { ...defaultUserInfo }, token: '' });
      }
    }
  },

  setUserCategory: (category: UpdateCategoryResultData) => {
    set((state) => {
      const newUserInfo = {
        ...state.userInfo,
        category: {
          expenditureList: [...category.expenditureList].sort(
            (a, b) => a.sortIndex - b.sortIndex
          ),
          incomeList: [...category.incomeList].sort(
            (a, b) => a.sortIndex - b.sortIndex
          ),
        },
      };
      localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
      return { userInfo: newUserInfo };
    });
  },

  deleteUserCategory: (category: CategoryItem) => {
    set((state) => {
      const isIncome = category.categoryType === 0;
      const list = isIncome
        ? [...state.userInfo.category.incomeList]
        : [...state.userInfo.category.expenditureList];
      const delIndex = list.findIndex((i) => i.id === category.id);
      if (delIndex >= 0) {
        list.splice(delIndex, 1);
      }
      const newUserInfo: UserInfo = {
        ...state.userInfo,
        category: {
          ...state.userInfo.category,
          incomeList: isIncome ? list : state.userInfo.category.incomeList,
          expenditureList: isIncome ? state.userInfo.category.expenditureList : list,
        },
      };
      localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
      return { userInfo: newUserInfo };
    });
  },

  updateUserCategory: async () => {
    try {
      const res = await updateCurrentUserCategory();
      if (res.status === 200) {
        set((state) => {
          const newUserInfo: UserInfo = {
            ...state.userInfo,
            category: {
              expenditureList: [...res.data.expenditureList].sort(
                (a: CategoryItemWithSortIndex, b: CategoryItemWithSortIndex) =>
                  a.sortIndex - b.sortIndex
              ),
              incomeList: [...res.data.incomeList].sort(
                (a: CategoryItemWithSortIndex, b: CategoryItemWithSortIndex) =>
                  a.sortIndex - b.sortIndex
              ),
            },
          };
          localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
          return { userInfo: newUserInfo };
        });
      }
    } catch (err) {
      console.error('更新用户分类失败:', err);
    }
  },
}));
