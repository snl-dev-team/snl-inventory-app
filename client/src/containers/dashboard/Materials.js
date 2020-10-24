import React, { useEffect } from 'react';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import { useSelector, useDispatch, ReactReduxContext } from 'react-redux';
import { fetchMats } from '../../actions';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';

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
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	},
}));

const MaterialsDashboard = () => {
	const dispatch = useDispatch();
	const classes = useStyles();

	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	useEffect(() => {
		dispatch(fetchMats());
	});
	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	return (
		mats.map((mat, i) => {
			<ReactReduxContext.Provider>
				{({ store }) => {
					mats = store.mats;
				}}
				<div className={classes.root} key={i}>
					<Grid container spacing={3}>
						<Grid item xs>
							<div>{mat}</div>
						</Grid>
					</Grid>
				</div>
			</ReactReduxContext.Provider>;
		}) <
		(
			<Fab
				size="medium"
				color="secondary"
				aria-label="add"
				className={classes.margin}
			>
				<AddIcon />
			</Fab>
		)
	);
};
export default MaterialsDashboard;
