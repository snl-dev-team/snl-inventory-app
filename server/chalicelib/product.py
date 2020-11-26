# pylint: disable=relative-beyond-top-level
from graphene import String, Date, DateTime, Boolean, List, Mutation, Field, relay
from .types import Identifier, Float, Integer
from . import base, material, types

"""
+-----------------+------------------+------+-----+-------------------+-------+
| Field           | Type             | Null | Key | Default           | Extra |
+-----------------+------------------+------+-----+-------------------+-------+
| id              | char(36)         | NO   | PRI | NULL              |       |
| number          | varchar(255)     | NO   |     | NULL              |       |
| notes           | text             | NO   |     | NULL              |       |
| date_created    | datetime         | NO   |     | CURRENT_TIMESTAMP |       |
| date_modified   | datetime         | NO   |     | CURRENT_TIMESTAMP |       |
| completed       | tinyint(1)       | NO   |     | 0                 |       |
| expiration_date | date             | YES  |     | NULL              |       |
| name            | varchar(255)     | NO   |     | NULL              |       |
| count           | int(10) unsigned | NO   |     | NULL              |       |
+-----------------+------------------+------+-----+-------------------+-------+
"""


class ProductBase(
    types.Numberable,
    types.Notable,
    types.Completable,
    types.Expirable,
    types.Namable,
    types.DiscreteCountable,
):
    pass


class ProductInput(base.Input, ProductBase):

    __table__ = 'product'

    def to_output(self, id, date_created, date_modified):
        return Product(
            id=id,
            date_created=date_created,
            date_modified=date_modified,
            **self.__dict__,
        )


class Product(base.Object, ProductBase, types.Node):

    __table__ = 'product'

    def __str__(self):
        return 'Product'

    materials = relay.ConnectionField(
        material.MaterialConnection, required=True)

    @staticmethod
    def resolve_materials(parent, info):
        return Product.select_uses(parent['id'], material.Material)


class ProductConnection(base.ObjectConnection):

    class Meta:
        node = Product

    class Edge:
        count_used = Integer()

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
        id = Identifier(required=True)
        product = ProductInput(required=True)

    product = Field(Product)

    @staticmethod
    def mutate(parent, info, id, product):
        return {'product': UpdateProduct.commit(id, product)}


class DeleteProduct(base.Delete):

    __table__ = 'product'

    class Arguments:
        id = Identifier(required=True)

    product = Field(Product)

    @staticmethod
    def mutate(parent, info, id):
        print(id)
        DeleteProduct.commit(id)
        return {'id': id}


class ProductUseMaterial(base.Use):

    __table__ = 'product'

    class Arguments:
        product_id = Identifier(required=True)
        material_id = Identifier(required=True)
        count = Float(required=True)

    product = Field(Product)

    @staticmethod
    def mutate(parent, info, product_id: int, material_id: int, count: float):
        return {'product': ProductUseMaterial.commit(material.Material, product_id, material_id, count)}


class ProductUnuseMaterial(base.Unuse):

    __table__ = 'product'

    class Arguments:
        product_id = Identifier(required=True)
        material_id = Identifier(required=True)

    product = Field(Product)

    @staticmethod
    def mutate(parent, info, product_id: int, material_id: int):
        return {'product': ProductUnuseMaterial.commit(material.Material, product_id, material_id)}
