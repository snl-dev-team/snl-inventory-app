import {
  FETCH_ORDERS,
  FETCH_ORDER,
  CREATE_ORDER,
  UPDATE_ORDER,
  DELETE_ORDER,
} from '../actions/order';

const orderReducer = (state = {}, action) => {
  const { type, payload, meta } = action;

  switch (type) {
    case `${FETCH_ORDERS}_FULFILLED`:
      return {
        ...state,
        ...payload.reduce((acc, curr) => {
          acc[curr.id] = {
            id: curr.id,
            number: curr.number,
            dateCreated: curr.date_created,
            dateModified: curr.date_modified,
          };
          return acc;
        }, {}),
      };
    case `${FETCH_ORDER}_FULFILLED`:
      return {
        ...state,
        [payload.id]: {
          id: payload.id,
          number: payload.number,
          dateCreated: payload.date_created,
          dateModified: payload.date_modified,
        },
      };

    case `${CREATE_ORDER}_FULFILLED`: {
      const { order } = meta;

      return {
        ...state,
        [payload.id]: {
          ...order,
          id: payload.id,
          dateCreated: payload.date_created,
          dateModified: payload.date_modified,
        },
      };
    }

    case `${UPDATE_ORDER}_FULFILLED`: {
      const { order } = meta;

      return {
        ...state,
        [order.id]: {
          ...state[order.id],
          ...order,
          dateModified: payload.date_modified,
        },
      };
    }

    case `${DELETE_ORDER}_FULFILLED`: {
      const { id } = meta;
      const deleteState = Object.assign(state);
      delete deleteState[id];
      return deleteState;
    }

    default:
      return state;
  }
};

export default orderReducer;
