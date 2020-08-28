import React, { useState } from 'react';
import '../../styles/card.css';
import AssignmentIcon from '@material-ui/icons/Assignment';
import matService from '../../services/matService';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { FirebaseDatabaseMutation } from '@react-firebase/database';
import HistoryIcon from '@material-ui/icons/History';

const InventoryForm = (props) => {
	let newMat = { ...props.mat };

	const handleSubmit = (e, newSku) => {
		e.preventDefault();
		delete newSku.id;
		props.onInv(e, newSku);
	};

	return (
		<div className="form-container">
			<form onSubmit={(e) => handleSubmit(e, newMat)} className="form">
				{newMat.quantity.map((lot, i) => {
					return (
						<div key={i} className="form-item">
							<label htmlFor={lot.lotNumber}>
								{`Lot: ${lot.lotNumber}`}
								<input
									name={lot.lotNumber}
									type="number"
									defaultValue={
										newMat.quantity[i]
											.countInUnits
									}
									onChange={(e) => {
										newMat.quantity[
											i
										].countInUnits =
											e.target.value;
									}}
									step="1"
								/>
							</label>
						</div>
					);
				})}
				<button type="submit">Done</button>
			</form>
		</div>
	);
};

const MatCardMutationLayer = (props) => {
	const handleMutation = async (e, runMutation, obj) => {
		e.preventDefault();
		await runMutation(obj);
	};

	return (
		<>
			<FirebaseDatabaseMutation
				type="set"
				path={`data/mats/${props.mat.id}`}
			>
				{({ runMutation }) => {
					return (
						<MatCard
							mat={props.mat}
							onInv={async (e, obj) => {
								handleMutation(e, runMutation, obj);
							}}
						/>
					);
				}}
			</FirebaseDatabaseMutation>
		</>
	);
};

const MatCard = (props) => {
	const [menu, setMenu] = useState('none');

	const renderMenu = () => {
		if (menu === 'none') return <></>;
		if (menu === 'inv')
			return (
				<div className="extended">
					<InventoryForm
						mat={props.mat}
						onInv={(e, newMat) => handleInv(e, newMat)}
					/>
				</div>
			);
		if (menu === 'more') return <div className="extended"></div>;
		if (menu === 'history') return <div className="extended"></div>;
	};

	const handleInv = (e, newMat) => {
		props.onInv(e, newMat);
		setMenu('none');
	};

	return (
		<>
			<div className="card">
				<div className="text-container">
					<div className="headline">{props.mat.productName}</div>
					<div className="sub-headline">{`${matService.getTotalQuantity(
						props.mat
					)} ${props.mat.units}`}</div>
				</div>
				<div className="btn-container">
					<div
						className="btn"
						id="inv-btn"
						onClick={() =>
							setMenu(menu === 'inv' ? 'none' : 'inv')
						}
					>
						<AssignmentIcon className="icon clipboard" />
					</div>
					<div
						className="btn"
						id="history-btn"
						onClick={() =>
							setMenu(
								menu === 'history' ? 'none' : 'history'
							)
						}
					>
						<HistoryIcon className="icon clock" />
					</div>
					<div
						className="btn"
						id="more-btn"
						onClick={() =>
							setMenu(menu === 'more' ? 'none' : 'more')
						}
					>
						<MoreHorizIcon className="icon dots" />
					</div>
				</div>
				<div>{renderMenu()}</div>
			</div>
		</>
	);
};

export default MatCardMutationLayer;
