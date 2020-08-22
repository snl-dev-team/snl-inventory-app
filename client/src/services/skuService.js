const skuService = {
	getAllSkuNames: (skuList) => {
		let skuNames = [];

		skuList.forEach((sku) => {
			skuNames.append(sku.configName);
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

	getSkusInExpDateRange: (skuList, oldest, newest = new Date()) => {
		let skusInRange = [];

		skuList.forEach((sku) => {
			const quantityInRange = 0;

			sku.quantity.forEach((lot) => {
				if (lot.expDate < oldest && lot.expDate > newest) {
					quantityInRange += lot.mcCount * sku.countPerMC;
				}
			});

			if (quantityInRange > 0) {
				skusInRange.append({ sku, quantity: quantityInRange });
			}
		});

		return skusInRange;
	},

	getSearchResults: (skuList, searchString) => {
		return skuList.filter((sku) => sku.configName.includes(searchString));
	},

	getSkusInProductBoxes: (skuList) => {
		return skuList.filter((sku) => sku.productBoxes);
	},
};

export default skuService;
