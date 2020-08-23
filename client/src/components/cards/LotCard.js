import React from 'react';
import '../../styles/card.css';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import CheckIcon from '@material-ui/icons/Check';

const LotCard = (props) => {
	return (
		<>
			<div className="card">
				<div className="text-container">
					<div className="headline">{`Lot ${props.lot.lotNumber}`}</div>
					<div className="sub-headline">
						{props.lot.productName}
					</div>
				</div>
				<div className="btn-container">
					<div className="btn" id="cmplt-btn">
						<BookmarkBorderIcon className="icon bookmark" />
					</div>
					<div className="btn" id="pin-btn">
						<CheckIcon className="icon check" />
					</div>
				</div>
			</div>
		</>
	);
};

export default LotCard;
