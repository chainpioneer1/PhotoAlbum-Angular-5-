/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 100131
Source Host           : localhost:3306
Source Database       : album

Target Server Type    : MYSQL
Target Server Version : 100131
File Encoding         : 65001

Date: 2018-04-19 23:25:14
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for albums
-- ----------------------------
DROP TABLE IF EXISTS `albums`;
CREATE TABLE `albums` (
  `album_id` int(10) NOT NULL AUTO_INCREMENT,
  `group_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  `album_name` varchar(255) DEFAULT NULL,
  `album_path` varchar(255) DEFAULT NULL,
  `album_created` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`album_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for groups
-- ----------------------------
DROP TABLE IF EXISTS `groups`;
CREATE TABLE `groups` (
  `group_id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `group_name` varchar(50) DEFAULT NULL,
  `group_created` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for groups_users
-- ----------------------------
DROP TABLE IF EXISTS `groups_users`;
CREATE TABLE `groups_users` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `group_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for invites
-- ----------------------------
DROP TABLE IF EXISTS `invites`;
CREATE TABLE `invites` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `group_id` int(10) NOT NULL,
  `invited_emails` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for photos
-- ----------------------------
DROP TABLE IF EXISTS `photos`;
CREATE TABLE `photos` (
  `photo_id` int(10) NOT NULL AUTO_INCREMENT,
  `album_id` int(10) NOT NULL,
  `group_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  `photo_uploaded_name` varchar(255) DEFAULT NULL,
  `photo_uploaded_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`photo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `surname` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `recovery_password` varchar(100) DEFAULT NULL,
  `user_created` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `invite_by_user_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;
