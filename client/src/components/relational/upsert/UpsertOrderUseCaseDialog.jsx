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
import { map, find } from 'lodash';
import FormikAutocomplete from '../FormikAutoComplete';
import { GET_ORDER_CASES, ORDER_USE_CASE } from '../../../graphql/orders';
import { GET_CASES } from '../../../graphql/cases';

export default function UpsertOrderUseCaseDialog() {
  const { push } = useHistory();
  const { id } = useParams();
  const [orderUseCase] = useMutation(ORDER_USE_CASE);
  const {
    loading, data: {
      cases: { edges: caseEdges = [] } = {
      },
    } = {},
  } = useQuery(GET_CASES);
  const {
    data: {
      order: {
        cases: { edges: orderEdges = [] } = {},
      } = {},
    } = {},
  } = useQuery(
    GET_ORDER_CASES, { variables: { id } },
  );
  let cases = caseEdges.map(({ node }) => node);
  const orderCases = orderEdges.map(({ count, node }) => ({
    countUsed: count,
    ...node,
  }));
  cases = map(cases, (item) => ({ ...find(orderCases, { id: item.id }), ...item }));

  const validationSchema = Yup.object().shape({
    name: Yup.object().required('Required!').defined('Please enter a value!').default(''),
    count: Yup.number().required('Required!').positive('Must be > 0!').default(0)
      .test('test-count', 'Need more cases!',
        (value, { parent }) => (parent.name !== '' ? value <= parent.name.count + (parent.name.countUsed || 0) : true)),
    orderCount: Yup.number().required('Required!').min(0).default(0),
  });

  const onSubmit = (orderId, caseId, count, orderCount) => {
    orderUseCase({
      variables: {
        orderId, caseId, count, orderCount,
      },
      update: (client, { data: { orderUseCase: { case: case_ } = {} } }) => {
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
                __typename: 'CaseEdge', count, orderCount, node: case_,
              },
            );
          } else {
            // eslint-disable-next-line no-param-reassign
            draftState.order.cases.edges[idx] = {
              __typename: 'CaseEdge', count, orderCount, node: case_,
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
        // eslint-disable-next-line react/jsx-no-bind
        validationSchema={validationSchema}
        initialValues={validationSchema.getDefault()}
        onSubmit={(v) => { onSubmit(id, v.name.id, v.count, v.orderCount); }}
      >
        {({
          submitForm, isSubmitting, values: {
            name: { count: countAvailable = 0, countUsed = 0 } = {},
          } = {},
          setFieldValue,
          ...v
        }) => (
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
                      disableClearable
                      label="Case"
                      getOptionLabel={(option) => (option.name !== undefined ? `${option.name} / ${option.number}` : '')}
                      getOptionSelected={(
                        option,
                        value,
                      ) => value.value === option.value}
                      options={cases}
                      loading={loading}
                      onChange={(value) => { setFieldValue('count', value.count || 0); }}
                      textFieldProps={{ fullWidth: true, margin: 'normal', variant: 'outlined' }}
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={TextField}
                      style={{ marginTop: 16 }}
                      type="number"
                      label="New Count"
                      name="count"
                      InputProps={{ inputProps: { min: 0, max: countAvailable + countUsed } }}
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={TextField}
                      style={{ marginTop: 16 }}
                      type="number"
                      label="Order Count"
                      name="orderCount"
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
                Confirm
              </Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
}
