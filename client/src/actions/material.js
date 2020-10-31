import axios from 'axios';

export const CREATE_MATERIAL = 'CREATE_MATERIAL';
export const FETCH_MATERIALS = 'FETCH_MATERIALS';
export const UPDATE_MATERIAL = 'UPDATE_MATERIAL';
export const DELETE_MATERIAL = 'DELETE_MATERIAL';

export const createMaterial = (material) => ({
  type: CREATE_MATERIAL,
  payload: axios
    .post(
      'https://d8rm46rk5l.execute-api.us-east-1.amazonaws.com/default/cloud9-snl-inventory-app-createMaterialLot-DEBOCMA20YU4',
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
      'https://fw8lxbb4bk.execute-api.us-east-1.amazonaws.com/default/cloud9-snl-inventory-app-fetchMaterialLots-1DHM39PNUU1L4',
    )
    .then((res) => res.data.data),
});

export const updateMaterial = (material) => ({
  type: UPDATE_MATERIAL,
  payload: axios.post(
    'https://ks76pgxxa5.execute-api.us-east-1.amazonaws.com/default/cloud9-snl-inventory-app-updateMaterialLot-ZPNM1SI9HM44',
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
      'https://z74y2xyso0.execute-api.us-east-1.amazonaws.com/default/cloud9-snl-inventory-app-deleteMaterial-G14W036K7GL6',
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
