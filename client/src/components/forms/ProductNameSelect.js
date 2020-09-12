import React from 'react';
import { Select } from '@material-ui/core';

// props: data: {}, selected: String, onSelect: () => {}, mat: bool
const ProductNameSelect = (props) => {
	const { data } = props;

	const getMatNames = () => {
		let uniqueNames = [];
		data.mats.forEach((mat) => {
			if (!uniqueNames.includes(mat.productName)) {
				uniqueNames.push(mat.productName);
			}
		});
		return uniqueNames;
	};

	const getLotNames = () => {
		let uniqueNames = [];
		data.lots.forEach((lot) => {
			if (!uniqueNames.includes(lot.productName)) {
				uniqueNames.push(lot.productName);
			}
		});
		return uniqueNames;
	};

	return (
		<div>
			<Select
				name="productName"
				defaultValue={props.selected}
				onChange={(e) => props.onSelect(e.target.value)}
				variant="outlined"
				native={true}
			>
				<option value="">Select Product Name</option>
				{props.mat
					? getMatNames().map((name, i) => {
							return (
								<option value={name} key={i}>
									{name}
								</option>
							);
					  })
					: getLotNames().map((name, i) => {
							return (
								<option value={name} key={i}>
									{name}
								</option>
							);
					  })}
			</Select>
		</div>
	);
};

export default ProductNameSelect;
