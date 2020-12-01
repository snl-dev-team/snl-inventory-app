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
import FaceIcon from '@material-ui/icons/Face';

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
    marginTop: theme.spacing(0.75),
    marginBottom: theme.spacing(0.75),
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
  product,
  material,
  case_,
  order,
  useMaterial,
  useProduct,
  useCase,
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
          <CardContentSwitch
            data={data}
            product={product}
            material={material}
            case_={case_}
            order={order}
            useMaterial={useMaterial}
            useProduct={useProduct}
            useCase={useCase}
          />
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
  product: PropTypes.bool,
  material: PropTypes.bool,
  case_: PropTypes.bool,
  order: PropTypes.bool,
  useMaterial: PropTypes.bool,
  useProduct: PropTypes.bool,
  useCase: PropTypes.bool,
};

InventoryCard.defaultProps = {
  onClickDelete: null,
  onClickEdit: null,
  onClickShowMaterials: null,
  onClickShowProducts: null,
  onClickShowCases: null,
  data: [],
  product: false,
  material: false,
  case_: false,
  order: false,
  useMaterial: false,
  useProduct: false,
  useCase: false,
};

function CardContentSwitch({
  data,
  product,
  material,
  case_,
  order,
  useMaterial,
  useProduct,
  useCase,
}) {
  return (
    <div>
      {product && <ProductCardContent data={data} />}
      {material && <MaterialCardContent data={data} />}
      {case_ && <CaseCardContent data={data} />}
      {order && <OrderCardContent data={data} />}
      {useMaterial && <UseMaterialCardContent data={data} />}
      {useProduct && <UseProductCardContent data={data} />}
      {useCase && <UseCaseCardContent data={data} />}
    </div>
  );
}

CardContentSwitch.propTypes = {
  data: PropTypes
    .arrayOf(PropTypes
      .shape({ name: PropTypes.string.isRequired, value: PropTypes.string.isRequired })),
  product: PropTypes.bool,
  material: PropTypes.bool,
  case_: PropTypes.bool,
  order: PropTypes.bool,
  useMaterial: PropTypes.bool,
  useProduct: PropTypes.bool,
  useCase: PropTypes.bool,
};

CardContentSwitch.defaultProps = {
  data: [],
  product: false,
  material: false,
  case_: false,
  order: false,
  useMaterial: false,
  useProduct: false,
  useCase: false,
};

function ProductCardContent({ data }) {
  const classes = useStyles();
  return (
    <div>
      {data.filter((row) => ['Number', 'Default Material Count', 'Expiration Date'].includes(row.name)).map((row) => (
        <div key={row.name}>
          <b>
            {row.name === 'Number' ? 'Lot Number' : row.name}
            :
          </b>
          {' '}
          {row.value === 'null' ? 'None' : row.value}
        </div>
      ))}
      <Divider className={classes.divider} variant="middle" />
      {data.filter((row) => ['Date Modified', 'Date Created'].includes(row.name)).map((row) => (
        <div key={row.name}>
          <b>
            {row.name}
            :
          </b>
          {' '}
          {row.value}
        </div>
      ))}
      <Divider className={classes.divider} variant="middle" />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {data.filter((row) => ['Count'].includes(row.name)).map((row) => (
          <div key={row.name}>
            <Chip className={classes.chip} color="primary" label={`${row.name}: ${row.value}`} />
          </div>
        ))}
        {data.filter((row) => ['Completed'].includes(row.name)).map((row) => (
          <div key={row.name}>
            <Chip className={classes.chip} color="secondary" label={row.value === 'true' ? 'Completed' : 'In Progress'} icon={row.value === 'true' ? <CheckCircleIcon /> : <CachedIcon />} />
          </div>
        ))}
      </div>
    </div>
  );
}

ProductCardContent.propTypes = {
  data: PropTypes
    .arrayOf(PropTypes
      .shape({ name: PropTypes.string.isRequired, value: PropTypes.string.isRequired })),
};

ProductCardContent.defaultProps = {
  data: [],
};

