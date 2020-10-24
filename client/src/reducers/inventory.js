import {
	FETCH_ORDERS,
	FETCH_LOTS,
	FETCH_MATS,
	FETCH_SKUS,
	CREATE_LOTS,
	CREATE_MATS,
	CREATE_ORDERS,
	CREATE_SKUS,
	DELETE_LOTS,
	DELETE_MATS,
	DELETE_ORDERS,
	DELETE_SKUS,
	UPDATE_LOTS,
	UPDATE_MATS,
	UPDATE_ORDERS,
	UPDATE_SKUS,
} from '../actions/types';

const INITIAL_STATE = {
	orders: [],
	lots: [],
	materials: [],
	skus: [],
};

function inventoryReducer(state = INITIAL_STATE, action) {
	const { type, payload } = action;
	switch (type) {
		case `${FETCH_ORDERS}_FULFILLED`:
			return { ...state, orders: payload.data };

		case `${FETCH_ORDERS}_REJECTED`:
			return state;

		case `${FETCH_LOTS}_FULFILLED`:
			return { ...state, lots: payload.data };

		case `${FETCH_LOTS}_REJECTED`:
			return state;

		case `${FETCH_MATS}_FULFILLED`:
			return { ...state, materials: payload.data };

		case `${FETCH_MATS}_REJECTED`:
			return state;

		case `${FETCH_SKUS}_FULFILLED`:
			return { ...state, skus: payload.data };

		case `${FETCH_SKUS}_REJECTED`:
			return state;
		case CREATE_ORDERS:

		case CREATE_LOTS:

		case CREATE_MATS:

		case CREATE_SKUS:

		case DELETE_ORDERS:

		case DELETE_LOTS:

		case DELETE_MATS:

		case DELETE_SKUS:

		case UPDATE_ORDERS:

		case UPDATE_LOTS:

		case UPDATE_MATS:

		case UPDATE_SKUS:

		default:
			return state;
	}
}

export default inventoryReducer;
