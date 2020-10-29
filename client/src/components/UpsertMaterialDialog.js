import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createMaterial, updateMaterial } from '../actions/material';
import { UNIT_TYPES } from '../constants/units';

export default function UpsertMaterialDialog() {
	const history = useHistory();
	const dispatch = useDispatch();
	const { id } = useParams();

	const handleClose = () => {
		history.push('/materials');
	};

	const isAdd = id === undefined;

	const material = useSelector((state) => state.materials[id]);

	const [name, setName] = useState(
		material !== undefined ? material.name : ''
	);
	const [number, setNumber] = useState(
		material !== undefined ? material.number : ''
	);
	const [count, setCount] = useState(
		material !== undefined ? material.count : 0
	);
	const [expirationDate, setExpirationDate] = useState(
		material !== undefined ? material.expiration_date : ''
	);
	const [price, setPrice] = useState(
		material !== undefined ? material.price : 0.0
	);
	const [units, setUnits] = useState(
		material !== undefined ? material.units : 'unit'
	);

	const getTitle = () => {
		if (isAdd) {
			return 'Create Material';
		} else {
			return 'Edit Material';
		}
	};

	const createMaterialAndClose = () => {
		dispatch(
			createMaterial({
				name,
				number,
				count,
				expiration_date: expirationDate,
				price,
				units,
			})
		);
		history.push('/materials');
	};

	const updateMaterialAndClose = () => {
		dispatch(
			updateMaterial({
				name,
				number,
				count,
				expiration_date: expirationDate,
				price,
				units,
				id,
			})
		);
		history.push('/materials');
	};

	return (
		<div>
			<Dialog
				width="lg"
				open={true}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">
					{getTitle()}
				</DialogTitle>
				<DialogContent>
					<Grid container spacing={3} justify="center">
						<Grid item>
							<TextField
								autoFocus
								margin="dense"
								id="name"
								label="Material Name"
								type="text"
								fullWidth
								value={name}
								onChange={(e) =>
									setName(e.target.value)
								}
							/>
						</Grid>
						<Grid item>
							<TextField
								autoFocus
								margin="dense"
								id="name"
								label="Lot Number"
								type="text"
								fullWidth
								value={number}
								onChange={(e) =>
									setNumber(e.target.value)
								}
							/>
						</Grid>
						<Grid item>
							<TextField
								autoFocus
								margin="dense"
								id="name"
								label="Count"
								type="number"
								fullWidth
								value={count}
								onChange={(e) =>
									setCount(e.target.value)
								}
							/>
						</Grid>
						<Grid item>
							<TextField
								autoFocus
								margin="dense"
								id="name"
								label="Expiration Date"
								type="date"
								fullWidth
								InputLabelProps={{
									shrink: true,
								}}
								value={expirationDate}
								onChange={(e) =>
									setExpirationDate(e.target.value)
								}
							/>
						</Grid>
						<Grid item>
							<TextField
								autoFocus
								margin="dense"
								id="name"
								label="Price"
								type="number"
								fullWidth
								value={price}
								onChange={(e) =>
									setPrice(e.target.value)
								}
							/>
						</Grid>
						<Grid item>
							<TextField
								id="standard-select-currency-native"
								select
								label="Unit"
								value={units}
								onChange={(e) =>
									setUnits(e.target.value)
								}
								SelectProps={{
									native: true,
								}}
							>
								{Object.values(UNIT_TYPES).map(
									(option) => (
										<option
											key={option}
											value={option}
										>
											{option}
										</option>
									)
								)}
							</TextField>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => history.push('/materials')}
						color="primary"
					>
						Cancel
					</Button>
					<Button
						onClick={
							isAdd
								? createMaterialAndClose
								: updateMaterialAndClose
						}
						color="primary"
					>
						{isAdd ? 'Create' : 'Save'}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
