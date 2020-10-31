CREATE TABLE IF NOT EXISTS `material` (
    `id`                    INT NOT NULL AUTO_INCREMENT,
    `date_created`          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modified`         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `name`                  VARCHAR(255) NOT NULL,
    `number`                VARCHAR(255) DEFAULT NULL,
    `count`                 FLOAT UNSIGNED NOT NULL,
    `expiration_date`       DATE DEFAULT NULL,
    `price`	                INT UNSIGNED DEFAULT NULL,
    `units`                 ENUM('unit', 'kg', 'lb', 'g', 'L', 'mL') DEFAULT 'unit',
    
    PRIMARY KEY(`id`)
)