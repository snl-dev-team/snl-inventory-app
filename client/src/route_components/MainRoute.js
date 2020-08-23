import React, { useState } from 'react';
import * as resource from '../test_data/schema.json';
import searchService from '../services/searchService';
import Dashboard from '../components/Dashboard';
import PrimarySearchAppBar from '../components/Navbar';

const MainRoute = () => {
	const [data /*setData*/] = useState(resource.default);
	const [filteredData, setFilteredData] = useState(data);
	// view should be set to 'skus', 'mats', or 'lots' depending on the selected tab
	const [view, setView] = useState('skus');

	const filterData = (searchString) => {
		setFilteredData(searchService(data, searchString));
	};

	const toggleView = (view) => {
		setView(view);
	};

	return (
		<>
    <PrimarySearchAppBar
				onSearch={(s) => filterData(s)}
				onSet={(v) => toggleView(v)}
			/>
			<Dashboard data={filteredData} view={view} />
		</>
	);
};

export default MainRoute;
