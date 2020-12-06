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
import { GET_CASE_PRODUCTS, CASE_USE_PRODUCT } from '../../../graphql/cases';
import { GET_PRODUCTS } from '../../../graphql/products';
import Spinner from '../../Spinner';

export default function UpsertCaseUseProductDialog() {
  const { push } = useHistory();
  const { id, productId: updateProductId } = useParams();
  const [caseUseProduct] = useMutation(CASE_USE_PRODUCT);
  const {
    loading, data: {
      products: { edges: productEdges = [] } = {
      },
    } = {},
  } = useQuery(GET_PRODUCTS);
  const { data: { case: { products: { edges: caseEdges = [] } = {} } = {} } = {} } = useQuery(
    GET_CASE_PRODUCTS, { variables: { id } },
  );
  let products = productEdges.map(({ node }) => node);
  const caseProducts = caseEdges.map(({ count, node }) => ({
    countUsed: count,
    ...node,
  }));
  products = map(products, (item) => ({ ...find(caseProducts, { id: item.id }), ...item }));

  const isUpdate = updateProductId !== undefined;
  const productToUpdate = find(products, { id: updateProductId }) || '';

  const validationSchema = Yup.object().shape({
    name: Yup.object().required('Required!').defined('Please enter a value!').default(productToUpdate),
    count: Yup.number().required('Required!').positive('Must be > 0!').default(0)
      .test('test-count', 'Need more product!',
        (value, { parent }) => (parent.name !== '' ? value <= parent.name.count + (parent.name.countUsed || 0) : true)),
  });

  const onSubmit = (caseId, productId, count) => {
    caseUseProduct({
      variables: { caseId, productId, count },
      update: (client, { data: { caseUseProduct: { product } = {} } }) => {
        const clientData = client.readQuery({
          query: GET_CASE_PRODUCTS,
          variables: { id: caseId },
        });
        const newData = produce(clientData, (draftState) => {
          const idx = draftState.case.products.edges.findIndex(
            (edge) => edge.node.id === product.id,
          );
          if (idx === -1) {
            draftState.case.products.edges.push(
              { __typename: 'ProductEdge', count, node: product },
            );
          } else {
            // eslint-disable-next-line no-param-reassign
            draftState.case.products.edges[idx] = { __typename: 'ProductEdge', count, node: product };
          }
        });
        client.writeQuery({
          query: GET_CASE_PRODUCTS,
          data: newData,
        });
      },
    });
    push(`/cases/${id}/products`);
  };

  if (loading) return <Spinner />;

  return (
    <Dialog
      open
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Case Use Product</DialogTitle>
      <Formik
        // eslint-disable-next-line react/jsx-no-bind
        validationSchema={validationSchema}
        initialValues={validationSchema.getDefault()}
        onSubmit={(v) => { onSubmit(id, v.name.id, v.count); }}
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
                      label="Product"
                      getOptionLabel={(option) => (option.name !== undefined ? `${option.name} / ${option.number}` : '')}
                      getOptionSelected={(
                        option,
                        value,
                      ) => value.value === option.value}
                      options={products}
                      loading={loading}
                      textFieldProps={{ fullWidth: true, margin: 'normal', variant: 'outlined' }}
                      onChange={(value) => { setFieldValue('count', value.count || 0); }}
                      disabled={isUpdate}
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
                </Grid>
              </Form>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => push(`/cases/${id}/products`)}
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
