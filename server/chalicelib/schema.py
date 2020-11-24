# pylint: disable=relative-beyond-top-level
from graphene import List, Field, Schema, Int, ObjectType, relay
from . import material, product, case, order
from datetime import datetime
from datetime import date, datetime
from .constants import TYPE_MAP
from .database import execute_statement, process_select_response


class Query(ObjectType):
    materials = relay.ConnectionField(material.MaterialConnection)
    material = Field(material.Material, id=Int(required=True))

    products = relay.ConnectionField(product.ProductConnection)
    product = Field(product.Product, id=Int(required=True))

    cases = relay.ConnectionField(case.CaseConnection)
    case = Field(case.Case, id=Int(required=True))

    orders = relay.ConnectionField(order.OrderConnection)
    order = Field(order.Order, id=Int(required=True))

    @staticmethod
    def resolve_materials(parent, info):
        return material.Material.select_all()

    @staticmethod
    def resolve_material(parent, info, id):
        return material.Material.select_where(id)

    @staticmethod
    def resolve_products(parent, info):
        return product.Product.select_all()

    @staticmethod
    def resolve_product(parent, info, id):
        return product.Product.select_where(id)

    @staticmethod
    def resolve_cases(parent, info):
        return case.Case.select_all()

    @staticmethod
    def resolve_case(parent, info, id):
        return case.Case.select_where(id)

    @staticmethod
    def resolve_orders(parent, info):
        return order.Order.select_all()

    @staticmethod
    def resolve_order(parent, info, id):
        return order.Order.select_where(id)


class Mutation(ObjectType):
    create_material = material.CreateMaterial.Field()
    update_material = material.UpdateMaterial.Field()
    delete_material = material.DeleteMaterial.Field()

    create_product = product.CreateProduct.Field()
    update_product = product.UpdateProduct.Field()
    delete_product = product.DeleteProduct.Field()
    product_use_material = product.ProductUseMaterial.Field()
    product_unuse_material = product.ProductUnuseMaterial.Field()

    create_case = case.CreateCase.Field()
    update_case = case.UpdateCase.Field()
    delete_case = case.DeleteCase.Field()
    case_use_material = case.CaseUseMaterial.Field()
    case_unuse_material = case.CaseUnuseMaterial.Field()
    case_use_product = case.CaseUseProduct.Field()
    case_unuse_product = case.CaseUnuseProduct.Field()

    create_order = order.CreateOrder.Field()
    update_order = order.UpdateOrder.Field()
    delete_order = order.DeleteOrder.Field()
    order_use_case = order.OrderUseCase.Field()
    order_unuse_case = order.OrderUnuseCase.Field()


schema = Schema(
    query=Query,
    mutation=Mutation
)
