from db_client import execute_statement
import json

"""
+---------------+--------------+------+-----+-------------------+----------------+
| Field         | Type         | Null | Key | Default           | Extra          |
+---------------+--------------+------+-----+-------------------+----------------+
| id            | int(11)      | NO   | PRI | NULL              | auto_increment |
| number        | varchar(255) | NO   |     | NULL              |                |
| date_created  | datetime     | NO   |     | CURRENT_TIMESTAMP |                |
| date_modified | datetime     | NO   |     | CURRENT_TIMESTAMP |                |
+---------------+--------------+------+-----+-------------------+----------------+
"""

"""
+----------+------------------+------+-----+---------+-------+
| Field    | Type             | Null | Key | Default | Extra |
+----------+------------------+------+-----+---------+-------+
| order_id | int(11)          | NO   | PRI | NULL    |       |
| case_id  | int(11)          | NO   | PRI | NULL    |       |
| count    | int(10) unsigned | NO   |     | NULL    |       |
+----------+------------------+------+-----+---------+-------+
"""

COLUMNS = [
    ('id',              int,   'longValue'),
    ('number',          str,   'stringValue'),
    ('date_created',    str,   'stringValue'),
    ('date_modified',   str,   'stringValue'),
]


def createOrder(event, context):

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
            `order` (
                `number`
            )
            VALUES (
                '{number}'
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


def fetchOrders(event, context):

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
            `order`;
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


def updateOrder(event, context):

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
        UPDATE `order` SET
            number = '{number}'
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


def deleteOrder(event, context):

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
            `order`
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


def orderUseCase(event, context):
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
                `order_uses_case`
            WHERE
                `order_id` = {order_id},
                `case_id` = {case_id}
            """.format(**body)
        else:
            sql = """
            REPLACE INTO `order_uses_case` (
                `order_id`,
                `case_id`,
                `count`
            )
            VALUES (
                {order_id},
                {case_id},
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
