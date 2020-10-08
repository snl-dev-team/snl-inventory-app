import React, { useState } from 'react';
import CheckIcon from '@material-ui/icons/Check';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { FirebaseDatabaseMutation } from '@react-firebase/database';
import lotService from '../../../services/lotService';
import '../../../styles/card.css';
import HistoryIcon from '@material-ui/icons/History';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { Button, Input } from '@material-ui/core';

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

const LotCardInventoryForm = (props) => {
	let newLot = { ...props.lot };

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				props.onInv(e, newLot);
			}}
		>
			<div className="card-form-items-container">
				<div className="card-form-item">
					<label htmlFor={`lot-${newLot.id}`}>
						<div className="thin-callout">{`Quantity: `}</div>
					</label>
					<div className="card-form-spacer"></div>
					<Input
						id={`lot-${newLot.id}`}
						type="number"
						defaultValue={newLot.quantity}
						onChange={(e) => {
							newLot.quantity = Number(e.target.value);
						}}
						step="1"
					/>
				</div>
				<div className="card-form-btn-container">
					<Button type="submit" variant="outlined">
						Done
					</Button>
				</div>
			</div>
		</form>
	);
};

const LotCardView = (props) => {
	// none // inv //
	const [menu, setMenu] = useState('none');

	const toggleMenu = (view) => {
		if (view !== 'none' && view !== 'inv' && view !== 'history') return;
		setMenu(menu === view ? 'none' : view);
	};

	const handleInv = (e, newLot) => {
		let lotCopy = { ...newLot };
		if (lotCopy.completed) {
			lotCopy.completed = !lotCopy.completed;
		}
		props.onInv(e, lotCopy);
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
					<LotCardInventoryForm
						lot={props.lot}
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
				<div className="menu-container">{renderMenu()}</div>
				<div className="btn-container">
					<div className="btn" onClick={() => toggleMenu('inv')}>
						<AssignmentIcon className="icon" />
					</div>
					<div
						className="btn"
						onClick={() => toggleMenu('history')}
					>
						<HistoryIcon className="icon" />
					</div>
					<div className="btn" onClick={handleComplete}>
						{props.lot.completed ? (
							<ArrowUpwardIcon className="icon" />
						) : (
							<CheckIcon className="icon" />
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default LotMutationLayer;
