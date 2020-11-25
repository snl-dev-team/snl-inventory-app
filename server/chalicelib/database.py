import boto3
import os
import mysql.connector
import sqlparse
import logging

rds_client = boto3.client('rds-data')
database_secrets_arn = os.environ.get('DATABASE_SECRETS_ARN')
database_name = os.environ.get('DATABASE_NAME')
db_cluster_arn = os.environ.get('DATABASE_CLUSTER_ARN')


def execute_statement(sql, sql_parameters=[]):
    logging.info(sqlparse.format(sql, reindent=True))
    response = rds_client.execute_statement(
        secretArn=database_secrets_arn,
        database=database_name,
        resourceArn=db_cluster_arn,
        sql=sql,
        parameters=sql_parameters
    )
    return response


def process_select_response(response, columns):
    records = response['records']
    data = []
    for record in records:
        data_row = {}
        for entry, column in zip(record, columns):
            name, deserialize, entry_type = column['name'], column['deserialize'], column['boto3']
            value = entry.get(entry_type, None)
            data_row[name] = None if value is None else deserialize(value)
        data.append(data_row)
    return data
