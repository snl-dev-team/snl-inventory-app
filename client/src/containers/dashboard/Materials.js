import React, { useEffect } from 'react';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMaterials } from '../../actions/material';
import MaterialsCard from '../../components/MaterialsCard';
import Grid from '@material-ui/core/Grid';


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
	}
}));

const groupArray = (data, n) => {
    var group = [];
    for (var i = 0, j = 0; i < data.length; i++) {
        if (i >= n && i % n === 0)
            j++;
        group[j] = group[j] || [];
        group[j].push(data[i])
    }
    return group;
}

const MaterialsDashboard = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchMaterials());
	}, [dispatch]);

	const materials = useSelector(state => Object.keys(state.materials), (before, after) => Object.keys(before).length === Object.keys(after).length);

	const classes = useStyles();

	return (
		<div>
			<div className={classes.root}>
				<Grid container spacing={3} justify="center">
				{materials.map(_ => <
							Grid item spacing={3}>
								<MaterialsCard />
							</Grid>)
						}
				</Grid>
			</div>
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
export default MaterialsDashboard;
