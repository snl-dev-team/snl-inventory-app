const filterService = ({ skus, lots, mats }) => {
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

	filteredData.skus.forEach((sku) => {
		sku.changeLog = filterSubObject(sku.changeLog);
		sku.quantity = filterSubObject(sku.quantity);
	});

	filteredData.mats.forEach((mat) => {
		mat.changeLog = filterSubObject(mat.changeLog);
		mat.quantity = filterSubObject(mat.quantity);
	});

	filteredData.lots.forEach((lot) => {
		lot.changeLog = filterSubObject(lot.changeLog);
	});

	console.log(filteredData);
	return filteredData;
};

const filterSubObject = (object) => {
	return Object.entries(object).map((entry) => {
		return { ...entry[1], id: entry[0] };
	});
};

export default filterService;
