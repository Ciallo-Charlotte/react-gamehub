import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, Form, Input, message, Upload } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../store/modules/userSlice';
import './ProfileInfo.css';
const ProfileInfo = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        username: userData.username,
        email: userData.email,
        bio: userData.bio || '',
        location: userData.location || '',
        website: userData.website || '',
        socialMedia: userData.socialMedia || '',
      });
    }
  }, [userData, form]);

  const handleUpload = async (info) => {
    // 上传逻辑
    console.log('Upload:', info);
    // 这里可以添加实际的上传实现
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      // 模拟API调用
      setTimeout(() => {
        const updatedUser = { ...userData, ...values };
        dispatch(setUserInfo(updatedUser));
        message.success('个人信息更新成功');
        setIsEditing(false);
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('更新失败，请检查输入信息');
      setLoading(false);
    }
  };

  return (
    <Card className="profile-info-card">
      {isEditing ? (
        // 编辑模式：显示完整表单
        <div className="edit-content">
          <div className="edit-avatar-section">
            <Upload
              name="avatar"
              listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={handleUpload}
            >
              {userData?.avatar ? (
                <Avatar size={128} src={userData.avatar} />
              ) : (
                <Avatar size={128} icon={<UserOutlined />}>
                  {(userData?.username?.[0]?.toUpperCase()) || 'U'}
                </Avatar>
              )}
            </Upload>
            <p className="avatar-hint">点击更换头像</p>
          </div>
          
          <Form
            form={form}
            layout="vertical"
            className="info-form"
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
            
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱地址' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input placeholder="请输入邮箱地址" />
            </Form.Item>
            
            <Form.Item
              name="bio"
              label="个人简介"
            >
              <Input.TextArea rows={4} placeholder="介绍一下自己吧" />
            </Form.Item>
            
            <Form.Item
              name="location"
              label="所在地"
            >
              <Input placeholder="如：北京市" />
            </Form.Item>
            
            <Form.Item
              name="website"
              label="个人网站"
              rules={[
                {
                  pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([/\w \.-]*)*\/?$/, 
                  message: '请输入有效的网站地址'
                }
              ]}
            >
              <Input placeholder="如：https://example.com" />
            </Form.Item>
            
            <Form.Item
              name="socialMedia"
              label="社交媒体"
            >
              <Input placeholder="如：微博: @用户名" />
            </Form.Item>
            
            <Form.Item>
              <div className="form-actions">
                <Button onClick={() => setIsEditing(false)} style={{ marginRight: 8 }}>
                  取消
                </Button>
                <Button type="primary" onClick={handleSave} loading={loading}>
                  <SaveOutlined /> 保存
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      ) : (
        // 查看模式：只显示基本信息
        <div className="view-content">
          <div className="user-details">
            {userData?.bio ? (
              <p className="bio">{userData.bio}</p>
            ) : (
              <p className="bio">暂无个人简介</p>
            )}
            <div className="additional-info">
              <p><strong>用户ID：</strong>{userData?.id || '未知'}</p>
              {userData?.location && <p><strong>所在地：</strong>{userData.location}</p>}
              {userData?.website && <p><strong>个人网站：</strong><a href={userData.website} target="_blank" rel="noopener noreferrer">{userData.website}</a></p>}
              {userData?.socialMedia && (
                <p><strong>社交媒体：</strong>{userData.socialMedia}</p>
              )}
              {userData?.joinDate && <p><strong>注册日期：</strong>{userData.joinDate}</p>}
            </div>
            <Button type="primary" onClick={() => setIsEditing(true)}>
              <EditOutlined /> 编辑资料
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProfileInfo;