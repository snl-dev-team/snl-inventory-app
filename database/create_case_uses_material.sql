CREATE TABLE IF NOT EXISTS `case_uses_material` (
    `case_id`               INT NOT NULL,
    `material_id`           INT NOT NULL,
    `count`                 FLOAT UNSIGNED NOT NULL,
    
    PRIMARY KEY (`material_id`, `case_id`),
    FOREIGN KEY (`material_id`) REFERENCES material(`id`),
    FOREIGN KEY (`case_id`) REFERENCES `case`(`id`)
)