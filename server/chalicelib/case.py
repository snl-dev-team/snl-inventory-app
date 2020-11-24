# pylint: disable=relative-beyond-top-level
from graphene import Int, String, Float, Boolean, Date, DateTime, List, Mutation, Field, relay
from . import base, material, product


class CaseInput(base.InputObjectType):
    name = String(required=True)
    product_name = String(required=True)
    product_count = Int(required=True)
    count = Int(required=True)
    number = String(required=True)
    expiration_date = Date(required=True)
    shipped = Boolean(required=True)
    notes = String(required=True)

    __table__ = 'case'

    def to_output(self, id, date_created, date_modified):
        return Case(
            id=id,
            date_created=date_created,
            date_modified=date_modified,
            **self.__dict__,
        )


class Case(base.Object):
    id = Int(required=True)
    name = String(required=True)
    product_name = String(required=True)
    product_count = Int(required=True)
    count = Int(required=True)
    number = String(required=True)
    expiration_date = Date(required=True)
    date_created = DateTime(required=True)
    date_modified = DateTime(required=True)
    shipped = Boolean(required=True)
    notes = String(required=True)
    materials = relay.ConnectionField(
        material.MaterialConnection, required=True)
    products = relay.ConnectionField(product.ProductConnection, required=True)

    __table__ = 'case'

    @staticmethod
    def resolve_materials(parent, info):
        return Case.select_uses(parent['id'], material.Material)

    @staticmethod
    def resolve_products(parent, info):
        return Case.select_uses(parent['id'], product.Product)


class CaseConnection(base.ObjectConnection):

    class Meta:
        node = Case

    class Edge:
        count_used = Int()

        @staticmethod
        def resolve_count_used(parent, info):
            return parent.node['count_used'] if parent else None


class CreateCase(base.Create):

    __table__ = 'case'

    class Arguments:
        case = CaseInput(required=True)

    case = Field(Case)

    @staticmethod
    def mutate(parent, info, case):
        return {'case': CreateCase.commit(case)}


class UpdateCase(base.Update):

    __table__ = 'case'

    class Arguments:
        id = Int(required=True)
        case = CaseInput(required=True)

    case = Field(Case)

    @staticmethod
    def mutate(parent, info, id, case):
        return {'case': UpdateCase.commit(id, case)}


class DeleteCase(base.Delete):

    __table__ = 'case'

    class Arguments:
        id = Int(required=True)
        case = CaseInput(required=True)

    case = Field(Case)

    @staticmethod
    def mutate(parent, info, id):
        return {'case': DeleteCase.commit(id)}


class CaseUseMaterial(base.Use):

    __table__ = 'case'

    class Arguments:
        case_id = Int(required=True)
        material_id = Int(required=True)
        count = Float(required=True)

    case = Field(Case)

    @staticmethod
    def mutate(parent, info, case_id: int, material_id: int, count: float):
        return {'case': CaseUseMaterial.commit(case_id, material_id, count)}


class CaseUnuseMaterial(base.Unuse):

    __table__ = 'case'

    class Arguments:
        case_id = Int(required=True)
        material_id = Int(required=True)

    case = Field(Case)

    @staticmethod
    def mutate(parent, info, case_id: int, material_id: int):
        return {'case': CaseUnuseMaterial.commit(case_id, material_id)}


class CaseUseProduct(base.Use):

    __table__ = 'case'

    class Arguments:
        case_id = Int(required=True)
        product_id = Int(required=True)
        count = Float(required=True)

    case = Field(Case)

    @staticmethod
    def mutate(parent, info, case_id: int, product_id: int, count: int):
        return {'case': CaseUseProduct.commit(case_id, product_id, count)}


class CaseUnuseProduct(base.Unuse):

    __table__ = 'case'

    class Arguments:
        case_id = Int(required=True)
        product_id = Int(required=True)

    case = Field(Case)

    @staticmethod
    def mutate(parent, info, case_id: int, product_id: int):
        return {'case': CaseUnuseProduct.commit(case_id, product_id)}
