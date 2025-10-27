// 后端API基础URL
const API_BASE_URL = 'http://localhost:5000/api';

// 延迟函数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 通用请求函数
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API请求失败');
    }
    
    return data;
  } catch (error) {
    console.error(`API请求错误 [${endpoint}]:`, error.message);
    throw error;
  }
};

// 用户相关API - 后端服务版本
export const userAPI = {
  // 注册用户
  register: async (userData) => {
    try {
      const response = await fetchAPI('/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      
      // 存储token和用户信息
      localStorage.setItem('token', response.token);
      localStorage.setItem('userInfo', JSON.stringify(response.user));
      
      return response;
    } catch (error) {
      throw new Error(typeof error === 'string' ? error : '注册失败，请稍后重试');
    }
  },
  
  // 用户登录
  login: async (username, password) => {
    try {
      const response = await fetchAPI('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      
      // 存储token和用户信息
      localStorage.setItem('token', response.token);
      localStorage.setItem('userInfo', JSON.stringify(response.user));
      
      return response.user;
    } catch (error) {
      throw new Error(typeof error === 'string' ? error : '登录失败，请检查用户名和密码');
    }
  },
  
  // 登出
  logout: async () => {
    try {
      // 模拟API延迟
      await delay(200);
    } finally {
      // 无论如何都清除本地存储
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
    }
  }
};

export default userAPI;