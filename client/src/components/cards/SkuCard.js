import React from 'react';
import '../../styles/card.css';

const SkuCard = (props) => {
	return (
		<>
			<div className="card">
				<div>
					<h1>{props.sku.configName}</h1>
				</div>
			</div>
		</>
	);
};

export default SkuCard;
