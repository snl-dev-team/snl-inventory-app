import { MOCK_FETCH_ORDERS_RESOLVE } from './mock';
import {
	FETCH_ORDERS,
	FETCH_LOTS,
	FETCH_ORDERS,
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

export const fetchOrder = () => {
	return {
		type: FETCH_ORDERS,
		payload: MOCK_FETCH_ORDERS_RESOLVE,
	};
};
export const fetchLot = () => {
	return {
		type: FETCH_LOTS,
		payload: MOCK_FETCH_LOTS_RESOLVE,
	};
};

export const fetchSku = () => {
	return {
		type: FETCH_SKUS,
		payload: MOCK_FETCH_SKUS_RESOLVE,
	};
};

export const fetchMat = () => {
	return {
		type: FETCH_MATS,
		payload: MOCK_FETCH_MATS_RESOLVE,
	};
};

export const createMat = () => {
	return {
		type: CREATE_MATS,
		payload: {},
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
export const createOrder = () => {
	return {
		type: CREATE_ORDERS,
		payload: {},
	};
};
export const createSku = () => {
	return {
		type: CREATE_SKUS,
		payload: {},
	};
};
export const createMat = () => {
	return {
		type: CREATE_MATS,
		payload: {},
	};
};
export const createLot = () => {
	return {
		type: CREATE_LOTS,
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
