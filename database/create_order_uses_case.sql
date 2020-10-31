CREATE TABLE IF NOT EXISTS `order_uses_case` (
    `order_id`              INT NOT NULL,
    `case_id`               INT NOT NULL,
    `count`                 INT UNSIGNED NOT NULL,
    
    PRIMARY KEY (`order_id`, `case_id`),
    FOREIGN KEY (`order_id`) REFERENCES `order`(`id`),
    FOREIGN KEY (`case_id`) REFERENCES `case`(`id`)
)