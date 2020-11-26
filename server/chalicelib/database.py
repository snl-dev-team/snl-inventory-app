import boto3
import logging
import sqlparse
import mysql.connector
import os
import json

database_secrets_arn = os.environ.get('DATABASE_SECRETS_ARN')
database_name = os.environ.get('DATABASE_NAME')
database_cluster_arn = os.environ.get('DATABASE_CLUSTER_ARN')

rds_client = boto3.client('rds-data')


def execute_statement(sql, sql_parameters=[]):
    sql = sqlparse.format(sql, reindent=True)
    logging.info(sql)
    response = rds_client.execute_statement(
        secretArn=database_secrets_arn,
        database=database_name,
        resourceArn=database_cluster_arn,
        sql=sql,
        parameters=sql_parameters
    )
    return response


def process_select_response(response, members):
    records = response['records']
    data = []
    for record in records:
        data_row = {}
        for entry, member in zip(record, members):
            name, column = member
            value = entry.get(column.boto3, None)
            data_row[name] = None if value is None else column.deserialize(
                value)
        data.append(data_row)
    return data
