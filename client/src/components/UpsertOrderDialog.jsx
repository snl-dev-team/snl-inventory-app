import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, LinearProgress } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import produce from 'immer';
import { Formik, Form, Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import { UPDATE_ORDER, CREATE_ORDER, GET_ORDERS } from '../graphql/orders';

export default function UpsertOrderDialog() {
  const useQueryString = () => new URLSearchParams(useLocation().search);
  const history = useHistory();
  const queryString = useQueryString();

  const [createOrder] = useMutation(CREATE_ORDER);
  const [updateOrder] = useMutation(UPDATE_ORDER);

  const handleClose = () => {
    history.push('/orders');
  };

  const id = queryString.get('id');
  const isUpdate = id !== null;

  const getTitle = () => {
    if (isUpdate) {
      return 'Update Order';
    }
    return 'Create Order';
  };

  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    if (isUpdate) {
      updateOrder({
        variables: { ...values, id },
      }).then(() => {
        setSubmitting(false);
        history.push('/orders');
      });
    } else {
      createOrder({
        variables: values,
        update: (client, { data: { createOrder: { order = {} } = {} } = {} } = {}) => {
          const clientData = client.readQuery({
            query: GET_ORDERS,
          });
          const newData = produce(clientData, (draftState) => {
            draftState.orders.edges.push({ __typename: 'OrderEdge', node: order });
          });
          client.writeQuery({
            query: GET_ORDERS,
            data: newData,
          });
        },
      }).then(() => {
        setSubmitting(false);
        history.push('/orders');
      });
    }
  };

  const getQueryStringValue = (key, default_) => {
    const value = queryString.get(key);
    if (value === null || value === 'null') {
      return default_;
    }
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    return value;
  };

  return (
    <Dialog
      open
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {getTitle()}
      </DialogTitle>
      <Formik
        initialValues={{
          number: getQueryStringValue('number', ''),
          completed: getQueryStringValue('completed', false),
          notes: getQueryStringValue('notes', ''),
          customerName: getQueryStringValue('customerName', ''),
          defaultCaseCount: getQueryStringValue('defaultCaseCount', 0),
        }}
        onSubmit={onSubmit}
      >
        {({ submitForm, isSubmitting }) => (
          <>
            {isSubmitting && <LinearProgress />}
            <DialogContent dividers>
              <Form>
                <Grid container spacing={3}>
                  <Grid item>
                    <Field
                      component={TextField}
                      type="text"
                      label="Number"
                      name="number"
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={TextField}
                      name="notes"
                      type="text"
                      label="Notes"
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={TextField}
                      name="customerName"
                      type="text"
                      label="Customer Name"
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={TextField}
                      name="defaultCaseCount"
                      type="number"
                      label="Default Case Count"
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={CheckboxWithLabel}
                      type="checkbox"
                      name="completed"
                      Label={{ label: 'Completed' }}
                    />
                  </Grid>
                </Grid>
              </Form>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => history.push('/orders')}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={submitForm}
                color="primary"
              >
                {isUpdate ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
}
