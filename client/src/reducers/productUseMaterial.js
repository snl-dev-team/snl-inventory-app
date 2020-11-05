import { USE_MATERIAL } from '../actions/productUseMaterial';

const productUseMaterialReducer = (state = {}, action) => {
	const { type, payload, meta } = action;

	switch (type) {
		case `${USE_MATERIAL}_FULFILLED`:
			return {
				...state,
				...payload.reduce((acc, curr) => {
					acc[curr.id] = {
						productId: curr.product_id,
						materialId: curr.material_id,
						count: curr.count,
					};
					return acc;
				}, {}),
			};
	}
};

export default productUseMaterialReducer;
