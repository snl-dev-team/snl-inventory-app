import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import filterService from '../services/filterService';
import AppContainer from '../components/AppContainer';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import CreateUser from './CreateUser';
import FormContainer from '../components/forms/FormContainer';

const RouteContainer = (props) => {
	const [filteredData, setFilteredData] = useState({
		skus: [],
		lots: [],
		mats: [],
	});
	// lot = 0; sku = 1; mat = 2
	const [view, setView] = useState(1);

	useEffect(() => {
		const { data } = props;
		if (data === null || !data.skus || !data.mats || !data.lots) return;
		setFilteredData(filterService(data));
	}, [props]);

	return (
		<>
			<Router>
				<div>
					<Route exact path="/login" component={Login} />
					<PrivateRoute
						exact
						path="/"
						component={() => (
							<AppContainer
								data={filteredData}
								view={view}
								onSetView={(v) => setView(v)}
							/>
						)}
					/>
					<PrivateRoute
						exact
						path="/create-user"
						component={CreateUser}
					/>
					<PrivateRoute
						exact
						path="/create-product"
						component={() => (
							<FormContainer
								data={filteredData}
								view={view}
								onSetView={(v) => setView(v)}
							/>
						)}
					/>
				</div>
			</Router>
		</>
	);
};

export default RouteContainer;
