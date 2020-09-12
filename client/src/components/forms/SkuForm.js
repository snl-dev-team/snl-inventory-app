import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useForm } from 'react-hook-form';
import { Checkbox, InputLabel, Button } from '@material-ui/core';
import ProductNameSelect from './ProductNameSelect';
import { Link } from 'react-router-dom';
import app from '../../config/firebase';

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
		props.onCreate({
			configName: data.configName,
			MCSize: data.MCSize,
			countPerMC: data.countPerMC,
			productBoxes: data.productBoxes,
			productName: pName,
			quantity: [],
			changeLog: [
				{
					dateTime: new Date().toLocaleString(),
					message: `${app
						.auth()
						.currentUser.email.substr(
							0,
							app.auth().currentUser.email.indexOf('@')
						)} created new shipping configuration ${
						data.configName
					}`,
				},
			],
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
				<InputLabel htmlFor="product-boxes">
					<Checkbox
						name="productBoxes"
						id="product-boxes"
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
				<Button
					variant="contained"
					color="primary"
					component={Link}
					to="/"
				>
					Cancel
				</Button>
			</form>
		</div>
	);
};

export default SkuForm;
