CREATE TABLE IF NOT EXISTS `case_uses_product` (
    `case_id`               INT NOT NULL AUTO_INCREMENT,
    `product_id`            INT NOT NULL,
    `count`                 INT UNSIGNED NOT NULL,
    
    PRIMARY KEY(`case_id`, `product_id`),
    FOREIGN KEY (`product_id`) REFERENCES `product`(`id`),
    FOREIGN KEY (`case_id`) REFERENCES `case`(`id`)
)