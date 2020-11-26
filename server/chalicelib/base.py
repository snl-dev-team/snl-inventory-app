# pylint: disable=relative-beyond-top-level
from graphene import ObjectType, InputObjectType, Mutation, Connection, Int, relay
from .constants import TYPE_MAP
from re import findall
from datetime import datetime
from inspect import getmembers, isroutine
from .database import execute_statement, process_select_response
import uuid
from graphql_relay import to_global_id, from_global_id


class Table:
    __table__ = None


class Input(InputObjectType, Table):

    @classmethod
    def get_sql_parameters(cls, item: ObjectType):
        parameters = []
        types = {k: v for k, v in getmembers(cls, lambda m: not isroutine(m))}
        for name, value in vars(item).items():
            curr_type = next(
                (i for i in TYPE_MAP if isinstance(
                    types[name], i['graphene'])),
                None
            )
            if curr_type is not None:
                parameters.append(
                    {'name': name, 'value': {
                        curr_type['boto3']: curr_type['serialize'](value)}}
                )

        return parameters

    @classmethod
    def get_columns(cls):
        columns = []
        types = {k: v for k, v in getmembers(cls, lambda m: not isroutine(m))}
        for name, type_ in types.items():
            curr_type = next(
                (i for i in TYPE_MAP if isinstance(
                    type_, i['graphene'])),
                None
            )
            if curr_type is not None:
                columns.append({
                    'name': name,
                    'serialize': curr_type['serialize'],
                    'deserialize': curr_type['deserialize'],
                    'boto3': curr_type['boto3'],
                })
        return columns

    @classmethod
    def get_column_string(cls, add_tablename: bool = True, add_column_name: bool = True):
        columns = cls.get_columns()
        table_name = f"`{cls.get_table_name()}`." if add_tablename else ''
        def get_column_name(name): return f" {name}" if add_column_name else ''
        column_string = ',\n'.join(
            [f"{table_name}`{c['name']}`{get_column_name(c['name'])}" for c in columns])
        return column_string

    @classmethod
    def get_value_string(cls):
        columns = cls.get_columns()
        value_string = ',\n'.join(f":{i['name']}" for i in columns)
        return value_string

    @classmethod
    def get_update_string(cls):
        columns = cls.get_columns()
        update_string = ',\n'.join(
            f"`{i['name']}` = :{i['name']}"
            for i in columns
        )

        return update_string

    @classmethod
    def get_table_name(cls):
        return findall('[A-Z][^A-Z]*', cls.__name__)[-1].lower()


class Object(ObjectType, Table):

    @classmethod
    def get_columns(cls):
        columns = []
        types = {k: v for k, v in getmembers(cls, lambda m: not isroutine(m))}
        for name, type_ in types.items():
            curr_type = next(
                (i for i in TYPE_MAP if isinstance(
                    type_, i['graphene'])),
                None
            )
            if curr_type is not None:
                columns.append({
                    'name': name,
                    'serialize': curr_type['serialize'],
                    'deserialize': curr_type['deserialize'],
                    'boto3': curr_type['boto3'],
                })
        return columns

    @classmethod
    def get_column_string(cls, add_tablename: bool = True, add_column_name: bool = True):
        columns = cls.get_columns()
        table_name = f"`{cls.__table__}`." if add_tablename else ''
        def get_column_name(name): return f" {name}" if add_column_name else ''
        column_string = ',\n'.join(
            [f"{table_name}`{c['name']}`{get_column_name(c['name'])}" for c in columns])
        return column_string

    @classmethod
    def select_all(cls, after, first):
        sql = f"SELECT {cls.get_column_string()} FROM `{cls.__table__}` LIMIT {first} OFFSET {after};"
        res = execute_statement(sql)
        return process_select_response(res, cls.get_columns())

    @classmethod
    def select_where(cls, id: int):
        sql = f"SELECT {cls.get_column_string()} FROM `{cls.__table__}` WHERE `id` = :id;"
        res = execute_statement(
            sql,
            sql_parameters=[{'name': 'id', 'value': {'stringValue': id}}]
        )
        rows = process_select_response(res, cls.get_columns())
        return rows[0] if rows else None

    @classmethod
    def select_uses(user: ObjectType, id: int, used: ObjectType):
        sql = f"""
        SELECT
            {used.get_column_string()},
            `{user.__table__}_uses_{used.__table__}`.`count` count_used
        FROM
            `{user.__table__}`,
            `{user.__table__}_uses_{used.__table__}`,
            `{used.__table__}`
        WHERE
            `{user.__table__}`.`id` = :{user.__table__}_id
            AND `{user.__table__}_uses_{used.__table__}`.`{user.__table__}_id` = `{user.__table__}`.`id`
            AND `{user.__table__}_uses_{used.__table__}`.`{used.__table__}_id` = `{used.__table__}`.`id`;
        """
        res = execute_statement(
            sql,
            sql_parameters=[
                {'name': f'{user.__table__}_id', 'value': {'stringValue': id}}
            ]
        )

        used_columns = used.get_columns()
        count_type = next(
            (i for i in used_columns if i['name'] == 'count'), None)

        columns = used.get_columns() + [
            {
                'name': 'count_used',
                'serialize': count_type['serialize'],
                'deserialize': count_type['deserialize'],
                'boto3': count_type['boto3'],
            }
        ]
        return process_select_response(res, columns)

    class Meta:
        interfaces = (relay.Node,)

    @classmethod
    def get_node(cls, info, id):
        node = cls.select_where(id)
        node['id'] = to_global_id(str(cls), id)
        return cls(**node)


