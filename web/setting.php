<?php
/**
 * 系统设置
 * ============================================================================
 * 版权所有 2015-2016 风影随行，并保留所有权利。
 * 网站地址: http://www.haoshu888.com
 * ----------------------------------------------------------------------------
 * 这不是一个自由软件！不允许对程序代码以任何形式任何目的的再发布，作者将保留
 * 追究法律责任的权力和最终解释权。
 * ============================================================================
 */
load()->func('tpl');
load()->model('mc');
switch($op){
    case 'display':{

         $set = json_decode($setting['manage']);
    $salers = array();
    if (isset($set)) {
        if (!empty($set)) {
            $openids     = array();
            //$strsopenids = explode(",", $set);
            foreach ($set as $key=>$openid) {
            	if($openid=='')continue;
                $openids[] = "'" . $openid . "'";
				$map['openid'] = $openid;
				$map['uniacid'] = $_W['uniacid'];
				$member = pdo_get($this -> table_user,$map);
				$salers[$key]['nickname'] = $member['nickname'];
				$salers[$key]['openid'] = $openid;
				$uid = mc_openid2uid($openid);
				$info = pdo_fetch("SELECT avatar FROM " . tablename('mc_members') . " WHERE uniacid='{$uniacid}' AND uid='{$uid}'");
				$salers[$key]['avatar'] = $info['avatar'];
            }

        }
    }
        if (checksubmit('submit')) {

            $data = array(
                'uniacid'          => $_W['uniacid'],                 /* 公众号id */
                'sitename'         => trim($_GPC['sitename']),        /* 网站名称 */
                'copyright'        => trim($_GPC['copyright']),       /* app底部版权 */
                'description'      => trim($_GPC['description']),     /* app分享描述 */
                'logo'             => trim($_GPC['logo']),            /* app分享图片 */
                'isfollow'         => intval($_GPC['isfollow']),    
                /* 引导语 */
                'followdescription'         => trim($_GPC['followdescription']),    
                  /* 是否强制关注公众号 */
                'qrcode'           => $_GPC['qrcode'],                /* 公众号二维码 */
                'manageopenid'     => trim($_GPC['manageopenid']),    /* 管理员openid(新订单提醒) */
                'manage'           =>json_encode($_GPC['openids']),
                'credit1_ratio'    => trim($_GPC['credit1_ratio']),   /* 积分充值付款比例 */
                'updatetime'       => time(),
                'addtime'          => time(),
                );


            if (empty($setting)) {
                pdo_insert($this->table_setting, $data);
            } else {
                unset($data['addtime']);
                pdo_update($this->table_setting, $data, array('uniacid' => $_W['uniacid']));
            }
            message('操作成功', $this->createWebUrl('setting'), 'success');
            
        }

   
    }break;
    case 'templatemsg':{
        if (checksubmit('submit')) {
            $data = array(
                'uniacid'          => $_W['uniacid'],                 /* 公众号id */
                'istemplate'      => intval($_GPC['istemplate']),   /* 是否开启模版消息 */
                'chess_add_info'          => trim($_GPC['chess_add_info']),         /* 购买成功 */
                'player_add_info'          => trim($_GPC['player_add_info']),         /* 会员服务过期 */
                'collect_update_info'          => trim($_GPC['collect_update_info']),         /* 佣金提醒 */
                'publish_share_info'          => trim($_GPC['publish_share_info']),         
                'addtime'          => time(),
                );

            if (empty($setting)) {
                pdo_insert($this->table_setting, $data);
            } else {
                unset($data['addtime']);
                pdo_update($this->table_setting, $data, array('uniacid' => $_W['uniacid']));
            }
            message('操作成功', $this->createWebUrl('setting', array('op'=>'templatemsg')), 'success');
        }
    }
    break;
	case 'vipService':{
		$vip = json_decode($setting['vip_service'], true);
        if (checksubmit('submit')) {
            $data = array(
				'uniacid'  => $_W['uniacid'],
				'addtime'  => time(),
			);
			/* 会员服务 */
			$viptime = $_GPC['vip']['time'];
			$vipmoney = $_GPC['vip']['time'];
			$vipservice = array();
			foreach ($_GPC['viptime'] as $key => $row) {
				$row = floatval($row);
				$vipmoney = floatval($_GPC['vipmoney'][$key]);
				if (!$row || !$vipmoney)
					continue;
				$vipservice[] = array(
					'viptime' => $row,
					'vipmoney' => $vipmoney,
				);
			}
			$data['vip_service'] = json_encode($vipservice);
			$data['vipdesc'] = $_GPC['vipdesc'];

            if (empty($setting)) {
                pdo_insert($this->table_setting, $data);
            } else {
                unset($data['addtime']);
                pdo_update($this->table_setting, $data, array('uniacid' => $_W['uniacid']));
            }
            message('操作成功', $this->createWebUrl('setting', array('op'=>'vipService')), 'success');
        }
    }
    break;

	case 'member_search' :{
			$keyword =	trim($_GPC['keyword']);
			if($keyword!=''){
			$image = pdo_fetch("SELECT avatar,nickname FROM " . tablename('mc_members') . " WHERE uniacid='{$_W['uniacid']}' AND nickname= '{$keyword}'");
			$conditon['nickname'] = $keyword;
			$mem = pdo_get($this->table_user,$conditon);
			$ds['avatar'] = $image['avatar'];
			$ds['nickname'] = $image['nickname'];
			$ds['openid'] = $mem['openid'];
			 return include $this->template('query');
		}
	}
	break;
}


include $this->template('setting');

?>