import React from 'react';
import { Route, useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';
import lodash from 'lodash';
import produce from 'immer';
import {
  GET_PRODUCTS, DELETE_PRODUCT,
} from '../../graphql/products';
import UpsertProductDialog from '../../components/upsert/UpsertProductDialog';
import InventoryCard from '../../components/InventoryCard';
import ProductUseMaterialDialog from '../../components/relational/view/ProductUseMaterialDialog';
import GenericDashboard from './Generic';
import UpsertProductUseCaseDialog from '../../components/relational/upsert/UpsertProductUseMaterialDialog';

const ProductsDashboard = ({ searchString }) => {
  const { push } = useHistory();

  const {
    loading,
    data: { products: { edges = [] } = {} } = {},
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

  const searchFilter = ({ name }) => searchString === null
  || name.toLowerCase().includes(searchString);

  return (
    <>
      <GenericDashboard
        loading={loading}
        onClickAdd={() => push('/products/create')}
      >
        {edges.map(({ node }) => node).filter(searchFilter).map((node) => (
          <InventoryCard
            key={node.id}
            data={Object.entries(node)
              .filter(([name]) => !['__typename', 'id', 'name'].includes(name))
              .map(([name, value]) => ({ name: lodash.startCase(name), value: String(value) }))}
            title={node.name}
            onClickShowMaterials={() => { push(`/products/${node.id}/materials`); }}
            onClickEdit={() => push(`/products/${node.id}/update`)}
            onClickDelete={() => deleteProduct({
              variables: { id: node.id },
              update: updateCache(node.id),
            })}
          />
        ))}
      </GenericDashboard>

      <Route
        exact
        path={['/products/create', '/products/:id/update']}
        component={UpsertProductDialog}
      />

      <Route
        path="/products/:id/materials"
        component={ProductUseMaterialDialog}
      />

      <Route
        path="/products/:id/materials/use"
        component={UpsertProductUseCaseDialog}
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
