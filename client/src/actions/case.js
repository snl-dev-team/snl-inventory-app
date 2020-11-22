import axios from 'axios';

export const CREATE_CASE = 'CREATE_CASE';
export const FETCH_CASES = 'FETCH_CASES';
export const FETCH_CASE = 'FETCH_CASE';
export const UPDATE_CASE = 'UPDATE_CASE';
export const DELETE_CASE = 'DELETE_CASE';

export const createCase = (case_, token) => ({
  type: CREATE_CASE,
  payload: axios
    .post(
      'https://f575f737c8.execute-api.us-east-1.amazonaws.com/dev/case',
      {
        name: case_.name,
        product_name: case_.productName,
        product_count: case_.productCount,
        count: case_.count,
        number: case_.number,
        expiration_date: case_.expirationDate,
        shipped: case_.shipped ? 1 : 0,
      },
      {
        headers: {
          'content-type': 'application/json',
          Authorization: token,
        },
      },
    )
    .then((res) => res.data),
  meta: { case_ },
});

export const fetchCases = (token) => ({
  type: FETCH_CASES,
  payload: axios
    .get(
      'https://f575f737c8.execute-api.us-east-1.amazonaws.com/dev/case',
      {
        headers: {
          Authorization: token,
        },
      },
    )
    .then((res) => res.data.data),
});
export const fetchCase = (id, token) => ({
  type: FETCH_CASE,
  payload: axios
    .get(
      `https://f575f737c8.execute-api.us-east-1.amazonaws.com/dev/case/${id}`,
      {
        headers: {
          Authorization: token,
        },
      },
    )
    .then((res) => res.data),
});
export const updateCase = (case_, token) => ({
  type: UPDATE_CASE,
  payload: axios
    .put(
      `https://f575f737c8.execute-api.us-east-1.amazonaws.com/dev/case/${case_.id}`,
      {
        name: case_.name,
        product_name: case_.productName,
        product_count: case_.productCount,
        count: case_.count,
        number: case_.number,
        expiration_date: case_.expirationDate,
        shipped: case_.shipped ? 1 : 0,
      },
      {
        headers: {
          'content-type': 'application/json',
          Authorization: token,
        },
      },
    )
    .then((res) => res.data),
  meta: { case_ },
});

export const deleteCase = (id, token) => ({
  type: DELETE_CASE,
  payload: axios.delete(
    `https://f575f737c8.execute-api.us-east-1.amazonaws.com/dev/case/${id}`,
    {
      headers: {
        Authorization: token,
      },
    },
  ),
  meta: { id },
});
