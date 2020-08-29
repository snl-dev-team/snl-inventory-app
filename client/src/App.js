import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AuthProvider } from './config/Auth';
import Login from './route_components/Login';
import CreateUser from './route_components/CreateUser';
import MainRoute from './route_components/MainRoute';
import PrivateRoute from './route_components/PrivateRoute';
import NewProductPage from './route_components/NewProductPage';

const App = () => {
	return (
		<AuthProvider>
			<Router>
				<div>
					<Route exact path="/login" component={Login} />
					<PrivateRoute exact path="/" component={MainRoute} />
					<PrivateRoute
						exact
						path="/create-user"
						component={CreateUser}
					/>
					<PrivateRoute
						exact
						path="/create-product"
						component={NewProductPage}
					/>
				</div>
			</Router>
		</AuthProvider>
	);
};

export default App;
