import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

const { Title, Text } = Typography;

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { login } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 使用auth context中的login方法
      await login(values);
      
      // 登录成功
      message.success('登录成功');
      navigate('/');
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
      console.error('登录错误:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <Title level={2} className="login-title">游戏Hub - 登录</Title>
        <Form
          form={form}
          name="login"
          className="login-form"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名长度不能少于3个字符' },
            ]}
          >
            <Input 
              prefix={<UserOutlined className="site-form-item-icon" />} 
              placeholder="请输入用户名"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度不能少于6个字符' },
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined className="site-form-item-icon" />} 
              placeholder="请输入密码"
            />
          </Form.Item>

          <Form.Item className="login-form-actions">
            <Button 
              type="primary" 
              htmlType="submit" 
              className="login-button"
              loading={loading}
              block
            >
              登录
            </Button>
          </Form.Item>

          <div className="login-form-footer">
            <Text>还没有账号？</Text>
            <Link to="/register" className="register-link">立即注册</Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;