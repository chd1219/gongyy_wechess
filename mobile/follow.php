<?php
/**
 * 关注二维码
 * ============================================================================
 * 版权所有 2015-2016 风影随行，并保留所有权利。
 * 网站地址: http://www.haoshu888.com
 * ----------------------------------------------------------------------------
 * 这不是一个自由软件！不允许对程序代码以任何形式任何目的的再发布，作者将保留
 * 追究法律责任的权力和最终解释权。
 */


/* 基本设置 */
$setting = pdo_fetch("SELECT qrcode,followdescription FROM " . tablename($this->table_setting) . " WHERE uniacid =:uniacid LIMIT 1", array(':uniacid' => $_W['uniacid']));
/* 分享设置 */
load()->model('mc');
$shareuid = mc_openid2uid($_W['openid']);
$shareurl = $_W['siteroot'] .'app/'. $this->createMobileUrl('index', array('uid'=>$shareuid));

$title = "关注公众号";

include $this->template('follow');

?>