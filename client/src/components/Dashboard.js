import React from 'react';
import app from '../firebase';

const Dashboard = (props) => {
	return (
		<div>
			<h1>Dashboard</h1>
			<button onClick={() => app.auth().signOut()}>Sign Out</button>
			<pre>{JSON.stringify(props.data)}</pre>
		</div>
	);
};

export default Dashboard;
