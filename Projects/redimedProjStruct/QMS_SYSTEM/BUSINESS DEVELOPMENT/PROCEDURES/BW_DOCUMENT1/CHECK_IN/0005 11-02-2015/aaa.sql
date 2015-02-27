/*
SQLyog Ultimate v11.11 (64 bit)
MySQL - 5.6.20 : Database - sakila
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

/*Table structure for table `sys_hierarchies_users` */

DROP TABLE IF EXISTS `sys_hierarchies_users`;

CREATE TABLE `sys_hierarchies_users` (
  `NODE_ID` int(11) DEFAULT NULL,
  `USER_ID` int(11) DEFAULT NULL,
  `ISENABLE` int(11) DEFAULT NULL,
  `CREATED_BY` int(11) DEFAULT NULL,
  `CREATION_DATE` datetime DEFAULT NULL,
  `Last_updated_by` int(11) DEFAULT NULL,
  `Last_update_date` datetime DEFAULT NULL,
  `DEPARTMENT_CODE_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `sys_hierarchies_users` */

insert  into `sys_hierarchies_users`(`NODE_ID`,`USER_ID`,`ISENABLE`,`CREATED_BY`,`CREATION_DATE`,`Last_updated_by`,`Last_update_date`,`DEPARTMENT_CODE_ID`) values (12,14,1,14,'2014-06-08 16:11:20',14,'2014-06-08 16:11:34',NULL),(13,15,1,14,'2014-06-08 16:11:41',14,'2014-06-08 16:11:53',NULL),(6,14,1,14,'2014-06-08 16:12:07',14,'2014-06-08 16:12:23',NULL),(5,15,1,14,'2014-06-08 16:12:31',14,'2014-06-08 16:12:52',NULL),(11,14,1,14,'2014-06-08 16:13:05',14,'2014-06-08 16:13:22',NULL),(10,15,1,14,'2014-06-08 16:13:29',14,'2014-06-08 16:14:35',NULL),(9,16,1,14,'2014-06-08 16:13:47',14,'2014-06-08 16:14:35',NULL),(8,17,1,14,'2014-06-08 16:13:59',14,'2014-06-08 16:14:35',NULL),(7,31,1,14,'2014-06-08 16:14:16',14,'2014-06-08 16:14:35',NULL),(18,6,1,14,'2014-06-11 14:33:33',14,'2014-06-11 14:33:47',NULL),(17,15,1,14,'2014-06-11 14:33:56',14,'2014-06-11 14:34:15',NULL),(23,14,1,31,'2014-09-19 23:56:12',31,'2014-09-20 00:01:49',NULL),(3,16,1,31,'2014-09-20 00:01:27',31,'2014-09-20 00:02:13',NULL),(4,17,1,31,'2014-09-20 00:02:39',31,'2014-09-20 00:03:24',NULL),(26,239,1,NULL,NULL,NULL,NULL,10),(25,240,1,NULL,NULL,NULL,NULL,10),(24,265,1,NULL,NULL,NULL,NULL,10),(26,243,1,NULL,NULL,NULL,NULL,11),(25,242,1,NULL,NULL,NULL,NULL,11),(24,265,1,NULL,NULL,NULL,NULL,11),(26,246,1,NULL,NULL,NULL,NULL,12),(25,244,1,NULL,NULL,NULL,NULL,12),(24,265,1,NULL,NULL,NULL,NULL,12),(26,252,1,NULL,NULL,NULL,NULL,13),(25,250,1,NULL,NULL,NULL,NULL,13),(24,265,1,NULL,NULL,NULL,NULL,13),(26,248,1,NULL,NULL,NULL,NULL,14),(25,249,1,NULL,NULL,NULL,NULL,14),(24,265,1,NULL,NULL,NULL,NULL,14),(26,253,1,NULL,NULL,NULL,NULL,15),(25,254,1,NULL,NULL,NULL,NULL,15),(24,265,1,NULL,NULL,NULL,NULL,15),(26,259,1,NULL,NULL,NULL,NULL,16),(25,257,1,NULL,NULL,NULL,NULL,16),(24,265,1,NULL,NULL,NULL,NULL,16),(26,264,1,NULL,NULL,NULL,NULL,17),(25,263,1,NULL,NULL,NULL,NULL,17),(24,265,1,NULL,NULL,NULL,NULL,17),(26,258,1,NULL,NULL,NULL,NULL,18),(25,260,1,NULL,NULL,NULL,NULL,18),(24,265,1,NULL,NULL,NULL,NULL,18);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;