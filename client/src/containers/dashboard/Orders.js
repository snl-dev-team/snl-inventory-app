import React, { useEffect } from 'react';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import MatGrid from '../../components/tmp/Grids/MatsGridlist';
import OrderGrid from '../../components/tmp/Grids/OrdersGridList';
import { data } from '../../test_data/schema.json';
import Popover from '@material-ui/core/Popover';
import { useSelector, useDispatch } from 'redux';
import { fetchOrders } from '../../actions';


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

const OrdersDashboard = () => {
	const dispatch = useDispatch();
	const classes = useStyles();

	useEffect(() => {
		dispatch(fetchOrders());
	});

	return (
		<div>
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

export default OrdersDashboard;
