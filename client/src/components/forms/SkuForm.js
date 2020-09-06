import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useForm } from 'react-hook-form';
import { Checkbox, InputLabel, Button } from '@material-ui/core';
import ProductNameSelect from './ProductNameSelect';

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

const SkuForm = (props) => {
	const classes = useStyles();
	const [pName, setPName] = useState('');
	const { register, handleSubmit } = useForm();
	const onSubmit = (data) => {
		console.log({
			configName: data.configName,
			MCSize: data.MCSize,
			countPerMC: data.countPerMC,
			productBoxes: data.productBoxes,
			productName: pName,
			quantity: [],
			changeLog: [],
		});
	};
	return (
		<div className={classes.root}>
			<form
				className={classes.root}
				noValidate
				autoComplete="off"
				onSubmit={handleSubmit(onSubmit)}
			>
				<TextField
					type="text"
					helperText="ex: Thyroid FBA"
					label="Config Name"
					name="configName"
					inputProps={{ ref: register }}
					variant="outlined"
				/>

				<ProductNameSelect
					selected={pName}
					data={props.data}
					onSelect={(val) => setPName(val)}
				/>
				<InputLabel htmlFor="productBoxes">
					<Checkbox
						name="productBoxes"
						inputProps={{
							ref: register,
						}}
					/>
					In Product Boxes
				</InputLabel>
				<TextField
					type="text"
					helperText="ex: 16x16x16"
					label="MC Size"
					name="MCSize"
					inputProps={{ ref: register }}
					variant="outlined"
				/>

				<TextField
					type="number"
					helperText="ex: 150"
					label="Products Per MC"
					name="countPerMC"
					inputProps={{ ref: register }}
					variant="outlined"
				/>

				<Button variant="contained" color="primary" type="submit">
					Submit
				</Button>
			</form>
		</div>
	);
};

export default SkuForm;
