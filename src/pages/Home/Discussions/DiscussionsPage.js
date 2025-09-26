import React, { useState, useEffect } from 'react';
import { Card, Input, Avatar, Button, Space, Tag, Badge, Spin, Empty, Modal, Form } from 'antd';
import { SearchOutlined, MessageOutlined, EyeOutlined, HeartOutlined, StarOutlined, MoreOutlined, UserOutlined } from '@ant-design/icons';
import './DiscussionsPage.css';

const { Search, TextArea } = Input;

// 模拟讨论数据
const mockDiscussionsData = [
  {
    id: 1,
    title: '《黑神话：悟空》值得预购吗？大家怎么看？',
    content: '看到《黑神话：悟空》即将发售，游戏画面和战斗系统看起来都很出色，但价格不便宜。想听听大家的意见，这款游戏值得预购吗？有没有什么需要注意的地方？',
    author: {
      name: '游戏爱好者小张',
      avatar: 'https://picsum.photos/id/22/32/32'
    },
    date: '2024-01-15T14:30:00',
    views: 5678,
    replies: 234,
    likes: 567,
    tags: ['黑神话：悟空', '预购', '动作游戏'],
    isHot: true,
    isNew: false
  },
  {
    id: 2,
    title: '求助！《博德之门3》怎么优化角色build？',
    content: '最近刚开始玩《博德之门3》，但是对D&D规则不是很熟悉，不知道怎么搭配职业和技能。有没有大神分享一下比较强力的build？最好是适合新手的那种。',
    author: {
      name: 'RPG新手小刘',
      avatar: 'https://picsum.photos/id/23/32/32'
    },
    date: '2024-01-15T10:20:00',
    views: 4321,
    replies: 156,
    likes: 345,
    tags: ['博德之门3', '角色build', '攻略'],
    isHot: false,
    isNew: true
  },
  {
    id: 3,
    title: '现在入手PS5还是等Pro版本？',
    content: '最近想入手一台主机，在纠结是现在买PS5还是等即将推出的Pro版本。Pro版本应该会有更好的性能，但可能会贵一些。大家有什么建议吗？',
    author: {
      name: '主机玩家小陈',
      avatar: 'https://picsum.photos/id/24/32/32'
    },
    date: '2024-01-14T18:45:00',
    views: 8901,
    replies: 456,
    likes: 789,
    tags: ['PS5', '主机', '硬件'],
    isHot: true,
    isNew: false
  },
  {
    id: 4,
    title: '《原神》4.4版本深渊12层攻略分享',
    content: '刚刚满星通过了4.4版本的深渊12层，想分享一下我的配队和打法。主要用的是胡桃+行秋+钟离+香菱的蒸发队，针对新的深渊环境有一些小技巧...',
    author: {
      name: '原神攻略组小林',
      avatar: 'https://picsum.photos/id/25/32/32'
    },
    date: '2024-01-14T15:10:00',
    views: 6789,
    replies: 189,
    likes: 678,
    tags: ['原神', '深渊', '攻略'],
    isHot: false,
    isNew: false
  },
  {
    id: 5,
    title: '你最喜欢的游戏OST是哪一个？',
    content: '游戏音乐是游戏体验的重要组成部分，有些游戏的OST甚至可以单独拿出来欣赏。想听听大家最喜欢的游戏音乐是什么，最好能分享一下为什么喜欢它。',
    author: {
      name: '音乐爱好者小王',
      avatar: 'https://picsum.photos/id/26/32/32'
    },
    date: '2024-01-13T20:30:00',
    views: 3456,
    replies: 98,
    likes: 456,
    tags: ['音乐', 'OST', '讨论'],
    isHot: false,
    isNew: false
  },
  {
    id: 6,
    title: '独立游戏推荐：那些被低估的佳作',
    content: '最近玩了一些很棒的独立游戏，但发现很多人都没听说过。想在这里推荐几款我认为被严重低估的独立游戏，包括《Hades》、《Celeste》等，这些游戏的质量绝对不输3A大作...',
    author: {
      name: '独立游戏迷小赵',
      avatar: 'https://picsum.photos/id/27/32/32'
    },
    date: '2024-01-13T16:40:00',
    views: 2345,
    replies: 67,
    likes: 234,
    tags: ['独立游戏', '推荐', '单机'],
    isHot: false,
    isNew: false
  },
  {
    id: 7,
    title: '《赛博朋克2077》现在值得入手了吗？',
    content: '听说《赛博朋克2077》经过多次更新后已经改善了很多，还出了新的DLC。之前因为首发的问题没敢买，现在想问问已经玩过的朋友，游戏现在的状态如何？',
    author: {
      name: '犹豫中的小李',
      avatar: 'https://picsum.photos/id/28/32/32'
    },
    date: '2024-01-12T19:20:00',
    views: 5432,
    replies: 289,
    likes: 432,
    tags: ['赛博朋克2077', '购买建议', '开放世界'],
    isHot: true,
    isNew: false
  },
  {
    id: 8,
    title: '游戏本选购指南2024',
    content: '最近想入手一台游戏本，预算大概在8000-12000之间。看了很多评测但还是不太确定怎么选。主要用来玩3A大作，偶尔会做一些视频剪辑。有没有懂行的朋友给点建议？',
    author: {
      name: '硬件小白小陈',
      avatar: 'https://picsum.photos/id/29/32/32'
    },
    date: '2024-01-12T14:10:00',
    views: 7890,
    replies: 345,
    likes: 654,
    tags: ['游戏本', '硬件', '选购'],
    isHot: false,
    isNew: true
  }
];

