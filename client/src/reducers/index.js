import { combineReducers } from 'redux';
import inventoryReducer from './inventory';

const red = inventoryReducer;

const rootReducer = combineReducers({
	inventory: red,
});

export default rootReducer;
