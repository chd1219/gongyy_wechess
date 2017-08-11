<?php
switch($operation){
	case 'display':
	{

	}break;
	case 'save':
	{
		if($_GPC['serverSendRecord']!=''){
			if($_GPC['movesIndex']<2&&!isset($_GPC['serverReceiveRecord'][$_GPC['movesIndex']])&&$_GPC['serverSendRecord'][$_GPC['movesIndex']][2]<1000){
				$data['openid'] = $_W['openid'];
				$data['uniacid'] = $_W['uniacid'];
				$data['uid'] = mc_openid2uid($_W['openid']);
				$data['nickname'] = $_W['fans']['nickname'];
				$data['addtime'] = time();
				$data['movelength'] = $_GPC['movesIndex'];
				$data['serverSendRecord'] = json_encode($_GPC['serverSendRecord']);
				pdo_insert($this->table_chessrecord,$data);
			}else{
				$sql = "select id from ". tablename($this->table_chessrecord)." where openid='{$_W['openid']}' AND uniacid='{$_W['uniacid']}' ORDER by id DESC LIMIT 1";
				$result = pdo_fetch($sql);
				$data['addtime'] = time();
				$data['serverSendRecord'] = json_encode($_GPC['serverSendRecord']);
				$data['serverReceiveRecord'] = json_encode($_GPC['serverReceiveRecord']);
				if(count($_GPC['serverSendRecord'])==count($_GPC['serverReceiveRecord'])){
					$data['status'] = 1;
				}else{
					$data['status'] = 0;
				}
				$data['movelength'] = $_GPC['movesIndex'];
				pdo_update($this->table_chessrecord,$data,array('id'=>$result['id']));
			}
		}
	}break;
}