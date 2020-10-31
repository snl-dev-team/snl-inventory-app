CREATE TABLE IF NOT EXISTS `product_uses_material` (
    `product_id`        INT NOT NULL,
    `material_id`       INT NOT NULL,
    `count`                 FLOAT UNSIGNED NOT NULL,
    
    PRIMARY KEY (`material_id`, `product_id`),
    FOREIGN KEY (`material_id`) REFERENCES material(`id`),
    FOREIGN KEY (`product_id`) REFERENCES product(`id`)
)