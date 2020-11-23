import axios from 'axios';
import { URL } from '../constants/url';
import * as actions from '../constants/orderActionTypes';

export const createOrder = (order, token) => ({
  type: actions.CREATE_ORDER,
  payload: axios
    .post(
      `${URL}/order`,
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
  type: actions.FETCH_ORDERS,
  payload: axios
    .get(
      `${URL}/order`,
      {
        headers: {
          Authorization: token,
        },
      },
    )
    .then((res) => res.data.data),
});
export const fetchOrder = (id, token) => ({
  type: actions.FETCH_ORDER,
  payload: axios
    .get(
      `${URL}/order/${id}`,
      {
        headers: {
          Authorization: token,
        },
      },
    )
    .then((res) => res.data),
});

export const updateOrder = (order, token) => ({
  type: actions.UPDATE_ORDER,
  payload: axios
    .put(
      `${URL}/order/${order.id}`,
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
  type: actions.DELETE_ORDER,
  payload: axios.delete(
    `${URL}/order/${id}`,
    {
      headers: {
        Authorization: token,
      },
    },
  ),
  meta: { id },
});

export const fetchOrderUsesCase = (orderId, token) => ({
  type: actions.FETCH_ORDER_USES_CASE,
  payload: axios.get(
    `${URL}/order/${orderId}/case`,
    {
      headers: {
        Authorization: token,
      },
    },
  ),
  meta: { orderId },
});

export const orderUseCase = (orderId, caseId, count, token) => ({
  type: actions.ORDER_USE_CASE,
  payload: axios.put(
    `${URL}/order/${orderId}/case`,
    {
      case_id: caseId,
      count,
    },
    {
      headers: {
        Authorization: token,
        'content-type': 'application/json',
      },
    },
  ).then((res) => res.data),
  meta: { orderId, caseId, count },
});

export const orderUnuseCase = (orderId, caseId, token) => ({
  type: actions.ORDER_UNUSE_CASE,
  payload: axios.delete(
    `${URL}/order/${orderId}/case`,
    {
      case_id: caseId,
    },
    {
      headers: {
        Authorization: token,
      },
    },
  ).then((res) => res.data),
  meta: { orderId, caseId },
});
