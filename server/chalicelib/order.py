# pylint: disable=relative-beyond-top-level
from graphene import Int, String, Float, Boolean, Date, DateTime, List, Mutation, Field, relay
from . import base, material, case


class OrderInput(base.Input):
    number = String(required=True)
    notes = String(required=True)
    completed = Boolean(required=True)

    __table__ = 'order'

    def to_output(self, id, date_created, date_modified):
        return Order(
            id=id,
            date_created=date_created,
            date_modified=date_modified,
            **self.__dict__,
        )


class Order(base.Object):
    id = Int(required=True)
    number = String(required=True)
    date_created = DateTime(required=True)
    date_modified = DateTime(required=True)
    notes = String(required=True)
    cases = relay.ConnectionField(case.CaseConnection, required=True)

    __input__ = OrderInput
    __table__ = 'order'

    @staticmethod
    def resolve_cases(parent, info):
        return Order.select_uses(parent['id'], case.Case)


class OrderConnection(base.ObjectConnection):

    class Meta:
        node = Order

    class Edge:
        count_used = Int()

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
        id = Int(required=True)
        order = OrderInput(required=True)

    order = Field(Order)

    @staticmethod
    def mutate(parent, info, id, order):
        return {'order': UpdateOrder.commit(id, order)}


class DeleteOrder(base.Delete):

    __table__ = 'order'

    class Arguments:
        id = Int(required=True)
        order = OrderInput(required=True)

    order = Field(Order)

    @staticmethod
    def mutate(parent, info, id):
        return {'order': DeleteOrder.commit(id)}


class OrderUseCase(base.Use):

    __table__ = 'order'

    class Arguments:
        order_id = Int(required=True)
        case_id = Int(required=True)
        count = Int(required=True)

    order = Field(Order)

    @staticmethod
    def mutate(parent, info, order_id: int, case_id: int, count: int):
        return {'order': OrderUseCase.commit(order_id, case_id, count)}


class OrderUnuseCase(base.Unuse):

    __table__ = 'order'

    class Arguments:
        order_id = Int(required=True)
        case_id = Int(required=True)

    order = Field(Order)

    @staticmethod
    def mutate(parent, info, order_id: int, case_id: int):
        return {'order': OrderUnuseCase.commit(order_id, case_id)}
