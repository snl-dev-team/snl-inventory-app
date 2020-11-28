/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, LinearProgress } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import { TextField } from 'formik-material-ui';
import { useHistory, useParams } from 'react-router';
import { useMutation, useQuery } from '@apollo/client';
import * as Yup from 'yup';
import produce from 'immer';
import FormikAutocomplete from '../FormikAutoComplete';
import { GET_ORDER_CASES, ORDER_SHIP_CASE } from '../../../graphql/orders';
import { GET_CASES } from '../../../graphql/cases';

export default function UpsertOrderUseCaseDialog() {
  const { push } = useHistory();
  const { id } = useParams();
  const [orderShipCase] = useMutation(ORDER_SHIP_CASE);
  const { loading, data: { cases: { edges = [] } = {} } = {} } = useQuery(GET_CASES);
  const cases = edges.map(({ node }) => node);

  const validationSchema = Yup.object().shape({
    name: Yup.object().required('Required!').default(''),
    countShipped: Yup.number().required('Required!').min(0).default(0),
    countNotShipped: Yup.number().required('Required!').min(0).default(0),
  });

  const onSubmit = (orderId, caseId, countNotShipped, countShipped) => {
    orderShipCase({
      variables: {
        orderId, caseId, countNotShipped, countShipped,
      },
      update: (client, { data: { orderShipCase: { case: case_ } = {} } }) => {
        const clientData = client.readQuery({
          query: GET_ORDER_CASES,
          variables: { id: orderId },
        });
        const newData = produce(clientData, (draftState) => {
          const idx = draftState.order.cases.edges.findIndex(
            (edge) => edge.node.id === case_.id,
          );
          if (idx === -1) {
            draftState.order.cases.edges.push(
              {
                __typename: 'CaseEdge', countNotShipped, countShipped, node: case_,
              },
            );
          } else {
            // eslint-disable-next-line no-param-reassign
            draftState.order.cases.edges[idx] = {
              __typename: 'CaseEdge', countNotShipped, countShipped, node: case_,
            };
          }
        });
        client.writeQuery({
          query: GET_ORDER_CASES,
          data: newData,
        });
      },
    });
    push(`/orders/${id}/cases`);
  };

  return (
    <Dialog
      open
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Order Use Case</DialogTitle>
      <Formik
        validationSchema={validationSchema}
        initialValues={validationSchema.getDefault()}
        onSubmit={(v) => { onSubmit(id, v.name.id, v.countNotShipped, v.countShipped); }}
      >
        {({ submitForm, isSubmitting }) => (
          <>
            {isSubmitting && <LinearProgress />}
            <DialogContent dividers>
              <Form>
                <Grid container spacing={3} justify="center">
                  <Grid item>
                    <Field
                      name="name"
                      style={{ width: 300 }}
                      component={FormikAutocomplete}
                      label="Case"
                      getOptionLabel={(option) => (option.name !== undefined ? `${option.name} / ${option.number}` : '')}
                      getOptionSelected={(
                        option,
                        value,
                      ) => value.value === option.value}
                      options={cases}
                      loading={loading}
                      textFieldProps={{ fullWidth: true, margin: 'normal', variant: 'outlined' }}
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={TextField}
                      style={{ marginTop: 16 }}
                      type="number"
                      label="Count Not Shipped"
                      name="countNotShipped"
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={TextField}
                      style={{ marginTop: 16 }}
                      type="number"
                      label="Count Shipped"
                      name="countShipped"
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                </Grid>
              </Form>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => push(`/orders/${id}/cases`)}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={submitForm}
                color="primary"
              >
                Use
              </Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
}
