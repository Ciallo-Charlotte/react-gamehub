import { combineReducers } from 'redux';
import userReducer from '../modules/userSlice';
import gameReducer from '../modules/gameSlice';

const rootReducer = combineReducers({
  user: userReducer,
  game: gameReducer,
});

export default rootReducer;