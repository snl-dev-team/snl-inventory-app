import * as actions from '../constants/caseActionTypes';

const caseReducer = (state = {}, action) => {
  const { type, payload, meta } = action;

  switch (type) {
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
