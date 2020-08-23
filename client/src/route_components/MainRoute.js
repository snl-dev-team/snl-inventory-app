import React, { useState } from 'react';
import * as resource from '../test_data/schema.json';
import searchService from '../services/searchService';
import Dashboard from '../components/Dashboard';
import PrimarySearchAppBar from '../components/Navbar';

const MainRoute = () => {
	const [data, setData] = useState(resource.default);
	const [filteredData, setFilteredData] = useState(data);

	const filterData = (searchString) => {
		setFilteredData(searchService(data, searchString));
	};

	return (
		<>
			<PrimarySearchAppBar onSearch={(s) => filterData(s)}/>
			<Dashboard data={filteredData} />
		</>
	);
};

export default MainRoute;
