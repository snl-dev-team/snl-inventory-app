import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../config/Auth';

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
	let currentUser = null;
	return (
		<Route
			{...rest}
			render={(routeProps) =>
				!!currentUser ? (
					<RouteComponent {...routeProps} />
				) : (
					<Redirect to={'/'} />
				)
			}
		/>
	);
};

export default PrivateRoute;
