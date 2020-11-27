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
  GET_ORDERS, DELETE_ORDER,
} from '../../graphql/orders';
import UpsertOrderDialog from '../../components/UpsertOrderDialog';
import InventoryCard from '../../components/InventoryCard';

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

const OrdersDashboard = ({ searchString }) => {
  const classes = useStyles();
  const history = useHistory();

  const {
    loading, error, data,
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

  if (loading || error) {
    return <CircularProgress />;
  }

  const orders = data.orders.edges
    .map((edge) => edge.node)
    .filter(({ number }) => searchString === null || number.toLowerCase().includes(searchString));

  const getQueryString = (object) => Object.keys(object)
    .map((key) => `${key}=${object[key]}`)
    .join('&');

  return (
    <>
      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid key={order.id}>
            <InventoryCard
              data={Object.entries(order)
                .filter(([name]) => !['__typename', 'id'].includes(name))
                .map(([name, value]) => ({ name: lodash.startCase(name), value: String(value) }))}
              title={order.number}
              onClickShowCases={() => {}}
              onClickEdit={() => history.push(`/orders/update?${getQueryString(order)}`)}
              onClickDelete={() => deleteOrder({
                variables: { id: order.id },
                update: updateCache(order.id),
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
        onClick={() => history.push('/orders/create')}
      >
        <AddIcon />
      </Fab>

      <Route
        exact
        path={['/orders/create', '/orders/update']}
        component={UpsertOrderDialog}
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
