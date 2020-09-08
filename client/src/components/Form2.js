import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';
const useStyles = makeStyles((theme) => ({
	root: {
		'& > *': {
			margin: theme.spacing(1),
			width: '25ch',
			alignItems: 'center',
			justifyContent: 'center',
		},
	},
}));

export default function BasicTextFields(props) {
	const classes = useStyles();
	const [newConfig, setConfig] = useState({});
	const { register, handleSubmit } = useForm();
	const onSubmit = (data) => {
		setConfig({
			productName: data.productName,
			quantity: [
				{
					lotNumber: data.lotNumber,
					countInUnits: data.countInUnits,
				},
			],
		});
		console.log(newConfig);
	};
	return (
		<div className={classes.root}>
			<form
				className={classes.root}
				noValidate
				autoComplete="off"
				onSubmit={handleSubmit(onSubmit)}
			>
				<input
					type="text"
					placeholder="productName"
					name="productName"
					ref={register}
				/>
				<input
					type="text"
					placeholder="lotNumber"
					name="lotNumber"
					ref={register}
				/>
				<input
					type="number"
					placeholder="countInUnits"
					name="countInUnits"
					ref={register}
				/>
				<input type="submit" value="Submit" />
			</form>
		</div>
	);
}
