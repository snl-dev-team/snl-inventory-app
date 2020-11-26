import { gql } from '@apollo/client';

const GET_CASES = gql`
  query GetCases {
    cases {
      edges {
        node {
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
      }
    }
  }
`;

const CREATE_CASE = gql`
  mutation CreateCase(
    $name: String!,
    $productName: String!
    $productCount: Int!,
    $count: Int!,
    $number: String!,
    $expirationDate: Date!,
    $shipped: Boolean!,
    $notes: String!
  ) {
    createCase(
      case: {
        name: $name,
        productName: $productName,
        productCount: $productCount,
        count: $count,
        number: $number,
        expirationDate: $expirationDate,
        shipped: $shipped,
        notes: $notes
      }) {
      case {
        id
        name
        productName
        productCount
        count
        number
        expirationDate
        shipped
        notes
        dateCreated
        dateModified
      }
    }
  }
`;

const UPDATE_CASE = gql`
  mutation UpdateCase(
    $id: ID!,
    $name: String!,
    $productName: String!
    $productCount: Int!,
    $count: Int!,
    $number: String!,
    $expirationDate: Date!,
    $shipped: Boolean!,
    $notes: String!
  ) {
    updateCase(
      id: $id,
      case: {
        name: $name,
        productName: $productName,
        productCount: $productCount,
        count: $count,
        number: $number,
        expirationDate: $expirationDate,
        shipped: $shipped,
        notes: $notes
      }) {
      case {
        id
        name
        productName
        productCount
        count
        number
        expirationDate
        shipped
        notes
        dateCreated
        dateModified
      }
    }
  }
`;

const DELETE_CASE = gql`
mutation DeleteCase($id: ID!) {
  deleteCase(id: $id) {
    id
  }
}
`;

export {
  GET_CASES, UPDATE_CASE, CREATE_CASE, DELETE_CASE,
};
