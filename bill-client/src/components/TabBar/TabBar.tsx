import { NavLink } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import './style.scss';

const tabBarList = [
  { icon: 'mingxi', title: '明细', to: '/' },
  { icon: 'plus', title: '记账', to: '/bookkeeping' },
  { icon: 'wode', title: '我的', to: '/my' },
];

export default function TabBar() {
  const tabBarShow = useStore((s) => s.system.tabBarShow);
  const isIOS = useStore((s) => s.system.isIOS);

  if (!tabBarShow) return null;

  return (
    <ul className={`tab-bar ${isIOS ? 'is-ios' : ''}`}>
      {tabBarList.map((tab) => (
        <li className="tab-item" key={tab.title}>
          <NavLink
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `tab-link-wrapper ${isActive ? 'active' : ''}`
            }
          >
            <div className="icon-row">
              <span className={`icon iconfont-base icon-${tab.icon}`} />
            </div>
            <p className="tab-title">{tab.title}</p>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
