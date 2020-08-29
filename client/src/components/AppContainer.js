import React, { useState, useEffect } from 'react';
import Dashboard from './dashboard/Dashboard';
import PrimarySearchAppBar from './navbar/PrimarySearchAppBar';
import searchService from '../services/searchService';

const filterData = ({ skus, lots, mats }) => {
	let filteredData = {
		skus: Object.entries(skus).map((skuEntry) => {
			return { ...skuEntry[1], id: skuEntry[0] };
		}),
		lots: Object.entries(lots).map((lotEntry) => {
			return { ...lotEntry[1], id: lotEntry[0] };
		}),
		mats: Object.entries(mats).map((matEntry) => {
			return { ...matEntry[1], id: matEntry[0] };
		}),
	};
	console.log(filteredData);
	return filteredData;
};

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
		setFilteredData(searchService(filterData(data), searchString));
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
