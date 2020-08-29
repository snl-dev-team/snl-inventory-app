import React from 'react';
import SkuCard from '../cards/SkuCard';
import LotCard from '../cards/LotCard';
import MatCard from '../cards/MatCard';
import '../../styles/dashboard.css';

const Dashboard = ({ data, view }) => {
	const { skus, lots, mats } = data;

	const renderCards = () => {
		if (view === 0)
			return lots.map((lot, i) => {
				return (
					<div className="grid-item-container" key={i}>
						<LotCard lot={lot} />
					</div>
				);
			});
		else if (view === 1)
			return skus.map((sku, i) => {
				return (
					<div className="grid-item-container" key={i}>
						<SkuCard sku={sku} />
					</div>
				);
			});
		else if (view === 2)
			return mats.map((mat, i) => {
				return (
					<div className="grid-item-container" key={i}>
						<MatCard mat={mat} />
					</div>
				);
			});
		else
			return (
				<div>
					<h1>Error :(</h1>
				</div>
			);
	};
	return (
		<>
			<div className="card-grid">{renderCards()}</div>
		</>
	);
};

export default Dashboard;
