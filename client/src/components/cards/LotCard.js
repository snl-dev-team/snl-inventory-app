import React, { useState, useEffect } from 'react';
import CheckIcon from '@material-ui/icons/Check';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { FirebaseDatabaseMutation } from '@react-firebase/database';
import lotService from '../../services/lotService';
import '../../styles/card.css';
import CardInventoryForm from './CardInventoryForm';
import '../../styles/inventory.css';

const LotMutationLayer = (props) => {
	const handleMutation = async (e, runMutation, obj) => {
		e.preventDefault();
		await runMutation(lotService.unFormatLot(obj));
	};

	return (
		<>
			<FirebaseDatabaseMutation
				type="set"
				path={`data/lots/${props.lot.id}`}
				key={[props.lot.quantity, props.lot.completed]}
			>
				{({ runMutation }) => {
					return (
						<LotCardView
							onInv={async (e, obj) => {
								handleMutation(e, runMutation, obj);
							}}
							onCheck={async (obj) => {
								await runMutation(
									lotService.unFormatLot(obj)
								);
							}}
							lot={props.lot}
						/>
					);
				}}
			</FirebaseDatabaseMutation>
		</>
	);
};

const LotCardView = (props) => {
	// none // inv //
	const [menu, setMenu] = useState('none');

	const toggleMenu = (view) => {
		if (view !== 'none' && view !== 'inv') return;
		setMenu(menu === view ? 'none' : view);
	};

	const handleInv = (e, newLot) => {
		props.onInv(e, newLot);
		setMenu('none');
	};

	const handleComplete = () => {
		let newLot = { ...props.lot };
		newLot.completed = !newLot.completed;
		props.onCheck(newLot);
	};

	const renderMenu = () => {
		if (menu === 'none') return <></>;
		if (menu === 'inv')
			return (
				<div className="extended">
					<CardInventoryForm
						obj={props.lot}
						type="lot"
						onInv={(e, newLot) => handleInv(e, newLot)}
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
					<div className="btn" onClick={() => toggleMenu('inv')}>
						<AssignmentIcon className="icon" />
					</div>
					<div className="btn" onClick={handleComplete}>
						<CheckIcon className="icon" />
					</div>
				</div>
				<div>{renderMenu()}</div>
			</div>
		</>
	);
};

const LotInventoryForm = (props) => {
	let newLot = { ...props.lot };

	const handleSubmit = (e, newLot) => {
		props.onInv(e, newLot);
	};

	return (
		<div className="form-container">
			<form onSubmit={(e) => handleSubmit(e, newLot)} className="form">
				<div className="form-item">
					<label htmlFor={props.lot.id}>
						Quantity
						<input
							name={props.lot.id}
							type="number"
							defaultValue={newLot.quantity}
							onChange={(e) => {
								newLot.quantity = Number(
									e.target.value
								);
							}}
							step="1"
						/>
					</label>
				</div>
				<button type="submit">Done</button>
			</form>
		</div>
	);
};

export default LotMutationLayer;

/*
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
*/
