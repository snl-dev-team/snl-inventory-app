import graphene
from datetime import date, datetime

TYPE_MAP = [
    {
        'graphene': graphene.types.scalars.Int,
        'serialize': int,
        'deserialize': int,
        'boto3': 'longValue',
    },
    {
        'graphene': graphene.types.scalars.ID,
        'serialize': str,
        'deserialize': str,
        'boto3': 'stringValue',
    },
    {
        'graphene': graphene.types.scalars.String,
        'serialize': str,
        'deserialize': str,
        'boto3': 'stringValue',
    },
    {
        'graphene': graphene.types.scalars.Float,
        'serialize': float,
        'deserialize': float,
        'boto3': 'doubleValue',
    },
    {
        'graphene': graphene.types.scalars.Boolean,
        'serialize': bool,
        'deserialize': bool,
        'boto3': 'booleanValue',
    },
    {
        'graphene': graphene.types.datetime.Date,
        'serialize': lambda x: x.isoformat(),
        'deserialize': date.fromisoformat,
        'boto3': 'stringValue',
    },
    {
        'graphene': graphene.types.datetime.DateTime,
        'serialize': lambda x: x.isoformat(),
        'deserialize': datetime.fromisoformat,
        'boto3': 'stringValue',
    }
]
