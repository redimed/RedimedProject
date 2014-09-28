CREATE DATABASE  IF NOT EXISTS "sakila" /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `sakila`;
-- MySQL dump 10.13  Distrib 5.6.13, for Win32 (x86)
--
-- Host: localhost    Database: sakila
-- ------------------------------------------------------
-- Server version	5.6.14

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `redi_menus`
--

DROP TABLE IF EXISTS `redi_menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_menus` (
  `menu_id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(60) DEFAULT NULL,
  `definition` varchar(200) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `type` varchar(1) DEFAULT NULL,
  `seq` int(11) DEFAULT NULL,
  `is_mutiple_instance` int(11) DEFAULT NULL,
  `function_id` int(11) DEFAULT NULL,
  `isEnable` int(11) DEFAULT NULL,
  PRIMARY KEY (`menu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `redi_menus`
--

LOCK TABLES `redi_menus` WRITE;
/*!40000 ALTER TABLE `redi_menus` DISABLE KEYS */;
INSERT INTO `redi_menus` VALUES (2,'REDiLegal',NULL,NULL,'t',NULL,NULL,NULL,1),(3,'Booking',NULL,2,'t',NULL,NULL,1,1),(4,'Booking List',NULL,2,'t',NULL,NULL,2,1),(5,'System',NULL,NULL,'t',NULL,NULL,NULL,1),(6,'Menus',NULL,5,'t',NULL,NULL,3,1),(7,'Functions',NULL,5,'t',NULL,NULL,4,1),(17,'Telehealth',NULL,NULL,'A',NULL,NULL,NULL,1),(19,'Patient Form',NULL,17,'A',NULL,NULL,10,1),(20,'Online Booking',NULL,NULL,'A',NULL,NULL,NULL,1),(21,'Make Booking',NULL,20,'A',NULL,NULL,11,1),(22,'Booking List',NULL,20,'A',NULL,NULL,12,1),(23,'Package',NULL,20,'A',NULL,NULL,13,1);
/*!40000 ALTER TABLE `redi_menus` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-09-28 16:26:43
