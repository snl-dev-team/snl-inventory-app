import React from 'react';
import { useHistory, useParams } from 'react-router';
import { useQuery, useMutation } from '@apollo/client';
import {
  startCase,
  find,
  remove,
  findIndex,
} from 'lodash';
import produce from 'immer';
import { GET_ORDER_CASES, ORDER_UNUSE_CASE } from '../../../graphql/orders';
import InventoryCard from '../../InventoryCard';
import UseDialog from './UseDialog';
import { GET_CASES } from '../../../graphql/cases';

export default function OrderUseCaseDialog() {
  const { id } = useParams();
  const { push } = useHistory();
  const {
    data: {
      order: {
        number,
        cases: {
          edges = [],
        } = {},
      } = {},
    } = {},
    loading,
  } = useQuery(GET_ORDER_CASES, { variables: { id } });
  const [orderUnuseCase] = useMutation(ORDER_UNUSE_CASE);

  const updateCache = (client, caseId) => {
    const deleteRelation = () => {
      const clientData = client.readQuery({ query: GET_ORDER_CASES, variables: { id } });

      const countUsed = find(clientData.order.cases.edges,
        (edge) => edge.node.id === caseId).count;

      const newData = produce(clientData, (draftState) => {
        remove(draftState.order.cases.edges,
          (edge) => edge.node.id === caseId);
      });

      client.writeQuery({ query: GET_ORDER_CASES, data: newData });
      return countUsed;
    };

    const updateCaseCount = (countUsed) => {
      const clientData = client.readQuery({ query: GET_CASES, variables: { id } });
      const newData = produce(clientData, (draftState) => {
        const idx = findIndex(draftState.cases.edges, { node: { id: caseId } });
        // eslint-disable-next-line no-param-reassign
        draftState.cases.edges[idx].node.count += countUsed;
      });

      client.writeQuery({ query: GET_CASES, variables: { id }, data: newData });
    };

    const countUsed = deleteRelation();
    updateCaseCount(countUsed);
  };

  const onClickDelete = (caseId) => {
    orderUnuseCase({
      variables: { orderId: id, caseId },
      update: (client) => updateCache(client, caseId),
    });
  };

  return (
    <UseDialog
      loading={loading}
      onClickAdd={() => push(`/orders/${id}/cases/use`)}
      onClickCancel={() => push('/orders/')}
      title={`Order Cases: ${number || ''}`}
    >
      {!loading ? edges.map(({ node, count, orderCount }) => (
        <InventoryCard
          key={node.id}
          data={Object.entries(node)
            .filter(([name_]) => !['__typename', 'id', 'name'].includes(name_))
            .concat([['countShipped', count], ['orderCount', orderCount]])
            .map(([name_, value]) => ({ name: startCase(name_), value: String(value) }))}
          title={node.name}
          onClickDelete={() => onClickDelete(node.id)}
          useCase
        />
      )) : []}
    </UseDialog>
  );
}
