import axios from 'axios';

export const CREATE_MATERIAL = 'CREATE_MATERIAL';
export const FETCH_MATERIALS = 'FETCH_MATERIALS';
export const UPDATE_MATERIAL = 'UPDATE_MATERIAL';
export const DELETE_MATERIAL = 'DELETE_MATERIAL';

export const createMaterial = (material) => ({
  type: CREATE_MATERIAL,
  payload: axios
    .post(
      'https://4vm66rtqc6.execute-api.us-east-1.amazonaws.com/default/createMaterial',
      material,
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    )
    .then((res) => res.data),
  meta: { material },
});

export const fetchMaterials = () => ({
  type: FETCH_MATERIALS,
  payload: axios
    .get(
      'https://wywuo6pzs2.execute-api.us-east-1.amazonaws.com/default/fetchMaterials',
    )
    .then((res) => res.data.data),
});

export const updateMaterial = (material) => ({
  type: UPDATE_MATERIAL,
  payload: axios.post(
    'https://a87tec5p2k.execute-api.us-east-1.amazonaws.com/default/updateMaterial',
    material,
    {
      headers: {
        'content-type': 'application/json',
      },
    },
  ),
  meta: { material },
});

export const deleteMaterial = (id) => ({
  type: DELETE_MATERIAL,
  payload: axios
    .post(
      'https://jprouefzg9.execute-api.us-east-1.amazonaws.com/default/deleteMaterial',
      { id },
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    )
    .then((res) => res.data.data),
  meta: { id },
});
