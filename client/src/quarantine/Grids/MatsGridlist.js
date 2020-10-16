import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MatCard from '../cards/MatCard';
const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		height: 1000,
		width: 650,
	},
	control: {
		padding: theme.spacing(2),
	},
}));

export default function MatsGrid(props) {
	const classes = useStyles();
	const { data } = props;
	const { skus, lots, mats } = data;

	return (
		<Grid container className={classes.root} spacing={2}>
			<Grid item xs={12}>
				<Grid container justify="center" spacing={2}>
					<Grid>
						<Paper className={classes.paper}>
							{mats.map((mat, i) => {
								return (
									<div
										className="grid-item-container"
										key={i}
									>
										<MatCard mat={mat} />
									</div>
								);
							})}
						</Paper>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}
