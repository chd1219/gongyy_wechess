<?php
$sql = "
        
CREATE TABLE IF NOT EXISTS `ims_gongyy_wechess_category` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `uniacid` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '所属帐号',
 `name` varchar(50) NOT NULL COMMENT '分类名称',
 `parentid` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '上级分类ID,0为第一级',
 `ico` varchar(255) DEFAULT NULL COMMENT '分类图标',
 `displayorder` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '排序',
 `addtime` int(10) DEFAULT NULL COMMENT '添加时间',
 PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COMMENT='课程分类表';

CREATE TABLE IF NOT EXISTS `ims_gongyy_wechess_chess` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `uniacid` int(11) NOT NULL,
 `categoryid` int(11) NOT NULL DEFAULT '-1',
 `redplayerid` int(11) NOT NULL DEFAULT '0',
 `reduid` int(11) NOT NULL DEFAULT '0',
 `redopenid` varchar(255) DEFAULT NULL,
 `redname` varchar(60) DEFAULT NULL,
 `blackplayerid` int(11) NOT NULL DEFAULT '0',
 `blackuid` int(11) NOT NULL DEFAULT '0',
 `blackopenid` varchar(255) DEFAULT NULL,
 `blackname` varchar(60) DEFAULT NULL,
 `filename` varchar(255) DEFAULT NULL,
 `chessdata` longtext,
 `title` varchar(255) NOT NULL,
 `comment` text NOT NULL,
 `chesstime` int(11) DEFAULT '0',
 `uid` int(11) NOT NULL DEFAULT '0',
 `openid` varchar(255) DEFAULT NULL,
 `iszhiding` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1置顶',
 `isjinghua` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1精华',
 `ishot` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1热门',
 `status` tinyint(1) NOT NULL DEFAULT '2' COMMENT '1审核通过1未审核-1未通过',
 `clicksum` int(10) unsigned NOT NULL DEFAULT '0',
 `collectsum` int(10) unsigned NOT NULL DEFAULT '0',
 `sharesum` int(10) unsigned NOT NULL DEFAULT '0',
 `updatetime` int(11) NOT NULL DEFAULT '0',
 `addtime` int(11) NOT NULL DEFAULT '0',
 PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=337 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `ims_gongyy_wechess_collect` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `uniacid` int(11) NOT NULL DEFAULT '0',
 `uid` int(11) NOT NULL DEFAULT '0',
 `openid` varchar(255) DEFAULT NULL,
 `chessid` int(11) NOT NULL DEFAULT '0',
 `filename` varchar(255) DEFAULT NULL,
 `addtime` int(11) NOT NULL DEFAULT '0',
 PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=208 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `ims_gongyy_wechess_feedback` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `uniacid` int(11) NOT NULL DEFAULT '0',
 `uid` int(11) NOT NULL DEFAULT '0',
 `openid` varchar(255) DEFAULT NULL,
 `nickname` varchar(20) NOT NULL,
 `description` varchar(300) NOT NULL COMMENT '问题描述',
 `photo` varchar(255) NOT NULL COMMENT '问题图片',
 `score` int(1) NOT NULL DEFAULT '0' COMMENT '应用评分',
 `contact` varchar(30) NOT NULL COMMENT '联系方式',
 `createtime` int(11) NOT NULL DEFAULT '0',
 `issolved` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0未解决1解决',
 `solvedname` varchar(10) NOT NULL COMMENT '问题解决人',
 `solvedtime` int(11) NOT NULL COMMENT '解决时间',
 `record` varchar(100) NOT NULL COMMENT '问题记录',
 PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=36 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `ims_gongyy_wechess_follow` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `uniacid` int(11) NOT NULL DEFAULT '0',
 `uid` int(11) NOT NULL DEFAULT '0',
 `openid` varchar(255) DEFAULT NULL,
 `playerid` int(11) NOT NULL DEFAULT '0',
 `addtime` int(11) NOT NULL DEFAULT '0',
 PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=612 DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `ims_gongyy_wechess_player` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `uniacid` int(11) NOT NULL,
 `playername` varchar(40) DEFAULT NULL,
 `letter` char(1) DEFAULT NULL,
 `playerlevel` varchar(40) NOT NULL DEFAULT '业余棋手',
 `chesssum` int(11) NOT NULL DEFAULT '0',
 `followsum` int(11) NOT NULL DEFAULT '0',
 `status` tinyint(1) NOT NULL DEFAULT '2',
 `uid` int(11) NOT NULL DEFAULT '0',
 `openid` varchar(255) DEFAULT NULL,
 `photo` varchar(255) DEFAULT NULL,
 `certificate` varchar(255) DEFAULT NULL,
 `qq` varchar(20) DEFAULT NULL,
 `phone` varchar(20) DEFAULT NULL,
 `playerdes` text,
 `updatetime` int(11) NOT NULL DEFAULT '0',
 `addtime` int(11) NOT NULL DEFAULT '0',
 PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=313 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `ims_gongyy_wechess_setting` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `uniacid` int(11) NOT NULL DEFAULT '0',
 `sitename` varchar(60) DEFAULT NULL,
 `copyright` varchar(255) DEFAULT NULL,
 `description` varchar(255) DEFAULT NULL,
 `logo` varchar(255) DEFAULT NULL,
 `qrcode` varchar(255) DEFAULT NULL,
 `isfollow` tinyint(1) NOT NULL DEFAULT '0',
 `istemplate` tinyint(2) NOT NULL DEFAULT '1' COMMENT '1开启模板',
 `chess_add_info` varchar(255) NOT NULL DEFAULT '' COMMENT '新增棋谱模板',
 `player_add_info` varchar(255) NOT NULL DEFAULT '' COMMENT '新增棋手模板',
 `collect_update_info` varchar(255) NOT NULL DEFAULT '' COMMENT '收藏更新模板',
 `follow_update_info` varchar(255) NOT NULL DEFAULT '' COMMENT '关注更新模板',
 `publish_read_info` varchar(255) NOT NULL DEFAULT '' COMMENT '棋谱浏览更新',
 `publish_share_info` varchar(255) NOT NULL DEFAULT '' COMMENT '棋谱分享更新模板',
 `manageopenid` varchar(255) DEFAULT NULL,
 `updatetime` int(11) NOT NULL DEFAULT '0',
 `addtime` int(11) NOT NULL DEFAULT '0',
 PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `ims_gongyy_wechess_user` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
 `uniacid` int(11) NOT NULL,
 `uid` int(11) NOT NULL,
 `openid` varchar(255) NOT NULL,
 `nickname` varchar(100) DEFAULT NULL,
 `parentid` int(11) NOT NULL DEFAULT '0',
 `flowsum` int(11) NOT NULL DEFAULT '0',
 `collectsum` int(11) NOT NULL DEFAULT '0',
 `publishsum` int(11) NOT NULL DEFAULT '0',
 `updatetime` int(11) DEFAULT '0',
 `addtime` int(11) NOT NULL DEFAULT '0',
 PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=381 DEFAULT CHARSET=utf8;

	CREATE TABLE IF NOT EXISTS `ims_gongyy_wechess_user_setting` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `uniacid` int(8) NOT NULL,
 `openid` varchar(50) NOT NULL,
 `chess_add_info` tinyint(2) NOT NULL DEFAULT '0' COMMENT '新增棋谱，通知1',
 `player_add_info` tinyint(2) NOT NULL DEFAULT '0' COMMENT '新增棋手通知1',
 `collect_update_info` tinyint(2) NOT NULL DEFAULT '1' COMMENT '收藏更新',
 `follow_update_info` tinyint(2) NOT NULL DEFAULT '1' COMMENT '关注更新',
 `publish_read_info` tinyint(2) NOT NULL DEFAULT '1' COMMENT '浏览更新',
 `publish_share_info` tinyint(1) NOT NULL DEFAULT '1' COMMENT '分享更新',
 `addtime` int(11) NOT NULL DEFAULT '0',
 PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `ims_gongyy_wechess_credit1_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `acid` int(11) NOT NULL,
  `uniacid` int(11) NOT NULL,
  `orderid` varchar(100) DEFAULT NULL COMMENT '订单id',
  `uid` int(11) DEFAULT NULL COMMENT '会员编号',
  `openid` varchar(100) DEFAULT NULL COMMENT '粉丝编号',
  `change_type` tinyint(1) DEFAULT NULL COMMENT '变动类型 1.增加 2.减少',
  `number` int(11) DEFAULT NULL COMMENT '变动数额',
  `after_total` int(11) DEFAULT NULL COMMENT '变动后剩余数额',
  `addtime` int(10) NOT NULL COMMENT '添加时间',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='积分日志表' AUTO_INCREMENT=1 ;
";
pdo_run($sql);