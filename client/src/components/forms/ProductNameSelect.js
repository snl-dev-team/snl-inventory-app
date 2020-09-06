import React from 'react';
import { Select } from '@material-ui/core';

// props: data: {}, selected: String, onSelect: () => {}, mat: bool
const ProductNameSelect = (props) => {
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
					? props.data.mats.map((mat, i) => {
							return (
								<option value={mat.productName} key={i}>
									{mat.productName}
								</option>
							);
					  })
					: props.data.lots.map((lot, i) => {
							return (
								<option value={lot.productName} key={i}>
									{lot.productName}
								</option>
							);
					  })}
			</Select>
		</div>
	);
};

export default ProductNameSelect;
