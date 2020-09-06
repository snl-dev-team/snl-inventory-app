import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useForm } from 'react-hook-form';
import { Button, InputLabel, Checkbox } from '@material-ui/core';
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

const MatForm = (props) => {
	const classes = useStyles();
	const { register, handleSubmit } = useForm();
	const [exists, setExists] = useState(true);
	const [pName, setPName] = useState('');
	const onSubmit = (data) => {
		console.log({
			productName: data.productName,
			quantity: [
				{
					lotNumber: data.lotNumber,
					countInUnits: Number(data.count),
				},
			],
			pricePerUnitInCents: Math.round(
				100 *
					parseFloat(
						data.pricePerUnitInCents.replace(/[$,]/g, '')
					)
			),
			units: data.units,
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
				<InputLabel htmlFor="existingProduct">
					<Checkbox
						name="existingProduct"
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

				{exists ? (
					<></>
				) : (
					<TextField
						type="text"
						helperText="ex: #0L32B6"
						name="lotNumber"
						label="Lot Number"
						inputProps={{ ref: register }}
						variant="outlined"
					/>
				)}

				<TextField
					type="number"
					helperText="ex: 709"
					name="count"
					label="Quantity"
					inputProps={{ ref: register }}
					variant="outlined"
				/>
				<TextField
					type="text"
					helperText="ex: kg, L, units, etc."
					name="units"
					label="Unit Type"
					inputProps={{ ref: register }}
					variant="outlined"
				/>
				<TextField
					type="text"
					helperText="ex: $3.99"
					name="pricePerUnitInCents"
					label="Price Per Unit"
					inputProps={{ ref: register }}
					variant="outlined"
					defaultValue="$"
				/>
				<Button variant="contained" color="primary" type="submit">
					Submit
				</Button>
			</form>
		</div>
	);
};

export default MatForm;
