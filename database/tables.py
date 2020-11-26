import boto3
import logging
import sqlparse
import mysql.connector
from sqlalchemy import (create_engine, Column,
                        CheckConstraint, ForeignKey, types, CHAR, TypeDecorator)
from sqlalchemy.sql import func, expression
import os
from sqlalchemy.orm import (scoped_session, sessionmaker, relationship,
                            backref)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.mysql import (
    INTEGER, BOOLEAN, DATETIME, DATE, FLOAT, VARCHAR, TEXT, ENUM)
from graphene import relay
import enum
import uuid


class GUID(TypeDecorator):
    """Platform-independent GUID type.

    Uses Postgresql's GUID type, otherwise uses
    CHAR(32), storing as stringified hex values.

    """
    impl = CHAR

    def load_dialect_impl(self, dialect):
        return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        return str(value)

    def process_result_value(self, value, dialect):
        return value


database_secrets_arn = os.environ.get('DATABASE_SECRETS_ARN')
database_name = os.environ.get('DATABASE_NAME')
database_cluster_arn = os.environ.get('DATABASE_CLUSTER_ARN')

engine = create_engine(
    'mysql+pydataapi://',
    connect_args={
        'resource_arn': database_cluster_arn,
        'secret_arn': database_secrets_arn,
        'database': database_name
    }
)

session = scoped_session(sessionmaker(autocommit=False,
                                      autoflush=False,
                                      bind=engine))

Base = declarative_base()
Base.query = session.query_property()


class Units(enum.Enum):
    UNIT = 'UNIT'
    KG = 'KG'
    LB = 'LB'
    G = 'G'
    L = 'L'
    ML = 'ML'


class Node:
    id = Column(
        GUID,
        primary_key=True,
        nullable=False,
        default=uuid.uuid4,
    )
    number = Column(
        VARCHAR(255),
        nullable=False,
    )
    notes = Column(
        TEXT,
        nullable=False,
    )

    date_created = Column(
        DATETIME,
        server_default=func.now(),
        nullable=False,
    )
    date_modified = Column(
        DATETIME,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class Completable:
    completed = Column(
        BOOLEAN,
        nullable=False,
        server_default=expression.false(),
    )


class Shippable:
    shipped = Column(
        BOOLEAN,
        nullable=False,
        server_default=expression.false(),
    )


class Expirable:
    expiration_date = Column(
        DATE,
        server_default=None,
        nullable=True,
    )


class Namable:
    name = Column(
        VARCHAR(255),
        nullable=False,
    )


class HasPrice:
    price = Column(
        INTEGER(unsigned=True),
        nullable=False,
    )


class HasUnits:
    units = Column(
        ENUM(Units),
        nullable=False,
        server_default='unit',
    )


class HasDiscreteCount:
    count = Column(
        INTEGER(unsigned=True),
        CheckConstraint('`count` >= 0'),
        nullable=False,
    )


class HasContinuousCount:
    count = Column(
        FLOAT(unsigned=True),
        CheckConstraint('`count` >= 0.0'),
        nullable=False,
    )


class Material(
    Base,
    Node,
    Expirable,
    Namable,
    HasPrice,
    HasUnits,
    HasContinuousCount
):
    __tablename__ = 'material'

    product_uses_material = relationship(
        'ProductUsesMaterial',
        cascade="all, delete",
        back_populates=__tablename__,
    )

    case_uses_material = relationship(
        'CaseUsesMaterial',
        cascade="all, delete",
        back_populates=__tablename__,
    )


class Product(
    Base,
    Node,
    Expirable,
    Namable,
    HasDiscreteCount,
    Completable,
):
    __tablename__ = 'product'

    product_uses_material = relationship(
        'ProductUsesMaterial',
        cascade="all, delete",
        back_populates=__tablename__,
    )
    case_uses_product = relationship(
        'CaseUsesProduct',
        cascade="all, delete",
        back_populates=__tablename__,
    )


class ProductUsesMaterial(Base, HasContinuousCount):
    __tablename__ = 'product_uses_material'
    product_id = Column(
        GUID,
        ForeignKey('product.id'),
        primary_key=True
    )
    material_id = Column(
        GUID,
        ForeignKey('material.id'),
        primary_key=True
    )

    product = relationship(
        'Product',
        cascade="all, delete",
        back_populates=__tablename__,
    )
    material = relationship(
        'Material',
        cascade="all, delete",
        back_populates=__tablename__,
    )


class Case(
    Base,
    Node,
    Namable,
    Expirable,
    HasDiscreteCount,
    Shippable,
):
    __tablename__ = 'case'

    product_name = Column(
        VARCHAR(255),
        nullable=False,
    )
    product_count = Column(
        INTEGER(unsigned=True),
        CheckConstraint('`count` >= 0'),
        nullable=False,
    )

    case_uses_material = relationship(
        'CaseUsesMaterial',
        cascade="all, delete",
        back_populates=__tablename__,
    )
    case_uses_product = relationship(
        'CaseUsesProduct',
        cascade="all, delete",
        back_populates=__tablename__,
    )
    order_uses_case = relationship(
        'OrderUsesCase',
        cascade="all, delete",
        back_populates=__tablename__,
    )


class CaseUsesMaterial(
    Base,
    HasContinuousCount
):
    __tablename__ = 'case_uses_material'
    case_id = Column(
        GUID,
        ForeignKey('case.id'),
        primary_key=True
    )
    material_id = Column(
        GUID,
        ForeignKey('material.id'),
        primary_key=True
    )

    case = relationship(
        'Case',
        cascade="all, delete",
        back_populates=__tablename__,
    )
    material = relationship(
        'Material',
        cascade="all, delete",
        back_populates=__tablename__,
    )


class CaseUsesProduct(Base, HasDiscreteCount):
    __tablename__ = 'case_uses_product'

    case_id = Column(
        GUID,
        ForeignKey('case.id'),
        primary_key=True
    )
    product_id = Column(
        GUID,
        ForeignKey('product.id'),
        primary_key=True
    )

    case = relationship(
        'Case',
        cascade="all, delete",
        back_populates=__tablename__,
    )
    product = relationship(
        'Product',
        cascade="all, delete",
        back_populates=__tablename__,
    )


class Order(Base, Node, Completable):
    __tablename__ = 'order'

    order_uses_case = relationship(
        'OrderUsesCase',
        cascade="all, delete",
        back_populates=__tablename__,
    )


class OrderUsesCase(Base, HasDiscreteCount):
    __tablename__ = 'order_uses_case'
    order_id = Column(
        GUID,
        ForeignKey('order.id'),
        primary_key=True
    )
    case_id = Column(
        GUID,
        ForeignKey('case.id'),
        primary_key=True
    )

    order = relationship(
        'Order',
        cascade="all, delete",
        back_populates=__tablename__,
    )
    case = relationship(
        'Case',
        cascade="all, delete",
        back_populates=__tablename__,
    )


tables = [
    Material,
    Product,
    Case,
    Order,
    ProductUsesMaterial,
    CaseUsesProduct,
    CaseUsesMaterial,
    OrderUsesCase,
]
