import React, { useState } from 'react';
import skuService from '../../services/skuService';
import '../../styles/card.css';
import '../../styles/invForm.css';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { FirebaseDatabaseMutation } from '@react-firebase/database';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import HistoryIcon from '@material-ui/icons/History';
import ChangeLog from '../ChangeLog';

const InventoryForm = (props) => {
	let newSku = { ...props.sku };

	const handleSubmit = (e, newSku) => {
		e.preventDefault();
		delete newSku.id;
		props.onInv(e, newSku);
	};

	return (
		<div className="form-container">
			<form onSubmit={(e) => handleSubmit(e, newSku)} className="form">
				{newSku.quantity.map((lot, i) => {
					return (
						<div key={i} className="form-item">
							<label htmlFor={lot.lotNumber}>
								{`Lot: ${lot.lotNumber}`}
								<input
									name={lot.lotNumber}
									type="number"
									defaultValue={
										newSku.quantity[i].mcCount
									}
									onChange={(e) => {
										newSku.quantity[i].mcCount =
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

const SkuDetailView = ({ sku }) => {
	return (
		<div className="detail-container">
			<div className="detail-item">{`MC Config: ${sku.countPerMC} units in a ${sku.MCSize} box.`}</div>
		</div>
	);
};

const SkuCardMutationLayer = (props) => {
	const handleMutation = async (e, runMutation, obj) => {
		e.preventDefault();
		await runMutation(obj);
	};

	return (
		<>
			<FirebaseDatabaseMutation
				type="set"
				path={`data/skus/${props.sku.id}`}
			>
				{({ runMutation }) => {
					return (
						<SkuCard
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

const SkuCard = (props) => {
	// none // inv // history // more //
	const [menu, setMenu] = useState('none');

	const handleInv = (e, newSku) => {
		props.onInv(e, newSku);
		setMenu('none');
	};

	const renderMenu = () => {
		if (menu === 'none') return <></>;
		if (menu === 'inv')
			return (
				<div className="extended">
					<InventoryForm
						sku={props.sku}
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
				<div>
					<div className="extended">
						<ChangeLog obj={props.sku} />
					</div>
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

export default SkuCardMutationLayer;
