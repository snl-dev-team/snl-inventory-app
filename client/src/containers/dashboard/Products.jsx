import React from 'react';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  root: {
    width: '100%',
    height: '100%',
    maxWidth: 600,
    backgroundColor: theme.palette.background.paper,
    justifyContent: 'right',
  },
}));

const ProductsDashboard = () => {
  const classes = useStyles();

  return (
    <div>
      <div>
        <Fab
          size="medium"
          color="secondary"
          aria-label="add"
          className={classes.margin}
        >
          <AddIcon />
        </Fab>
      </div>
    </div>
  );
};

export default ProductsDashboard;
