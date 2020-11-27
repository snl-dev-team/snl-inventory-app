import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { useHistory, useParams } from 'react-router';
import { useQuery } from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import lodash from 'lodash';
import { CircularProgress } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { GET_PRODUCT_MATERIALS } from '../graphql/products';
import InventoryCard from './InventoryCard';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  fab: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
  grid: {
    padding: theme.spacing(3),
  },
}));

export default function ProductUseMaterialDialog() {
  const { id } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const { data, loading } = useQuery(GET_PRODUCT_MATERIALS, { variables: { id } });
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => history.push('/products'), 100);
  };

  return (
    <Dialog
      fullScreen
      transitionDuration={0}
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: '#fafafa',
        },
      }}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Product Materials:
            {' '}
            {id}
          </Typography>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <CssBaseline />
      {loading && <CircularProgress />}
      {!loading && (
      <Grid container className={classes.grid}>
        {data.product.materials.edges.map(({ node, countUsed }) => (
          <Grid key={node.id}>
            <InventoryCard
              data={Object.entries(node)
                .filter(([name]) => !['__typename', 'id', 'name'].includes(name))
                .concat([['countUsed', countUsed]])
                .map(([name, value]) => ({ name: lodash.startCase(name), value: String(value) }))}
              title={node.name}
              onClickDelete={() => {}}
              onClickEdit={() => {}}
            />
          </Grid>
        ))}
      </Grid>
      )}
      <Fab
        size="medium"
        color="secondary"
        aria-label="add"
        className={classes.fab}
        onClick={() => history.push(`/products/${id}/materials/use`)}
      >
        <AddIcon />
      </Fab>
    </Dialog>
  );
}
