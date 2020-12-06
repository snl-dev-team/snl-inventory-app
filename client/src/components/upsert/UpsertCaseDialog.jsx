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
import * as Yup from 'yup';
import { mergeWith, isNull } from 'lodash';
import Spinner from '../Spinner';
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

  if (loading) return <Spinner />;

  const validationSchema = Yup.object().shape({
    number: Yup.string().required('Required!').default(''),
    name: Yup.string().required('Required!').default(''),
    count: Yup.number().required('Required!').positive('Must be > 0!').default(1),
    expirationDate: Yup.date().nullable().default(null),
    notes: Yup.string().default(''),
    defaultProductCount: Yup.number().required('Required!').positive('Must be > 0!').default(1),
    defaultMaterialCount: Yup.number().required('Required!').positive('Must be > 0!').default(1),
  });

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
        validationSchema={validationSchema}
        initialValues={mergeWith({},
          validationSchema.getDefault(),
          case_, (o, s) => (isNull(s) ? o : s))}
        onSubmit={onSubmit}
      >
        {({ submitForm, isSubmitting }) => (
          <>
            {isSubmitting && <LinearProgress />}
            <DialogContent dividers>
              <Form>
                <Grid container spacing={5} justify="center">
                  <Grid container item xs={12} spacing={3} justify="left">
                    <Grid item xs={3}>
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
                        component={DatePicker}
                        label="Expiration Date"
                        name="expirationDate"
                        clearable
                      />
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} spacing={3} justify="left">
                    <Grid item xs={3}>
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
                  <Grid container item xs={12} spacing={3} justify="left">
                    <Grid item xs={12}>
                      <Field
                        component={TextField}
                        name="notes"
                        type="text"
                        label="Notes"
                        multiline
                        fullWidth
                        rows={5}
                      />
                    </Grid>
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