class ObjectConnection(Connection, Table):

    total_count = Int()

    @staticmethod
    def resolve_total_count(parent, info):
        return 0

    class Meta:
        node = Object


class Create(Mutation, Table):
    @classmethod
    def commit(cls, item: Input):
        id = str(uuid.uuid1())
        sql = f"""
        INSERT INTO
            `{cls.__table__}` (
                `id`,
                {item.get_column_string(
                    add_tablename=False, add_column_name=False)}
            )
            VALUES (
                :id,
                {item.get_value_string()}
            )
        """
        execute_statement(
            sql,
            sql_parameters=item.get_sql_parameters(item) + [
                {'name': 'id', 'value': {'stringValue': id}}
            ])

        date_created = date_modified = datetime.utcnow()
        global_id = to_global_id(str(cls), id)
        return item.to_output(global_id, date_created, date_modified)

    @staticmethod
    def mutate(parent, info, id):
        pass


class Update(Mutation, Table):
    @classmethod
    def commit(cls, id: str, item: Input):
        _, item_id = from_global_id(id)
        sql = f"""
        UPDATE `{cls.__table__}`
        SET 
            {item.get_update_string()}
        WHERE `id` = :id;
        """
        parameters = item.get_sql_parameters(
            item) + [{'name': 'id', 'value': {'stringValue': item_id}}]

        execute_statement(
            sql,
            sql_parameters=parameters
        )

        sql = f"""
        SELECT
            `date_created`
        FROM `{cls.__table__}`
        WHERE id = :id;
        """
        parameters = [{'name': 'id', 'value': {'stringValue': item_id}}]
        res = execute_statement(sql, sql_parameters=parameters)

        rows = process_select_response(res, [{
            'name': 'date_created',
            'serialize': lambda x: x.isoformat(),
            'deserialize': datetime.fromisoformat,
            'boto3': 'stringValue',
        }])
        date_created = rows[0]['date_created'] if rows else None
        date_modified = datetime.utcnow()

        return item.to_output(id, date_created, date_modified)

    @staticmethod
    def mutate(parent, info, id):
        pass


class Delete(Mutation, Table):
    @classmethod
    def commit(cls, id: int):
        sql = f"""
        DELETE FROM
            `{cls.__table__}`
        WHERE id = :id;
        """
        execute_statement(sql, sql_parameters=[
                          {'name': 'id', 'value': {'stringValue': id}}])

    @staticmethod
    def mutate(parent, info, id):
        pass


class Use(Mutation, Table):
    @classmethod
    def commit(user, used, user_id, used_id, count):
        sql = f"""
        REPLACE INTO 
            `{user.__table__}_uses_{used.__table__}` (
                `{user.__table__}_id`,
                `{used.__table__}_id`,
                `count`
            )
        VALUES (
            {user_id},
            {used_id},
            {count}
        )
        """

        execute_statement(sql)

    @staticmethod
    def mutate(parent, info, id):
        pass


class Unuse(Mutation, Table):
    @classmethod
    def commit(user, used, user_id, used_id):
        sql = f"""
        DELETE FROM 
            `{user.__table__}_uses_{used.__table__}`
        WHERE 
            `{user.__table__}_id` = {user_id} 
            AND `{used.__table__}_id` = {used_id};
        """

        execute_statement(sql)

    @staticmethod
    def mutate(parent, info, id):
        pass
