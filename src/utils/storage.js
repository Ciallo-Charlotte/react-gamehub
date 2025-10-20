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