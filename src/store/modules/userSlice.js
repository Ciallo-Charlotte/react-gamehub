import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 设置用户信息
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    // 清除用户信息（登出）
    clearUserInfo: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
    },
    // 设置加载状态
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // 设置错误信息
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    // 清除错误信息
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setUserInfo, clearUserInfo, setLoading, setError, clearError } = userSlice.actions;

export default userSlice.reducer;