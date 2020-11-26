
from graphene import types, relay
import enum
from datetime import date, datetime


class BaseType:
    graphene = None
    python = None
    boto3 = None

    @classmethod
    def serialize(cls, v):
        pass

    @classmethod
    def deserialize(cls, v):
        pass


class Identifier(types.ID, BaseType):
    graphene = types.ID
    python = int
    boto3 = 'longValue'

    @classmethod
    def serialize(cls, v):
        return str(v)

    @classmethod
    def deserialize(cls, v):
        return str(v)


class String(types.String, BaseType):
    graphene = types.String
    python = str
    boto3 = 'stringValue'

    @classmethod
    def serialize(cls, v):
        return str(v)

    @classmethod
    def deserialize(cls, v):
        return str(v)


class Integer(types.Int, BaseType):
    graphene = types.Int
    python = int
    boto3 = 'longValue'

    @classmethod
    def serialize(cls, v):
        return int(v)

    @classmethod
    def deserialize(cls, v):
        return int(v)


class Float(types.Float, BaseType):
    graphene = types.Float
    python = float
    boto3 = 'doubleValue'

    @classmethod
    def serialize(cls, v):
        return float(v)

    @classmethod
    def deserialize(cls, v):
        return float(v)


class Boolean(types.Boolean, BaseType):
    graphene = types.Boolean
    python = bool
    boto3 = 'booleanValue'

    @classmethod
    def serialize(cls, v):
        return bool(v)

    @classmethod
    def deserialize(cls, v):
        return bool(v)


class DateTime(types.DateTime, BaseType):
    graphene = types.DateTime
    python = datetime
    boto3 = 'stringValue'

    @classmethod
    def serialize(cls, v):
        if v is None:
            return None
        return v.isoformat()

    @classmethod
    def deserialize(cls, v):
        if v is None:
            return None
        return datetime.fromisoformat(v)


class Date(types.Date, BaseType):
    graphene = types.Date
    python = date
    boto3 = 'stringValue'

    @classmethod
    def serialize(cls, v):
        if v is None:
            return None
        return v.isoformat()

    @classmethod
    def deserialize(cls, v):
        if v is None:
            return None
        return date.fromisoformat(v)


class Enum(types.Enum, BaseType):
    graphene = types.Enum
    python = str
    boto3 = 'stringValue'

    @classmethod
    def serialize(cls, v):
        return str(v)

    @classmethod
    def deserialize(cls, v):
        return str(v)


class Units(enum.Enum):
    UNIT = 'UNIT'
    KG = 'KG'
    LB = 'LB'
    G = 'G'
    L = 'L'
    ML = 'ML'


class Node:
    id = Identifier(required=True)
    date_created = DateTime(required=True)
    date_modified = DateTime(required=True)


class Completable:
    completed = Boolean(required=True)


class Shippable:
    shipped = Boolean(required=True)


class Expirable:
    expiration_date = Date(required=False)


class Notable:
    notes = String(required=True)


class Namable:
    name = String(required=True)


class Pricable:
    price = Integer(required=True)


class Measurable:
    units = Enum.from_enum(Units)


class DiscreteCountable:
    count = Integer(required=True)


class ContinuousCountable:
    count = Float(required=True)


class Numberable:
    number = String(required=True)
