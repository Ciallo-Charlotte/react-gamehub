import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Avatar, Tag, Typography, Row, Col, Spin, Button, Divider } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, EyeOutlined, MessageOutlined } from '@ant-design/icons';
import { mockNewsData } from './NewsPage'; // 从NewsPage.js导入模拟数据

// 从Typography中解构Title和Paragraph
const Title = Typography.Title;
const Paragraph = Typography.Paragraph;

const { Text } = Typography;

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟API请求获取新闻详情
    const fetchNewsDetail = async () => {
      setLoading(true);
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 查找对应的新闻
      const newsItem = mockNewsData.find(item => item.id === parseInt(id));
      setNews(newsItem);
      setLoading(false);
    };

    fetchNewsDetail();
  }, [id]);

  // 格式化阅读量
  const formatViews = (views) => {
    if (views >= 10000) {
      return (views / 10000).toFixed(1) + '万';
    }
    return views.toString();
  };

  // 返回上一页
  const handleBack = () => {
    navigate('/news');
  };

  if (loading) {
    return (
      <div className="news-detail-loading">
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="news-not-found">
        <Title level={4}>资讯未找到</Title>
        <Button type="primary" onClick={handleBack} icon={<ArrowLeftOutlined />}>
          返回资讯列表
        </Button>
      </div>
    );
  }

  return (
    <div className="news-detail-page">
      <Button type="link" onClick={handleBack} icon={<ArrowLeftOutlined />} className="back-button">
        返回资讯列表
      </Button>
      
      <Card className="news-detail-card">
        <div className="news-detail-header">
          <Title level={2} className="news-detail-title">{news.title}</Title>
          
          <Row gutter={[16, 8]} align="middle" className="news-detail-meta">
            <Col>
              <div className="author-info">
                <Avatar size={32} src={news.author.avatar} />
                <Text className="author-name">{news.author.name}</Text>
              </div>
            </Col>
            <Col>
              <div className="news-stats">
                <span className="stat-item">
                  <CalendarOutlined className="stat-icon" />
                  <Text type="secondary">{news.date}</Text>
                </span>
                <span className="stat-item">
                  <EyeOutlined className="stat-icon" />
                  <Text type="secondary">{formatViews(news.views)}</Text>
                </span>
                <span className="stat-item">
                  <MessageOutlined className="stat-icon" />
                  <Text type="secondary">{news.comments}</Text>
                </span>
              </div>
            </Col>
          </Row>
          
          <div className="news-detail-category">
            <Tag color="blue" className="category-tag">
              {news.category}
            </Tag>
          </div>
        </div>
        
        <Divider />
        
        <div className="news-detail-cover">
          <img src={news.cover} alt={news.title} className="cover-image" />
        </div>
        
        <div className="news-detail-content">
          <Paragraph className="news-detail-summary">
            {news.summary}
          </Paragraph>
          
          {/* 这里是模拟的详细内容 */}
          <Paragraph>
            这是一篇关于{news.title}的详细报道。根据最新消息，{news.summary.split('。')[0]}。
          </Paragraph>
          
          <Paragraph>
            游戏行业专家表示，这款作品很可能会成为年度最佳游戏的有力竞争者。从目前公布的信息来看，游戏在视觉表现、玩法创新和内容深度方面都有很大突破。
          </Paragraph>
          
          <Paragraph>
            我们将持续关注这款游戏的最新动态，为玩家带来第一手资讯。
          </Paragraph>
        </div>
        
        <Divider />
        
        <div className="news-detail-tags">
          <Text type="secondary">标签：</Text>
          {news.tags.map((tag, index) => (
            <Tag key={index} className="news-tag">
              {tag}
            </Tag>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default NewsDetailPage;