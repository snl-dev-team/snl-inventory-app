# pylint: disable=relative-beyond-top-level
from graphene import ObjectType, InputObjectType, Mutation, Connection, relay
from re import findall
from datetime import datetime
from inspect import getmembers, isroutine
from .database import execute_statement, process_select_response
from graphql_relay import to_global_id, from_global_id
from .types import Integer, BaseType, DateTime


class Table:
    __table__ = None


class Base(Table):

    @classmethod
    def members(cls):
        for name, column in getmembers(cls, lambda m: isinstance(m, BaseType)):
            yield name, column

    @classmethod
    def get_parameters(cls, item):
        return [
            {
                'name': name,
                'value': {column.boto3: column.serialize(value)}
                if column.serialize(value) is not None
                else {'isNull': True}
            }
            for name, column in cls.members()
            for item_name, value in vars(item).items()
            if name == item_name
        ]

    @classmethod
    def get_column_string(cls, add_tablename: bool = True, add_column_name: bool = True):

        table_name = f"`{cls.__table__}`." if add_tablename else ''

        def get_column_name(name):
            return f" {name}" if add_column_name else ''

        return ',\n'.join([
            f"{table_name}`{name}`{get_column_name(name)}"
            for name, _ in cls.members()
        ])

    @classmethod
    def get_value_string(cls):
        return ',\n'.join(f":{name}" for name, _ in cls.members())

    @classmethod
    def get_update_string(cls):
        return ',\n'.join(f"`{name}` = :{name}" for name, _ in cls.members())


class Input(InputObjectType, Base):
    pass


class Object(ObjectType, Base):

    @classmethod
    def select_all(cls):
        sql = f"SELECT {cls.get_column_string()} FROM `{cls.__table__}`;"
        res = execute_statement(sql)
        return process_select_response(res, list(cls.members()))

    @classmethod
    def select_where(cls, id: int):
        sql = f"SELECT {cls.get_column_string()} FROM `{cls.__table__}` WHERE `id` = :id;"
        res = execute_statement(
            sql,
            sql_parameters=[{'name': 'id', 'value': {'longValue': id}}]
        )
        rows = process_select_response(res, list(cls.members()))
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
                {'name': f'{user.__table__}_id', 'value': {'longValue': id}}]
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

    total_count = Integer()

    @staticmethod
    def resolve_total_count(parent, info):
        return 0

    class Meta:
        node = Object


class Create(Mutation, Table):
    @classmethod
    def commit(cls, item: Input):
        sql = f"""
        INSERT INTO
            `{cls.__table__}` (
                {item.get_column_string(
                    add_tablename=False, add_column_name=False)}
            )
            VALUES (
                {item.get_value_string()}
            )
        """
        res = execute_statement(sql, item.get_parameters(item))
        created_id = res['generatedFields'][0]['longValue']
        date_created = date_modified = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        date_created = date_modified = datetime.utcnow()
        global_id = to_global_id(str(cls), created_id)
        return item.to_output(global_id, date_created, date_modified)

    @staticmethod
    def mutate(parent, info, id):
        pass


class Update(Mutation, Table):
    @classmethod
    def commit(cls, id: int, item: Input):
        item_id = int(from_global_id(id)[1])
        sql = f"""
        UPDATE `{cls.__table__}`
        SET 
            {item.get_update_string()}
        WHERE `id` = :id;
        """
        parameters = item.get_parameters(
            item) + [{'name': 'id', 'value': {'longValue': item_id}}]

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
        parameters = [{'name': 'id', 'value': {'longValue': item_id}}]
        res = execute_statement(sql, sql_parameters=parameters)
        print(res)
        rows = process_select_response(res, [['date_created', DateTime]])
        date_created = rows[0]['date_created'] if rows else None
        date_modified = datetime.utcnow()

        return item.to_output(id, date_created, date_modified)

    @staticmethod
    def mutate(parent, info, id):
        pass


class Delete(Mutation, Table):
    @classmethod
    def commit(cls, id: int):
        item_id = int(from_global_id(id)[1])
        sql = f"""
        DELETE FROM
            `{cls.__table__}`
        WHERE id = :id;
        """
        execute_statement(sql, sql_parameters=[
                          {'name': 'id', 'value': {'longValue': item_id}}])

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
