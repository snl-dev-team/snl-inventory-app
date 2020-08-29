const skuService = {
	getAllSkuNames: (skuList) => {
		let skuNames = [];

		skuList.forEach((sku) => {
			skuNames.push(sku.configName);
		});

		return skuNames;
	},

	getSkuQuantityInUnits: (skuObject) => {
		let skuQuantityInUnits = 0;

		skuObject.quantity.forEach((lot) => {
			skuQuantityInUnits += lot.mcCount * skuObject.countPerMC;
		});

		return skuQuantityInUnits;
	},

	getSearchResults: (skuList, searchString) => {
		return skuList.filter((sku) => sku.configName.includes(searchString));
	},

	getSkusInProductBoxes: (skuList) => {
		return skuList.filter((sku) => sku.productBoxes);
	},

	unFormatSku: (sku) => {
		let unFormattedSku = { ...sku };
		if (unFormattedSku.hasOwnProperty('id')) {
			delete unFormattedSku.id;
		}
		unFormattedSku.quantity.forEach((lot) => {
			if (lot.hasOwnProperty('id')) {
				delete lot.id;
			}
		});
		unFormattedSku.changeLog.forEach((change) => {
			if (change.hasOwnProperty('id')) {
				delete change.id;
			}
		});
		return unFormattedSku;
	},
};

export default skuService;
