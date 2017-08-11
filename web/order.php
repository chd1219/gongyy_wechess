<?php
/**
 * 积分充值订单
 * ============================================================================
 * 版权所有 2015-2016 风影随行，并保留所有权利。
 * 网站地址: http://www.haoshu888.com；
 * ----------------------------------------------------------------------------
 * 这不是一个自由软件！不允许对程序代码以任何形式任何目的的再发布，作者将保留
 * 追究法律责任的权力和最终解释权。
 * ============================================================================
 */
$pindex = max(1, intval($_GPC['page']));
$psize = 10;

switch ($operation) {
    case 'display':
        {
            $condition = " a.uniacid = :uniacid";
			$params[':uniacid'] = $uniacid;
			if (!empty($_GPC['ordersn'])) {
				$condition .= " AND a.ordersn LIKE :ordersn ";
				$params[':ordersn'] = "%{$_GPC['ordersn']}%";
			}
			if (!empty($_GPC['nickname'])) {
				$condition .= " AND b.nickname LIKE :nickname ";
				$params[':nickname'] = "%{$_GPC['nickname']}%";
			}
			if ($_GPC['status']!='') {
				$condition .= " AND a.status = :status ";
				$params[':status'] = "%{$_GPC['status']}%";
			}
			
			if (!empty($_GPC['time'])) {
				$condition .= " AND a.addtime >= :starttime AND a.addtime <= :endtime ";
				$params[':starttime'] = strtotime($_GPC['time']['start']);
				$params[':endtime'] = strtotime($_GPC['time']['end']) + 86399;
			}
			if (empty($starttime) || empty($endtime)) {
				$starttime = strtotime('-1 month');
				$endtime = time();
			}

			$list = pdo_fetchall("SELECT a.*,b.nickname FROM " .tablename($this->table_credit_order). " a LEFT JOIN " .tablename('mc_members'). " b ON a.uid=b.uid WHERE {$condition} ORDER BY a.id desc, a.addtime DESC LIMIT " .($pindex - 1) * $psize. ',' . $psize, $params);
			
			$total = pdo_fetchcolumn('SELECT COUNT(*) FROM ' .tablename($this->table_credit_order). " a LEFT JOIN " .tablename('mc_members'). " b ON a.uid=b.uid WHERE {$condition}", $params);
			$pager = pagination($total, $pindex, $psize);   
        }
        break;
    case 'delete':
        {
            $id = intval($_GPC['id']);
			$order = pdo_fetch("SELECT id FROM " .tablename($this->table_credit_order). " WHERE uniacid=:uniacid AND id=:id", array(':uniacid'=>$uniacid, ':id'=>$id));
			if(empty($order)){
				message("订单不存在或已被删除", "", "error");
			}
            if(pdo_delete($this->table_credit_order, array('id' => $id))){
				message('删除订单成功',  $this->createWebUrl('order'), 'success');
			}else{
				message('删除订单失败，请稍后重试',  "", 'error');
			}
            
        }
}
include $this->template('order');