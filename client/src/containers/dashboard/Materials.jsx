import React, { useEffect } from 'react';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { Route, useHistory } from 'react-router';
import { fetchMaterials } from '../../actions/material';
import MaterialCard from '../../components/MaterialCard';
import UpsertMaterialDialog from '../../components/UpsertMaterialDialog';

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
    flexGrow: 1,
  },
}));

const MaterialsDashboard = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    dispatch(fetchMaterials(token));
  }, [dispatch, token]);

  const materials = useSelector(
    (state) => Object.values(state.materials),
    (before, after) => JSON.stringify(before) === JSON.stringify(after),
  );

  const classes = useStyles();

  return (
    <div>
      <Grid container spacing={3}>
        {materials.map((material) => (
          <Grid key={material.id}>
            <MaterialCard
              count={material.count}
              expirationDate={material.expirationDate}
              number={material.number}
              name={material.name}
              price={material.price}
              units={material.units}
              id={material.id}
            />
          </Grid>
        ))}
      </Grid>

      <Fab
        size="medium"
        color="secondary"
        aria-label="add"
        className={classes.margin}
        onClick={() => {
          history.push('/materials/add');
        }}
      >
        <AddIcon />
      </Fab>

      <Route
        exact
        path="/materials/add"
        component={UpsertMaterialDialog}
      />

      <Route
        exact
        path="/materials/edit/:id"
        component={UpsertMaterialDialog}
      />
    </div>
  );
};
export default MaterialsDashboard;
