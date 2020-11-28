import { gql } from '@apollo/client';
import { CASE_FRAGMENT } from './cases';

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

const GET_ORDER_CASES = gql`
  query GetOrderCases($id: ID!) {
    order(id: $id) {
      id
      number
      cases {
        edges {
          countShipped
          countNotShipped
          node {
            ...Case
          }
        }
      }
    }
  }
  ${CASE_FRAGMENT}
`;

const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      ...Order
    }
  }
  ${ORDER_FRAGMENT}
`;

const ORDER_SHIP_CASE = gql`
  mutation OrderShipCase($orderId: ID!, $caseId: ID!, $countNotShipped: Integer!, $countShipped: Integer!) {
    orderShipCase(orderId: $orderId, caseId: $caseId, countNotShipped: $countNotShipped, countShipped: $countShipped) {
      countNotShipped
      countShipped
      case {
        ...Case
      }
    }
  }
  ${CASE_FRAGMENT}
`;

const ORDER_UNSHIP_CASE = gql`
  mutation OrderUnshipCase($orderId: ID!, $caseId: ID!) {
    orderUnshipCase(orderId: $orderId, caseId: $caseId) {
      caseId
    }
  }
`;

export {
  GET_ORDERS,
  UPDATE_ORDER,
  CREATE_ORDER,
  DELETE_ORDER,
  GET_ORDER_CASES,
  GET_ORDER,
  ORDER_SHIP_CASE,
  ORDER_UNSHIP_CASE,
};
