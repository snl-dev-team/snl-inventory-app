import React from 'react';
import '../../styles/card.css';
import AssignmentIcon from '@material-ui/icons/Assignment';
import matService from '../../services/matService';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

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
					<div className="btn" id="more-btn">
						<MoreHorizIcon className="icon more" />
					</div>
				</div>
			</div>
		</>
	);
};

export default MatCard;
