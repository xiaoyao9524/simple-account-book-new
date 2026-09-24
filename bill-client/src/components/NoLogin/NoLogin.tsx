import { Button } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router';

import './style.scss';

export default function NoLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="no-login">
      <p>您还未登录</p>
      <Button color="primary" onClick={() => navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`)}>
        去登录
      </Button>
    </div>
  );
}
