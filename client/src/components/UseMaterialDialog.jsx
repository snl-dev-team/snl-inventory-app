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
import FormikAutocomplete from './FormikAutoComplete';

export default function UseMaterialDialog() {
  const options = [{ title: 'The Shawshank Redemption', year: 1994 }];
  const history = useHistory();
  const { id } = useParams();

  return (
    <Dialog
      open
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Use Material</DialogTitle>
      <Formik
        initialValues={{
          name: '',
          count: 0,
        }}
        onSubmit={() => {}}
      >
        {({ submitForm, isSubmitting }) => (
          <>
            {isSubmitting && <LinearProgress />}
            <DialogContent dividers>
              <Form>
                <Grid container spacing={3}>
                  <Grid item>
                    <Field
                      name="name"
                      style={{ width: 300 }}
                      component={FormikAutocomplete}
                      label="Material"
                      getOptionLabel={(option) => (option.title ? option.title : '')}
                      getOptionSelected={(
                        option,
                        value,
                      ) => value.value === option.value}
                      options={options}
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
                onClick={() => { history.push(`/products/${id}/materials`); }}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={() => { history.push(`/products/${id}/materials`); }}
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
