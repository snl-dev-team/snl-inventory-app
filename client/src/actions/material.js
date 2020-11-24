import axios from 'axios';
import { URL } from '../constants/url';

export const CREATE_MATERIAL = 'CREATE_MATERIAL';
export const FETCH_MATERIALS = 'FETCH_MATERIALS';
export const FETCH_MATERIAL = 'FETCH_MATERIAL';
export const UPDATE_MATERIAL = 'UPDATE_MATERIAL';
export const DELETE_MATERIAL = 'DELETE_MATERIAL';

export const createMaterial = (material, token) => ({
  type: CREATE_MATERIAL,
  payload: axios
    .post(
      `${URL}/material`,
      {
        name: material.name,
        number: material.number,
        count: material.count,
        expiration_date: material.expirationDate,
        price: material.price,
        units: material.units,
        notes: material.notes,
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
      `${URL}/material`,
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
      `${URL}/material/${id}`,
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
      `${URL}/material/${material.id}`,
      {
        name: material.name,
        number: material.number,
        count: material.count,
        expiration_date: material.expirationDate,
        price: material.price,
        units: material.units,
        notes: material.notes,
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
    `${URL}/material/${id}`,
    {
      headers: {
        Authorization: token,
      },
    },
  ),
  meta: { id },
});
