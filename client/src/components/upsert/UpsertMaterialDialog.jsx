import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useHistory, useParams } from 'react-router-dom';
import { Button, CircularProgress, LinearProgress } from '@material-ui/core';
import { useMutation, useQuery } from '@apollo/client';
import produce from 'immer';
import { Formik, Form, Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import { TextField, Select } from 'formik-material-ui';
import { DatePicker } from 'formik-material-ui-pickers';
import MenuItem from '@material-ui/core/MenuItem';
import * as Yup from 'yup';
import UNITS from '../../constants/units';
import {
  UPDATE_MATERIAL, CREATE_MATERIAL, GET_MATERIALS, GET_MATERIAL,
} from '../../graphql/materials';

export default function UpsertMaterialDialog() {
  const { push } = useHistory();
  const { id } = useParams();

  const [createMaterial] = useMutation(CREATE_MATERIAL);
  const [updateMaterial] = useMutation(UPDATE_MATERIAL);
  const {
    data: { material = {} } = {},
    loading,
  } = useQuery(GET_MATERIAL, { variables: { id } });

  const isUpdate = id !== undefined;
  const title = `${isUpdate ? 'Update' : 'Create'} Material`;

  const onSubmit = (values, { setSubmitting }) => {
    const newValues = produce(values, (draft) => {
      if (values.expirationDate !== null) {
        const expirationDate = new Date(values.expirationDate);
        const year = String(expirationDate.getUTCFullYear()).padStart(4, '0');
        const month = String(expirationDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(Math.max(expirationDate.getUTCDate() - 1, 1)).padStart(2, '0');
        // eslint-disable-next-line no-param-reassign
        draft.expirationDate = `${year}-${month}-${day}`;
      }
    });
    setSubmitting(true);
    if (isUpdate) {
      updateMaterial({
        variables: { ...newValues, id },
        update: (client, {
          data: {
            updateMaterial: { material: newMaterial = {} } = {},
          } = {},
        } = {}) => {
          const clientData = client.readQuery({
            query: GET_MATERIALS,
          });
          const newData = produce(clientData, (draftState) => {
            const idx = clientData.materials.edges.findIndex(({ node }) => node.id === id);
            // eslint-disable-next-line no-param-reassign
            draftState.materials.edges[idx] = { __typename: 'MaterialEdge', node: newMaterial };
          });
          client.writeQuery({
            query: GET_MATERIALS,
            data: newData,
          });
        },
      }).then(() => {
        setSubmitting(false);
        push('/materials');
      });
    } else {
      createMaterial({
        variables: newValues,
        update: (client, {
          data: {
            createMaterial: { material: newMaterial = {} } = {},
          } = {},
        } = {}) => {
          const clientData = client.readQuery({
            query: GET_MATERIALS,
          });
          const newData = produce(clientData, (draftState) => {
            draftState.materials.edges.push({ __typename: 'MaterialEdge', node: newMaterial });
          });
          client.writeQuery({
            query: GET_MATERIALS,
            data: newData,
          });
        },
      }).then(() => {
        setSubmitting(false);
        push('/materials');
      });
    }
  };

  if (loading) return <CircularProgress />;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required!'),
    number: Yup.string().required('Required!'),
    count: Yup.number().required('Required!').positive('Must be > 0!'),
    price: Yup.number().required('Required!').round(),
    units: Yup.string().oneOf(Object.values(UNITS)).required('Required!'),
    expirationDate: Yup.date().nullable(),
    notes: Yup.string(),
    purchaseOrderUrl: Yup.string().url().nullable(),
    purchaseOrderNumber: Yup.string().nullable(),
    certificateOfAnalysisUrl: Yup.string().url().nullable(),
  });

  return (
    <Dialog
      open
      onClose={() => push('/materials')}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {title}
      </DialogTitle>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          name: material.name || '',
          number: material.number || '',
          count: material.count || 1.0,
          price: material.price || 0,
          units: material.units || UNITS.UNIT,
          expirationDate: material.expirationDate || null,
          notes: material.notes || '',
          purchaseOrderUrl: material.purchaseOrderUrl || '',
          purchaseOrderNumber: material.purchaseOrderNumber || '',
          certificateOfAnalysisUrl: material.certificateOfAnalysisUrl || '',
        }}
        onSubmit={onSubmit}
      >
        {({ submitForm, isSubmitting }) => (
          <>
            {isSubmitting && <LinearProgress />}
            <DialogContent dividers>
              <Form>
                <Grid container spacing={5} justify="center">
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
                      component={TextField}
                      type="number"
                      label="Price"
                      name="price"
                      InputProps={{ inputProps: { min: 0 } }}
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
                      name="purchaseOrderUrl"
                      type="text"
                      label="PO URL"
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={TextField}
                      name="purchaseOrderNumber"
                      type="text"
                      label="PO Number"
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={TextField}
                      name="certificateOfAnalysisUrl"
                      type="text"
                      label="COA URL"
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={Select}
                      name="units"
                      label="Units"
                    >
                      {Object.values(UNITS).map((unit) => (
                        <MenuItem
                          key={unit}
                          value={unit}
                        >
                          {unit}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                </Grid>
              </Form>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => push('/materials')}
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
