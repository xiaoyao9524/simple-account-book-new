import { useNavigate } from 'react-router';
import { List, Button, Toast } from 'antd-mobile';
import { SetOutline ,QuestionCircleOutline} from 'antd-mobile-icons';
import useTokenStore from '@/store/useTokenStore';
import useUserStore from '@/store/useUserStore';
import { logout } from '@/api/user';
import NavBar from '@/components/NavBar/NavBar';
import TabBar from '@/components/TabBar/TabBar';
import defaultAvatar from '@/static/image/default-avatar.jpg';
import './style.scss';

export default function My() {
  const navigate = useNavigate();
  const clearToken = useTokenStore(s => s.clearToken);
  const userInfo = useUserStore(s => s.userInfo);
  const clearUserInfo = useUserStore(s => s.clearUserInfo);

  async function test() {

  }

  async function handlerLogout() {
    const res = await logout();
    if (res) {
      Toast.show({ content: '退出成功', icon: 'success' });
      clearToken();
      clearUserInfo();
      navigate('/login', { replace: true });
    }
  }

  return (
    <div className="my">
      <NavBar showBack={false}>我的</NavBar>
      <header className="my-header">
        <div
          className="user-info"
          onClick={() => {
            if (userInfo.username) return;
            navigate('/login?redirect=/my');
          }}
        >
          <div className="avatar-wrapper">
            <img className="avatar" src={userInfo.avatar || defaultAvatar} alt="" />
          </div>
          <div className="user-detail">
            <p className="user-name">{userInfo.username || '请登录'}</p>
          </div>
        </div>
        <div className="account-info">
          <div className="info-item">
            <p className="info-title">记账总天数</p>
            <p className="info-number">{99999}</p>
          </div>
          <div className="info-item">
            <p className="info-title">记账总笔数</p>
            <p className="info-number">{99999}</p>
          </div>
        </div>
      </header>

      <List className="my-list">
        <List.Item
          prefix={<SetOutline />}
          onClick={() => navigate('/categorySetting')}
        >
          类别设置
        </List.Item>
        <List.Item prefix={<QuestionCircleOutline />} onClick={test}>
          关于简单记账
        </List.Item>
        <List.Item style={{ marginTop: 160 }}>
          <Button block color="warning" onClick={handlerLogout}>
            退出登录
          </Button>
        </List.Item>
      </List>

      <TabBar />
    </div>
  );
}
