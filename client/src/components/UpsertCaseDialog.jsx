import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useHistory, useLocation } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';
import { FormControlLabel } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { UPDATE_CASE, CREATE_CASE } from '../graphql/cases';

export default function UpsertCaseDialog() {
  const useQueryString = () => new URLSearchParams(useLocation().search);
  const history = useHistory();
  const queryString = useQueryString();

  const [createCase] = useMutation(CREATE_CASE);
  const [updateCase] = useMutation(UPDATE_CASE);

  const handleClose = () => {
    history.push('/cases');
  };

  const [name, setName] = useState(queryString.get('name'));
  const [productName, setProductName] = useState(queryString.get('productName'));
  const [productCount, setProductCount] = useState(queryString.get('productCount'));
  const [count, setCount] = useState(queryString.get('count'));
  const [number, setNumber] = useState(queryString.get('number'));
  const [expirationDate, setExpirationDate] = useState(queryString.get('expirationDate'));
  const [shipped, setShipped] = useState(queryString.get('shipped') === 'true');
  const [notes, setNotes] = useState(queryString.get('notes'));

  const id = queryString.get('id');

  const isAdd = id === null;

  const canSave = true;

  const getTitle = () => {
    if (isAdd) {
      return 'Create Case';
    }
    return 'Edit Case';
  };

  const createCaseAndClose = () => {
    createCase({
      variables: {
        name,
        productName,
        productCount,
        count,
        number,
        expirationDate,
        shipped,
        notes,
      },
    });
    history.push('/cases');
  };

  const updateCaseAndClose = () => {
    updateCase({
      variables: {
        id,
        name,
        productName,
        productCount,
        count,
        number,
        expirationDate,
        shipped,
        notes,
      },
    });
    history.push('/cases');
  };

  return (
    <div>
      <Dialog
        open
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {getTitle()}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} justify="center">
            <Grid item>
              <TextField
                autoFocus
                margin="dense"
                label="Case Name"
                type="text"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item>
              <TextField
                autoFocus
                margin="dense"
                label="Product Name"
                type="text"
                fullWidth
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Grid>
            <Grid item>
              <TextField
                autoFocus
                margin="dense"
                label="Product Count"
                type="number"
                fullWidth
                value={productCount}
                onChange={(e) => setProductCount(parseInt(e.target.value, 10))}
              />
            </Grid>
            <Grid item>
              <TextField
                margin="dense"
                label="Lot Number"
                type="text"
                fullWidth
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </Grid>
            <Grid item>
              <TextField
                margin="dense"
                label="Count"
                type="number"
                fullWidth
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value, 10))}
              />
            </Grid>
            <Grid item>
              <TextField
                margin="dense"
                label="Expiration Date"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                style={{ paddingTop: 25 }}
                control={(
                  <Switch
                    checked={shipped}
                    size="small"
                    onChange={(e) => setShipped(e.target.checked)}
                  />
                )}
                labelPlacement="start"
                label="Shipped"
              />
            </Grid>
            <Grid item>
              <TextField
                autoFocus
                margin="dense"
                label="Notes"
                multiline
                rowsMax={6}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => history.push('/cases')}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            disabled={!canSave}
            onClick={isAdd ? createCaseAndClose : updateCaseAndClose}
            color="primary"
          >
            {isAdd ? 'Create' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
