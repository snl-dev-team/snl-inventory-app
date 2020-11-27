# pylint: disable=relative-beyond-top-level
from graphene import Field, ID
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


class MaterialInput(base.Input, MaterialBase):

    __table__ = 'material'

    def to_output(self, id, date_created, date_modified):
        return Material(
            id=id,
            date_created=date_created,
            date_modified=date_modified,
            **self.__dict__,
        )


class Material(base.Object, MaterialBase, types.Node):

    def __str__(self):
        return 'Material'

    __table__ = 'material'


class MaterialConnection(base.ObjectConnection):

    class Meta:
        node = Material

    class Edge:
        count_used = types.Integer()

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
        id = ID(required=True)
        material = MaterialInput(required=True)

    material = Field(Material)

    @staticmethod
    def mutate(parent, info, id, material):
        return {'material': UpdateMaterial.commit(id, material)}


class DeleteMaterial(base.Delete):

    __table__ = 'material'

    class Arguments:
        id = ID(required=True)

    id = ID(required=True)

    @staticmethod
    def mutate(parent, info, id):
        DeleteMaterial.commit(id)
        return {'id': id}
