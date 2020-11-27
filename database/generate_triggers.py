

def create_uses_trigger():

    RELATIONS = [
        ('product', 'material', 'FLOAT',    '0.0'),
        ('case',    'material', 'FLOAT',    '0.0'),
        ('case',    'product',  'INT',      '0'),
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

        CREATE TRIGGER before_insert_{user}_uses_{used}
            BEFORE INSERT
            ON `{user}_uses_{used}` FOR EACH ROW
        BEGIN
            CALL {user}_uses_{used}_monitor({zero}, NEW.count, NEW.{used}_id);
        END//

        CREATE TRIGGER before_delete_{user}_uses_{used}
            BEFORE DELETE
            ON `{user}_uses_{used}` FOR EACH ROW
        BEGIN
            CALL {user}_uses_{used}_monitor(OLD.count, {zero}, OLD.{used}_id);
        END//

        CREATE TRIGGER before_update_{user}_uses_{used}
            BEFORE UPDATE
            ON `{user}_uses_{used}` FOR EACH ROW
        BEGIN
            CALL {user}_uses_{used}_monitor(OLD.count, NEW.count, NEW.{used}_id);
        END//
        """

    return '\n\n'.join(fill_template(*relation)
                       for relation in RELATIONS)


def create_ships_trigger():
    user = 'order'
    used = 'case'
    count_type = 'INT'
    zero = '0'

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
    
    CREATE PROCEDURE {user}_ships_{used}_monitor(
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

    CREATE TRIGGER before_insert_{user}_uses_{used}
        BEFORE INSERT
        ON `{user}_uses_{used}` FOR EACH ROW
    BEGIN
        CALL {user}_uses_{used}_monitor({zero}, NEW.count, NEW.{used}_id);
    END//

    CREATE TRIGGER before_delete_{user}_uses_{used}
        BEFORE DELETE
        ON `{user}_uses_{used}` FOR EACH ROW
    BEGIN
        CALL {user}_uses_{used}_monitor(OLD.count, {zero}, OLD.{used}_id);
    END//

    CREATE TRIGGER before_update_{user}_uses_{used}
        BEFORE UPDATE
        ON `{user}_uses_{used}` FOR EACH ROW
    BEGIN
        CALL {user}_uses_{used}_monitor(OLD.count, NEW.count, NEW.{used}_id);
    END//

    """


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
            BEFORE UPDATE
            ON `{table}` FOR EACH ROW
        BEGIN
            SET NEW.date_modified = CURRENT_TIMESTAMP;
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
        SET @disable_trigger = 1;
        DELETE FROM `{user}_uses_{used}`
        WHERE `{used}_id` = OLD.id;
        SET @disable_trigger = NULL;
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
        f.write(create_uses_trigger())
        f.write(create_ships_trigger())

        f.write('\n-- UPDATE TABLE TRIGGERS\n\n')
        f.write(create_update_table_trigger())

        f.write('\n-- DELETE TABLE TRIGGERS\n\n')
        f.write(create_delete_table_trigger())

        f.write('DELIMITER ;\n\n')
