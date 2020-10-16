import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './containers/dashboard/Dashboard';
import SignIn from './containers/SignIn';
import SignUp from './containers/SignUp';
import ResetPassword from './containers/ResetPassword';

const App = () => {
	return (
		<Router>
			<div>
				<Route exact path="/signin" component={SignIn} />
				<Route exact path="/signup" component={SignUp} />
				<Route
					exact
					path="/reset-password"
					component={ResetPassword}
				/>
				<Route exact path="/" component={Home} />
			</div>
		</Router>
	);
};

export default App;
