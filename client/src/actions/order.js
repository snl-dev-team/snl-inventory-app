import axios from 'axios';

export const CREATE_ORDER = 'CREATE_ORDER';
export const FETCH_ORDERS = 'FETCH_ORDERS';
export const FETCH_ORDER = 'FETCH_ORDER';
export const UPDATE_ORDER = 'UPDATE_ORDER';
export const DELETE_ORDER = 'DELETE_ORDER';

export const createOrder = (order, token) => ({
  type: CREATE_ORDER,
  payload: axios
    .post(
      'https://f575f737c8.execute-api.us-east-1.amazonaws.com/dev/order',
      {
        number: order.number,
      },
      {
        headers: {
          'content-type': 'application/json',
          Authorization: token,
        },
      },
    )
    .then((res) => res.data),
  meta: { order },
});

export const fetchOrders = (token) => ({
  type: FETCH_ORDERS,
  payload: axios
    .get(
      'https://f575f737c8.execute-api.us-east-1.amazonaws.com/dev/order',
      {
        headers: {
          Authorization: token,
        },
      },
    )
    .then((res) => res.data.data),
});
export const fetchOrder = (id, token) => ({
  type: FETCH_ORDER,
  payload: axios
    .get(
      `https://f575f737c8.execute-api.us-east-1.amazonaws.com/dev/order/${id}`,
      {
        headers: {
          Authorization: token,
        },
      },
    )
    .then((res) => res.data),
});

export const updateOrder = (order, token) => ({
  type: UPDATE_ORDER,
  payload: axios
    .put(
      `https://f575f737c8.execute-api.us-east-1.amazonaws.com/dev/order/${order.id}`,
      {
        number: order.number,
      },
      {
        headers: {
          'content-type': 'application/json',
          Authorization: token,
        },
      },
    )
    .then((res) => res.data),
  meta: { order },
});

export const deleteOrder = (id, token) => ({
  type: DELETE_ORDER,
  payload: axios.delete(
    `https://f575f737c8.execute-api.us-east-1.amazonaws.com/dev/order/${id}`,
    {
      headers: {
        Authorization: token,
      },
    },
  ),
  meta: { id },
});
