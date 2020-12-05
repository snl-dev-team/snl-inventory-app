import React from 'react';
import { useHistory, useParams } from 'react-router';
import { useQuery, useMutation } from '@apollo/client';
import {
  find, startCase, findIndex, remove,
} from 'lodash';
import produce from 'immer';
import { XGrid } from '@material-ui/x-grid';
import { GET_CASE_PRODUCTS, CASE_UNUSE_PRODUCT } from '../../../graphql/cases';
import { GET_PRODUCTS } from '../../../graphql/products';
import InventoryCard from '../../InventoryCard';
import UseDialog from './UseDialog';
import { CASE_PRODUCT_COLUMNS } from '../../../constants/columns';

export default function CaseUseProductDialog() {
  const { id } = useParams();
  const { push } = useHistory();
  const {
    data: {
      case: {
        name,
        products: {
          edges = [],
        } = {},
      } = {},
    } = {},
    loading,
  } = useQuery(GET_CASE_PRODUCTS, { variables: { id } });
  const [caseUnuseProduct] = useMutation(CASE_UNUSE_PRODUCT);

  const updateCache = (client, productId) => {
    const deleteRelation = () => {
      const clientData = client.readQuery({ query: GET_CASE_PRODUCTS, variables: { id } });

      const countUsed = find(clientData.case.products.edges,
        (edge) => edge.node.id === productId).count;

      const newData = produce(clientData, (draftState) => {
        remove(draftState.case.products.edges,
          (edge) => edge.node.id === productId);
      });

      client.writeQuery({ query: GET_CASE_PRODUCTS, data: newData });
      return countUsed;
    };

    const updateProductCount = (countUsed) => {
      const clientData = client.readQuery({ query: GET_PRODUCTS, variables: { id } });
      const newData = produce(clientData, (draftState) => {
        const idx = findIndex(draftState.products.edges, { node: { id: productId } });
        // eslint-disable-next-line no-param-reassign
        draftState.products.edges[idx].node.count += countUsed;
      });

      client.writeQuery({ query: GET_PRODUCTS, variables: { id }, data: newData });
    };

    const countUsed = deleteRelation();
    updateProductCount(countUsed);
  };

  const onClickDelete = (productId) => {
    caseUnuseProduct({
      variables: { caseId: id, productId },
      update: (client) => updateCache(client, productId),
    });
  };

  return (
    <UseDialog
      loading={loading}
      onClickAdd={() => push(`/cases/${id}/products/use`)}
      onClickCancel={() => push('/cases/')}
      title={`Case Products: ${name || ''}`}
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
          useProduct
        />
      )) : []}

      <div style={{
        height: 800, width: '100%', marginTop: 20, marginBottom: 50, padding: 10, paddingRight: 15,
      }}
      >
        <XGrid
          disableSelectionOnClick
          columns={CASE_PRODUCT_COLUMNS}
          onRowClick={() => {}}
          rows={edges.map(({ node, count }) => ({ ...node, countUsed: count }))}
          rowHeight={38}
        />
      </div>
    </UseDialog>
  );
}
