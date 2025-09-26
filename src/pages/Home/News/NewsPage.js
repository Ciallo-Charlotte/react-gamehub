import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Avatar, Badge, Tag, Pagination, Spin } from 'antd';
import { EyeOutlined, MessageOutlined, CalendarOutlined } from '@ant-design/icons';
import './NewsPage.css';

const { Title, Paragraph, Text } = Typography;

// 模拟热门资讯数据
const mockNewsData = [
  {
    id: 1,
    title: '《赛博朋克2077》DLC「自由幻局」正式发布，夜之城迎来新篇章',
    summary: 'CD Projekt Red今日正式发布了备受期待的《赛博朋克2077》大型DLC「自由幻局」，为玩家带来全新的故事内容和游戏体验。这次的DLC不仅包含新的主线任务，还有全新的武器、装备和游戏机制，为玩家提供了数十小时的新鲜内容。',
    cover: 'https://picsum.photos/id/237/800/450',
    date: '2024-01-15',
    views: 12345,
    comments: 432,
    category: '游戏新闻',
    tags: ['赛博朋克2077', 'DLC', '开放世界'],
    author: {
      name: '游戏记者小王',
      avatar: 'https://picsum.photos/id/1/32/32'
    }
  },
  {
    id: 2,
    title: '《艾尔登法环》首个DLC「黄金树之影」销量突破500万份',
    summary: 'FromSoftware官方宣布，《艾尔登法环》首个DLC「黄金树之影」自发布以来销量已突破500万份，玩家好评如潮。这个DLC为玩家带来了全新的地图区域和BOSS挑战，难度依然保持了FromSoftware的一贯风格。',
    cover: 'https://picsum.photos/id/239/800/450',
    date: '2024-01-14',
    views: 9876,
    comments: 321,
    category: '销量数据',
    tags: ['艾尔登法环', 'DLC', '魂系游戏'],
    author: {
      name: '游戏分析师小李',
      avatar: 'https://picsum.photos/id/2/32/32'
    }
  },
  {
    id: 3,
    title: '《GTA6》官方确认开发进度顺利，预计2025年发布',
    summary: 'Rockstar Games今日在官方博客上确认，《GTA6》的开发工作进展顺利，游戏预计将在2025年正式发布。尽管官方没有透露太多游戏细节，但据业内人士分析，《GTA6》将采用全新的游戏引擎，提供更加逼真的开放世界体验。',
    cover: 'https://picsum.photos/id/240/800/450',
    date: '2024-01-13',
    views: 23456,
    comments: 876,
    category: '游戏前瞻',
    tags: ['GTA6', 'Rockstar', '开放世界'],
    author: {
      name: '游戏爆料人小张',
      avatar: 'https://picsum.photos/id/3/32/32'
    }
  },
  {
    id: 4,
    title: '《星空》最新更新修复大量bug，玩家体验显著改善',
    summary: 'Bethesda今日推送了《星空》的大型更新，修复了游戏中的大量bug和优化了性能问题，玩家体验得到显著改善。这次更新还添加了一些新的任务和内容，让玩家可以继续探索游戏中的广阔宇宙。',
    cover: 'https://picsum.photos/id/241/800/450',
    date: '2024-01-12',
    views: 8765,
    comments: 298,
    category: '更新公告',
    tags: ['星空', 'Bethesda', '开放世界RPG'],
    author: {
      name: '游戏测试员小陈',
      avatar: 'https://picsum.photos/id/4/32/32'
    }
  },
  {
    id: 5,
    title: '《英雄联盟》S14赛季正式开启，带来全新游戏机制',
    summary: '拳头游戏今日正式开启了《英雄联盟》S14赛季，带来了全新的游戏机制和平衡性调整，职业联赛也将随之展开。新赛季引入了「元素崛起」系统，让游戏的战术更加多样化，同时也对多个英雄进行了重做。',
    cover: 'https://picsum.photos/id/242/800/450',
    date: '2024-01-11',
    views: 15678,
    comments: 654,
    category: '电竞资讯',
    tags: ['英雄联盟', 'MOBA', '电竞'],
    author: {
      name: '电竞解说小刘',
      avatar: 'https://picsum.photos/id/5/32/32'
    }
  },
  {
    id: 7,
    title: '《黑神话：悟空》官方公布新实机演示，战斗系统详解',
    summary: '游戏科学今日公布了《黑神话：悟空》的全新实机演示，详细展示了游戏的战斗系统和各种技能。从演示中可以看出，游戏的战斗系统非常丰富，玩家可以使用金箍棒的多种形态进行战斗，还能变身为各种动物。',
    cover: 'https://picsum.photos/id/244/800/450',
    date: '2024-01-09',
    views: 56789,
    comments: 2345,
    category: '国产游戏',
    tags: ['黑神话：悟空', '游戏科学', '动作游戏'],
    author: {
      name: '国产游戏支持者小陈',
      avatar: 'https://picsum.photos/id/7/32/32'
    }
  },
  {
    id: 8,
    title: '《龙之信条2》正式公布，2024年夏季发售',
    summary: '卡普空今日正式公布了《龙之信条2》，这款备受期待的动作RPG游戏将于2024年夏季在各大平台发售。游戏将采用全新的游戏引擎，提供更加广阔的开放世界和更加流畅的战斗体验。',
    cover: 'https://picsum.photos/id/245/800/450',
    date: '2024-01-08',
    views: 18901,
    comments: 789,
    category: '游戏公布',
    tags: ['龙之信条2', '卡普空', '动作RPG'],
    author: {
      name: '动作游戏爱好者小张',
      avatar: 'https://picsum.photos/id/8/32/32'
    }
  }
];

const NewsPage = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    // 模拟API请求
    const fetchNews = async () => {
      setLoading(true);
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNewsData(mockNewsData);
      setLoading(false);
    };

    fetchNews();
  }, []);

  // 计算当前页显示的数据
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentNews = newsData.slice(startIndex, endIndex);

  // 处理分页变化
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // 格式化阅读量
  const formatViews = (views) => {
    if (views >= 10000) {
      return (views / 10000).toFixed(1) + '万';
    }
    return views.toString();
  };

  return (
    <div className="news-page">
      <div className="page-header">
        <Title level={2} className="page-title">
          <Badge color="red" text="热门" className="hot-badge" />
          游戏资讯
        </Title>
        <Paragraph className="page-description">
          最新、最热门的游戏行业动态，一手掌握
        </Paragraph>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" tip="加载中..." />
        </div>
      ) : (
        <>
          <Row gutter={[24, 24]} className="news-grid">
            {currentNews.map((news) => (
              <Col xs={24} sm={12} lg={8} key={news.id}>
                <Card
                  hoverable
                  cover={
                    <div className="news-cover-container">
                      <div className="no-image-placeholder">
                        {news.title}
                      </div>
                      <Tag color="blue" className="news-category">
                        {news.category}
                      </Tag>
                    </div>
                  }
                  className="news-card"
                >
                  <Title level={4} className="news-title">
                    {news.title}
                  </Title>
                  <Paragraph ellipsis={{ rows: 3 }} className="news-summary">
                    {news.summary}
                  </Paragraph>
                  
                  <div className="news-meta">
                    <div className="author-info">
                      <Avatar size={24} src={news.author.avatar} />
                      <Text className="author-name">{news.author.name}</Text>
                    </div>
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
                  </div>

                  <div className="news-tags">
                    {news.tags.map((tag, index) => (
                      <Tag key={index} className="news-tag">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="pagination-container">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={newsData.length}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `共 ${total} 条资讯`}
              pageSizeOptions={['6', '12', '24']}
              className="news-pagination"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default NewsPage;