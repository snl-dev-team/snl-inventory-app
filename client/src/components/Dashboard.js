import React from 'react';
import app from '../firebase';

const Dashboard = (props) => {
	return (
		<div>
			<h1>Dashboard</h1>
			<button onClick={() => app.auth().signOut()}>Sign Out</button>
			<div
				style={{
					fontFamily: 'courier new',
					color: 'crimson',
					backgroundColor: '#f1f1f1',
					padding: '2px',
					fontSize: '105%',
				}}
			>
				<code>{JSON.stringify(props.data)}</code>
			</div>
		</div>
	);
};

export default Dashboard;
