import { gql } from '@apollo/client';

const ORDER_FRAGMENT = gql`
  fragment Order on Order {
    id
    dateCreated
    dateModified
    completed
    notes
    number
    defaultCaseCount
    customerName
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
  mutation CreateOrder($completed: Boolean!, $notes: String!, $number: String!, $defaultCaseCount: Integer!, $customerName: String!) {
    createOrder(
      order: {completed: $completed, notes: $notes, number: $number, defaultCaseCount: $defaultCaseCount, customerName: $customerName}
    ) {
      order {
        ...Order
      }
    }
  }
  ${ORDER_FRAGMENT}
`;

const UPDATE_ORDER = gql`
  mutation UpdateOrder($id: ID!, $completed: Boolean!, $notes: String!, $number: String!, $defaultCaseCount: Integer!, $customerName: String!) {
    updateOrder(
      id: $id
      order: {completed: $completed, notes: $notes, number: $number, defaultCaseCount: $defaultCaseCount, customerName: $customerName}
    ) {
      order {
        ...Order
      }
    }
  }
  ${ORDER_FRAGMENT}
`;

const DELETE_ORDER = gql`
  mutation DeleteOrder($id: ID!) {
    deleteOrder(id: $id) {
      id
    }
  }
`;

export {
  GET_ORDERS, UPDATE_ORDER, CREATE_ORDER, DELETE_ORDER,
};
