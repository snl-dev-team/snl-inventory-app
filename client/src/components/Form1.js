import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
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
		setConfig(data);
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
					placeholder="configName"
					name="configName"
					ref={register}
				/>
				<input
					type="text"
					placeholder="MCSize"
					name="MCSize"
					ref={register}
				/>

				<input
					type="number"
					placeholder="countPerMC"
					name="countPerMC"
					ref={register}
				/>
				<select type="boolean" name="productBoxes" ref={register}>
					<option value={false}>Not In Product Boxes</option>
					<option value={true}>In Product Boxes</option>
				</select>
				<input
					type="text"
					placeholder="productName"
					name="productName"
					ref={register}
				/>
				<input type="submit" value="Submit" />
			</form>
		</div>
	);
}
