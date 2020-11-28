# pylint: disable=relative-beyond-top-level
from graphene import List, Field, Schema, ObjectType, relay
from . import material, product, case, order
from datetime import datetime
from datetime import date, datetime
from .database import execute_statement, process_select_response
from graphql_relay import to_global_id


class Query(ObjectType):
    materials = relay.ConnectionField(material.MaterialConnection)
    material = relay.Node.Field(material.Material)

    products = relay.ConnectionField(product.ProductConnection)
    product = relay.Node.Field(product.Product)

    cases = relay.ConnectionField(case.CaseConnection)
    case = relay.Node.Field(case.Case)

    orders = relay.ConnectionField(order.OrderConnection)
    order = relay.Node.Field(order.Order)

    node = relay.Node.Field()

    @staticmethod
    def resolve_materials(parent, info):
        return material.Material.select_all()

    @staticmethod
    def resolve_products(parent, info):
        return product.Product.select_all()

    @staticmethod
    def resolve_cases(parent, info):
        return case.Case.select_all()

    @staticmethod
    def resolve_orders(parent, info):
        return order.Order.select_all()


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
    order_ships_case = order.OrderShipsCase.Field()
    order_unships_case = order.OrderUnshipsCase.Field()


schema = Schema(
    query=Query,
    mutation=Mutation
)
