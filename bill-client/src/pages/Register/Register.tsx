import { useNavigate } from 'react-router';
import { Form, Input, Toast, Button } from 'antd-mobile';
import { register as registerApi } from '@/api/user';
import type { SignupRequestProps } from '@/types/admin';
import NavBar from '@/components/NavBar/NavBar';
import './style.scss';

export default function Register() {
  interface RegisterFormData extends SignupRequestProps {
    confirmPassword: string;
  }

  const navigate = useNavigate();

  const [form] = Form.useForm()

  async function handlerSignup(formData: RegisterFormData) {
    const data = {
      username: formData.username,
      password: formData.password
    }

    const res = await registerApi(data);

    if (res) {
      Toast.show({ content: '注册成功，请登录', icon: 'success' });

      navigate('/login', { replace: true });
    }
  }

  const checkConfirmPassword = (_: unknown, confirmPassword: string) => {
    const password = form.getFieldValue('password');

    return password === confirmPassword ? Promise.resolve() : Promise.reject(new Error('两次密码输入不一致!'));
  }

  return (
    <div className="register-wrapper">
      <NavBar>注册</NavBar>
      <Form
        form={form}
        name='form'
        onFinish={handlerSignup}
        footer={
          <Button block type='submit' color='primary' size='large'>
            提交
          </Button>
        }
      >
        <Form.Item name='username' label='用户名' rules={[{ required: true, message: '请输入用户名' }, { type: 'string', min: 2, max: 8, message: '用户名长度为2-8个字符！' }, { pattern: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/, message: '用户名必须以字母或汉字开头，只能包含字母、汉字、数字，长度2~8' }]}>
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item name='password' label='密码' rules={[{ required: true, message: '请输入密码' }, { type: 'string', min: 8, max: 12, message: '密码长度为8-12个字符！' }]}>
          <Input type="password" placeholder="请输入密码" />
        </Form.Item>
        <Form.Item name='confirmPassword' label='确认密码' rules={[{ required: true, message: '请再次输入密码' }, { validator: checkConfirmPassword }]}>
          <Input type="password" placeholder="请再次输入密码" />
        </Form.Item>
      </Form>
    </div>
  );
}
