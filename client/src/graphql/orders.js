import { gql } from '@apollo/client';

const ORDER_FRAGMENT = gql`
  fragment Order on Order {
    id
    dateCreated
    dateModified
    completed
    notes
    number
  }
`;

const GET_ORDERS = gql`
  query GetOrders {
    orders {
      edges {
        node {
          ...Order
        }
      }
    }
  }
  ${ORDER_FRAGMENT}
`;

const CREATE_ORDER = gql`
  mutation CreateOrder($completed: Boolean!, $notes: String!, $number: String!) {
    createOrder(
      order: {completed: $completed, notes: $notes, number:$number}
    ) {
      order {
        ...Order
      }
    }
  }
  ${ORDER_FRAGMENT}
`;

const UPDATE_ORDER = gql`
  mutation UpdateOrder($id: Identifier!, $completed: Boolean!, $notes: String!, $number: String!) {
    updateOrder(
      id: $id
      order: {completed: $completed, notes: $notes, number: $number}
    ) {
      order {
        ...Order
      }
    }
  }
  ${ORDER_FRAGMENT}
`;

const DELETE_ORDER = gql`
  mutation DeleteOrder($id: Identifier!) {
    deleteOrder(id: $id) {
      id
    }
  }
`;

export {
  GET_ORDERS, UPDATE_ORDER, CREATE_ORDER, DELETE_ORDER,
};
