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

const COLUMNS = [
  { field: 'id', hide: true },
  { field: 'number', headerName: 'Number' },
  { field: 'name', headerName: 'Name' },
  { field: 'count', headerName: 'Count' },
  { field: 'price', headerName: 'Price' },
  {
    field: 'expirationDate', headerName: 'Expiration Date', width: 150, type: 'date',
  },
  { field: 'units', headerName: 'Units' },
  { field: 'purchaseOrderNumber', headerName: 'PO Number', width: 150 },
  { field: 'purchaseOrderUrl', headerName: 'PO URL' },
  {
    field: 'dateModified', headerName: 'Date Modified', width: 200, type: 'dateTime',
  },
  {
    field: 'dateCreated', headerName: 'Date Created', width: 200, type: 'dateTime',
  },
];

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

  const searchFilter = ({ name }) => searchString === null
  || name.toLowerCase().includes(searchString);

  const nodes = edges.map(({ node }) => node).filter(searchFilter);

  const Cards = nodes.map((node) => (
    <InventoryCard
      key={node.id}
      data={Object.entries(node)
        .filter(([name]) => !['__typename', 'id', 'name'].includes(name))
        .map(([name, value]) => ({ name: startCase(name), value: String(value) }))}
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
              columns={COLUMNS}
              loading={loading}
              onRowClick={({ data: { id } }) => push(`materials/${id}/update`)}
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
