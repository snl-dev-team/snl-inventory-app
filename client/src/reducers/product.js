import {
  FETCH_PRODUCTS,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  PRODUCT_USE_MATERIAL,
  PRODUCT_UNUSE_MATERIAL,
} from '../actions/product';

const productReducer = (state = {}, action) => {
  const { type, payload, meta } = action;

  switch (type) {
    case `${FETCH_PRODUCTS}_FULFILLED`:
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

    case `${CREATE_PRODUCT}_FULFILLED`: {
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

    case `${UPDATE_PRODUCT}_FULFILLED`: {
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

    case `${DELETE_PRODUCT}_FULFILLED`: {
      const { id } = meta;
      const deleteState = Object.assign(state);
      delete deleteState[id];
      return deleteState;
    }

    case `${PRODUCT_USE_MATERIAL}_FULFILLED`:
      return {
        ...state,
      };

    case `${PRODUCT_UNUSE_MATERIAL}_FULFILLED`: {
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
