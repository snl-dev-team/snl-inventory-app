import React, { useState } from 'react';
import AssignmentIcon from '@material-ui/icons/Assignment';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import HistoryIcon from '@material-ui/icons/History';
import CardInventoryForm from './CardInventoryForm';
import { FirebaseDatabaseMutation } from '@react-firebase/database';
import matService from '../../services/matService';
import '../../styles/card.css';
import ChangeLog from './ChangeLog';

const MatCardViewMutationLayer = (props) => {
	const handleMutation = async (e, runMutation, obj) => {
		e.preventDefault();
		await runMutation(matService.unFormatMat(obj));
	};

	return (
		<>
			<FirebaseDatabaseMutation
				type="set"
				path={`data/mats/${props.mat.id}`}
			>
				{({ runMutation }) => {
					return (
						<MatCardView
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

const MatCardView = (props) => {
	const [menu, setMenu] = useState('none');

	const toggleMenu = (view) => {
		if (
			view !== 'none' &&
			view !== 'inv' &&
			view !== 'history' &&
			view !== 'more'
		)
			return;
		setMenu(menu === view ? 'none' : view);
	};

	const renderMenu = () => {
		if (menu === 'none') return <></>;
		if (menu === 'inv')
			return (
				<div className="extended">
					<CardInventoryForm
						obj={props.mat}
						type="mat"
						onInv={(e, newMat) => handleInv(e, newMat)}
					/>
				</div>
			);
		if (menu === 'more')
			return (
				<div className="extended">
					<MatDetailView mat={props.mat} />
				</div>
			);
		if (menu === 'history')
			return (
				<div className="extended">
					<ChangeLog log={props.mat.changeLog} />
				</div>
			);
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
					<div className="btn" onClick={() => toggleMenu('inv')}>
						<AssignmentIcon className="icon" />
					</div>
					<div
						className="btn"
						onClick={() => toggleMenu('history')}
					>
						<HistoryIcon className="icon" />
					</div>
					<div
						className="btn"
						onClick={() => toggleMenu('more')}
					>
						<MoreHorizIcon className="icon" />
					</div>
				</div>
				<div>{renderMenu()}</div>
			</div>
		</>
	);
};

const MatDetailView = ({ mat }) => {
	return (
		<div className="detail-container">
			<div className="detail-item">{`Inventory Value: $${
				matService.getMatValueInCents(mat) / 100
			}`}</div>
			<div className="detail-item">{`Price per ${mat.units}: $${
				mat.pricePerUnitInCents / 100
			}`}</div>
		</div>
	);
};

export default MatCardViewMutationLayer;