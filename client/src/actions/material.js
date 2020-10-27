import axios from 'axios';

export const CREATE_MATERIAL = 'CREATE_MATERIAL';
export const FETCH_MATERIALS = 'FETCH_MATERIALS';
export const UPDATE_MATERIAL = 'UPDATE_MATERIAL';
export const DELETE_MATERIAL = 'DELETE_MATERIAL';

export const createMaterial = (material) => {
	return {
		type: CREATE_MATERIAL,
		payload: axios
			.post(
				'https://d8rm46rk5l.execute-api.us-east-1.amazonaws.com/default/cloud9-snl-inventory-app-createMaterialLot-DEBOCMA20YU4',

				material,
				{
					headers: {
						'content-type': 'application/json',
					},
				}
			)
			.then((res) => res.data.id),
	};
};

export const fetchMaterials = () => {
	return {
		type: FETCH_MATERIALS,
		payload: axios
			.get(
				'https://fw8lxbb4bk.execute-api.us-east-1.amazonaws.com/default/cloud9-snl-inventory-app-fetchMaterialLots-1DHM39PNUU1L4'
			)
			.then((res) => res.data.data),
	};
};
