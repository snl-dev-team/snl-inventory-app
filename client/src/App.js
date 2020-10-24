import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './containers/dashboard/Dashboard';
import SignUp from './containers/SignUp';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers';
const AppWrapper = () => {
	const store = createStore(rootReducer);

	return (
		<Provider store={store}>
			{' '}
			<App />
		</Provider>
	);
};

const App = () => {
	return (
		<Router>
			<div>
				<Route exact path="/signup" component={SignUp} />

				<Route exact path="/" component={Home} />
			</div>
		</Router>
	);
};

export default AppWrapper;
