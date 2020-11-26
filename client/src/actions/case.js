import axios from 'axios';
import { URL } from '../constants/url';
import * as actions from '../constants/caseActionTypes';

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
