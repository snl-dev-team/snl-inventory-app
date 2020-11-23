import axios from 'axios';
import { URL } from '../constants/url';
import * as actions from '../constants/productActionTypes';

export const createProduct = (product, token) => ({
  type: actions.CREATE_PRODUCT,
  payload: axios
    .post(
      `${URL}/product`,
      {
        name: product.name,
        number: product.number,
        count: product.count,
        expiration_date: product.expirationDate,
        completed: product.completed ? 1 : 0,
      },
      {
        headers: {
          'content-type': 'application/json',
          Authorization: token,
        },
      },
    )
    .then((res) => res.data),
  meta: { product },
});

export const fetchProducts = (token) => ({
  type: actions.FETCH_PRODUCTS,
  payload: axios
    .get(
      `${URL}/product`,
      {
        headers: {
          Authorization: token,
        },
      },
    )
    .then((res) => res.data.data),
});
export const fetchProduct = (id, token) => ({
  type: actions.FETCH_PRODUCTS,
  payload: axios
    .get(
      `${URL}/product/${id}`,
      {
        headers: {
          Authorization: token,
        },
      },
    )
    .then((res) => res.data),
});
export const updateProduct = (product, token) => ({
  type: actions.UPDATE_PRODUCT,
  payload: axios
    .put(
      `${URL}/product/${product.id}`,
      {
        name: product.name,
        number: product.number,
        count: product.count,
        expiration_date: product.expirationDate,
        completed: product.completed ? 1 : 0,
      },
      {
        headers: {
          'content-type': 'application/json',
          Authorization: token,
        },
      },
    )
    .then((res) => res.data),
  meta: { product },
});

export const deleteProduct = (id, token) => ({
  type: actions.DELETE_PRODUCT,
  payload: axios.delete(
    `${URL}/product/${id}`,
    {
      headers: {
        Authorization: token,
      },
    },
  ),
  meta: { id },
});

export const fetchProductUsesMaterial = (productId, token) => ({
  type: actions.FETCH_PRODUCT_USES_MATERIAL,
  payload: axios.get(
    `${URL}/product/${productId}/material`,
    {
      headers: {
        Authorization: token,
      },
    },
  ),
  meta: { productId },
});

export const productUseMaterial = (productId, materialId, count, token) => ({
  type: actions.PRODUCT_USE_MATERIAL,
  payload: axios.put(
    `${URL}/product/${productId}/material`,
    {
      material_id: materialId,
      count,
    },
    {
      headers: {
        Authorization: token,
        'content-type': 'application/json',
      },
    },
  ).then((res) => res.data),
  meta: { productId, materialId, count },
});

export const productUnuseMaterial = (productId, materialId, token) => ({
  type: actions.PRODUCT_UNUSE_MATERIAL,
  payload: axios.delete(
    `${URL}/product/${productId}/material`,
    {
      material_id: materialId,
    },
    {
      headers: {
        Authorization: token,
      },
    },
  ).then((res) => res.data),
  meta: { productId, materialId },
});
