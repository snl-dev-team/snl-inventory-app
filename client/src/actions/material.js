import axios from 'axios';

export const CREATE_MATERIAL = 'CREATE_MATERIAL';
export const FETCH_MATERIALS = 'FETCH_MATERIALS';
export const FETCH_MATERIAL = 'FETCH_MATERIAL';
export const UPDATE_MATERIAL = 'UPDATE_MATERIAL';
export const DELETE_MATERIAL = 'DELETE_MATERIAL';

export const createMaterial = (material) => ({
	type: CREATE_MATERIAL,
	payload: axios
		.post(
			'https://rqzpcqdt40.execute-api.us-east-1.amazonaws.com/dev/material',
			{
				name: material.name,
				number: material.number,
				count: material.count,
				expiration_date: material.expirationDate,
				price: material.price,
				units: material.units,
			},
			{
				headers: {
					'content-type': 'application/json',
				},
			}
		)
		.then((res) => res.data),
	meta: { material },
});

export const fetchMaterials = () => ({
	type: FETCH_MATERIALS,
	payload: axios
		.get(
			'https://rqzpcqdt40.execute-api.us-east-1.amazonaws.com/dev/material'
		)
		.then((res) => res.data.data),
});
export const fetchMaterial = (id) => ({
	type: FETCH_MATERIAL,
	payload: axios
		.get(
			`https://rqzpcqdt40.execute-api.us-east-1.amazonaws.com/dev/material/${id}`
		)
		.then((res) => res.data),
});
export const updateMaterial = (material) => ({
	type: UPDATE_MATERIAL,
	payload: axios
		.put(
			`https://rqzpcqdt40.execute-api.us-east-1.amazonaws.com/dev/material/${material.id}`,
			{
				name: material.name,
				number: material.number,
				count: material.count,
				expiration_date: material.expirationDate,
				price: material.price,
				units: material.units,
			},
			{
				headers: {
					'content-type': 'application/json',
				},
			}
		)
		.then((res) => res.data),
	meta: { material },
});

export const deleteMaterial = (id) => ({
	type: DELETE_MATERIAL,
	payload: axios.delete(
		`https://rqzpcqdt40.execute-api.us-east-1.amazonaws.com/dev/material/${id}`
	),
	meta: { id },
});
