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

/*Table structure for table `template` */

DROP TABLE IF EXISTS `template`;

CREATE TABLE `template` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content` text,
  `Creation_date` datetime DEFAULT NULL,
  `Last_update_date` datetime DEFAULT NULL,
  `Created_by` int(11) DEFAULT NULL,
  `Last_updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `template` */

insert  into `template`(`id`,`name`,`content`,`Creation_date`,`Last_update_date`,`Created_by`,`Last_updated_by`) values (3,'Mẫu đơn xin việc 1','<div style=\"text-align: center;\"><b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b></div><div style=\"text-align: center;\"><b>Độc lập - tự do - hạnh phúc</b></div><div style=\"text-align: center;\"><br></div><div style=\"text-align: center;\"><b>ĐƠN XIN VIỆC</b></div><div>Kính gửi: {#input#}</div><div>Tôi tên: {#input#}, Năm sinh: {#input#}</div><div>Nội dung:</div>','2015-06-08 00:00:00','2015-06-08 00:00:00',3,3),(5,'Mẫu đơn 1','<div><b>Your name: </b>{#input.First_name#} {#input.Surburb#}</div><div><b>Your age: </b>{#input.First_name#}</div>','2015-06-08 00:00:00','2015-06-11 00:00:00',3,3),(6,'test test test','<div>First name: {#input.First_name#}</div><div>Last name: {#input.Sur_name#}</div><div>Tu nhap: {#input#}</div>','2015-06-10 00:00:00','2015-06-10 00:00:00',3,3);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
