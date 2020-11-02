import { combineReducers } from 'redux';
import materialReducer from './material';
import productReducer from './product';
import caseReducer from './case';
import orderReducer from './order';

const rootReducer = combineReducers({
  materials: materialReducer,
  products: productReducer,
  cases: caseReducer,
  orders: orderReducer,
});

export default rootReducer;
