# pylint: disable=relative-beyond-top-level
from graphene import Int, String, Float, Date, DateTime, Boolean, List, Mutation, Field, relay, ID
from . import base, material


class ProductInput(base.Input):
    name = String(required=True)
    number = String(required=True)
    count = Int(required=True)
    expiration_date = Date(required=True)
    notes = String(required=True)
    completed = Boolean(required=True)

    __table__ = 'product'

    def to_output(self, id, date_created, date_modified):
        return Product(
            id=id,
            date_created=date_created,
            date_modified=date_modified,
            **self.__dict__,
        )


class Product(base.Object):

    class Meta:
        interfaces = (relay.Node,)

    id = ID(required=True)
    name = String(required=True)
    number = String(required=True)
    count = Int(required=True)
    expiration_date = Date(required=True)
    date_created = DateTime(required=True)
    date_modified = DateTime(required=True)
    notes = String(required=True)
    completed = Boolean(required=True)
    materials = relay.ConnectionField(
        material.MaterialConnection, required=True)

    __table__ = 'product'

    @classmethod
    def get_node(cls, info, id):
        return Product.select_where(id)

    @staticmethod
    def resolve_materials(parent, info):
        return Product.select_uses(parent['id'], material.Material)


class ProductConnection(base.ObjectConnection):

    class Meta:
        node = Product

    class Edge:
        count_used = Int()

        @staticmethod
        def resolve_count_used(parent, info):
            return parent.node['count_used'] if parent else None


class CreateProduct(base.Create):

    __table__ = 'product'

    class Arguments:
        product = ProductInput(required=True)

    product = Field(Product)

    @staticmethod
    def mutate(parent, info, product):
        return {'product': CreateProduct.commit(product)}


class UpdateProduct(base.Update):

    __table__ = 'product'

    class Arguments:
        id = Int(required=True)
        product = ProductInput(required=True)

    product = Field(Product)

    @staticmethod
    def mutate(parent, info, id, product):
        return {'product': UpdateProduct.commit(id, product)}


class DeleteProduct(base.Delete):

    __table__ = 'product'

    class Arguments:
        id = Int(required=True)

    product = Field(Product)

    @staticmethod
    def mutate(parent, info, id):
        return {'product': DeleteProduct.commit(id)}


class ProductUseMaterial(base.Use):

    __table__ = 'product'

    class Arguments:
        product_id = Int(required=True)
        material_id = Int(required=True)
        count = Float(required=True)

    product = Field(Product)

    @staticmethod
    def mutate(parent, info, product_id: int, material_id: int, count: float):
        return {'product': ProductUseMaterial.commit(product_id, material_id, count)}


class ProductUnuseMaterial(base.Unuse):

    __table__ = 'product'

    class Arguments:
        product_id = Int(required=True)
        material_id = Int(required=True)

    product = Field(Product)

    @staticmethod
    def mutate(parent, info, product_id: int, material_id: int):
        return {'product': ProductUnuseMaterial.commit(product_id, material_id)}
