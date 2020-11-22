import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { forgotPasswordAndSubmit, signOut } from '../../actions/user';
import AuthAlerts from './AuthAlerts';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Copyright = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    {'Copyright © '}
    <Link color="inherit" href="https://material-ui.com/">
      Sawgrass Nutralabs
    </Link>
    {' '}
    {new Date().getFullYear()}
    .
  </Typography>
);

const ForgotPasword = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const {
    isAuthorized, email, error, info, success,
  } = useSelector((state) => state.user);

  const handleForgotPassword = () => {
    dispatch(forgotPasswordAndSubmit(email, code, newPassword));
    history.push('/forgot-password/submit');
  };

  const classes = useStyles();

  if (isAuthorized) {
    return <Redirect to="/" />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <AuthAlerts error={error} info={info} success={success} />
        <form className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="code"
                label="Code"
                type="text"
                id="code"
                onChange={(e) => setCode(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="new-password"
                label="New Password"
                type="password"
                id="new-password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={code === '' || newPassword === '' || success !== null}
            onClick={handleForgotPassword}
          >
            Reset Password
          </Button>
          <Button
            fullWidth
            variant="contained"
            className={classes.submit}
            onClick={() => { dispatch(signOut()); history.push('sign-in'); }}
          >
            Go to Sign In
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => { dispatch(signOut()); history.push('sign-up'); }}
          >
            Go to Sign Up
          </Button>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default ForgotPasword;
