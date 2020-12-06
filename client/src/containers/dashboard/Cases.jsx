import React from 'react';
import { Route, useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';
import { map, startCase } from 'lodash';
import produce from 'immer';
import { XGrid } from '@material-ui/x-grid';
import {
  GET_CASES, DELETE_CASE,
} from '../../graphql/cases';
import UpsertCaseDialog from '../../components/upsert/UpsertCaseDialog';
import InventoryCard from '../../components/InventoryCard';
import CaseUseProductDialog from '../../components/relational/view/CaseUseProductDialog';
import GenericDashboard from './Generic';
import CaseUseMaterialDialog from '../../components/relational/view/CaseUseMaterialDialog';
import UpsertCaseUseMaterialDialog from '../../components/relational/upsert/UpsertCaseUseMaterialDialog';
import UpsertCaseUseProductDialog from '../../components/relational/upsert/UpsertCaseUseProductDialog';
import VIEW_MODES from '../../constants/viewModes';
import { CASE_COLUMNS } from '../../constants/columns';

const CasesDashboard = ({ searchString, viewMode }) => {
  const { push } = useHistory();

  const {
    data: { cases: { edges = [] } = {} } = {},
    loading, error,
  } = useQuery(GET_CASES);
  const [deleteCase] = useMutation(DELETE_CASE);
  const updateCache = (id) => (client) => {
    const clientData = client.readQuery({
      query: GET_CASES,
    });
    const newData = produce(clientData, (draftState) => {
      const idx = draftState.cases.edges
        .findIndex(({ node }) => node.id === id);
      draftState.cases.edges.splice(idx, 1);
    });
    client.writeQuery({
      query: GET_CASES,
      data: newData,
    });
  };

  const searchFilter = ({ name }) => searchString === null
  || name.toLowerCase().includes(searchString);

  const nodes = edges.map(({ node }) => node).filter(searchFilter);

  const getCardData = (node) => [Object.entries(node)
    .filter(([name]) => ['defaultMaterialCount', 'expirationDate', 'number', 'defaultProductCount'].includes(name))
    .map(([name, value]) => ({ name: startCase(name), value })),
  Object.entries(node)
    .filter(([name]) => ['dateCreated', 'dateModified'].includes(name))
    .map(([name, value]) => ({ name: startCase(name), value })),
  ];

  const getChipData = (node) => ({
    count: node.count,
  });

  return (
    <>
      <GenericDashboard
        loading={loading}
        error={error}
        onClickAdd={() => push('/cases/create')}
      >
        {viewMode === VIEW_MODES.CARDS
        && nodes.map((node) => (
          <InventoryCard
            key={node.id}
            data={getCardData(node)}
            chips={getChipData(node)}
            title={node.name}
            onClickShowMaterials={() => push(`/cases/${node.id}/materials`)}
            onClickShowProducts={() => push(`/cases/${node.id}/products`)}
            onClickEdit={() => push(`/cases/${node.id}/update/`)}
            onClickDelete={() => deleteCase({
              variables: { id: node.id },
              update: updateCache(node.id),
            })}
            case_
          />
        ))}
        {viewMode === VIEW_MODES.GRID && (
        <div style={{ height: 800, width: '100%', marginTop: 20 }}>
          <XGrid
              // eslint-disable-next-line react/jsx-props-no-spreading
            columns={CASE_COLUMNS}
            loading={loading}
            onRowClick={({ data: { id } }) => push(`/cases/${id}/update`)}
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
        path={['/cases/create', '/cases/:id/update']}
        component={UpsertCaseDialog}
      />

      <Route
        path="/cases/:id/products"
        component={CaseUseProductDialog}
      />

      <Route
        path="/cases/:id/materials"
        component={CaseUseMaterialDialog}
      />

      <Route
        exact
        path={['/cases/:id/products/use', '/cases/:id/products/:productId/use']}
        component={UpsertCaseUseProductDialog}
      />

      <Route
        exact
        path={['/cases/:id/materials/use', '/cases/:id/materials/:materialId/use']}
        component={UpsertCaseUseMaterialDialog}
      />
    </>
  );
};

export default CasesDashboard;

CasesDashboard.propTypes = {
  searchString: PropTypes.string,
  viewMode: PropTypes.oneOf(Object.values(VIEW_MODES)).isRequired,
};

CasesDashboard.defaultProps = {
  searchString: null,
};
