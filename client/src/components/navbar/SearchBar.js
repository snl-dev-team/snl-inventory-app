import React, { useState } from 'react';
import useStyles from '../../styles/NavBarStyles';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

const SearchBar = (props) => {
	const classes = useStyles();
	const [searchString, setSearchString] = useState('');
	const handleSearch = (e) => {
		setSearchString(e.target.value);
		props.onSearch(e.target.value);
	};
	return (
		<div className={classes.search}>
			<div className={classes.searchIcon}>
				<SearchIcon />
			</div>
			<InputBase
				placeholder="Search…"
				classes={{
					root: classes.inputRoot,
					input: classes.inputInput,
				}}
				inputProps={{ 'aria-label': 'search' }}
				value={searchString}
				onChange={(e) => handleSearch(e)}
			/>
		</div>
	);
};

export default SearchBar;
