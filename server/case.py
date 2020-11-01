from db_client import execute_statement
import json

"""
+-----------------+------------------+------+-----+-------------------+----------------+
| Field           | Type             | Null | Key | Default           | Extra          |
+-----------------+------------------+------+-----+-------------------+----------------+
| id              | int(11)          | NO   | PRI | NULL              | auto_increment |
| name            | varchar(255)     | NO   |     | NULL              |                |
| product_name    | varchar(255)     | NO   |     | NULL              |                |
| product_count   | int(11)          | NO   |     | NULL              |                |
| count           | int(10) unsigned | NO   |     | NULL              |                |
| number          | varchar(255)     | YES  |     | NULL              |                |
| expiration_date | date             | YES  |     | NULL              |                |
| date_created    | datetime         | NO   |     | CURRENT_TIMESTAMP |                |
| date_modified   | datetime         | NO   |     | CURRENT_TIMESTAMP |                |
| shipped         | tinyint(1)       | YES  |     | 0                 |                |
+-----------------+------------------+------+-----+-------------------+----------------+
"""

"""
+-------------+----------------+------+-----+---------+-------+
| Field       | Type           | Null | Key | Default | Extra |
+-------------+----------------+------+-----+---------+-------+
| case_id     | int(11)        | NO   | PRI | NULL    |       |
| material_id | int(11)        | NO   | PRI | NULL    |       |
| count       | float unsigned | NO   |     | NULL    |       |
+-------------+----------------+------+-----+---------+-------+
"""

"""
+------------+------------------+------+-----+---------+----------------+
| Field      | Type             | Null | Key | Default | Extra          |
+------------+------------------+------+-----+---------+----------------+
| case_id    | int(11)          | NO   | PRI | NULL    | auto_increment |
| product_id | int(11)          | NO   | PRI | NULL    |                |
| count      | int(10) unsigned | NO   |     | NULL    |                |
+------------+------------------+------+-----+---------+----------------+
"""

COLUMNS = [
    ('id',              int,   'longValue'),
    ('name',            str,   'stringValue'),
    ('product_name',    str,   'stringValue'),
    ('product_count',   int,   'longValue'),
    ('count',           float, 'longValue'),
    ('number',          str,   'stringValue'),
    ('expiration_date', str,   'stringValue'),
    ('date_created',    str,   'stringValue'),
    ('date_modified',   str,   'stringValue'),
    ('shipped',         bool,  'boolValue'),
]


def createCase(event, context):

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
            `case` (
                `name`,
                `product_name`,
                `product_count`,
                `count`,
                `number`,
                `expiration_date`,
                `shipped`
            )
            VALUES (
                '{name}',
                '{product_name}',
                {product_count},
                {count},
                '{number}',
                '{expiration_date}',
                {shipped}
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


def fetchCases(event, context):

    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Allow-Headers': 'content-type'
    }

    columns_string = ', '.join(i[0] for i in COLUMNS)
    try:
        sql = """
        SELECT
            {columns}
        FROM
            `case`;
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


def updateCase(event, context):

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
        UPDATE `case` SET
            name = '{name}',
            product_name = '{product_name}',
            product_count = {product_count},
            count = {count},
            number = '{number}',
            expiration_date = '{expiration_date}',
            shipped = '{shipped}'
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


def deleteCase(event, context):

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

    body = json.loads(event['body'])

    try:

        sql = """
        DELETE FROM
            `case`
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


def caseUseMaterial(event, context):
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

    body = json.loads(event['body'])

    try:

        if body['count'] == 0:
            sql = """
            DELETE FROM
                `case_uses_material`
            WHERE
                `case_id` = {case_id},
                `material_id` = {material_id}
            """.format(**body)
        else:
            sql = """
            REPLACE INTO `case_uses_material` (
                `case_id`,
                `material_id`,
                `count`
            )
            VALUES (
                {case_id},
                {material_id},
                {count}
            )
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


def caseUseProduct(event, context):
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

    body = json.loads(event['body'])

    try:

        if body['count'] == 0:
            sql = """
            DELETE FROM
                `case_uses_product`
            WHERE
                `case_id` = {case_id},
                `product_id` = {product_id}
            """.format(**body)
        else:
            sql = """
            REPLACE INTO `case_uses_product` (
                `case_id`,
                `product_id`,
                `count`
            )
            VALUES (
                {case_id},
                {product_id},
                {count}
            )
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
