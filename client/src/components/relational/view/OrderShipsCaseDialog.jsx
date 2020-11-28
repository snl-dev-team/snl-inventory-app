import React from 'react';
import { useHistory, useParams } from 'react-router';
import { useQuery } from '@apollo/client';
import { startCase } from 'lodash';
import { GET_ORDER_CASES } from '../../../graphql/orders';
import InventoryCard from '../../InventoryCard';
import UseDialog from './UseDialog';

export default function OrderShipsCaseDialog() {
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
      {!loading ? edges.map(({ node, countShipped, countNotShipped }) => (
        <InventoryCard
          key={node.id}
          data={Object.entries(node)
            .filter(([name]) => !['__typename', 'id', 'name'].includes(name))
            .concat([['countNotShipped', countNotShipped], ['countShipped', countShipped]])
            .map(([name, value]) => ({ name: startCase(name), value: String(value) }))}
          title={node.name}
          onClickDelete={() => {}}
        />
      )) : []}
    </UseDialog>
  );
}
