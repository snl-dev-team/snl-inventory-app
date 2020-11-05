import axios from 'axios';

export const CREATE_CASE = 'CREATE_CASE';
export const FETCH_CASES = 'FETCH_CASES';
export const UPDATE_CASE = 'UPDATE_CASE';
export const DELETE_CASE = 'DELETE_CASE';

export const createCase = (case_) => ({
  type: CREATE_CASE,
  payload: axios
    .post(
      'https://rqzpcqdt40.execute-api.us-east-1.amazonaws.com/dev/case',
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
        },
      },
    )
    .then((res) => res.data),
  meta: { case_ },
});

export const fetchCases = () => ({
  type: FETCH_CASES,
  payload: axios
    .get(
      'https://rqzpcqdt40.execute-api.us-east-1.amazonaws.com/dev/case',
    )
    .then((res) => res.data.data),
});

export const updateCase = (case_) => ({
  type: UPDATE_CASE,
  payload: axios.put(
    `https://rqzpcqdt40.execute-api.us-east-1.amazonaws.com/dev/case/${case_.id}`,
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
      },
    },
  ).then((res) => res.data),
  meta: { case_ },
});

export const deleteCase = (id) => ({
  type: DELETE_CASE,
  payload: axios
    .delete(
      `https://rqzpcqdt40.execute-api.us-east-1.amazonaws.com/dev/case/${id}`,
    ),
  meta: { id },
});