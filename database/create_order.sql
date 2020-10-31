CREATE TABLE IF NOT EXISTS `order` (
    `id`                    INT NOT NULL AUTO_INCREMENT,
    `number`                VARCHAR(255) NOT NULL,
    `date_created`          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modified`         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`)
)