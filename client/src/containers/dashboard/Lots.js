import React from 'react';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

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
}));

const LotsDashboard = () => {
	const classes = useStyles();
	return (
		<div>
			Lots
			<Fab
				size="medium"
				color="secondary"
				aria-label="add"
				className={classes.margin}
			>
				<AddIcon />
			</Fab>
		</div>
	);
};

export default LotsDashboard;
