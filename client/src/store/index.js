import { applyMiddleware, createStore } from 'redux';
import promise from 'redux-promise-middleware';
import logger from 'redux-logger';
import rootReducer from '../reducers/index';

const store = createStore(rootReducer, applyMiddleware(logger, promise));
export default store;
