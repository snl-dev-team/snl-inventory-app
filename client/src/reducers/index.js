import { combineReducers } from 'redux';
import userReducer from './user';
import viewReducer from './view';

const rootReducer = combineReducers({
  user: userReducer,
  view: viewReducer,
});

export default rootReducer;
