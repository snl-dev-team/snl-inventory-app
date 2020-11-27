DELIMITER //


-- RELATIONAL TRIGGERS


        CREATE PROCEDURE product_uses_material_monitor(
            IN oldCount FLOAT,
            IN newCount FLOAT,
            IN usedId INT
        )
        BEGIN
            IF @disable_triggers IS NULL THEN
                SET @disable_triggers = 1;
                UPDATE `material`
                SET
                    `count` = `count` - (newCount - oldCount)
                WHERE `id` = usedId;
                SET @disable_triggers = NULL;
            END IF;
        END//

        CREATE TRIGGER before_insert_product_uses_material
            BEFORE INSERT
            ON `product_uses_material` FOR EACH ROW
        BEGIN
            CALL product_uses_material_monitor(0.0, NEW.count, NEW.material_id);
        END//

        CREATE TRIGGER before_delete_product_uses_material
            BEFORE DELETE
            ON `product_uses_material` FOR EACH ROW
        BEGIN
            CALL product_uses_material_monitor(OLD.count, 0.0, OLD.material_id);
        END//

        CREATE TRIGGER before_update_product_uses_material
            BEFORE UPDATE
            ON `product_uses_material` FOR EACH ROW
        BEGIN
            CALL product_uses_material_monitor(OLD.count, NEW.count, NEW.material_id);
        END//
        


        CREATE PROCEDURE case_uses_material_monitor(
            IN oldCount FLOAT,
            IN newCount FLOAT,
            IN usedId INT
        )
        BEGIN
            IF @disable_triggers IS NULL THEN
                SET @disable_triggers = 1;
                UPDATE `material`
                SET
                    `count` = `count` - (newCount - oldCount)
                WHERE `id` = usedId;
                SET @disable_triggers = NULL;
            END IF;
        END//

        CREATE TRIGGER before_insert_case_uses_material
            BEFORE INSERT
            ON `case_uses_material` FOR EACH ROW
        BEGIN
            CALL case_uses_material_monitor(0.0, NEW.count, NEW.material_id);
        END//

        CREATE TRIGGER before_delete_case_uses_material
            BEFORE DELETE
            ON `case_uses_material` FOR EACH ROW
        BEGIN
            CALL case_uses_material_monitor(OLD.count, 0.0, OLD.material_id);
        END//

        CREATE TRIGGER before_update_case_uses_material
            BEFORE UPDATE
            ON `case_uses_material` FOR EACH ROW
        BEGIN
            CALL case_uses_material_monitor(OLD.count, NEW.count, NEW.material_id);
        END//
        


        CREATE PROCEDURE case_uses_product_monitor(
            IN oldCount INT,
            IN newCount INT,
            IN usedId INT
        )
        BEGIN
            IF @disable_triggers IS NULL THEN
                SET @disable_triggers = 1;
                UPDATE `product`
                SET
                    `count` = `count` - (newCount - oldCount)
                WHERE `id` = usedId;
                SET @disable_triggers = NULL;
            END IF;
        END//

        CREATE TRIGGER before_insert_case_uses_product
            BEFORE INSERT
            ON `case_uses_product` FOR EACH ROW
        BEGIN
            CALL case_uses_product_monitor(0, NEW.count, NEW.product_id);
        END//

        CREATE TRIGGER before_delete_case_uses_product
            BEFORE DELETE
            ON `case_uses_product` FOR EACH ROW
        BEGIN
            CALL case_uses_product_monitor(OLD.count, 0, OLD.product_id);
        END//

        CREATE TRIGGER before_update_case_uses_product
            BEFORE UPDATE
            ON `case_uses_product` FOR EACH ROW
        BEGIN
            CALL case_uses_product_monitor(OLD.count, NEW.count, NEW.product_id);
        END//
        


        CREATE PROCEDURE order_uses_case_monitor(
            IN oldCount INT,
            IN newCount INT,
            IN usedId INT
        )
        BEGIN
            IF @disable_triggers IS NULL THEN
                SET @disable_triggers = 1;
                UPDATE `case`
                SET
                    `count` = `count` - (newCount - oldCount)
                WHERE `id` = usedId;
                SET @disable_triggers = NULL;
            END IF;
        END//

        CREATE TRIGGER before_insert_order_uses_case
            BEFORE INSERT
            ON `order_uses_case` FOR EACH ROW
        BEGIN
            CALL order_uses_case_monitor(0, NEW.count, NEW.case_id);
        END//

        CREATE TRIGGER before_delete_order_uses_case
            BEFORE DELETE
            ON `order_uses_case` FOR EACH ROW
        BEGIN
            CALL order_uses_case_monitor(OLD.count, 0, OLD.case_id);
        END//

        CREATE TRIGGER before_update_order_uses_case
            BEFORE UPDATE
            ON `order_uses_case` FOR EACH ROW
        BEGIN
            CALL order_uses_case_monitor(OLD.count, NEW.count, NEW.case_id);
        END//
        
-- UPDATE TABLE TRIGGERS


        CREATE TRIGGER after_update_material
            BEFORE UPDATE
            ON `material` FOR EACH ROW
        BEGIN
            SET NEW.date_modified = CURRENT_TIMESTAMP;
        END//
        


        CREATE TRIGGER after_update_product
            BEFORE UPDATE
            ON `product` FOR EACH ROW
        BEGIN
            SET NEW.date_modified = CURRENT_TIMESTAMP;
        END//
        


        CREATE TRIGGER after_update_case
            BEFORE UPDATE
            ON `case` FOR EACH ROW
        BEGIN
            SET NEW.date_modified = CURRENT_TIMESTAMP;
        END//
        


        CREATE TRIGGER after_update_order
            BEFORE UPDATE
            ON `order` FOR EACH ROW
        BEGIN
            SET NEW.date_modified = CURRENT_TIMESTAMP;
        END//
        
-- DELETE TABLE TRIGGERS


        CREATE TRIGGER before_delete_material
            BEFORE DELETE
            ON `material` FOR EACH ROW
        BEGIN
            
        SET @disable_trigger = 1;
        DELETE FROM `product_uses_material`
        WHERE `material_id` = OLD.id;
        SET @disable_trigger = NULL;
        

        SET @disable_trigger = 1;
        DELETE FROM `case_uses_material`
        WHERE `material_id` = OLD.id;
        SET @disable_trigger = NULL;
        
        END//
        


        CREATE TRIGGER before_delete_product
            BEFORE DELETE
            ON `product` FOR EACH ROW
        BEGIN
            
        SET @disable_trigger = 1;
        DELETE FROM `case_uses_product`
        WHERE `product_id` = OLD.id;
        SET @disable_trigger = NULL;
        
        END//
        


        CREATE TRIGGER before_delete_case
            BEFORE DELETE
            ON `case` FOR EACH ROW
        BEGIN
            
        SET @disable_trigger = 1;
        DELETE FROM `order_uses_case`
        WHERE `case_id` = OLD.id;
        SET @disable_trigger = NULL;
        
        END//
        DELIMITER ;