// eslint-disable-next-line no-unused-vars
function MaterialCardContent({ data }) {
  const classes = useStyles();
  return (
    <div>
      {data.filter((row) => ['Number', 'Purchase Order Number', 'Price', 'Expiration Date'].includes(row.name)).map((row) => (
        <div key={row.name}>
          <b>
            {row.name === 'Number' ? 'Lot Number' : row.name}
            :
          </b>
          {' '}
          {row.value === 'null' ? 'None' : row.value}
        </div>
      ))}
      <Divider className={classes.divider} variant="middle" />
      {data.filter((row) => ['Purchase Order Url', 'Certificate Of Analysis Url'].includes(row.name)).map((row) => (
        <div key={row.name}>
          <b>
            {row.name}
            :
          </b>
          {' '}
          <a className={classes.link} href={row.value}>{row.value}</a>
        </div>
      ))}
      <Divider className={classes.divider} variant="middle" />
      {data.filter((row) => ['Date Modified', 'Date Created'].includes(row.name)).map((row) => (
        <div key={row.name}>
          <b>
            {row.name}
            :
          </b>
          {' '}
          {row.value}
        </div>
      ))}
      <Divider className={classes.divider} variant="middle" />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {data.filter((row) => ['Vendor Name'].includes(row.name)).map((row) => (
          <div key={row.name}>
            {
              row.value !== '' && (<Chip className={classes.chip} color="primary" label={row.value} icon={<FaceIcon />} />)
            }
          </div>
        ))}
        {data.filter((row) => ['Count'].includes(row.name)).map((row) => (
          <div key={row.name}>
            <Chip className={classes.chip} color="primary" label={`${row.name}: ${row.value}`} />
          </div>
        ))}
        {data.filter((row) => ['Units'].includes(row.name)).map((row) => (
          <div key={row.name}>
            <Chip className={classes.chip} color="secondary" label={row.value} />
          </div>
        ))}
      </div>
    </div>
  );
}

MaterialCardContent.propTypes = {
  data: PropTypes
    .arrayOf(PropTypes
      .shape({ name: PropTypes.string.isRequired, value: PropTypes.string.isRequired })),
};

MaterialCardContent.defaultProps = {
  data: [],
};

