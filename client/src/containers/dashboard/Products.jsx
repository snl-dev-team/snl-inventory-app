import React, { useEffect } from 'react';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { Route, useHistory } from 'react-router';
import { fetchProducts } from '../../actions/product';
import ProductCard from '../../components/ProductCard';
import UpsertProductDialog from '../../components/UpsertProductDialog';

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
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    dispatch(fetchProducts(token));
  });

  const products = useSelector(
    (state) => Object.values(state.products),
    (before, after) => JSON.stringify(before) === JSON.stringify(after),
  );

  return (
    <div>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid key={product.id}>
            <ProductCard
              id={product.id}
              name={product.name}
              number={product.number}
              count={product.count}
              expirationDate={product.expirationDate}
              dateCreated={product.dateCreated}
              dateModified={product.dateModified}
              completed={product.completed}
              notes={product.notes}
            />
          </Grid>
        ))}
      </Grid>

      <div>
        <Fab
          size="medium"
          color="secondary"
          aria-label="add"
          className={classes.margin}
          onClick={() => history.push('/products/add')}
        >
          <AddIcon />
        </Fab>
      </div>

      <Route
        exact
        path="/products/add"
        component={() => <UpsertProductDialog />}
      />

      <Route
        exact
        path="/products/edit/:id"
        component={() => <UpsertProductDialog />}
      />
    </div>
  );
};

export default ProductsDashboard;
