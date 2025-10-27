import React from 'react';
import { Card, Avatar, Button, Row, Col, Layout, Menu, Divider } from 'antd';
import { UserOutlined, StarOutlined, HomeOutlined, LogoutOutlined } from '@ant-design/icons';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSelector } from 'react-redux';
import './Profile.css';

const { Sider, Content } = Layout;


const Profile = () => {
  const { user, isLoading, logout } = useAuth();
  const reduxUser = useSelector(state => state.user.userInfo);
  const location = useLocation();
  
  // 计算认证状态
  const isAuthenticated = !!user || !!reduxUser;
  
  // 使用AuthContext和Redux中的用户信息
  const userData = reduxUser || user;

  // 获取当前激活的菜单项key
  const getCurrentKey = () => {
    const path = location.pathname;
    if (path === '/profile') return 'info';
    if (path.includes('/profile/favorites')) return 'favorites';
    return 'info';
  };



  // 加载状态处理
  if (isLoading) {
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
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p>加载中...</p>
          </div>
        </Card>
      </div>
    );
  }

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
                      <Avatar
                        size={128}
                        src={userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`}
                        className="profile-avatar"
                      >
                        <UserOutlined />
                      </Avatar>
                    </div>
                    
                    <div className="user-info" style={{ textAlign: 'center' }}>
                      <h2 className="username">{userData.nickname || userData.username}</h2>
                      <p className="user-email">{userData.email}</p>
                    </div>
                    
                    <Divider />
                    
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