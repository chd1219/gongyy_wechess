<?php
/**
 * 会员充值积分管理
 * ADD 2017-03-19
 */

$title = "我的积分";
/*$setting = pdo_fetch("SELECT credit1_ratio,isfollow FROM " . tablename($this->table_setting) . " WHERE uniacid =:uniacid LIMIT 1", array(':uniacid' => $uniacid));*/
if($setting['credit1_ratio']==0){
	message("充值功能未开启，请联系管理员");
}

if($op=='display'){
	/* 粉丝信息 */
	$memberInfo = pdo_fetch("SELECT uid,nickname,credit1 FROM " .tablename($this->table_member). " WHERE uniacid=:uniacid AND uid=:uid ", array(':uniacid'=>$uniacid, ':uid'=>$_W['fans']['uid']));

}elseif($op=='recharge'){
	$credit = intval($_GPC['credit_number']);
		if(empty($credit)){
			message("充值积分必须为正整数");
		}
		$payAmount = round($credit*$setting['credit1_ratio']*0.01, 2);
		
		$data = array(
			'acid' => $_W['acid'],
			'uniacid' => $_W['uniacid'],
			'ordersn' => date('Ymd') . substr(implode(NULL, array_map('ord', str_split(substr(uniqid(), 7, 13), 1))), 0, 8),
			'uid' => $_W['fans']['uid'],
			'openid' => $_W['fans']['openid'],
			'credit_number' => $credit,
			'change_ratio' => $setting['credit1_ratio'],
			'total_amount' => $payAmount,
			'addtime' => time(),
		);
		pdo_insert($this->table_credit_order, $data);
		$orderid = pdo_insertid();
		
		if ($orderid) {
			header("Location:" . $this->createMobileUrl('pay', array('ptype'=>'recharge','orderid' => $orderid)));
		} else {
			message("写入订单数据失败", "", "error");
		}

}

include $this->template('credit');

?>