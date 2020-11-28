import React from 'react';
import { useHistory, useParams } from 'react-router';
import { useQuery, useMutation } from '@apollo/client';
import lodash from 'lodash';
import produce from 'immer';
import { GET_CASE_MATERIALS, CASE_UNUSE_MATERIAL } from '../../../graphql/cases';
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
  const [caseUnuseMaterial] = useMutation(CASE_UNUSE_MATERIAL);

  const onClickDelete = (materialId) => {
    caseUnuseMaterial({
      variables: { caseId: id, materialId },
      update: (client) => {
        const clientData = client.readQuery({
          query: GET_CASE_MATERIALS,
          variables: { id },
        });
        const newData = produce(clientData, (draftState) => {
          const idx = draftState.case.materials.edges.findIndex(
            (edge) => edge.node.id === materialId,
          );
          draftState.case.materials.edges.splice(idx, 1);
        });
        client.writeQuery({
          query: GET_CASE_MATERIALS,
          data: newData,
        });
      },
    });
  };

  return (
    <UseDialog
      loading={loading}
      onClickAdd={() => push(`/cases/${id}/materials/use`)}
      onClickCancel={() => push('/cases/')}
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
          onClickDelete={() => onClickDelete(node.id)}
        />
      )) : []}
    </UseDialog>
  );
}
