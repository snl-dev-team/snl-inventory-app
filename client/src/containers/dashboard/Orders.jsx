import React from 'react';
import { Route, useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';
import { startCase, map } from 'lodash';
import produce from 'immer';
import { XGrid } from '@material-ui/x-grid';
import CheckIcon from '@material-ui/icons/Check';
import {
  GET_ORDERS, DELETE_ORDER,
} from '../../graphql/orders';
import UpsertOrderDialog from '../../components/upsert/UpsertOrderDialog';
import InventoryCard from '../../components/InventoryCard';
import GenericDashboard from './Generic';
import OrderUseCaseDialog from '../../components/relational/view/OrderUseCaseDialog';
import UpsertOrderUseCaseDialog from '../../components/relational/upsert/UpsertOrderUseCaseDialog';
import VIEW_MODES from '../../constants/viewModes';

const COLUMNS = [
  { field: 'id', hide: true },
  { field: 'number', headerName: 'Number' },
  { field: 'customerName', headerName: 'Customer Name', width: 150 },
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

  return (
    <>
      <GenericDashboard
        loading={loading}
        onClickAdd={() => push('orders/create')}
      >
        {viewMode === VIEW_MODES.CARDS
        && nodes.map((node) => (
          <InventoryCard
            key={node.id}
            data={Object.entries(node)
              .filter(([name]) => !['__typename', 'id'].includes(name))
              .map(([name, value]) => ({ name: startCase(name), value: String(value) }))}
            title={node.number}
            onClickShowCases={() => push(`/orders/${node.id}/cases`)}
            onClickEdit={() => push(`/orders/${node.id}/update`)}
            onClickDelete={() => deleteOrder({
              variables: { id: node.id },
              update: updateCache(node.id),
            })}
            order
          />
        ))}
        {viewMode === VIEW_MODES.GRID && (
        <div style={{ height: 800, width: '100%', marginTop: 20 }}>
          <XGrid
              // eslint-disable-next-line react/jsx-props-no-spreading
            columns={COLUMNS}
            loading={loading}
            onRowClick={({ data: { id } }) => push(`orders/${id}/update`)}
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
        path="/orders/:id/cases/use"
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
