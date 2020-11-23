import graphene
import os
import boto3
import sys
import mysql.connector
from chalice import Chalice, Response, CognitoUserPoolAuthorizer
import json
from datetime import datetime
import logging
from datetime import date, datetime

app = Chalice(app_name='snl-inventory-app')

app.api.cors = True

rds_client = boto3.client('rds-data')
database_secrets_arn = os.environ.get('DATABASE_SECRETS_ARN')
database_name = os.environ.get('DATABASE_NAME')
db_cluster_arn = os.environ.get('DATABASE_CLUSTER_ARN')

authorizer = CognitoUserPoolAuthorizer(
    'snl-inventory-app',
    provider_arns=[
        'arn:aws:cognito-idp:us-east-1:595723023717:userpool/us-east-1_fiXPTAJzP'
    ]
)


def execute_statement(sql, sql_parameters=[]):
    logging.log(logging.INFO, sql)
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
    print(json.dumps(records, indent=2))
    data = []
    for record in records:
        data_row = {}
        for entry, column in zip(record, columns):
            print(entry)
            print(column)
            name, caster, entry_type = column['name'], column['caster'], column['boto3']
            value = entry.get(entry_type, None)
            data_row[name] = None if value is None else caster(value)
        data.append(data_row)
    return data


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
    ('notes',           str,   'stringValue')
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
| notes           | text                                | NO   |     | N/A               |                |
+-----------------+-------------------------------------+------+-----+-------------------+----------------+
"""


@app.route('/material', methods=['POST'], authorizer=authorizer)
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
                    `units`,
                    `notes`
                )
                VALUES (
                    '{name}',
                    '{number}',
                    {count},
                    '{expiration_date}',
                    {price},
                    '{units}',
                    '{notes}'
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


@app.route('/material', methods=['GET'], authorizer=authorizer)
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
        data = process_select_response(res, MATERIAL_COLUMNS)

        return Response(
            body=json.dumps({'data': data}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/material/{id}', methods=['GET'], authorizer=authorizer)
def fetch_material(id):
    try:
        columns_string = ', '.join(i[0] for i in MATERIAL_COLUMNS)
        sql = """
            SELECT
                {columns}
            FROM
                `material`
            WHERE
                `id` = {id};
            """.format(columns=columns_string, id=id)
        res = execute_statement(sql)
        data = process_select_response(res, MATERIAL_COLUMNS)
        return Response(
            body=json.dumps(data[0]),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/material/{id}', methods=['PUT'], authorizer=authorizer)
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
                date_modified = CURRENT_TIMESTAMP,
                notes = '{notes}'
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


@app.route('/material/{id}', methods=['DELETE'], authorizer=authorizer)
def delete_material(id):
    try:
        update_material_sql = """
            DELETE FROM
                `material`
            WHERE id = {id}
            """.format(id=id)

        update_product_uses_material_sql = """
            DELETE FROM
                `product_uses_material`
            WHERE `material_id`={id}
            """.format(id=id)

        update_case_uses_material_sql = """
            DELETE FROM
                `case_uses_material`
            WHERE `material_id`={id}
            """.format(id=id)

        execute_statement(update_product_uses_material_sql)
        execute_statement(update_case_uses_material_sql)
        execute_statement(update_material_sql)

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
    ('count',           int,   'longValue'),
    ('expiration_date', str,   'stringValue'),
    ('date_created',    str,   'stringValue'),
    ('date_modified',   str,   'stringValue'),
    ('completed',       bool,  'booleanValue'),
    ('notes',           str,   'stringValue')
]

PRODUCT_USES_MATERIAL_COLUMNS = [
    ('product_id',      int,    'longValue'),
    ('material_id',     int,    'longValue'),
    ('count',           float,  'doubleValue')
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
| notes           | text             | NO   |     | N/A               |                |
+-----------------+------------------+------+-----+-------------------+----------------+

+-------------+----------------+------+-----+---------+-------+
| Field       | Type           | Null | Key | Default | Extra |
+-------------+----------------+------+-----+---------+-------+
| product_id  | int(11)        | NO   | PRI | NULL    |       |
| material_id | int(11)        | NO   | PRI | NULL    |       |
| count       | float unsigned | NO   |     | NULL    |       |
+-------------+----------------+------+-----+---------+-------+
"""


