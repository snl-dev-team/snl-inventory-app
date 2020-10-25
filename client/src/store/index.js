import { applyMiddleware, createStore } from 'redux';
import rootReducer from '../reducers/index';
import promise from 'redux-promise-middleware'
import logger from 'redux-logger';

const store = createStore(rootReducer, applyMiddleware(logger, promise));
export default store;
