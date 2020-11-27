import React from 'react';
import { Route, useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';
import lodash from 'lodash';
import produce from 'immer';
import {
  GET_MATERIALS, DELETE_MATERIAL,
} from '../../graphql/materials';
import UpsertMaterialDialog from '../../components/upsert/UpsertMaterialDialog';
import InventoryCard from '../../components/InventoryCard';
import GenericDashboard from './Generic';

const MaterialsDashboard = ({ searchString }) => {
  const { push } = useHistory();

  const {
    data: { materials: { edges = [] } = {} } = {},
    loading,
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

  const searchFilter = ({ name }) => searchString === null
  || name.toLowerCase().includes(searchString);

  return (
    <>
      <GenericDashboard
        loading={loading}
        onClickAdd={() => push('/materials/create')}
      >
        {edges.map(({ node }) => node).filter(searchFilter).map((node) => (
          <InventoryCard
            key={node.id}
            data={Object.entries(node)
              .filter(([name]) => !['__typename', 'id', 'name'].includes(name))
              .map(([name, value]) => ({ name: lodash.startCase(name), value: String(value) }))}
            title={node.name}
            onClickEdit={() => push(`/materials/${node.id}/update`)}
            onClickDelete={() => deleteMaterial({
              variables: { id: node.id },
              update: updateCache(node.id),
            })}
          />
        ))}
      </GenericDashboard>

      <Route
        exact
        path={['/materials/create', '/materials/:id/update']}
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
