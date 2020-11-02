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
import PaletteIcon from '@material-ui/icons/Palette';
import { deleteProduct } from '../actions/product';

const useStyles = makeStyles(() => ({
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
  },
}));

export default function ProductCard({
  id,
  name,
  number,
  count,
  expirationDate,
  dateCreated,
  dateModified,
  completed,
}) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const handleClickEdit = () => {
    history.push(`/products/edit/${id}`);
  };
  const handleClickDelete = () => {
    dispatch(deleteProduct(id));
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
          Count:
          {' '}
          {count}
          <br />
          Expiration Date:
          {' '}
          {expirationDate}
          <br />
          Date Created:
          {' '}
          {dateCreated}
          <br />
          Date Modified:
          {' '}
          {dateModified}
          <br />
          Completed:
          {' '}
          {completed ? 'Yes' : 'No'}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton className={clsx(classes.expand)}>
          <PaletteIcon />
        </IconButton>
        <IconButton onClick={handleClickDelete}>
          <DeleteIcon />
        </IconButton>
        <IconButton
          onClick={handleClickEdit}
        >
          <EditIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

ProductCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  number: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  expirationDate: PropTypes.string.isRequired,
  dateCreated: PropTypes.string.isRequired,
  dateModified: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired,
};
