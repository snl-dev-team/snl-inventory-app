import {
  SIGN_IN,
  SIGN_OUT,
  SIGN_UP,
} from '../actions/user';

const INITIAL_STATE = {
  isAuthorized: false,
  token: null,
  email: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  const { type, payload, meta } = action;
  switch (type) {
    case `${SIGN_UP}_FULFILLED`:
      return {
        isAuthorized: false,
        token: null,
        email: meta.email,
      };
    case SIGN_OUT:
      return INITIAL_STATE;
    case `${SIGN_IN}_FULFILLED`:
      return {
        isAuthorized: true,
        token: payload.signInUserSession.idToken.jwtToken,
        email: payload.username,
      };
    default:
      return state;
  }
};

export default userReducer;
