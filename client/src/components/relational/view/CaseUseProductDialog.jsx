import React from 'react';
import { useHistory, useParams } from 'react-router';
import { useQuery, useMutation } from '@apollo/client';
import lodash from 'lodash';
import produce from 'immer';
import { GET_CASE_PRODUCTS, CASE_UNUSE_PRODUCT } from '../../../graphql/cases';
import InventoryCard from '../../InventoryCard';
import UseDialog from './UseDialog';

export default function CaseUseProductDialog() {
  const { id } = useParams();
  const { push } = useHistory();
  const {
    data: {
      case: {
        products: { edges = [] } = {
        },
      } = {},
    } = {}, loading,
  } = useQuery(GET_CASE_PRODUCTS, { variables: { id } });
  const [caseUnuseProduct] = useMutation(CASE_UNUSE_PRODUCT);

  const onClickDelete = (productId) => {
    caseUnuseProduct({
      variables: { caseId: id, productId },
      update: (client) => {
        const clientData = client.readQuery({
          query: GET_CASE_PRODUCTS,
          variables: { id },
        });
        const newData = produce(clientData, (draftState) => {
          const idx = draftState.case.products.edges.findIndex(
            (edge) => edge.node.id === productId,
          );
          draftState.case.products.edges.splice(idx, 1);
        });
        client.writeQuery({
          query: GET_CASE_PRODUCTS,
          data: newData,
        });
      },
    });
  };

  return (
    <UseDialog
      loading={loading}
      onClickAdd={() => push(`/cases/${id}/products/use`)}
      onClickCancel={() => push('/cases/')}
      title="Case Products"
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
