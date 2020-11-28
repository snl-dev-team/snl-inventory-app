# pylint: disable=relative-beyond-top-level
from graphene import Field, relay, ID
from .types import Float, Integer
from . import base, material, types
from .material import Material
from graphql_relay import from_global_id

"""
+------------------------+------------------+------+-----+-------------------+----------------+
| Field                  | Type             | Null | Key | Default           | Extra          |
+------------------------+------------------+------+-----+-------------------+----------------+
| id                     | int(11)          | NO   | PRI | NULL              | auto_increment |
| number                 | varchar(255)     | NO   |     | NULL              |                |
| notes                  | text             | NO   |     | NULL              |                |
| date_created           | datetime         | NO   |     | CURRENT_TIMESTAMP |                |
| date_modified          | datetime         | NO   |     | CURRENT_TIMESTAMP |                |
| completed              | tinyint(1)       | NO   |     | 0                 |                |
| expiration_date        | date             | YES  |     | NULL              |                |
| name                   | varchar(255)     | NO   |     | NULL              |                |
| count                  | int(10) unsigned | NO   |     | NULL              |                |
| default_material_count | float unsigned   | NO   |     | NULL              |                |
+------------------------+------------------+------+-----+-------------------+----------------+
"""


class ProductBase(
    types.Numberable,
    types.Notable,
    types.Completable,
    types.Expirable,
    types.Namable,
    types.DiscreteCountable,
    types.UsesMaterial,
):
    pass


class TableName:

    __tablename__ = 'product'


class ProductInput(base.Input, ProductBase, TableName):
    __tablename__ = 'product'

    def to_output(self, id, date_created, date_modified):
        return Product(
            id=id,
            date_created=date_created,
            date_modified=date_modified,
            **self.__dict__,
        )


class Product(base.Object, ProductBase, types.Node, TableName):
    __tablename__ = 'product'

    materials = relay.ConnectionField(
        material.MaterialConnection, required=True)

    @staticmethod
    def resolve_materials(parent, info):
        return Product.select_uses(parent.id, material.Material)

    class Meta:
        interfaces = (relay.Node,)


class ProductConnection(base.ObjectConnection):

    class Meta:
        node = Product

    class Edge:
        count_used = Float()

        @staticmethod
        def resolve_count_used(parent, info):
            return parent.node['count_used'] if parent else None


class CreateProduct(base.Create, TableName):
    __tablename__ = 'product'

    class Arguments:
        product = ProductInput(required=True)

    product = Field(Product, required=True)

    @staticmethod
    def mutate(parent, info, product):
        return {'product': CreateProduct.commit(product)}


class UpdateProduct(base.Update, TableName):
    __tablename__ = 'product'

    class Arguments:
        id = ID(required=True)
        product = ProductInput(required=True)

    product = Field(Product, required=True)

    @staticmethod
    def mutate(parent, info, id, product):
        return {'product': UpdateProduct.commit(id, product)}


class DeleteProduct(base.Delete, TableName):
    __tablename__ = 'product'

    class Arguments:
        id = ID(required=True)

    id = ID(required=True)

    @staticmethod
    def mutate(parent, info, id):
        DeleteProduct.commit(id)
        return {'id': id}


class ProductUseMaterial(base.Use, TableName):
    __tablename__ = 'product'

    class Arguments:
        product_id = ID(required=True)
        material_id = ID(required=True)
        count = Float(required=True)

    material = Field(Material, required=True)
    count_used = Float(required=True)

    @staticmethod
    def mutate(parent, info, product_id: str, material_id: str, count: float):
        ProductUseMaterial.commit(
            material.Material, product_id, material_id, count)
        return {'material': Material.select_where(id=material_id), 'count_used': count}


class ProductUnuseMaterial(base.Unuse, TableName):
    __tablename__ = 'product'

    class Arguments:
        product_id = ID(required=True)
        material_id = ID(required=True)

    material = Field(Material, required=True)

    @staticmethod
    def mutate(parent, info, product_id: int, material_id: int):
        return {'product': ProductUnuseMaterial.commit(material.Material, product_id, material_id)}
