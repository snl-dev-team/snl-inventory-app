import {
  SIGN_UP,
  SIGN_IN,
  SIGN_OUT,
  CONFIRM_SIGN_UP,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_AND_SUBMIT,
  RESEND_CODE,
} from '../actions/user';

const INITIAL_STATE = {
  isAuthorized: false,
  token: null,
  email: null,
  error: null,
  info: null,
  success: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  const { type, payload, meta } = action;
  switch (type) {
    case `${SIGN_UP}_FULFILLED`:
      return {
        isAuthorized: false,
        token: null,
        email: meta.email,
        error: null,
        info: null,
        success: null,
      };
    case `${SIGN_UP}_REJECTED`:
      return {
        isAuthorized: false,
        token: null,
        email: null,
        error: payload.message,
        info: null,
        success: null,
      };

    case `${CONFIRM_SIGN_UP}_FULFILLED`:
      return {
        isAuthorized: false,
        token: null,
        email: meta.email,
        error: null,
        info: null,
        success: 'Sign up successful!',
      };
    case `${CONFIRM_SIGN_UP}_REJECTED`:
      return {
        isAuthorized: false,
        token: null,
        email: meta.email,
        error: payload.message,
        warning: null,
        info: null,
        success: null,
      };

    case `${SIGN_IN}_FULFILLED`:
      return {
        isAuthorized: true,
        token: payload.signInUserSession.idToken.jwtToken,
        email: payload.username,
        error: null,
        info: null,
        success: null,
      };
    case `${SIGN_IN}_REJECTED`:
      return {
        isAuthorized: false,
        token: null,
        email: null,
        error: payload.message,
        info: null,
        success: null,
      };

    case `${FORGOT_PASSWORD}_FULFILLED`:
      return {
        isAuthorized: false,
        token: null,
        email: meta.email,
        error: null,
        info: null,
        success: null,
      };
    case `${FORGOT_PASSWORD}_REJECTED`:
      return {
        isAuthorized: false,
        token: null,
        email: null,
        error: payload.message,
        info: null,
        success: null,
      };

    case `${FORGOT_PASSWORD_AND_SUBMIT}_FULFILLED`:
      return {
        isAuthorized: false,
        token: null,
        email: meta.email,
        error: null,
        info: null,
        success: 'Password has been reset!',
      };
    case `${FORGOT_PASSWORD_AND_SUBMIT}_REJECTED`:
      return {
        isAuthorized: false,
        token: null,
        email: meta.email,
        error: payload.message,
        info: null,
        success: null,
      };

    case `${RESEND_CODE}_FULFILLED`:
      return {
        isAuthorized: false,
        token: null,
        email: meta.email,
        error: null,
        info: null,
        success: `A new code has been sent to ${meta.email}.`,
      };

    case `${RESEND_CODE}_REJECTED`:
      return {
        isAuthorized: false,
        token: null,
        email: meta.email,
        error: null,
        info: `Code resent ${meta.email}! Please check your email.`,
        success: null,
      };

    case SIGN_OUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default userReducer;
