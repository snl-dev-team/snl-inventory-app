import React from 'react';
import { useHistory, useParams } from 'react-router';
import { useQuery } from '@apollo/client';
import lodash from 'lodash';
import { GET_ORDER_CASES } from '../../../graphql/orders';
import InventoryCard from '../../InventoryCard';
import UseDialog from './UseDialog';

export default function OrderUseCaseDialog() {
  const { id } = useParams();
  const { push } = useHistory();
  const {
    data: {
      order: {
        cases: { edges = [] } = {
        },
      } = {},
    } = {}, loading,
  } = useQuery(GET_ORDER_CASES, { variables: { id } });

  return (
    <UseDialog
      loading={loading}
      onClickAdd={() => push(`/orders/${id}/cases/use`)}
      onClickCancel={() => push('/orders')}
      title="Order Cases"
    >
      {!loading ? edges.map(({ node, countUsed }) => (
        <InventoryCard
          data={Object.entries(node)
            .filter(([name]) => !['__typename', 'id', 'name'].includes(name))
            .concat([['countUsed', countUsed]])
            .map(([name, value]) => ({ name: lodash.startOrder(name), value: String(value) }))}
          title={node.name}
          onClickDelete={() => {}}
          onClickEdit={() => {}}
        />
      )) : []}
    </UseDialog>
  );
}
