import React, { useState, useEffect } from 'react';
import { Card, Typography, List, Empty, Button, Row, Col, message } from 'antd';
import { LockOutlined, StarOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import './ProfileFavorites.css';

const { Title, Text } = Typography;

// 模拟游戏数据
const mockFavoriteGames = [
  {
    id: 1,
    title: '赛博朋克 2077',
    cover: 'https://via.placeholder.com/200x300',
    rating: 8.7,
    genre: 'RPG',
    releaseDate: '2020-12-10',
  },
  {
    id: 2,
    title: '艾尔登法环',
    cover: 'https://via.placeholder.com/200x300',
    rating: 9.6,
    genre: 'ARPG',
    releaseDate: '2022-02-25',
  },
  {
    id: 3,
    title: '原神',
    cover: 'https://via.placeholder.com/200x300',
    rating: 8.2,
    genre: '动作冒险',
    releaseDate: '2020-09-28',
  },
  {
    id: 4,
    title: '最终幻想16',
    cover: 'https://via.placeholder.com/200x300',
    rating: 8.8,
    genre: 'ARPG',
    releaseDate: '2023-06-22',
  },
];

function ProfileFavorites() {
  const [favorites, setFavorites] = useState(mockFavoriteGames);
  const [loading, setLoading] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(
    localStorage.getItem('privacyVisible') !== 'false' // 默认公开
  );
  const { user } = useAuth();

  // 监听localStorage变化
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedVisibility = localStorage.getItem('privacyVisible') !== 'false';
      setPrivacyVisible(updatedVisibility);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 在实际应用中，这里会从API获取用户收藏的游戏
  useEffect(() => {
    // 模拟API调用获取收藏列表
    if (user) {
      // 实际项目中应调用API
      // fetchFavorites(user.id).then(data => setFavorites(data));
    }
  }, [user]);

  const handleRemoveFavorite = (gameId) => {
    // 模拟移除收藏
    setLoading(true);
    setTimeout(() => {
      setFavorites(favorites.filter(game => game.id !== gameId));
      message.success('已从收藏中移除');
      setLoading(false);
    }, 500);
  };

  // 切换隐私设置
  const togglePrivacy = () => {
    const newVisibility = !privacyVisible;
    setPrivacyVisible(newVisibility);
    localStorage.setItem('privacyVisible', newVisibility);
  };

  return (
    <div className="profile-favorites">
      <Title level={2}>我的收藏</Title>
      
      <Card 
        className="profile-favorites-card"
        title={
          <div className="card-title-with-privacy">
            <span>收藏游戏</span>
            {!privacyVisible && (
              <Text type="secondary" style={{ marginLeft: 8 }}>
                (私密)
              </Text>
            )}
          </div>
        }
      >
        {!privacyVisible ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            backgroundColor: 'rgba(24, 144, 255, 0.05)',
            borderRadius: '8px',
            border: '1px dashed #1890ff'
          }}>
            <LockOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <Title level={4} style={{ marginBottom: '8px' }}>游戏库已设为私密</Title>
            <p style={{ color: '#666' }}>您的游戏收藏目前不对其他用户可见</p>
            <Button 
              type="primary" 
              style={{ marginTop: '16px' }}
              onClick={togglePrivacy}
            >
              立即公开
            </Button>
          </div>
        ) : favorites.length === 0 ? (
          <Empty description="暂无收藏的游戏" />
        ) : (
          <Row gutter={[16, 16]}>
            {favorites.map((game) => (
              <Col xs={24} sm={12} md={8} lg={6} key={game.id}>
                <Card
                  hoverable
                  className="favorite-game-card"
                  cover={
                    <div className="game-cover">
                      <img alt={game.title} src={game.cover} />
                    </div>
                  }
                  actions={[
                    <Button
                      danger
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveFavorite(game.id)}
                      loading={loading}
                    >
                      移除收藏
                    </Button>,
                  ]}
                >
                  <div className="game-info">
                    <h3 className="game-title">{game.title}</h3>
                    <div className="game-meta">
                      <span className="game-rating">评分: {game.rating}</span>
                      <span className="game-genre">{game.genre}</span>
                    </div>
                    <div className="game-date">{game.releaseDate}</div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card>
    </div>
  );
}

export default ProfileFavorites;