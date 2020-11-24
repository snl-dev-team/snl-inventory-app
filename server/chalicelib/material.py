# pylint: disable=relative-beyond-top-level
from graphene import Int, String, Float, Date, DateTime, Mutation, Field, relay, ID
from .database import execute_statement
from datetime import datetime
from . import base


class MaterialInput(base.Input):
    name = String(required=True)
    number = String(required=True)
    count = Float(required=True)
    expiration_date = Date(required=True)
    price = Int(required=True)
    units = String(required=True)
    notes = String(required=True)

    __table__ = 'material'

    def to_output(self, id, date_created, date_modified):
        return Material(
            id=id,
            date_created=date_created,
            date_modified=date_modified,
            **self.__dict__,
        )


class Material(base.Object):

    class Meta:
        interfaces = (relay.Node,)

    id = ID(required=True)
    name = String(required=True)
    number = String(required=True)
    count = Float(required=True)
    expiration_date = Date(required=True)
    date_created = DateTime(required=True)
    date_modified = DateTime(required=True)
    price = Int(required=True)
    units = String(required=True)
    notes = String(required=True)

    __input__ = MaterialInput
    __table__ = 'material'

    @classmethod
    def get_node(cls, info, id):
        return Material.select_where(id)


class MaterialConnection(base.ObjectConnection):

    class Meta:
        node = Material

    class Edge:
        count_used = Int()

        @staticmethod
        def resolve_count_used(parent, info):
            return parent.node['count_used'] if parent else None


class CreateMaterial(base.Create):

    __table__ = 'material'

    class Arguments:
        material = MaterialInput(required=True)

    material = Field(Material)

    @staticmethod
    def mutate(parent, info, material):
        return {'material': CreateMaterial.commit(material)}


class UpdateMaterial(base.Update):

    __table__ = 'material'

    class Arguments:
        id = Int(required=True)
        material = MaterialInput(required=True)

    material = Field(Material)

    @staticmethod
    def mutate(parent, info, id, material):
        return {'material': UpdateMaterial.commit(id, material)}


class DeleteMaterial(base.Delete):

    __table__ = 'material'

    class Arguments:
        id = Int(required=True)
        material = MaterialInput(required=True)

    material = Field(Material)

    @staticmethod
    def mutate(parent, info, id):
        return {'material': DeleteMaterial.commit(id)}
