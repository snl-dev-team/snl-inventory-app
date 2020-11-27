# pylint: disable=relative-beyond-top-level
from graphene import Field
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

+-------------------+---------+------+-----+---------+-------+
| Field             | Type    | Null | Key | Default | Extra |
+-------------------+---------+------+-----+---------+-------+
| order_id          | int(11) | NO   | PRI | NULL    |       |
| case_id           | int(11) | NO   | PRI | NULL    |       |
| count_shipped     | int(11) | NO   |     | NULL    |       |
| count_not_shipped | int(11) | NO   |     | NULL    |       |
+-------------------+---------+------+-----+---------+-------+
"""


class OrderBase(
    types.Numberable,
    types.Notable,
    types.Completable,
    types.HasCustomer,
    types.UsesCase,
):
    pass


class OrderInput(base.Input, OrderBase):

    __table__ = 'order'

    def to_output(self, id, date_created, date_modified):
        return Order(
            id=id,
            date_created=date_created,
            date_modified=date_modified,
            **self.__dict__,
        )


class Order(base.Object, OrderBase, types.Node):

    __table__ = 'order'

    def __str__(self):
        return 'Order'

    @staticmethod
    def resolve_cases(parent, info):
        return Order.select_uses(parent['id'], case.Case)


class OrderConnection(base.ObjectConnection):

    class Meta:
        node = Order

    class Edge:
        count_used = Integer()

        @staticmethod
        def resolve_count_used(parent, info):
            return parent.node['count_used'] if parent else None


class CreateOrder(base.Create):

    __table__ = 'order'

    class Arguments:
        order = OrderInput(required=True)

    order = Field(Order)

    @staticmethod
    def mutate(parent, info, order):
        return {'order': CreateOrder.commit(order)}


class UpdateOrder(base.Update):

    __table__ = 'order'

    class Arguments:
        id = ID(required=True)
        order = OrderInput(required=True)

    order = Field(Order)

    @staticmethod
    def mutate(parent, info, id, order):
        return {'order': UpdateOrder.commit(id, order)}


class DeleteOrder(base.Delete):

    __table__ = 'order'

    class Arguments:
        id = ID(required=True)

    id = ID(required=True)

    @staticmethod
    def mutate(parent, info, id: str):
        DeleteOrder.commit(id)
        return {'id': id}


class OrderUseCase(base.Use):

    __table__ = 'order'

    class Arguments:
        order_id = ID(required=True)
        case_id = ID(required=True)
        count = Integer(required=True)

    order = Field(Order)

    @staticmethod
    def mutate(parent, info, order_id: int, case_id: int, count: int):
        return {'order': OrderUseCase.commit(case.Case, order_id, case_id, count)}


class OrderUnuseCase(base.Unuse):

    __table__ = 'order'

    class Arguments:
        order_id = ID(required=True)
        case_id = ID(required=True)

    order = Field(Order)

    @staticmethod
    def mutate(parent, info, order_id: int, case_id: int):
        return {'order': OrderUnuseCase.commit(case.Case, order_id, case_id)}
