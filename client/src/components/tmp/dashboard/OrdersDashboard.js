import React from 'react';
import matsGridList from './gridlist';
import './css/dashboard.css';

function Orderdash() {
	return (
		<div>
			<div className="float-container">
				<div className="float-child">
					<matsGridList></matsGridList>
				</div>
			</div>
		</div>
	);
}

export default Orderdash;
