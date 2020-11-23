import axios from 'axios';
import { URL } from '../constants/url';
import * as actions from '../constants/caseActionTypes';

export const createCase = (case_, token) => ({
  type: actions.CREATE_CASE,
  payload: axios
    .post(
      '/case',
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
  type: actions.FETCH_CASES,
  payload: axios
    .get(
      `${URL}/case`,
      {
        headers: {
          Authorization: token,
        },
      },
    )
    .then((res) => res.data.data),
});
export const fetchCase = (id, token) => ({
  type: actions.FETCH_CASE,
  payload: axios
    .get(
      `${URL}/case/${id}`,
      {
        headers: {
          Authorization: token,
        },
      },
    )
    .then((res) => res.data),
});
export const updateCase = (case_, token) => ({
  type: actions.UPDATE_CASE,
  payload: axios
    .put(
      `${URL}/case/${case_.id}`,
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
  type: actions.DELETE_CASE,
  payload: axios.delete(
    `${URL}/case/${id}`,
    {
      headers: {
        Authorization: token,
      },
    },
  ),
  meta: { id },
});

export const fetchCaseUsesMaterial = (caseId, token) => ({
  type: actions.FETCH_CASE_USES_MATERIAL,
  payload: axios.get(
    `${URL}/case/${caseId}/material`,
    {
      headers: {
        Authorization: token,
      },
    },
  ),
  meta: { caseId },
});

export const caseUseMaterial = (caseId, materialId, count, token) => ({
  type: actions.CASE_USE_MATERIAL,
  payload: axios.put(
    `${URL}/case/${caseId}/material`,
    {
      material_id: materialId,
      count,
    },
    {
      headers: {
        Authorization: token,
      },
    },
  ),
  meta: { caseId, materialId, count },
});

export const caseUnuseMaterial = (caseId, materialId, token) => ({
  type: actions.CASE_UNUSE_MATERIAL,
  payload: axios.delete(
    `${URL}/case/${caseId}/material`,
    {
      material_id: materialId,
    },
    {
      headers: {
        Authorization: token,
      },
    },
  ),
  meta: { caseId, materialId },
});

export const fetchCaseUsesProduct = (caseId, token) => ({
  type: actions.FETCH_CASE_USES_PRODUCT,
  payload: axios.get(
    `${URL}/case/${caseId}/product`,
    {
      headers: {
        Authorization: token,
      },
    },
  ),
  meta: { caseId },
});

export const caseUseProduct = (caseId, productId, count, token) => ({
  type: actions.CASE_USE_PRODUCT,
  payload: axios.put(
    `${URL}/case/${caseId}/product`,
    {
      product_id: productId,
      count,
    },
    {
      headers: {
        Authorization: token,
      },
    },
  ),
  meta: { caseId, productId, count },
});

export const caseUnuseProduct = (caseId, productId, token) => ({
  type: actions.CASE_UNUSE_PRODUCT,
  payload: axios.delete(
    `${URL}/case/${caseId}/product`,
    {
      product_id: productId,
    },
    {
      headers: {
        Authorization: token,
      },
    },
  ),
  meta: { caseId, productId },
});
