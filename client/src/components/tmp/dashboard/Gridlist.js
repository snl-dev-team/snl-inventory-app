import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Paper from '@material-ui/core/Paper';
import MatCard from '../cards/matcard';

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
		justifyContent: 'center',
	},
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		overflow: 'hidden',
		backgroundColor: theme.palette.background.paper,
	},

	paper: {
		height: 'flex',
		width: 'flex',
	},

	gridList: {
		width: 'flex',
		height: 'flex',
	},
}));

export default function matsGridList(props) {
	const { data, view } = props;
	const { mats } = data;
	const classes = useStyles();

	return (
		<div>
			<div className={classes.root}>
				<GridList
					cellHeight={'flex'}
					className={classes.gridList}
					cols={1}
				>
					<GridListTile>
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
					</GridListTile>
				</GridList>
			</div>
		</div>
	);
}
