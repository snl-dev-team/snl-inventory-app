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
import { createOrder, updateOrder } from '../actions/order';

export default function UpsertOrderDialog() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();

  const handleClose = () => {
    history.push('/orders');
  };

  const isAdd = id === undefined;

  const order = useSelector((state) => state.orders[id]);

  const [number, setNumber] = useState(
    order !== undefined ? order.number : '',
  );

  const canSave = true;

  const getTitle = () => {
    if (isAdd) {
      return 'Create Order';
    }
    return 'Edit Order';
  };

  const payload = {
    id: parseInt(id, 10),
    number,
  };

  const createOrderAndClose = () => {
    dispatch(
      createOrder(payload),
    );
    history.push('/orders');
  };

  const updateOrderAndClose = () => {
    dispatch(
      updateOrder(payload),
    );
    history.push('/orders');
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
                margin="dense"
                label="Lot Number"
                type="text"
                fullWidth
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => history.push('/orders')}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            disabled={!canSave}
            onClick={isAdd ? createOrderAndClose : updateOrderAndClose}
            color="primary"
          >
            {isAdd ? 'Create' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
