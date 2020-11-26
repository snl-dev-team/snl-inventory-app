
from graphene.types import ID, String, Int, Float, Boolean, Date, DateTime, Enum
import enum


class Units(enum.Enum):
    UNIT = 'UNIT'
    KG = 'KG'
    LB = 'LB'
    G = 'G'
    L = 'L'
    ML = 'ML'


class Node:
    id = ID(required=True)
    date_created = DateTime(required=True)
    date_modified = DateTime(required=True)


class Completable:
    completed = Boolean(required=True)


class Shippable:
    shipped = Boolean(required=True)


class Expirable:
    expiration_date = Date()


class Notable:
    notes = String(required=True)


class Namable:
    name = String(required=True)


class Pricable:
    price = Int(required=True)


class Measurable:
    units = Enum.from_enum(Units)


class DiscreteCountable:
    count = Int(required=True)


class ContinuousCountable:
    count = Float(required=True)


class Numberable:
    number = String(required=True)
