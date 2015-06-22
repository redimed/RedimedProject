/*
SQLyog Ultimate v11.11 (64 bit)
MySQL - 5.6.23-enterprise-commercial-advanced : Database - sakila
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`sakila` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `sakila`;

/*Table structure for table `redi_menus` */

DROP TABLE IF EXISTS `redi_menus`;

CREATE TABLE `redi_menus` (
  `menu_id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(60) DEFAULT NULL,
  `definition` varchar(200) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `TYPE` varchar(50) DEFAULT NULL,
  `seq` int(11) DEFAULT NULL,
  `is_mutiple_instance` int(11) DEFAULT NULL,
  `function_id` int(11) DEFAULT NULL,
  `isEnable` int(11) DEFAULT NULL,
  `isWeb` int(11) DEFAULT NULL,
  `isMobile` int(11) DEFAULT NULL,
  PRIMARY KEY (`menu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=utf8;

/*Data for the table `redi_menus` */

insert  into `redi_menus`(`menu_id`,`description`,`definition`,`parent_id`,`TYPE`,`seq`,`is_mutiple_instance`,`function_id`,`isEnable`,`isWeb`,`isMobile`) values (2,'Medico-Legal Admin',NULL,NULL,NULL,NULL,NULL,NULL,1,1,0),(5,'System',NULL,NULL,'glyphicon glyphicon-star-empty',NULL,NULL,NULL,1,1,0),(6,'Menus',NULL,5,'t',NULL,NULL,3,1,1,0),(7,'Functions',NULL,5,'t',NULL,NULL,4,1,1,0),(17,'Telehealth',NULL,NULL,'glyphicon glyphicon-star-empty',NULL,NULL,NULL,0,1,0),(19,'Patient Form',NULL,17,'A',NULL,NULL,10,1,1,0),(20,'Online Booking',NULL,NULL,'glyphicon glyphicon-star-empty',NULL,NULL,NULL,1,1,0),(21,'Make Booking',NULL,20,'A',NULL,NULL,11,1,1,0),(22,'Booking List',NULL,20,'A',NULL,NULL,12,1,1,0),(23,'Package',NULL,20,'A',NULL,NULL,13,1,1,0),(24,'Position',NULL,20,'A',NULL,NULL,14,1,1,0),(25,'Setting',NULL,20,'A',NULL,NULL,15,1,1,0),(26,'Office Site','',NULL,'glyphicon glyphicon-star-empty',NULL,NULL,NULL,1,1,0),(27,'Booking',NULL,26,'A',NULL,NULL,16,1,1,0),(28,'Assessment',NULL,26,'A',NULL,NULL,17,1,1,0),(29,'Company',NULL,26,'A',NULL,NULL,18,1,1,0),(31,'Sites',NULL,26,'A',NULL,NULL,20,1,1,0),(38,'User','AAA',5,'A',NULL,NULL,19,1,1,0),(39,'Admin',NULL,2,NULL,NULL,NULL,24,1,1,1),(40,'Document',NULL,NULL,'glyphicon glyphicon-star-empty',NULL,NULL,NULL,1,1,0),(41,'Gorgon FA',NULL,40,'A',NULL,NULL,25,1,1,0),(42,'Gorgon MA','',40,'A',NULL,NULL,31,1,1,0),(43,'Gorgon MH',NULL,40,'A',NULL,NULL,32,1,1,0),(44,'Gorgon UQ','A',40,'A',NULL,NULL,33,1,1,0),(45,'Category 2','A',40,'A',NULL,NULL,26,1,1,0),(46,'Category 3','A',40,'A',NULL,NULL,27,1,1,0),(47,'Functional Assessment','A',40,'A',NULL,NULL,28,1,1,0),(48,'Medical Assessment','A',40,'A',NULL,NULL,29,1,1,0),(49,'Instant Drug Screen','A',40,'A',NULL,NULL,30,1,1,0),(50,'Form 18','A',40,'A',NULL,NULL,34,1,1,0),(51,'Medical History','A',40,'A',NULL,NULL,35,1,1,0),(52,'Medical Result Summary','A',40,'A',NULL,NULL,36,1,1,0),(53,'Audiogram 1','A',40,'A',NULL,NULL,37,1,1,0),(54,'Audiogram 2','A',40,'A',NULL,NULL,38,1,1,0),(55,'Medico-Legal',NULL,NULL,NULL,NULL,NULL,NULL,1,1,0),(56,'Online Booking',NULL,55,NULL,NULL,NULL,22,1,1,1),(57,'Booking Summary',NULL,55,NULL,NULL,NULL,23,1,1,1),(61,'Vaccination',NULL,NULL,NULL,NULL,NULL,NULL,0,1,0),(62,'Vaccination Booking',NULL,NULL,'glyphicon glyphicon-star-empty',NULL,NULL,NULL,1,1,0),(63,'Booking',NULL,62,NULL,NULL,NULL,39,1,1,0),(64,'Booking List',NULL,62,'A',NULL,NULL,40,1,1,0),(65,'Vaccination Admin',NULL,NULL,'glyphicon glyphicon-star-empty',NULL,NULL,NULL,1,1,0),(66,'Booking',NULL,65,NULL,NULL,NULL,39,1,1,0),(67,'Booking List',NULL,65,NULL,NULL,NULL,40,1,1,0),(68,'Booking Admin',NULL,65,NULL,NULL,NULL,41,1,1,0),(69,'Real Estate','',NULL,'glyphicon glyphicon-star-empty',NULL,NULL,NULL,1,1,0),(70,'Property List','A',69,'A',NULL,NULL,42,1,1,0),(75,'Admin Report',NULL,2,NULL,NULL,NULL,45,1,1,1),(76,'Patient','Patient',NULL,'glyphicon glyphicon-star-empty',NULL,NULL,NULL,1,1,0),(77,'Patient','Patient',76,NULL,NULL,NULL,47,1,1,0),(81,'Department',NULL,NULL,'glyphicon glyphicon-star-empty',NULL,NULL,NULL,1,1,0),(82,'Items',NULL,81,NULL,NULL,NULL,49,1,1,0),(84,'Current Patients',NULL,81,NULL,NULL,NULL,51,1,1,0),(85,'Injury Management',NULL,NULL,'glyphicon glyphicon-star-empty',NULL,NULL,NULL,1,0,1),(86,'Add Worker',NULL,85,NULL,NULL,NULL,52,1,0,1),(87,'Submit Injury',NULL,85,NULL,NULL,NULL,53,1,0,1),(88,'Test Document',NULL,NULL,'glyphicon glyphicon-star',NULL,NULL,NULL,1,1,0),(90,'Document Status Summary','A',2,NULL,NULL,NULL,55,1,1,1),(92,'Injury Management Driver',NULL,NULL,'glyphicon glyphicon-star',NULL,NULL,NULL,1,0,1),(93,'Injury List',NULL,92,NULL,NULL,NULL,58,1,0,1),(94,'Department List','Department List',81,NULL,NULL,NULL,59,1,1,0),(95,'Popular Headers','Popular Headers',81,NULL,NULL,NULL,60,1,1,0),(96,'Quality Management System(old)',NULL,NULL,NULL,NULL,NULL,NULL,0,1,0),(97,'ISO System','ISO System',96,NULL,NULL,NULL,61,1,1,0),(98,'Injury Management Opentok',NULL,NULL,'glyphicon glyphicon-star',NULL,NULL,NULL,1,0,1),(99,'OpenTok',NULL,98,NULL,NULL,NULL,62,1,0,1),(100,'Fee Search','Fee Search',81,NULL,NULL,NULL,63,1,1,0),(101,'Fee List','Fee List',81,NULL,NULL,NULL,64,1,1,0),(102,'Companies',NULL,NULL,NULL,NULL,NULL,NULL,1,1,0),(103,'Companies List','',102,NULL,NULL,NULL,65,1,1,0),(104,'Insurer List',NULL,102,NULL,NULL,NULL,66,1,1,0),(105,'Quality Management System',NULL,NULL,NULL,NULL,NULL,NULL,1,1,0),(106,'QMS',NULL,105,NULL,NULL,NULL,67,1,1,0),(107,'Service List','loggedIn.sysservices.list',81,NULL,NULL,NULL,68,1,1,0),(108,'Maps',NULL,NULL,NULL,NULL,NULL,NULL,1,0,1),(109,'Maps',NULL,108,NULL,NULL,NULL,69,1,1,1),(110,'User Type',NULL,5,NULL,NULL,NULL,70,1,1,0),(111,'QMS Approval','ISO Approval',105,NULL,NULL,NULL,71,1,1,0),(113,'QMS',NULL,NULL,NULL,NULL,NULL,NULL,1,1,0),(114,'System',NULL,113,NULL,NULL,NULL,67,1,1,0),(117,'Injury Management','loggedIn.im.map',NULL,NULL,NULL,NULL,NULL,1,1,0),(123,'CORE TEAM',NULL,NULL,NULL,NULL,NULL,NULL,1,1,0),(124,'Calendar',NULL,123,NULL,NULL,NULL,43,1,1,0),(125,'Timetable',NULL,123,NULL,NULL,NULL,44,1,1,0),(126,'Service List',NULL,123,NULL,NULL,NULL,68,1,1,0),(127,'Department List',NULL,123,NULL,NULL,NULL,59,1,1,0),(128,'Item list',NULL,123,NULL,NULL,NULL,49,1,1,0),(129,'Company List',NULL,123,NULL,NULL,NULL,65,1,1,0),(130,'Insurer List',NULL,123,NULL,NULL,NULL,66,1,1,0),(131,'Invoice List',NULL,123,NULL,NULL,NULL,72,1,1,0),(132,'Doctor list',NULL,123,NULL,NULL,NULL,73,1,1,0),(133,'Fee List',NULL,123,NULL,NULL,NULL,64,1,1,0),(134,'Fee Search',NULL,123,NULL,NULL,NULL,63,1,1,0),(135,'Doctor Patients',NULL,123,NULL,NULL,NULL,74,1,1,0),(136,'Check In',NULL,123,NULL,NULL,NULL,75,1,1,0),(137,'Define TreeApprove','loggedIn.listSystem',5,NULL,NULL,NULL,76,1,1,0),(138,'Popular Headers',NULL,123,NULL,NULL,NULL,60,1,1,0),(139,'Patient List',NULL,123,NULL,NULL,NULL,77,1,1,0),(140,'Patient list',NULL,88,NULL,NULL,NULL,77,1,1,0),(141,'Injury History',NULL,85,NULL,NULL,NULL,78,1,0,1),(143,'Type',NULL,2,NULL,NULL,NULL,79,1,1,1),(144,'Specialties',NULL,2,NULL,NULL,NULL,80,1,1,1),(145,'Users List',NULL,2,NULL,NULL,NULL,81,1,1,1),(146,'Booking Behalf',NULL,2,NULL,NULL,NULL,82,1,1,1),(147,'Specialists profiles',NULL,55,NULL,NULL,NULL,83,1,1,1),(148,'Message Templates',NULL,2,NULL,NULL,NULL,84,1,1,1),(149,'Roster',NULL,2,NULL,NULL,NULL,44,1,1,1),(150,'E-Timesheet System for Employee','loggedIn.home',NULL,NULL,NULL,NULL,NULL,1,1,0),(151,'E-Timesheet System for Manager','loggedIn.home',NULL,NULL,NULL,NULL,NULL,1,1,0),(152,'E-Timesheet System for Director','loggedIn.home',NULL,NULL,NULL,NULL,NULL,1,1,0);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
