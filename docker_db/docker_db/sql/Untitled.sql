-- MySQL dump 10.13  Distrib 8.0.12, for macos10.13 (x86_64)
--
-- Host: 0.0.0.0    Database: order
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderNumber` varchar(50) NOT NULL,
  `status` int(11) NOT NULL,
  `createTime` date NOT NULL,
  `auditedTime` date DEFAULT NULL,
  `comfirmTime` date DEFAULT NULL,
  `cancelTime` date DEFAULT NULL,
  `source` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `eleTicketQuantity` int(11) NOT NULL,
  `entityTicketQuantity` int(11) NOT NULL,
  `externalOrderNumber` varchar(50) NOT NULL,
  `orderBelong` varchar(50) NOT NULL,
  `orderBelong_id` int(11) NOT NULL,
  `goodsName` varchar(50) NOT NULL,
  `goodsCode` varchar(50) DEFAULT NULL,
  `supplier` varchar(50) NOT NULL,
  `incomingNumber` varchar(50) NOT NULL,
  `incomingTime` date NOT NULL,
  `salesVolume` float NOT NULL,
  `unitPrice` float NOT NULL,
  `rmbCost` float NOT NULL,
  `costCurrency` varchar(50) NOT NULL,
  `currencyExchangeRate` float NOT NULL,
  `deliveryQuantity` int(11) NOT NULL,
  `deliveryCost` float NOT NULL,
  `deliveryNumber` varchar(50) DEFAULT NULL,
  `commission` float NOT NULL,
  `discount` float NOT NULL,
  `profit` float NOT NULL,
  `profitRate` float NOT NULL,
  `netProfit` float NOT NULL,
  `netProfitRate` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `staff` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '工作人员ID',
  `loginName` varchar(50) NOT NULL COMMENT '登录名',
  `password` varchar(50) NOT NULL COMMENT '密码',
  `userName` varchar(50) NOT NULL COMMENT '姓名',
  `sex` tinyint(1) NOT NULL COMMENT '性别：0=男；1=女',
  `contactTel` varchar(50) DEFAULT NULL COMMENT '联系电话',
  `email` varchar(50) DEFAULT NULL COMMENT '电子邮件',
  `type` int(11) NOT NULL COMMENT '类型：1:超级管理员 2 操作员',
  `isvalid` tinyint(1) NOT NULL COMMENT '是否有效',
  `token` varchar(50) DEFAULT NULL COMMENT 'token',
  `isChangePwd` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否需要修改密码',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Index_2` (`loginName`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='工作人员';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (1,'admin','f6fdffe48c908deb0f4c3bd36c032e72','wzm',1,'1','1',1,1,NULL,0);
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-08-11 22:36:19

SET GLOBAL event_scheduler = ON;
CREATE EVENT `updateStatus` 
ON SCHEDULE EVERY 1 day
STARTS '2018-01-01 00:00:00' ON COMPLETION PRESERVE ENABLE

DO
update `order`.`order` set status = 3 
where useTime < now() and status = 2;
