/*
 Navicat Premium Data Transfer

 Source Server         : user
 Source Server Type    : MySQL
 Source Server Version : 50724
 Source Host           : localhost:3306
 Source Schema         : zhouwei

 Target Server Type    : MySQL
 Target Server Version : 50724
 File Encoding         : 65001

 Date: 18/04/2021 15:18:02
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for p_admin
-- ----------------------------
DROP TABLE IF EXISTS `p_admin`;
CREATE TABLE `p_admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `mobile` varchar(255) DEFAULT NULL COMMENT '用户手机号',
  `password` varchar(255) DEFAULT NULL COMMENT '用户密码',
  `update_time` bigint(13) DEFAULT NULL COMMENT '创建时间',
  `dept_id` int(11) DEFAULT NULL COMMENT '用户组id',
  `create_time` bigint(13) DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of p_admin
-- ----------------------------
BEGIN;
INSERT INTO `p_admin` VALUES (1, '13886441638', '4031b94cb113282a50b007fe12e955ad', 1618669017301, 1, 1618669017301);
COMMIT;

-- ----------------------------
-- Table structure for p_dept
-- ----------------------------
DROP TABLE IF EXISTS `p_dept`;
CREATE TABLE `p_dept` (
  `id` int(11) NOT NULL COMMENT '用户ID',
  `mobile` int(11) DEFAULT NULL COMMENT '用户手机号',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for p_order
-- ----------------------------
DROP TABLE IF EXISTS `p_order`;
CREATE TABLE `p_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `create_time` int(11) DEFAULT NULL,
  `update_time` int(11) DEFAULT NULL,
  `status` int(1) unsigned zerofill DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
