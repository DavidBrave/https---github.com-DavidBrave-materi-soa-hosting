-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 20, 2021 at 11:02 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `t6_6715`
--
CREATE DATABASE IF NOT EXISTS `t6_6715` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `t6_6715`;

-- --------------------------------------------------------

--
-- Table structure for table `content`
--

CREATE TABLE `content` (
  `id` varchar(10) NOT NULL,
  `nama` varchar(200) NOT NULL,
  `status` varchar(200) NOT NULL,
  `link` varchar(200) NOT NULL,
  `kategori` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `content`
--

INSERT INTO `content` (`id`, `nama`, `status`, `link`, `kategori`) VALUES
('F0001', 'Selesaikan praktikum dalam 5 menit', 'Free', 'youtube.com', 'Edukasi'),
('F0002', 'Selesaikan praktikum dalam 5 menit', 'Free', 'youtube.com', 'Edukasi'),
('P0001', 'Selesaikan praktikum dalam 5 menit', 'Premium', 'youtube.com', 'Edukasi'),
('P0002', 'Selesaikan praktikum dalam 1 menit', 'Premium', 'youtube.com', 'Edukasi'),
('P0003', 'Selesaikan praktikum dalam 1 menit', 'Premium', 'youtube.com', 'Edukasi'),
('P0004', 'Selesaikan praktikum dalam 1 menit', 'Premium', 'youtube.com', 'Edukasi');

-- --------------------------------------------------------

--
-- Table structure for table `tempat`
--

CREATE TABLE `tempat` (
  `id` int(10) NOT NULL,
  `nama` varchar(200) NOT NULL,
  `kota` varchar(200) NOT NULL,
  `deskripsi` varchar(500) NOT NULL,
  `kategori` varchar(200) NOT NULL,
  `api_pembuat` varchar(100) NOT NULL,
  `email_pembuat` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `email` varchar(200) NOT NULL,
  `nama` varchar(200) NOT NULL,
  `tanggal_lahir` date NOT NULL,
  `saldo` int(10) NOT NULL,
  `api_hit` int(10) NOT NULL,
  `api_key` varchar(100) NOT NULL,
  `tipe_user` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`email`, `nama`, `tanggal_lahir`, `saldo`, `api_hit`, `api_key`, `tipe_user`) VALUES
('db@gmail.com', 'Brave', '2000-02-04', 0, 81, 'fQIMtD6iQrwZMulM', 'Creator'),
('dbrave2@gmail.com', 'David', '2000-04-02', 0, 0, '1f8lj6GZdmtEKKDi', 'Regular'),
('dbrave@gmail.com', 'David', '2000-04-02', 180000, 15, 'HfLdlUK6bhxrAmDu', 'Regular');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tempat`
--
ALTER TABLE `tempat`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tempat`
--
ALTER TABLE `tempat`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
