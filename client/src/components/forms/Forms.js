import React from 'react';

const Forms = ({ product }) => {
	if (product === 'Product') {
		return <form>form3</form>;
	} else if (product === 'Inventory') {
		return <form>form2</form>;
	} else if (product === 'Raw Materials') {
		return <form>form1</form>;
	} else {
		return <div>No Product Selected</div>;
	}
};
export default Forms;
