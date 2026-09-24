import { useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router';
// import { useStore } from '@/store/useStore';
import useSystemStore from './store/useSystemStore';
import useTokenStore from './store/useTokenStore';
import useUserStore, { getInitialUserInfo } from './store/useUserStore';
import type { UserVO } from '@/types/user'
import { checkSystemInfo } from '@/utils/system'

import Home from '@/pages/Home/Home';
import Bookkeeping from '@/pages/Bookkeeping/Bookkeeping';
import Login from '@/pages/Login/Login';
import Register from '@/pages/Register/Register';
import My from '@/pages/My/My';
import CategorySetting from '@/pages/CategorySetting/CategorySetting';
import InsertCategory from '@/pages/InsertCategory/InsertCategory';
import DeleteCategoryAndBill from '@/pages/DeleteCategoryAndBill/DeleteCategoryAndBill';

export default function App() {
  const isMobile = useSystemStore(store => store.isMobile);
  const setSystemInfo = useSystemStore(store => store.setSystemInfo);
  const setToken = useTokenStore(store => store.setToken);
  const setUserInfo = useUserStore(store => store.setUserInfo);

  const initialSystemInfo = useCallback(() => {
    const systemInfo = checkSystemInfo();

    setSystemInfo(systemInfo);
  }, [setSystemInfo])

  const readLocalData = useCallback(() => {
    const localToken = localStorage.getItem('token');

    if (localToken) {
      setToken(localToken);
    } else {
      setToken('');
    }

    try {
      const localUserInfoStr = localStorage.getItem('userInfo');

      if (localUserInfoStr) {
        const localUserInfo = JSON.parse(localUserInfoStr);

        setUserInfo(localUserInfo as UserVO);
      } else {
        setUserInfo(getInitialUserInfo());
      }
    } catch (err) {
      setUserInfo(getInitialUserInfo());
    }
  }, [setToken, setUserInfo])

  useEffect(() => {
    initialSystemInfo();
    readLocalData();
    const handleResize = () => initialSystemInfo();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [readLocalData, initialSystemInfo]);

  return (
    <div className={`App ${isMobile ? 'is-ios' : ''}`}>
      <section className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bookkeeping" element={<Bookkeeping />} />
          <Route path="/my" element={<My />} />
          <Route path="/categorySetting" element={<CategorySetting />} />
          <Route path="/insertCategory" element={<InsertCategory />} />
          <Route path="/deleteCategoryAndBill" element={<DeleteCategoryAndBill />} />
        </Routes>
      </section>
    </div>
  );
}
