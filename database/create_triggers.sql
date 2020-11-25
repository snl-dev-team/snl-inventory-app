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

CREATE TRIGGER before_insert_product_uses_material
    BEFORE INSERT
    ON `product_uses_material` FOR EACH ROW
BEGIN
    CALL product_uses_material_monitor(0.0, NEW.count);
END//

CREATE TRIGGER before_delete_product_uses_material
    BEFORE DELETE
    ON `product_uses_material` FOR EACH ROW
BEGIN
    CALL product_uses_material_monitor(OLD.count, 0.0);
END//

CREATE TRIGGER before_update_product_uses_material
    BEFORE UPDATE
    ON `product_uses_material` FOR EACH ROW
BEGIN
    CALL product_uses_material_monitor(OLD.count, NEW.count);
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

CREATE TRIGGER before_insert_case_uses_material
    BEFORE INSERT
    ON `case_uses_material` FOR EACH ROW
BEGIN
    CALL case_uses_material_monitor(0.0, NEW.count);
END//

CREATE TRIGGER before_delete_case_uses_material
    BEFORE DELETE
    ON `case_uses_material` FOR EACH ROW
BEGIN
    CALL case_uses_material_monitor(OLD.count, 0.0);
END//

CREATE TRIGGER before_update_case_uses_material
    BEFORE UPDATE
    ON `case_uses_material` FOR EACH ROW
BEGIN
    CALL case_uses_material_monitor(OLD.count, NEW.count);
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

CREATE TRIGGER before_insert_case_uses_product
    BEFORE INSERT
    ON `case_uses_product` FOR EACH ROW
BEGIN
    CALL case_uses_product_monitor(0, NEW.count);
END//

CREATE TRIGGER before_delete_case_uses_product
    BEFORE DELETE
    ON `case_uses_product` FOR EACH ROW
BEGIN
    CALL case_uses_product_monitor(OLD.count, 0);
END//

CREATE TRIGGER before_update_case_uses_product
    BEFORE UPDATE
    ON `case_uses_product` FOR EACH ROW
BEGIN
    CALL case_uses_product_monitor(OLD.count, NEW.count);
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

CREATE TRIGGER before_insert_order_uses_case
    BEFORE INSERT
    ON `order_uses_case` FOR EACH ROW
BEGIN
    CALL order_uses_case_monitor(0, NEW.count);
END//

CREATE TRIGGER before_delete_order_uses_case
    BEFORE DELETE
    ON `order_uses_case` FOR EACH ROW
BEGIN
    CALL order_uses_case_monitor(OLD.count, 0);
END//

CREATE TRIGGER before_update_order_uses_case
    BEFORE UPDATE
    ON `order_uses_case` FOR EACH ROW
BEGIN
    CALL order_uses_case_monitor(OLD.count, NEW.count);
END//

-- UPDATE TABLE TRIGGERS


CREATE TRIGGER after_update_material
    AFTER UPDATE
    ON `material` FOR EACH ROW
BEGIN
    UPDATE `material`
    SET date_modified = CURRENT_TIMESTAMP
    WHERE  `id` = NEW.id;
END//



CREATE TRIGGER after_update_product
    AFTER UPDATE
    ON `product` FOR EACH ROW
BEGIN
    UPDATE `product`
    SET date_modified = CURRENT_TIMESTAMP
    WHERE  `id` = NEW.id;
END//



CREATE TRIGGER after_update_case
    AFTER UPDATE
    ON `case` FOR EACH ROW
BEGIN
    UPDATE `case`
    SET date_modified = CURRENT_TIMESTAMP
    WHERE  `id` = NEW.id;
END//



CREATE TRIGGER after_update_order
    AFTER UPDATE
    ON `order` FOR EACH ROW
BEGIN
    UPDATE `order`
    SET date_modified = CURRENT_TIMESTAMP
    WHERE  `id` = NEW.id;
END//

-- DELETE TABLE TRIGGERS


CREATE TRIGGER before_delete_material
    BEFORE DELETE
    ON `material` FOR EACH ROW
BEGIN
    
    DELETE FROM `product_uses_material`
    WHERE `material_id` = OLD.id;


    DELETE FROM `case_uses_material`
    WHERE `material_id` = OLD.id;

END//



CREATE TRIGGER before_delete_product
    BEFORE DELETE
    ON `product` FOR EACH ROW
BEGIN
    
    DELETE FROM `case_uses_product`
    WHERE `product_id` = OLD.id;

END//



CREATE TRIGGER before_delete_case
    BEFORE DELETE
    ON `case` FOR EACH ROW
BEGIN
    
    DELETE FROM `order_uses_case`
    WHERE `case_id` = OLD.id;

END//
DELIMITER ;

