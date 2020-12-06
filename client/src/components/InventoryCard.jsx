/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPrescriptionBottle, faPills, faBoxOpen,
} from '@fortawesome/free-solid-svg-icons';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Chip from '@material-ui/core/Chip';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Divider } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import StoreIcon from '@material-ui/icons/Store';
import Link from '@material-ui/core/Link';
import { startCase } from 'lodash';

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
  chip: {
    marginRight: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  divider: {
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },
  link: {
    color: 'black',
  },
}));

export default function InventoryCard({
  onClickDelete,
  onClickEdit,
  onClickShowMaterials,
  onClickShowProducts,
  onClickShowCases,
  data,
  title,
  chips,
}) {
  const classes = useStyles();
  const relationButtons = [
    [onClickShowCases, () => <FontAwesomeIcon icon={faBoxOpen} />],
    [onClickShowProducts, () => <FontAwesomeIcon icon={faPrescriptionBottle} />],
    [onClickShowMaterials, () => <FontAwesomeIcon icon={faPills} />],
  ];

  const renderChip = (name, value) => {
    const newValue = [null, ''].includes(value) ? 'None' : value;
    switch (name) {
      case 'businessName':
        return (
          <Chip
            label={newValue}
            className={classes.chip}
            color="primary"
            icon={<StoreIcon />}
            key={name}
          />
        );
      case 'completed':
        return (
          <Chip
            label={value ? 'Completed' : 'In Progress'}
            className={classes.chip}
            color="secondary"
            icon={value ? <CheckCircleIcon /> : <CachedIcon />}
            key={name}
          />
        );
      case 'units':
        return (
          <Chip
            label={newValue}
            className={classes.chip}
            color="secondary"
            key={name}
          />
        );
      case 'price':
        return (
          <Chip
            label={`$${newValue / 10000} / unit`}
            className={classes.chip}
            color="secondary"
            key={name}
          />
        );
      default:
        return (
          <Chip
            label={`${startCase(name)}: ${newValue}`}
            className={classes.chip}
            color="primary"
            key={name}
          />
        );
    }
  };

  const itemButtons = [
    [onClickEdit, EditIcon],
    [onClickDelete, DeleteIcon],
  ];
  const renderData = (name, value) => (
    <div key={name}>
      <b>
        {name}
        :
      </b>
      {' '}
      {value === null ? 'None' : value}
    </div>
  );

  return (
    <Card className={classes.root}>
      <CardHeader title={title} style={{ paddingBottom: 0 }} />
      <CardContent>
        <Typography
          variant="body2"
          color="textSecondary"
          component="div"
        >
          {data.map((list, idx) => [(list.map((item) => (
            <div key={item.name}>{renderData(item.name, item.value)}</div>
          ))),
            <Divider className={classes.divider} key={`divider-${idx}`} />])}
          {Object.entries(chips).map(([name, value]) => renderChip(name, value))}
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
        {relationButtons.filter((button) => button[0] !== null).map((button) => {
          const [onClick, Icon] = button;
          return (
            <IconButton
              onClick={onClick}
              key={onClick.name}
            >
              <Icon />
            </IconButton>
          );
        })}
        {itemButtons.filter((button) => button[0] !== null).map((button, idx) => {
          const [onClick, Icon] = button;
          return (
            <IconButton
              className={idx === 0 ? clsx(classes.expand) : null}
              onClick={onClick}
              key={onClick.name}
            >
              <Icon />
            </IconButton>
          );
        })}
      </CardActions>
    </Card>
  );
}

InventoryCard.propTypes = {
  onClickDelete: PropTypes.func,
  onClickEdit: PropTypes.func,
  onClickShowMaterials: PropTypes.func,
  onClickShowProducts: PropTypes.func,
  onClickShowCases: PropTypes.func,
  data: PropTypes
    .arrayOf(PropTypes
      .arrayOf(PropTypes
        .shape({
          name: PropTypes.string.isRequired,
          value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
            PropTypes.number,
          ]),
        }))),
  chips: PropTypes.shape({
    businessName: PropTypes.string,
    count: PropTypes.number,
    countUsed: PropTypes.number,
    completed: PropTypes.bool,
    units: PropTypes.string,
    price: PropTypes.number,
  }),
  title: PropTypes.string.isRequired,
};

InventoryCard.defaultProps = {
  onClickDelete: null,
  onClickEdit: null,
  onClickShowMaterials: null,
  onClickShowProducts: null,
  onClickShowCases: null,
  data: [],
  chips: {},
};
