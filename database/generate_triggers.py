

def create_relation_trigger():

    RELATIONS = [
        ('product', 'material', 'FLOAT',    '0.0'),
        ('case',    'material', 'FLOAT',    '0.0'),
        ('case',    'product',  'INT',      '0'),
        ('order',   'case',     'INT',      '0')
    ]

    def fill_template(user, used, count_type, zero):
        return f"""
        CREATE PROCEDURE {user}_uses_{used}_monitor(
            IN oldCount {count_type},
            IN newCount {count_type},
            IN usedId INT
        )
        BEGIN
            UPDATE `{used}`
            SET
                `count` = `count` - (newCount - oldCount)
            WHERE `id` = usedId;
        END//

        CREATE TRIGGER before_insert_{user}_uses_{used}
            BEFORE INSERT
            ON `{user}_uses_{used}` FOR EACH ROW
        BEGIN
            CALL {user}_uses_{used}_monitor({zero}, NEW.count);
        END//

        CREATE TRIGGER before_delete_{user}_uses_{used}
            BEFORE DELETE
            ON `{user}_uses_{used}` FOR EACH ROW
        BEGIN
            CALL {user}_uses_{used}_monitor(OLD.count, {zero});
        END//

        CREATE TRIGGER before_update_{user}_uses_{used}
            BEFORE UPDATE
            ON `{user}_uses_{used}` FOR EACH ROW
        BEGIN
            CALL {user}_uses_{used}_monitor(OLD.count, NEW.count);
        END//
        """

    return '\n\n'.join(fill_template(*relation)
                       for relation in RELATIONS)


def create_update_table_trigger():

    TABLES = [
        'material',
        'product',
        'case',
        'order'
    ]

    def fill_template(table):
        return f"""
        CREATE TRIGGER after_update_{table}
            AFTER UPDATE
            ON `{table}` FOR EACH ROW
        BEGIN
            UPDATE `{table}`
            SET date_modified = CURRENT_TIMESTAMP
            WHERE  `id` = NEW.id;
        END//
        """

    return '\n\n'.join(fill_template(table)
                       for table in TABLES)


def create_delete_table_trigger():

    RELATIONS = [
        ('material',    ['product', 'case']),
        ('product',     ['case']),
        ('case',        ['order']),
    ]

    def fill_template(used, users):

        actions = '\n'.join(f"""
            DELETE FROM `{user}_uses_{used}`
            WHERE `{used}_id` = OLD.id;
        """ for user in users)

        return f"""
        CREATE TRIGGER before_delete_{used}
            BEFORE DELETE
            ON `{used}` FOR EACH ROW
        BEGIN
            {actions}
        END//
        """

    return '\n\n'.join(fill_template(*relation) for relation in RELATIONS)


if __name__ == '__main__':
    with open('create_triggers.sql', 'w') as f:

        f.write('DELIMITER //\n\n')

        f.write('\n-- RELATIONAL TRIGGERS\n\n')
        f.write(create_relation_trigger())

        f.write('\n-- UPDATE TABLE TRIGGERS\n\n')
        f.write(create_update_table_trigger())

        f.write('\n-- DELETE TABLE TRIGGERS\n\n')
        f.write(create_delete_table_trigger())

        f.write('DELIMITER ;\n\n')
