import React, { useRef, useEffect } from 'react';
import logService from '../../services/logService';
import '../../styles/inventory.css';
import app from '../../config/firebase';

const CardInventoryForm = (props) => {
	let newObj = { ...props.obj };
	const { type } = props;

	const handleSubmit = (e, newObj) => {
		e.preventDefault();
		if (type === 'lot') {
			newObj.changeLog.push({
				dateTime: new Date().toLocaleString(),
				message: logService(
					logService.logLotChange(
						app.auth().currentUser.email,
						props.obj,
						newObj
					)
				),
			});
		} else if (type === 'mat') {
			newObj.changeLog.push({
				dateTime: new Date().toLocaleString(),
				message: logService.logMatChange(
					app.auth().currentUser.email,
					props.obj,
					newObj
				),
			});
		} else if (type === 'sku') {
			console.log(props.obj);
			console.log(newObj);
			newObj.changeLog.push({
				dateTime: new Date().toLocaleString(),
				message: logService.logSkuChange(
					app.auth().currentUser.email,
					props.obj,
					newObj
				),
			});
		}
		props.onInv(e, newObj);
	};

	const renderForm = () => {
		if (type === 'sku' || type === 'mat') {
			return (
				<>
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
				</>
			);
		} else if (type === 'lot') {
			return (
				<>
					<div className="form-item">
						<label htmlFor={newObj.lotNumber}>
							Quantity
							<input
								name={newObj.lotNumber}
								type="number"
								defaultValue={newObj.quantity}
								onChange={(e) => {
									newObj.quantity = Number(
										e.target.value
									);
								}}
								step="1"
							/>
						</label>
					</div>
				</>
			);
		} else {
			return <></>;
		}
	};

	return (
		<div className="form-container">
			<form onSubmit={(e) => handleSubmit(e, newObj)} className="form">
				{renderForm()}
				<button type="submit">Done</button>
			</form>
		</div>
	);
};

export default CardInventoryForm;
