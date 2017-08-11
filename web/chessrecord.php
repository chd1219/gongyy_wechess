<?php
$pindex = max(1, intval($_GPC['page']));
$psize = 10;
switch($operation){
	case 'display':
	{
		$condition = " uniacid='{$uniacid}' ";
		$status  = $_GPC['status'];
		if($status!=''){
			$condition .= " AND status = {$status} ";
		}
		/* 对弈时间*/

		/* 代理时间 */
		if (!empty($_GPC['chesstime'])) {
			$starttime = strtotime($_GPC['chesstime']['start']);
			$endtime   = strtotime($_GPC['chesstime']['end']);
		}else{
			$starttime = strtotime('-1 month');
			$endtime   = time();
		}

		if($_GPC['searchtime']==1){
			if (!empty($_GPC['chesstime'])) {

				$condition .= " AND addtime >= $starttime AND addtime <= $endtime ";
			}
		}
		$list = pdo_fetchall("SELECT * FROM " . tablename($this->table_chessrecord) . " WHERE {$condition} ORDER BY id DESC LIMIT " . ($pindex - 1) * $psize . ',' . $psize);       
		$total = pdo_fetchcolumn("SELECT COUNT(*) FROM " . tablename($this->table_chessrecord) . " WHERE {$condition} ");
		$pager = pagination($total, $pindex, $psize);
		include $this->template('chessrecord');
	}break;
	case 'post':
	{
		$record = pdo_get($this->table_chessrecord,array('id'=>$_GPC['id']));
		$serverSendRecord = json_decode($record['serverSendRecord']);
		$serverReceiveRecord = json_decode($record['serverReceiveRecord']);
		if(!empty($serverSendRecord)){
			foreach ($serverSendRecord as $key => $value) {
				if($value==''){
					unset($serverSendRecord[$key]);
				}
			}
		}
		if(!empty($serverReceiveRecord)){
			foreach ($serverReceiveRecord as $key => $value) {
				if($value==''){
					unset($serverReceiveRecord[$key]);
				}
			}
		}
		include $this->template('chessrecord');
	}break;
	case 'delete':
	{
		 $id = intval($_GPC['id']);
           
		 if(pdo_delete($this->table_chessrecord, array('id' => $id))){
		 	message('删除走棋记录成功',$this->createWebUrl('chessrecord', array('op' => 'display')), 'success');
		 }else{
		 	message('该记录不存在或已经被删除',$this->createWebUrl('chessrecord', array('op' => 'display')), 'error');
		 }
            
	}break;
}