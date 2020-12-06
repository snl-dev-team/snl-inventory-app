import React from 'react';
import { Route, useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';
import { startCase, map } from 'lodash';
import produce from 'immer';
import { XGrid } from '@material-ui/x-grid';

import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  GET_ORDERS, DELETE_ORDER,
} from '../../graphql/orders';
import UpsertOrderDialog from '../../components/upsert/UpsertOrderDialog';
import InventoryCard from '../../components/InventoryCard';
import GenericDashboard from './Generic';
import OrderUseCaseDialog from '../../components/relational/view/OrderUseCaseDialog';
import UpsertOrderUseCaseDialog from '../../components/relational/upsert/UpsertOrderUseCaseDialog';
import VIEW_MODES from '../../constants/viewModes';
import { ORDER_COLUMNS } from '../../constants/columns';
import { URL } from '../../constants/url';

const OrdersDashboard = ({ searchString, viewMode }) => {
  const { push } = useHistory();

  const {
    loading,
    data: { orders: { edges = [] } = {} } = {},
  } = useQuery(GET_ORDERS);

  const [deleteOrder] = useMutation(DELETE_ORDER);

  const updateCache = (id) => (client) => {
    const clientData = client.readQuery({
      query: GET_ORDERS,
    });

    const newData = produce(clientData, (draftState) => {
      const idx = draftState.orders.edges
        .findIndex(({ node }) => node.id === id);
      draftState.orders.edges.splice(idx, 1);
    });

    client.writeQuery({
      query: GET_ORDERS,
      data: newData,
    });
  };

  const searchFilter = ({ number }) => searchString === null
  || number.toLowerCase().includes(searchString);

  const nodes = edges.map(({ node }) => node).filter(searchFilter);

  const getCardData = (node) => [
    Object.entries(node).filter(([name]) => ['defaultCaseCount', 'expirationDate', 'number']
      .includes(name)).map(([name, value]) => ({ name: startCase(name), value })),
    Object.entries(node).filter(([name]) => ['dateCreated', 'dateModified']
      .includes(name)).map(([name, value]) => ({ name: startCase(name), value })),
  ];

  const getChipData = (node) => ({
    businessName: node.customerName,
    completed: node.completed,
  });

  const token = useSelector((state) => state.user.token);

  const onClickDownload = (orderId) => {
    axios({
      url: `${URL}/order/${orderId}/report`,
      method: 'GET',
      responseType: 'blob',
      headers: {
        Authorization: token,
      },
    }).then((response) => {
      // eslint-disable-next-line no-undef
      const url = window.URL.createObjectURL(new Blob([response.data]));
      // eslint-disable-next-line no-undef
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Order ${orderId} Report.json`);
      // eslint-disable-next-line no-undef
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <>
      <GenericDashboard
        loading={loading}
        onClickAdd={() => push('/orders/create')}
      >
        {viewMode === VIEW_MODES.CARDS
        && nodes.map((node) => (
          <InventoryCard
            key={node.id}
            data={getCardData(node)}
            chips={getChipData(node)}
            title={node.number}
            onClickShowCases={() => push(`/orders/${node.id}/cases`)}
            onClickEdit={() => push(`/orders/${node.id}/update`)}
            onClickDelete={() => deleteOrder({
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
            columns={ORDER_COLUMNS}
            loading={loading}
            onRowClick={({ data: { id } }) => push(`/orders/${id}/update`)}
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
        path={['/orders/create', '/orders/:id/update']}
        component={UpsertOrderDialog}
      />

      <Route
        path="/orders/:id/cases"
        component={OrderUseCaseDialog}
      />

      <Route
        exact
        path={['/orders/:id/cases/use', '/orders/:id/cases/:caseId/use']}
        component={UpsertOrderUseCaseDialog}
      />
    </>
  );
};

export default OrdersDashboard;

OrdersDashboard.propTypes = {
  searchString: PropTypes.string,
  viewMode: PropTypes.oneOf(Object.values(VIEW_MODES)).isRequired,
};

OrdersDashboard.defaultProps = {
  searchString: null,
};
