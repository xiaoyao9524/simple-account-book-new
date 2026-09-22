import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Toast, Button } from 'antd-mobile';
import { useStore } from '@/store/useStore';
import { register as registerApi, getUserInfo } from '@/api/admin';
import type { SignupRequestProps } from '@/types/admin';
import { useQuery } from '@/hooks/useQuery';
import NavBar from '@/components/NavBar/NavBar';
import './style.scss';

export default function Register() {
  const navigate = useNavigate();
  const query = useQuery();
  const setUserInfo = useStore((s) => s.setUserInfo);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupRequestProps>();
  const password = watch('password');

  async function handlerSignup(data: SignupRequestProps) {
    try {
      const res = await registerApi(data);
      if (res.status === 200) {
        Toast.show({ content: '注册成功', icon: 'success' });
        requestUserInfo();
      } else {
        Toast.show({ content: res.message, icon: 'fail' });
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
        navigate(decodeURIComponent(query.redirect) || '/', { replace: true });
      } else {
        Toast.show({ content: userInfoRes.message, icon: 'fail' });
      }
    } catch (err) {
      Toast.show({ content: (err as Error).message, icon: 'fail' });
    }
  }

  return (
    <div className="register-wrapper">
      <NavBar>注册</NavBar>
      <form className="register-form" onSubmit={handleSubmit(handlerSignup)}>
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
        <div className="form-group">
          <label className="label">确认密码</label>
          <input
            type="password"
            className="input"
            {...register('confirmPassword', {
              required: '请再次输入密码',
              validate: (val) => val === password || '两次密码输入不一致!',
            })}
            placeholder="请再次输入密码"
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
        </div>
        <div className="btn-row">
          <Button block color="primary" type="submit">
            注册
          </Button>
        </div>
      </form>
    </div>
  );
}
