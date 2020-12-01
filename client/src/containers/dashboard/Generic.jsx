import React from 'react';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import Spinner from '../../components/Spinner';

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
  const [cards, grid] = children;

  return (
    <>
      {!loading && (
      <Grid container spacing={3}>
        {cards && cards.map((child) => (
          <Grid key={child.key} item>
            {child}
          </Grid>
        ))}
      </Grid>
      )}

      {!loading && grid}

      {loading && (<Spinner />)}

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
