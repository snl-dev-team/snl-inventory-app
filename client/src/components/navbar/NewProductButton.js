import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import { NavLink } from 'react-router-dom';

const NewProductButton = () => {
	return (
		<div>
			<NavLink to="/create-product" variant="body2">
				{
					<div className="create new product">
						<AddIcon />
					</div>
				}
			</NavLink>
		</div>
	);
};
export default NewProductButton;
