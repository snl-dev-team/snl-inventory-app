import React from 'react';
import AppContainer from '../components/AppContainer';
import {
	FirebaseDatabaseProvider,
	FirebaseDatabaseNode,
} from '@react-firebase/database';
import firebase from 'firebase';
import config from '../config/firebase';

const MainRoute = () => {
	return (
		<>
			<FirebaseDatabaseProvider firebase={firebase} {...config}>
				<div>
					<FirebaseDatabaseNode path="data">
						{(d) => {
							return <AppContainer data={d.value} />;
						}}
					</FirebaseDatabaseNode>
				</div>
			</FirebaseDatabaseProvider>
		</>
	);
};

export default MainRoute;
