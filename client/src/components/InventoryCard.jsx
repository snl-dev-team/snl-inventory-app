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

export default function InventoryCard({
  onClickDelete,
  onClickEdit,
  onClickShowMaterials,
  onClickShowProducts,
  onClickShowCases,
  data,
  title,
}) {
  const classes = useStyles();

  const relationButtons = [
    [onClickShowCases, () => <FontAwesomeIcon icon={faBoxOpen} />],
    [onClickShowProducts, () => <FontAwesomeIcon icon={faPrescriptionBottle} />],
    [onClickShowMaterials, () => <FontAwesomeIcon icon={faPills} />],
  ];

  const itemButtons = [
    [onClickEdit, EditIcon],
    [onClickDelete, DeleteIcon],
  ];

  return (
    <Card className={classes.root}>
      <CardHeader title={title} />
      <CardContent>
        <Typography
          variant="body2"
          color="textSecondary"
          component="div"
        >
          {data.map((row) => (
            <div key={row.name}>
              <b>
                {row.name}
                :
              </b>
              {' '}
              {row.value}
            </div>
          ))}
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
      .shape({ name: PropTypes.string.isRequired, value: PropTypes.string.isRequired })),
  title: PropTypes.string.isRequired,
};

InventoryCard.defaultProps = {
  onClickDelete: null,
  onClickEdit: null,
  onClickShowMaterials: null,
  onClickShowProducts: null,
  onClickShowCases: null,
  data: [],
};
