import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Register.css';

const { Title, Text } = Typography;

function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { register } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 验证密码一致性，只在点击注册时检查
      if (values.password !== values.confirmPassword) {
        form.setFields([{
          name: ['confirmPassword'],
          errors: ['两次输入的密码不一致']
        }]);
        return;
      }
      
      // 准备注册数据
      const registerData = {
        username: values.username,
        password: values.password
      };
      
      // 调用AuthContext中的register函数
      await register(registerData);
      
      // 注册成功
      message.success('注册成功，请登录');
      navigate('/login');
    } catch (error) {
      // 处理错误，简化逻辑
      console.error('注册错误:', error);
      // 在确认密码文本框下方显示"用户名已存在"
      form.setFields([{ name: ['confirmPassword'], errors: ['用户名已存在'] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <Title level={2} className="register-title">游戏Hub - 注册</Title>
        <Form
          form={form}
          name="register"
          className="register-form"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名长度不能少于3个字符' },
              { max: 20, message: '用户名长度不能超过20个字符' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' },
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
              { max: 30, message: '密码长度不能超过30个字符' },
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined className="site-form-item-icon" />} 
              placeholder="请输入密码"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            rules={[
              { required: true, message: '请确认密码' },
              {
                validator: (_, value) => {
                  // 这个验证器在表单提交时会执行，但我们会在onFinish中手动处理
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined className="site-form-item-icon" />} 
              placeholder="请再次输入密码"
            />
          </Form.Item>

          <Form.Item className="register-form-actions">
            <Button 
              type="primary" 
              htmlType="submit" 
              className="register-button"
              loading={loading}
              block
            >
              注册
            </Button>
          </Form.Item>

          <div className="register-form-footer">
            <Text>已有账号？</Text>
            <Link to="/login" className="login-link">立即登录</Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;