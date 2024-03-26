CREATE DATABASE `auth-server` /*!40100 DEFAULT */ /*!80016 DEFAULT ENCRYPTION='N' */;
-- `auth-server`.clients definition

CREATE TABLE `clients` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ApiId` varchar(100) DEFAULT NULL,
  `ApiSecret` varchar(100) DEFAULT NULL,
  `ProviderClientId` varchar(100) NOT NULL,
  `ProviderClientSecret` varchar(100) NOT NULL,
  `RedirectUrl` varchar(100) DEFAULT NULL,
  `IsActive` bit(1) NOT NULL,
  PRIMARY KEY (`Id`)
);

-- `auth-server`.users definition

CREATE TABLE `users` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(100) NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `ProfilePicPath` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Id`)
);