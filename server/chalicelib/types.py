
from graphene import types, relay, ID
import enum
from datetime import date, datetime
import graphene


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


class Enum(graphene.Enum, BaseType):
    graphene = types.Enum
    python = str
    boto3 = 'stringValue'

    @classmethod
    def serialize(cls, v):
        return str(v)

    @classmethod
    def deserialize(cls, v):
        return str(v)


class Node:
    id = ID(required=True)
    date_created = DateTime(required=True)
    date_modified = DateTime(required=True)


class Completable:
    completed = Boolean(required=True)


class Expirable:
    expiration_date = Date(required=False)


class Notable:
    notes = String(required=True)


class Namable:
    name = String(required=True)


class Pricable:
    price = Integer(required=True)


class Measurable:
    units = String(required=True)


class DiscreteCountable:
    count = Integer(required=True)


class ContinuousCountable:
    count = Float(required=True)


class Numberable:
    number = String(required=True)


class HasVendor:
    vendor_name = String()
    purchase_order_url = String()
    purchase_order_number = String()
    certificate_of_analysis_url = String()


class HasCustomer:
    customer_name = String(required=True)


class UsesMaterial:
    default_material_count = Float(required=True)


class UsesProduct:
    default_product_count = Integer(required=True)


class UsesCase:
    default_case_count = Integer(required=True)
