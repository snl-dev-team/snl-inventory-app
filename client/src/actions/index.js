import {
	MOCK_FETCH_ORDERS_RESOLVE,
	MOCK_FETCH_LOTS_RESOLVE,
	MOCK_FETCH_SKUS_RESOLVE,
	MOCK_FETCH_MATS_RESOLVE,
} from './mock';
import {
	FETCH_ORDERS,
	FETCH_LOTS,
	FETCH_SKUS,
	FETCH_MATS,
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
} from './types';
import axios from 'axios';

export const fetchOrders = () => {
	return {
		type: FETCH_ORDERS,
		payload: MOCK_FETCH_ORDERS_RESOLVE,
	};
};
export const fetchLots = () => {
	return {
		type: FETCH_LOTS,
		payload: MOCK_FETCH_LOTS_RESOLVE,
	};
};

export const fetchSkus = () => {
	return {
		type: FETCH_SKUS,
		payload: MOCK_FETCH_SKUS_RESOLVE,
	};
};

export const fetchMats = () => {
	return {
		type: FETCH_MATS,
		payload: axios
		.get(
			'https://fw8lxbb4bk.execute-api.us-east-1.amazonaws.com/default/cloud9-snl-inventory-app-fetchMaterialLots-1DHM39PNUU1L4'
		)
		.then((response) => {
			console.log(response.data.data);
			let mats = response.data.data;
		}),
	};
};

export const createMat = () => {
	return {
		type: CREATE_MATS,
		payload: 
	};
};

export const createLot = () => {
	return {
		type: CREATE_LOTS,
		payload: {},
	};
};

export const createSku = () => {
	return {
		type: CREATE_SKUS,
		payload: {},
	};
};

export const createOrder = () => {
	return {
		type: CREATE_ORDERS,
		payload: {},
	};
};
export const deleteOrder = () => {
	return {
		type: DELETE_ORDERS,
		payload: {},
	};
};
export const deleteSku = () => {
	return {
		type: DELETE_SKUS,
		payload: {},
	};
};
export const deleteMat = () => {
	return {
		type: DELETE_MATS,
		payload: {},
	};
};
export const deleteLot = () => {
	return {
		type: DELETE_LOTS,
		payload: {},
	};
};
export const updateOrder = () => {
	return {
		type: UPDATE_ORDERS,
		payload: {},
	};
};
export const updateSku = () => {
	return {
		type: UPDATE_SKUS,
		payload: {},
	};
};
export const updateMat = () => {
	return {
		type: UPDATE_MATS,
		payload: {},
	};
};
export const updateLot = () => {
	return {
		type: UPDATE_LOTS,
		payload: {},
	};
};
