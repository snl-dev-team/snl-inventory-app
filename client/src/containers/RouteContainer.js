const RouteContainer = (props) => {
	const [filteredData, setFilteredData] = useState({
		skus: [],
		lots: [],
		mats: [],
	});
	// lot = 0; sku = 1; mat = 2
	const [view, setView] = useState(1);

	useEffect(() => {
		const { data } = props;
		if (data === null || !data.skus || !data.mats || !data.lots) return;
		setFilteredData(filterService(data));
	}, [props]);

	return <></>;
};

export default RouteContainer;
