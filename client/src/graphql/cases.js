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
    defaultMaterialCount
    defaultProductCount
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
  mutation CreateCase($name: String!, $count: Integer!, $number: String!, $expirationDate: Date, $notes: String!, $defaultMaterialCount: Float!, $defaultProductCount: Integer!) {
    createCase(
      case: {name: $name, count: $count, number: $number, expirationDate: $expirationDate, notes: $notes, defaultMaterialCount: $defaultMaterialCount, defaultProductCount: $defaultProductCount}
    ) {
      case {
        ...Case
      }
    }
  }
  ${CASE_FRAGMENT}
`;

const UPDATE_CASE = gql`
  mutation UpdateCase($id: Identifier!, $name: String!, $count: Integer!, $number: String!, $expirationDate: Date, $notes: String!, $defaultMaterialCount: Float!, $defaultProductCount: Integer!) {
    updateCase(
      id: $id
      case: {name: $name, count: $count, number: $number, expirationDate: $expirationDate, notes: $notes, defaultMaterialCount: $defaultMaterialCount, defaultProductCount: $defaultProductCount}
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
