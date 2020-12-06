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
import produce from 'immer';
import { map, find } from 'lodash';
import FormikAutocomplete from '../FormikAutoComplete';
import { GET_PRODUCT_MATERIALS, PRODUCT_USE_MATERIAL } from '../../../graphql/products';
import { GET_MATERIALS } from '../../../graphql/materials';
import Spinner from '../../Spinner';

export default function UpsertProductUseMaterialDialog() {
  const { push } = useHistory();
  const { id, materialId: updateMaterialId } = useParams();
  const [productUseMaterial] = useMutation(PRODUCT_USE_MATERIAL);
  const {
    loading, data: {
      materials: { edges: materialEdges = [] } = {
      },
    } = {},
  } = useQuery(GET_MATERIALS);
  const {
    data: {
      product: {
        materials: { edges: productEdges = [] } = {},
      } = {},
    } = {},
  } = useQuery(
    GET_PRODUCT_MATERIALS, { variables: { id } },
  );
  let materials = materialEdges.map(({ node }) => node);
  const productMaterials = productEdges.map(({ count, node }) => ({
    countUsed: count,
    ...node,
  }));
  materials = map(materials, (item) => ({ ...find(productMaterials, { id: item.id }), ...item }));

  const isUpdate = updateMaterialId !== undefined;
  const materialToUpdate = find(materials, { id: updateMaterialId }) || '';

  const validationSchema = Yup.object().shape({
    name: Yup.object().required('Required!').defined('Please enter a value!').default(materialToUpdate),
    count: Yup.number().required('Required!').positive('Must be > 0!').default(0)
      .test('test-count', 'Need more material!',
        (value, { parent }) => (parent.name !== '' ? value <= parent.name.count + (parent.name.countUsed || 0) : true)),
  });

  const onSubmit = (productId, materialId, count) => {
    productUseMaterial({
      variables: { productId, materialId, count },
      update: (client, { data: { productUseMaterial: { material } = {} } }) => {
        const clientData = client.readQuery({
          query: GET_PRODUCT_MATERIALS,
          variables: { id: productId },
        });
        const newData = produce(clientData, (draftState) => {
          const idx = draftState.product.materials.edges.findIndex(
            (edge) => edge.node.id === material.id,
          );
          if (idx === -1) {
            draftState.product.materials.edges.push(
              { __typename: 'MaterialEdge', count, node: material },
            );
          } else {
            // eslint-disable-next-line no-param-reassign
            draftState.product.materials.edges[idx] = { __typename: 'MaterialEdge', count, node: material };
          }
        });
        client.writeQuery({
          query: GET_PRODUCT_MATERIALS,
          data: newData,
        });
      },
    });
    push(`/products/${id}/materials`);
  };

  if (loading) return <Spinner />;

  return (
    <Dialog
      open
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Product Use Material</DialogTitle>
      <Formik
        // eslint-disable-next-line react/jsx-no-bind
        validationSchema={validationSchema}
        initialValues={validationSchema.getDefault()}
        onSubmit={(v) => { onSubmit(id, v.name.id, v.count); }}
      >
        {({
          submitForm, isSubmitting, values: {
            name: { count: countAvailable = 0, countUsed = 0 } = {},
          } = {},
          setFieldValue,
          ...v
        }) => (
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
                      disableClearable
                      label="Material"
                      getOptionLabel={(option) => (option.name !== undefined ? `${option.name} / ${option.number}` : '')}
                      getOptionSelected={(
                        option,
                        value,
                      ) => value.value === option.value}
                      options={materials}
                      onChange={(value) => { setFieldValue('count', value.count || 0); }}
                      loading={loading}
                      textFieldProps={{ fullWidth: true, margin: 'normal', variant: 'outlined' }}
                      disabled={isUpdate}
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={TextField}
                      style={{ marginTop: 16 }}
                      type="number"
                      label="New Count"
                      name="count"
                      InputProps={{ inputProps: { min: 0, max: countAvailable + countUsed } }}
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
                Confirm
              </Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
}
