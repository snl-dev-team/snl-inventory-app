# pylint: disable=relative-beyond-top-level
from graphene import Int, String, Float, Boolean, Date, DateTime, List, Mutation, Field, relay, ID, ObjectType
from . import base, material, product, types
from graphql_relay import from_global_id


"""
+-----------------+------------------+------+-----+-------------------+-------+
| Field           | Type             | Null | Key | Default           | Extra |
+-----------------+------------------+------+-----+-------------------+-------+
| id              | char(36)         | NO   | PRI | NULL              |       |
| number          | varchar(255)     | NO   |     | NULL              |       |
| notes           | text             | NO   |     | NULL              |       |
| date_created    | datetime         | NO   |     | CURRENT_TIMESTAMP |       |
| date_modified   | datetime         | NO   |     | CURRENT_TIMESTAMP |       |
| shipped         | tinyint(1)       | NO   |     | 0                 |       |
| expiration_date | date             | YES  |     | NULL              |       |
| name            | varchar(255)     | NO   |     | NULL              |       |
| count           | int(10) unsigned | NO   |     | NULL              |       |
| product_name    | varchar(255)     | NO   |     | NULL              |       |
| product_count   | int(10) unsigned | NO   |     | NULL              |       |
+-----------------+------------------+------+-----+-------------------+-------+
"""


class CaseBase(
    types.Numberable,
    types.Notable,
    types.Shippable,
    types.Expirable,
    types.Namable,
    types.DiscreteCountable,
):
    product_name = String(required=True)
    product_count = Int(required=True)


class CaseInput(base.Input, CaseBase):

    __table__ = 'case'

    def to_output(self, id, date_created, date_modified):
        return Case(
            id=id,
            date_created=date_created,
            date_modified=date_modified,
            **self.__dict__,
        )


class Case(base.Object, CaseBase, types.Node):

    __table__ = 'case'

    def __str__(self):
        return 'Case'

    materials = relay.ConnectionField(
        material.MaterialConnection, required=True)
    products = relay.ConnectionField(product.ProductConnection, required=True)

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

    def __str__(self):
        return 'Case'

    class Arguments:
        case = CaseInput(required=True)

    case = Field(Case)

    @staticmethod
    def mutate(parent, info, case):
        return {'case': CreateCase.commit(case)}


class UpdateCase(base.Update):

    __table__ = 'case'

    class Arguments:
        id = ID(required=True)
        case = CaseInput(required=True)

    case = Field(Case)

    @staticmethod
    def mutate(parent, info, id, case):
        return {'case': UpdateCase.commit(id, case)}


class DeleteCase(base.Delete):

    __table__ = 'case'

    class Arguments:
        id = ID(required=True)

    id = ID(required=True)

    @staticmethod
    def mutate(parent, info, id):
        _, local_id = from_global_id(id)
        DeleteCase.commit(local_id)
        return {'id': id}


class CaseUseMaterial(base.Use):

    __table__ = 'case'

    class Arguments:
        case_id = ID(required=True)
        material_id = ID(required=True)
        count = Float(required=True)

    case = Field(Case)

    @staticmethod
    def mutate(parent, info, case_id: int, material_id: int, count: float):
        return {'case': CaseUseMaterial.commit(material.Material, case_id, material_id, count)}


class CaseUnuseMaterial(base.Unuse):

    __table__ = 'case'

    class Arguments:
        case_id = ID(required=True)
        material_id = ID(required=True)

    case = Field(Case)

    @staticmethod
    def mutate(parent, info, case_id: int, material_id: int):
        return {'case': CaseUnuseMaterial.commit(material.Material, case_id, material_id)}


class CaseUseProduct(base.Use):

    __table__ = 'case'

    class Arguments:
        case_id = ID(required=True)
        product_id = ID(required=True)
        count = Float(required=True)

    case = Field(Case)

    @staticmethod
    def mutate(parent, info, case_id: int, product_id: int, count: int):
        return {'case': CaseUseProduct.commit(product.Product, case_id, product_id, count)}


class CaseUnuseProduct(base.Unuse):

    __table__ = 'case'

    class Arguments:
        case_id = ID(required=True)
        product_id = ID(required=True)

    case = Field(Case)

    @staticmethod
    def mutate(parent, info, case_id: int, product_id: int):
        return {'case': CaseUnuseProduct.commit(product.Product, case_id, product_id)}