// eslint-disable-next-line no-unused-vars
function CaseCardContent({ data }) {
  const classes = useStyles();
  return (
    <div>
      {data.filter((row) => ['Number', 'Default Material Count', 'Default Product Count', 'Expiration Date'].includes(row.name)).map((row) => (
        <div key={row.name}>
          <b>
            {row.name === 'Number' ? 'Case ID Number' : row.name}
            :
          </b>
          {' '}
          {row.value === 'null' ? 'None' : row.value}
        </div>
      ))}
      <Divider className={classes.divider} variant="middle" />
      {data.filter((row) => ['Date Modified', 'Date Created'].includes(row.name)).map((row) => (
        <div key={row.name}>
          <b>
            {row.name}
            :
          </b>
          {' '}
          {row.value}
        </div>
      ))}
      <Divider className={classes.divider} variant="middle" />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {data.filter((row) => ['Count'].includes(row.name)).map((row) => (
          <div key={row.name}>
            <Chip className={classes.chip} color="primary" label={`${row.name}: ${row.value}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

CaseCardContent.propTypes = {
  data: PropTypes
    .arrayOf(PropTypes
      .shape({ name: PropTypes.string.isRequired, value: PropTypes.string.isRequired })),
};

CaseCardContent.defaultProps = {
  data: [],
};

// eslint-disable-next-line no-unused-vars
function OrderCardContent({ data }) {
  const classes = useStyles();
  return (
    <div>
      {data.filter((row) => ['Number', 'Default Case Count', 'Expiration Date'].includes(row.name)).map((row) => (
        <div key={row.name}>
          <b>
            {row.name === 'Number' ? 'Order Number' : row.name}
            :
          </b>
          {' '}
          {row.value === 'null' ? 'None' : row.value}
        </div>
      ))}
      <Divider className={classes.divider} variant="middle" />
      {data.filter((row) => ['Date Modified', 'Date Created'].includes(row.name)).map((row) => (
        <div key={row.name}>
          <b>
            {row.name}
            :
          </b>
          {' '}
          {row.value}
        </div>
      ))}
      <Divider className={classes.divider} variant="middle" />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {data.filter((row) => ['Customer Name'].includes(row.name)).map((row) => (
          <div key={row.name}>
            {row.value !== '' && (<Chip className={classes.chip} color="primary" label={row.value} icon={<FaceIcon />} />)}
          </div>
        ))}
        {data.filter((row) => ['Completed'].includes(row.name)).map((row) => (
          <div key={row.name}>
            <Chip className={classes.chip} color="secondary" label={row.value === 'true' ? 'Completed' : 'In Progress'} icon={row.value === 'true' ? <CheckCircleIcon /> : <CachedIcon />} />
          </div>
        ))}
      </div>
    </div>
  );
}

OrderCardContent.propTypes = {
  data: PropTypes
    .arrayOf(PropTypes
      .shape({ name: PropTypes.string.isRequired, value: PropTypes.string.isRequired })),
};

OrderCardContent.defaultProps = {
  data: [],
};

// eslint-disable-next-line no-unused-vars
function UseMaterialCardContent({ data }) {
  const classes = useStyles();

  const rename = (name) => {
    switch (name) {
      case 'Number':
        return 'Lot Number';
      case 'Count':
        return 'Total Count';
      default:
        return name;
    }
  };
  return (
    <div>
      {data.filter((row) => ['Number', 'Count', 'Purchase Order Number', 'Price', 'Expiration Date'].includes(row.name)).map((row) => (
        <div key={row.name}>
          <b>
            {rename(row.name)}
            :
          </b>
          {' '}
          {row.value === 'null' ? 'None' : row.value}
        </div>
      ))}
      <Divider className={classes.divider} variant="middle" />
      {data.filter((row) => ['Purchase Order Url', 'Certificate Of Analysis Url'].includes(row.name)).map((row) => (
        <div key={row.name}>
          <b>
            {row.name}
            :
          </b>
          {' '}
          <a className={classes.link} href={row.value}>{row.value}</a>
        </div>
      ))}
      <Divider className={classes.divider} variant="middle" />
      {data.filter((row) => ['Date Modified', 'Date Created'].includes(row.name)).map((row) => (
        <div key={row.name}>
          <b>
            {row.name}
            :
          </b>
          {' '}
          {row.value}
        </div>
      ))}
      <Divider className={classes.divider} variant="middle" />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {data.filter((row) => ['Vendor Name'].includes(row.name)).map((row) => (
          <div key={row.name}>
            <Chip className={classes.chip} color="primary" label={row.value} icon={<FaceIcon />} />
          </div>
        ))}
        {data.filter((row) => ['Count Used'].includes(row.name)).map((row) => (
          <div key={row.name}>
            <Chip className={classes.chip} color="primary" label={`${row.name}: ${row.value}`} />
          </div>
        ))}
        {data.filter((row) => ['Units'].includes(row.name)).map((row) => (
          <div key={row.name}>
            <Chip className={classes.chip} color="secondary" label={row.value} />
          </div>
        ))}
      </div>
    </div>
  );
}

UseMaterialCardContent.propTypes = {
  data: PropTypes
    .arrayOf(PropTypes
      .shape({ name: PropTypes.string.isRequired, value: PropTypes.string.isRequired })),
};

UseMaterialCardContent.defaultProps = {
  data: [],
};

// eslint-disable-next-line no-unused-vars
function UseProductCardContent({ data }) {
  const classes = useStyles();

  const rename = (name) => {
    switch (name) {
      case 'Number':
        return 'Lot Number';
      case 'Count':
        return 'Total Count';
      default:
        return name;
    }
  };

  return (
    <div>
      {data.filter((row) => ['Number', 'Count', 'Default Material Count', 'Expiration Date'].includes(row.name)).map((row) => (
        <div key={row.name}>
          <b>
            {rename(row.name)}
            :
          </b>
          {' '}
          {row.value === 'null' ? 'None' : row.value}
        </div>
      ))}
      <Divider className={classes.divider} variant="middle" />
      {data.filter((row) => ['Date Modified', 'Date Created'].includes(row.name)).map((row) => (
        <div key={row.name}>
          <b>
            {row.name}
            :
          </b>
          {' '}
          {row.value}
        </div>
      ))}
      <Divider className={classes.divider} variant="middle" />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {data.filter((row) => ['Count Used'].includes(row.name)).map((row) => (
          <div key={row.name}>
            <Chip className={classes.chip} color="primary" label={`${row.name}: ${row.value}`} />
          </div>
        ))}
        {data.filter((row) => ['Completed'].includes(row.name)).map((row) => (
          <div key={row.name}>
            <Chip className={classes.chip} color="secondary" label={row.value === 'true' ? 'Completed' : 'In Progress'} icon={row.value === 'true' ? <CheckCircleIcon /> : <CachedIcon />} />
          </div>
        ))}
      </div>
    </div>
  );
}

UseProductCardContent.propTypes = {
  data: PropTypes
    .arrayOf(PropTypes
      .shape({ name: PropTypes.string.isRequired, value: PropTypes.string.isRequired })),
};

UseProductCardContent.defaultProps = {
  data: [],
};

// eslint-disable-next-line no-unused-vars
function UseCaseCardContent({ data }) {
  const classes = useStyles();
  return (
    <div>
      {data.filter((row) => ['Number', 'Default Material Count', 'Default Product Count', 'Expiration Date'].includes(row.name)).map((row) => (
        <div key={row.name}>
          <b>
            {row.name === 'Number' ? 'Case ID Number' : row.name}
            :
          </b>
          {' '}
          {row.value === 'null' ? 'None' : row.value}
        </div>
      ))}
      <Divider className={classes.divider} variant="middle" />
      {data.filter((row) => ['Date Modified', 'Date Created'].includes(row.name)).map((row) => (
        <div key={row.name}>
          <b>
            {row.name}
            :
          </b>
          {' '}
          {row.value}
        </div>
      ))}
      <Divider className={classes.divider} variant="middle" />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {data.filter((row) => ['Order Count', 'Count Shipped'].includes(row.name)).map((row) => (
          <div key={row.name}>
            <Chip className={classes.chip} color="primary" label={`${row.name}: ${row.value}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

UseCaseCardContent.propTypes = {
  data: PropTypes
    .arrayOf(PropTypes
      .shape({ name: PropTypes.string.isRequired, value: PropTypes.string.isRequired })),
};

UseCaseCardContent.defaultProps = {
  data: [],
};
