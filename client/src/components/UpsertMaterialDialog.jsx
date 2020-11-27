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
import { TextField, Select } from 'formik-material-ui';
import { DatePicker } from 'formik-material-ui-pickers';
import MenuItem from '@material-ui/core/MenuItem';
import UNITS from '../constants/units';
import { UPDATE_MATERIAL, CREATE_MATERIAL, GET_MATERIALS } from '../graphql/materials';

export default function UpsertMaterialDialog() {
  const useQueryString = () => new URLSearchParams(useLocation().search);
  const history = useHistory();
  const queryString = useQueryString();

  const [createMaterial] = useMutation(CREATE_MATERIAL);
  const [updateMaterial] = useMutation(UPDATE_MATERIAL);

  const handleClose = () => {
    history.push('/materials');
  };

  const id = queryString.get('id');
  const isUpdate = id !== null;

  const getTitle = () => {
    if (isUpdate) {
      return 'Update Material';
    }
    return 'Create Material';
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
      updateMaterial({
        variables: { ...newValues, id },
      }).then(() => {
        setSubmitting(false);
        history.push('/materials');
      });
    } else {
      createMaterial({
        variables: newValues,
        update: (client, { data: { createMaterial: { material = {} } = {} } = {} } = {}) => {
          const clientData = client.readQuery({
            query: GET_MATERIALS,
          });
          const newData = produce(clientData, (draftState) => {
            draftState.materials.edges.push({ __typename: 'MaterialEdge', node: material });
          });
          client.writeQuery({
            query: GET_MATERIALS,
            data: newData,
          });
        },
      }).then(() => {
        setSubmitting(false);
        history.push('/materials');
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
          count: getQueryStringValue('count', 0.0),
          price: getQueryStringValue('price', 0),
          units: getQueryStringValue('units', UNITS.UNIT),
          expirationDate: getQueryStringValue('expirationDate', null),
          notes: getQueryStringValue('notes', ''),
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
                onClick={() => history.push('/materials')}
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
