import React from 'react';
import { Route, useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';
import lodash from 'lodash';
import produce from 'immer';
import {
  GET_ORDERS, DELETE_ORDER,
} from '../../graphql/orders';
import UpsertOrderDialog from '../../components/upsert/UpsertOrderDialog';
import InventoryCard from '../../components/InventoryCard';
import GenericDashboard from './Generic';
import OrderUseCaseDialog from '../../components/relational/view/OrderUseCaseDialog';
import UpsertOrderUseCaseDialog from '../../components/relational/upsert/UpsertOrderUseCaseDialog';

const OrdersDashboard = ({ searchString }) => {
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

  return (
    <>
      <GenericDashboard
        loading={loading}
        onClickAdd={() => push('orders/create')}
      >
        {edges.map(({ node }) => node).filter(searchFilter).map((node) => (
          <InventoryCard
            key={node.id}
            data={Object.entries(node)
              .filter(([name]) => !['__typename', 'id'].includes(name))
              .map(([name, value]) => ({ name: lodash.startCase(name), value: String(value) }))}
            title={node.number}
            onClickShowCases={() => push(`/orders/${node.id}/cases`)}
            onClickEdit={() => push(`/orders/${node.id}/update`)}
            onClickDelete={() => deleteOrder({
              variables: { id: node.id },
              update: updateCache(node.id),
            })}
          />
        ))}
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
};

OrdersDashboard.defaultProps = {
  searchString: null,
};
