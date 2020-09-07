import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';
import { Checkbox, InputLabel, TextField, Button } from '@material-ui/core';
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

const LotForm = (props) => {
	const classes = useStyles();
	const { register, handleSubmit } = useForm();
	const [exists, setExists] = useState(true);
	const [pName, setPName] = useState('');
	const onSubmit = (data) => {
		console.log({
			productName: pName,
			lotNumber: data.lotNumber,
			expDate: data.expDate,
			quantity: data.quantity,
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
						onChange={() => setExists(!exists)}
					/>
					Existing Product
				</InputLabel>

				{exists ? (
					<ProductNameSelect
						data={props.data}
						selected={pName}
						onSelect={(val) => setPName(val)}
					/>
				) : (
					<TextField
						type="text"
						defaultValue={pName}
						onChange={(e) => setPName(e.target.value)}
						label="Product Name"
						helperText="ex: Buster's 30mL Hemp Oil"
						variant="outlined"
					/>
				)}

				<TextField
					type="text"
					helperText="ex: #0L32B6"
					defaultValue="#"
					name="lotNumber"
					label="Lot Number"
					inputProps={{ ref: register }}
					variant="outlined"
				/>

				<TextField
					type="date"
					name="expDate"
					label="Expiration Date"
					inputProps={{ ref: register }}
					variant="outlined"
					InputLabelProps={{
						shrink: true,
					}}
				/>

				<TextField
					type="number"
					helperText="ex: 3000"
					label="Quantity"
					defaultValue={0}
					name="quantity"
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

export default LotForm;
