import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Switch from '@material-ui/core/Switch';
import { FormControlLabel } from '@material-ui/core';
import { createProduct, updateProduct } from '../actions/product';

export default function UpsertProductDialog() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const token = useSelector((state) => state.user.token);

  const handleClose = () => {
    history.push('/products');
  };

  const isAdd = id === undefined;

  const product = useSelector((state) => state.products[id]);

  const [name, setName] = useState(
    product !== undefined ? product.name : '',
  );
  const [number, setNumber] = useState(
    product !== undefined ? product.number : '',
  );
  const [count, setCount] = useState(
    product !== undefined ? product.count : 0,
  );
  const [expirationDate, setExpirationDate] = useState(
    product !== undefined ? product.expirationDate : '',
  );
  const [completed, setCompleted] = useState(
    product !== undefined ? product.completed : false,
  );
  const [notes, setNotes] = useState(
    product !== undefined ? product.notes : '',
  );

  const canSave = name !== '' && number !== '' && expirationDate !== '';

  const getTitle = () => {
    if (isAdd) {
      return 'Create Product';
    }
    return 'Edit Product';
  };

  const payload = {
    id: parseInt(id, 10),
    name,
    number,
    count,
    expirationDate,
    completed,
    notes,
  };

  const createProductAndClose = () => {
    dispatch(
      createProduct(payload, token),
    );
    history.push('/products');
  };

  const updateProductAndClose = () => {
    dispatch(
      updateProduct(payload, token),
    );
    history.push('/products');
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
                label="Product Name"
                type="text"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                    checked={completed}
                    size="small"
                    onChange={(e) => setCompleted(e.target.checked)}
                  />
                )}
                labelPlacement="start"
                label="Completed"
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
            onClick={() => history.push('/products')}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            disabled={!canSave}
            onClick={isAdd ? createProductAndClose : updateProductAndClose}
            color="primary"
          >
            {isAdd ? 'Create' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
