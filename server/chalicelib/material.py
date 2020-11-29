# pylint: disable=relative-beyond-top-level
from graphene import Field, ID, relay, Float
from . import base, types

"""
+-----------------------------+-------------------------------------+------+-----+-------------------+----------------+
| Field                       | Type                                | Null | Key | Default           | Extra          |
+-----------------------------+-------------------------------------+------+-----+-------------------+----------------+
| id                          | int(11)                             | NO   | PRI | NULL              | auto_increment |
| number                      | varchar(255)                        | NO   |     | NULL              |                |
| notes                       | text                                | NO   |     | NULL              |                |
| date_created                | datetime                            | NO   |     | CURRENT_TIMESTAMP |                |
| date_modified               | datetime                            | NO   |     | CURRENT_TIMESTAMP |                |
| expiration_date             | date                                | YES  |     | NULL              |                |
| name                        | varchar(255)                        | NO   |     | NULL              |                |
| price                       | int(10) unsigned                    | NO   |     | NULL              |                |
| units                       | enum('UNIT','KG','LB','G','L','ML') | NO   |     | UNIT              |                |
| count                       | float unsigned                      | NO   |     | NULL              |                |
| purchase_order_url          | varchar(2083)                       | YES  |     | NULL              |                |
| purchase_order_number       | varchar(255)                        | YES  |     | NULL              |                |
| certificate_of_analysis_url | varchar(2083)                       | YES  |     | NULL              |                |
+-----------------------------+-------------------------------------+------+-----+-------------------+----------------+
"""


class MaterialBase(
    types.Numberable,
    types.Notable,
    types.Expirable,
    types.Namable,
    types.Pricable,
    types.Measurable,
    types.ContinuousCountable,
    types.HasVendor,

):
    pass


class TableName:
    __tablename__ = 'material'


class MaterialInput(base.Input, MaterialBase, TableName):

    def to_output(self, id, date_created, date_modified):
        return Material(
            id=id,
            date_created=date_created,
            date_modified=date_modified,
            **self.__dict__,
        )


class Material(base.Object, MaterialBase, types.Node, TableName):
    __tablename__ = 'material'

    class Meta:
        interfaces = (relay.Node,)


class MaterialConnection(base.ObjectConnection, TableName):

    class Meta:
        node = Material

    class Edge:
        count = types.Integer()

        @staticmethod
        def resolve_count(parent, info):
            print(parent)
            return parent.node['count'] if parent else None


class CreateMaterial(base.Create, TableName):
    __tablename__ = 'material'

    class Arguments:
        material = MaterialInput(required=True)

    material = Field(Material)

    @staticmethod
    def mutate(parent, info, material):
        return {'material': CreateMaterial.commit(material)}


class UpdateMaterial(base.Update, TableName):
    __tablename__ = 'material'

    class Arguments:
        id = ID(required=True)
        material = MaterialInput(required=True)

    material = Field(Material, required=True)

    @staticmethod
    def mutate(parent, info, id, material):
        return {'material': UpdateMaterial.commit(id, material)}


class DeleteMaterial(base.Delete, TableName):
    __tablename__ = 'material'

    class Arguments:
        id = ID(required=True)

    id = ID(required=True)

    @staticmethod
    def mutate(parent, info, id):
        DeleteMaterial.commit(id, usees=[], users=['product', 'case'])
        return {'id': id}
