import React from 'react';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  margin: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
  spinner: {
    justifyContent:
    'center',
    alignContent: 'center',
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: '5%',
  },
}));

const GenericDashboard = ({
  onClickAdd,
  loading,
  children,
}) => {
  const classes = useStyles();

  return (
    <>
      {!loading && (
      <Grid container spacing={3}>
        {children.map((child) => (
          <Grid key={child.key} item>
            {child}
          </Grid>
        ))}
      </Grid>
      )}

      {loading && (
      <div className={classes.spinner}>
        <CircularProgress
          transform="translateX(-50%)"
          status="loading"
          style={{ marginLeft: '50%', marginTop: '50%' }}
        />
      </div>
      )}

      <Fab
        size="medium"
        color="secondary"
        aria-label="add"
        className={classes.margin}
        onClick={onClickAdd}
      >
        <AddIcon />
      </Fab>

    </>
  );
};

export default GenericDashboard;

GenericDashboard.propTypes = {
  loading: PropTypes.bool.isRequired,
  onClickAdd: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.node),
};

GenericDashboard.defaultProps = {
  children: [],
};
