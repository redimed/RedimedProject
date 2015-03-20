-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 28, 2014 at 03:12 AM
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
-- Table structure for table `company_insurers`
--

CREATE TABLE IF NOT EXISTS `company_insurers` (
  `company_id` int(11) NOT NULL,
  `insurer_id` int(11) NOT NULL,
  `last_update_date` datetime NOT NULL,
  `creation_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `company_insurers`
--

INSERT INTO `company_insurers` (`company_id`, `insurer_id`, `last_update_date`, `creation_date`) VALUES
(0, 4, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(0, 7, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(206, 2, '2014-11-27 12:54:28', '2014-11-27 12:54:28'),
(208, 7, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(209, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(210, 2, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(212, 2, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `company_insurers`
--
ALTER TABLE `company_insurers`
 ADD PRIMARY KEY (`company_id`,`insurer_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
