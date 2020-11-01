from db_client import execute_statement
import json

"""
+-----------------+------------------+------+-----+-------------------+----------------+
| Field           | Type             | Null | Key | Default           | Extra          |
+-----------------+------------------+------+-----+-------------------+----------------+
| id              | int(11)          | NO   | PRI | NULL              | auto_increment |
| name            | varchar(255)     | NO   |     | NULL              |                |
| number          | varchar(255)     | YES  |     | NULL              |                |
| count           | int(10) unsigned | NO   |     | NULL              |                |
| expiration_date | date             | YES  |     | NULL              |                |
| date_created    | datetime         | NO   |     | CURRENT_TIMESTAMP |                |
| date_modified   | datetime         | NO   |     | CURRENT_TIMESTAMP |                |
| completed       | tinyint(1)       | YES  |     | 0                 |                |
+-----------------+------------------+------+-----+-------------------+----------------+
"""

"""
+-------------+----------------+------+-----+---------+-------+
| Field       | Type           | Null | Key | Default | Extra |
+-------------+----------------+------+-----+---------+-------+
| product_id  | int(11)        | NO   | PRI | NULL    |       |
| material_id | int(11)        | NO   | PRI | NULL    |       |
| count       | float unsigned | NO   |     | NULL    |       |
+-------------+----------------+------+-----+---------+-------+
"""

COLUMNS = [
    ('id',              int,   'longValue'),
    ('name',            str,   'stringValue'),
    ('number',          str,   'stringValue'),
    ('count',           float, 'doubleValue'),
    ('expiration_date', str,   'stringValue'),
    ('date_created',    str,   'stringValue'),
    ('date_modified',   str,   'stringValue'),
    ('complete',        bool,   'boolValue'),
]


def createProduct(event, context):

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
            `product` (
                `name`,
                `number`,
                `count`,
                `expiration_date`,
                `complete`
            )
            VALUES (
                '{name}',
                '{number}',
                {count},
                '{expiration_date}',
                {complete}
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


def fetchProducts(event, context):

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
            'body': json.dumps({'message': str(e)}),
            'headers': headers
        }
