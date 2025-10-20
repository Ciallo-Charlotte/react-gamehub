import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, Tag, Avatar, Rate, Button, Modal, Badge, Space, Typography, Input } from 'antd';
import { StarOutlined, StarFilled, EyeOutlined, MessageOutlined, CalendarOutlined, LikeOutlined } from '@ant-design/icons';
import './ReviewsPage.css';
const { Title } = Typography;
const { TextArea } = Input;

// 自定义评论组件，替代antd的Comment组件
const CustomComment = ({ author, avatar, datetime, content }) => (
  <div className="custom-comment">
    <div className="comment-header">
      <Avatar src={avatar} alt={author} />
      <div className="comment-info">
        <div className="comment-author">{author}</div>
        <div className="comment-time">{datetime}</div>
      </div>
    </div>
    <div className="comment-content">{content}</div>
  </div>
);

// 模拟游戏评测数据
const mockReviewData = [
  {
    id: 1,
    title: '《博德之门3》：CRPG的新标杆',
    summary: '《博德之门3》是拉瑞安工作室的最新力作，这款游戏不仅完美继承了经典CRPG的深度和复杂性，还在现代游戏设计方面做出了杰出的创新。游戏的剧情分支非常丰富，玩家的每个选择都会对游戏世界产生深远的影响。',
    cover: 'https://picsum.photos/id/237/800/450',
    date: '2024-01-15',
    views: 89012,
    likes: 7890,
    comments: 3456,
    rating: 4.8,
    category: '角色扮演',
    tags: ['CRPG', 'D&D', '开放世界'],
    author: {
      name: '资深游戏评测师老王',
      avatar: 'https://picsum.photos/id/1/32/32'
    },
    reviewContent: `作为一名有着多年CRPG游戏经验的玩家，我必须说《博德之门3》是近年来最令人印象深刻的游戏之一。游戏的剧情设计非常出色，每个角色都有自己丰富的背景故事和动机。战斗系统深度十足，需要玩家仔细思考每一步行动。画面表现也非常精美，每个场景都经过精心设计。

特别值得称赞的是游戏的自由度，玩家可以按照自己的意愿塑造角色，做出各种选择。这些选择不仅会影响游戏的进程，还会改变角色之间的关系。游戏中有大量的支线任务和隐藏内容，保证了极高的重玩价值。

当然，游戏也有一些小缺点，比如某些场景加载时间较长，以及后期战斗可能会有些重复。但总的来说，《博德之门3》绝对是一款值得所有RPG爱好者体验的杰作。`,
    commentList: [
      {
        author: 'RPG爱好者小李',
        avatar: 'https://picsum.photos/id/2/32/32',
        datetime: '2024-01-15 14:30',
        content: '完全同意！这是我今年玩过的最好的RPG游戏，剧情分支真的很丰富，每次重玩都有新的发现。'
      },
      {
        author: '策略游戏玩家小张',
        avatar: 'https://picsum.photos/id/3/32/32',
        datetime: '2024-01-15 16:45',
        content: '战斗系统确实很有深度，但对新手来说可能有点复杂。建议新手玩家先从简单难度开始，熟悉系统后再挑战更高难度。'
      },
      {
        author: '游戏评论家小陈',
        avatar: 'https://picsum.photos/id/4/32/32',
        datetime: '2024-01-16 09:15',
        content: '我觉得游戏的剧情节奏有点慢，但一旦投入进去，就会发现这种慢节奏其实是为了更好地构建世界观和角色。拉瑞安的讲故事能力确实一流。'
      }
    ]
  },
  {
    id: 2,
    title: '《塞尔达传说：王国之泪》：开放世界的新高度',
    summary: '任天堂的《塞尔达传说：王国之泪》为开放世界游戏设定了新的标准。游戏的物理引擎和构建系统允许玩家创造出令人难以置信的装置和解决方案，真正实现了"创意无极限"的理念。',
    cover: 'https://picsum.photos/id/239/800/450',
    date: '2024-01-14',
    views: 76543,
    likes: 6543,
    comments: 2345,
    rating: 4.9,
    category: '动作冒险',
    tags: ['塞尔达', '开放世界', '创意'],
    author: {
      name: '游戏记者小林',
      avatar: 'https://picsum.photos/id/5/32/32'
    },
    reviewContent: `《塞尔达传说：王国之泪》不仅仅是一款游戏，更是一个让玩家释放创造力的平台。游戏的构建系统极其强大，玩家可以创造出各种各样的装置来解决谜题和击败敌人。这种自由度在游戏史上是前所未有的。

游戏的地图设计也非常出色，天空和地下的加入大大扩展了探索的范围。每个区域都有自己独特的生态系统和挑战，保证了探索的乐趣。主线剧情虽然不是特别复杂，但情感表达非常到位，特别是与塞尔达的互动场景让人印象深刻。

作为一款Switch游戏，《王国之泪》的画面表现也超出了硬件的限制，每个场景都充满了细节和活力。音乐更是锦上添花，完美地烘托了游戏的氛围。总的来说，这是一款几乎完美的游戏，为开放世界游戏树立了新的标杆。`,
    commentList: [
      {
        author: '任天堂粉丝小刘',
        avatar: 'https://picsum.photos/id/6/32/32',
        datetime: '2024-01-14 12:15',
        content: '创造系统太神奇了！我花了几个小时只是建造各种奇怪的机器，完全停不下来。'
      },
      {
        author: '老玩家老赵',
        avatar: 'https://picsum.photos/id/7/32/32',
        datetime: '2024-01-14 19:30',
        content: '相比《旷野之息》，《王国之泪》在很多方面都有了明显的进步，但我觉得地下区域的设计有些重复，希望续作能改进这一点。'
      }
    ]
  },
  {
    id: 3,
    title: '《赛博朋克2077》：从失败到救赎的典范',
    summary: '经历了灾难性的发售之后，CD Projekt Red通过不断的更新和DLC将《赛博朋克2077》转变为一款真正优秀的游戏。最新的DLC《自由幻局》为夜之城带来了新的故事和玩法，让这款游戏终于实现了它的潜力。',
    cover: 'https://picsum.photos/id/240/800/450',
    date: '2024-01-13',
    views: 65432,
    likes: 5432,
    comments: 4567,
    rating: 4.2,
    category: '开放世界',
    tags: ['赛博朋克', '第一人称', '剧情'],
    author: {
      name: '游戏分析师小陈',
      avatar: 'https://picsum.photos/id/8/32/32'
    },
    reviewContent: `《赛博朋克2077》的故事是游戏史上少见的从失败到救赎的例子。游戏发售时的问题确实很多，包括技术缺陷、内容缺失和性能问题。但CD Projekt Red没有放弃，而是通过不断的更新和补丁逐渐修复了这些问题。

现在的《赛博朋克2077》已经是一款非常出色的游戏。夜之城的氛围营造一流，每个角落都充满了细节和故事。主线剧情扣人心弦，角色塑造也非常成功，特别是强尼·银手这个角色给人留下了深刻的印象。

最新的DLC《自由幻局》更是为游戏增添了新的活力，新的区域、新的角色和新的玩法都非常精彩。虽然游戏仍然存在一些小问题，但总体来说，《赛博朋克2077》已经成为了一款值得一玩的优秀游戏，展示了游戏公司如何从失败中站起来。`,
    commentList: [
      {
        author: '夜之城居民小马',
        avatar: 'https://picsum.photos/id/9/32/32',
        datetime: '2024-01-13 10:45',
        content: '作为首发玩家，我亲眼见证了这款游戏的成长。现在的体验确实比发售时好了很多，值得重新体验。'
      },
      {
        author: '剧情党小王',
        avatar: 'https://picsum.photos/id/10/32/32',
        datetime: '2024-01-13 20:20',
        content: '剧情真的很棒，但有些支线任务的设计还是有点重复。不过自由幻局DLC的任务设计有了明显的进步。'
      }
    ]
  },
  {
    id: 4,
    title: '《星空》：B社的太空冒险',
    summary: 'Bethesda的《星空》是一款充满野心的太空RPG，游戏提供了数百个星球供玩家探索，每个星球都有自己独特的生态系统和资源。虽然游戏在某些方面表现出色，但也存在一些令人失望的地方。',
    cover: 'https://picsum.photos/id/241/800/450',
    date: '2024-01-12',
    views: 54321,
    likes: 4321,
    comments: 3210,
    rating: 3.8,
    category: '角色扮演',
    tags: ['太空', '开放世界', 'B社'],
    author: {
      name: '科幻游戏爱好者小张',
      avatar: 'https://picsum.photos/id/11/32/32'
    },
    reviewContent: `《星空》是一款让人既兴奋又有些失望的游戏。从好的方面来说，游戏的太空探索概念非常吸引人，能够在数百个星球之间自由穿梭确实让人感觉很过瘾。角色定制系统非常细致，技能树也提供了多样化的玩法选择。

然而，游戏也存在一些明显的问题。虽然有数百个星球，但很多星球都显得过于相似和空旷，探索一段时间后就会感到无聊。任务设计也比较传统，缺乏创新。此外，游戏的性能优化也不够理想，即使在高性能PC上也会出现帧率波动。

总的来说，《星空》是一款有潜力但未能完全实现的游戏。如果你是B社游戏的粉丝，或者对太空探索题材特别感兴趣，那么这款游戏仍然值得一玩。但如果你期望它能像《上古卷轴5》或《辐射4》那样成为经典，可能会感到失望。`,
    commentList: [
      {
        author: 'B社忠实粉丝小陈',
        avatar: 'https://picsum.photos/id/12/32/32',
        datetime: '2024-01-12 15:30',
        content: '我觉得游戏还是很有B社特色的，任务系统虽然传统但很有趣。希望后续更新能改进星球探索的体验。'
      },
      {
        author: '太空迷小李',
        avatar: 'https://picsum.photos/id/13/32/32',
        datetime: '2024-01-12 18:45',
        content: '太空战斗系统不错，但星球探索确实有点单调。希望未来的DLC能带来更有特色的星球和任务。'
      }
    ]
  },
  {
    id: 5,
    title: '《莱莎的炼金工房3》：炼金RPG的巅峰之作',
    summary: '光荣特库摩的《莱莎的炼金工房3》为炼金RPG设定了新的标准。游戏不仅改进了前作的炼金系统，还增加了新的探索和战斗要素，让整个游戏体验更加流畅和有趣。',
    cover: 'https://picsum.photos/id/242/800/450',
    date: '2024-01-11',
    views: 43210,
    likes: 3210,
    comments: 1234,
    rating: 4.5,
    category: '角色扮演',
    tags: ['炼金', '可爱', 'JRPG'],
    author: {
      name: 'JRPG爱好者小刘',
      avatar: 'https://picsum.photos/id/14/32/32'
    },
    reviewContent: `作为《莱莎的炼金工房》系列的第三部作品，《莱莎的炼金工房3》在很多方面都达到了系列的巅峰。炼金系统得到了进一步的简化和优化，新玩家更容易上手，同时也保留了足够的深度供老玩家探索。

游戏的战斗系统也有了明显的改进，更加注重动作性和策略性的结合。角色的成长系统非常丰富，玩家可以根据自己的喜好培养不同风格的角色。

剧情方面，虽然仍然保持了系列一贯的轻松愉快风格，但角色之间的情感描写更加细腻，特别是莱莎和她的朋友们之间的友谊让人印象深刻。画面表现也非常出色，角色设计可爱动人，场景描绘精美细腻。

总的来说，《莱莎的炼金工房3》是一款非常出色的炼金RPG，无论是新玩家还是老粉丝都能从中获得乐趣。如果你喜欢轻松愉快的RPG游戏，那么这款游戏绝对值得一试。`,
    commentList: [
      {
        author: '炼金爱好者小王',
        avatar: 'https://picsum.photos/id/15/32/32',
        datetime: '2024-01-11 11:20',
        content: '炼金系统真的太有趣了！我花了好几个小时只是实验各种不同的配方，每次成功制作出新道具都很有成就感。'
      },
      {
        author: 'JRPG老玩家老张',
        avatar: 'https://picsum.photos/id/16/32/32',
        datetime: '2024-01-11 17:10',
        content: '相比前两作，这一作的战斗系统流畅了很多，不再像之前那样拖节奏。剧情虽然简单但很温馨，适合放松的时候玩。'
      }
    ]
  },
  {
    id: 6,
    title: '《原神》4.4版本评测：璃月海灯节活动再创新高',
    summary: '米哈游的《原神》4.4版本带来了备受期待的璃月海灯节活动，同时也引入了新的角色和地图区域。这个版本不仅在内容上丰富了游戏，还在玩法上做出了一些有趣的创新。',
    cover: 'https://picsum.photos/id/243/800/450',
    date: '2024-01-10',
    views: 98765,
    likes: 8765,
    comments: 5678,
    rating: 4.6,
    category: '开放世界',
    tags: ['原神', '米哈游', '二次元'],
    author: {
      name: '原神攻略作者小林',
      avatar: 'https://picsum.photos/id/17/32/32'
    },
    reviewContent: `《原神》4.4版本的璃月海灯节活动无疑是游戏迄今为止最精彩的节日活动之一。活动内容非常丰富，包括解谜、战斗和探索等多种元素。特别是新增的「纸映戏」玩法非常有创意，将传统的皮影戏艺术与游戏玩法相结合，给玩家带来了全新的体验。

新版本引入的新角色表现也非常出色，不仅设计精美，技能机制也很有特色，为游戏的战斗系统增添了新的可能性。新增的地图区域虽然不大，但设计非常用心，每个角落都充满了细节和惊喜。

此外，米哈游在这个版本中也对游戏的一些系统进行了优化，包括界面改进和性能优化等。这些优化虽然不如新内容那么引人注目，但确实提升了整体的游戏体验。

总的来说，《原神》4.4版本是一个非常成功的更新，不仅为老玩家带来了新鲜的内容，也为新玩家提供了加入游戏的好时机。如果你是《原神》的粉丝，那么这个版本绝对不容错过。`,
    commentList: [
      {
        author: '原神老玩家小张',
        avatar: 'https://picsum.photos/id/18/32/32',
        datetime: '2024-01-10 13:45',
        content: '海灯节活动真的太棒了！特别是纸映戏的玩法，既有创意又有趣味性。希望未来的活动也能保持这种创新精神。'
      },
      {
        author: '新玩家小刘',
        avatar: 'https://picsum.photos/id/19/32/32',
        datetime: '2024-01-10 21:30',
        content: '刚玩不久，正好赶上这个版本。海灯节的氛围真的很好，剧情也很感人，让我对这个游戏有了更深的了解。'
      }
    ]
  }
];

