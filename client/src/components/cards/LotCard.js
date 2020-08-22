import React from 'react';
import '../../styles/card.css';

const LotCard = (props) => {
	return (
		<>
			<div className="card">
				<div>
					<h1 className="product-name">
						{props.lot.productName}
					</h1>
					<h2 className="lot-number">{props.lot.lotNumber}</h2>
				</div>
			</div>
		</>
	);
};

export default LotCard;
