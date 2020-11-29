# pylint: disable=relative-beyond-top-level
from graphene import Field, relay
from .types import ID, Float, Integer
from . import base, material, case, types

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
| default_material_count | int(10) unsigned | NO   |     | NULL              |                |
| customer_name          | varchar(255)     | NO   |     | NULL              |                |
+------------------------+------------------+------+-----+-------------------+----------------+
"""


class OrderBase(
    types.Numberable,
    types.Notable,
    types.Completable,
    types.HasCustomer,
    types.UsesCase,
):
    pass


class TableName:
    __tablename__ = 'order'


class OrderInput(base.Input, OrderBase, TableName):
    __tablename__ = 'order'

    def to_output(self, id, date_created, date_modified):
        return Order(
            id=id,
            date_created=date_created,
            date_modified=date_modified,
            **self.__dict__,
        )


class Order(base.Object, OrderBase, types.Node, TableName):
    __tablename__ = 'order'

    cases = relay.ConnectionField(
        case.CaseConnection, required=True)

    @staticmethod
    def resolve_cases(parent, info):
        return Order.select_uses(parent.id, case.Case, relations=['order_count', Integer])

    class Meta:
        interfaces = (relay.Node,)


class OrderConnection(base.ObjectConnection):

    class Meta:
        node = Order

    class Edge:
        count = Integer()

        @staticmethod
        def resolve_count(parent, info):
            return parent.node['count'] if parent else None


class CreateOrder(base.Create, TableName):
    __tablename__ = 'order'

    class Arguments:
        order = OrderInput(required=True)

    order = Field(Order)

    @staticmethod
    def mutate(parent, info, order):
        return {'order': CreateOrder.commit(order)}


class UpdateOrder(base.Update, TableName):
    __tablename__ = 'order'

    class Arguments:
        id = ID(required=True)
        order = OrderInput(required=True)

    order = Field(Order)

    @staticmethod
    def mutate(parent, info, id, order):
        return {'order': UpdateOrder.commit(id, order)}


class DeleteOrder(base.Delete, TableName):
    __tablename__ = 'order'

    class Arguments:
        id = ID(required=True)

    id = ID(required=True)

    @staticmethod
    def mutate(parent, info, id: str):
        DeleteOrder.commit(id, users=[], usees=['case'])
        return {'id': id}


class OrderUseCase(base.Use):
    __tablename__ = 'order'

    class Arguments:
        order_id = ID(required=True)
        case_id = ID(required=True)
        count = Integer(required=True)
        order_count = Integer(required=True)

    case = Field(case.Case)
    count = Integer(required=True)
    order_count = Integer(required=True)

    @staticmethod
    def mutate(parent, info, order_id: int, case_id: int, count: int, order_count: int):
        OrderUseCase.commit(
            case.Case, order_id, case_id, count, relations=['order_count', order_count])
        return {'case': case.Case.select_where(id=case_id), 'count': count, 'order_count': order_count}


class OrderUnuseCase(base.Unuse):
    __tablename__ = 'order'

    class Arguments:
        order_id = ID(required=True)
        case_id = ID(required=True)

    case_id = ID(required=True)

    @staticmethod
    def mutate(parent, info, order_id: int, case_id: str):
        OrderUnuseCase.commit(case.Case, order_id, case_id)
        return {'case_id': case_id}
