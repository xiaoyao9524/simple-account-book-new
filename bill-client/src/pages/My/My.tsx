import { useNavigate } from 'react-router';
import { List, Button, Toast } from 'antd-mobile';
import { useStore } from '@/store/useStore';
import { batchInsertDefaultIcons, logout } from '@/api/user';
import NavBar from '@/components/NavBar/NavBar';
import TabBar from '@/components/TabBar/TabBar';
import defaultAvatar from '@/static/image/default-avatar.jpg';
import './style.scss';

export default function My() {
  const navigate = useNavigate();
  const userInfo = useStore((s) => s.userInfo);

  async function test () {
    const res = await batchInsertDefaultIcons();

    if (res) {
      console.log('图标补全成功');
    }
  }

  async function _logout() {
    try {
      const res = await logout();
      if (res.status === 200) {
        Toast.show({ content: '退出成功', icon: 'success' });
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        navigate('/login', { replace: true });
      } else {
        Toast.show({ content: res.message, icon: 'fail' });
      }
    } catch (err) {
      Toast.show({ content: (err as Error).message, icon: 'fail' });
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
            <p className="info-number">{userInfo.bookkeepingDays}</p>
          </div>
          <div className="info-item">
            <p className="info-title">记账总笔数</p>
            <p className="info-number">{userInfo.bookkeepCount}</p>
          </div>
        </div>
      </header>

      <List className="my-list">
        <List.Item
          arrow
          onClick={() => navigate('/categorySetting')}
        >
          类别设置
        </List.Item>
        <List.Item arrow onClick={test}>
          关于简单记账
        </List.Item>
        <List.Item style={{ marginTop: 160 }}>
          <Button block color="warning" onClick={_logout}>
            退出登录
          </Button>
        </List.Item>
      </List>

      <TabBar />
    </div>
  );
}
