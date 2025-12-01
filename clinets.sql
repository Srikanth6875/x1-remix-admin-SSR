CREATE TABLE `ava_client` (
  `client_id` int NOT NULL AUTO_INCREMENT,
  `reseller_id` int DEFAULT NULL,
  `client_name` varchar(245) DEFAULT NULL,
  `client_dealer_id` varchar(255) DEFAULT NULL,
  `client_createdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `client_max_images` int NOT NULL DEFAULT '1',
  `client_inactive` tinyint unsigned DEFAULT '0',
  `client_assets_deleted` tinyint unsigned DEFAULT '0',
  `client_disable_process_flag` tinyint unsigned DEFAULT '0',
  
  PRIMARY KEY (`client_id`),
  KEY `client_dealer_id` (`client_dealer_id`),
  KEY `client_inactive` (`client_inactive`),
  KEY `client_assets_deleted` (`client_assets_deleted`),

  CONSTRAINT `fk_reseller_client` FOREIGN KEY (`reseller_id`) REFERENCES `reseller`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
