import { createSlice } from '@reduxjs/toolkit';

// 用户状态slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    isAuthenticated: false,
  },
  reducers: {
    // 设置当前用户
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    // 清除用户状态
    clearUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
});

// 导出action creators
export const { 
  setCurrentUser,
  clearUser
} = userSlice.actions;

// 导出selector
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;

// 导出reducer
export default userSlice.reducer;