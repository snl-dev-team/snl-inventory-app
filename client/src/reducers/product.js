import * as actions from '../constants/productActionTypes';

const productReducer = (state = {}, action) => {
  const { type, payload, meta } = action;

  switch (type) {
    case `${actions.FETCH_PRODUCTS}_FULFILLED`:
      return {
        ...state,
        ...payload.reduce((acc, curr) => {
          acc[curr.id] = {
            id: curr.id,
            name: curr.name,
            number: curr.number,
            count: curr.count,
            expirationDate: curr.expiration_date,
            completed: curr.completed,
            dateCreated: curr.date_created,
            dateModified: curr.date_modified,
            materials: {},
          };
          return acc;
        }, {}),
      };

    case `${actions.CREATE_PRODUCT}_FULFILLED`: {
      const { product } = meta;

      return {
        ...state,
        [payload.id]: {
          materials: {},
          ...product,
          id: payload.id,
          dateCreated: payload.date_created,
          dateModified: payload.date_modified,
        },
      };
    }

    case `${actions.UPDATE_PRODUCT}_FULFILLED`: {
      const { product } = meta;

      return {
        ...state,
        [product.id]: {
          material: {},
          ...state[product.id],
          ...product,
          dateModified: payload.date_modified,
        },
      };
    }

    case `${actions.DELETE_PRODUCT}_FULFILLED`: {
      const { id } = meta;
      const deleteState = Object.assign(state);
      delete deleteState[id];
      return deleteState;
    }

    case `${actions.PRODUCT_USE_MATERIAL}_FULFILLED`: {
      const { productId, materialId, count } = meta;
      return {
        ...state,
        [productId]: {
          ...state[productId],
          materials: {
            ...state[productId].materials,
            [materialId]: count,
          },
        },
      };
    }

    case `${actions.PRODUCT_UNUSE_MATERIAL}_FULFILLED`: {
      const { productId, materialId } = meta;

      return {
        ...state,
        [productId]: {
          ...state[productId],
          materials: {
            ...state[productId].materials,
            [materialId]: undefined,
          },
        },
      };
    }

    default:
      return state;
  }
};

export default productReducer;
