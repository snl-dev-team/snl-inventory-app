import axios from 'axios';

export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const FETCH_PRODUCTS = 'FETCH_PRODUCTS';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';

export const createProduct = (product) => ({
  type: CREATE_PRODUCT,
  payload: axios
    .post(
      'https://rqzpcqdt40.execute-api.us-east-1.amazonaws.com/dev/product',
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
      'https://rqzpcqdt40.execute-api.us-east-1.amazonaws.com/dev/product',
    )
    .then((res) => res.data.data),
});

export const updateProduct = (product) => ({
  type: UPDATE_PRODUCT,
  payload: axios.put(
    `https://rqzpcqdt40.execute-api.us-east-1.amazonaws.com/dev/product/${product.id}`,
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
  ).then((res) => res.data),
  meta: { product },
});

export const deleteProduct = (id) => ({
  type: DELETE_PRODUCT,
  payload: axios
    .delete(
      `https://rqzpcqdt40.execute-api.us-east-1.amazonaws.com/dev/product/${id}`,
    ),
  meta: { id },
});
