import { setItem, getItem, STORAGE_KEYS } from '../utils/storage';

// 使用localStorage作为模拟数据库的持久化存储
const MOCK_DB_KEY = 'MOCK_DB';

// 初始化或获取模拟数据库
let mockDB = JSON.parse(localStorage.getItem(MOCK_DB_KEY));
if (!mockDB) {
  // 如果localStorage中没有数据库，创建新的
  mockDB = {
    users: [
      // 示例用户数据 - 添加loginUsername作为登录凭证，不可修改；displayName作为显示名称，可修改
      { id: 1, loginUsername: 'demo', displayName: 'demo', password: '123456' }
    ]
  };
  // 将初始数据库保存到localStorage
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(mockDB));
} else {
  // 如果已有数据库但使用的是旧格式（只有username字段），转换为新格式
  mockDB.users = mockDB.users.map(user => {
    if (!user.loginUsername) {
      return {
        ...user,
        loginUsername: user.username, // 登录用户名使用原username
        displayName: user.username    // 显示用户名也使用原username
      };
    }
    return user;
  });
  // 保存更新后的数据库
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(mockDB));
}

// 保存数据库到localStorage的函数
const saveMockDB = () => {
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(mockDB));
  console.log('数据库已保存到localStorage，当前用户数量:', mockDB.users.length);
};

// 导出函数以便外部直接访问数据库
const getMockDB = () => mockDB;
window.getMockDB = getMockDB;

// 模拟网络延迟函数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 用户相关API
 */