@app.route('/product', methods=['POST'], authorizer=authorizer)
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
                    `completed`,
                    `notes`
                )
                VALUES (
                    '{name}',
                    '{number}',
                    {count},
                    '{expiration_date}',
                    {completed},
                    '{notes}'
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


@app.route('/product', methods=['GET'], authorizer=authorizer)
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

        data = process_select_response(res, PRODUCT_COLUMNS)

        return Response(
            body=json.dumps({'data': data}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/product/{id}', methods=['GET'], authorizer=authorizer)
def fetch_product(id):
    try:
        columns_string = ', '.join(i[0] for i in PRODUCT_COLUMNS)
        sql = """
            SELECT
                {columns}
            FROM
                `product`
            WHERE
                `id` = {id};
            """.format(columns=columns_string, id=id)
        res = execute_statement(sql)

        data = process_select_response(res, PRODUCT_COLUMNS)

        return Response(
            body=json.dumps(data[0]),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/product/{id}', methods=['PUT'], authorizer=authorizer)
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
                date_modified = CURRENT_TIMESTAMP,
                notes = '{notes}'
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


@app.route('/product/{id}', methods=['DELETE'], authorizer=authorizer)
def delete_product(id):
    try:
        update_product_sql = """
            DELETE FROM
                `product`
            WHERE id = {id}
            """.format(id=id)

        update_product_uses_material_sql = """
            DELETE FROM
                `product_uses_material`
            WHERE `product_id`={id}
            """.format(id=id)

        update_case_uses_product_sql = """
            DELETE FROM
                `case_uses_product`
            WHERE `product_id`={id}
            """.format(id=id)

        execute_statement(update_product_uses_material_sql)
        execute_statement(update_case_uses_product_sql)
        execute_statement(update_product_sql)

        return Response(
            body=json.dumps({}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/product/{id}/material', methods=['GET'])
def fetch_product_uses_material(id):
    columns_string = ', '.join(i[0] for i in PRODUCT_USES_MATERIAL_COLUMNS)
    try:
        sql = """
            SELECT {columns}
            FROM `product_uses_material`
            WHERE `product_id`={id};
        """.format(id=id, columns=columns_string)

        res = execute_statement(sql)

        data = process_select_response(res, PRODUCT_USES_MATERIAL_COLUMNS)
        res_obj = {}

        for r in data:
            res_obj[r['material_id']] = r['count']

        return Response(
            body=json.dumps(res_obj),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/product/{id}/material', methods=['PUT'], authorizer=authorizer)
def product_use_material(id):
    try:
        body = app.current_request.json_body

        update_material_sql = """
            UPDATE `material` SET `count` = CASE
                WHEN {count} > (SELECT IFNULL((SELECT `count` FROM `product_uses_material` WHERE `product_id`={id} AND `material_id`={material_id}), 0)) AND (SELECT IFNULL((SELECT `count` FROM `product_uses_material` WHERE `product_id`={id} AND`material_id`={material_id}), 0)) > 0 THEN `count` - ({count} - (SELECT `count` FROM `product_uses_material` WHERE `product_id`={id} AND`material_id`={material_id}))

                WHEN {count} > (SELECT IFNULL((SELECT `count` FROM `product_uses_material` WHERE `product_id`={id} AND `material_id`={material_id}), 0)) AND (SELECT IFNULL((SELECT `count` FROM `product_uses_material` WHERE `product_id`={id} AND `material_id`={material_id}), 0)) = 0 THEN `count` - {count}

                WHEN {count} < (SELECT IFNULL((SELECT `count` FROM `product_uses_material` WHERE `product_id`={id} AND `material_id`={material_id}), 0)) AND (SELECT IFNULL((SELECT `count` FROM `product_uses_material` WHERE `product_id`={id} AND `material_id`={material_id}), 0)) > 0 THEN `count` + ((SELECT `count` FROM `product_uses_material` WHERE `product_id`={id} AND `material_id`={material_id}) - {count})

                END
            WHERE `id`={material_id};
            """.format(**body, id=id)

        update_product_uses_material_sql = """
            REPLACE INTO `product_uses_material` 
                    (`product_id`,`material_id`, `count`)
                    VALUES ({id}, {material_id}, {count});
        """.format(**body, id=id)

        execute_statement(update_material_sql)
        execute_statement(update_product_uses_material_sql)

        return Response(
            body=json.dumps({}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/product/{id}/material', methods=['DELETE'], authorizer=authorizer)
def product_unuse_material(id):
    try:
        body = app.current_request.json_body

        update_material_sql = """
            UPDATE `material` 
            SET `count` = `count` + (SELECT IFNULL((SELECT `count` FROM `product_uses_material` WHERE `product_id`={id} AND `material_id`={material_id}), 0))
            WHERE `id`={material_id};
        """.format(**body, id=id)

        update_product_uses_material_sql = """
            DELETE FROM `product_uses_material`
            WHERE `product_id`={id} AND `material_id`={material_id};
        """.format(**body, id=id)

        execute_statement(update_material_sql)
        execute_statement(update_product_uses_material_sql)

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
    ('count',           int,   'longValue'),
    ('number',          str,   'stringValue'),
    ('expiration_date', str,   'stringValue'),
    ('date_created',    str,   'stringValue'),
    ('date_modified',   str,   'stringValue'),
    ('shipped',         bool,  'booleanValue'),
    ('notes',           str,   'stringValue')
]

CASE_USE_MATERIAL_COLUMNS = [
    ('case_id',         int,    'longValue'),
    ('material_id',     int,    'longValue'),
    ('count',           float,  'doubleValue')
]

CASE_USE_PRODUCT_COLUMNS = [
    ('case_id',         int,    'longValue'),
    ('product_id',      int,    'longValue'),
    ('count',           int,    'longValue')
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
| notes           | text             | NO   |     | N/A               |                |
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


@ app.route('/case', methods=['POST'], authorizer=authorizer)
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
                    `shipped`,
                    `notes`
                )
                VALUES (
                    '{name}',
                    '{product_name}',
                    {product_count},
                    {count},
                    '{number}',
                    '{expiration_date}',
                    {shipped},
                    '{notes}'
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


@app.route('/case', methods=['GET'], authorizer=authorizer)
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
        data = process_select_response(res, CASE_COLUMNS)

        return Response(
            body=json.dumps({'data': data}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/case/{id}', methods=['GET'], authorizer=authorizer)
def fetch_case(id):
    try:
        columns_string = ', '.join(i[0] for i in CASE_COLUMNS)
        sql = """
            SELECT
                {columns}
            FROM
                `case`
            WHERE
                    `id` = {id};
            """.format(columns=columns_string)
        res = execute_statement(sql)
        data = process_select_response(res, CASE_COLUMNS)

        return Response(
            body=json.dumps(data[0]),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/case/{id}', methods=['PUT'], authorizer=authorizer)
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
                date_modified = CURRENT_TIMESTAMP,
                notes = '{notes}'
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


@app.route('/case/{id}', methods=['DELETE'], authorizer=authorizer)
def delete_case(id):
    try:
        update_case_sql = """
            DELETE FROM
                `case`
            WHERE id = {id}
            """.format(id=id)

        update_case_uses_material_sql = """
            DELETE FROM
                `case_uses_material`
            WHERE `case_id`={id}
            """.format(id=id)

        update_case_uses_product_sql = """
            DELETE FROM
                `case_uses_product`
            WHERE `case_id`={id}
            """.format(id=id)

        update_order_uses_case_sql = """
            DELETE FROM
                `order_uses_case`
            WHERE `case_id`={id}
            """.format(id=id)

        execute_statement(update_case_uses_material_sql)
        execute_statement(update_case_uses_product_sql)
        execute_statement(update_order_uses_case_sql)
        execute_statement(update_case_sql)

        return Response(
            body=json.dumps({}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/case/{id}/material', methods=['GET'])
def fetch_case_uses_material(id):
    columns_string = ', '.join(i[0] for i in CASE_USE_MATERIAL_COLUMNS)
    try:
        sql = """
            SELECT {columns}
            FROM `case_uses_material`
            WHERE `case_id`={id};
        """.format(id=id, columns=columns_string)

        res = execute_statement(sql)

        data = process_select_response(res, CASE_USE_MATERIAL_COLUMNS)
        res_obj = {}

        for r in data:
            res_obj[r['material_id']] = r['count']

        return Response(
            body=json.dumps(res_obj),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/case/{id}/material', methods=['PUT'], authorizer=authorizer)
def case_use_material(id):
    try:
        body = app.current_request.json_body

        update_material_sql = """
            UPDATE `material` SET `count` = CASE
                WHEN {count} > (SELECT IFNULL((SELECT `count` FROM `case_uses_material` WHERE `case_id`={id} AND `material_id`={material_id}), 0)) AND (SELECT IFNULL((SELECT `count` FROM `case_uses_material` WHERE `case_id`={id} AND`material_id`={material_id}), 0)) > 0 THEN `count` - ({count} - (SELECT `count` FROM `case_uses_material` WHERE `case_id`={id} AND`material_id`={material_id}))

                WHEN {count} > (SELECT IFNULL((SELECT `count` FROM `case_uses_material` WHERE `case_id`={id} AND `material_id`={material_id}), 0)) AND (SELECT IFNULL((SELECT `count` FROM `case_uses_material` WHERE `case_id`={id} AND `material_id`={material_id}), 0)) = 0 THEN `count` - {count}

                WHEN {count} < (SELECT IFNULL((SELECT `count` FROM `case_uses_material` WHERE `case_id`={id} AND `material_id`={material_id}), 0)) AND (SELECT IFNULL((SELECT `count` FROM `case_uses_material` WHERE `case_id`={id} AND `material_id`={material_id}), 0)) > 0 THEN `count` + ((SELECT `count` FROM `case_uses_material` WHERE `case_id`={id} AND `material_id`={material_id}) - {count})

                END
            WHERE `id`={material_id};
        """.format(**body, id=id)

        update_case_uses_material_sql = """
            REPLACE INTO `case_uses_material` 
                (`case_id`,`material_id`, `count`)
                VALUES ({id}, {material_id}, {count});
        """.format(**body, id=id)

        execute_statement(update_material_sql)
        execute_statement(update_case_uses_material_sql)

        return Response(
            body=json.dumps({}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/case/{id}/material', methods=['DELETE'], authorizer=authorizer)
def case_unuse_material(id):
    try:
        body = app.current_request.json_body
        update_material_sql = """
                UPDATE `material` 
                SET `count` = `count` + (SELECT IFNULL((SELECT `count` FROM `case_uses_material` WHERE `case_id`={id} AND `material_id`={material_id}), 0))
                WHERE `id`={material_id};
            """.format(**body, id=id)

        update_case_uses_material_sql = """
            DELETE FROM `case_uses_material`
            WHERE `case_id`={id} AND `material_id`={material_id};
        """.format(**body, id=id)

        execute_statement(update_material_sql)
        execute_statement(update_case_uses_material_sql)

        return Response(
            body=json.dumps({}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/case/{id}/product', methods=['GET'])
def fetch_case_uses_product(id):
    columns_string = ', '.join(i[0] for i in CASE_USE_PRODUCT_COLUMNS)
    try:
        sql = """
            SELECT {columns}
            FROM `case_uses_product`
            WHERE `case_id`={id};
        """.format(id=id, columns=columns_string)

        res = execute_statement(sql)

        data = process_select_response(res, CASE_USE_PRODUCT_COLUMNS)
        res_obj = {}

        for r in data:
            res_obj[r['product_id']] = r['count']

        return Response(
            body=json.dumps(res_obj),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )

        data = process_select_response(res, CASE_USE_PRODUCT_COLUMNS)
        res_obj = {}

        for r in data:
            res_obj[r['product_id']] = r['count']

        return Response(
            body=json.dumps(res_obj),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/case/{id}/product', methods=['PUT'], authorizer=authorizer)
def case_use_product(id):
    try:
        body = app.current_request.json_body

        update_product_sql = """
            UPDATE `product` SET `count` = CASE
                WHEN {count} > (SELECT IFNULL((SELECT `count` FROM `case_uses_product` WHERE `case_id`={id} AND `product_id`={product_id}), 0)) AND (SELECT IFNULL((SELECT `count` FROM `case_uses_product` WHERE `case_id`={id} AND`product_id`={product_id}), 0)) > 0 THEN `count` - ({count} - (SELECT `count` FROM `case_uses_product` WHERE `case_id`={id} AND`product_id`={product_id}))

                WHEN {count} > (SELECT IFNULL((SELECT `count` FROM `case_uses_product` WHERE `case_id`={id} AND `product_id`={product_id}), 0)) AND (SELECT IFNULL((SELECT `count` FROM `case_uses_product` WHERE `case_id`={id} AND `product_id`={product_id}), 0)) = 0 THEN `count` - {count}

                WHEN {count} < (SELECT IFNULL((SELECT `count` FROM `case_uses_product` WHERE `case_id`={id} AND `product_id`={product_id}), 0)) AND (SELECT IFNULL((SELECT `count` FROM `case_uses_product` WHERE `case_id`={id} AND `product_id`={product_id}), 0)) > 0 THEN `count` + ((SELECT `count` FROM `case_uses_product` WHERE `case_id`={id} AND `product_id`={product_id}) - {count})

                END
            WHERE `id`={product_id};
        """.format(**body, id=id)

        update_case_uses_product_sql = """
            REPLACE INTO `case_uses_product` 
                (`case_id`,`product_id`, `count`)
                VALUES ({id}, {product_id}, {count});
        """.format(**body, id=id)

        execute_statement(update_product_sql)
        execute_statement(update_case_uses_product_sql)

        return Response(
            body=json.dumps({}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/case/{id}/product', methods=['DELETE'], authorizer=authorizer)
def case_unuse_product(id):
    try:
        body = app.current_request.json_body

        update_product_sql = """ 
            UPDATE `product` 
            SET `count` = `count` + (SELECT IFNULL((SELECT `count` FROM `case_uses_product` WHERE `case_id`={id} AND `product_id`={product_id}), 0))
            WHERE `id`={product_id};
        """.format(**body, id=id)

        update_case_uses_product_sql = """ 
            DELETE FROM `case_uses_product`
            WHERE `case_id`={id} AND `product_id`={product_id};
        """.format(**body, id=id)

        execute_statement(update_product_sql)
        execute_statement(update_case_uses_product_sql)

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
    ('notes',           str,   'stringValue'),
    ('completed',       bool,  'booleanValue')
]

ORDER_USE_CASE_COLUMNS = [
    ('order_id',        int,    'longValue'),
    ('case_id',         int,    'longValue'),
    ('count',           int,    'longValue')
]

"""
+---------------+--------------+------+-----+-------------------+----------------+
| Field         | Type         | Null | Key | Default           | Extra          |
+---------------+--------------+------+-----+-------------------+----------------+
| id            | int(11)      | NO   | PRI | NULL              | auto_increment |
| number        | varchar(255) | NO   |     | NULL              |                |
| date_created  | datetime     | NO   |     | CURRENT_TIMESTAMP |                |
| date_modified | datetime     | NO   |     | CURRENT_TIMESTAMP |                |
| notes         | text         | NO   |     | N/A               |                |
| completed     | bool         | NO   |     | FALSE             |                |
+---------------+--------------+------+-----+-------------------+----------------+

+----------+------------------+------+-----+---------+-------+
| Field    | Type             | Null | Key | Default | Extra |
+----------+------------------+------+-----+---------+-------+
| order_id | int(11)          | NO   | PRI | NULL    |       |
| case_id  | int(11)          | NO   | PRI | NULL    |       |
| count    | int(10) unsigned | NO   |     | NULL    |       |
+----------+------------------+------+-----+---------+-------+
"""


@app.route('/order', methods=['POST'], authorizer=authorizer)
def create_order():
    try:
        body = app.current_request.json_body

        sql = """
            INSERT INTO
                `order` (
                    `number`,
                    `notes`
                )
                VALUES (
                    '{number}',
                    '{notes}'
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


@app.route('/order', methods=['GET'], authorizer=authorizer)
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
        data = process_select_response(res, ORDER_COLUMNS)

        return Response(
            body=json.dumps({'data': data}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/order/{id}', methods=['GET'], authorizer=authorizer)
def fetch_order(id):
    try:
        columns_string = ', '.join(i[0] for i in ORDER_COLUMNS)
        sql = """
            SELECT
                {columns}
            FROM
                `order`
            WHERE
                `id` = {id};
            """.format(columns=columns_string, id=id)
        res = execute_statement(sql)
        data = process_select_response(res, ORDER_COLUMNS)

        return Response(
            body=json.dumps(data[0]),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/order/{id}', methods=['PUT'], authorizer=authorizer)
def update_order(id):
    try:
        body = app.current_request.json_body
        sql = """
            UPDATE `order` SET
                number = '{number}',
                date_modified = CURRENT_TIMESTAMP,
                notes = '{notes}',
                completed = {completed}
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


@app.route('/order/{id}', methods=['DELETE'], authorizer=authorizer)
def delete_order(id):
    try:
        update_order_sql = """
            DELETE FROM
                `order`
            WHERE id = {id};
            """.format(id=id)

        update_case_sql = """
                UPDATE `case` 
                SET `count` = `count` + (SELECT IFNULL((SELECT `count` FROM `order_uses_case` WHERE `order_id`={id} AND `case_id`={case_id}), 0))
                WHERE `id`={case_id};
            """.format(id=id)

        update_order_uses_case_sql = """
                DELETE FROM `order_uses_case`
                WHERE `order_id`={id} AND `case_id`={case_id};
            """.format(id=id)

        execute_statement(update_case_sql)
        execute_statement(update_order_uses_case_sql)
        execute_statement(update_order_sql)

        return Response(
            body=json.dumps({}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/order/{id}/case', methods=['GET'])
def fetch_order_uses_case(id):
    columns_string = ', '.join(i[0] for i in ORDER_USE_CASE_COLUMNS)
    try:
        sql = """
            SELECT {columns}
            FROM `order_uses_case`
            WHERE `order_id`={id};
        """.format(id=id, columns=columns_string)

        res = execute_statement(sql)

        data = process_select_response(res, ORDER_USE_CASE_COLUMNS)
        res_obj = {}

        for r in data:
            res_obj[r['case_id']] = r['count']

        return Response(
            body=json.dumps(res_obj),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/order/{id}/case', methods=['PUT'], authorizer=authorizer)
def order_use_case(id):
    try:
        body = app.current_request.json_body

        update_case_sql = """
            UPDATE `case` SET `count` = CASE
                WHEN {count} > (SELECT IFNULL((SELECT `count` FROM `order_uses_case` WHERE `order_id`={id} AND `case_id`={case_id}), 0)) AND (SELECT IFNULL((SELECT `count` FROM `order_uses_case` WHERE `order_id`={id} AND`case_id`={case_id}), 0)) > 0 THEN `count` - ({count} - (SELECT `count` FROM `order_uses_case` WHERE `order_id`={id} AND`case_id`={case_id}))

                WHEN {count} > (SELECT IFNULL((SELECT `count` FROM `order_uses_case` WHERE `order_id`={id} AND `case_id`={case_id}), 0)) AND (SELECT IFNULL((SELECT `count` FROM `order_uses_case` WHERE `order_id`={id} AND `case_id`={case_id}), 0)) = 0 THEN `count` - {count}

                WHEN {count} < (SELECT IFNULL((SELECT `count` FROM `order_uses_case` WHERE `order_id`={id} AND `case_id`={case_id}), 0)) AND (SELECT IFNULL((SELECT `count` FROM `order_uses_case` WHERE `order_id`={id} AND `case_id`={case_id}), 0)) > 0 THEN `count` + ((SELECT `count` FROM `order_uses_case` WHERE `order_id`={id} AND `case_id`={case_id}) - {count})

                END
            WHERE `id`={case_id};
        """.format(**body, id=id)

        update_order_uses_case_sql = """
            REPLACE INTO `order_uses_case` 
                (`order_id`,`case_id`, `count`)
                VALUES ({id}, {case_id}, {count});
        """.format(**body, id=id)

        execute_statement(update_case_sql)
        execute_statement(update_order_uses_case_sql)

        return Response(
            body=json.dumps({}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/order/{id}/case', methods=['DELETE'], authorizer=authorizer)
def order_unuse_case(id):
    try:
        body = app.current_request.json_body

        update_case_sql = """
                UPDATE `case` 
                SET `count` = `count` + (SELECT IFNULL((SELECT `count` FROM `order_uses_case` WHERE `order_id`={id} AND `case_id`={case_id}), 0))
                WHERE `id`={case_id};
            """.format(**body, id=id)

        update_order_uses_case_sql = """
                DELETE FROM `order_uses_case`
                WHERE `order_id`={id} AND `case_id`={case_id};
            """.format(**body, id=id)

        execute_statement(update_case_sql)
        execute_statement(update_order_uses_case_sql)

        return Response(
            body=json.dumps({}),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/graphql', methods=['POST'])
def graphql():
    query = json.loads(app.current_request.raw_body.decode())['query']
    result = schema.execute(query)
    return result.data


class ObjectTypeBase(graphene.ObjectType):

    TYPE_MAP = [
        {
            'graphene': graphene.types.scalars.Int,
            'caster': int,
            'boto3': 'longValue',
        },
        {
            'graphene': graphene.types.scalars.String,
            'caster': str,
            'boto3': 'stringValue',
        },
        {
            'graphene': graphene.types.scalars.Float,
            'caster': float,
            'boto3': 'doubleValue',
        },
        {
            'graphene': graphene.types.scalars.Boolean,
            'caster': bool,
            'boto3': 'booleanValue',
        },
        {
            'graphene': graphene.types.datetime.Date,
            'caster': date.fromisoformat,
            'boto3': 'stringValue',
        },
        {
            'graphene': graphene.types.datetime.DateTime,
            'caster': datetime.fromisoformat,
            'boto3': 'stringValue',
        }
    ]

    def __init__(self, table_name, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.table_name = table_name

    def get_sql_parameters(self):
        parameters = []
        types = type(self).__dict__
        for name, value in self.__dict__.items():
            curr_type = next(
                (i for i in self.TYPE_MAP if isinstance(
                    types[name], i['graphene'])),
                None
            )
            if curr_type is not None:
                parameters.append(
                    {'name': name, 'value': {curr_type['boto3']: value}}
                )

        return parameters

    @classmethod
    def get_columns(cls):
        columns = []
        types = cls.__dict__
        for name, type_ in types.items():
            curr_type = next(
                (i for i in cls.TYPE_MAP if isinstance(
                    type_, i['graphene'])),
                None
            )
            if curr_type is not None:
                columns.append({
                    'name': name,
                    'caster': curr_type['caster'],
                    'boto3': curr_type['boto3'],
                })
        return columns

    @classmethod
    def get_column_string(cls):
        columns = cls.get_columns()
        column_string = ',\n'.join(
            [f"`{cls.__name__.lower()}`.`{c['name']}`" for c in columns])
        print(column_string)
        return column_string


class Material(ObjectTypeBase):
    id = graphene.Int()
    name = graphene.String()
    number = graphene.String()
    count = graphene.Float()
    expiration_date = graphene.Date()
    date_created = graphene.DateTime()
    date_modified = graphene.DateTime()
    price = graphene.Int()
    units = graphene.String()
    notes = graphene.String()


class Product(ObjectTypeBase):
    id = graphene.Int()
    name = graphene.String()
    number = graphene.String()
    count = graphene.Int()
    expiration_date = graphene.Date()
    date_created = graphene.DateTime()
    date_modified = graphene.DateTime()
    notes = graphene.String()
    completed = graphene.Boolean()
    materials = graphene.List(Material)

    @staticmethod
    def resolve_materials(parent, info):
        sql = f"""
        SELECT
            {Material.get_column_string()}
            `product_uses_material`.`count` count
        FROM
            `product`,
            `product_uses_material`,
            `material`
        WHERE
            `product`.`id` = :product_id
            AND `product_uses_material`.`product_id` = :product_id;

        """
        res = execute_statement(
            sql,
            sql_parameters=[
                {'name': 'product_id', 'value': {'longValue': parent['id']}}
            ]
        )
        return process_select_response(res, Material.get_columns())


class Case(ObjectTypeBase):
    id = graphene.Int()
    name = graphene.String()
    product_name = graphene.String()
    product_count = graphene.Int()
    count = graphene.Float()
    number = graphene.String()
    expiration_date = graphene.Date()
    date_created = graphene.DateTime()
    date_modified = graphene.DateTime()
    shipped = graphene.Boolean()
    notes = graphene.String()
    materials = graphene.List(Material)
    products = graphene.List(Product)

    @staticmethod
    def resolve_materials(parent, info):
        sql = f"""
        SELECT
            {Material.get_column_string()},
            `case_uses_material`.`count` use_count
        FROM
            `case`,
            `case_uses_material`,
            `material`
        WHERE
            `case`.id = :case_id
            AND `case_uses_material`.`case_id` = :case_id;
        """
        parameters = [{'name': 'case_id', 'value': {
            'longValue': parent['id']}}]
        res = execute_statement(sql, sql_parameters=parameters)
        return process_select_response(res, Material.get_columns())

    @staticmethod
    def resolve_products(parent, info):
        sql = f"""
        SELECT
            {Product.get_column_string()},
            `case_uses_product`.`count` use_count
        FROM
            `case`,
            `case_uses_product`,
            `product`
        WHERE
            `case`.id = :case_id
            AND `case_uses_product`.case_id = :case_id;
        """
        parameters = [{'name': 'case_id', 'value': {
            'longValue': parent['id']}}]
        res = execute_statement(sql, sql_parameters=parameters)
        return process_select_response(res, Product.get_columns())


class Order(ObjectTypeBase):
    id = graphene.Int()
    number = graphene.String()
    date_created = graphene.DateTime()
    date_modified = graphene.DateTime()
    notes = graphene.String()
    cases = graphene.List(Case)

    @staticmethod
    def resolve_cases(parent, info):
        sql = f"""
        SELECT
            {Case.get_column_string()},
            `order_uses_case`.`count` use_count
        FROM
            `order`,
            `order_uses_case`,
            `case`
        WHERE
            `order`.id = :order_id
            AND `order_uses_case`.order_id = :order_id;
        """
        parameters = [{'name': 'order_id', 'value': {
            'longValue': parent['id']}}]
        res = execute_statement(sql, sql_parameters=parameters)
        return process_select_response(res, Case.get_columns())


class Query(graphene.ObjectType):
    materials = graphene.List(Material)
    material = graphene.Field(Material, id=graphene.Int(required=True))

    products = graphene.List(Product)
    product = graphene.Field(Product, id=graphene.Int(required=True))

    cases = graphene.List(Case)
    case = graphene.Field(Case, id=graphene.Int(required=True))

    orders = graphene.List(Order)
    order = graphene.Field(Order, id=graphene.Int(required=True))

    @staticmethod
    def resolve_materials(parent, info):
        sql = f"SELECT {Material.get_column_string()} FROM material;"
        res = execute_statement(sql)
        return process_select_response(res, Material.get_columns())

    @staticmethod
    def resolve_material(parent, info, id):
        sql = f"""
        SELECT
            {Material.get_column_string()}
        FROM `material` WHERE `id` = :id;
        """
        res = execute_statement(
            sql,
            sql_parameters=[{'name': 'id', 'value': {'longValue': id}}],
        )
        rows = process_select_response(res, Material.get_columns())
        return rows[0] if rows else None

    @staticmethod
    def resolve_products(parent, info):
        sql = f"""
        SELECT
            {Product.get_column_string()}
        FROM `product`;
        """
        res = execute_statement(sql)
        return process_select_response(res, Product.get_columns())

    @staticmethod
    def resolve_product(parent, info, id):
        sql = f"""
        SELECT
            {Product.get_column_string()}
        FROM `product` WHERE `id` = :id;
        """
        res = execute_statement(
            sql,
            sql_parameters=[{'name': 'id', 'value': {'longValue': id}}]
        )
        rows = process_select_response(res, Product.get_columns())
        return rows[0] if rows else None

    @staticmethod
    def resolve_cases(parent, info):
        sql = f"SELECT {Case.get_column_string()} FROM `case`;"
        res = execute_statement(sql)
        return process_select_response(res, Case.get_columns())

    @staticmethod
    def resolve_case(parent, info, id):
        sql = f"SELECT {Case.get_column_string()} FROM `case` WHERE `id` = :id;"
        res = execute_statement(
            sql,
            sql_parameters=[{'name': 'id', 'value': {'longValue': id}}]
        )
        rows = process_select_response(res, Case.get_columns())
        return rows[0] if rows else None

    @ staticmethod
    def resolve_orders(parent, info):
        sql = f"SELECT {Order.get_column_string()} FROM `order`;"
        res = execute_statement(sql)
        return process_select_response(res, Order.get_columns())

    @ staticmethod
    def resolve_order(parent, info, id):
        sql = f"SELECT{Order.get_column_string()} FROM `order` WHERE `id` = :id;"
        res = execute_statement(
            sql,
            sql_parameters=[{'name': 'id', 'value': {'longValue': id}}],
        )
        rows = process_select_response(res, Order.get_columns())
        return rows[0] if rows else None


class MaterialInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    number = graphene.String(required=True)
    count = graphene.Float(required=True)
    expiration_date = graphene.Date(required=True)
    price = graphene.Int(required=True)
    units = graphene.String(required=True)
    notes = graphene.String(required=True)


class CreateMaterial(graphene.Mutation):
    class Arguments:
        material = MaterialInput(required=True)

    material = graphene.Field(Material)

    @ staticmethod
    def mutate(parent, info, material):
        sql = """
        INSERT INTO
            `material` (
                `name`,
                `number`,
                `count`,
                `expiration_date`,
                `price`,
                `units`,
                `notes`
            )
            VALUES (
                :name,
                :number,
                :count,
                :expiration_date,
                :price,
                :units,
                :notes
            )
        """
        parameters = material.get_sql_parameters()
        res = execute_statement(sql, sql_parameters=parameters)
        created_id = res['generatedFields'][0]['longValue']
        date_created = date_modified = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        return {
            'material': material.create_material(created_id, date_created, date_modified)
        }


class Mutation(graphene.ObjectType):
    create_material = CreateMaterial.Field()


schema = graphene.Schema(
    query=Query,
    mutation=Mutation
)


# print(schema.execute("""
#   mutation
#   matMul {
#     createMaterial(material: {name: "test", number: "lot 123", count: 2.0, expirationDate: "2020-09-09", price: 10, units: "kg", notes: ""}) {
#       material {
#           units
#           id
#       }
#     }
#   }
# """))
