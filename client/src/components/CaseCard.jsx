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
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import PaletteIcon from '@material-ui/icons/Palette';
import LocalPharmacyIcon from '@material-ui/icons/LocalPharmacy';
import { deleteCase } from '../actions/case';

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

export default function CaseCard({
  id,
  name,
  productName,
  productCount,
  count,
  number,
  expirationDate,
  dateCreated,
  dateModified,
  shipped,
}) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  const handleClickEdit = () => {
    history.push(`/cases/edit/${id}`);
  };

  const handleClickDelete = () => {
    dispatch(deleteCase(id, token));
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
          <span>
            Name:
            {' '}
            {name}
            <br />
            Product Name:
            {' '}
            {productName}
            <br />
            Product Count:
            {' '}
            {productCount}
            <br />
            Count:
            {' '}
            {count}
            <br />
            Lot Number:
            {' '}
            {number}
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
            Shipped:
            {' '}
            {shipped ? 'Yes' : 'No'}
            <br />
          </span>
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton className={clsx(classes.expand)}>
          <LocalPharmacyIcon />
        </IconButton>
        <IconButton>
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

CaseCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  productCount: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  number: PropTypes.string.isRequired,
  expirationDate: PropTypes.string.isRequired,
  dateCreated: PropTypes.string.isRequired,
  dateModified: PropTypes.string.isRequired,
  shipped: PropTypes.bool.isRequired,
};
