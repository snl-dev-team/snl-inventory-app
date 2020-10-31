import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import { useHistory } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteMaterial } from '../actions/material';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 500,
    width: 400,
    margin: 5,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(360deg)',
  },
}));

export default function MaterialCard({
  count,
  expirationDate,
  number,
  name,
  price,
  units,
  id,
}) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const handleClickEdit = () => {
    history.push(`/materials/edit/${id}`);
  };
  const handleClickDelete = () => {
    dispatch(deleteMaterial(id));
  };

  return (
    <Card className={classes.root}>
      <CardHeader title={name} />
      <CardContent>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
        >
          Lot Number:
          {' '}
          {number}
          <br />
          Unit type:
          {' '}
          {units}
          <br />
          count:
          {' '}
          {count}
          <br />
          expiration:
          {' '}
          {expirationDate}
          <br />
          Total value:
          {' '}
          {price * count}
          <br />
          Price per unit:
          {' '}
          {price}
          <br />
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={handleClickDelete}>
          <DeleteIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand)}
          onClick={handleClickEdit}
        >
          <EditIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

MaterialCard.propTypes = {
  count: PropTypes.number.isRequired,
  expirationDate: PropTypes.string.isRequired,
  number: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  units: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};
