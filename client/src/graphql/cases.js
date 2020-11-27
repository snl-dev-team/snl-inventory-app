import { gql } from '@apollo/client';

const CASE_FRAGMENT = gql`
  fragment Case on Case {
    id
    number
    notes
    dateCreated
    dateModified
    expirationDate
    name
    count
    productName
    productCount
    shipped
  }
`;

const GET_CASES = gql`
  query GetCases {
    cases {
      edges {
        node {
          ...Case
        }
      }
    }
  }
  ${CASE_FRAGMENT}
`;

const CREATE_CASE = gql`
  mutation CreateCase($name: String!, $productName: String!, $productCount: Integer!, $count: Integer!, $number: String!, $expirationDate: Date, $shipped: Boolean!, $notes: String!) {
    createCase(
      case: {name: $name, productName: $productName, productCount: $productCount, count: $count, number: $number, expirationDate: $expirationDate, shipped: $shipped, notes: $notes}
    ) {
      case {
        ...Case
      }
    }
  }
  ${CASE_FRAGMENT}
`;

const UPDATE_CASE = gql`
  mutation UpdateCase($id: Identifier!, $name: String!, $productName: String!, $productCount: Integer!, $count: Integer!, $number: String!, $expirationDate: Date, $shipped: Boolean!, $notes: String!) {
    updateCase(
      id: $id
      case: {name: $name, productName: $productName, productCount: $productCount, count: $count, number: $number, expirationDate: $expirationDate, shipped: $shipped, notes: $notes}
    ) {
      case {
        ...Case
      }
    }
  }
  ${CASE_FRAGMENT}
`;

const DELETE_CASE = gql`
  mutation DeleteCase($id: Identifier!) {
    deleteCase(id: $id) {
      id
    }
  }
`;

export {
  GET_CASES, UPDATE_CASE, CREATE_CASE, DELETE_CASE,
};
