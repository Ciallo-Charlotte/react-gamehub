import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGames, fetchGameDetail, fetchGamesByCategory } from '../../apis/gameAPI';

// 异步获取游戏列表
export const getGames = createAsyncThunk(
  'game/getGames',
  async ({ page = 1, pageSize = 10, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await fetchGames(page, pageSize, filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '获取游戏列表失败');
    }
  }
);

// 异步获取游戏详情
export const getGameDetail = createAsyncThunk(
  'game/getGameDetail',
  async (gameId, { rejectWithValue }) => {
    try {
      const response = await fetchGameDetail(gameId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '获取游戏详情失败');
    }
  }
);

// 异步获取分类游戏
export const getGamesByCategory = createAsyncThunk(
  'game/getGamesByCategory',
  async ({ category, page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await fetchGamesByCategory(category, page, pageSize);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '获取分类游戏失败');
    }
  }
);

const initialState = {
  games: [],
  currentGame: null,
  categoryGames: {},
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    clearCurrentGame: (state) => {
      state.currentGame = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取游戏列表
      .addCase(getGames.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGames.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload.items;
        state.pagination = {
          current: action.payload.currentPage,
          pageSize: action.payload.pageSize,
          total: action.payload.total,
        };
      })
      .addCase(getGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 获取游戏详情
      .addCase(getGameDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGameDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGame = action.payload;
      })
      .addCase(getGameDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 获取分类游戏
      .addCase(getGamesByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGamesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        const { category, items } = action.payload;
        state.categoryGames[category] = items;
      })
      .addCase(getGamesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentGame, clearError } = gameSlice.actions;

export default gameSlice.reducer;