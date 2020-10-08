const lotService = {
	getAllLotNames: (lotList) => {
		let lotNames = [];

		lotList.forEach((lot) => {
			lotNames.push(lot.productName);
		});

		return lotNames;
	},

	getByLotNumber: (lotList, lotNumber) => {
		return lotList.filter((lot) => lot.lotNumber.includes(lotNumber));
	},

	unFormatLot: (lot) => {
		let unFormattedLot = { ...lot };
		if (lot.hasOwnProperty('id')) {
			delete unFormattedLot.id;
		}
		unFormattedLot.changeLog.forEach((change) => {
			if (change.hasOwnProperty('id')) {
				delete change.id;
			}
		});
		return unFormattedLot;
	},
};

export default lotService;
