import React from 'react';
import '../../styles/inventory.css';

const CardInventoryForm = (props) => {
	let newObj = { ...props.obj };
	const { type } = props;

	const handleSubmit = (e, newObj) => {
		e.preventDefault();
		delete newObj.id;
		props.onInv(e, newObj);
	};

	return (
		<div className="form-container">
			<form onSubmit={(e) => handleSubmit(e, newObj)} className="form">
				{newObj.quantity.map((lot, i) => {
					return (
						<div key={i} className="form-item">
							<label htmlFor={lot.lotNumber}>
								{`Lot: ${lot.lotNumber}`}
								<input
									name={lot.lotNumber}
									type="number"
									defaultValue={
										type === 'sku'
											? newObj.quantity[i]
													.mcCount
											: newObj.quantity[i]
													.countInUnits
									}
									onChange={(e) => {
										if (type === 'sku') {
											newObj.quantity[
												i
											].mcCount = Number(
												e.target.value
											);
										}
										if (type === 'mat') {
											newObj.quantity[
												i
											].countInUnits = Number(
												e.target.value
											);
										}
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

export default CardInventoryForm;
