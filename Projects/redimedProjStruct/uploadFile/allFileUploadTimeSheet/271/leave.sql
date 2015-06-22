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

/*Table structure for table `hr_leave` */

DROP TABLE IF EXISTS `hr_leave`;

CREATE TABLE `hr_leave` (
  `leave_id` int(11) NOT NULL AUTO_INCREMENT,
  `application_date` datetime DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `finish_date` datetime DEFAULT NULL,
  `work_date` datetime DEFAULT NULL,
  `standard` int(11) DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `time_leave` int(11) DEFAULT NULL,
  `reason_leave` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_approve_first` int(11) NOT NULL DEFAULT '0',
  `is_approve_second` int(11) NOT NULL DEFAULT '0',
  `status_id_first` int(11) DEFAULT NULL,
  `status_id_second` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `date_approve` datetime DEFAULT NULL,
  `is_reject` int(11) DEFAULT '0',
  `comments` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `creation_date` datetime DEFAULT NULL,
  `last_update_date` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `last_updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`leave_id`)
) ENGINE=InnoDB AUTO_INCREMENT=150 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `hr_leave` */

insert  into `hr_leave`(`leave_id`,`application_date`,`start_date`,`finish_date`,`work_date`,`standard`,`status_id`,`time_leave`,`reason_leave`,`is_approve_first`,`is_approve_second`,`status_id_first`,`status_id_second`,`user_id`,`date_approve`,`is_reject`,`comments`,`creation_date`,`last_update_date`,`created_by`,`last_updated_by`) values (148,'2015-05-12 08:23:09','2015-04-25 17:00:00','2015-04-26 17:00:00','2015-04-26 17:00:00',1,3,4560,NULL,0,1,3,3,272,NULL,1,'Please correct','2015-05-12 08:23:28','2015-05-12 09:04:02',272,272),(149,'2015-05-12 09:04:30','2015-04-25 17:00:00','2015-07-24 17:00:00','2015-07-24 17:00:00',0,2,12000,NULL,1,0,2,NULL,272,NULL,0,NULL,'2015-05-12 09:04:47','2015-05-12 04:05:02',272,272);

/*Table structure for table `hr_leave_detail` */

DROP TABLE IF EXISTS `hr_leave_detail`;

CREATE TABLE `hr_leave_detail` (
  `leave_detail_id` int(11) NOT NULL AUTO_INCREMENT,
  `leave_id` int(11) DEFAULT NULL,
  `leave_type_id` int(11) DEFAULT NULL,
  `time_leave` int(11) DEFAULT NULL,
  `reason_leave` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `type_other` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `creation_date` datetime DEFAULT NULL,
  `last_update_date` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `last_updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`leave_detail_id`)
) ENGINE=InnoDB AUTO_INCREMENT=541 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `hr_leave_detail` */

insert  into `hr_leave_detail`(`leave_detail_id`,`leave_id`,`leave_type_id`,`time_leave`,`reason_leave`,`type_other`,`creation_date`,`last_update_date`,`created_by`,`last_updated_by`) values (531,148,1,4200,NULL,NULL,'2015-05-12 08:23:28','2015-05-12 09:02:52',NULL,272),(532,148,2,360,NULL,NULL,'2015-05-12 08:23:28','2015-05-12 09:02:52',NULL,272),(533,148,3,0,NULL,NULL,'2015-05-12 08:23:28','2015-05-12 09:02:52',NULL,272),(534,148,4,0,NULL,NULL,'2015-05-12 08:23:28','2015-05-12 09:02:52',NULL,272),(535,148,5,0,NULL,NULL,'2015-05-12 08:23:28','2015-05-12 09:02:52',NULL,272),(536,149,1,12000,NULL,NULL,'2015-05-12 09:04:47','2015-05-12 09:05:00',NULL,272),(537,149,2,0,NULL,NULL,'2015-05-12 09:04:47','2015-05-12 09:05:00',NULL,272),(538,149,3,0,NULL,NULL,'2015-05-12 09:04:47','2015-05-12 09:05:00',NULL,272),(539,149,4,0,NULL,NULL,'2015-05-12 09:04:47','2015-05-12 09:05:00',NULL,272),(540,149,5,0,NULL,NULL,'2015-05-12 09:04:47','2015-05-12 09:05:00',NULL,272);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
