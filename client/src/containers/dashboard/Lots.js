import React from 'react';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import LotGrid from '../../components/tmp/Grids/LotsGridList';
import { data } from '../../test_data/schema.json';
import Popover from '@material-ui/core/Popover';
import LotForm from '../../components/tmp/forms/LotForm';
import { useSelector, useDispatch } from 'redux';
import { fetchLots } from '../../actions';

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
		dispatch(fetchLots());
	});
	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	return (
		<div>
			<LotGrid {...data} />
			<Fab
				size="medium"
				color="secondary"
				aria-label="add"
				className={classes.margin}
				aria-describedby={id}
				variant="contained"
				color="primary"
				onClick={handleClick}
			>
				<AddIcon />
			</Fab>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
			>
				<LotForm />
			</Popover>
		</div>
	);
};

export default LotsDashboard;
