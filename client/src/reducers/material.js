import {
  FETCH_MATERIALS,
  FETCH_MATERIAL,
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
          acc[curr.id] = {
            id: curr.id,
            name: curr.name,
            number: curr.number,
            count: curr.count,
            expirationDate: curr.expiration_date,
            price: curr.price,
            units: curr.units,
            dateCreated: curr.date_created,
            dateModified: curr.date_modified,
          };
          return acc;
        }, {}),
      };
    case `${FETCH_MATERIAL}_FULFILLED`:
      return {
        ...state,
        [payload.id]: {
          ...payload,
          id: payload.id,
          name: payload.name,
          number: payload.number,
          count: payload.count,
          expirationDate: payload.expiration_date,
          price: payload.price,
          units: payload.units,
          dateCreated: payload.date_created,
          dateModified: payload.date_modified,
        },
      };

    case `${CREATE_MATERIAL}_FULFILLED`: {
      const { material } = meta;

      return {
        ...state,
        [payload.id]: {
          ...material,
          id: payload.id,
          dateCreated: payload.date_created,
          dateModified: payload.date_modified,
        },
      };
    }

    case `${UPDATE_MATERIAL}_FULFILLED`: {
      const { material } = meta;

      return {
        ...state,
        [material.id]: {
          ...state[material.id],
          ...material,
          dateModified: payload.date_modified,
        },
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
