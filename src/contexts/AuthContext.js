import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../apis/userAPI';
import { getItem, setItem, removeItem, STORAGE_KEYS } from '../utils/storage';

// 创建认证上下文
const AuthContext = createContext();

// 认证提供者组件
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时从localStorage获取用户信息
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 检查是否有存储的token和用户信息
        const storedToken = getItem(STORAGE_KEYS.AUTH_TOKEN);
        const storedUser = getItem(STORAGE_KEYS.USER_INFO);
        
        if (storedToken && storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('初始化认证信息失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // 登录函数
  const login = async (userData) => {
    try {
      // 调用API进行实际登录验证
      const response = await apiLogin(userData.username, userData.password);
      
      // 更新状态
      setUser(response.data.user);
      
      return response.data.user;
    } catch (error) {
      console.error('登录失败:', error);
      throw error; // 抛出错误以便组件处理
    }
  };

  // 登出函数
  const logout = async () => {
    try {
      // 调用API登出
      await apiLogout();
    } catch (error) {
      console.error('登出API调用失败:', error);
      // 即使API调用失败，仍清理本地状态
    } finally {
      // 清理本地状态
      setUser(null);
      removeItem(STORAGE_KEYS.AUTH_TOKEN);
      removeItem(STORAGE_KEYS.USER_INFO);
    }
  };

  // 更新用户信息（例如头像）
  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    setItem(STORAGE_KEYS.USER_INFO, updatedUser);
    return updatedUser;
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 自定义Hook，方便在组件中使用认证上下文
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
}

export default AuthContext;