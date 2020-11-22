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
          };
          return acc;
        }, {}),
      };

    case `${CREATE_PRODUCT}_FULFILLED`: {
      const { product } = meta;

      return {
        ...state,
        [payload.id]: {
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
        ...payload.reduce((acc, curr) => {
          acc[curr.product_id] = {
            productId: curr.product_id,
            materialId: curr.material_id,
            count: curr.count,
          };
          return acc;
        }, {}),
      };
    case `${PRODUCT_UNUSE_MATERIAL}_FULFILLED_BOB`:
      return {
        ...state,
        ...payload.reduce((acc, curr) => {
          acc[curr.product_id] = {
            productId: curr.product_id,
            materialId: curr.material_id,
            count: curr.count,
          };
          return acc;
        }, {}),
      };

    default:
      return state;
  }
};

export default productReducer;
