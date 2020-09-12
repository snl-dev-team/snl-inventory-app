import React from 'react';
import SkuForm from '../components/forms/SkuForm';
import LotForm from '../components/forms/LotForm';
import MatForm from '../components/forms/MatForm';
import { Select } from '@material-ui/core';
import { FirebaseDatabaseMutation } from '@react-firebase/database';
import unFilterService from '../services/unFilterService';

const FormMutationLayer = (props) => {
	const { data, view } = props;

	const handleNewLot = async (newLot, isExistingProduct, runMutation) => {
		let newData = { ...data };
		newData.lots.push({ ...newLot, id: data.lots.length });
		if (isExistingProduct) {
			newData.skus.forEach((sku, i) => {
				if (sku.productName === newLot.productName) {
					sku.quantity.push({
						lotNumber: newLot.lotNumber,
						expDate: newLot.expDate,
						mcCount: 0,
						id: data.skus[i].quantity.length,
					});
				}
			});
		}
		await runMutation(unFilterService(newData));
		window.location.href = '../';
	};

	const handleNewSku = async (newSku, runMutation) => {
		let newData = { ...data };
		let skuCopy = { ...newSku };
		newData.lots.forEach((lot, i) => {
			if (lot.productName === skuCopy.productName) {
				skuCopy.quantity.push({
					lotNumber: lot.lotNumber,
					expDate: lot.expDate,
					mcCount: 0,
					id: skuCopy.quantity.length,
				});
			}
		});
		newData.skus.push({ ...skuCopy, id: data.skus.length });
		await runMutation(unFilterService(newData));
		window.location.href = '../';
	};

	const handleNewMat = async (newMat, isExistingProduct, runMutation) => {
		let newData = { ...data };
		if (!isExistingProduct) {
			newData.mats.push({ ...newMat, id: data.mats.length });
		} else {
			console.log('handle existing');
			newData.mats.forEach((mat) => {
				if (mat.productName === String(newMat.productName)) {
					mat.quantity.push({
						...newMat.quantity[0],
						id: mat.quantity.length,
					});
					mat.changeLog.push({
						...newMat.changeLog[0],
						id: mat.changeLog.length,
					});
				}
			});
		}
		await runMutation(unFilterService(newData));
		window.location.href = '../';
	};

	return (
		<>
			<FirebaseDatabaseMutation type="set" path="data">
				{({ runMutation }) => {
					return (
						<FormContainer
							data={data}
							view={view}
							onSetView={(v) => props.onSetView(v)}
							onCreateLot={async (
								newLot,
								isExistingProduct
							) => {
								await handleNewLot(
									newLot,
									isExistingProduct,
									runMutation
								);
							}}
							onCreateSku={async (newSku) => {
								await handleNewSku(newSku, runMutation);
							}}
							onCreateMat={async (
								newMat,
								isExistingProduct
							) =>
								await handleNewMat(
									newMat,
									isExistingProduct,
									runMutation
								)
							}
						/>
					);
				}}
			</FirebaseDatabaseMutation>
		</>
	);
};

const FormContainer = (props) => {
	const { data, view } = props;
	const renderForm = () => {
		if (view === 0)
			return (
				<LotForm
					data={data}
					onCreate={(newLot, isExistingProduct) =>
						props.onCreateLot(newLot, isExistingProduct)
					}
				/>
			);
		else if (view === 1)
			return (
				<SkuForm
					data={data}
					onCreate={(newSku) => props.onCreateSku(newSku)}
				/>
			);
		else if (view === 2)
			return (
				<MatForm
					data={data}
					onCreate={(newMat, isExistingProduct) =>
						props.onCreateMat(newMat, isExistingProduct)
					}
				/>
			);
		else return <h1>Error :(</h1>;
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: 'white',
				width: 'fit-content',
				padding: '1em',
			}}
		>
			<div>
				<Select
					value={view}
					onChange={(e) =>
						props.onSetView(Number(e.target.value))
					}
					variant="outlined"
					native={true}
				>
					<option value={0}>New Lot</option>
					<option value={1}>New Shipping Config</option>
					<option value={2}>New Material</option>
				</Select>
			</div>
			{renderForm()}
		</div>
	);
};

export default FormMutationLayer;
