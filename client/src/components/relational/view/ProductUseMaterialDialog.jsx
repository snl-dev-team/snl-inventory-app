import React from 'react';
import { useHistory, useParams } from 'react-router';
import { useQuery } from '@apollo/client';
import lodash from 'lodash';
import { GET_PRODUCT_MATERIALS } from '../../../graphql/products';
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

  return (
    <UseDialog
      loading={loading}
      onClickAdd={() => push(`/products/${id}/materials/use`)}
      onClickCancel={() => push('/products/')}
      title="Product Materials"
    >
      {!loading ? edges.map(({ node, countUsed }) => (
        <InventoryCard
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
