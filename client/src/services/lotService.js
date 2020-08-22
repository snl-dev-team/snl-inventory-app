const lotService = {
	getAllLotNames: (lotList) => {
		let lotNames = [];

		lotList.forEach((lot) => {
			lotNames.append(lot.name);
		});

		return lotNames;
	},

	getByLotNumber: (lotList, lotNumber) => {
		return lotList.filter((lot) => lot.lotNumber === lotNumber);
	},

	getLotsInExpDateRange: (lotList, oldest, newest = new Date()) => {
		return lotList.filter(
			(lot) => lot.expDate < oldest && lot.expDate > newest
		);
	},
};

export default lotService;
