import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Row, Col, Space, Card, Statistic, Divider } from 'antd';
import { HomeOutlined, FireOutlined, TrophyOutlined, MessageOutlined, UserOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentMenu, setCurrentMenu] = useState('home');
  
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
    <Layout className="layout">
      <Header className="header">
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
          {isAuthenticated ? (
            <Button onClick={() => logout()}>退出登录</Button>
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
      </Header>

      <Content className="content">
        <div className="welcome-section">
          {/* 英雄区域 */}
          <div className="hero-section">
            <Title className="welcome-title">欢迎来到 游戏Hub</Title>
            <Paragraph className="welcome-description">
              您的一站式游戏资讯、评测与讨论平台
            </Paragraph>
            <Button 
              type="primary" 
              size="large" 
              onClick={() => navigate('/news')}
              icon={<ArrowRightOutlined />}
            >
              立即开始探索
            </Button>
          </div>

          {/* 统计数据展示 */}
          <div className="stats-section">
            <Row gutter={16}>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="热门游戏" value={2500} suffix="款" />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="最新资讯" value={50000} suffix="条" />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="游戏评测" value={5000} suffix="篇" />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="活跃用户" value={1000000} suffix="+" />
                </Card>
              </Col>
            </Row>
          </div>

          <Divider orientation="center">服务功能</Divider>
          
          {/* 功能板块 */}
          <div className="features-section">
            <Title level={3} className="section-title">探索我们的服务</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card hoverable className="feature-card">
                  <div className="feature-icon hot">
                    <FireOutlined />
                  </div>
                  <Card.Meta
                    title="热门资讯"
                    description="及时了解游戏行业动态、新作发布、更新内容和电竞赛事"
                  />
                  <Button 
                    type="link" 
                    className="feature-link" 
                    onClick={() => navigate('/news')}
                    icon={<ArrowRightOutlined />}
                  >
                    查看更多
                  </Button>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card hoverable className="feature-card">
                  <div className="feature-icon trophy">
                    <TrophyOutlined />
                  </div>
                  <Card.Meta
                    title="游戏评测"
                    description="专业、公正的游戏评测，帮助您选择最适合的游戏体验"
                  />
                  <Button 
                    type="link" 
                    className="feature-link" 
                    onClick={() => navigate('/reviews')}
                    icon={<ArrowRightOutlined />}
                  >
                    查看更多
                  </Button>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card hoverable className="feature-card">
                  <div className="feature-icon message">
                    <MessageOutlined />
                  </div>
                  <Card.Meta
                    title="社区讨论"
                    description="与其他玩家交流心得、分享技巧、探讨游戏文化"
                  />
                  <Button 
                    type="link" 
                    className="feature-link" 
                    onClick={() => navigate('/discussions')}
                    icon={<ArrowRightOutlined />}
                  >
                    查看更多
                  </Button>
                </Card>
              </Col>
            </Row>
          </div>

          <Divider orientation="center">快速入口</Divider>
          
          {/* 快速访问 */}
          <div className="quick-access">
            <Title level={4}>快速访问</Title>
            <Space size="middle">
              <Button onClick={() => navigate('/login')}>登录</Button>
              <Button onClick={() => navigate('/register')}>注册</Button>
              <Button onClick={() => navigate('/profile')} icon={<UserOutlined />}>个人中心</Button>
            </Space>
          </div>
        </div>
      </Content>

      <Footer className="footer">
        <div className="footer-content">
          <Text className="footer-text">© 2024 游戏Hub. All Rights Reserved.</Text>
        </div>
      </Footer>
    </Layout>
  );
}

export default App;
