import React from 'react';
import '../../styles/card.css';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CreateIcon from '@material-ui/icons/Create';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import matService from '../../services/matService';

const MatCard = (props) => {
	const getFormattedLotString = () => {
		const lots = matService.getLotArrayByMat(props.mat);
		if (lots.length === 1) return lots[0];
		if (lots.length === 2) return `${lots[0]}, ${lots[1]}`;
		if (lots.length > 2) return `${lots[0]}, ${lots[1]}...`;
	};

	return (
		<>
			<div className="card">
				<div className="text-container">
					<div className="headline">{props.mat.productName}</div>
					<div className="sub-headline">{`${getFormattedLotString()}`}</div>
				</div>
				<div className="btn-container">
					<div className="btn" id="inv-btn">
						<AssignmentIcon className="icon clipboard" />
					</div>
					<div className="btn" id="cnt-btn">
						<CreateIcon className="icon pen" />
					</div>
					<div className="btn" id="shp-btn">
						<LocalShippingIcon className="icon ship" />
					</div>
				</div>
			</div>
		</>
	);
};

export default MatCard;