const DiscussionsPage = () => {
  const [discussions, setDiscussions] = useState([]);
  const [filteredDiscussions, setFilteredDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
  const [newDiscussionContent, setNewDiscussionContent] = useState('');
  const [newDiscussionTags, setNewDiscussionTags] = useState('');

  useEffect(() => {
    // 模拟API请求
    const fetchDiscussions = async () => {
      setLoading(true);
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDiscussions(mockDiscussionsData);
      setFilteredDiscussions(mockDiscussionsData);
      setLoading(false);
    };

    fetchDiscussions();
  }, []);

  // 处理搜索
  const handleSearch = (value) => {
    setSearchQuery(value);
    const filtered = discussions.filter(
      discussion => 
        discussion.title.toLowerCase().includes(value.toLowerCase()) ||
        discussion.content.toLowerCase().includes(value.toLowerCase()) ||
        discussion.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredDiscussions(filtered);
    setCurrentPage(1); // 重置到第一页
  };

  // 计算当前页显示的数据
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentDiscussions = filteredDiscussions.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredDiscussions.length / pageSize);

  // 处理页码变化
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 打开发布讨论模态框
  const showCreateModal = () => {
    setIsModalVisible(true);
  };

  // 关闭发布讨论模态框
  const handleModalClose = () => {
    setIsModalVisible(false);
    // 清空表单数据
    setNewDiscussionTitle('');
    setNewDiscussionContent('');
    setNewDiscussionTags('');
  };

  // 提交新讨论
  const handleSubmitDiscussion = () => {
    // 验证表单
    if (!newDiscussionTitle.trim() || !newDiscussionContent.trim()) {
      return;
    }

    // 处理标签
    const tags = newDiscussionTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .slice(0, 5); // 最多5个标签

    // 创建新讨论对象
    const newDiscussion = {
      id: discussions.length + 1,
      title: newDiscussionTitle.trim(),
      content: newDiscussionContent.trim(),
      author: {
        name: '当前用户', // 实际项目中应该从用户认证系统获取
        avatar: 'https://picsum.photos/id/30/32/32' // 实际项目中应该从用户认证系统获取
      },
      date: new Date().toISOString(),
      views: 0,
      replies: 0,
      likes: 0,
      tags: tags.length > 0 ? tags : ['讨论'],
      isHot: false,
      isNew: true
    };

    // 更新讨论列表
    const updatedDiscussions = [newDiscussion, ...discussions];
    setDiscussions(updatedDiscussions);
    setFilteredDiscussions(updatedDiscussions);
    
    // 重置到第一页
    setCurrentPage(1);

    // 关闭模态框
    handleModalClose();
  };

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const hours = Math.floor(diffTime / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diffTime / (1000 * 60));
        return `${minutes}分钟前`;
      }
      return `${hours}小时前`;
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  // 生成页码按钮
  const renderPagination = () => {
    const pageButtons = [];
    
    // 首页按钮
    pageButtons.push(
      <Button 
        key="first" 
        size="small" 
        disabled={currentPage === 1}
        onClick={() => handlePageChange(1)}
      >
        首页
      </Button>
    );
    
    // 上一页按钮
    pageButtons.push(
      <Button 
        key="prev" 
        size="small" 
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        上一页
      </Button>
    );
    
    // 页码按钮
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <Button 
          key={i} 
          size="small" 
          type={currentPage === i ? "primary" : "default"}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }
    
    // 下一页按钮
    pageButtons.push(
      <Button 
        key="next" 
        size="small" 
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        下一页
      </Button>
    );
    
    // 末页按钮
    pageButtons.push(
      <Button 
        key="last" 
        size="small" 
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(totalPages)}
      >
        末页
      </Button>
    );
    
    return pageButtons;
  };

  return (
    <div className="discussions-page">
      <div className="page-header">
        <h2 className="page-title">游戏社区讨论</h2>
        <p className="page-description">与全球玩家分享你的游戏体验和想法</p>
      </div>

      <div className="search-container">
        <Search
          placeholder="搜索讨论主题、内容或标签"
          allowClear
          enterButton="搜索"
          size="large"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={handleSearch}
          className="discussions-search"
        />
        <Button type="primary" size="large" className="create-post-btn" onClick={showCreateModal}>
          发布讨论
        </Button>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" tip="加载中..." />
        </div>
      ) : filteredDiscussions.length === 0 ? (
        <div className="empty-container">
          <Empty description="暂无相关讨论" />
        </div>
      ) : (
        <>
          <div className="discussions-list">
            {currentDiscussions.map((discussion) => (
              <Card 
                key={discussion.id} 
                className="discussion-card"
                hoverable
              >
                <div className="discussion-header">
                  <div className="author-info">
                    <Avatar src={discussion.author.avatar} alt={discussion.author.name} />
                    <div className="author-details">
                      <div className="author-name">{discussion.author.name}</div>
                      <div className="post-date">{formatDate(discussion.date)}</div>
                    </div>
                  </div>
                  <div className="discussion-badges">
                    {discussion.isHot && <Badge color="red" text="热门" className="badge" />}
                    {discussion.isNew && <Badge color="green" text="新帖" className="badge" />}
                  </div>
                </div>
                
                <div className="discussion-title-container">
                  <h3 className="discussion-title">{discussion.title}</h3>
                </div>
                
                <p className="discussion-content">{discussion.content}</p>
                
                <div className="discussion-tags">
                  {discussion.tags.map((tag, index) => (
                    <Tag key={index} className="discussion-tag">{tag}</Tag>
                  ))}
                </div>
                
                <div className="discussion-footer">
                  <div className="discussion-stats">
                    <div className="stat-item">
                      <EyeOutlined className="stat-icon" />
                      <span className="stat-text">{discussion.views}</span>
                    </div>
                    <div className="stat-item">
                      <MessageOutlined className="stat-icon" />
                      <span className="stat-text">{discussion.replies}</span>
                    </div>
                    <div className="stat-item">
                      <HeartOutlined className="stat-icon" />
                      <span className="stat-text">{discussion.likes}</span>
                    </div>
                  </div>
                  <Button type="text" icon={<MoreOutlined />} className="more-btn" />
                </div>
              </Card>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="pagination-container">
              <Space className="pagination">
                {renderPagination()}
              </Space>
              <div className="page-info">
                共 {filteredDiscussions.length} 个讨论，第 {currentPage} / {totalPages} 页
              </div>
            </div>
          )}
        </>
      )}
      {/* 发布讨论模态框 */}
      <Modal
        title="发布新讨论"
        open={isModalVisible}
        onOk={handleSubmitDiscussion}
        onCancel={handleModalClose}
        okText="发布"
        cancelText="取消"
        width={600}
        okButtonProps={{ disabled: !newDiscussionTitle.trim() || !newDiscussionContent.trim() }}
      >
        <Form layout="vertical">
          <Form.Item label="讨论标题">
            <Input
              placeholder="请输入讨论标题"
              value={newDiscussionTitle}
              onChange={(e) => setNewDiscussionTitle(e.target.value)}
              maxLength={100}
              showCount
            />
          </Form.Item>
          <Form.Item label="讨论内容">
            <TextArea
              placeholder="请输入讨论内容"
              value={newDiscussionContent}
              onChange={(e) => setNewDiscussionContent(e.target.value)}
              rows={6}
              maxLength={2000}
              showCount
            />
          </Form.Item>
          <Form.Item label="标签（可选，用逗号分隔，最多5个）">
            <Input
              placeholder="例如：游戏名称,话题,类型"
              value={newDiscussionTags}
              onChange={(e) => setNewDiscussionTags(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DiscussionsPage;