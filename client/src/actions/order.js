import axios from 'axios';

export const CREATE_ORDER = 'CREATE_ORDER';
export const FETCH_ORDERS = 'FETCH_ORDERS';
export const FETCH_ORDER = 'FETCH_ORDER';
export const UPDATE_ORDER = 'UPDATE_ORDER';
export const DELETE_ORDER = 'DELETE_ORDER';

export const createOrder = (order) => ({
	type: CREATE_ORDER,
	payload: axios
		.post(
			'https://rqzpcqdt40.execute-api.us-east-1.amazonaws.com/dev/order',
			{
				number: order.number,
			},
			{
				headers: {
					'content-type': 'application/json',
				},
			}
		)
		.then((res) => res.data),
	meta: { order },
});

export const fetchOrders = () => ({
	type: FETCH_ORDERS,
	payload: axios
		.get(
			'https://rqzpcqdt40.execute-api.us-east-1.amazonaws.com/dev/order'
		)
		.then((res) => res.data.data),
});
export const fetchOrder = (id) => ({
	type: FETCH_ORDER,
	payload: axios
		.get(
			`https://rqzpcqdt40.execute-api.us-east-1.amazonaws.com/dev/order/${id}`
		)
		.then((res) => res.data),
});

export const updateOrder = (order) => ({
	type: UPDATE_ORDER,
	payload: axios
		.put(
			`https://rqzpcqdt40.execute-api.us-east-1.amazonaws.com/dev/order/${order.id}`,
			{
				number: order.number,
			},
			{
				headers: {
					'content-type': 'application/json',
				},
			}
		)
		.then((res) => res.data),
	meta: { order },
});

export const deleteOrder = (id) => ({
	type: DELETE_ORDER,
	payload: axios.delete(
		`https://rqzpcqdt40.execute-api.us-east-1.amazonaws.com/dev/order/${id}`
	),
	meta: { id },
});
