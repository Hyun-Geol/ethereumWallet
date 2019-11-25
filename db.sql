CREATE DATABASE Wallet;

USE Wallet;

CREATE TABLE `wallet_info` (
    `num` int(11) NOT NULL AUTO_INCREMENT,
    `userid` varchar(100) NOT NULL UNIQUE,
    `password` varchar(255) NOT NULL,
    `public_key` varchar(255) NOT NULL,
    `private_key` varchar(255) NOT NULL,
    PRIMARY KEY (`num`)
);

CREATE TABLE `txHash` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(100) NOT NULL,
  `network` varchar(100) NOT NULL,
  `txHash` varchar(100) NOT NULL,
  PRIMARY KEY (`num`)
);
