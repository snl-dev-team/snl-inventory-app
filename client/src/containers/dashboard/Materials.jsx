import React from 'react';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Route, useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';
import lodash from 'lodash';
import produce from 'immer';
import {
  GET_MATERIALS, DELETE_MATERIAL,
} from '../../graphql/materials';
import UpsertMaterialDialog from '../../components/UpsertMaterialDialog';
import InventoryCard from '../../components/InventoryCard';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const MaterialsDashboard = ({ searchString }) => {
  const classes = useStyles();
  const history = useHistory();

  const {
    loading, error, data,
  } = useQuery(GET_MATERIALS);

  const [deleteMaterial] = useMutation(DELETE_MATERIAL);

  const updateCache = (id) => (client) => {
    const clientData = client.readQuery({
      query: GET_MATERIALS,
    });

    const newData = produce(clientData, (draftState) => {
      const idx = draftState.materials.edges
        .findIndex(({ node }) => node.id === id);
      draftState.materials.edges.splice(idx, 1);
    });

    client.writeQuery({
      query: GET_MATERIALS,
      data: newData,
    });
  };

  if (loading || error) {
    return <CircularProgress />;
  }

  const materials = data.materials.edges
    .map((edge) => edge.node)
    .filter(({ name }) => searchString === null || name.toLowerCase().includes(searchString))
    .map((node) => node);

  const getQueryString = (object) => Object.keys(object)
    .map((key) => `${key}=${object[key]}`)
    .join('&');

  return (
    <>
      <Grid container spacing={3}>
        {materials.map((material) => (
          <Grid key={material.id}>
            <InventoryCard
              data={Object.entries(material)
                .filter(([name]) => !['__typename', 'id', 'name'].includes(name))
                .map(([name, value]) => ({ name: lodash.startCase(name), value: String(value) }))}
              title={material.name}
              onClickEdit={() => history.push(`/materials/update?${getQueryString(material)}`)}
              onClickDelete={() => deleteMaterial({
                variables: { id: material.id },
                update: updateCache(material.id),
              })}
            />
          </Grid>
        ))}
      </Grid>

      <Fab
        size="medium"
        color="secondary"
        aria-label="add"
        className={classes.margin}
        onClick={() => history.push('/materials/create')}
      >
        <AddIcon />
      </Fab>

      <Route
        exact
        path={['/materials/create', '/materials/update']}
        component={UpsertMaterialDialog}
      />

    </>
  );
};

export default MaterialsDashboard;

MaterialsDashboard.propTypes = {
  searchString: PropTypes.string,
};

MaterialsDashboard.defaultProps = {
  searchString: null,
};
