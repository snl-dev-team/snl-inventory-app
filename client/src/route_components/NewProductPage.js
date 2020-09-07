import React, { useState } from 'react';
import SimpleMenu from '../components/forms/DropDownButton';
import ContainedButton from '../components/forms/CreateProduct';
import { makeStyles } from '@material-ui/core/styles';
import Forms from '../components/forms/Forms';
import ProductContext from '../ProductContext';

const Styles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
}));

const NewProductPage = (props) => {
	const classes = Styles();
	//const { setProduct } = useContext(ProductContext);
	const [form, setForm] = useState(0);
	const changeProduct = (s) => {
		console.log(s.target.value);
	};

	return (
		<div>
			<h1 className={classes.root}>
				<span>CREATE A NEW PRODUCT</span>
			</h1>
			<SimpleMenu handleChoose={(s) => changeProduct(s)} />
			<div className={classes.root}></div>
			<div className={classes.root}></div>
			<div className={classes.root}></div>
			<div className={classes.root}>
				<ContainedButton onChoose={setForm(e)} />
			</div>
		</div>
	);
};

export default NewProductPage;
