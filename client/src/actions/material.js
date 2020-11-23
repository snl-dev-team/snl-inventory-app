import axios from 'axios';
import { URL } from '../constants/url';
import * as actions from '../constants/materialActionTypes';

export const createMaterial = (material, token) => ({
  type: actions.CREATE_MATERIAL,
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
  type: actions.FETCH_MATERIALS,
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
  type: actions.FETCH_MATERIAL,
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
  type: actions.UPDATE_MATERIAL,
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
  type: actions.DELETE_MATERIAL,
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
