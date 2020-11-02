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
import GridOnIcon from '@material-ui/icons/GridOn';
import { deleteOrder } from '../actions/order';

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

export default function OrderCard({
  id,
  number,
  dateCreated,
  dateModified,
}) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const handleClickEdit = () => {
    history.push(`/orders/edit/${id}`);
  };

  const handleClickDelete = () => {
    dispatch(deleteOrder(id));
  };

  return (
    <Card className={classes.root}>
      <CardHeader title={number} />
      <CardContent>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
        >
          <span>
            Date Created:
            {' '}
            {dateCreated}
            <br />
            Date Modified:
            {' '}
            {dateModified}
            <br />
          </span>
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton className={clsx(classes.expand)}>
          <GridOnIcon />
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

OrderCard.propTypes = {
  id: PropTypes.number.isRequired,
  number: PropTypes.string.isRequired,
  dateCreated: PropTypes.string.isRequired,
  dateModified: PropTypes.string.isRequired,
};
