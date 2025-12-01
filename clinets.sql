CREATE TABLE `clients` (
  `client_id` int NOT NULL AUTO_INCREMENT,
  `reseller_id` int DEFAULT NULL,
  `client_name` varchar(245) DEFAULT NULL,
  `client_dealer_id` varchar(255) DEFAULT NULL,
  `client_inactive` tinyint unsigned DEFAULT '0',
  `client_assets_deleted` tinyint unsigned DEFAULT '0',
  `client_disable_process_flag` tinyint unsigned DEFAULT '0',
  `client_createdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`client_id`),
  CONSTRAINT `fk_reseller_client` FOREIGN KEY (`reseller_id`)  REFERENCES `reseller`(`id`)  ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

