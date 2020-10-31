import { combineReducers } from 'redux';
import materialReducer from './material';

const rootReducer = combineReducers({
  materials: materialReducer,
});

export default rootReducer;
