import React from 'react';
import { useHistory, useParams } from 'react-router';
import { useQuery, useMutation } from '@apollo/client';
import {
  find,
  startCase,
  findIndex,
  remove,
} from 'lodash';
import produce from 'immer';
import Chip from '@material-ui/core/Chip';
import { XGrid } from '@material-ui/x-grid';
import { GET_CASE_MATERIALS, CASE_UNUSE_MATERIAL } from '../../../graphql/cases';
import { GET_MATERIALS } from '../../../graphql/materials';
import InventoryCard from '../../InventoryCard';
import UseDialog from './UseDialog';
import { CASE_MATERIAL_COLUMNS } from '../../../constants/columns';

export default function CaseUseMaterialDialog() {
  const { id } = useParams();
  const { push } = useHistory();
  const {
    data: {
      case: {
        name,
        materials: {
          edges = [],
        } = {},
      } = {},
    } = {},
    loading,
  } = useQuery(GET_CASE_MATERIALS, { variables: { id } });

  const [caseUnuseMaterial] = useMutation(CASE_UNUSE_MATERIAL);

  const updateCache = (client, materialId) => {
    const deleteRelation = () => {
      const clientData = client.readQuery({ query: GET_CASE_MATERIALS, variables: { id } });

      const countUsed = find(clientData.case.materials.edges,
        (edge) => edge.node.id === materialId).count;

      const newData = produce(clientData, (draftState) => {
        remove(draftState.case.materials.edges,
          (edge) => edge.node.id === materialId);
      });

      client.writeQuery({ query: GET_CASE_MATERIALS, data: newData });
      return countUsed;
    };

    const updateMaterialCount = (countUsed) => {
      const clientData = client.readQuery({ query: GET_MATERIALS, variables: { id } });
      const newData = produce(clientData, (draftState) => {
        const idx = findIndex(draftState.materials.edges, { node: { id: materialId } });
        // eslint-disable-next-line no-param-reassign
        draftState.materials.edges[idx].node.count += countUsed;
      });

      client.writeQuery({ query: GET_MATERIALS, variables: { id }, data: newData });
    };

    const countUsed = deleteRelation();
    updateMaterialCount(countUsed);
  };

  const onClickDelete = (materialId) => {
    caseUnuseMaterial({
      variables: { caseId: id, materialId },
      update: (client) => updateCache(client, materialId),
    });
  };

  const getCardData = (node) => [
    Object.entries(node)
      .filter(([name_]) => ['price', 'expirationDate', 'number', 'countUsed'].includes(name_))
      .map(([name_, value]) => ({ name: startCase(name_), value })),
    Object.entries(node)
      .filter(([name_]) => ['purchaseOrderNumber', 'purchaseOrderUrl', 'certificateOfAnalysisUrl'].includes(name_))
      .map(([name_, value]) => ({ name: startCase(name_), value })),
    Object.entries(node)
      .filter(([name_]) => ['dateCreated', 'dateModified'].includes(name_))
      .map(([name_, value]) => ({ name: startCase(name_), value })),
  ];

  const getChipData = (node) => ({
    businessName: node.vendorName,
    count: node.count,
    units: node.units,
    value: node.price * node.countUsed,
  });
  /* const getTotalValue = (node) => ({
    value = value + node.countUsed * node.price}); */
  const nodes = edges.map(({ node, count }) => ({ ...node, countUsed: count }));

  return (
    <UseDialog
      loading={loading}
      onClickAdd={() => push(`/cases/${id}/materials/use`)}
      onClickCancel={() => push('/cases/')}
      title={`Case Materials: ${name || ''}`}
    >

      {!loading ? nodes.map((node) => (
        <InventoryCard
          key={node.id}
          data={getCardData(node)}
          chips={getChipData(node)}
          title={node.name}
          onClickDelete={() => onClickDelete(node.id)}
          onClickEdit={() => push(`/cases/${id}/materials/${node.id}/use`)}
        />
      )) : []}

      <div style={{
        height: 800, width: '100%', marginTop: 20, marginBottom: 50, padding: 10, paddingRight: 15,
      }}
      >
        <XGrid
          disableSelectionOnClick
          columns={CASE_MATERIAL_COLUMNS}
          onRowClick={() => {}}
          rows={edges.map(({ node, count }) => ({ ...node, countUsed: count }))}
          rowHeight={38}
        />
        <Chip />
      </div>
    </UseDialog>
  );
}
