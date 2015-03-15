/*
SQLyog Ultimate v11.11 (64 bit)
MySQL - 5.6.16 : Database - sakila
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

/*Table structure for table `cln_patient_claim` */

DROP TABLE IF EXISTS `cln_patient_claim`;

CREATE TABLE `cln_patient_claim` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Claim_id` int(11) DEFAULT NULL,
  `Patient_id` int(11) DEFAULT NULL,
  `CAL_ID` int(11) DEFAULT NULL,
  `Creation_date` datetime DEFAULT NULL,
  `Last_update_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

/*Data for the table `cln_patient_claim` */

insert  into `cln_patient_claim`(`id`,`Claim_id`,`Patient_id`,`CAL_ID`,`Creation_date`,`Last_update_date`) values (1,5,598,25828,'2015-01-12 10:50:52','2015-01-12 10:50:52'),(2,5,598,25828,'2015-01-12 10:53:13','2015-01-12 10:53:13'),(3,5,600,25688,'2015-01-12 02:53:58','2015-01-12 02:53:58'),(4,4,598,26104,'2015-01-12 02:57:56','2015-01-12 02:57:56'),(5,6,598,25548,'2015-01-12 03:03:33','2015-01-12 03:03:33'),(6,1,598,25966,'2015-01-12 07:17:24','2015-01-14 08:11:14'),(7,5,598,25963,'2015-01-12 09:09:51','2015-01-12 09:09:51'),(8,4,598,26136,'2015-01-14 08:10:23','2015-01-14 08:10:54'),(9,1,598,27449,'2015-01-14 09:00:15','2015-01-14 09:02:41');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
