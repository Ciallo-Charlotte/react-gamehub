import axios from 'axios';
import { getItem, STORAGE_KEYS } from '../utils/storage';

// 创建axios实例
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 处理错误响应
    if (error.response) {
      // 服务器返回错误状态码
      if (error.response.status === 401) {
        // 未授权，清除本地存储的用户信息和token
        // removeItem(STORAGE_KEYS.USER_INFO);
        // removeItem(STORAGE_KEYS.AUTH_TOKEN);
        // 可以在这里触发登出操作或跳转到登录页
      }
    }
    return Promise.reject(error);
  }
);

/**
 * 游戏相关API
 */

// 获取游戏列表
export const fetchGames = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    const response = await apiClient.get('/games', {
      params: {
        page,
        pageSize,
        ...filters
      },
    });
    return response;
  } catch (error) {
    // 返回模拟数据
    console.log('使用模拟游戏列表数据');
    return {
      data: {
        items: [
          {
            id: 1,
            title: '赛博朋克 2077',
            description: '开放世界动作冒险RPG',
            price: 298,
            originalPrice: 298,
            discount: 0,
            releaseDate: '2020-12-10',
            coverImage: 'https://via.placeholder.com/400x600',
            rating: 4.2,
            categories: ['RPG', '开放世界'],
          },
          {
            id: 2,
            title: '艾尔登法环',
            description: '黑暗奇幻动作角色扮演游戏',
            price: 268,
            originalPrice: 298,
            discount: 10,
            releaseDate: '2022-02-25',
            coverImage: 'https://via.placeholder.com/400x600',
            rating: 4.8,
            categories: ['RPG', '动作'],
          },
        ],
        currentPage: page,
        pageSize,
        total: 20,
      },
    };
  }
};

// 获取游戏详情
export const fetchGameDetail = async (gameId) => {
  try {
    const response = await apiClient.get(`/games/${gameId}`);
    return response;
  } catch (error) {
    // 返回模拟数据
    console.log('使用模拟游戏详情数据');
    return {
      data: {
        id: gameId,
        title: '赛博朋克 2077',
        description: '《赛博朋克 2077》是一款开放世界动作冒险RPG，背景设定在未来都市夜之城。玩家将扮演雇佣兵V，在这个充满高科技与腐败的世界中寻找自己的出路。',
        price: 298,
        originalPrice: 298,
        discount: 0,
        releaseDate: '2020-12-10',
        developer: 'CD Projekt Red',
        publisher: 'CD Projekt',
        platforms: ['PC', 'PlayStation 5', 'Xbox Series X'],
        languages: ['简体中文', '繁体中文', '英语', '日语'],
        systemRequirements: {
          minimum: {
            os: 'Windows 10 64-bit',
            processor: 'Intel Core i5-3570K / AMD FX-8310',
            memory: '8 GB RAM',
            graphics: 'NVIDIA GeForce GTX 780 3GB / AMD Radeon RX 470',
            storage: '70 GB 可用空间',
          },
          recommended: {
            os: 'Windows 10 64-bit',
            processor: 'Intel Core i7-4790 / AMD Ryzen 3 3200G',
            memory: '16 GB RAM',
            graphics: 'NVIDIA GeForce RTX 2060 / AMD Radeon RX 5700 XT',
            storage: '70 GB SSD',
          },
        },
        screenshots: [
          'https://via.placeholder.com/1280x720',
          'https://via.placeholder.com/1280x720',
        ],
        videos: [],
        rating: 4.2,
        reviews: 1234,
        categories: ['RPG', '开放世界', '科幻'],
        tags: ['赛博朋克', '单人', '剧情'],
      },
    };
  }
};

// 获取分类游戏
export const fetchGamesByCategory = async (category, page = 1, pageSize = 10) => {
  try {
    const response = await apiClient.get('/games/category', {
      params: {
        category,
        page,
        pageSize,
      },
    });
    return response;
  } catch (error) {
    // 返回模拟数据
    console.log(`使用模拟${category}分类游戏数据`);
    return {
      data: {
        category,
        items: [
          {
            id: 1,
            title: '游戏标题',
            price: 198,
            coverImage: 'https://via.placeholder.com/400x600',
            rating: 4.5,
          },
        ],
        currentPage: page,
        pageSize,
        total: 10,
      },
    };
  }
};

// 搜索游戏函数已移除，暂未使用

export default apiClient;