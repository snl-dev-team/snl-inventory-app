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
import { DatePicker } from 'formik-material-ui-pickers';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  UPDATE_PRODUCT, CREATE_PRODUCT, GET_PRODUCTS, GET_PRODUCT,
} from '../../graphql/products';

export default function UpsertProductDialog() {
  const { id } = useParams();
  const { push } = useHistory();

  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const { data: { product = {} } = {}, loading } = useQuery(GET_PRODUCT, { variables: { id } });

  const isUpdate = id !== undefined;
  const title = `${isUpdate ? 'Update' : 'Create'} Product`;

  const onSubmit = (values, { setSubmitting }) => {
    const newValues = produce(values, (draft) => {
      if (values.expirationDate) {
        const expirationDate = new Date(values.expirationDate);
        const year = String(expirationDate.getUTCFullYear()).padStart(4, '0');
        const month = String(expirationDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(Math.max(expirationDate.getUTCDate(), 1)).padStart(2, '0');
        // eslint-disable-next-line no-param-reassign
        draft.expirationDate = `${year}-${month}-${day}`;
      }
    });
    setSubmitting(true);
    if (isUpdate) {
      updateProduct({
        variables: { ...newValues, id },
      }).then(() => {
        setSubmitting(false);
        push('/products');
      });
    } else {
      createProduct({
        variables: newValues,
        update: (client, {
          data: {
            createProduct: { product: newProduct = {} } = {},
          } = {},
        } = {}) => {
          const clientData = client.readQuery({
            query: GET_PRODUCTS,
          });
          const newData = produce(clientData, (draftState) => {
            draftState.products.edges.push({ __typename: 'ProductEdge', node: newProduct });
          });
          client.writeQuery({
            query: GET_PRODUCTS,
            data: newData,
          });
        },
      }).then(() => {
        setSubmitting(false);
        push('/products');
      });
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Dialog
      open
      onClose={() => push('/products')}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {title}
      </DialogTitle>
      <Formik
        initialValues={{
          name: product.name || '',
          number: product.number || '',
          count: product.count || 0,
          expirationDate: product.expirationDate || null,
          completed: product.completed || false,
          notes: product.notes || '',
          defaultMaterialCount: product.defaultMaterialCount || 0.0,
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
                      label="Name"
                      name="name"
                    />
                  </Grid>
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
                      type="number"
                      label="Count"
                      name="count"
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={DatePicker}
                      label="Expiration Date"
                      name="expirationDate"
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
                      name="defaultMaterialCount"
                      type="number"
                      label="Default Material Count"
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
                onClick={() => push('/products')}
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
