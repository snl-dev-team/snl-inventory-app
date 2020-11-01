SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE `material`;

DROP TABLE `product`;
DROP TABLE `product_uses_material`;

DROP TABLE `case`;
DROP TABLE `case_uses_material`;
DROP TABLE `case_uses_product`;

DROP TABLE `order`;
DROP TABLE `order_uses_case`;
SET FOREIGN_KEY_CHECKS = 1;