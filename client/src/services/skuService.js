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
};

export default skuService;
