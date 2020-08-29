import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function SimpleMenu(props) {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [dropText, setDropText] = React.useState('Select a product');
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleChoose = (e) => {
		setDropText(e.target.innerText);
		setAnchorEl(null);
	};
	const handleClose = (e) => {
		setAnchorEl(null);
	};

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Button
				aria-controls="simple-menu"
				aria-haspopup="true"
				onClick={handleClick}
			>
				{dropText}
			</Button>
			<Menu
				id="simple-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				<MenuItem onClick={(e) => handleChoose(e)}>
					Production
				</MenuItem>
				<MenuItem onClick={(e) => handleChoose(e)}>
					Inventory
				</MenuItem>
				<MenuItem onClick={(e) => handleChoose(e)}>
					Raw Materials
				</MenuItem>
			</Menu>
		</div>
	);
}
