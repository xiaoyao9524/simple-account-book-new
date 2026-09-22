import { NavBar as AntdNavBar } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

interface NavBarProps {
  children: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  style?: React.CSSProperties;
}

export default function NavBar({ children, showBack = true, onBack, style }: NavBarProps) {
  const navigate = useNavigate();
  return (
    <AntdNavBar
      style={{ maxWidth: 400, background: 'var(--bg-card)', ...style }}
      onBack={() => {
        if (!showBack) return;
        onBack ? onBack() : navigate(-1);
      }}
      backArrow={showBack}
    >
      {children}
    </AntdNavBar>
  );
}
