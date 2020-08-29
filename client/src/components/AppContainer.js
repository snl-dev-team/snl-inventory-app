import React, { useState, useEffect } from 'react';
import Dashboard from './dashboard/Dashboard';
import PrimarySearchAppBar from './navbar/PrimarySearchAppBar';
import searchService from '../services/searchService';
import filterService from '../services/filterService';

const AppContainer = (props) => {
	const [filteredData, setFilteredData] = useState({
		skus: [],
		lots: [],
		mats: [],
	});
	const [searchString, setSearchString] = useState('');
	// lot = 0; sku = 1; mat = 2
	const [view, setView] = useState(1);

	useEffect(() => {
		const { data } = props;
		if (data === null || !data.skus || !data.mats || !data.lots) return;
		setFilteredData(searchService(filterService(data), searchString));
	}, [props, searchString]);

	return (
		<>
			<PrimarySearchAppBar
				onSearch={(s) => setSearchString(s)}
				onSet={(v) => setView(v)}
				view={view}
			/>
			<Dashboard data={filteredData} view={view} />
		</>
	);
};

export default AppContainer;
