import * as actions from '../constants/caseActionTypes';

const caseReducer = (state = {}, action) => {
  const { type, payload, meta } = action;

  switch (type) {
    case `${actions.FETCH_CASES}_FULFILLED`:
      return {
        ...state,
        ...payload.reduce((acc, curr) => {
          acc[curr.id] = {
            id: curr.id,
            name: curr.name,
            productName: curr.product_name,
            productCount: curr.product_count,
            number: curr.number,
            count: curr.count,
            expirationDate: curr.expiration_date,
            shipped: curr.shipped,
            dateCreated: curr.date_created,
            dateModified: curr.date_modified,
          };
          return acc;
        }, {}),
      };
    case `${actions.FETCH_CASE}_FULFILLED`:
      return {
        ...state,
        [payload.id]: {
          ...payload,
          id: payload.id,
          name: payload.name,
          productName: payload.product_name,
          productCount: payload.product_count,
          number: payload.number,
          count: payload.count,
          expirationDate: payload.expiration_date,
          shipped: payload.shipped,
          dateCreated: payload.date_created,
          dateModified: payload.date_modified,
        },
      };

    case `${actions.CREATE_CASE}_FULFILLED`: {
      const { case_ } = meta;

      return {
        ...state,
        [payload.id]: {
          ...case_,
          id: payload.id,
          dateCreated: payload.date_created,
          dateModified: payload.date_modified,
        },
      };
    }

    case `${actions.UPDATE_CASE}_FULFILLED`: {
      const { case_ } = meta;

      return {
        ...state,
        [case_.id]: {
          ...state[case_.id],
          ...case_,
          dateModified: payload.date_modified,
        },
      };
    }

    case `${actions.DELETE_CASE}_FULFILLED`: {
      const { id } = meta;
      const deleteState = Object.assign(state);
      delete deleteState[id];
      return deleteState;
    }

    default:
      return state;
  }
};

export default caseReducer;
