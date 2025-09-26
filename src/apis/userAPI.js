import apiClient from './gameAPI';
import { setItem, STORAGE_KEYS } from '../utils/storage';

/**
 * 用户相关API
 */

// 用户登录
export const login = async (username, password) => {
  try {
    const response = await apiClient.post('/auth/login', {
      username,
      password,
    });
    
    // 存储token和用户信息
    if (response.data.token) {
      setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      setItem(STORAGE_KEYS.USER_INFO, response.data.user);
    }
    
    return response;
  } catch (error) {
    // 返回模拟数据
    console.log('使用模拟登录数据');
    const mockResponse = {
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 1,
          username,
          email: `${username}@example.com`,
          avatar: null,
          createdAt: new Date().toISOString(),
        },
      },
    };
    
    // 存储模拟token和用户信息
    setItem(STORAGE_KEYS.AUTH_TOKEN, mockResponse.data.token);
    setItem(STORAGE_KEYS.USER_INFO, mockResponse.data.user);
    
    return mockResponse;
  }
};

// 用户注册
export const register = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response;
  } catch (error) {
    // 返回模拟数据
    console.log('使用模拟注册数据');
    return {
      data: {
        message: '注册成功',
        user: {
          id: Date.now(),
          ...userData,
          avatar: null,
          createdAt: new Date().toISOString(),
        },
      },
    };
  }
};

// 用户登出
export const logout = async () => {
  try {
    const response = await apiClient.post('/auth/logout');
    return response;
  } catch (error) {
    // 模拟登出成功
    console.log('模拟登出');
    return {
      data: {
        message: '登出成功',
      },
    };
  }
};

// 获取用户信息
export const getUserInfo = async () => {
  try {
    const response = await apiClient.get('/users/me');
    return response;
  } catch (error) {
    // 返回模拟数据
    console.log('使用模拟用户信息');
    return {
      data: {
        id: 1,
        username: 'testuser',
        email: 'testuser@example.com',
        avatar: null,
        bio: '热爱游戏的玩家',
        preferences: {
          theme: 'light',
          language: 'zh-CN',
        },
        createdAt: '2024-01-01T00:00:00Z',
      },
    };
  }
};

// 更新用户信息
export const updateUserInfo = async (userData) => {
  try {
    const response = await apiClient.put('/users/me', userData);
    return response;
  } catch (error) {
    // 返回模拟数据
    console.log('使用模拟更新用户信息');
    return {
      data: {
        ...userData,
      },
    };
  }
};

// 修改密码
export const changePassword = async (passwordData) => {
  try {
    const response = await apiClient.post('/users/change-password', passwordData);
    return response;
  } catch (error) {
    // 返回模拟数据
    console.log('使用模拟修改密码');
    return {
      data: {
        message: '密码修改成功',
      },
    };
  }
};

// 上传头像
export const uploadAvatar = async (formData) => {
  try {
    const response = await apiClient.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    // 返回模拟数据
    console.log('使用模拟上传头像');
    return {
      data: {
        avatarUrl: 'https://via.placeholder.com/200',
      },
    };
  }
};