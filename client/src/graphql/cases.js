import { gql } from '@apollo/client';
import { PRODUCT_FRAGMENT } from './products';
import { MATERIAL_FRAGMENT } from './materials';

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
  mutation UpdateCase($id: ID!, $name: String!, $count: Integer!, $number: String!, $expirationDate: Date, $notes: String!, $defaultMaterialCount: Float!, $defaultProductCount: Integer!) {
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
  mutation DeleteCase($id: ID!) {
    deleteCase(id: $id) {
      id
    }
  }
`;

const GET_CASE_MATERIALS = gql`
  query GetCaseMaterials($id: ID!) {
    case(id: $id) {
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

const GET_CASE_PRODUCTS = gql`
  query GetCaseProducts($id: ID!) {
    case(id: $id) {
      id
      name
      products {
        edges {
          countUsed
          node {
            ...Product
          }
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const GET_CASE = gql`
  query GetCase($id: ID!) {
    case(id: $id) {
      ...Case
    }
  }
  ${CASE_FRAGMENT}
`;

const CASE_USE_MATERIAL = gql`
  mutation CaseUseMaterial($caseId: ID!, $materialId: ID!, $count: Float!) {
    caseUseMaterial(
      caseId: $caseId
      materialId: $materialId
      count: $count
    ) {
      countUsed
      material {
        ...Material
      }
    }
  }
  ${MATERIAL_FRAGMENT}
`;

const CASE_UNUSE_MATERIAL = gql`
  mutation CaseUnuseMaterial($caseId: ID!, $materialId: ID!) {
    caseUnuseMaterial(
      caseId: $caseId
      materialId: $materialId
    ) {
      materialId
    }
  }
`;

const CASE_USE_PRODUCT = gql`
  mutation CaseUseProduct($caseId: ID!, $productId: ID!, $count: Integer!) {
    caseUseProduct(
      caseId: $caseId
      productId: $productId
      count: $count
    ) {
      countUsed
      product {
        ...Product
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const CASE_UNUSE_PRODUCT = gql`
  mutation CaseUnseProduct($caseId: ID!, $productId: ID!) {
    caseUnuseProduct(
      caseId: $caseId
      productId: $productId
    ) {
      product {
        ...Product
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export {
  GET_CASES,
  UPDATE_CASE,
  CREATE_CASE,
  DELETE_CASE,
  GET_CASE_MATERIALS,
  GET_CASE_PRODUCTS,
  CASE_FRAGMENT,
  GET_CASE,
  CASE_USE_MATERIAL,
  CASE_UNUSE_MATERIAL,
  CASE_USE_PRODUCT,
  CASE_UNUSE_PRODUCT,
};
