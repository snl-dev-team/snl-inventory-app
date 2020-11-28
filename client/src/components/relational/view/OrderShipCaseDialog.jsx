import React from 'react';
import { useHistory, useParams } from 'react-router';
import { useQuery, useMutation } from '@apollo/client';
import { startCase } from 'lodash';
import produce from 'immer';
import { GET_ORDER_CASES, ORDER_UNSHIP_CASE } from '../../../graphql/orders';
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
  const [orderUnuseCase] = useMutation(ORDER_UNSHIP_CASE);

  const onClickDelete = (caseId) => {
    orderUnuseCase({
      variables: { orderId: id, caseId },
      update: (client) => {
        const clientData = client.readQuery({
          query: GET_ORDER_CASES,
          variables: { id },
        });
        const newData = produce(clientData, (draftState) => {
          const idx = draftState.order.cases.edges.findIndex(
            (edge) => edge.node.id === caseId,
          );
          draftState.order.cases.edges.splice(idx, 1);
        });
        client.writeQuery({
          query: GET_ORDER_CASES,
          data: newData,
        });
      },
    });
  };

  return (
    <UseDialog
      loading={loading}
      onClickAdd={() => push(`/orders/${id}/cases/use`)}
      onClickCancel={() => push('/orders/')}
      title="Order Cases"
    >
      {!loading ? edges.map(({ node, countNotShipped, countShipped }) => (
        <InventoryCard
          key={node.id}
          data={Object.entries(node)
            .filter(([name]) => !['__typename', 'id', 'name'].includes(name))
            .concat([['countNotShipped', countNotShipped], ['countShipped', countShipped]])
            .map(([name, value]) => ({ name: startCase(name), value: String(value) }))}
          title={node.name}
          onClickDelete={() => onClickDelete(node.id)}
        />
      )) : []}
    </UseDialog>
  );
}
