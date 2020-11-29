def create_relation_triggers():

    RELATIONS = [
        ('product', 'material', 'FLOAT',    '0.0'),
        ('case',    'material', 'FLOAT',    '0.0'),
        ('case',    'product',  'INT',      '0'),
        ('order',   'case',     'INT',      '0'),
    ]

    def fill_template(user, used, count_type, zero):
        return f"""
        CREATE PROCEDURE {user}_uses_{used}_monitor(
            IN oldCount {count_type},
            IN newCount {count_type},
            IN usedId INT
        )
        BEGIN
            IF @disable_triggers IS NULL THEN
                SET @disable_triggers = 1;
                UPDATE `{used}`
                SET
                    `count` = `count` - (newCount - oldCount)
                WHERE `id` = usedId;
                SET @disable_triggers = NULL;
            END IF;
        END//
        CREATE TRIGGER after_insert_{user}_uses_{used}
            AFTER INSERT
            ON `{user}_uses_{used}` FOR EACH ROW
        BEGIN
            CALL {user}_uses_{used}_monitor({zero}, NEW.count, NEW.{used}_id);
        END//
        CREATE TRIGGER after_delete_{user}_uses_{used}
            AFTER DELETE
            ON `{user}_uses_{used}` FOR EACH ROW
        BEGIN
            CALL {user}_uses_{used}_monitor(OLD.count, {zero}, OLD.{used}_id);
        END//
        CREATE TRIGGER after_update_{user}_uses_{used}
            AFTER UPDATE
            ON `{user}_uses_{used}` FOR EACH ROW
        BEGIN
            CALL {user}_uses_{used}_monitor(OLD.count, NEW.count, NEW.{used}_id);
        END//
        """

    return '\n\n'.join(fill_template(*relation)
                       for relation in RELATIONS)


# def create_table_triggers():

#     TABLES = [
#         'order',
#         'case',
#         'product',
#         'material',
#     ]

#     USEE_TO_USERS = {
#         'order': [],
#         'case': ['order'],
#         'product': ['case'],
#         'material': ['case', 'product']
#     }

#     USER_TO_USEES = {
#         'order': ['case'],
#         'case': ['product', 'material'],
#         'product': ['material'],
#         'material': []
#     }

#     def fill_template(table, users, usees):
#         delete_user = '\n\n'.join(f"""
#         IF @disable_triggers IS NULL THEN
#             DELETE FROM `{user}_uses_{table}`
#             WHERE `{user}_id` = OLD.id;
#             SET @disable_triggers = NULL;
#         END IF;
#         """ for user in users)

#         delete_used = '\n\n'.join(f"""
#         IF @disable_triggers IS NULL THEN
#             SET @disable_triggers = 1;
#             DELETE FROM `{table}_uses_{used}`
#             WHERE `{used}_id` = OLD.id;
#             SET @disable_triggers = NULL;
#         END IF;
#         """ for used in usees)

#         return f"""
#         CREATE TRIGGER before_delete_{table}
#             BEFORE DELETE
#             ON `{table}` FOR EACH ROW
#         BEGIN
#             {delete_user}
#             {delete_used}

#         END//
#         """

#     return '\n\n'.join(fill_template(table, USEE_TO_USERS[table], USER_TO_USEES[table]) for table in TABLES)


def create_date_modified_triggers():

    TABLES = [
        'material',
        'product',
        'case',
        'order'
    ]

    def fill_template(table):
        return f"""
        CREATE TRIGGER before_update_{table}
            BEFORE UPDATE
            ON `{table}` FOR EACH ROW
        BEGIN
            SET NEW.date_modified = CURRENT_TIMESTAMP;
        END//
        """

    return '\n\n'.join(fill_template(table)
                       for table in TABLES)


if __name__ == '__main__':
    with open('create_triggers.sql', 'w') as f:

        f.write('DELIMITER //\n\n')

        f.write('\n-- RELATIONAL TRIGGERS\n\n')
        f.write(create_relation_triggers())

        # f.write('\n-- OBJECT TRIGGERS\n\n')
        # f.write(create_table_triggers())

        f.write('\n-- DATE MODIFIED TRIGGERS\n\n')
        f.write(create_date_modified_triggers())

        f.write('DELIMITER ;\n\n')
