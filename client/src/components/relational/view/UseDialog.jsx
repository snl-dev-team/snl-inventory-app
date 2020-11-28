import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import { CircularProgress } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';

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
    padding: theme.spacing(5),
  },
}));

export default function UseDialog({
  onClickAdd,
  onClickCancel,
  title,
  loading,
  children,
}) {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    setTimeout(onClickCancel, 100);
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
            {title}
          </Typography>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <CssBaseline />
      {loading && <CircularProgress />}
      <Grid container className={classes.grid} spacing={3}>
        {!loading && children.map((child) => (
          <Grid key={child.key} item>
            {child}
          </Grid>
        ))}
      </Grid>
      <Fab
        size="medium"
        color="secondary"
        aria-label="add"
        className={classes.fab}
        onClick={onClickAdd}
      >
        <AddIcon />
      </Fab>
    </Dialog>
  );
}

UseDialog.propTypes = {
  onClickAdd: PropTypes.func.isRequired,
  onClickCancel: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};
