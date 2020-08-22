import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AuthProvider } from './Auth';
import Login from './route_components/Login';
import SignUp from './route_components/SignUp';
import MainRoute from './route_components/MainRoute';
import PrivateRoute from './PrivateRoute';

const App = () => {
	return (
		<AuthProvider>
			<Router>
				<div>
					<PrivateRoute exact path="/" component={MainRoute} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/signup" component={SignUp} />
				</div>
			</Router>
		</AuthProvider>
	);
};

export default App;
