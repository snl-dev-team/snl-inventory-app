import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  spinner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
}));

export default function Spinner() {
  const classes = useStyles();

  return (
    <div className={classes.spinner}>
      <CircularProgress
        status="loading"
        style={{ marginLeft: '50%', marginTop: '50%' }}
      />
    </div>
  );
}
