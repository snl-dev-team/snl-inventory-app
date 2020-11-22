import axios from 'axios';

export const CREATE_MATERIAL = 'CREATE_MATERIAL';
export const FETCH_MATERIALS = 'FETCH_MATERIALS';
export const FETCH_MATERIAL = 'FETCH_MATERIAL';
export const UPDATE_MATERIAL = 'UPDATE_MATERIAL';
export const DELETE_MATERIAL = 'DELETE_MATERIAL';

export const createMaterial = (material, token) => ({
  type: CREATE_MATERIAL,
  payload: axios
    .post(
      'https://f575f737c8.execute-api.us-east-1.amazonaws.com/dev/material',
      {
        name: material.name,
        number: material.number,
        count: material.count,
        expiration_date: material.expirationDate,
        price: material.price,
        units: material.units,
      },
      {
        headers: {
          'content-type': 'application/json',
          Authorization: token,
        },
      },
    )
    .then((res) => res.data),
  meta: { material },
});

export const fetchMaterials = (token) => ({
  type: FETCH_MATERIALS,
  payload: axios
    .get(
      'https://f575f737c8.execute-api.us-east-1.amazonaws.com/dev/material',
      {
        headers: {
          Authorization: token,
        },
      },
    )
    .then((res) => res.data.data),
});
export const fetchMaterial = (id, token) => ({
  type: FETCH_MATERIAL,
  payload: axios
    .get(
      `https://f575f737c8.execute-api.us-east-1.amazonaws.com/dev/material/${id}`,
      {
        headers: {
          Authorization: token,
        },
      },
    )
    .then((res) => res.data),
});
export const updateMaterial = (material, token) => ({
  type: UPDATE_MATERIAL,
  payload: axios
    .put(
      `https://f575f737c8.execute-api.us-east-1.amazonaws.com/dev/material/${material.id}`,
      {
        name: material.name,
        number: material.number,
        count: material.count,
        expiration_date: material.expirationDate,
        price: material.price,
        units: material.units,
      },
      {
        headers: {
          'content-type': 'application/json',
          Authorization: token,
        },
      },
    )
    .then((res) => res.data),
  meta: { material },
});

export const deleteMaterial = (id, token) => ({
  type: DELETE_MATERIAL,
  payload: axios.delete(
    `https://f575f737c8.execute-api.us-east-1.amazonaws.com/dev/material/${id}`,
    {
      headers: {
        Authorization: token,
      },
    },
  ),
  meta: { id },
});
