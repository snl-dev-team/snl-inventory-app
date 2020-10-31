CREATE TABLE IF NOT EXISTS `product` (
    `id`                    INT NOT NULL AUTO_INCREMENT,
    `name`                  VARCHAR(255) NOT NULL,
    `number`                VARCHAR(255) DEFAULT NULL,
    `count`                 INT UNSIGNED NOT NULL,
    `expiration_date`       DATE DEFAULT NULL,
    `date_created`          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modified`         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `completed`	            BOOL DEFAULT FALSE,
    
    PRIMARY KEY(`id`)
)