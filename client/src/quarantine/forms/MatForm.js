import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useForm } from 'react-hook-form';
import { Button, InputLabel, Checkbox } from '@material-ui/core';
import ProductNameSelect from './ProductNameSelect';
import { Link } from 'react-router-dom';

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

const MatForm = (props) => {
	const classes = useStyles();
	const { register, handleSubmit } = useForm();
	const [exists, setExists] = useState(true);
	const [pName, setPName] = useState('');

	const onSubmit = (data) => {
		if (!exists) {
			props.onCreate(
				{
					productName: pName,
					quantity: [
						{
							lotNumber: data.lotNumber,
							countInUnits: Number(data.count),
						},
					],
					pricePerUnitInCents: Math.round(
						100 *
							parseFloat(
								data.pricePerUnitInCents.replace(
									/[$,]/g,
									''
								)
							)
					),
					units: data.units,
					changeLog: [
						{
							dateTime: new Date().toLocaleDateString(),
							message: `${app
								.auth()
								.currentUser.email.substr(
									0,
									app
										.auth()
										.currentUser.email.indexOf(
											'@'
										)
								)} created a new material`,
						},
					],
				},
				exists
			);
		} else {
			props.onCreate(
				{
					productName: pName,
					quantity: [
						{
							lotNumber: data.lotNumber,
							countInUnits: Number(data.count),
						},
					],
					changeLog: [
						{
							dateTime: new Date().toLocaleDateString(),
							message: `${app
								.auth()
								.currentUser.email.substr(
									0,
									app
										.auth()
										.currentUser.email.indexOf(
											'@'
										)
								)} created new lot ${data.lotNumber}`,
						},
					],
				},
				exists
			);
		}
	};

	return (
		<div className={classes.root}>
			<form
				className={classes.root}
				noValidate
				autoComplete="off"
				onSubmit={handleSubmit(onSubmit)}
			>
				<InputLabel htmlFor="existing-product">
					<Checkbox
						name="existingProduct"
						id="existing-product"
						checked={exists}
						onChange={() => {
							setExists(!exists);
							setPName('');
						}}
					/>
					Existing Product
				</InputLabel>

				{exists ? (
					<ProductNameSelect
						selected={pName}
						data={props.data}
						mat={true}
						onSelect={(val) => setPName(val)}
					/>
				) : (
					<TextField
						label="Product Name"
						helperText="ex: Veggie Capsule"
						type="text"
						variant="outlined"
						defaultValue={pName}
						onChange={(e) => setPName(e.target.value)}
					/>
				)}

				<TextField
					type="text"
					helperText="ex: #0L32B6"
					name="lotNumber"
					label="Lot Number"
					defaultValue="#"
					inputProps={{ ref: register }}
					variant="outlined"
				/>

				<TextField
					type="number"
					helperText="ex: 709"
					name="count"
					label="Quantity"
					inputProps={{ ref: register }}
					variant="outlined"
				/>
				{!exists && (
					<TextField
						type="text"
						helperText="ex: kg, L, units, etc."
						name="units"
						label="Unit Type"
						inputProps={{ ref: register }}
						variant="outlined"
					/>
				)}
				{!exists && (
					<TextField
						type="text"
						helperText="ex: $3.99"
						name="pricePerUnitInCents"
						label="Price Per Unit"
						inputProps={{ ref: register }}
						variant="outlined"
						defaultValue="$"
					/>
				)}
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

export default MatForm;
