/**
 * 本地存储管理工具
 */

/**
 * 存储数据到localStorage
 * @param {string} key - 存储键名
 * @param {any} value - 要存储的值（会自动JSON序列化）
 */
export const setItem = (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * 从localStorage获取数据
 * @param {string} key - 存储键名
 * @param {any} defaultValue - 默认值（如果键不存在）
 * @returns {any} 获取的值（已自动解析JSON）
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const jsonValue = localStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * 从localStorage移除数据
 * @param {string} key - 要移除的键名
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * 清除所有localStorage数据
 */
export const clearAll = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * 检查localStorage是否可用
 * @returns {boolean} localStorage是否可用
 */
export const isLocalStorageAvailable = () => {
  try {
    const testKey = '__localStorage_test__';
    setItem(testKey, testKey);
    removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 获取localStorage使用情况
 * @returns {Object} 包含已用空间和总空间的对象
 */
export const getStorageUsage = () => {
  let used = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      used += localStorage.getItem(key).length + key.length;
    }
  }
  // 转换为KB
  const usedKB = Math.round(used / 1024);
  // localStorage通常限制为5MB
  const totalKB = 5 * 1024;
  
  return {
    used: usedKB,
    total: totalKB,
    percent: Math.round((usedKB / totalKB) * 100),
  };
};

// 存储键名常量
export const STORAGE_KEYS = {
  USER_INFO: 'userInfo',
  AUTH_TOKEN: 'authToken',
  THEME_PREFERENCE: 'themePreference',
  LANGUAGE: 'language',
  SEARCH_HISTORY: 'searchHistory',
  CART_ITEMS: 'cartItems',
  FAVORITES: 'favorites',
  SETTINGS: 'settings',
};