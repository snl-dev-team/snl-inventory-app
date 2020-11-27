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
import FormikAutocomplete from '../FormikAutoComplete';

export default function UpsertOrderUseCaseDialog() {
  const options = [{ title: 'The Shawshank Redemption', year: 1994 }];
  const { goBack } = useHistory();
  const { id } = useParams();

  return (
    <Dialog
      open
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Order Use Case</DialogTitle>
      <Formik
        initialValues={{
          name: '',
          shippedCount: 0,
          notShippedCount: 0,
        }}
        onSubmit={() => {}}
      >
        {({ submitForm, isSubmitting }) => (
          <>
            {isSubmitting && <LinearProgress />}
            <DialogContent dividers>
              <Form>
                <Grid justify="center" container spacing={3}>
                  <Grid item>
                    <Field
                      name="name"
                      style={{ width: 400 }}
                      component={FormikAutocomplete}
                      label="Case"
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
                      label="Shipped Count"
                      name="shippedCount"
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={TextField}
                      style={{ marginTop: 16 }}
                      type="number"
                      label="Not Shipped Count"
                      name="notShippedCount"
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                </Grid>
              </Form>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={goBack}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={goBack}
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
