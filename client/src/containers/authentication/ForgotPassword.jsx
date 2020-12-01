/* eslint-disable jsx-a11y/anchor-is-valid */
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
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { forgotPassword, signOut } from '../../actions/user';
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
  const [email, setEmail] = useState('');

  const {
    isAuthorized, error, info, success,
  } = useSelector((state) => state.user);

  const handleForgotPassword = () => {
    dispatch(forgotPassword(email));
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
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
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
                name="email"
                label="Email"
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={email === ''}
            onClick={handleForgotPassword}
          >
            Get New Password
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                onClick={() => { dispatch(signOut()); history.push('sign-in'); }}
                variant="body2"
              >
                Go to Sign In
              </Link>
            </Grid>
            <Grid item>
              <Link
                onClick={() => { dispatch(signOut()); history.push('sign-up'); }}
                variant="body2"
              >
                Go to Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default ForgotPasword;
