import React from 'react';
import firebase from 'firebase';
import config from '../firebase';
import {
	FirebaseDatabaseProvider,
	FirebaseDatabaseNode,
} from '@react-firebase/database';

const DataProvider = () => {
	return (
		<>
			<FirebaseDatabaseProvider firebase={firebase} {...config}>
				<div>
					<FirebaseDatabaseNode path="data">
						{(d) => {
							return <></>;
						}}
					</FirebaseDatabaseNode>
				</div>
			</FirebaseDatabaseProvider>
		</>
	);
};
