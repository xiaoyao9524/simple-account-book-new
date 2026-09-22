import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import Home from '@/pages/Home/Home';
import Bookkeeping from '@/pages/Bookkeeping/Bookkeeping';
import Login from '@/pages/Login/Login';
import Register from '@/pages/Register/Register';
import My from '@/pages/My/My';
import CategorySetting from '@/pages/CategorySetting/CategorySetting';
import InsertCategory from '@/pages/InsertCategory/InsertCategory';
import DeleteCategoryAndBill from '@/pages/DeleteCategoryAndBill/DeleteCategoryAndBill';

export default function App() {
  const setSystemInfo = useStore((s) => s.setSystemInfo);
  const loadUserDataFromLocal = useStore((s) => s.loadUserDataFromLocal);
  const isMobile = useStore((s) => s.system.isMobile);

  useEffect(() => {
    setSystemInfo();
    loadUserDataFromLocal();
    const handleResize = () => setSystemInfo();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSystemInfo, loadUserDataFromLocal]);

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
