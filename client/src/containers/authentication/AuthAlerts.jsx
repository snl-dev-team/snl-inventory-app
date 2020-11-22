import React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const AuthAlerts = ({ error, info, success }) => {
  const classes = useStyles();
  return (
    <>
      {error !== null ? (
        <Alert severity="error" className={classes.root}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      ) : null}
      {info !== null ? (
        <Alert severity="info" className={classes.root}>
          <AlertTitle>Info</AlertTitle>
          {info}
        </Alert>
      ) : null}
      {success !== null ? (
        <Alert severity="success" className={classes.root}>
          <AlertTitle>Success</AlertTitle>
          {success}
        </Alert>
      ) : null}
    </>
  );
};

AuthAlerts.propTypes = {
  error: PropTypes.string,
  info: PropTypes.string,
  success: PropTypes.string,
};

AuthAlerts.defaultProps = {
  error: null,
  info: null,
  success: null,
};

export default AuthAlerts;
