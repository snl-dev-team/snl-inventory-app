import os
import boto3
import sys
import mysql.connector
from chalice import Chalice, Response
import json
from datetime import datetime

app = Chalice(app_name='snl-inventory-app')

app.api.cors = True

rds_client = boto3.client('rds-data')
database_secrets_arn = os.environ.get('DATABASE_SECRETS_ARN')
database_name = os.environ.get('DATABASE_NAME')
db_cluster_arn = os.environ.get('DATABASE_CLUSTER_ARN')


def execute_statement(sql):
    print(sql)
    response = rds_client.execute_statement(
        secretArn=database_secrets_arn,
        database=database_name,
        resourceArn=db_cluster_arn,
        sql=sql
    )
    return response


MATERIAL_COLUMNS = [
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


@app.route('/material', methods=['POST'])
def create_material():
    try:
        body = app.current_request.json_body
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

        created_id = res['generatedFields'][0]['longValue']
        date_created = date_modified = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        return Response(
            body=json.dumps(
                {
                    'id': created_id,
                    'date_created': date_created,
                    'date_modified': date_modified,
                }
            ),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/material', methods=['GET'])
def fetch_materials():
    try:
        columns_string = ', '.join(i[0] for i in MATERIAL_COLUMNS)
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
            for entry, column in zip(record, MATERIAL_COLUMNS):
                name, _, entry_type = column
                value = entry.get(entry_type, None)
                data_row[name] = value
            data.append(data_row)

        return Response(
            body=json.dumps({'data': data}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/material/{id}', methods=['PUT'])
def update_material(id):
    try:
        body = app.current_request.json_body
        sql = """
            UPDATE `material` SET
                name = '{name}',
                number = '{number}',
                count = {count},
                expiration_date = '{expiration_date}',
                price = {price},
                units = '{units}',
                date_modified = CURRENT_TIMESTAMP
            WHERE id = {id}
            """.format(**body, id=id)

        execute_statement(sql)

        date_modified = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        return Response(
            body=json.dumps({'date_modified': date_modified}),
            status_code=200
        )
    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/material/{id}', methods=['DELETE'])
def delete_material(id):
    try:
        sql = """
            DELETE FROM
                `material`
            WHERE id = {id}
            """.format(id=id)

        execute_statement(sql)

        return Response(
            body=json.dumps({}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


PRODUCT_COLUMNS = [
    ('id',              int,   'longValue'),
    ('name',            str,   'stringValue'),
    ('number',          str,   'stringValue'),
    ('count',           float, 'longValue'),
    ('expiration_date', str,   'stringValue'),
    ('date_created',    str,   'stringValue'),
    ('date_modified',   str,   'stringValue'),
    ('completed',       bool,  'booleanValue'),
]

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

+-------------+----------------+------+-----+---------+-------+
| Field       | Type           | Null | Key | Default | Extra |
+-------------+----------------+------+-----+---------+-------+
| product_id  | int(11)        | NO   | PRI | NULL    |       |
| material_id | int(11)        | NO   | PRI | NULL    |       |
| count       | float unsigned | NO   |     | NULL    |       |
+-------------+----------------+------+-----+---------+-------+
"""


@app.route('/product', methods=['POST'])
def create_product():
    try:
        body = app.current_request.json_body

        sql = """
            INSERT INTO
                `product` (
                    `name`,
                    `number`,
                    `count`,
                    `expiration_date`,
                    `completed`
                )
                VALUES (
                    '{name}',
                    '{number}',
                    {count},
                    '{expiration_date}',
                    {completed}
                )
            """.format(**body)

        res = execute_statement(sql)

        created_id = res['generatedFields'][0]['longValue']
        date_created = date_modified = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        return Response(
            body=json.dumps(
                {
                    'id': created_id,
                    'date_created': date_created,
                    'date_modified': date_modified
                }
            ),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/product', methods=['GET'])
def fetch_products():
    try:
        columns_string = ', '.join(i[0] for i in PRODUCT_COLUMNS)
        sql = """
            SELECT
                {columns}
            FROM
                `product`;
            """.format(columns=columns_string)
        res = execute_statement(sql)

        records = res['records']
        data = []
        for record in records:
            data_row = {}
            for entry, column in zip(record, PRODUCT_COLUMNS):
                name, _, entry_type = column
                value = entry.get(entry_type, None)
                data_row[name] = value
            data.append(data_row)

        return Response(
            body=json.dumps({'data': data}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/product/{id}', methods=['PUT'])
def update_product(id):
    try:
        body = app.current_request.json_body
        sql = """
            UPDATE `product` SET
                name = '{name}',
                number = '{number}',
                count = {count},
                expiration_date = '{expiration_date}',
                completed = {completed},
                date_modified = CURRENT_TIMESTAMP
            WHERE id = {id}
            """.format(**body, id=id)

        execute_statement(sql)

        date_modified = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        return Response(
            body=json.dumps({'date_modified': date_modified}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/product/{id}', methods=['DELETE'])
def delete_product(id):
    try:
        sql = """
            DELETE FROM
                `product`
            WHERE id = {id}
            """.format(id=id)

        execute_statement(sql)

        return Response(
            body=json.dumps({}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/product/{id}/material', methods=['PUT'])
def product_use_material(id):
    try:
        body = app.current_request.json_body

        sql = """
            DECLARE @countDiff AS INT
            SET @countDiff = (
                            (SELECT `count` 
                             FROM `product_uses_material` 
                             WHERE `product_id`={id}, `material_id`={material_id})
                             - {count}
            );

            UPDATE `material` 
            SET `count`=(
                (SELECT `count` FROM `material` WHERE `id`={material_id})- @countDiff
            )
            IF @countDiff >= 0;

            UPDATE `material`
            SET `count`=(
                (SELECT `count` FROM `material` WHERE `id`={material_id}) + ABS(@countDiff)
            )
            IF @countDiff < 0;

            REPLACE INTO `product_uses_material` (
                `product_id`,
                `material_id`,
                `count`
            )
            VALUES (
                {id},
                {material_id},
                {count}
            );
            """.format(**body, id=id)

        execute_statement(sql)

        return Response(
            body=json.dumps({}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/product/{id}/material', methods=['DELETE'])
def product_unuse_material(id):
    try:
        body = app.current_request.json_body
        sql = """
            UPDATE `material` 
            SET `count`=(
                (SELECT `count` FROM `material` WHERE `id`={material_id}) + 
                (SELECT `count` FROM `product_uses_material` WHERE `product_id={id}, `material_id`={material_id})
            )
            WHERE `id`={material_id};

            DELETE FROM
                `product_uses_material`
            WHERE
                `product_id` = {id},
                `material_id` = {material_id};
            """.format(**body, id=id)

        execute_statement(sql)

        return Response(
            body=json.dumps({}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


CASE_COLUMNS = [
    ('id',              int,   'longValue'),
    ('name',            str,   'stringValue'),
    ('product_name',    str,   'stringValue'),
    ('product_count',   int,   'longValue'),
    ('count',           float, 'longValue'),
    ('number',          str,   'stringValue'),
    ('expiration_date', str,   'stringValue'),
    ('date_created',    str,   'stringValue'),
    ('date_modified',   str,   'stringValue'),
    ('shipped',         bool,  'booleanValue'),
]

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

+-------------+----------------+------+-----+---------+-------+
| Field       | Type           | Null | Key | Default | Extra |
+-------------+----------------+------+-----+---------+-------+
| case_id     | int(11)        | NO   | PRI | NULL    |       |
| material_id | int(11)        | NO   | PRI | NULL    |       |
| count       | float unsigned | NO   |     | NULL    |       |
+-------------+----------------+------+-----+---------+-------+

+------------+------------------+------+-----+---------+----------------+
| Field      | Type             | Null | Key | Default | Extra          |
+------------+------------------+------+-----+---------+----------------+
| case_id    | int(11)          | NO   | PRI | NULL    | auto_increment |
| product_id | int(11)          | NO   | PRI | NULL    |                |
| count      | int(10) unsigned | NO   |     | NULL    |                |
+------------+------------------+------+-----+---------+----------------+
"""


@ app.route('/case', methods=['POST'])
def create_case():
    try:
        body = app.current_request.json_body
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

        created_id = res['generatedFields'][0]['longValue']
        date_created = date_modified = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        return Response(
            body=json.dumps(
                {
                    'id': created_id,
                    'date_created': date_created,
                    'date_modified': date_modified,
                }
            ),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/case', methods=['GET'])
def fetch_cases():
    try:
        columns_string = ', '.join(i[0] for i in CASE_COLUMNS)
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
            for entry, column in zip(record, CASE_COLUMNS):
                name, _, entry_type = column
                value = entry.get(entry_type, None)
                data_row[name] = value
            data.append(data_row)

        return Response(
            body=json.dumps({'data': data}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/case/{id}', methods=['PUT'])
def update_case(id):
    try:
        body = app.current_request.json_body
        sql = """
            UPDATE `case` SET
                name = '{name}',
                product_name = '{product_name}',
                product_count = {product_count},
                count = {count},
                number = '{number}',
                expiration_date = '{expiration_date}',
                shipped = '{shipped}',
                date_modified = CURRENT_TIMESTAMP
            WHERE id = {id}
            """.format(**body, id=id)

        execute_statement(sql)

        date_modified = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        return Response(
            body=json.dumps({'date_modified': date_modified}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/case/{id}', methods=['DELETE'])
def delete_case(id):
    try:
        sql = """
            DELETE FROM
                `case`
            WHERE id = {id}
            """.format(id=id)

        execute_statement(sql)

        return Response(
            body=json.dumps({}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/case/{id}/material', methods=['PUT'])
def case_use_material(id):
    try:
        body = app.current_request.json_body

        sql = """
            REPLACE INTO `case_uses_material` (
                `case_id`,
                `material_id`,
                `count`
            )
            VALUES (
                {id},
                {material_id},
                {count}
            )
            """.format(**body, id=id)

        execute_statement(sql)

        return Response(
            body=json.dumps({}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/case/{id}/material', methods=['DELETE'])
def case_unuse_material(id):
    try:
        body = app.current_request.json_body
        sql = """
            DELETE FROM
                `case_uses_material`
            WHERE
                `case_id` = {id},
                `material_id` = {material_id}
            """.format(**body, id=id)

        execute_statement(sql)

        return Response(
            body=json.dumps({}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/case/{id}/product', methods=['PUT'])
def case_use_product(id):
    try:
        body = app.current_request.json_body
        sql = """
            REPLACE INTO `case_uses_product` (
                `case_id`,
                `product_id`,
                `count`
            )
            VALUES (
                {id},
                {product_id},
                {count}
            )
            """.format(**body, id=id)

        execute_statement(sql)

        return Response(
            body=json.dumps({}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/case/{id}/product', methods=['DELETE'])
def case_unuse_product(id):
    try:
        body = app.current_request.json_body
        sql = """
            DELETE FROM
                `case_uses_product`
            WHERE
                `case_id` = {id},
                `product_id` = {product_id}
            """.format(**body, id=id)

        execute_statement(sql)

        return Response(
            body=json.dumps({}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


ORDER_COLUMNS = [
    ('id',              int,   'longValue'),
    ('number',          str,   'stringValue'),
    ('date_created',    str,   'stringValue'),
    ('date_modified',   str,   'stringValue'),
]

"""
+---------------+--------------+------+-----+-------------------+----------------+
| Field         | Type         | Null | Key | Default           | Extra          |
+---------------+--------------+------+-----+-------------------+----------------+
| id            | int(11)      | NO   | PRI | NULL              | auto_increment |
| number        | varchar(255) | NO   |     | NULL              |                |
| date_created  | datetime     | NO   |     | CURRENT_TIMESTAMP |                |
| date_modified | datetime     | NO   |     | CURRENT_TIMESTAMP |                |
+---------------+--------------+------+-----+-------------------+----------------+

+----------+------------------+------+-----+---------+-------+
| Field    | Type             | Null | Key | Default | Extra |
+----------+------------------+------+-----+---------+-------+
| order_id | int(11)          | NO   | PRI | NULL    |       |
| case_id  | int(11)          | NO   | PRI | NULL    |       |
| count    | int(10) unsigned | NO   |     | NULL    |       |
+----------+------------------+------+-----+---------+-------+
"""


@app.route('/order', methods=['POST'])
def create_order():
    try:
        body = app.current_request.json_body

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

        created_id = res['generatedFields'][0]['longValue']
        date_created = date_modified = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        return Response(
            body=json.dumps(
                {
                    'id': created_id,
                    'date_created': date_created,
                    'date_modified': date_modified
                },
            ),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/order', methods=['GET'])
def fetch_orders():
    try:
        columns_string = ', '.join(i[0] for i in ORDER_COLUMNS)
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
            for entry, column in zip(record, ORDER_COLUMNS):
                name, _, entry_type = column
                value = entry.get(entry_type, None)
                data_row[name] = value
            data.append(data_row)

        return Response(
            body=json.dumps({'data': data}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/order/{id}', methods=['PUT'])
def update_order(id):
    try:
        body = app.current_request.json_body
        sql = """
            UPDATE `order` SET
                number = '{number}',
                date_modified = CURRENT_TIMESTAMP
            WHERE id = {id}
            """.format(**body, id=id)

        execute_statement(sql)

        date_modified = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        return Response(
            body=json.dumps({'date_modified': date_modified}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/order/{id}', methods=['DELETE'])
def delete_order(id):
    try:
        sql = """
            DELETE FROM
                `order`
            WHERE id = {id}
            """.format(id=id)

        execute_statement(sql)

        return Response(
            body=json.dumps({}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/order/{id}/case', methods=['PUT'])
def order_use_case(id):
    try:
        body = app.current_request.json_body

        sql = """
            REPLACE INTO `order_uses_case` (
                `order_id`,
                `case_id`,
                `count`
            )
            VALUES (
                {id},
                {case_id},
                {count}
            )
            """.format(**body, id=id)

        execute_statement(sql)

        return Response(
            body=json.dumps({}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/order/{id}/case', methods=['DELETE'])
def order_unuse_case(id):
    try:
        body = app.current_request.json_body
        sql = """
            DELETE FROM
                `order_uses_case`
            WHERE
                `order_id` = {id},
                `case_id` = {material_id}
            """.format(**body, id=id)

        execute_statement(sql)

        return Response(
            body=json.dumps({}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )
