DELIMITER //


-- RELATIONAL TRIGGERS


        CREATE PROCEDURE product_uses_material_monitor(
            IN oldCount FLOAT,
            IN newCount FLOAT,
            IN usedId INT
        )
        BEGIN
            UPDATE `material`
            SET
                `count` = `count` - (newCount - oldCount)
            WHERE `id` = usedId;
        END//
        CREATE TRIGGER after_insert_product_uses_material
            AFTER INSERT
            ON `product_uses_material` FOR EACH ROW
        BEGIN
            CALL product_uses_material_monitor(0.0, NEW.count, NEW.material_id);
        END//
        CREATE TRIGGER after_delete_product_uses_material
            AFTER DELETE
            ON `product_uses_material` FOR EACH ROW
        BEGIN
            CALL product_uses_material_monitor(OLD.count, 0.0, OLD.material_id);
        END//
        CREATE TRIGGER after_update_product_uses_material
            AFTER UPDATE
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
            UPDATE `material`
            SET
                `count` = `count` - (newCount - oldCount)
            WHERE `id` = usedId;
        END//
        CREATE TRIGGER after_insert_case_uses_material
            AFTER INSERT
            ON `case_uses_material` FOR EACH ROW
        BEGIN
            CALL case_uses_material_monitor(0.0, NEW.count, NEW.material_id);
        END//
        CREATE TRIGGER after_delete_case_uses_material
            AFTER DELETE
            ON `case_uses_material` FOR EACH ROW
        BEGIN
            CALL case_uses_material_monitor(OLD.count, 0.0, OLD.material_id);
        END//
        CREATE TRIGGER after_update_case_uses_material
            AFTER UPDATE
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
            UPDATE `product`
            SET
                `count` = `count` - (newCount - oldCount)
            WHERE `id` = usedId;
        END//
        CREATE TRIGGER after_insert_case_uses_product
            AFTER INSERT
            ON `case_uses_product` FOR EACH ROW
        BEGIN
            CALL case_uses_product_monitor(0, NEW.count, NEW.product_id);
        END//
        CREATE TRIGGER after_delete_case_uses_product
            AFTER DELETE
            ON `case_uses_product` FOR EACH ROW
        BEGIN
            CALL case_uses_product_monitor(OLD.count, 0, OLD.product_id);
        END//
        CREATE TRIGGER after_update_case_uses_product
            AFTER UPDATE
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
            UPDATE `case`
            SET
                `count` = `count` - (newCount - oldCount)
            WHERE `id` = usedId;
        END//
        CREATE TRIGGER after_insert_order_uses_case
            AFTER INSERT
            ON `order_uses_case` FOR EACH ROW
        BEGIN
            CALL order_uses_case_monitor(0, NEW.count, NEW.case_id);
        END//
        CREATE TRIGGER after_delete_order_uses_case
            AFTER DELETE
            ON `order_uses_case` FOR EACH ROW
        BEGIN
            CALL order_uses_case_monitor(OLD.count, 0, OLD.case_id);
        END//
        CREATE TRIGGER after_update_order_uses_case
            AFTER UPDATE
            ON `order_uses_case` FOR EACH ROW
        BEGIN
            CALL order_uses_case_monitor(OLD.count, NEW.count, NEW.case_id);
        END//
        
-- DATE MODIFIED TRIGGERS


        CREATE TRIGGER before_update_material
            BEFORE UPDATE
            ON `material` FOR EACH ROW
        BEGIN
            SET NEW.date_modified = CURRENT_TIMESTAMP;
        END//
        


        CREATE TRIGGER before_update_product
            BEFORE UPDATE
            ON `product` FOR EACH ROW
        BEGIN
            SET NEW.date_modified = CURRENT_TIMESTAMP;
        END//
        


        CREATE TRIGGER before_update_case
            BEFORE UPDATE
            ON `case` FOR EACH ROW
        BEGIN
            SET NEW.date_modified = CURRENT_TIMESTAMP;
        END//
        


        CREATE TRIGGER before_update_order
            BEFORE UPDATE
            ON `order` FOR EACH ROW
        BEGIN
            SET NEW.date_modified = CURRENT_TIMESTAMP;
        END//
        DELIMITER ;

