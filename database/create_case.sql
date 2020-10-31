CREATE TABLE IF NOT EXISTS `case` (
    `id`                    INT NOT NULL AUTO_INCREMENT,
    `name`                  VARCHAR(255) NOT NULL,
    `product_name`          VARCHAR(255) NOT NULL,
    `product_count`         INT NOT NULL,
    `count`                 INT UNSIGNED NOT NULL,
    `number`                VARCHAR(255) DEFAULT NULL,
    `expiration_date`       DATE DEFAULT NULL,
    `date_created`          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modified`         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `shipped`               BOOL DEFAULT FALSE,
    
    PRIMARY KEY(`id`)
)