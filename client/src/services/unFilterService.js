const unFilterService = ({ skus, lots, mats }) => {
	let unFilteredData = {
		skus: {},
		mats: {},
		lots: {},
	};
	skus.forEach((sku) => {
		let unFilteredSku = { ...sku };
		let id = unFilteredSku.id;
		unFilteredSku.quantity = unFilterSubArray(unFilteredSku.quantity);
		unFilteredSku.changeLog = unFilterSubArray(unFilteredSku.changeLog);
		delete unFilteredSku.id;
		unFilteredData.skus[id] = unFilteredSku;
	});

	mats.forEach((mat) => {
		let unFilteredMat = { ...mat };
		let id = unFilteredMat.id;
		unFilteredMat.quantity = unFilterSubArray(unFilteredMat.quantity);
		unFilteredMat.changeLog = unFilterSubArray(unFilteredMat.changeLog);
		delete unFilteredMat.id;
		unFilteredData.mats[id] = unFilteredMat;
	});

	lots.forEach((lot) => {
		let unfilteredLot = { ...lot };
		let id = unfilteredLot.id;
		unfilteredLot.changeLog = unFilterSubArray(unfilteredLot.changeLog);
		delete unfilteredLot.id;
		unFilteredData.lots[id] = unfilteredLot;
	});
	return unFilteredData;
};

const unFilterSubArray = (array) => {
	let unFilteredObject = {};
	array.forEach((item) => {
		let id = item.id;
		delete item.id;
		unFilteredObject[id] = item;
	});
	return unFilteredObject;
};

export default unFilterService;
