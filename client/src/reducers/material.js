import {
  FETCH_MATERIALS,
  CREATE_MATERIAL,
  UPDATE_MATERIAL,
  DELETE_MATERIAL,
} from '../actions/material';

const materialReducer = (state = {}, action) => {
  const { type, payload, meta } = action;

  switch (type) {
    case `${FETCH_MATERIALS}_FULFILLED`:
      return {
        ...state,
        ...payload.reduce((acc, curr) => {
          acc[curr.id] = curr;
          return acc;
        }, {}),
      };

    case `${CREATE_MATERIAL}_FULFILLED`: {
      const { material } = meta;

      return {
        ...state,
        [payload.id]: { id: payload.id, ...material },
      };
    }

    case `${UPDATE_MATERIAL}_FULFILLED`: {
      const { material } = meta;

      return {
        ...state,
        [material.id]: material,
      };
    }

    case `${DELETE_MATERIAL}_FULFILLED`: {
      const { id } = meta;
      const deleteState = Object.assign(state);
      delete deleteState[id];
      return deleteState;
    }

    default:
      return state;
  }
};

export default materialReducer;
