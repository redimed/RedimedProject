-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 30, 2014 at 07:50 AM
-- Server version: 5.6.20
-- PHP Version: 5.5.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `sakila`
--

-- --------------------------------------------------------

--
-- Table structure for table `cln_redimed_referral`
--

CREATE TABLE IF NOT EXISTS `cln_redimed_referral` (
`ID` int(11) NOT NULL,
  `Patient_id` int(11) DEFAULT NULL,
  `CAL_ID` int(11) DEFAULT NULL,
  `IS_CT_SCAN` int(11) DEFAULT NULL,
  `IS_X_RAY` int(11) DEFAULT NULL,
  `IS_MRI` int(11) DEFAULT NULL,
  `IS_ULTRASOUND` int(11) DEFAULT NULL,
  `IS_PATHOLOGY` int(11) DEFAULT NULL,
  `CLINICAL_DETAILS` varchar(600) DEFAULT NULL,
  `IS_ALLERGIES` int(11) DEFAULT NULL,
  `REQUESTING_PRACTITIONER` varchar(300) DEFAULT NULL,
  `IS_REPORT_URGENT` int(11) DEFAULT NULL,
  `ELECTRONIC` int(11) DEFAULT NULL,
  `FAX` int(11) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `PHONE` int(11) DEFAULT NULL,
  `IS_RETURN_WITH_PATIENT` int(11) DEFAULT NULL,
  `APPOINTMENT_DATE` datetime DEFAULT NULL,
  `Created_by` int(11) DEFAULT NULL,
  `Creation_date` datetime DEFAULT NULL,
  `Last_updated_by` int(11) DEFAULT NULL,
  `Last_update_date` datetime DEFAULT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=20 ;

--
-- Dumping data for table `cln_redimed_referral`
--

INSERT INTO `cln_redimed_referral` (`ID`, `Patient_id`, `CAL_ID`, `IS_CT_SCAN`, `IS_X_RAY`, `IS_MRI`, `IS_ULTRASOUND`, `IS_PATHOLOGY`, `CLINICAL_DETAILS`, `IS_ALLERGIES`, `REQUESTING_PRACTITIONER`, `IS_REPORT_URGENT`, `ELECTRONIC`, `FAX`, `Email`, `PHONE`, `IS_RETURN_WITH_PATIENT`, `APPOINTMENT_DATE`, `Created_by`, `Creation_date`, `Last_updated_by`, `Last_update_date`) VALUES
(7, 204, 16164, 0, 0, 0, 1, 1, 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz', 1, 'xxxxxxxxxxxxxxxxxxxxxxxxxx', 1, 1, 1, '1', 1, 1, '2014-11-13 16:08:25', 29, NULL, 29, '2014-11-13 16:08:25'),
(8, 190, 16281, 1, 1, 1, 1, 1, 'zxzxzx', 1, 'xzxzx', 1, 1, 1, '1', 1, 1, NULL, 29, NULL, NULL, NULL),
(9, 287, 17084, 1, 1, 1, 1, 1, 'aaaaaaaaaaaaaaaaasasa', 0, '', 0, 0, 0, '0', 0, 0, NULL, 10, NULL, NULL, NULL),
(10, 355, 19864, 1, 1, 1, 1, 1, 'zxzxzxzz', 1, 'xzxzxzxzxzx', 1, 1, 1, '1', 1, 1, '2014-11-10 03:41:56', 10, NULL, 10, '2014-11-10 03:41:56'),
(11, 116, 15733, 1, 1, 1, 1, 1, NULL, 0, 'sasascfdfdf', 1, 1, 0, '0', 0, 0, '2014-11-12 11:14:02', 10, '2014-11-10 03:42:47', 10, '2014-11-12 11:14:02'),
(12, 181, 16160, 1, 1, 1, 1, 1, 'xxxxxxxxxxxxxxxxxxxx', 1, 'xxxxxxxxxxxxxxxxxxx', 1, 1, 1, '1', 1, 1, '2014-11-12 10:20:13', 29, '2014-11-12 10:10:59', 29, '2014-11-12 10:20:13'),
(13, 203, 16163, 1, 1, 1, 1, 1, 'refferral refferral', 1, 'ssssssssssssssssssssssssss', 1, 1, 1, '1', 1, 1, '2014-11-13 17:04:28', 29, '2014-11-12 10:21:02', 29, '2014-11-13 17:04:28'),
(14, 191, 16282, 0, 0, 0, 0, 0, '', 0, '', 0, 0, 0, '0', 0, 0, NULL, 29, '2014-11-13 13:52:49', NULL, NULL),
(15, 181, 16277, 0, 0, 0, 0, 0, '', 0, '', 0, 0, 0, '0', 0, 0, NULL, 29, '2014-11-13 13:53:20', NULL, NULL),
(16, 181, 16251, 1, 1, 1, 1, 1, 'nguyen minh phuong', 1, 'nguyen minh phuong', 1, 1, 1, '1', 1, 1, '2014-11-14 10:27:34', 29, '2014-11-14 10:27:23', 29, '2014-11-14 10:27:34'),
(17, 200, 16284, 1, 1, 1, 1, 1, 'CON CÒ BÉ BÉ\nCon cò bé bé, nó đậu cành tre, khi không hỏi mẹ, biết đi đường nào\nKhi đi em hỏi, khi về em chào\nmiệng em chum chím, mẹ có yêu ko nào', 1, 'Kìa con gái kìa, kìa con gái kìa', 1, 1, 1, '1', 1, 1, '2014-11-14 11:09:37', 29, '2014-11-14 11:08:04', 29, '2014-11-14 11:09:37'),
(18, 181, 16249, 1, 1, 1, 1, 1, 'kkkkkkkkk', 1, 'lllllllllll', 1, 1, 1, '1', 1, 1, NULL, 29, '2014-11-14 15:33:03', NULL, NULL),
(19, 399, 2446, 0, 0, 0, 0, 0, 'asasas', 1, 'asasasa', 1, 0, 0, '0', 0, 1, '2014-11-17 22:38:25', 29, '2014-11-17 22:38:13', 29, '2014-11-17 22:38:25');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cln_redimed_referral`
--
ALTER TABLE `cln_redimed_referral`
 ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cln_redimed_referral`
--
ALTER TABLE `cln_redimed_referral`
MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=20;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

Snuff – Emanuelle in America
Bestiality – The Beast