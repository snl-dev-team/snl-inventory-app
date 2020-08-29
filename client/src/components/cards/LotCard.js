import React from 'react';
import CheckIcon from '@material-ui/icons/Check';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { FirebaseDatabaseMutation } from '@react-firebase/database';
import '../../styles/card.css';

const LotCardMutationLayer = (props) => {
	const handleMutation = async (runMutation) => {
		let newLot = { ...props.lot };
		newLot.completed = !newLot.completed;
		delete newLot.id;
		await runMutation(newLot);
	};

	return (
		<>
			<FirebaseDatabaseMutation
				type="set"
				path={`data/lots/${props.lot.id}`}
			>
				{({ runMutation }) => {
					return (
						<LotCardView
							lot={props.lot}
							onCheck={async () => {
								handleMutation(runMutation);
							}}
						/>
					);
				}}
			</FirebaseDatabaseMutation>
		</>
	);
};

const LotCardView = (props) => {
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
					<div className="btn">
						<AssignmentIcon className="icon" />
					</div>
					<div className="btn" onClick={props.onCheck}>
						<CheckIcon className="icon" />
					</div>
				</div>
			</div>
		</>
	);
};

export default LotCardMutationLayer;
