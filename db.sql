CREATE DATABASE Wallet;

USE Wallet;

CREATE TABLE `wallet_info` (
    `userid` varchar(100) NOT NULL UNIQUE,
    `password` varchar(255) NOT NULL,
    `public_key` varchar(255) NOT NULL,
    `private_key` varchar(255) NOT NULL
);

CREATE TABLE `txHash` (
  `userid` varchar(100) NOT NULL,
  `txHash` varchar(100) NOT NULL
);
