import React from 'react';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import SkuGrid from '../../components/tmp/Grids/SkusGridlist';
import { data } from '../../test_data/schema.json';
import Popover from '@material-ui/core/Popover';
import SkuForm from '../../components/tmp/forms/SkuForm';
import { useSelector, useDispatch } from 'redux';
import { fetchSkus } from '../../actions';

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

const SKUsDashboard = () => {
	const dispatch = useDispatch();
	const classes = useStyles();

	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	useEffect(() => {
		dispatch(fetchSkus());
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

export default SKUsDashboard;
