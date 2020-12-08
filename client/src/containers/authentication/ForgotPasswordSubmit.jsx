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
import { useHistory, useParams } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Auth } from 'aws-amplify';
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
    <Link color="inherit" target="_blank" rel="noopener" href="https://sawgrassnutralabs.com/">
      Sawgrass Nutralabs
    </Link>
    {' '}
    {new Date().getFullYear()}
    .
  </Typography>
);

const ForgotPasword = () => {
  const history = useHistory();
  const { email } = useParams();
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleForgotPassword = () => {
    Auth.forgotPasswordSubmit(email, code, newPassword)
      .then(() => setSuccess('Password has been reset!'))
      .catch((err) => setError(err.message));
  };

  const classes = useStyles();

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
        <AuthAlerts success={success} error={error} info="Please check your inbox for code!" />
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
          <Grid container>
            <Grid item xs>
              <Link
                onClick={() => { Auth.signOut(); history.push('/sign-in'); }}
                variant="body2"
              >
                Go to Sign In
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
