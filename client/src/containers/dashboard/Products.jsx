import React from 'react';
import { Route, useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';

import produce from 'immer';
import { startCase, map } from 'lodash';
import { XGrid } from '@material-ui/x-grid';
import CheckIcon from '@material-ui/icons/Check';
import {
  GET_PRODUCTS, DELETE_PRODUCT,
} from '../../graphql/products';
import UpsertProductDialog from '../../components/upsert/UpsertProductDialog';
import InventoryCard from '../../components/InventoryCard';
import ProductUseMaterialDialog from '../../components/relational/view/ProductUseMaterialDialog';
import GenericDashboard from './Generic';
import UpsertProductUseCaseDialog from '../../components/relational/upsert/UpsertProductUseMaterialDialog';
import VIEW_MODES from '../../constants/viewModes';

const COLUMNS = [
  { field: 'id', hide: true },
  { field: 'number', headerName: 'Number' },
  { field: 'name', headerName: 'Name' },
  { field: 'count', headerName: 'Count' },
  {
    field: 'expirationDate', headerName: 'Expiration Date', width: 150, type: 'date',
  },
  {
    // eslint-disable-next-line react/prop-types
    field: 'completed', headerName: 'Completed', width: 150, renderCell: ({ data: { completed } }) => (completed ? <CheckIcon /> : ' '),
  },
  {
    field: 'dateModified', headerName: 'Date Modified', width: 200, type: 'dateTime',
  },
  {
    field: 'dateCreated', headerName: 'Date Created', width: 200, type: 'dateTime',
  },
];

const ProductsDashboard = ({ searchString, viewMode }) => {
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
        {viewMode === VIEW_MODES.CARDS
        && edges.map(({ node }) => node).filter(searchFilter).map((node) => (
          <InventoryCard
            key={node.id}
            data={Object.entries(node)
              .filter(([name]) => !['__typename', 'id', 'name'].includes(name))
              .map(([name, value]) => ({ name: startCase(name), value: String(value) }))}
            title={node.name}
            onClickShowMaterials={() => { push(`/products/${node.id}/materials`); }}
            onClickEdit={() => push(`/products/${node.id}/update`)}
            onClickDelete={() => deleteProduct({
              variables: { id: node.id },
              update: updateCache(node.id),
            })}
          />
        ))}
        {viewMode === VIEW_MODES.GRID && (
          <div style={{ height: 800, width: '100%', marginTop: 20 }}>
            <XGrid
              // eslint-disable-next-line react/jsx-props-no-spreading
              columns={COLUMNS}
              loading={loading}
              onRowClick={({ data: { id } }) => push(`products/${id}/update`)}
              rows={map(edges, ({ node }) => ({
                ...node,
                dateCreated: new Date(node.dateCreated),
                dateModified: new Date(node.dateModified),
                expirationDate: node.expirationDate ? new Date(node.expirationDate) : null,
              }))}
              rowHeight={38}
            />
          </div>
        )}
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
  viewMode: PropTypes.oneOf(Object.values(VIEW_MODES)).isRequired,
};

ProductsDashboard.defaultProps = {
  searchString: null,
};
