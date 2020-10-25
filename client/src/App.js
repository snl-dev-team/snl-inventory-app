import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Dashboard from './containers/dashboard/Dashboard';
import SignUp from './containers/SignUp';
import { Provider } from 'react-redux';
import store from './store'

const App = () => {
	return (
		<Provider store={store}>
			<Router>
				<Route exact path="/signup" component={SignUp} />
				<Route path="/dashboard" component={Dashboard} />
			</Router>
		</Provider>
	);
};

export default App;
