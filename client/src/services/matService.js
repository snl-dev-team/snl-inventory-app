const matService = {
	getAllMatNames: (matList) => {
		let matNames = [];

		matList.forEach((mat) => {
			matNames.append(mat.productName);
		});

		return matNames;
	},

	getMatValueInCents: (mat) => {
		let matValueInCents = 0;

		mat.quantity.forEach((lot) => {
			matValueInCents += lot.countInUnits * lot.pricePerUnitInCents;
		});

		return matValueInCents;
	},

	getAllMatsWithUnit: (matList, unit) => {
		return matList.filter((mat) => mat.units === unit);
	},

	getMatsByLotNumber: (matList, lotNumber) => {
		let matsWithLotNumber = [];

		matList.forEach((mat) => {
			mat.quantity.forEach((lot) => {
				if (lot.lotNumber === lotNumber) {
					matsWithLotNumber.append({
						mat,
						quantity: lot.countInUnits,
						units: lot.units,
					});
				}
			});
		});

		return matsWithLotNumber;
	},
};

export default matService;
