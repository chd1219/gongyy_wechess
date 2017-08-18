<?php
/**
 * 会员积分兑换VIP管理
 * ADD 2017-03-19
 */

$title = "VIP服务";
$vip_service = json_decode($setting['vip_service'], true);
/* 粉丝信息 */
$memberInfo = pdo_fetch("SELECT a.uid,a.nickname,a.credit1,b.openid,b.vip,b.vip_validity FROM " .tablename($this->table_member). " a INNER JOIN " .tablename($this->table_user). " b ON a.uid=b.uid WHERE a.uniacid=:uniacid AND a.uid=:uid ", array(':uniacid'=>$uniacid, ':uid'=>$_W['fans']['uid']));
if(empty($memberInfo)){
	message("获取会员信息失败，请稍候重试!");
}

if($op=='display'){
	if(empty($vip_service)){
		message("系统未开启兑换VIP服务，如有疑问请联系管理员!");
	}

}elseif($op=='exchange'){
	
	$viptime = intval($_GPC['viptime']);
	if(empty($viptime)){
		message("请选择要兑换VIP的时长!", $this->createMobileUrl('vip'), "error");
	}
	$i = null;
	foreach($vip_service as $key=>$value){
		if($value['viptime']==$viptime){
			$i = $key;
			break;
		}
	}
	if(empty($vip_service[$i])){
		message("兑换VIP时长有误，请重新选择!", $this->createMobileUrl('vip'), "error");
	}
	if($memberInfo['credit1'] < $vip_service[$i]['vipmoney']){
		message("您的积分不足，请充值后重新兑换!", $this->createMobileUrl('credit'), "error");
	}
	
	//扣除用户积分
	$log = array(
		'0' => '',
		'1' => '兑换象棋服务'.$vip_service[$i]['viptime'].'天VIP',
		'2' => 'gongyy_wechess',
		'3' => '',
		'4' => '',
		'5' => '1',
	);
	if(mc_credit_update($memberInfo['uid'], 'credit1', -$vip_service[$i]['vipmoney'], $log)){
		//查询会员积分数
		$member = mc_fetch($memberInfo['uid'],array('credit1'));
		//添加积分日志记录
		$creditLog = array(
			'acid' => $_W['acid'],
			'uniacid' => $_W['uniacid'],
			'orderid' => '',
			'uid' => $memberInfo['uid'],
			'openid' => $memberInfo['openid'],
			'log_type' => 2,
			'change_type' => 2,
			'number' => $vip_service[$i]['vipmoney'],
			'after_total' => $member['credit1'],
			'addtime' => time(),
		);
		pdo_insert($this->table_credit_log, $creditLog);

		//增加用户VIP时长
		$update = array('vip'=>1);
		if($memberInfo['vip']==0 || time()>$memberInfo['vip_validity']){
			$update['vip_validity'] = time()+86400*$vip_service[$i]['viptime'];
		}else{
			$update['vip_validity'] = $memberInfo['vip_validity']+86400*$vip_service[$i]['viptime'];
		}
		if(pdo_update($this->table_user, $update, array('uniacid'=>$uniacid, 'uid'=>$memberInfo['uid']))){
			message('兑换成功', $this->createMobileUrl('self'), "success");
		}else{
			//失败时应写入日志
			$operation_log = array(
				'uniacid' => $uniacid,
				'uid' => $memberInfo['uid'],
				'ip' => $_SERVER["REMOTE_ADDR"],
				'type' => 1,
				'desc' => 'uid为'.$memberInfo['uid'].'的用户兑换VIP[时长：'.$vip_service[$i]['viptime'].'天 - '.$vip_service[$i]['vipmoney'].'积分]服务失败，积分已扣除，服务未开通',
				'addtime' => time(),
			);
			pdo_insert($this->table_operation_log, $operation_log);
			message('兑换失败，如有疑问，请联系管理员!', "", "error");
		}
	}

}

include $this->template('exchangeVip');

?>