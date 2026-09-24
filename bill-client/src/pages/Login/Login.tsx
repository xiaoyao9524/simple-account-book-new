import { useNavigate } from 'react-router';
import { Form, Input, Button } from 'antd-mobile';
import useTokenStore from '@/store/useTokenStore';
import useUserStore from '@/store/useUserStore';
import useQuery from '@/hooks/useQuery';
import { login } from '@/api/user';
import type { LoginRequestProps } from '@/types/admin';
import NavBar from '@/components/NavBar/NavBar';
import './style.scss';

export default function Login() {
  const navigate = useNavigate();
  const query = useQuery();
  const setToken = useTokenStore((state) => state.setToken);
  const setUserInfo = useUserStore(state => state.setUserInfo);
  const [form] = Form.useForm()

  async function handlerLogin(data: LoginRequestProps) {
    const loginRes = await login(data);

    if (loginRes) {
      setToken(loginRes.data.token);
      setUserInfo(loginRes.data.userInfo);

      navigate(query.redirect ? decodeURIComponent(query.redirect) : '/', { replace: true });
    }
  }

  const toRegister = () => {
    navigate('/register');
  }

  return (
    <div className="login-wrapper">
      <NavBar>登录</NavBar>
      <Form
        form={form}
        name='form'
        onFinish={handlerLogin}
        footer={
          <>
            <Button block type='submit' color='primary' size='large'>
              提交
            </Button>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <Button fill='none' style={{ color: '#8b5cf6' }} onClick={toRegister}>
                注册
              </Button>
            </div>
          </>
        }
      >
        <Form.Item name='username' label='用户名' rules={[{ required: true, message: '请输入用户名' }, { type: 'string', min: 2, max: 8, message: '用户名长度为2-8个字符！' }, { pattern: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/, message: '用户名必须以字母或汉字开头，只能包含字母、汉字、数字，长度2~8' }]}>
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item name='password' label='密码' rules={[{ required: true, message: '请输入密码' }, { type: 'string', min: 8, max: 12, message: '密码长度为8-12个字符！' }]}>
          <Input type="password" placeholder="请输入密码" />
        </Form.Item>
      </Form>
    </div>
  );
}
