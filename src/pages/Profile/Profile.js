import React from 'react';
import { Card, Avatar, Button, Upload, Row, Col, Layout, Menu, Divider } from 'antd';
import { UserOutlined, StarOutlined, HomeOutlined, LogoutOutlined } from '@ant-design/icons';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserInfo } from '../../apis/userAPI';
import { setUserInfo } from '../../store/modules/userSlice';
import './Profile.css';

const { Sider, Content } = Layout;
const { Meta } = Card;

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const reduxUser = useSelector(state => state.user.userInfo);
  const location = useLocation();
  const dispatch = useDispatch();
  
  // 使用AuthContext和Redux中的用户信息
  const userData = reduxUser || user;

  // 获取当前激活的菜单项key
  const getCurrentKey = () => {
    const path = location.pathname;
    if (path === '/profile') return 'info';
    if (path.includes('/profile/favorites')) return 'favorites';
    if (path.includes('/profile/settings')) return 'settings';
    return 'info';
  };

  // 处理头像上传
  const handleAvatarUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await updateUserInfo({ avatar: formData });
      dispatch(setUserInfo(response.data));
      return false; // 阻止默认上传行为
    } catch (error) {
      return Upload.LIST_IGNORE;
    }
  };

  // 如果未登录，显示登录提示
  if (!isAuthenticated || !userData) {
    return (
      <div className="profile-container">
        <Card 
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>个人中心</span>
              <Link to="/">
                <Button type="link" icon={<HomeOutlined />}>返回首页</Button>
              </Link>
            </div>
          } 
          className="profile-card"
        >
          <div className="not-authenticated">
            <p>请先登录</p>
            <Button type="primary" href="/login">去登录</Button>
          </div>
        </Card>
      </div>
    );
  }

  // 判断是否是基本信息首页
  const isInfoPage = location.pathname === '/profile';

  // 处理登出
  const handleLogout = async () => {
    try {
      await logout();
      // 登出后会自动重定向到登录页面，因为路由保护组件会检查用户状态
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  return (
    <div className="profile-container">
      <Card 
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>个人中心</span>
            <Link to="/">
              <Button type="link" icon={<HomeOutlined />}>返回首页</Button>
            </Link>
          </div>
        } 
        className="profile-card"
      >
        <Layout className="profile-layout">
          <Sider width={200} theme="light" className="profile-nav-sidebar">
            <Menu
              mode="inline"
              selectedKeys={[getCurrentKey()]}
              className="profile-menu"
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="info" icon={<UserOutlined />}>
                <Link to="/profile">基本信息</Link>
              </Menu.Item>
              <Menu.Item key="favorites" icon={<StarOutlined />}>
                <Link to="/profile/favorites">我的收藏</Link>
              </Menu.Item>
              {/* 移除了设置菜单项和修改密码菜单项 */}
              <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
                <span onClick={handleLogout}>登出</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Content className="profile-outlet">
            {isInfoPage && (
              <Row gutter={[24, 24]}>
                <Col xs={24} md={6}>
                  <Card className="profile-card profile-sidebar">
                    <div className="avatar-section">
                      <Upload
                        beforeUpload={handleAvatarUpload}
                        showUploadList={false}
                        className="avatar-upload"
                      >
                        <Avatar
                          size={128}
                          src={userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`}
                          className="profile-avatar"
                        >
                          <UserOutlined />
                        </Avatar>
                        <div className="avatar-upload-text">更换头像</div>
                      </Upload>
                    </div>
                    
                    <div className="user-info">
                      <h2 className="username">{userData.nickname || userData.username}</h2>
                      <p className="user-email">{userData.email}</p>
                    </div>
                    
                    <Divider />
                    
                    {/* 移除了用户统计信息（收藏游戏、评论数、注册日期） */}
                  </Card>
                </Col>
                <Col xs={24} md={18}>
                  <Outlet />
                </Col>
              </Row>
            )}
            {!isInfoPage && (
              <Outlet />
            )}
          </Content>
        </Layout>
      </Card>
    </div>
  );
};

export default Profile;