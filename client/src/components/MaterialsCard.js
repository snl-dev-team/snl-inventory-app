import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 345,
		margin: 5,
	},
	media: {
		height: 0,
		paddingTop: '56.25%', // 16:9
	},
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(360deg)',
	},
}));

export default function RecipeReviewCard({
	count,
	experation_date,
	number,
	name,
	price,
	units,
}) {
	const classes = useStyles();

	const handleExpandClick = () => {};

	return (
		<Card className={classes.root}>
			<CardHeader title={name} />
			<CardContent>
				<Typography
					variant="body2"
					color="textSecondary"
					component="p"
				>
					Lot Number: {number}
					<br />
					Unit type: {units}
					<br />
					count: {count}
					<br />
					experation date: {experation_date}
					<br />
					Total value: {price * count}
					<br />
					Price per unit: {price}
					<br />
				</Typography>
			</CardContent>
			<CardActions disableSpacing>
				<IconButton
					className={clsx(classes.expand)}
					onClick={handleExpandClick}
				>
					<EditIcon />
				</IconButton>
			</CardActions>
		</Card>
	);
}
