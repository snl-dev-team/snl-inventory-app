import React from 'react';
//import app from '../firebase';
import LotCard from './cards/LotCard';
import SkuCard from './cards/SkuCard';
import MatCard from './cards/MatCard';
import '../styles/Dashboard.css';

const Dashboard = (props) => {
	const renderCards = () => {
		if (props.view === 'skus') {
			return props.data.skus.map((sku) => {
				return (
					<div className="grid-item-container">
						<SkuCard sku={sku} />
					</div>
				);
			});
		} else if (props.view === 'lots') {
			return props.data.lots.map((lot) => {
				return (
					<div className="grid-item-container">
						<LotCard lot={lot} />
					</div>
				);
			});
		} else {
			return props.data.mats.map((mat) => {
				return (
					<div className="grid-item-container">
						<MatCard mat={mat} />
					</div>
				);
			});
		}
	};

	// <button onClick={() => app.auth().signOut()}>Sign Out</button>

	return (
		<>
			<div className="card-grid">{renderCards()}</div>
		</>
	);
};

export default Dashboard;
