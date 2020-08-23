import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles({
	root: {
		flexGrow: 100,
	},
});

function CenteredTabs(props) {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Tabs
				value={props.view}
				indicatorColor="primary"
				textColor="inherit"
				centered
			>
				<Tab label="Production" onClick={() => props.onSet(0)} />
				<Tab label="Inventory" onClick={() => props.onSet(1)} />
				<Tab label="Raw Materials" onClick={() => props.onSet(2)} />
			</Tabs>
		</div>
	);
}
export default CenteredTabs;
