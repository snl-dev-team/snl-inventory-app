import React from 'react';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Route, useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';
import lodash from 'lodash';
import produce from 'immer';
import {
  GET_PRODUCTS, DELETE_PRODUCT,
} from '../../graphql/products';
import UpsertProductDialog from '../../components/UpsertProductDialog';
import InventoryCard from '../../components/InventoryCard';
import ProductUseMaterialDialog from '../../components/ProductUseMaterialDialog';

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
}));

const ProductsDashboard = ({ searchString }) => {
  const classes = useStyles();
  const history = useHistory();

  const {
    loading, error, data,
  } = useQuery(GET_PRODUCTS);

  const [deleteProduct] = useMutation(DELETE_PRODUCT);

  const updateCache = (id) => (client) => {
    const clientData = client.readQuery({
      query: GET_PRODUCTS,
    });

    const newData = produce(clientData, (draftState) => {
      const idx = draftState.products.edges
        .findIndex(({ node }) => node.id === id);
      draftState.products.edges.splice(idx, 1);
    });

    client.writeQuery({
      query: GET_PRODUCTS,
      data: newData,
    });
  };

  if (loading || error) {
    return <CircularProgress />;
  }

  const products = data.products.edges
    .map((edge) => edge.node)
    .filter(({ name }) => searchString === null || name.toLowerCase().includes(searchString))
    .map((node) => node);

  const getQueryString = (object) => Object.keys(object)
    .map((key) => `${key}=${object[key]}`)
    .join('&');

  return (
    <>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid key={product.id}>
            <InventoryCard
              data={Object.entries(product)
                .filter(([name]) => !['__typename', 'id', 'name'].includes(name))
                .map(([name, value]) => ({ name: lodash.startCase(name), value: String(value) }))}
              title={product.name}
              onClickShowMaterials={() => { history.push(`/products/${product.id}/materials`); }}
              onClickEdit={() => history.push(`/products/update?${getQueryString(product)}`)}
              onClickDelete={() => deleteProduct({
                variables: { id: product.id },
                update: updateCache(product.id),
              })}
            />
          </Grid>
        ))}
      </Grid>

      <Fab
        size="medium"
        color="secondary"
        aria-label="add"
        className={classes.margin}
        onClick={() => history.push('/products/create')}
      >
        <AddIcon />
      </Fab>

      <Route
        exact
        path={['/products/create', '/products/update']}
        component={UpsertProductDialog}
      />

      <Route
        path="/products/:id/materials"
        component={ProductUseMaterialDialog}
      />

    </>
  );
};

export default ProductsDashboard;

ProductsDashboard.propTypes = {
  searchString: PropTypes.string,
};

ProductsDashboard.defaultProps = {
  searchString: null,
};
