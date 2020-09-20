import React, { useEffect, useState } from 'react';
import Dashboard from './dashboard/Dashboard';
import Toolbar from './navbar/Toolbar';
import searchService from '../services/searchService';

const AppContainer = (props) => {
	const { view, data } = props;
	const [searchString, setSearchString] = useState('');
	const [searchData, setSearchData] = useState({
		skus: [],
		lots: [],
		mats: [],
	});

	useEffect(() => {
		if (data === null || !data.skus || !data.mats || !data.lots) return;
		setSearchData(searchService(data, searchString));
	}, [data, searchString]);

	return (
		<>
			<Toolbar
				onSearch={(s) => setSearchString(s)}
				onSet={(v) => props.onSetView(v)}
				view={view}
			/>
			<div
				style={{
					height: '5em',
				}}
			></div>
			<Dashboard data={searchData} view={view} />
		</>
	);
};

export default AppContainer;
