import * as actions from '../constants/orderActionTypes';

const orderReducer = (state = {}, action) => {
  const { type, payload, meta } = action;

  switch (type) {
    case `${actions.FETCH_ORDERS}_FULFILLED`:
      return {
        ...state,
        ...payload.reduce((acc, curr) => {
          acc[curr.id] = {
            id: curr.id,
            number: curr.number,
            dateCreated: curr.date_created,
            dateModified: curr.date_modified,
            cases: {},
          };
          return acc;
        }, {}),
      };
    case `${actions.FETCH_ORDER}_FULFILLED`:
      return {
        ...state,
        [payload.id]: {
          id: payload.id,
          number: payload.number,
          dateCreated: payload.date_created,
          dateModified: payload.date_modified,
          cases: {},
        },
      };

    case `${actions.CREATE_ORDER}_FULFILLED`: {
      const { order } = meta;

      return {
        ...state,
        [payload.id]: {
          cases: {},
          ...order,
          id: payload.id,
          dateCreated: payload.date_created,
          dateModified: payload.date_modified,
        },
      };
    }

    case `${actions.UPDATE_ORDER}_FULFILLED`: {
      const { order } = meta;

      return {
        ...state,
        [order.id]: {
          cases: {},
          ...state[order.id],
          ...order,
          dateModified: payload.date_modified,
        },
      };
    }

    case `${actions.DELETE_ORDER}_FULFILLED`: {
      const { id } = meta;
      const deleteState = Object.assign(state);
      delete deleteState[id];
      return deleteState;
    }

    case `${actions.FETCH_ORDER_USES_CASE}_FULFILLED`: {
      const { orderId } = meta;

      return {
        ...state,
        [orderId]: {
          ...state[orderId],
          cases: {
            ...payload.reduce((acc, curr) => {
              acc[curr.case_id] = curr.count;
              return acc;
            }, {}),
          },
        },
      };
    }

    case `${actions.ORDER_USE_CASE}_FULFILLED`: {
      const { orderId, caseId, count } = meta;
      return {
        ...state,
        [orderId]: {
          ...state[orderId],
          cases: {
            ...state[orderId].cases,
            [caseId]: count,
          },
        },
      };
    }

    case `${actions.ORDER_UNUSE_CASE}_FULFILLED`: {
      const { orderId, caseId } = meta;

      return {
        ...state,
        [orderId]: {
          ...state[orderId],
          cases: {
            ...state[orderId].cases,
            [caseId]: undefined,
          },
        },
      };
    }

    default:
      return state;
  }
};

export default orderReducer;
