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

	getLotArrayByMat: (mat) => {
		let lotArray = [];

		mat.quantity.forEach((lot) => {
			lotArray.push(lot.lotNumber);
		});

		return lotArray;
	},

	getTotalQuantity: (mat) => {
		let totalQ = 0;

		mat.quantity.forEach((lot) => {
			totalQ += lot.countInUnits;
		});

		return totalQ;
	},

	unFormatMat: (mat) => {
		let unFormattedMat = { ...mat };
		if (unFormattedMat.hasOwnProperty('id')) {
			delete unFormattedMat.id;
		}
		unFormattedMat.quantity.forEach((lot) => {
			if (lot.hasOwnProperty('id')) {
				delete lot.id;
			}
		});
		unFormattedMat.changeLog.forEach((change) => {
			if (change.hasOwnProperty('id')) {
				delete change.id;
			}
		});
		return unFormattedMat;
	},
};

export default matService;