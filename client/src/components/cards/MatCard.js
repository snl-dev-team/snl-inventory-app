import React from 'react';
import '../../styles/card.css';

const MatCard = (props) => {
	return (
		<>
			<div className="card">
				<div>
					<h1 className="product-name">
						{props.mat.productName}
					</h1>
					<div>
						{props.mat.quantity.map((lot) => {
							return <p>{lot.lotNumber}</p>;
						})}
					</div>
				</div>
			</div>
		</>
	);
};

export default MatCard;
