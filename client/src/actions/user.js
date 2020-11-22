import { Auth } from 'aws-amplify';

export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';
export const SIGN_UP = 'SIGN_UP';
export const CONFIRM_SIGN_UP = 'CONFIRM_SIGN_UP';
export const RESEND_CODE = 'RESEND_CODE';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const FORGOT_PASSWORD_AND_SUBMIT = 'FORGOT_PASSWORD_AND_SUBMIT';

export const signIn = (email, password) => ({
  type: SIGN_IN,
  payload: Auth.signIn({
    username: email,
    password,
  }),
});

export const signOut = () => ({
  type: SIGN_OUT,
});

export const signUp = (email, password) => ({
  type: SIGN_UP,
  payload: Auth.signUp({ username: email, password, attributes: { email } }),
  meta: { email },
});

export const confirmSignUp = (email, code) => ({
  type: CONFIRM_SIGN_UP,
  payload: Auth.confirmSignUp(email, code),
});

export const resendCode = (email) => ({
  type: RESEND_CODE,
  payload: Auth.resendSignUp(email),
});

export const changePassword = (oldPassword, newPassword) => ({
  type: CHANGE_PASSWORD,
  payload: Auth.currentAuthenticatedUser()
    .then((user) => Auth.changePassword(user, oldPassword, newPassword)),
});

export const forgotPassword = (email) => ({
  type: FORGOT_PASSWORD,
  payload: Auth.forgotPassword(email),
});

export const forgotPasswordAndSubmit = (username, code, newPassword) => ({
  type: FORGOT_PASSWORD_AND_SUBMIT,
  payload: Auth.forgotPasswordSubmit(username, code, newPassword),
});
