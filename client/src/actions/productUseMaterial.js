import axios from 'axios';

export const USE_MATERIAL = 'USE_MATERIAL';

export const useMaterial = ({ id, materialId, count }) => ({
	type: USE_MATERIAL,
	payload: axios
		.post(
			'https://rqzpcqdt40.execute-api.us-east-1.amazonaws.com/dev//product/{id}/material',
			{
				id: id,
				material_id: materialId,
				count: count,
			},
			{
				headers: {
					'content-type': 'application/json',
				},
			}
		)
		.then((res) => res.data),
});
