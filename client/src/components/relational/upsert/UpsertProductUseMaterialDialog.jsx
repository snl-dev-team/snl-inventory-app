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
import FormikAutocomplete from '../FormikAutoComplete';
import { GET_PRODUCTS, PRODUCT_USE_MATERIAL } from '../../../graphql/products';
import { GET_MATERIALS } from '../../../graphql/materials';

export default function UpsertProductUseMaterialDialog() {
  const { push } = useHistory();
  const { id } = useParams();
  const [productUseMaterial] = useMutation(PRODUCT_USE_MATERIAL);
  const { loading, data: { materials: { edges = [] } = {} } = {} } = useQuery(GET_MATERIALS);
  const materials = edges.map(({ node }) => node);

  const validationSchema = Yup.object().shape({
    name: Yup.object().required('Required!').defined('Please enter a value!'),
    count: Yup.number().required('Required!').positive('Must be > 0!'),
  });

  const onSubmit = (productId, materialId, count) => {
    // TODO(isaiahnields): update Apollo cache
    productUseMaterial({
      variables: { productId, materialId, count },
    });
    push(`/products/${id}/materials`);
  };

  return (
    <Dialog
      open
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Product Use Material</DialogTitle>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          name: '',
          count: 0,
        }}
        onSubmit={(v) => { onSubmit(id, v.name.id, v.count); }}
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
                      label="Material"
                      getOptionLabel={(option) => (option.name !== undefined ? `${option.name} / ${option.number}` : '')}
                      getOptionSelected={(
                        option,
                        value,
                      ) => value.value === option.value}
                      options={materials}
                      loading={loading}
                      textFieldProps={{ fullWidth: true, margin: 'normal', variant: 'outlined' }}
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={TextField}
                      style={{ marginTop: 16 }}
                      type="number"
                      label="Count"
                      name="count"
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                </Grid>
              </Form>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => push(`/products/${id}/materials`)}
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
