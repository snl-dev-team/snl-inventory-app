import React from 'react';
import { useHistory, useParams } from 'react-router';
import { useQuery, useMutation } from '@apollo/client';
import {
  find, startCase, remove, findIndex,
} from 'lodash';
import produce from 'immer';
import { XGrid } from '@material-ui/x-grid';
import { GET_PRODUCT_MATERIALS, PRODUCT_UNUSE_MATERIAL } from '../../../graphql/products';
import InventoryCard from '../../InventoryCard';
import UseDialog from './UseDialog';
import { GET_MATERIALS } from '../../../graphql/materials';
import { PRODUCT_MATERIAL_COLUMNS } from '../../../constants/columns';

export default function ProductUseMaterialDialog() {
  const { id } = useParams();
  const { push } = useHistory();

  const {
    data: {
      product: {
        name,
        materials: {
          edges = [],
        } = {},
      } = {},
    } = {},
    loading,
  } = useQuery(GET_PRODUCT_MATERIALS, { variables: { id } });

  const [productUnuseMaterial] = useMutation(PRODUCT_UNUSE_MATERIAL);

  const updateCache = (client, materialId) => {
    const deleteRelation = () => {
      const clientData = client.readQuery({ query: GET_PRODUCT_MATERIALS, variables: { id } });

      const countUsed = find(clientData.product.materials.edges,
        (edge) => edge.node.id === materialId).count;

      const newData = produce(clientData, (draftState) => {
        remove(draftState.product.materials.edges,
          (edge) => edge.node.id === materialId);
      });

      client.writeQuery({ query: GET_PRODUCT_MATERIALS, data: newData });
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
    productUnuseMaterial({
      variables: { productId: id, materialId },
      update: (client) => updateCache(client, materialId),
    });
  };

  return (
    <UseDialog
      loading={loading}
      onClickAdd={() => push(`/products/${id}/materials/use`)}
      onClickCancel={() => push('/products/')}
      title={`Product Materials: ${name || ''}`}
    >
      {!loading ? edges.map(({ node, count }) => (
        <InventoryCard
          key={node.id}
          data={Object.entries(node)
            .filter(([name_]) => !['__typename', 'id', 'name'].includes(name_))
            .concat([['countUsed', count]])
            .map(([name_, value]) => ({ name: startCase(name_), value: String(value) }))}
          title={node.name}
          onClickDelete={() => onClickDelete(node.id)}
          useMaterial
        />
      )) : []}

      <div style={{
        height: 800, width: '100%', marginTop: 20, marginBottom: 50, padding: 10, paddingRight: 15,
      }}
      >
        <XGrid
          disableSelectionOnClick
          columns={PRODUCT_MATERIAL_COLUMNS}
          onRowClick={() => {}}
          rows={edges.map(({ node, count }) => ({ ...node, countUsed: count }))}
          rowHeight={38}
        />
      </div>
    </UseDialog>
  );
}
