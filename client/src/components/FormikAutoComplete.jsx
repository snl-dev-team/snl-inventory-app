/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { fieldToTextField } from 'formik-material-ui';

const FormikAutocomplete = ({ textFieldProps, ...props }) => {
  const { form: { setTouched, setFieldValue } } = props;
  const {
    error, helperText, label, ...field
  } = fieldToTextField(props);
  const { name } = field;
  return (
    <Autocomplete
      {...props}
      {...field}
      onChange={(_, value) => setFieldValue(name, value)}
      onBlur={() => setTouched({ [name]: true })}
      renderInput={(props) => (
        <TextField
          {...props}
          {...textFieldProps}
          variant="standard"
          label={label}
          helperText={helperText}
          error={error}
        />
      )}
    />
  );
};

export default FormikAutocomplete;
