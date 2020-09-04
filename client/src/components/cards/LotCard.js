import React, { useState } from 'react';
import CheckIcon from '@material-ui/icons/Check';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { FirebaseDatabaseMutation } from '@react-firebase/database';
import lotService from '../../services/lotService';
import '../../styles/card.css';
import CardInventoryForm from './CardInventoryForm';

const LotCardMutationLayer = (props) => {
	const handleMutation = async (newLot, runMutation) => {
		await runMutation(lotService.unFormatLot(newLot));
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
							onCheck={async (newLot) => {
								handleMutation(newLot, runMutation);
							}}
							onInv={async (e, newLot) => {
								e.preventDefault();
								handleMutation(newLot, runMutation);
							}}
							key={props.lot.id}
						/>
					);
				}}
			</FirebaseDatabaseMutation>
		</>
	);
};

const LotCardView = (props) => {
	const handleComplete = () => {
		let newLot = { ...props.lot };
		newLot.completed = !newLot.completed;
		props.onCheck(newLot);
	};

	const [showForm, setShowForm] = useState(false);

	const handleInv = (e, newLot) => {
		props.onInv(e, newLot);
		setShowForm(false);
	};

	const renderForm = () => {
		if (showForm)
			return (
				<div className="extended">
					<CardInventoryForm
						obj={props.lot}
						type="lot"
						onInv={(e, newLot) => handleInv(e, newLot)}
						key={props.lot.id}
					/>
				</div>
			);
	};

	return (
		<>
			<div className="card">
				<div className="text-container">
					<div className="headline">{`Lot ${props.lot.lotNumber}`}</div>
					<div className="sub-headline">
						{props.lot.productName} / {props.lot.quantity}
					</div>
				</div>
				<div className="btn-container">
					<div
						className="btn"
						onClick={() => setShowForm(!showForm)}
					>
						<AssignmentIcon className="icon" />
					</div>
					<div className="btn" onClick={handleComplete}>
						<CheckIcon className="icon" />
					</div>
				</div>
				<div>{renderForm()}</div>
			</div>
		</>
	);
};

export default LotCardMutationLayer;
