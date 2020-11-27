import { gql } from '@apollo/client';

const MATERIAL_FRAGMENT = gql`
  fragment Material on Material {
    id
    dateCreated
    dateModified
    count
    price
    name
    expirationDate
    notes
    number
    units
    purchaseOrderUrl
    purchaseOrderNumber
    certificateOfAnalysisUrl
  }
`;

const GET_MATERIALS = gql`
  query GetMaterials {
    materials {
      edges {
        node {
          ...Material
        }
      }
    }
  }
  ${MATERIAL_FRAGMENT}
`;

const GET_MATERIAL = gql`
  query GetMaterial($id: ID!) {
    material(id: $id) {
      ...Material
    }
  }
  ${MATERIAL_FRAGMENT}
`;

const CREATE_MATERIAL = gql`
  mutation CreateMaterial($count: Float!, $price: Integer!, $name: String!, $expirationDate: Date, $notes: String!, $number: String!, $units: String!,  $purchaseOrderUrl: String, $purchaseOrderNumber: String,$certificateOfAnalysisUrl: String) {
    createMaterial(
      material: {count: $count, price: $price, name: $name, expirationDate: $expirationDate, notes: $notes, number: $number, units: $units, purchaseOrderUrl: $purchaseOrderUrl, purchaseOrderNumber: $purchaseOrderNumber, certificateOfAnalysisUrl: $certificateOfAnalysisUrl}
    ) {
      material {
        ...Material
      }
    }
  }
  ${MATERIAL_FRAGMENT}
`;

const UPDATE_MATERIAL = gql`
  mutation UpdateMaterial($id: ID!, $count: Float!, $price: Integer!, $name: String!, $expirationDate: Date, $notes: String!, $number: String!, $units: String!,  $purchaseOrderUrl: String, $purchaseOrderNumber: String,$certificateOfAnalysisUrl: String) {
    updateMaterial(
      id: $id
      material: {count: $count, price: $price, name: $name, expirationDate: $expirationDate, notes: $notes, number: $number, units: $units, purchaseOrderUrl: $purchaseOrderUrl, purchaseOrderNumber: $purchaseOrderNumber, certificateOfAnalysisUrl: $certificateOfAnalysisUrl}
    ) {
      material {
        ...Material
      }
    }
  }
  ${MATERIAL_FRAGMENT}
`;

const DELETE_MATERIAL = gql`
  mutation DeleteMaterial($id: ID!) {
    deleteMaterial(id: $id) {
      id
    }
  }
`;

export {
  GET_MATERIALS,
  UPDATE_MATERIAL,
  CREATE_MATERIAL,
  DELETE_MATERIAL,
  MATERIAL_FRAGMENT,
  GET_MATERIAL,
};
