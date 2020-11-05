import axios from 'axios';

export const USE_MATERIAL = 'USE_MATERIAL';
export const UNUSE_MATERIAL = 'UNUSE_MATERIAL';

export const useMaterial = ({ productId, materialId, count }) => ({
	type: USE_MATERIAL,
	payload: axios
		.put(
			`https://rqzpcqdt40.execute-api.us-east-1.amazonaws.com/dev//product/${productId}/material`,
			{
				product_id: productId,
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

export const unuseMaterial = ({ productId, materialId, count }) => ({
	type: UNUSE_MATERIAL,
	payload: axios
		.delete(
			`https://rqzpcqdt40.execute-api.us-east-1.amazonaws.com/dev//product/${productId}/material`,
			{
				product_id: productId,
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
