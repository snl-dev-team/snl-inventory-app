/* eslint-disable no-undef */
import React from 'react';
import { Route, useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';

import produce from 'immer';
import { startCase, map } from 'lodash';
import { XGrid } from '@material-ui/x-grid';
import axios from 'axios';
import { Auth } from 'aws-amplify';
import {
  GET_PRODUCTS, DELETE_PRODUCT,
} from '../../graphql/products';
import UpsertProductDialog from '../../components/upsert/UpsertProductDialog';
import InventoryCard from '../../components/InventoryCard';
import ProductUseMaterialDialog from '../../components/relational/view/ProductUseMaterialDialog';
import GenericDashboard from './Generic';
import UpsertProductUseCaseDialog from '../../components/relational/upsert/UpsertProductUseMaterialDialog';
import VIEW_MODES from '../../constants/viewModes';
import { PRODUCT_COLUMNS } from '../../constants/columns';
import { URL } from '../../constants/url';

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

  const nodes = edges.map(({ node }) => node).filter(searchFilter);

  const getCardData = (node) => [
    Object.entries(node).filter(([name]) => ['number', 'defaultMaterialCount', 'expirationDate']
      .includes(name)).map(([name, value]) => ({ name: startCase(name), value })),
    Object.entries(node).filter(([name]) => ['dateCreated', 'dateModified']
      .includes(name)).map(([name, value]) => ({ name: startCase(name), value })),
  ];

  const getChipData = (node) => ({
    count: node.count,
    completed: node.completed,
  });

  const onClickDownload = async (productId) => {
    const idToken = await Auth.currentSession()
      .then((session) => session.getIdToken().getJwtToken());
    axios({
      url: `${URL}/product/${productId}/report`,
      method: 'GET',
      responseType: 'blob',
      headers: {
        Authorization: idToken,
      },
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Product ${productId} Report.json`);
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <>
      <GenericDashboard
        loading={loading}
        onClickAdd={() => push('/products/create')}
      >
        {viewMode === VIEW_MODES.CARDS
        && nodes.map((node) => (
          <InventoryCard
            key={node.id}
            data={getCardData(node)}
            chips={getChipData(node)}
            title={node.name}
            onClickShowMaterials={() => { push(`/products/${node.id}/materials`); }}
            onClickEdit={() => push(`/products/${node.id}/update`)}
            onClickDelete={() => deleteProduct({
              variables: { id: node.id },
              update: updateCache(node.id),
            })}
            onClickDownload={() => onClickDownload(node.id)}
          />
        ))}
        {viewMode === VIEW_MODES.GRID && (
          <div style={{ height: 800, width: '100%', marginTop: 20 }}>
            <XGrid
              // eslint-disable-next-line react/jsx-props-no-spreading
              columns={PRODUCT_COLUMNS}
              loading={loading}
              onRowClick={({ data: { id } }) => push(`/products/${id}/update`)}
              rows={map(nodes, (node) => ({
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
        path={['/products/:id/materials/use', '/products/:id/materials/:materialId/use']}
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
