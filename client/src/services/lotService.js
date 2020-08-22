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
};

export default lotService;
