CREATE TABLE IF NOT EXISTS `material` (
    `id`                    INT NOT NULL AUTO_INCREMENT,
    `date_created`          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modified`         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `name`                  VARCHAR(255) NOT NULL,
    `number`                VARCHAR(255) DEFAULT NULL,
    `count`                 FLOAT UNSIGNED NOT NULL CHECK(`count` >= 0.0),
    `expiration_date`       DATE DEFAULT NULL,
    `price`	                INT UNSIGNED DEFAULT NULL,
    `units`                 ENUM('unit', 'kg', 'lb', 'g', 'L', 'mL') DEFAULT 'unit',
    `notes`                 TEXT NOT NULL,
    
    PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `product` (
    `id`                    INT NOT NULL AUTO_INCREMENT,
    `name`                  VARCHAR(255) NOT NULL,
    `number`                VARCHAR(255) DEFAULT NULL,
    `count`                 INT UNSIGNED NOT NULL CHECK(`count` >= 0),
    `expiration_date`       DATE DEFAULT NULL,
    `date_created`          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modified`         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `completed`	            BOOL DEFAULT FALSE,
    `notes`                 TEXT NOT NULL,
    
    PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `product_uses_material` (
    `product_id`        INT NOT NULL,
    `material_id`       INT NOT NULL,
    `count`             FLOAT UNSIGNED NOT NULL CHECK(`count` >= 0.0),
    
    PRIMARY KEY (`material_id`, `product_id`),
    FOREIGN KEY (`material_id`) REFERENCES material(`id`),
    FOREIGN KEY (`product_id`) REFERENCES product(`id`)
);

CREATE TABLE IF NOT EXISTS `case` (
    `id`                    INT NOT NULL AUTO_INCREMENT,
    `name`                  VARCHAR(255) NOT NULL,
    `product_name`          VARCHAR(255) NOT NULL,
    `product_count`         INT NOT NULL,
    `count`                 INT UNSIGNED NOT NULL CHECK (`count` >= 0),
    `number`                VARCHAR(255) DEFAULT NULL,
    `expiration_date`       DATE DEFAULT NULL,
    `date_created`          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modified`         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `shipped`               BOOL DEFAULT FALSE,
    `notes`                 TEXT NOT NULL,
    
    PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `case_uses_material` (
    `case_id`               INT NOT NULL,
    `material_id`           INT NOT NULL,
    `count`                 FLOAT UNSIGNED NOT NULL CHECK(`count` >= 0.0),
    
    PRIMARY KEY (`material_id`, `case_id`),
    FOREIGN KEY (`material_id`) REFERENCES material(`id`),
    FOREIGN KEY (`case_id`) REFERENCES `case`(`id`)
);

CREATE TABLE IF NOT EXISTS `case_uses_product` (
    `case_id`               INT NOT NULL AUTO_INCREMENT,
    `product_id`            INT NOT NULL,
    `count`                 INT UNSIGNED NOT NULL CHECK(`count` >= 0),
    
    PRIMARY KEY(`case_id`, `product_id`),
    FOREIGN KEY (`product_id`) REFERENCES `product`(`id`),
    FOREIGN KEY (`case_id`) REFERENCES `case`(`id`)
);

CREATE TABLE IF NOT EXISTS `order` (
    `id`                    INT NOT NULL AUTO_INCREMENT,
    `number`                VARCHAR(255) NOT NULL,
    `date_created`          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_modified`         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `notes`                 TEXT NOT NULL,
    `completed`	            BOOL DEFAULT FALSE,
    
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `order_uses_case` (
    `order_id`              INT NOT NULL,
    `case_id`               INT NOT NULL,
    `count`                 INT UNSIGNED NOT NULL CHECK(`count` >= 0),
    
    PRIMARY KEY (`order_id`, `case_id`),
    FOREIGN KEY (`order_id`) REFERENCES `order`(`id`),
    FOREIGN KEY (`case_id`) REFERENCES `case`(`id`)
);