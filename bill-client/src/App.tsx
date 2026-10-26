import { lazy, Suspense, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router';
import useSystemStore from './store/useSystemStore';
import useTokenStore from './store/useTokenStore';
import useUserStore, { getInitialUserInfo } from './store/useUserStore';
import useCategoryStore from './store/useCategoryStore';
import type { UserVO } from '@/types/user'
import { checkSystemInfo } from '@/utils/system'

const Home = lazy(() => import('@/pages/Home/Home'));
const Login = lazy(() => import('@/pages/Login/Login'));
const Register = lazy(() => import('@/pages/Register/Register'));
const Bookkeeping = lazy(() => import('@/pages/Bookkeeping/Bookkeeping'));
const My = lazy(() => import('@/pages/My/My'));
const CategorySetting = lazy(() => import('@/pages/CategorySetting/CategorySetting'));
const InsertCategory = lazy(() => import('@/pages/InsertCategory/InsertCategory'));
const DeleteCategoryAndBill = lazy(() => import('@/pages/DeleteCategoryAndBill/DeleteCategoryAndBill'));
const About = lazy(() => import('@/pages/About/About'))

export default function App() {
  const isMobile = useSystemStore(store => store.isMobile);
  const setSystemInfo = useSystemStore(store => store.setSystemInfo);
  const setToken = useTokenStore(store => store.setToken);
  const setUserInfo = useUserStore(store => store.setUserInfo);
  const updateCategoryList = useCategoryStore(store => store.updateList);
  const initialSystemInfo = useCallback(() => {
    const systemInfo = checkSystemInfo();
    setSystemInfo(systemInfo);
  }, [setSystemInfo])

  const readLocalData = useCallback(() => {
    const localToken = localStorage.getItem('token');

    if (localToken) {
      setToken(localToken);
      updateCategoryList();
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
    } catch {
      setUserInfo(getInitialUserInfo());
    }
  }, [setToken, setUserInfo, updateCategoryList])

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
        <Suspense fallback={<div>加载中...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/bookkeeping" element={<Bookkeeping />} />
            <Route path="/my" element={<My />} />
            <Route path="/categorySetting" element={<CategorySetting />} />
            <Route path="/insertCategory" element={<InsertCategory />} />
            <Route path="/deleteCategoryAndBill" element={<DeleteCategoryAndBill />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Suspense>
      </section>
    </div>
  );
}
