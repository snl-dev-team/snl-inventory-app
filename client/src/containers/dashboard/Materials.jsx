import React from 'react';
import { Route, useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';
import { startCase, map } from 'lodash';
import produce from 'immer';
import { XGrid } from '@material-ui/x-grid';
import {
  GET_MATERIALS, DELETE_MATERIAL,
} from '../../graphql/materials';
import UpsertMaterialDialog from '../../components/upsert/UpsertMaterialDialog';
import InventoryCard from '../../components/InventoryCard';
import GenericDashboard from './Generic';
import VIEW_MODES from '../../constants/viewModes';
import { MATERIAL_COLUMNS } from '../../constants/columns';

const MaterialsDashboard = ({ searchString, viewMode }) => {
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

  const searchFilter = ({ name, number }) => searchString === null
  || name.toLowerCase().includes(searchString)
  || number.toLowerCase().includes(searchString);

  const nodes = edges.map(({ node }) => node).filter(searchFilter);

  const getCardData = (node) => [
    Object.entries(node)
      .filter(([name]) => ['expirationDate', 'number'].includes(name))
      .map(([name, value]) => ({ name: startCase(name), value })),
    Object.entries(node)
      .filter(([name]) => ['purchaseOrderNumber', 'purchaseOrderUrl', 'certificateOfAnalysisUrl'].includes(name))
      .map(([name, value]) => ({ name: startCase(name), value })),
    Object.entries(node)
      .filter(([name]) => ['dateCreated', 'dateModified'].includes(name))
      .map(([name, value]) => ({ name: startCase(name), value })),
  ];

  const getChipData = (node) => ({
    businessName: node.vendorName,
    count: node.count,
    units: node.units,
    price: node.price,
  });

  const Cards = nodes.map((node) => (
    <InventoryCard
      key={node.id}
      data={getCardData(node)}
      chips={getChipData(node)}
      title={node.name}
      onClickEdit={() => push(`/materials/${node.id}/update`)}
      onClickDelete={() => deleteMaterial({
        variables: { id: node.id },
        update: updateCache(node.id),
      })}
    />
  ));

  return (
    <>
      <GenericDashboard
        loading={loading}
        onClickAdd={() => push('/materials/create')}
      >
        {viewMode === VIEW_MODES.CARDS && Cards}

        {viewMode === VIEW_MODES.GRID && (
          <div style={{ height: 800, width: '100%', marginTop: 20 }}>
            <XGrid
              // eslint-disable-next-line react/jsx-props-no-spreading
              columns={MATERIAL_COLUMNS}
              loading={loading}
              onRowClick={({ data: { id } }) => push(`/materials/${id}/update`)}
              rows={map(nodes, (node) => ({
                ...node,
                dateCreated: new Date(node.dateCreated),
                dateModified: new Date(node.dateModified),
                expirationDate: node.expirationDate ? new Date(node.expirationDate) : null,
              }))}
              rowHeight={38}
            />
          </div>
        )}
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
  viewMode: PropTypes.oneOf(Object.values(VIEW_MODES)).isRequired,
};

MaterialsDashboard.defaultProps = {
  searchString: null,
};
