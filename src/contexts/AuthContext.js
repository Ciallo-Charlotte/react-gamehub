import React, { createContext, useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentUser, clearUser } from '../store/modules/userSlice';
import { userAPI } from '../apis/userAPI';

// 创建认证上下文
const AuthContext = createContext();



// 认证提供者组件
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  // 从localStorage加载用户信息
  useEffect(() => {
    const loadUser = () => {
      try {
        // 同时检查token和userInfo，确保验证有效
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userInfo');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          console.log('从localStorage加载用户信息:', parsedUser);
          setUser(parsedUser);
          // 同时更新Redux store
          dispatch(setCurrentUser(parsedUser));
        }
      } catch (error) {
        console.error('加载用户信息失败:', error.message || error);
        // 出错时清理可能损坏的数据
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    // 立即执行加载
    loadUser();
    
    // 监听localStorage变化，以便在其他标签页登录/登出时同步状态
    const handleStorageChange = (e) => {
      if (e.key === 'userInfo' || e.key === 'token') {
        loadUser();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch]);

  // 登录函数 - 使用userAPI
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const { username, password } = credentials;
      
      // 调用userAPI进行登录，userAPI.login直接返回用户对象
      const userData = await userAPI.login(username, password);
      
      if (!userData) {
        throw new Error('登录失败，未返回用户数据');
      }
      
      console.log('登录成功，用户数据:', userData);
      
      // 登录成功，更新状态
      setUser(userData);
      // 更新Redux store中的用户信息
      dispatch(setCurrentUser(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('登录失败:', error.message || error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出函数 - 使用userAPI
  const logout = async () => {
    setIsLoading(true);
    try {
      // 调用userAPI进行登出
      await userAPI.logout();
      
      // 清除本地状态
      setUser(null);
      
      // 清除Redux中的用户状态
      dispatch(clearUser());
      
      // 确保清除localStorage中的所有用户相关数据
      console.log('清除localStorage中的用户数据');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      
      return { success: true };
    } catch (error) {
      console.error('登出失败:', error.message || error);
      
      // 即使API调用失败，也要清理本地状态
      setUser(null);
      dispatch(clearUser());
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      
      return { success: false, error: error.message || error };
    } finally {
      setIsLoading(false);
    }
  };

  // 注册函数 - 使用userAPI
  const register = async (userData) => {
    setIsLoading(true);
    try {
      // 调用userAPI进行注册
      const result = await userAPI.register(userData);
      
      // 检查结果是否包含用户信息
      if (result && result.user) {
        console.log('注册成功，用户信息:', result.user);
        // 更新用户状态
        setUser(result.user);
      }
      
      // 返回成功状态和结果数据
      return { success: true, ...result };
    } catch (error) {
      console.error('注册失败:', error.message || error);
      // 确保抛出具体的错误信息
      throw new Error(typeof error === 'string' ? error : error.message || '注册失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 更新用户信息
  const updateUser = async (updates) => {
    setIsLoading(true);
    try {
      // 调用后端API更新用户信息
      const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '更新用户信息失败');
      }
      
      // 更新本地状态
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      // 更新本地存储
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      // 更新Redux store
      dispatch(setCurrentUser(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('更新用户信息失败:', error.message || error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 提供给子组件的值
  const value = {
    user,
    isLoading,
    login,
    logout,
    register,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 自定义Hook，方便在组件中使用认证上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
};

export default AuthContext;