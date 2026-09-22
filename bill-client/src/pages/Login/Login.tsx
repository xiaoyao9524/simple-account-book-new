import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Toast, Button } from 'antd-mobile';
import { useStore } from '@/store/useStore';
import { login, getUserInfo } from '@/api/admin';
import type { LoginRequestProps } from '@/types/admin';
import { useQuery } from '@/hooks/useQuery';
import NavBar from '@/components/NavBar/NavBar';
import './style.scss';

export default function Login() {
  const navigate = useNavigate();
  const query = useQuery();
  const setToken = useStore((s) => s.setToken);
  const setUserInfo = useStore((s) => s.setUserInfo);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequestProps>();

  useEffect(() => {
    if (query.failMsg) {
      Toast.show({ content: decodeURIComponent(query.failMsg), icon: 'fail' });
    }
  }, []);

  async function handlerLogin(data: LoginRequestProps) {
    try {
      const loginRes = await login(data);
      if (loginRes.status === 200) {
        setToken(loginRes.data.token);
        requestUserInfo();
      } else {
        Toast.show({ content: loginRes.message, icon: 'fail' });
      }
    } catch (err) {
      Toast.show({ content: (err as Error).message, icon: 'fail' });
    }
  }

  async function requestUserInfo() {
    try {
      const userInfoRes = await getUserInfo();
      if (userInfoRes.status === 200) {
        setUserInfo(userInfoRes.data);
        navigate(query.redirect ? decodeURIComponent(query.redirect) : '/', { replace: true });
      } else {
        Toast.show({ content: userInfoRes.message, icon: 'fail' });
      }
    } catch (err) {
      Toast.show({ content: (err as Error).message, icon: 'fail' });
    }
  }

  return (
    <div className="login-wrapper">
      <NavBar>登录</NavBar>
      <form className="login-form" onSubmit={handleSubmit(handlerLogin)}>
        <div className="form-group">
          <label className="label">用户名</label>
          <input
            className="input"
            {...register('username', {
              required: '必须输入用户名!',
              minLength: { value: 2, message: '用户名至少需要2位!' },
              pattern: { value: /^[^\d]\w{2,12}$/, message: '用户名格式不正确!' },
            })}
            placeholder="请输入用户名"
          />
          {errors.username && <p className="error">{errors.username.message}</p>}
        </div>
        <div className="form-group">
          <label className="label">密码</label>
          <input
            type="password"
            className="input"
            {...register('password', {
              required: '请输入密码',
              minLength: { value: 6, message: '密码至少需要6位!' },
            })}
            placeholder="请输入密码"
          />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>
        <div className="btn-row">
          <Button block color="primary" type="submit">
            登录
          </Button>
        </div>
        <div className="register-link">
          <a
            onClick={() => navigate(`/register?redirect=${query.redirect || '/'}`)}
          >
            注册
          </a>
        </div>
      </form>
    </div>
  );
}
