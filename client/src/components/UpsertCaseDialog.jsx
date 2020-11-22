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
import { createCase, updateCase } from '../actions/case';

export default function UpsertCaseDialog() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const token = useSelector((state) => state.user.token);

  const handleClose = () => {
    history.push('/cases');
  };

  const isAdd = id === undefined;

  // eslint-disable-next-line no-underscore-dangle
  const case_ = useSelector((state) => state.cases[id]);

  const [name, setName] = useState(
    case_ !== undefined ? case_.name : '',
  );
  const [productName, setProductName] = useState(
    case_ !== undefined ? case_.productName : '',
  );
  const [productCount, setProductCount] = useState(
    case_ !== undefined ? case_.productCount : 0,
  );
  const [count, setCount] = useState(
    case_ !== undefined ? case_.count : 0,
  );
  const [number, setNumber] = useState(
    case_ !== undefined ? case_.number : '',
  );
  const [expirationDate, setExpirationDate] = useState(
    case_ !== undefined ? case_.expirationDate : '',
  );
  const [shipped, setShipped] = useState(
    case_ !== undefined ? case_.shipped : false,
  );

  const canSave = true;

  const getTitle = () => {
    if (isAdd) {
      return 'Create Case';
    }
    return 'Edit Case';
  };

  const payload = {
    id: parseInt(id, 10),
    name,
    productName,
    productCount,
    count,
    number,
    expirationDate,
    shipped,
  };

  const createCaseAndClose = () => {
    dispatch(
      createCase(payload, token),
    );
    history.push('/cases');
  };

  const updateCaseAndClose = () => {
    dispatch(
      updateCase(payload, token),
    );
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
