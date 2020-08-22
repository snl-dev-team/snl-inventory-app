const searchService = (data, input) => {
	const searchString = input.toLowerCase();
	if (searchString === '') return data;
	let filteredData = { skus: [], lots: [], mats: [] };
	data.skus.forEach((sku) => {
		if (!filteredData.skus.includes(sku)) {
			if (sku.configName.toLowerCase().includes(searchString)) {
				filteredData.skus.push(sku);
			}
		}
		sku.quantity.forEach((lot) => {
			if (!filteredData.skus.includes(sku)) {
				if (lot.lotNumber.toLowerCase().includes(searchString)) {
					filteredData.skus.push(sku);
				}
			}
		});
	});

	data.lots.forEach((lot) => {
		if (!filteredData.lots.includes(lot)) {
			if (
				lot.productName.toLowerCase().includes(searchString) ||
				lot.lotNumber.toLowerCase().includes(searchString)
			) {
				filteredData.lots.push(lot);
			}
		}
	});

	data.mats.forEach((mat) => {
		if (!filteredData.mats.includes(mat)) {
			if (mat.productName.toLowerCase().includes(searchString)) {
				filteredData.mats.push(mats);
			}
		}
		mat.quantity.forEach((lot) => {
			if (!filteredData.mats.includes(mat)) {
				if (lot.lotNumber.toLowerCase().includes(searchString)) {
					filteredData.mats.push(mat);
				}
			}
		});
	});

	return filteredData;
};

export default searchService;
