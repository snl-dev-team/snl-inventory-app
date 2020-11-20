import axios from 'axios';

export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const FETCH_PRODUCTS = 'FETCH_PRODUCTS';
export const FETCH_PRODUCT = 'FETCH_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const PRODUCT_USE_MATERIAL = 'PRODUCT_USE_MATERIAL';
export const PRODUCT_UNUSE_MATERIAL = 'PRODUCT_UNUSE_MATERIAL';

export const createProduct = (product) => ({
  type: CREATE_PRODUCT,
  payload: axios
    .post(
      'https://f575f737c8.execute-api.us-east-1.amazonaws.com/dev/product',
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
        },
      },
    )
    .then((res) => res.data),
  meta: { product },
});

export const fetchProducts = () => ({
  type: FETCH_PRODUCTS,
  payload: axios
    .get(
      'https://f575f737c8.execute-api.us-east-1.amazonaws.com/dev/product',
    )
    .then((res) => res.data.data),
});

export const updateProduct = (product) => ({
  type: UPDATE_PRODUCT,
  payload: axios
    .put(
      `https://f575f737c8.execute-api.us-east-1.amazonaws.com/dev/product/${product.id}`,
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
        },
      },
    )
    .then((res) => res.data),
  meta: { product },
});

export const deleteProduct = (id) => ({
  type: DELETE_PRODUCT,
  payload: axios.delete(
    `https://f575f737c8.execute-api.us-east-1.amazonaws.com/dev/product/${id}`,
  ),
  meta: { id },
});

export const useMaterial = ({ productId, materialId, count }) => ({
  type: PRODUCT_USE_MATERIAL,
  payload: axios.put(
    `https://f575f737c8.execute-api.us-east-1.amazonaws.com/dev//product/${productId}/material`,
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

export const unuseMaterial = ({ productId, materialId, count }) => ({
  type: PRODUCT_UNUSE_MATERIAL,
  payload: axios.delete(
    `https://f575f737c8.execute-api.us-east-1.amazonaws.com/dev//product/${productId}/material`,
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
