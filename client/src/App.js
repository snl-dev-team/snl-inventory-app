import React from 'react';
import { AuthProvider } from './config/Auth';
import {
	FirebaseDatabaseProvider,
	FirebaseDatabaseNode,
} from '@react-firebase/database';
import firebase from 'firebase';
import config from './config/firebase';
import RouteContainer from './route_components/RouteContainer';

const App = () => {
	return (
		<AuthProvider>
			<FirebaseDatabaseProvider firebase={firebase} {...config}>
				<div>
					<FirebaseDatabaseNode path="data">
						{(d) => {
							return (
								<>
									<RouteContainer data={d.value} />
								</>
							);
						}}
					</FirebaseDatabaseNode>
				</div>
			</FirebaseDatabaseProvider>
		</AuthProvider>
	);
};

export default App;
