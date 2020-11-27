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
import { TextField } from 'formik-material-ui';
import { DatePicker } from 'formik-material-ui-pickers';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  UPDATE_CASE, CREATE_CASE, GET_CASES, GET_CASE,
} from '../../graphql/cases';

export default function UpsertCaseDialog() {
  const history = useHistory();
  const { id } = useParams();

  const [createCase] = useMutation(CREATE_CASE);
  const [updateCase] = useMutation(UPDATE_CASE);
  const {
    data: { case: case_ = { } } = {},
    loading,
  } = useQuery(GET_CASE, { variables: { id } });

  const handleClose = () => {
    history.push('/cases');
  };

  const isUpdate = id !== undefined;
  const title = `${isUpdate ? 'Update' : 'Create'} Case`;

  const onSubmit = (values, { setSubmitting }) => {
    const newValues = produce(values, (draft) => {
      if (values.expirationDate) {
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
      updateCase({
        variables: { ...newValues, id },
      }).then(() => {
        setSubmitting(false);
        history.push('/cases');
      });
    } else {
      createCase({
        variables: newValues,
        update: (client, {
          data: {
            createCase: {
              case: newCase = {
              },
            } = {},
          } = {},
        } = {}) => {
          const clientData = client.readQuery({
            query: GET_CASES,
          });
          const newData = produce(clientData, (draftState) => {
            draftState.cases.edges.push({ __typename: 'CaseEdge', node: newCase });
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

  if (loading) return <CircularProgress />;

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
        initialValues={{
          number: case_.number || '',
          name: case_.name || '',
          count: case_.count || 0,
          expirationDate: case_.expirationDate || null,
          notes: case_.notes || '',
          defaultProductCount: case_.defaultProductCount || 0,
          defaultMaterialCount: case_.defaultMaterialCount || 0,
        }}
        onSubmit={onSubmit}
      >
        {({ submitForm, isSubmitting }) => (
          <>
            {isSubmitting && <LinearProgress />}
            <DialogContent dividers>
              <Form>
                <Grid container spacing={3} justify="center">
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
                      type="number"
                      label="Default Product Count"
                      name="defaultMaterialCount"
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={TextField}
                      type="number"
                      label="Default Product Count"
                      name="defaultProductCount"
                      InputProps={{ inputProps: { min: 0 } }}
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
