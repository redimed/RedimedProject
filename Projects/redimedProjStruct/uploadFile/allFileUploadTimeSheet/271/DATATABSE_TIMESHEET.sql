/*
SQLyog Ultimate v11.11 (64 bit)
MySQL - 5.6.21 : Database - sakila
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`sakila` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `sakila`;

/*Table structure for table `time_employee_reports1` */

DROP TABLE IF EXISTS `time_employee_reports1`;

CREATE TABLE `time_employee_reports1` (
  `user_id` int(11) DEFAULT NULL,
  `departmentid` int(11) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `from_date` datetime DEFAULT NULL,
  `to_date` datetime DEFAULT NULL,
  `time_ac1_dept` int(11) DEFAULT NULL,
  `time_ac2_dept` int(20) DEFAULT NULL,
  `time_ac3_dept` int(20) DEFAULT NULL,
  `time_ac4_dept` int(20) DEFAULT NULL,
  `time_ac5_dept` int(20) DEFAULT NULL,
  `overtime_dept` int(11) DEFAULT NULL,
  `time_in_lieu_dept` int(11) DEFAULT NULL,
  `time_ac1_all` int(11) DEFAULT NULL,
  `time_ac2_all` int(11) DEFAULT NULL,
  `time_ac3_all` int(11) DEFAULT NULL,
  `time_ac4_all` int(11) DEFAULT NULL,
  `time_ac5_all` int(11) DEFAULT NULL,
  `time_in_lieu_all` int(11) DEFAULT NULL,
  `overtime_all` int(11) DEFAULT NULL,
  `total_all` int(11) DEFAULT NULL,
  `total_dept` int(20) DEFAULT NULL,
  `employee` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `creation_date` datetime DEFAULT NULL,
  `last_update_date` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `last_updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `time_employee_reports1` */

insert  into `time_employee_reports1`(`user_id`,`departmentid`,`employee_id`,`from_date`,`to_date`,`time_ac1_dept`,`time_ac2_dept`,`time_ac3_dept`,`time_ac4_dept`,`time_ac5_dept`,`overtime_dept`,`time_in_lieu_dept`,`time_ac1_all`,`time_ac2_all`,`time_ac3_all`,`time_ac4_all`,`time_ac5_all`,`time_in_lieu_all`,`overtime_all`,`total_all`,`total_dept`,`employee`,`creation_date`,`last_update_date`,`created_by`,`last_updated_by`) values (271,20,125,'2015-03-29 00:00:00','2015-08-29 00:00:00',6240,4260,480,480,480,311,229,6240,4260,480,480,480,229,311,11940,11940,'Quynh Bui',NULL,NULL,NULL,NULL),(271,20,9999999,'2015-03-29 00:00:00','2015-08-29 00:00:00',6240,4260,480,480,480,311,229,6240,4260,480,480,480,229,311,11940,11940,'Jason Ryan',NULL,NULL,NULL,NULL);

/*Table structure for table `time_time_charge_reports1` */

DROP TABLE IF EXISTS `time_time_charge_reports1`;

CREATE TABLE `time_time_charge_reports1` (
  `user_id` int(11) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `time_ac1` int(11) DEFAULT NULL,
  `time_ac2` int(11) DEFAULT NULL,
  `time_ac3` int(11) DEFAULT NULL,
  `time_ac4` int(11) DEFAULT NULL,
  `time_ac5` int(11) DEFAULT NULL,
  `time_in_lieu` int(11) DEFAULT NULL,
  `time_charge_sum` int(11) DEFAULT NULL,
  `time_over` int(11) DEFAULT NULL,
  `creation_date` datetime DEFAULT NULL,
  `last_update_date` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `last_updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `time_time_charge_reports1` */

insert  into `time_time_charge_reports1`(`user_id`,`employee_id`,`time_ac1`,`time_ac2`,`time_ac3`,`time_ac4`,`time_ac5`,`time_in_lieu`,`time_charge_sum`,`time_over`,`creation_date`,`last_update_date`,`created_by`,`last_updated_by`) values (271,125,3840,4260,480,480,480,169,9540,251,NULL,NULL,NULL,NULL),(271,9999999,2400,0,0,0,0,60,2400,60,NULL,NULL,NULL,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
