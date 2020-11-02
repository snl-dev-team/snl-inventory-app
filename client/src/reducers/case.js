import {
  FETCH_CASES,
  CREATE_CASE,
  UPDATE_CASE,
  DELETE_CASE,
} from '../actions/case';

const caseReducer = (state = {}, action) => {
  const { type, payload, meta } = action;

  switch (type) {
    case `${FETCH_CASES}_FULFILLED`:
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

    case `${CREATE_CASE}_FULFILLED`: {
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

    case `${UPDATE_CASE}_FULFILLED`: {
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

    case `${DELETE_CASE}_FULFILLED`: {
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
