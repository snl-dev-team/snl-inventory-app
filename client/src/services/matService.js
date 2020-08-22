const matService = {
	getAllMatNames: (matList) => {
		let matNames = [];

		matList.forEach((mat) => {
			matNames.push(mat.productName);
		});

		return matNames;
	},

	getMatValueInCents: (mat) => {
		let matValueInCents = 0;

		mat.quantity.forEach((lot) => {
			matValueInCents += lot.countInUnits * mat.pricePerUnitInCents;
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
				if (lot.lotNumber.includes(lotNumber)) {
					matsWithLotNumber.push({
						mat,
						quantity: lot.countInUnits,
						units: mat.units,
					});
				}
			});
		});

		return matsWithLotNumber;
	},

	getMatsByProductName: (matList, productName) => {
		return matList.filter((mat) => mat.productName.includes(productName));
	},
};

export default matService;
