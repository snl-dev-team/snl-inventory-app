import { combineReducers } from 'redux';
import { inventoryReducer } from './inventory';

const rootReducer = combineReducers({
	inventory: inventoryReducer,
});

export default rootReducer;
