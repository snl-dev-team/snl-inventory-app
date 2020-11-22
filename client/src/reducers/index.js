import { combineReducers } from 'redux';
import materialReducer from './material';
import productReducer from './product';
import caseReducer from './case';
import orderReducer from './order';
import userReducer from './user';

const rootReducer = combineReducers({
  materials: materialReducer,
  products: productReducer,
  cases: caseReducer,
  orders: orderReducer,
  user: userReducer,
});

export default rootReducer;
