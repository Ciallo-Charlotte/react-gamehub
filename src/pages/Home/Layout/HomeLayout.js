import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, FireOutlined, TrophyOutlined, MessageOutlined } from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './HomeLayout.css';

const { Content } = Layout;

const HomeLayout = () => {
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState('news');

  // 根据当前路径更新选中的标签
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/news')) {
      setCurrentTab('news');
    } else if (path.startsWith('/reviews')) {
      setCurrentTab('reviews');
    } else if (path.startsWith('/discussions')) {
      setCurrentTab('discussions');
    }
  }, [location.pathname]);

  const handleTabChange = (key) => {
    setCurrentTab(key);
  };

  return (
    <Layout className="home-layout">
      <Content className="home-content">
        {/* 二级导航栏 */}
        <div className="home-tabs">
          <Menu
            mode="horizontal"
            selectedKeys={[currentTab]}
            onClick={({ key }) => handleTabChange(key)}
            className="home-menu"
            items={[
              {
                key: 'home',
                icon: <HomeOutlined />,
                label: <Link to="/">首页</Link>
              },
              {
                key: 'news',
                icon: <FireOutlined />,
                label: <Link to="/news">热门资讯</Link>
              },
              {
                key: 'reviews',
                icon: <TrophyOutlined />,
                label: <Link to="/reviews">游戏评测</Link>
              },
              {
                key: 'discussions',
                icon: <MessageOutlined />,
                label: <Link to="/discussions">社会讨论</Link>
              }
            ]}
          />
        </div>

        {/* 子路由内容区域 */}
        <div className="home-outlet">
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default HomeLayout;