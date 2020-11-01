from db_client import execute_statement
import json

"""
+-----------------+-------------------------------------+------+-----+-------------------+----------------+
| Field           | Type                                | Null | Key | Default           | Extra          |
+-----------------+-------------------------------------+------+-----+-------------------+----------------+
| id              | int(11)                             | NO   | PRI | NULL              | auto_increment |
| name            | varchar(255)                        | NO   |     | NULL              |                |
| number          | varchar(255)                        | YES  |     | NULL              |                |
| count           | float unsigned                      | NO   |     | NULL              |                |
| expiration_date | date                                | YES  |     | NULL              |                |
| date_created    | datetime                            | NO   |     | CURRENT_TIMESTAMP |                |
| date_modified   | datetime                            | NO   |     | CURRENT_TIMESTAMP |                |
| price           | int(10) unsigned                    | YES  |     | NULL              |                |
| units           | enum('unit','kg','lb','g','L','mL') | YES  |     | unit              |                |
+-----------------+-------------------------------------+------+-----+-------------------+----------------+
"""

COLUMNS = [
    ('id',              int,   'longValue'),
    ('name',            str,   'stringValue'),
    ('number',          str,   'stringValue'),
    ('count',           float, 'doubleValue'),
    ('expiration_date', str,   'stringValue'),
    ('date_created',    str,   'stringValue'),
    ('date_modified',   str,   'stringValue'),
    ('price',           int,   'longValue'),
    ('units',           int,   'stringValue'),
]


def createMaterial(event, context):

    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Allow-Headers': 'content-type'
    }

    try:

        if event['httpMethod'] == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': headers
            }

        body = json.loads(event['body'])

        sql = """
        INSERT INTO
            `material` (
                `name`,
                `number`,
                `count`,
                `expiration_date`,
                `price`,
                `units`
            )
            VALUES (
                '{name}',
                '{number}',
                {count},
                '{expiration_date}',
                {price},
                '{units}'
            )
        """.format(**body)

        res = execute_statement(sql)

        return {
            'statusCode': 200,
            'body': json.dumps({'id': res['generatedFields'][0]['longValue']}),
            'headers': headers
        }

    except Exception as e:
        return {
            'statusCode': 400,
            'body': str(e),
            'headers': headers
        }


def fetchMaterials(event, context):

    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Allow-Headers': 'content-type'
    }

    try:
        columns_string = ', '.join(i[0] for i in COLUMNS)
        sql = """
        SELECT
            {columns}
        FROM
            `material`;
        """.format(columns=columns_string)
        res = execute_statement(sql)
        records = res['records']
        data = []
        for record in records:
            data_row = {}
            for entry, column in zip(record, COLUMNS):
                name, _, entry_type = column
                value = entry.get(entry_type, None)
                data_row[name] = value
            data.append(data_row)

        return {
            'statusCode': 200,
            'body': json.dumps({'data': data}),
            'headers': headers
        }

    except Exception as e:
        return {
            'statusCode': 400,
            'body': str(e),
            'headers': headers
        }


def updateMaterial(event, context):

    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Allow-Headers': 'content-type'
    }

    if event['httpMethod'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers
        }

    try:
        body = json.loads(event['body'])

        sql = """
        UPDATE `material` SET
            name = '{name}',
            number = '{number}',
            count = {count},
            expiration_date = '{expiration_date}',
            price = {price},
            units = '{units}'
        WHERE id = {id}
        """.format(**body)

        execute_statement(sql)

        return {
            'statusCode': 200,
            'headers': headers
        }

    except Exception as e:
        return {
            'statusCode': 400,
            "body": str(e),
            'headers': headers
        }


def deleteMaterial(event, context):

    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Allow-Headers': 'content-type'
    }

    if event['httpMethod'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers
        }

    try:

        body = json.loads(event['body'])

        sql = """
        DELETE FROM
            `material`
        WHERE id = {id}
        """.format(**body)

        execute_statement(sql)

        return {
            'statusCode': 200,
            'headers': headers
        }

    except Exception as e:
        return {
            'statusCode': 400,
            'body': str(e),
            'headers': headers
        }
