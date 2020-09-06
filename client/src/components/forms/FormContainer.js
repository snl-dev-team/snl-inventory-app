import React from 'react';
import SkuForm from './SkuForm';
import LotFrom from './LotForm';
import MatForm from './MatForm';
import { Select } from '@material-ui/core';

const FormContainer = (props) => {
	const { data, view } = props;
	const renderForm = () => {
		if (view === 0) return <LotFrom data={data} />;
		else if (view === 1) return <SkuForm data={data} />;
		else if (view === 2) return <MatForm data={data} />;
		else return <h1>Error :(</h1>;
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: 'white',
				width: 'fit-content',
				padding: '1em',
			}}
		>
			<div>
				<Select
					value={view}
					onChange={(e) =>
						props.onSetView(Number(e.target.value))
					}
					variant="outlined"
					native={true}
				>
					<option value={0}>New Lot</option>
					<option value={1}>New Shipping Config</option>
					<option value={2}>New Material</option>
				</Select>
			</div>
			{renderForm()}
		</div>
	);
};

export default FormContainer;
