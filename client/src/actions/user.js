import { Auth } from 'aws-amplify';
import * as actions from '../constants/userActionTypes';

export const signIn = (email, password) => ({
  type: actions.SIGN_IN,
  payload: Auth.signIn({
    username: email,
    password,
  }),
  meta: { email },
});

export const signOut = () => ({
  type: actions.SIGN_OUT,
});

export const signUp = (email, password) => ({
  type: actions.SIGN_UP,
  payload: Auth.signUp({ username: email, password, attributes: { email } }),
  meta: { email },
});

export const confirmSignUp = (email, code) => ({
  type: actions.CONFIRM_SIGN_UP,
  payload: Auth.confirmSignUp(email, code),
  meta: { email },
});

export const resendCode = (email) => ({
  type: actions.RESEND_CODE,
  payload: Auth.resendSignUp(email),
  meta: { email },
});

export const changePassword = (oldPassword, newPassword) => ({
  type: actions.CHANGE_PASSWORD,
  payload: Auth.currentAuthenticatedUser()
    .then((user) => Auth.changePassword(user, oldPassword, newPassword)),
});

export const forgotPassword = (email) => ({
  type: actions.FORGOT_PASSWORD,
  payload: Auth.forgotPassword(email),
  meta: { email },
});

export const forgotPasswordAndSubmit = (email, code, newPassword) => ({
  type: actions.FORGOT_PASSWORD_AND_SUBMIT,
  payload: Auth.forgotPasswordSubmit(email, code, newPassword),
  meta: { email },
});
