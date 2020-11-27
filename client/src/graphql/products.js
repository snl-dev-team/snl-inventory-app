import { gql } from '@apollo/client';
import { MATERIAL_FRAGMENT } from './materials';

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
    defaultMaterialCount
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
  mutation CreateProduct($count: Integer!, $name: String!, $expirationDate: Date, $completed: Boolean!, $notes: String!, $number: String!, $defaultMaterialCount: Float!) {
    createProduct(
      product: {count: $count, name: $name, expirationDate: $expirationDate, completed: $completed, notes: $notes, number: $number, defaultMaterialCount: $defaultMaterialCount}
    ) {
      product {
        ...Product
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $count: Integer!, $name: String!, $expirationDate: Date, $completed: Boolean!, $notes: String!, $number: String!, $defaultMaterialCount: Float!) {
    updateProduct(
      id: $id,
      product: {count: $count, name: $name, expirationDate: $expirationDate, completed: $completed, notes: $notes, number: $number, defaultMaterialCount: $defaultMaterialCount}
    ) {
      product {
        ...Product
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;

const GET_PRODUCT_MATERIALS = gql`
  query GetProductMaterials($id: ID!) {
    product(id: $id) {
      id
      name
      materials {
        edges {
          countUsed
          node {
            ...Material
          }
        }
      }
    }
  }
  ${MATERIAL_FRAGMENT}
`;

export {
  GET_PRODUCTS, UPDATE_PRODUCT, CREATE_PRODUCT, DELETE_PRODUCT, GET_PRODUCT_MATERIALS,
};
