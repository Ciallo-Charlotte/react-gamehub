import React from 'react';
import { Layout, Typography, Button, Row, Col, Card, Statistic, Divider } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Layout className="home-layout">
      <Content className="home-content">
      <div className="welcome-section">
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
      
      {/* 服务功能展示 */}
      <div className="features-section">
        <Row gutter={[16, 24]} justify="center">
          {/* 游戏资讯卡片 */}
          <Col xs={24} sm={12} md={6}>
            <Card className="feature-card" onClick={() => navigate('/news')}>
              <div className="feature-icon">📰</div>
              <Title level={4}>游戏资讯</Title>
              <Paragraph>获取最新游戏新闻、更新公告和行业动态，掌握游戏世界的每一个脉动。</Paragraph>
            </Card>
          </Col>
          
          {/* 游戏评测卡片 */}
          <Col xs={24} sm={12} md={6}>
            <Card className="feature-card" onClick={() => navigate('/reviews')}>
              <div className="feature-icon">⭐</div>
              <Title level={4}>游戏评测</Title>
              <Paragraph>深入专业的游戏评测，帮助您在众多游戏中找到最适合自己的作品。</Paragraph>
            </Card>
          </Col>
          
          {/* 讨论社区卡片 */}
          <Col xs={24} sm={12} md={6}>
            <Card className="feature-card" onClick={() => navigate('/discussions')}>
              <div className="feature-icon">💬</div>
              <Title level={4}>讨论社区</Title>
              <Paragraph>加入活跃的游戏社区，分享游戏心得，结交志同道合的游戏伙伴。</Paragraph>
            </Card>
          </Col>
          
          {/* 个人收藏卡片 */}
          <Col xs={24} sm={12} md={6}>
            <Card className="feature-card" onClick={() => navigate('/profile/favorites')}>
              <div className="feature-icon">❤️</div>
              <Title level={4}>个人收藏</Title>
              <Paragraph>收藏喜爱的游戏和内容，创建个性化的游戏列表，随时跟踪游戏动态。</Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
      </div>
      </Content>
    </Layout>
  );
};

export default HomePage;