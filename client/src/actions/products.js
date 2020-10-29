import axios from 'axios';

export const CREATE_Product = 'CREATE_PRODUCT';
export const FETCH_MATERIALS = 'FETCH_PRODUCT';
export const UPDATE_MATERIAL = 'UPDATE_PRODUCT';
export const DELETE_MATERIAL = 'DELETE_PRODUCT';

export const createMaterial = (material) => {
	return {
		type: CREATE_PRODUCT,
		payload: axios
			.post(product, {
				headers: {
					'content-type': 'application/json',
				},
			})
			.then((res) => res.data.id),
	};
};

export const fetchMaterials = () => {
	return {
		type: FETCH_PRODUCT,
		payload: axios.get().then((res) => res.data.data),
	};
};

export const updateMaterial = (material) => {
	return {
		type: UPDATE_PRODUCT,
		payload: axios
			.post(product, {
				headers: {
					'content-type': 'application/json',
				},
			})
			.then((res) => res.data.data),
	};
};
