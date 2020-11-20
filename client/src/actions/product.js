import axios from 'axios';
import { URL } from '../constants/url';

export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const FETCH_PRODUCTS = 'FETCH_PRODUCTS';
export const FETCH_PRODUCT = 'FETCH_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const PRODUCT_USE_MATERIAL = 'PRODUCT_USE_MATERIAL';
export const PRODUCT_UNUSE_MATERIAL = 'PRODUCT_UNUSE_MATERIAL';

export const createProduct = (product, token) => ({
  type: CREATE_PRODUCT,
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
  type: FETCH_PRODUCTS,
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
  type: FETCH_PRODUCTS,
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
  type: UPDATE_PRODUCT,
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
  type: DELETE_PRODUCT,
  payload: axios.delete(
    `${URL}/product/${id}`,
    {
      headers: {

      }
    }
  ),
  meta: { id },
});

export const useMaterial = (productId, materialId, count, token) => ({
  type: PRODUCT_USE_MATERIAL,
  payload: axios.put(
    `${URL}/product/${productId}/material`,
    {
      product_id: productId,
      material_id: materialId,
      count,
    },
    {
      headers: {
        'content-type': 'application/json',
      },
    },
  ).then((res) => res.data),
});

export const unuseMaterial = (productId, materialId, count, token) => ({
  type: PRODUCT_UNUSE_MATERIAL,
  payload: axios.delete(
    `${URL}/product/${productId}/material`,
    {
      product_id: productId,
      material_id: materialId,
      count,
    },
    {
      headers: {
        Authorization: token,
      },
    },
  ).then((res) => res.data),
});
