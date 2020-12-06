import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useHistory, useParams } from 'react-router-dom';
import { Button, LinearProgress } from '@material-ui/core';
import { useMutation, useQuery } from '@apollo/client';
import produce from 'immer';
import { Formik, Form, Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import * as Yup from 'yup';
import { mergeWith, isNull } from 'lodash';
import Spinner from '../Spinner';
import {
  UPDATE_ORDER,
  CREATE_ORDER,
  GET_ORDERS,
  GET_ORDER,
} from '../../graphql/orders';

export default function UpsertOrderDialog() {
  const { push } = useHistory();
  const { id } = useParams();

  const [createOrder] = useMutation(CREATE_ORDER);
  const [updateOrder] = useMutation(UPDATE_ORDER);
  const { data: { order = {} } = {}, loading } = useQuery(GET_ORDER, { variables: { id } });

  const handleClose = () => {
    push('/orders');
  };

  const isUpdate = id !== undefined;
  const title = `${isUpdate ? 'Update' : 'Create'} Order`;

  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    if (isUpdate) {
      updateOrder({
        variables: { ...values, id },
      }).then(() => {
        setSubmitting(false);
        push('/orders');
      });
    } else {
      createOrder({
        variables: values,
        update: (client, {
          data: {
            createOrder: {
              order: newOrder = {
              },
            } = {},
          } = {},
        } = {}) => {
          const clientData = client.readQuery({
            query: GET_ORDERS,
          });
          const newData = produce(clientData, (draftState) => {
            draftState.orders.edges.push({ __typename: 'OrderEdge', node: newOrder });
          });
          client.writeQuery({
            query: GET_ORDERS,
            data: newData,
          });
        },
      }).then(() => {
        setSubmitting(false);
        push('/orders');
      });
    }
  };

  if (loading) return <Spinner />;

  const validationSchema = Yup.object().shape({
    number: Yup.string().required('Required!').default(''),
    completed: Yup.boolean().default(false),
    notes: Yup.string().default(''),
    customerName: Yup.string().default(''),
    defaultCaseCount: Yup.number().positive('Must be > 0!').round().default(1),
  });

  return (
    <Dialog
      open
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {title}
      </DialogTitle>
      <Formik
        initialValues={mergeWith({},
          validationSchema.getDefault(),
          order, (o, s) => (isNull(s) ? o : s))}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ submitForm, isSubmitting }) => (
          <>
            {isSubmitting && <LinearProgress />}
            <DialogContent dividers>
              <Form>
                <Grid container spacing={5} justify="center">
                  <Grid container item xs={12} spacing={3} justify="left">
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
                        name="customerName"
                        type="text"
                        label="Customer Name"
                      />
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} spacing={3} justify="left">
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
                  <Grid container item xs={12} spacing={3} justify="left">
                    <Grid item xs={12}>
                      <Field
                        component={TextField}
                        name="notes"
                        type="text"
                        label="Notes"
                        multiline
                        fullWidth
                        rows={5}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Form>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => push('/orders')}
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
