import React, { useState } from 'react';
import { FirebaseDatabaseMutation } from '@react-firebase/database';
import { Button, InputLabel, Radio, Select } from '@material-ui/core';
import { Link } from 'react-router-dom';
import unFilterService from '../services/unFilterService';
import app from '../config/firebase';
import '../styles/deleteForm.css';

const DeleteProductMutationLayer = (props) => {
	const { data, view } = props;

	const handleDeleteLot = async (isMat, lotNumber, runMutation) => {
		let newData = { ...data };
		if (isMat) {
			data.mats.forEach((mat, i) => {
				mat.quantity.forEach((lot, j) => {
					if (lot.lotNumber === lotNumber) {
						newData.mats[i].quantity.splice(j, 1);
						newData.mats[i].changeLog.push({
							dateTime: new Date().toLocaleDateString(),
							message: `${app
								.auth()
								.currentUser.email.substr(
									0,
									app
										.auth()
										.currentUser.email.indexOf(
											'@'
										)
								)} deleted lot ${lotNumber}`,
							id: newData.mats[i].changeLog.length,
						});
					}
				});
			});
		} else {
			data.skus.forEach((sku, i) => {
				sku.quantity.forEach((lot, j) => {
					if (lot.lotNumber === lotNumber) {
						newData.skus[i].quantity.splice(j, 1);
						newData.skus[i].changeLog.push({
							dateTime: new Date().toLocaleDateString(),
							message: `${app
								.auth()
								.currentUser.email.substr(
									0,
									app
										.auth()
										.currentUser.email.indexOf(
											'@'
										)
								)} deleted lot ${lotNumber}`,
							id: newData.skus[i].changeLog.length,
						});
					}
				});
			});

			data.lots.forEach((lot, i) => {
				if (lot.lotNumber === lotNumber) {
					newData.lots.splice(i, 1);
				}
			});
		}

		await runMutation(unFilterService(newData));
		window.location.href = '../';
	};

	const handleDeleteSku = async (skuName, runMutation) => {
		let newData = { ...data };

		data.skus.forEach((sku, i) => {
			if (sku.configName === skuName) {
				newData.skus.splice(i, 1);
			}
		});

		await runMutation(unFilterService(newData));
		window.location.href = '../';
	};

	const handleDeleteMat = async (matName, runMutation) => {
		let newData = { ...data };

		data.mats.forEach((mat, i) => {
			if (mat.productName === matName) {
				newData.mats.splice(i, 1);
			}
		});

		await runMutation(unFilterService(newData));
		window.location.href = '../';
	};

	return (
		<>
			<FirebaseDatabaseMutation type="set" path="data">
				{({ runMutation }) => {
					return (
						<DeleteProductForm
							data={data}
							view={view}
							onSetView={(v) => props.onSetView(v)}
							onDeleteLot={async (isMat, lotNumber) =>
								await handleDeleteLot(
									isMat,
									lotNumber,
									runMutation
								)
							}
							onDeleteSku={async (skuName) => {
								await handleDeleteSku(
									skuName,
									runMutation
								);
							}}
							onDeleteMat={async (matName) =>
								await handleDeleteMat(
									matName,
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

const DeleteProductForm = (props) => {
	const { data, view } = props;
	const [isMat, setIsMat] = useState(true);
	const [lNumber, setLNumber] = useState('');
	const [skuName, setSkuName] = useState('');
	const [matName, setMatName] = useState('');

	const renderForm = () => {
		if (view === 0) {
			return (
				<div>
					<div className="delete-radio-item">
						<InputLabel htmlFor="is-product-radio">
							Product
							<Radio
								checked={!isMat}
								onClick={() => setIsMat(false)}
								id="is-product-radio"
							/>
						</InputLabel>
						<InputLabel htmlFor="is-material-radio">
							Material
							<Radio
								checked={isMat}
								onClick={() => setIsMat(true)}
								id="is-material-radio"
							/>
						</InputLabel>
					</div>
					<div className="delete-form-item">
						<LotNumberSelect
							data={data}
							selected={lNumber}
							mat={isMat}
							onSelect={(val) => setLNumber(val)}
							className="delete-form-component"
						/>
					</div>
					<div className="delete-form-item">
						<Button
							onClick={() =>
								props.onDeleteLot(isMat, lNumber)
							}
							color="primary"
							variant="contained"
							className="delete-form-component"
						>
							Delete
						</Button>
					</div>
					<div className="delete-form-item">
						<Button
							variant="contained"
							color="primary"
							component={Link}
							to="/"
							className="delete-form-component"
						>
							Cancel
						</Button>
					</div>
				</div>
			);
		} else if (view === 1) {
			return (
				<div>
					<div className="delete-form-item">
						<SkuSelect
							data={data}
							selected={skuName}
							onSelect={(val) => setSkuName(val)}
							className="delete-form-component"
						/>
					</div>
					<div className="delete-form-item">
						<Button
							onClick={() => props.onDeleteSku(skuName)}
							color="primary"
							variant="contained"
							className="delete-form-component"
						>
							Delete
						</Button>
					</div>
					<div className="delete-form-item">
						<Button
							variant="contained"
							color="primary"
							component={Link}
							to="/"
							className="delete-form-component"
						>
							Cancel
						</Button>
					</div>
				</div>
			);
		} else if (view === 2) {
			return (
				<div>
					<div className="delete-form-item">
						<MatSelect
							data={data}
							selected={matName}
							onSelect={(val) => setMatName(val)}
							className="delete-form-component"
						/>
					</div>
					<div className="delete-form-item">
						<Button
							onClick={() => props.onDeleteMat(matName)}
							color="primary"
							variant="contained"
							className="delete-form-component"
						>
							Delete
						</Button>
					</div>
					<div className="delete-form-item">
						<Button
							variant="contained"
							color="primary"
							component={Link}
							to="/"
							className="delete-form-component"
						>
							Cancel
						</Button>
					</div>
				</div>
			);
		} else {
			return <h1>Error :(</h1>;
		}
	};

	return (
		<div className="delete-form-page">
			<div className="delete-form-container">
				<div className="delete-form-item">
					<Select
						value={view}
						onChange={(e) =>
							props.onSetView(Number(e.target.value))
						}
						variant="outlined"
						native={true}
						className="delete-form-component"
					>
						<option value={0}>Lot</option>
						<option value={1}>Shipping Config</option>
						<option value={2}>Material</option>
					</Select>
				</div>
				{renderForm()}
			</div>
		</div>
	);
};

const MatSelect = (props) => {
	const { data } = props;

	return (
		<Select
			name="matSelect"
			defaultValue={props.selected}
			onChange={(e) => props.onSelect(e.target.value)}
			variant="outlined"
			native={true}
		>
			<option value="">Select Material</option>
			{data.mats.map((mat, i) => {
				return (
					<option value={mat.productName} key={i}>
						{mat.productName}
					</option>
				);
			})}
		</Select>
	);
};

const SkuSelect = (props) => {
	const { data } = props;

	return (
		<Select
			name="skuSelect"
			defaultValue={props.selected}
			onChange={(e) => props.onSelect(e.target.value)}
			variant="outlined"
			native={true}
		>
			<option value="">Select Config</option>
			{data.skus.map((sku, i) => {
				return (
					<option value={sku.configName} key={i}>
						{sku.configName}
					</option>
				);
			})}
		</Select>
	);
};

const LotNumberSelect = (props) => {
	const { data } = props;

	const getMatLots = () => {
		let uniqueLots = [];

		data.mats.forEach((mat) => {
			mat.quantity.forEach((lot) => {
				if (!uniqueLots.includes(lot.lotNumber)) {
					uniqueLots.push(lot.lotNumber);
				}
			});
		});

		return uniqueLots;
	};

	const getLots = () => {
		let uniqueLots = [];

		data.lots.forEach((lot) => {
			if (!uniqueLots.includes(lot.lotNumber)) {
				uniqueLots.push(lot.lotNumber);
			}
		});
		return uniqueLots;
	};

	return (
		<div>
			<Select
				name="lotNumber"
				defaultValue={props.selected}
				onChange={(e) => props.onSelect(e.target.value)}
				variant="outlined"
				native={true}
			>
				<option value="">Select Lot</option>
				{props.mat
					? getMatLots().map((number, i) => {
							return (
								<option value={number} key={i}>
									{number}
								</option>
							);
					  })
					: getLots().map((number, i) => {
							return (
								<option value={number} key={i}>
									{number}
								</option>
							);
					  })}
			</Select>
		</div>
	);
};

export default DeleteProductMutationLayer;
