import React, { useState } from 'react';
import skuService from '../../services/skuService';
import '../../styles/card.css';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CreateIcon from '@material-ui/icons/Create';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';

const InventoryForm = (props) => {
	let newSku = { ...props.sku };

	return (
		<form>
			{newSku.quantity.map((lot, i) => {
				return (
					<div key={i}>
						<label htmlFor={lot.lotNumber}>
							{lot.lotNumber}
							<input
								name={lot.lotNumber}
								type="number"
								defaultValue={lot.mcCount}
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
		</form>
	);
};

const SkuCard = (props) => {
	// none // inv // count // ship //
	const [menu, setMenu] = useState('none');

	const renderMenu = () => {
		if (menu === 'none') return <></>;
		if (menu === 'inv')
			return (
				<div className="extended">
					<InventoryForm sku={props.sku} />
				</div>
			);
		if (menu === 'count') return <></>;
		if (menu === 'ship') return <></>;
	};

	return (
		<>
			<div className="card">
				<div className="text-container">
					<div className="headline">{props.sku.configName}</div>
					<div className="sub-headline">{`Inventory: ${skuService.getSkuQuantityInUnits(
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
						id="cnt-btn"
						onClick={() =>
							setMenu(menu === 'count' ? 'none' : 'count')
						}
					>
						<CreateIcon className="icon pen" />
					</div>
					<div
						className="btn"
						id="shp-btn"
						onClick={() => {
							setMenu(menu === 'ship' ? 'none' : 'ship');
						}}
					>
						<LocalShippingIcon className="icon ship" />
					</div>
				</div>
				<div>{renderMenu()}</div>
			</div>
		</>
	);
};

export default SkuCard;