// 用户登录
export const login = async (username, password) => {
  try {
    // 获取并使用正确的数据库对象
    const db = getMockDB();
    console.log('====== 登录前数据库状态检查 ======');
    // 从localStorage重新读取数据库以确保获取最新状态
    const dbFromStorage = JSON.parse(localStorage.getItem(MOCK_DB_KEY));
    console.log('从localStorage读取的用户数量:', dbFromStorage?.users?.length || 0);
    console.log('从localStorage读取的用户列表:', JSON.stringify(dbFromStorage?.users || [], null, 2));
    console.log('内存中的用户数量:', db.users.length);
    console.log('====== 数据库状态检查完成 ======');
    
    // 确保内存中的数据库是最新的
    if (dbFromStorage) {
      mockDB = dbFromStorage;
    }
    
    // 模拟数据库查询，实际项目中应该是真实的SQL查询
    console.log('登录验证:', username);
    
    // 验证输入 - 只要求密码必填，用户名可选
    if (!password) {
      throw new Error('密码不能为空');
    }
    
    // 如果提供了用户名，则按用户名查找；否则按密码查找所有用户（不推荐，仅为演示）
    let user;
    
    if (username) {
      // 在正确的数据库对象中查找用户，使用loginUsername作为登录凭证
      user = db.users.find(u => u.loginUsername === username);
      
      // 区分错误类型：用户名不存在
      if (!user) {
        throw new Error('用户名未注册');
      }
    } else {
      // 用户名为空时，需要特殊处理 - 这里简化为返回第一个匹配密码的用户
      // 注意：在实际应用中，这种方法不安全，仅用于演示
      user = db.users.find(u => u.password === password);
      
      if (!user) {
        throw new Error('未找到匹配的用户');
      }
      
      console.warn('警告：使用空用户名登录，这在生产环境中是不安全的');
    }
    
    // 区分错误类型：密码错误
    if (user.password !== password) {
      throw new Error('密码错误');
    }
    
    // 模拟成功登录的响应，返回displayName作为显示名称
    const response = {
      data: {
        token: 'jwt-token-' + Date.now(),
        user: {
          id: user.id,
          loginUsername: user.loginUsername, // 保存登录用户名（不可修改）
          username: user.displayName,        // 使用displayName作为前端显示的用户名
          displayName: user.displayName,     // 显式保存displayName
          avatar: null,
          createdAt: new Date().toISOString(),
        },
      },
    };
    
    // 存储token和用户信息
    setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
    setItem(STORAGE_KEYS.USER_INFO, response.data.user);
    
    return response;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

// 用户注册
export const register = async (userData) => {
  try {
    const { username, password } = userData;
    
    // 验证输入 - 只要求密码必填，用户名可选
    if (!password) {
      throw new Error('密码不能为空');
    }
    
    // 如果没有提供用户名，生成一个默认用户名
    const finalUsername = username || `user_${Date.now()}`;
    console.log('注册用户:', finalUsername);
    
    // 模拟检查用户名是否已存在
    // 实际项目中应该查询数据库检查username是否存在于users表中
    
    // 获取并初始化localStorage数据库
    const db = getMockDB();
    
    console.log('====== 开始注册流程 ======');
    console.log('当前数据库:', db);
    console.log('注册前数据库用户数量:', db.users.length);
    console.log('登录用户名作为关键词检查:', finalUsername);
    
    // 检查登录用户名是否已存在（loginUsername作为登录凭证，不可重复）
    const existingUser = db.users.find(user => user.loginUsername === finalUsername);
    if (existingUser) {
      throw new Error(`登录用户名 '${finalUsername}' 已存在，请选择其他用户名`);
    }
    
    // 模拟注册成功响应
    const response = {
      data: {
        message: '注册成功',
        user: {
          id: Date.now(),
          loginUsername: finalUsername, // 登录用户名（不可修改）
          username: finalUsername,      // 显示用户名（初始与登录用户名相同，后续可修改）
          displayName: finalUsername,   // 显式保存displayName
          avatar: null,
          createdAt: new Date().toISOString(),
        },
      },
    };
    
    // 创建新用户对象
    const newUser = {
      id: response.data.user.id,
      loginUsername: finalUsername, // 登录用户名（不可修改）
      displayName: finalUsername,   // 显示用户名（可修改）
      password
    };
    
    console.log('准备添加的用户数据:', newUser);
    
    // 添加用户到数据库
    db.users.push(newUser);
    
    // 保存数据库到localStorage确保持久化
    saveMockDB();
    
    console.log('添加后数据库用户数量:', db.users.length);
    console.log('添加后数据库完整用户列表:', JSON.stringify(db.users, null, 2));
    console.log('验证：从localStorage重新读取的数据库:', JSON.parse(localStorage.getItem(MOCK_DB_KEY)).users.length + ' 个用户');
    console.log('用户名作为关键词成功保存:', username);
    console.log('====== 注册流程完成 ======');
    
    return response;
  } catch (error) {
    console.error('注册失败:', error);
    throw new Error(error.message || '注册失败，请稍后重试');
  }
};

// 用户登出
export const logout = async () => {
  try {
    // 模拟网络延迟
    await delay(500);
    
    // 清除本地存储的认证信息
    setItem(STORAGE_KEYS.AUTH_TOKEN, null);
    setItem(STORAGE_KEYS.USER_INFO, null);
    
    return {
      success: true,
      data: {
        message: '登出成功',
      },
    };
  } catch (error) {
    console.error('登出失败:', error);
    throw new Error('登出失败，请稍后重试');
  }
};

// 获取用户信息
export const getUserInfo = async () => {
    try {
      // 模拟网络延迟
      await delay(800);
      
      // 从本地存储获取用户信息
      const currentUser = getItem(STORAGE_KEYS.USER_INFO);
      if (currentUser) {
        return {
          success: true,
          data: currentUser
        };
      }
    
    // 返回模拟数据
    return {
      success: true,
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
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw new Error('获取用户信息失败，请稍后重试');
  }
};

// 更新用户信息
export const updateUserInfo = async (userData) => {
  try {
    // 模拟网络延迟
    await delay(1000);
    
    // 获取当前登录用户信息
    const currentUser = getItem(STORAGE_KEYS.USER_INFO);
    if (!currentUser) {
      throw new Error('用户未登录');
    }
    
    // 禁止修改loginUsername
    if (userData.hasOwnProperty('loginUsername')) {
      delete userData.loginUsername;
      console.warn('尝试修改不可编辑的登录用户名，已忽略该操作');
    }
    
    // 如果更新了显示名称，将其应用到displayName字段
    const updateData = { ...userData };
    if (userData.hasOwnProperty('username')) {
      // 确保displayName也同步更新
      updateData.displayName = userData.username;
    }
    
    // 使用loginUsername查找用户
    const db = getMockDB();
    const userIndex = db.users.findIndex(u => u.loginUsername === currentUser.loginUsername);
    
    if (userIndex !== -1) {
      // 保留原始的loginUsername，只更新其他可修改字段
      const updatedUser = { 
        ...db.users[userIndex], 
        ...updateData 
      };
      
      // 确保loginUsername不被覆盖
      updatedUser.loginUsername = db.users[userIndex].loginUsername;
      
      db.users[userIndex] = updatedUser;
      
      // 保存到localStorage
      saveMockDB();
    }
    
    // 更新本地存储的用户信息
    if (currentUser) {
      // 确保loginUsername不被覆盖
      const updatedLocalUser = { 
        ...currentUser, 
        ...updateData,
        loginUsername: currentUser.loginUsername
      };
      
      // 同步username和displayName
      if (updateData.displayName) {
        updatedLocalUser.username = updateData.displayName;
      }
      
      setItem(STORAGE_KEYS.USER_INFO, updatedLocalUser);
    }
    
    return {
      success: true,
      data: { 
        ...currentUser, 
        ...updateData, 
        loginUsername: currentUser.loginUsername // 确保返回原始loginUsername
      }
    };
  } catch (error) {
    console.error('更新用户信息失败:', error);
    throw new Error('更新用户信息失败，请稍后重试');
  }
};

// 修改密码函数已移除，因不再使用

// 上传头像
export const uploadAvatar = async (formData) => {
  try {
    // 模拟网络延迟
    await delay(1500);
    
    // 模拟成功响应
    const mockAvatar = 'https://randomuser.me/api/portraits/men/32.jpg';
    
    // 更新本地存储的用户头像
      const currentUser = getItem(STORAGE_KEYS.USER_INFO);
      if (currentUser) {
        setItem(STORAGE_KEYS.USER_INFO, { ...currentUser, avatar: mockAvatar });
      }
    
    return {
      success: true,
      data: {
        avatar: mockAvatar
      }
    };
  } catch (error) {
    console.error('上传头像失败:', error);
    throw new Error('上传头像失败，请稍后重试');
  }
};