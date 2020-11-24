/* eslint-disable import/no-named-as-default */
/* eslint-disable import/named */
/* eslint-disable import/no-named-as-default-member */
import React, { useEffect } from 'react';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Route } from 'react-router-dom';
import OrderCard from '../../components/OrderCard';
import { fetchOrders, fetchOrder } from '../../actions/order';
import UpsertOrderDialog from '../../components/UpsertOrderDialog';

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

const OrdersDashboard = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    dispatch(fetchOrders(token));
    dispatch(fetchOrder(5, token));
  }, [dispatch, token]);

  const orders = useSelector(
    (state) => Object.values(state.orders),
    (before, after) => JSON.stringify(before) === JSON.stringify(after),
  );

  useEffect(() => {
  });

  return (
    <div>
      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid key={order.id}>
            <OrderCard
              number={order.number}
              id={order.id}
              dateCreated={order.dateCreated}
              dateModified={order.dateModified}
              notes={order.notes}
              completed={order.completed}
            />
          </Grid>
        ))}
      </Grid>

      <Fab
        size="medium"
        color="secondary"
        aria-label="add"
        className={classes.margin}
        onClick={() => history.push('/orders/add')}
      >
        <AddIcon />
      </Fab>

      <Route
        exact
        path="/orders/add"
        component={UpsertOrderDialog}
      />

      <Route
        exact
        path="/orders/edit/:id"
        component={UpsertOrderDialog}
      />
    </div>
  );
};

export default OrdersDashboard;
