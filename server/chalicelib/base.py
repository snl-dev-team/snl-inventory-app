# pylint: disable=relative-beyond-top-level
from graphene import ObjectType, InputObjectType, Mutation, Connection, relay, ID
from re import findall
from datetime import datetime
from inspect import getmembers, isroutine
from .database import execute_statement, process_select_response
from graphql_relay import to_global_id, from_global_id
from .types import Integer, BaseType, DateTime, Integer


class Table:
    __tablename__ = None


class Base(Table):

    @classmethod
    def members(cls):
        for name, column in getmembers(cls, lambda m: isinstance(m, BaseType) or isinstance(m, ID)):
            if isinstance(column, ID):
                column.python = int
                column.boto3 = 'longValue'
                column.serialize = lambda x: x
                column.deserialize = lambda x: x
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

        table_name = f"`{cls.__tablename__}`." if add_tablename else ''

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

    @classmethod
    def rows_to_global_id(cls, rows):
        return [cls.row_to_global_id(row) for row in rows]

    @classmethod
    def row_to_global_id(cls, row):
        row['id'] = to_global_id(cls.__tablename__.capitalize(), row['id'])
        return row


class Input(InputObjectType, Base):
    pass


class Object(ObjectType, Base):

    @classmethod
    def select_all(cls):
        sql = f"SELECT {cls.get_column_string()} FROM `{cls.__tablename__}`;"
        res = execute_statement(sql)

        rows = process_select_response(res, list(cls.members()))
        return cls.rows_to_global_id(rows)

    @classmethod
    def select_where(cls, id):
        if isinstance(id, str):
            item_id = int(from_global_id(id)[1])
        else:
            item_id = id

        sql = f"SELECT {cls.get_column_string()} FROM `{cls.__tablename__}` WHERE `id` = :id;"
        res = execute_statement(
            sql,
            sql_parameters=[{'name': 'id', 'value': {'longValue': item_id}}]
        )
        rows = process_select_response(res, list(cls.members()))
        return cls.row_to_global_id(rows[0]) if rows else None

    @classmethod
    def select_uses(user: ObjectType, id: str, used: ObjectType):
        id = int(from_global_id(id)[1])
        sql = f"""
        SELECT
            {used.get_column_string()},
            `{user.__tablename__}_uses_{used.__tablename__}`.`count` count_used
        FROM
            `{user.__tablename__}`,
            `{user.__tablename__}_uses_{used.__tablename__}`,
            `{used.__tablename__}`
        WHERE
            `{user.__tablename__}`.`id` = :{user.__tablename__}_id
            AND `{user.__tablename__}_uses_{used.__tablename__}`.`{user.__tablename__}_id` = `{user.__tablename__}`.`id`
            AND `{user.__tablename__}_uses_{used.__tablename__}`.`{used.__tablename__}_id` = `{used.__tablename__}`.`id`;
        """
        res = execute_statement(
            sql,
            sql_parameters=[
                {'name': f'{user.__tablename__}_id', 'value': {'longValue': id}}]
        )
        rows = process_select_response(
            res, list(used.members()) + [('count_used', used.count)])
        return used.rows_to_global_id(rows)

    @classmethod
    def select_ships(user: ObjectType, id: str, used: ObjectType):
        id = int(from_global_id(id)[1])
        sql = f"""
        SELECT
            {used.get_column_string()},
            `{user.__tablename__}_uses_{used.__tablename__}`.`count_shipped` count_shipped,
            `{user.__tablename__}_uses_{used.__tablename__}`.`count_not_shipped` count_not_shipped
        FROM
            `{user.__tablename__}`,
            `{user.__tablename__}_uses_{used.__tablename__}`,
            `{used.__tablename__}`
        WHERE
            `{user.__tablename__}`.`id` = :{user.__tablename__}_id
            AND `{user.__tablename__}_uses_{used.__tablename__}`.`{user.__tablename__}_id` = `{user.__tablename__}`.`id`
            AND `{user.__tablename__}_uses_{used.__tablename__}`.`{used.__tablename__}_id` = `{used.__tablename__}`.`id`;
        """
        res = execute_statement(
            sql,
            sql_parameters=[
                {'name': f'{user.__tablename__}_id', 'value': {'longValue': id}}]
        )

        return process_select_response(res, list(used.members()) + [('count_shipped', used.count), ('count_not_shipped', used.count)])

    class Meta:
        interfaces = (relay.Node,)

    @classmethod
    def get_node(cls, info, id):
        id = int(id)
        node = cls.select_where(id)
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
            `{cls.__tablename__}` (
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
        global_id = to_global_id(cls.__tablename__.capitalize(), created_id)
        return item.to_output(global_id, date_created, date_modified)

    @staticmethod
    def mutate(parent, info, id):
        pass


class Update(Mutation, Table):
    @classmethod
    def commit(cls, id: int, item: Input):
        item_name, item_id = from_global_id(id)
        item_id = int(item_id)
        sql = f"""
        UPDATE `{cls.__tablename__}`
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
        FROM `{cls.__tablename__}`
        WHERE id = :id;
        """
        parameters = [{'name': 'id', 'value': {'longValue': item_id}}]
        res = execute_statement(sql, sql_parameters=parameters)
        rows = process_select_response(res, [['date_created', DateTime]])
        date_created = rows[0]['date_created'] if rows else None
        date_modified = datetime.utcnow()
        global_id = to_global_id(item_name, item_id)
        return item.to_output(global_id, date_created, date_modified)

    @staticmethod
    def mutate(parent, info, id):
        pass


class Delete(Mutation, Table):
    @classmethod
    def commit(cls, id: int):
        item_id = int(from_global_id(id)[1])
        sql = f"""
        DELETE FROM
            `{cls.__tablename__}`
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
        user_item_id = int(from_global_id(user_id)[1])
        used_item_id = int(from_global_id(used_id)[1])
        sql = f"""
        REPLACE INTO
            `{user.__tablename__}_uses_{used.__tablename__}` (
                `{user.__tablename__}_id`,
                `{used.__tablename__}_id`,
                `count`
            )
        VALUES (
            {user_item_id},
            {used_item_id},
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
        user_item_id = int(from_global_id(user_id)[1])
        used_item_id = int(from_global_id(used_id)[1])
        sql = f"""
        DELETE FROM
            `{user.__tablename__}_uses_{used.__tablename__}`
        WHERE
            `{user.__tablename__}_id` = {user_item_id}
            AND `{used.__tablename__}_id` = {used_item_id};
        """

        execute_statement(sql)

    @staticmethod
    def mutate(parent, info, id):
        pass
