import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Row, Col, Avatar, Dropdown, Menu } from 'antd';
import { HomeOutlined, FireOutlined, TrophyOutlined, MessageOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import './HomeLayout.css';

const { Content } = Layout;
const { Title, Text } = Typography;

const HomeLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentMenu, setCurrentMenu] = useState('home');
  const isAuthenticated = !!user;

  // 根据当前路径更新选中的菜单
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setCurrentMenu('home');
    } else if (path.startsWith('/news')) {
      setCurrentMenu('news');
    } else if (path.startsWith('/reviews')) {
      setCurrentMenu('reviews');
    } else if (path.startsWith('/discussions')) {
      setCurrentMenu('discussions');
    }
  }, [location.pathname]);
  
  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // 格式化当前时间
  const formatTime = (date) => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const menuItems = [
    { key: 'home', icon: <HomeOutlined />, label: '首页', path: '/' },
    { key: 'news', icon: <FireOutlined />, label: '热门资讯', path: '/news' },
    { key: 'reviews', icon: <TrophyOutlined />, label: '游戏评测', path: '/reviews' },
    { key: 'discussions', icon: <MessageOutlined />, label: '社区讨论', path: '/discussions' }
  ];

  const handleMenuClick = (key) => {
    setCurrentMenu(key);
    const menu = menuItems.find(item => item.key === key);
    if (menu) {
      // 强制刷新导航，确保正确切换组件
      navigate(menu.path, { replace: true });
    }
  };

  // 点击logo返回首页
  const handleLogoClick = () => {
    setCurrentMenu('home');
    navigate('/', { replace: true });
  };

  return (
    <Layout className="home-layout">
      {/* 复制的导航栏 */}
      <div className="app-header">
        <div className="logo">
          <Title 
            level={3} 
            style={{ color: 'white', margin: 0, lineHeight: '64px', cursor: 'pointer' }}
            onClick={handleLogoClick}
          >
            <HomeOutlined /> 游戏Hub
          </Title>
        </div>
        
        {/* 水平导航菜单 */}
        <div className="main-menu">
          <Row gutter={0} className="menu-row">
            {menuItems.map(item => (
              <Col key={item.key}>
                <Button
                  type="text"
                  className={`menu-button ${currentMenu === item.key ? 'active' : ''}`}
                  icon={item.icon}
                  onClick={() => handleMenuClick(item.key)}
                  style={{ 
                    color: currentMenu === item.key ? '#1890ff' : 'white',
                    backgroundColor: currentMenu === item.key ? 'white' : 'transparent'
                  }}
                >
                  {item.label}
                </Button>
              </Col>
            ))}
          </Row>
        </div>
        
        <div className="header-actions">
          <Text className="time-display">{formatTime(currentTime)}</Text>
          {isLoading ? (
            <Button loading>加载中...</Button>
          ) : isAuthenticated ? (
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="profile" onClick={() => navigate('/profile')}>
                    <UserOutlined /> 个人中心
                  </Menu.Item>
                  <Menu.Item key="logout" onClick={() => logout()}>
                    退出登录
                  </Menu.Item>
                </Menu>
              }
              trigger={['click']}
            >
              <Button>
                <Avatar size="small" src={user?.avatar || undefined} icon={<UserOutlined />} />
                {user?.username || '用户'} <DownOutlined />
              </Button>
            </Dropdown>
          ) : (
            <>
              <Button className="login-button">
                <Link to="/login">登录</Link>
              </Button>
              <Button type="primary" className="register-button">
                <Link to="/register">注册</Link>
              </Button>
            </>
          )}
        </div>
      </div>
      
      <Content className="home-content">

        {/* 子路由内容区域 */}
        <div className="home-outlet">
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default HomeLayout;