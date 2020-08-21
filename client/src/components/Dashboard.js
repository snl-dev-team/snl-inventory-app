import React from 'react';
import app from '../firebase';

const Dashboard = (props) => {
	const updateData = (data) => {
		const newData = [...data, {}];
		props.onUpdate(newData);
	};

	const { data } = props;

	return (
		<div>
			<h1>Dashboard</h1>
			<button onClick={() => app.auth().signOut()}>Sign Out</button>
			<button onClick={() => updateData(data)}>Post Data</button>
			<pre>{JSON.stringify(data)}</pre>
		</div>
	);
};

export default Dashboard;
