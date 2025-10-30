import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, Form, Input, message, Upload } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../store/modules/userSlice';
import './ProfileInfo.css';
const ProfileInfo = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(null);
  const { user: userData, updateUser } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        username: userData.username,
        bio: userData.bio || '',
      });
    }
  }, [userData, form]);

  const handleUpload = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempAvatar(e.target.result);
        resolve({ status: 'done', url: e.target.result });
      };
      reader.onerror = () => {
        reject(new Error('读取图片失败'));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      // 处理用户名和个人简介字段
      const { username, bio } = values;
      
      // 构建更新数据
      const updateData = { 
        username, 
        bio, 
        // 如果有临时头像，则更新头像
        ...(tempAvatar && { avatar: tempAvatar }) 
      };
      
      // 调用updateUser函数更新用户信息（已修改为调用后端API）
      await updateUser(updateData);
      
      // 清空临时头像
      setTempAvatar(null);
      message.success('个人信息更新成功');
      setIsEditing(false);
    } catch (error) {
      console.error('更新用户信息失败:', error);
      message.error(error.message || '更新失败，请检查输入信息');
    } finally {
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
              {tempAvatar ? (
                // 优先显示选择的本地临时头像
                <Avatar size={128} src={tempAvatar} />
              ) : userData?.avatar ? (
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
              rules={[{ required: false, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
            
            <Form.Item
              name="bio"
              label="个人简介"
            >
              <Input.TextArea rows={4} placeholder="介绍一下自己吧" />
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