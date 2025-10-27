import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Profile from '../pages/Profile/Profile';
import ProfileInfo from '../pages/Profile/ProfileInfo';
import ProfileFavorites from '../pages/Profile/ProfileFavorites';
import HomeLayout from '../pages/Home/Layout/HomeLayout';
import HomePage from '../pages/Home/HomePage/HomePage';
import NewsPage from '../pages/Home/News/NewsPage';
import DiscussionsPage from '../pages/Home/Discussions/DiscussionsPage';
import ReviewsPage from '../pages/Home/Reviews/ReviewsPage';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import store from '../store';

// 路由保护组件
const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const reduxUser = useSelector(state => state.user.userInfo);
  
  // 如果正在加载中，可以显示加载状态
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  // 检查是否已登录（同时检查AuthContext和Redux store）
  const isAuthenticated = !!user || !!reduxUser;
  
  // 如果未登录，重定向到登录页面
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // 已登录用户可以访问受保护的页面
  return children;
};

// 创建路由配置
const router = createBrowserRouter([
  {
    element: <HomeLayout />,
    children: [
      {
          path: '/',
          element: <HomePage />,
        },
      {
        path: 'news',
        element: <NewsPage />,
      },
      {
        path: 'reviews',
        element: <ReviewsPage />,
      },
      {
        path: 'discussions',
        element: <DiscussionsPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/profile',
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <ProfileInfo />
          </PrivateRoute>
        ),
      },
      {
        path: 'favorites',
        element: (
          <PrivateRoute>
            <ProfileFavorites />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

function AppRouter() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  );
}

export default AppRouter;