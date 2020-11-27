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

const CREATE_MATERIAL = gql`
  mutation CreateMaterial($count: Float!, $price: Integer!, $name: String!, $expirationDate: Date, $notes: String!, $number: String!, $units: String!) {
    createMaterial(
      material: {count: $count, price: $price, name: $name, expirationDate: $expirationDate, notes: $notes, number: $number, units: $units}
    ) {
      material {
        ...Material
      }
    }
  }
  ${MATERIAL_FRAGMENT}
`;

const UPDATE_MATERIAL = gql`
  mutation UpdateMaterial($id: Identifier!, $count: Float!, $price: Integer!, $name: String!, $expirationDate: Date, $notes: String!, $number: String!, $units: String!) {
    updateMaterial(
      id: $id
      material: {count: $count, price: $price, name: $name, expirationDate: $expirationDate, notes: $notes, number: $number, units: $units}
    ) {
      material {
        ...Material
      }
    }
  }
  ${MATERIAL_FRAGMENT}
`;

const DELETE_MATERIAL = gql`
  mutation DeleteMaterial($id: Identifier!) {
    deleteMaterial(id: $id) {
      id
    }
  }
`;

export {
  GET_MATERIALS, UPDATE_MATERIAL, CREATE_MATERIAL, DELETE_MATERIAL,
};
