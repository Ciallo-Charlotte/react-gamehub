import React, { useState } from 'react';
import { Card, Typography, Empty, Button, Row, Col, message } from 'antd';
import { StarOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import './ProfileFavorites.css';

const { Title, Text } = Typography;

// 模拟游戏数据
const mockFavoriteGames = [
  {
    id: 1,
    title: '赛博朋克 2077',
    cover: 'https://cdn.max-c.com/heybox/game/header/1091500_3olJW.jpg',
    rating: 8.7,
    genre: 'RPG',
    releaseDate: '2020-12-10',
  },
  {
    id: 2,
    title: '艾尔登法环',
    cover: 'https://heyboxbj.max-c.com/gameimg/steam_item_assets/6026263faf7142fbf97ddb6948dbf05a.jpg',
    rating: 9.6,
    genre: 'ARPG',
    releaseDate: '2022-02-25',
  },
  {
    id: 3,
    title: '原神',
    cover: 'https://cdn.max-c.com/mobile/app/head/62bfe2f3513442afb4425e5c47624b6c.jpg?imageMogr2/format/webp/quality/50/auto-orient/ignore-error/1',
    rating: 8.2,
    genre: '动作冒险',
    releaseDate: '2020-09-28',
  },
  {
    id: 4,
    title: '最终幻想16',
    cover: 'https://heyboxbj.max-c.com/gameimg/steam_item_assets/3144dd583dc7b8ee9bb1cc6064458163.jpg',
    rating: 8.8,
    genre: 'ARPG',
    releaseDate: '2023-06-22',
  },
];

function ProfileFavorites() {
  const [favorites, setFavorites] = useState(mockFavoriteGames);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleRemoveFavorite = (gameId) => {
    setLoading(true);
    setTimeout(() => {
      setFavorites(favorites.filter(game => game.id !== gameId));
      message.success('已从收藏中移除');
      setLoading(false);
    }, 500);
  };

  // 切换隐私设置
  // 移除隐私设置功能，收藏内容始终可见

  return (
    <div className="profile-favorites">
      <Title level={2}>我的收藏</Title>
      
      <Card 
        className="profile-favorites-card"
        title="收藏游戏"
      >
        {favorites.length === 0 ? (
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