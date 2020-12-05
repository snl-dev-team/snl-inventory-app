import { Auth } from 'aws-amplify';

export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const FORGOT_PASSWORD_AND_SUBMIT = 'FORGOT_PASSWORD_AND_SUBMIT';

export const signIn = (email, password) => ({
  type: SIGN_IN,
  payload: Auth.signIn({
    username: email,
    password,
  }),
  meta: { email },
});

export const signOut = () => ({
  type: SIGN_OUT,
});

export const changePassword = (oldPassword, newPassword) => ({
  type: CHANGE_PASSWORD,
  payload: Auth.currentAuthenticatedUser()
    .then((user) => Auth.changePassword(user, oldPassword, newPassword)),
});

export const forgotPassword = (email) => ({
  type: FORGOT_PASSWORD,
  payload: Auth.forgotPassword(email),
  meta: { email },
});

export const forgotPasswordAndSubmit = (email, code, newPassword) => ({
  type: FORGOT_PASSWORD_AND_SUBMIT,
  payload: Auth.forgotPasswordSubmit(email, code, newPassword),
  meta: { email },
});
