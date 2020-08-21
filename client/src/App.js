import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { AuthProvider } from './Auth';
import PrivateRoute from './PrivateRoute';
import * as resource from './test_data/schema.json';

const App = () => {
	const [data, setData] = useState(resource.default);

	useEffect(() => {
		console.log('data modified');
	}, [data]);

	return (
		<AuthProvider>
			<Router>
				<div>
					<PrivateRoute
						exact
						path="/"
						component={() => (
							<Dashboard
								data={data}
								onUpdate={(newData) => setData(newData)}
							/>
						)}
					/>
					<Route exact path="/login" component={Login} />
					<Route exact path="/signup" component={SignUp} />
				</div>
			</Router>
		</AuthProvider>
	);
};

export default App;
