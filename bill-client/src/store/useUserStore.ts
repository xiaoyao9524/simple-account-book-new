import { create } from 'zustand';
import type { UserVO } from '@/types/user';

interface UserStore {
  userInfo: UserVO;
  setUserInfo: (userInfo: UserVO) => void;
}

const initialUserInfo = JSON.stringify({
  id: -1,
  username: '',
  avatar: ''
})

export const getInitialUserInfo = (): UserVO => (JSON.parse(initialUserInfo) as UserVO);

const useUserStore = create<UserStore>((set) => ({
  userInfo: getInitialUserInfo(),
  setUserInfo: (userInfo: UserVO | null) => set(() => {
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      return { userInfo }
    }
    localStorage.removeItem('userInfo');
    return {userInfo: getInitialUserInfo()};
  })

}))

export default useUserStore;