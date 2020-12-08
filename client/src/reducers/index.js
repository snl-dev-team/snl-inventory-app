import { combineReducers } from 'redux';
import viewReducer from './view';

const rootReducer = combineReducers({
  view: viewReducer,
});

export default rootReducer;
