import React from 'react';
import { useHistory, useParams } from 'react-router';
import { useQuery, useMutation } from '@apollo/client';
import lodash from 'lodash';
import produce from 'immer';
import { GET_PRODUCT_MATERIALS, PRODUCT_UNUSE_MATERIAL } from '../../../graphql/products';
import InventoryCard from '../../InventoryCard';
import UseDialog from './UseDialog';

export default function ProductUseMaterialDialog() {
  const { id } = useParams();
  const { push } = useHistory();
  const {
    data: {
      product: {
        materials: { edges = [] } = {
        },
      } = {},
    } = {}, loading,
  } = useQuery(GET_PRODUCT_MATERIALS, { variables: { id } });
  const [productUnuseMaterial] = useMutation(PRODUCT_UNUSE_MATERIAL);

  const onClickDelete = (materialId) => {
    productUnuseMaterial({
      variables: { productId: id, materialId },
      update: (client) => {
        const clientData = client.readQuery({
          query: GET_PRODUCT_MATERIALS,
          variables: { id },
        });
        const newData = produce(clientData, (draftState) => {
          const idx = draftState.product.materials.edges.findIndex(
            (edge) => edge.node.id === materialId,
          );
          draftState.product.materials.edges.splice(idx, 1);
        });
        client.writeQuery({
          query: GET_PRODUCT_MATERIALS,
          data: newData,
        });
      },
    });
  };

  return (
    <UseDialog
      loading={loading}
      onClickAdd={() => push(`/products/${id}/materials/use`)}
      onClickCancel={() => push('/products/')}
      title="Product Materials"
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
