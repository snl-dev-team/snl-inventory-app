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
import { DatePicker } from 'formik-material-ui-pickers';
import { UPDATE_PRODUCT, CREATE_PRODUCT, GET_PRODUCTS } from '../graphql/products';

export default function UpsertProductDialog() {
  const useQueryString = () => new URLSearchParams(useLocation().search);
  const history = useHistory();
  const queryString = useQueryString();

  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);

  const handleClose = () => {
    history.push('/products');
  };

  const id = queryString.get('id');
  const isUpdate = id !== null;

  const getTitle = () => {
    if (isUpdate) {
      return 'Update Product';
    }
    return 'Create Product';
  };

  const onSubmit = (values, { setSubmitting }) => {
    const newValues = produce(values, (draft) => {
      if (values.expirationDate !== null) {
        const expirationDate = new Date(values.expirationDate);
        const year = String(expirationDate.getUTCFullYear()).padStart(4, '0');
        const month = String(expirationDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(expirationDate.getUTCDate() - 1).padStart(2, '0');
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
        history.push('/products');
      });
    } else {
      createProduct({
        variables: newValues,
        update: (client, { data: { createProduct: { product = {} } = {} } = {} } = {}) => {
          const clientData = client.readQuery({
            query: GET_PRODUCTS,
          });
          const newData = produce(clientData, (draftState) => {
            draftState.products.edges.push({ __typename: 'ProductEdge', node: product });
          });
          client.writeQuery({
            query: GET_PRODUCTS,
            data: newData,
          });
        },
      }).then(() => {
        setSubmitting(false);
        history.push('/products');
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
    if (key === 'count') {
      return Number(value);
    }
    if (key === 'expirationDate') {
      const d = new Date(value);
      d.setDate(d.getDate() + 1);
      return d;
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
          name: getQueryStringValue('name', ''),
          number: getQueryStringValue('number', ''),
          count: getQueryStringValue('count', 0),
          expirationDate: getQueryStringValue('expirationDate', null),
          completed: getQueryStringValue('completed', false),
          notes: getQueryStringValue('notes', ''),
          defaultMaterialCount: getQueryStringValue('defaultMaterialCount', 0.0),
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
                onClick={() => history.push('/products')}
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
