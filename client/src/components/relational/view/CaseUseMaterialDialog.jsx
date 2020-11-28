import React from 'react';
import { useHistory, useParams } from 'react-router';
import { useQuery } from '@apollo/client';
import lodash from 'lodash';
import { GET_CASE_MATERIALS } from '../../../graphql/cases';
import InventoryCard from '../../InventoryCard';
import UseDialog from './UseDialog';

export default function CaseUseMaterialDialog() {
  const { id } = useParams();
  const { push } = useHistory();
  const {
    data: {
      case: {
        materials: { edges = [] } = {
        },
      } = {},
    } = {}, loading,
  } = useQuery(GET_CASE_MATERIALS, { variables: { id } });

  return (
    <UseDialog
      loading={loading}
      onClickAdd={() => push(`/cases/${id}/materials/use`)}
      onClickCancel={() => push('/cases')}
      title="Case Materials"
    >
      {!loading ? edges.map(({ node, countUsed }) => (
        <InventoryCard
          key={node.id}
          data={Object.entries(node)
            .filter(([name]) => !['__typename', 'id', 'name'].includes(name))
            .concat([['countUsed', countUsed]])
            .map(([name, value]) => ({ name: lodash.startCase(name), value: String(value) }))}
          title={node.name}
          onClickDelete={() => {}}
          onClickEdit={() => {}}
        />
      )) : []}
    </UseDialog>
  );
}
