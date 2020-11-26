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
import { UPDATE_CASE, CREATE_CASE, GET_CASES } from '../graphql/cases';

export default function UpsertCaseDialog() {
  const useQueryString = () => new URLSearchParams(useLocation().search);
  const history = useHistory();
  const queryString = useQueryString();

  const [createCase] = useMutation(CREATE_CASE);
  const [updateCase] = useMutation(UPDATE_CASE);

  const handleClose = () => {
    history.push('/cases');
  };

  const id = queryString.get('id');
  const isUpdate = id !== null;

  const getTitle = () => {
    if (isUpdate) {
      return 'Create Case';
    }
    return 'Edit Case';
  };

  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    if (isUpdate) {
      updateCase({
        variables: { ...values, id },
      }).then(() => {
        setSubmitting(false);
        history.push('/cases');
      });
    } else {
      createCase({
        variables: values,
        update: (client, { data: { createCase: { case: case_ = {} } = {} } = {} } = {}) => {
          const clientData = client.readQuery({
            query: GET_CASES,
          });
          const newData = produce(clientData, (draftState) => {
            draftState.cases.edges.push({ __typename: 'CaseEdge', node: case_ });
          });
          client.writeQuery({
            query: GET_CASES,
            data: newData,
          });
        },
      }).then(() => {
        setSubmitting(false);
        history.push('/cases');
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
    if (key === 'count' || key === 'productCount') {
      return Number(value);
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
          name: getQueryStringValue('name', ''),
          count: getQueryStringValue('count', 0),
          expirationDate: getQueryStringValue('expirationDate', null),
          shipped: getQueryStringValue('shipped', false),
          notes: getQueryStringValue('notes', ''),
          productName: getQueryStringValue('productName', ''),
          productCount: getQueryStringValue('productCount', 0),
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
                      name="name"
                      type="text"
                      label="Name"
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
                      type="text"
                      label="Product Name"
                      name="productName"
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={TextField}
                      type="number"
                      label="Product Count"
                      name="productCount"
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={CheckboxWithLabel}
                      type="checkbox"
                      name="shipped"
                      Label={{ label: 'Shipped' }}
                    />
                  </Grid>
                </Grid>
              </Form>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => history.push('/cases')}
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
