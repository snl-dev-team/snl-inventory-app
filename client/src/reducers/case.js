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
            materials: {},
            products: {},
            notes: curr.notes,
          };
          return acc;
        }, {}),
      };
    case `${actions.FETCH_CASE}_FULFILLED`:
      return {
        ...state,
        [payload.id]: {
          materials: {},
          products: {},
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
          notes: payload.notes,
        },
      };

    case `${actions.CREATE_CASE}_FULFILLED`: {
      const { case_ } = meta;

      return {
        ...state,
        [payload.id]: {
          materials: {},
          products: {},
          notes: '',
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
          materials: {},
          products: {},
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

    case `${actions.FETCH_CASE_USES_MATERIAL}_FULFILLED`: {
      const { caseId } = meta;

      return {
        ...state,
        [caseId]: {
          ...state[caseId],
          materials: {
            ...payload.reduce((acc, curr) => {
              acc[curr.material_id] = curr.count;
              return acc;
            }, {}),
          },
        },
      };
    }

    case `${actions.CASE_USE_MATERIAL}_FULFILLED`: {
      const { caseId, materialId, count } = meta;

      return {
        ...state,
        [caseId]: {
          ...state[caseId],
          materials: {
            ...state[caseId].materials,
            [materialId]: count,
          },
        },
      };
    }

    case `${actions.CASE_UNUSE_MATERIAL}_FULFILLED`: {
      const { caseId, materialId } = meta;

      return {
        ...state,
        [caseId]: {
          ...state[caseId],
          materials: {
            ...state[caseId].materials,
            [materialId]: undefined,
          },
        },
      };
    }

    case `${actions.FETCH_CASE_USES_PRODUCT}_FULFILLED`: {
      const { caseId } = meta;

      return {
        ...state,
        [caseId]: {
          ...state[caseId],
          products: {
            ...payload.reduce((acc, curr) => {
              acc[curr.product_id] = curr.count;
              return acc;
            }, {}),
          },
        },
      };
    }

    case `${actions.CASE_USE_PRODUCT}_FULFILLED`: {
      const { caseId, productId, count } = meta;

      return {
        ...state,
        [caseId]: {
          ...state[caseId],
          products: {
            ...state[caseId].products,
            [productId]: count,
          },
        },
      };
    }

    case `${actions.CASE_UNUSE_PRODUCT}_FULFILLED`: {
      const { caseId, productId } = meta;

      return {
        ...state,
        [caseId]: {
          ...state[caseId],
          products: {
            ...state[caseId].products,
            [productId]: undefined,
          },
        },
      };
    }

    default:
      return state;
  }
};

export default caseReducer;
