import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DIALOG_STATES } from '../constants/dialog';

export default function UpsertMaterialDialog({ state, closeDialog }) {
	const handleClose = () => {
		closeDialog();
	};

	const getTitle = () => {
		if (state === DIALOG_STATES.SHOW_CREATE) {
			return 'Create Material';
		} else if (state === DIALOG_STATES.SHOW_EDIT) {
			return 'Edit Material';
		}
	};

	return (
		<div>
			<Dialog
				open={state !== DIALOG_STATES.HIDDEN}
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
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleClose} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
