import React from 'react';
import { Route, useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';
import lodash from 'lodash';
import produce from 'immer';
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

const CasesDashboard = ({ searchString }) => {
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

  return (
    <>
      <GenericDashboard
        loading={loading}
        error={error}
        onClickAdd={() => push('/cases/create')}
      >
        {edges.map(({ node }) => node).filter(searchFilter).map((node) => (
          <InventoryCard
            key={node.id}
            data={Object.entries(node)
              .filter(([name]) => !['__typename', 'id', 'name'].includes(name))
              .map(([name, value]) => ({ name: lodash.startCase(name), value: String(value) }))}
            title={node.name}
            onClickShowMaterials={() => push(`/cases/${node.id}/materials`)}
            onClickShowProducts={() => push(`/cases/${node.id}/products`)}
            onClickEdit={() => push(`/cases/${node.id}/update/`)}
            onClickDelete={() => deleteCase({
              variables: { id: node.id },
              update: updateCache(node.id),
            })}
          />
        ))}
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
        path="/cases/:id/products/use"
        component={UpsertCaseUseProductDialog}
      />

      <Route
        exact
        path="/cases/:id/materials/use"
        component={UpsertCaseUseMaterialDialog}
      />
    </>
  );
};

export default CasesDashboard;

CasesDashboard.propTypes = {
  searchString: PropTypes.string,
};

CasesDashboard.defaultProps = {
  searchString: null,
};
