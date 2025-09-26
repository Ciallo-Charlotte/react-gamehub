import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { changePassword } from '../../apis/userAPI';

const ProfilePassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const { userData } = useAuth();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // 模拟API调用
      setTimeout(async () => {
        // 实际项目中应调用API
        // const result = await changePassword(values.oldPassword, values.newPassword);
        
        // 模拟成功响应
        message.success('密码修改成功');
        form.resetFields();
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('密码修改失败:', error);
      message.error('密码修改失败，请检查输入信息');
      setLoading(false);
    }
  };

  return (
    <Card title="修改密码" className="profile-password-card">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="oldPassword"
          label="当前密码"
          rules={[{ required: true, message: '请输入当前密码' }]}
        >
          <Input.Password
            placeholder="请输入当前密码"
            iconRender={(visible) => (
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            )}
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, message: '密码长度不能小于6个字符' },
          ]}
          hasFeedback
        >
          <Input.Password
            placeholder="请输入新密码"
            iconRender={(visible) => (
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            )}
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="确认新密码"
          dependencies={['newPassword']}
          hasFeedback
          rules={[
            { required: true, message: '请确认新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="请再次输入新密码"
            iconRender={(visible) => (
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            确认修改
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProfilePassword;