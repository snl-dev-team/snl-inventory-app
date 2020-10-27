import React, { useEffect, useState } from 'react';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMaterials } from '../../actions/material';
import MaterialsCard from '../../components/MaterialsCard';
import Grid from '@material-ui/core/Grid';
import UpsertMaterialDialog from '../../components/UpsertMaterialDialog';
import { DIALOG_STATES } from '../../constants/dialog';

const useStyles = makeStyles((theme) => ({
	margin: {
		margin: 0,
		top: 'auto',
		right: 20,
		bottom: 20,
		left: 'auto',
		position: 'fixed',
	},
	extendedIcon: {
		marginRight: theme.spacing(1),
	},
	root: {
		flexGrow: 1,
	},
}));

const MaterialsDashboard = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchMaterials());
	}, [dispatch]);

	const materials = useSelector(
		(state) => Object.values(state.materials),
		(before, after) =>
			Object.keys(before).length === Object.keys(after).length
	);

	const [dialogState, setDialogState] = useState(null);

	const classes = useStyles();

	return (
		<div>
			<div className={classes.root}>
				<Grid container spacing={3} justify="center">
					{materials.map((material) => (
						<Grid key={material.id}>
							<MaterialsCard {...material} />
						</Grid>
					))}
				</Grid>
			</div>
			<UpsertMaterialDialog
				state={dialogState}
				closeDialog={() => setDialogState(DIALOG_STATES.HIDDEN)}
			/>
			<Fab
				size="medium"
				color="secondary"
				aria-label="add"
				className={classes.margin}
				onClick={() => setDialogState(DIALOG_STATES.SHOW_CREATE)}
			>
				<AddIcon />
			</Fab>
		</div>
	);
};
export default MaterialsDashboard;
