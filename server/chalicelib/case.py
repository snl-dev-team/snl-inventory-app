# pylint: disable=relative-beyond-top-level
from . import base, material, product, types
from .types import ID, Float, String, Integer
from graphene import relay, Field
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
| expiration_date        | date             | YES  |     | NULL              |                |
| name                   | varchar(255)     | NO   |     | NULL              |                |
| count                  | int(10) unsigned | NO   |     | NULL              |                |
| default_material_count | float unsigned   | NO   |     | NULL              |                |
| default_product_count  | int(10) unsigned | NO   |     | NULL              |                |
+------------------------+------------------+------+-----+-------------------+----------------+
"""


class CaseBase(
    types.Numberable,
    types.Notable,
    types.Expirable,
    types.Namable,
    types.DiscreteCountable,
    types.UsesMaterial,
    types.UsesProduct,
):
    pass


class TableName:

    __tablename__ = 'case'


class CaseInput(base.Input, CaseBase, TableName):
    __tablename__ = 'case'

    def to_output(self, id, date_created, date_modified):
        return Case(
            id=id,
            date_created=date_created,
            date_modified=date_modified,
            **self.__dict__,
        )


class Case(base.Object, CaseBase, types.Node, TableName):
    __tablename__ = 'case'

    materials = relay.ConnectionField(
        material.MaterialConnection, required=True)
    products = relay.ConnectionField(product.ProductConnection, required=True)

    @staticmethod
    def resolve_materials(parent, info):
        return Case.select_uses(parent.id, material.Material)

    @staticmethod
    def resolve_products(parent, info):
        return Case.select_uses(parent.id, product.Product)

    class Meta:
        interfaces = (relay.Node,)


class CaseConnection(base.ObjectConnection):
    __tablename__ = 'case'

    class Meta:
        node = Case

    class Edge:
        count = Integer()
        order_count = Integer()

        @staticmethod
        def resolve_count(parent, info):
            return parent.node['count'] if parent else None

        @staticmethod
        def resolve_order_count(parent, info):
            return parent.node['order_count'] if parent else None


class CreateCase(base.Create, TableName):
    __tablename__ = 'case'

    class Arguments:
        case = CaseInput(required=True)

    case = Field(Case)

    @staticmethod
    def mutate(parent, info, case):
        return {'case': CreateCase.commit(case)}


class UpdateCase(base.Update, TableName):
    __tablename__ = 'case'

    class Arguments:
        id = ID(required=True)
        case = CaseInput(required=True)

    case = Field(Case)

    @staticmethod
    def mutate(parent, info, id, case):
        return {'case': UpdateCase.commit(id, case)}


class DeleteCase(base.Delete, TableName):
    __tablename__ = 'case'

    class Arguments:
        id = ID(required=True)

    id = ID(required=True)

    @staticmethod
    def mutate(parent, info, id):
        DeleteCase.commit(id)
        return {'id': id}


class CaseUseMaterial(base.Use):
    __tablename__ = 'case'

    class Arguments:
        case_id = ID(required=True)
        material_id = ID(required=True)
        count = Float(required=True)

    material = Field(material.Material, required=True)
    count = Float(required=True)

    @staticmethod
    def mutate(parent, info, case_id: int, material_id: int, count: float):
        CaseUseMaterial.commit(
            material.Material, case_id, material_id, count)
        return {'material': material.Material.select_where(id=material_id), 'count': count}


class CaseUnuseMaterial(base.Unuse):
    __tablename__ = 'case'

    class Arguments:
        case_id = ID(required=True)
        material_id = ID(required=True)

    material_id = ID(required=True)

    @staticmethod
    def mutate(parent, info, case_id: int, material_id: int):
        CaseUnuseMaterial.commit(material.Material, case_id, material_id)
        return {'material_id': material_id}


class CaseUseProduct(base.Use):
    __tablename__ = 'case'

    class Arguments:
        case_id = ID(required=True)
        product_id = ID(required=True)
        count = Integer(required=True)

    product = Field(product.Product, required=True)
    count = Integer(required=True)

    @staticmethod
    def mutate(parent, info, case_id: int, product_id: int, count: int):
        CaseUseProduct.commit(
            product.Product, case_id, product_id, count)
        return {'product': product.Product.select_where(id=product_id), 'count': count}


class CaseUnuseProduct(base.Unuse):
    __tablename__ = 'case'

    class Arguments:
        case_id = ID(required=True)
        product_id = ID(required=True)

    product_id = ID(required=True)

    @staticmethod
    def mutate(parent, info, case_id: int, product_id: int):
        CaseUnuseProduct.commit(product.Product, case_id, product_id)
        return {'product_id': product_id}