const ReviewsPage = () => {
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    // 模拟API请求
    const fetchReviews = async () => {
      setLoading(true);
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReviewData(mockReviewData);
      setLoading(false);
    };

    fetchReviews();
  }, []);

  // 计算当前页显示的数据
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentReviews = reviewData.slice(startIndex, endIndex);

  // 处理分页变化
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // 打开详情弹窗
  const showReviewDetails = (review) => {
    setSelectedReview(review);
    setIsModalVisible(true);
  };

  // 关闭详情弹窗
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedReview(null);
  };

  // 格式化阅读量
  const formatViews = (views) => {
    if (views >= 10000) {
      return (views / 10000).toFixed(1) + '万';
    }
    return views.toString();
  };

  // 发布评论
  const handlePublishComment = () => {
    if (!commentText.trim() || !selectedReview) return;
    
    // 创建新评论
    const newComment = {
      author: '当前用户', // 实际项目中应该从用户认证系统获取
      avatar: 'https://picsum.photos/id/20/32/32', // 实际项目中应该从用户认证系统获取
      datetime: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      content: commentText.trim()
    };
    
    // 更新选中的评论详情，添加新评论
    const updatedReview = {
      ...selectedReview,
      commentList: [...selectedReview.commentList, newComment],
      comments: selectedReview.comments + 1 // 更新评论数量
    };
    
    // 更新状态
    setSelectedReview(updatedReview);
    
    // 同时更新reviewData中的评论数量
    const updatedReviewData = reviewData.map(review => 
      review.id === selectedReview.id ? updatedReview : review
    );
    setReviewData(updatedReviewData);
    
    // 清空评论输入框
    setCommentText('');
  };

  return (
    <div className="reviews-page">
      <div className="page-header">
        <Title level={2} className="page-title">
          <Badge color="gold" text="精选" className="featured-badge" />
          游戏评测
        </Title>
        <p className="page-description">
          专业、客观的游戏评测，助你找到心仪的游戏
        </p>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" tip="加载中..." />
        </div>
      ) : (
        <>
          <Row gutter={[24, 24]}>
            {currentReviews.map((review) => (
              <Col xs={24} sm={12} lg={8} key={review.id}>
                <Card
                  hoverable
                  cover={
                    <div className="review-cover-container">
                      <div className="no-image-placeholder">
                        {review.title}
                      </div>
                      <Tag color="gold" className="review-category">
                        {review.category}
                      </Tag>
                    </div>
                  }
                  className="review-card"
                >
                  <Title level={4} className="review-title">
                    {review.title}
                  </Title>
                  
                  <div className="rating-container">
                    <Rate disabled defaultValue={review.rating} precision={0.1} className="review-rating" />
                    <span className="rating-score">{review.rating.toFixed(1)}</span>
                  </div>
                  
                  <p className="review-summary">
                    {review.summary}
                  </p>
                  
                  <div className="review-meta">
                    <div className="author-info">
                      <Avatar size={24} src={review.author.avatar} />
                      <span className="author-name">{review.author.name}</span>
                    </div>
                    <div className="review-stats">
                      <span className="stat-item">
                        <CalendarOutlined className="stat-icon" />
                        <span className="stat-text">{review.date}</span>
                      </span>
                      <span className="stat-item">
                        <EyeOutlined className="stat-icon" />
                        <span className="stat-text">{formatViews(review.views)}</span>
                      </span>
                      <span className="stat-item">
                        <MessageOutlined className="stat-icon" />
                        <span className="stat-text">{review.comments}</span>
                      </span>
                    </div>
                  </div>

                  <div className="review-tags">
                    {review.tags.map((tag, index) => (
                      <Tag key={index} className="review-tag">
                        {tag}
                      </Tag>
                    ))}
                  </div>

                  <Button 
                    type="primary" 
                    className="read-more-btn"
                    onClick={() => showReviewDetails(review)}
                  >
                    阅读全文
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="pagination-container">
            <Space className="pagination-group">
              <Button 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1, pageSize)}
              >
                上一页
              </Button>
              <Button 
                disabled={endIndex >= reviewData.length}
                onClick={() => handlePageChange(currentPage + 1, pageSize)}
              >
                下一页
              </Button>
            </Space>
            <div className="page-info">
              第 {currentPage} 页，共 {Math.ceil(reviewData.length / pageSize)} 页
            </div>
          </div>
        </>
      )}

      {/* 详情弹窗 */}
      <Modal
        title={null}
        centered
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
        className="review-detail-modal"
      >
        {selectedReview && (
          <div className="review-detail">
            <div className="detail-cover-placeholder">
              {selectedReview.title}
            </div>
            <Title level={2} className="detail-title">
              {selectedReview.title}
            </Title>
            
            <div className="detail-meta">
              <div className="detail-author">
                <Avatar size={32} src={selectedReview.author.avatar} />
                <div className="author-details">
                  <div className="author-name">{selectedReview.author.name}</div>
                  <div className="publish-date">{selectedReview.date}</div>
                </div>
              </div>
              
              <div className="detail-stats">
                <Space>
                  <span className="stat-item">
                    <EyeOutlined />
                    <span className="stat-text">{formatViews(selectedReview.views)}</span>
                  </span>
                  <span className="stat-item">
                    <LikeOutlined />
                    <span className="stat-text">{selectedReview.likes}</span>
                  </span>
                  <span className="stat-item">
                    <MessageOutlined />
                    <span className="stat-text">{selectedReview.comments}</span>
                  </span>
                </Space>
              </div>
            </div>
            
            <div className="detail-rating">
              <Rate disabled defaultValue={selectedReview.rating} precision={0.1} />
              <span className="rating-score">{selectedReview.rating.toFixed(1)}</span>
            </div>
            
            <div className="detail-tags">
              {selectedReview.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </div>
            
            <div className="detail-content">
              {selectedReview.reviewContent.split('\n').map((paragraph, index) => (
                <p key={index} className="content-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
            
            <div className="detail-comments">
              <Title level={4} className="comments-title">
                评论 ({selectedReview.commentList.length})
              </Title>
              <div className="comments-list">
                {selectedReview.commentList.map((comment, index) => (
                  <CustomComment
                    key={index}
                    author={comment.author}
                    avatar={comment.avatar}
                    datetime={comment.datetime}
                    content={comment.content}
                  />
                ))}
              </div>
              
              {/* 评论输入框 */}
              <div className="comment-input-section">
                <TextArea
                  placeholder="写下你的评论..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={4}
                  className="comment-textarea"
                />
                <div className="comment-actions">
                  <Button
                    type="primary"
                    onClick={handlePublishComment}
                    disabled={!commentText.trim()}
                    className="publish-comment-btn"
                  >
                    发布评论
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReviewsPage;