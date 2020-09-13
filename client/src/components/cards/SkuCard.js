import React, { useState } from 'react';
import AssignmentIcon from '@material-ui/icons/Assignment';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import HistoryIcon from '@material-ui/icons/History';
import { FirebaseDatabaseMutation } from '@react-firebase/database';
import ChangeLog from './ChangeLog';
import CardInventoryForm from './CardInventoryForm';
import skuService from '../../services/skuService';
import '../../styles/card.css';

const SkuMutationLayer = (props) => {
	const handleMutation = async (e, runMutation, obj) => {
		e.preventDefault();
		await runMutation(skuService.unFormatSku(obj));
	};

	return (
		<>
			<FirebaseDatabaseMutation
				type="set"
				path={`data/skus/${props.sku.id}`}
			>
				{({ runMutation }) => {
					return (
						<SkuCardView
							onInv={async (e, obj) => {
								handleMutation(e, runMutation, obj);
							}}
							sku={props.sku}
						/>
					);
				}}
			</FirebaseDatabaseMutation>
		</>
	);
};

const SkuCardView = (props) => {
	// none // inv // history // more //
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

	const handleInv = (e, newSku) => {
		props.onInv(e, newSku);
		setMenu('none');
	};

	const renderMenu = () => {
		if (menu === 'none') return <></>;
		if (menu === 'inv')
			return (
				<div className="extended">
					<CardInventoryForm
						obj={props.sku}
						type="sku"
						onInv={(e, newSku) => handleInv(e, newSku)}
					/>
				</div>
			);
		if (menu === 'more')
			return (
				<div className="extended">
					<SkuDetailView sku={props.sku} />
				</div>
			);
		if (menu === 'history')
			return (
				<div className="extended">
					<ChangeLog log={props.sku.changeLog} />
				</div>
			);
	};

	return (
		<>
			<div className="card">
				<div className="text-container">
					<div className="headline">{props.sku.configName}</div>
					<div className="sub-headline">{`${
						skuService.getSkuQuantityInUnits(props.sku) /
						props.sku.countPerMC
					} MCs / ${skuService.getSkuQuantityInUnits(
						props.sku
					)} units`}</div>
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
					<div
						className="btn"
						onClick={() => toggleMenu('more')}
					>
						<MoreHorizIcon className="icon" />
					</div>
				</div>
			</div>
		</>
	);
};

const SkuDetailView = ({ sku }) => {
	return (
		<div className="detail-container">
			<div className="detail-item callout">{`${
				sku.countPerMC
			} units of ${sku.productBoxes ? 'kitted ' : ''}${
				sku.productName
			} in a ${sku.MCSize} box.`}</div>
			<ul>
				{sku.quantity
					.slice(0)
					.sort((a, b) => {
						return b.mcCount - a.mcCount;
					})
					.map((lot, i) => {
						if (lot.mcCount > 0) {
							return (
								<li className="detail-item" key={i}>{`${
									lot.mcCount * sku.countPerMC
								} units expiring ${lot.expDate}`}</li>
							);
						} else {
							return (
								<React.Fragment
									key={i}
								></React.Fragment>
							);
						}
					})}
			</ul>
		</div>
	);
};

export default SkuMutationLayer;
