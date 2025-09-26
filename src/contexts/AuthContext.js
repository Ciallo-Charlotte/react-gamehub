import React, { createContext, useState, useContext, useEffect } from 'react';

// 创建认证上下文
const AuthContext = createContext();

// 认证提供者组件
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时检查本地存储中的用户信息
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // 登录函数
  const login = (userData) => {
    // 模拟登录成功
    const userInfo = {
      id: 1,
      username: userData.username,
      avatar: null, // 初始头像为null，后续会使用默认头像
      ...userData
    };
    setUser(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));
    return Promise.resolve(userInfo);
  };

  // 登出函数
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // 更新用户信息（例如头像）
  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
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