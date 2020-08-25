import React, { useState, useEffect } from 'react';
import searchService from '../services/searchService';
import Dashboard from '../components/Dashboard';
import PrimarySearchAppBar from '../components/navBar';
import {
	FirebaseDatabaseProvider,
	FirebaseDatabaseNode,
} from '@react-firebase/database';
import firebase from 'firebase';
import config from '../firebase';

const MainRoute = () => {
	return (
		<>
			<FirebaseDatabaseProvider firebase={firebase} {...config}>
				<div>
					<FirebaseDatabaseNode path="data">
						{(d) => {
							return <AppContainer data={d.value} />;
						}}
					</FirebaseDatabaseNode>
				</div>
			</FirebaseDatabaseProvider>
		</>
	);
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
		const newData = {
			skus: Object.entries(data.skus).map((skuEntry) => {
				return { ...skuEntry[1], id: skuEntry[0] };
			}),
			lots: Object.entries(data.lots).map((lotEntry) => {
				return { ...lotEntry[1], id: lotEntry[0] };
			}),
			mats: Object.entries(data.mats).map((matEntry) => {
				return { ...matEntry[1], id: matEntry[0] };
			}),
		};
		setFilteredData(searchService(newData, searchString));
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

export default MainRoute;
