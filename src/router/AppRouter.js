import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from '../App';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Profile from '../pages/Profile/Profile';
import ProfileInfo from '../pages/Profile/ProfileInfo';
import ProfileFavorites from '../pages/Profile/ProfileFavorites';
import ProfileSettings from '../pages/Profile/ProfileSettings';
import ProfilePassword from '../pages/Profile/ProfilePassword';
import HomeLayout from '../pages/Home/Layout/HomeLayout';
import NewsPage from '../pages/Home/News/NewsPage';
import DiscussionsPage from '../pages/Home/Discussions/DiscussionsPage';
import ReviewsPage from '../pages/Home/Reviews/ReviewsPage';
import { AuthProvider } from '../contexts/AuthContext';
import store from '../store';

// 创建路由配置
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    element: <HomeLayout />,
    children: [
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
    element: <Profile />,
    children: [
      {
        index: true,
        element: <ProfileInfo />,
      },
      {
        path: 'favorites',
        element: <ProfileFavorites />,
      },
      {
        path: 'settings',
        element: <ProfileSettings />,
      },
      {
        path: 'password',
        element: <ProfilePassword />,
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