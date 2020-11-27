import { gql } from '@apollo/client';

const PRODUCT_FRAGMENT = gql`
  fragment Product on Product {
    id
    dateCreated
    dateModified
    count
    name
    expirationDate
    completed
    notes
    number
  }
`;

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      edges {
        node {
          ...Product
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct($count: Integer!, $name: String!, $expirationDate: Date, $completed: Boolean!, $notes: String!, $number: String!) {
    createProduct(
      product: {count: $count, name: $name, expirationDate: $expirationDate, completed: $completed, notes: $notes, number: $number}
    ) {
      product {
        ...Product
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: Identifier!, $count: Integer!, $name: String!, $expirationDate: Date, $completed: Boolean!, $notes: String!, $number: String!) {
    updateProduct(
      id: $id,
      product: {count: $count, name: $name, expirationDate: $expirationDate, completed: $completed, notes: $notes, number: $number}
    ) {
      product {
        ...Product
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: Identifier!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;

export {
  GET_PRODUCTS, UPDATE_PRODUCT, CREATE_PRODUCT, DELETE_PRODUCT,
};
