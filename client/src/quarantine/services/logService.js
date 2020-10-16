const logService = {
	logSkuChange: (email, prev, curr) => {
		let changes = [];
		prev.quantity.forEach((lot, i) => {
			if (lot.mcCount === curr.quantity[i].mcCount) return;
			changes.push(
				`changed lot ${lot.lotNumber} count from ${lot.mcCount} to ${curr.quantity[i].mcCount}`
			);
		});
		return `${email.substr(0, email.indexOf('@'))} ${changes.join(
			' and '
		)}.`;
	},

	logMatChange: (email, prev, curr) => {
		let changes = [];
		prev.quantity.forEach((lot, i) => {
			if (lot.countInUnits === curr.quantity[i].countInUnits) return;
			changes.push(
				`changed lot ${lot.lotNumber} count from ${lot.countInUnits} to ${curr.quantity[i].countInUnits}`
			);
		});
		return `${email.substr(0, email.indexOf('@'))} ${changes.join(
			' and '
		)}.`;
	},

	logLotChange: (email, prev, curr) => {
		if (prev.quantity === curr.quantity) return;
		return `${email.substr(0, email.indexOf('@'))} changed lot ${
			curr.lotNumber
		} count from ${prev.quantity} to ${curr.quantity}`;
	},
};

export default logService;
