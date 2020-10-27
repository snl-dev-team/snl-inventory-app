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
import { createMaterial } from '../actions/material';

export default function UpsertMaterialDialog() {
	const history = useHistory();
	const dispatch = useDispatch();
	const { id } = useParams();

	const handleClose = () => {
		history.push('/dashboard/materials');
	};

	const isAdd = id === undefined;

	const [materialName, setMaterialName] = useState('');
	const [lotNumber, setLotNumber] = useState('');
	const [count, setCount] = useState(0);
	const [expirationDate, setExpirationDate] = useState('');
	const [price, setPrice] = useState(0.0);

	const getTitle = () => {
		if (isAdd) {
			return 'Create Material';
		} else {
			return 'Edit Material';
		}
	};

	const createMaterialAndClose = () => {
		const material = {
			material_name: materialName,
			number: lotNumber,
			count: count,
			expiration_date: expirationDate,
			price: price,
		};
		dispatch(createMaterial(material));
		history.push('/dashboard/materials');
	};

	return (
		<div>
			<Dialog
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
								value={materialName}
								onChange={(e) =>
									setMaterialName(e.target.value)
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
								value={lotNumber}
								onChange={(e) =>
									setLotNumber(e.target.value)
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
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() =>
							history.push('/dashboard/materials')
						}
						color="primary"
					>
						Cancel
					</Button>
					<Button
						onClick={isAdd ? createMaterialAndClose : null}
						color="primary"
					>
						{isAdd ? 'Create' : 'Save'}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
