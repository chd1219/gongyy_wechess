<?php
/**
 * 棋手管理
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

//根据不同的操作展示不同的界面
switch($operation){
    case 'display':
        {
            $condition = " uniacid='{$uniacid}' ";
            $playername = $_GPC['playername'];
            $status  = $_GPC['status'];
            $playerlevel  = $_GPC['playerlevel'];
			$playertype  = $_GPC['playertype'];
            
            if(!empty($playername)){
                $condition .= " AND playername LIKE '%{$playername}%'";
            }
            if($status!=''){
                $condition .= " AND status LIKE '%{$status}%'";
            }
            if($playerlevel!=''){
                $condition .= " AND playerlevel='{$playerlevel}'";
            }
            if($playertype==1){
				$condition .= " AND uid =0 ";
			}elseif($playertype==2){
				$condition .= " AND uid!=0";
			}
            
            
            $list = pdo_fetchall("SELECT * FROM " . tablename($this->table_player) . " WHERE {$condition} ORDER BY id DESC LIMIT " . ($pindex - 1) * $psize . ',' . $psize);
            $i=0;
            foreach ($list as $key=>$certificate){
                $certificates[$key] = $list[$key]['certificate'] = json_decode($list[$key]['certificate']);
            
            }         
            //var_dump(  $certificates);
            $total = pdo_fetchcolumn("SELECT COUNT(*) FROM " . tablename($this->table_player) . " WHERE {$condition} ");
            $pager = pagination($total, $pindex, $psize);
            
            
        }
		case 'post':
		{
			$id = intval($_GPC['id']); /* 当前棋手id */
	

			if (!empty($id)) {
				$player = pdo_fetch("SELECT * FROM " . tablename($this->table_player) . " WHERE uniacid = '$uniacid' AND id = '$id'");
				$player['certificate'] = json_decode($player['certificate']);
				
				if(empty($player)){
					message("该棋手不存在或已被删除！", "", "error");
				}
			}

			if (checksubmit('submit')) {
				if (empty($_GPC['playername'])) {
					message("抱歉，请输入棋手名称！");
				}
				if (empty($_GPC['photo'])) {
					message("抱歉，请上传棋手头像！");
				}				
				if (empty($_GPC['status'])) {
					message("抱歉，请选择棋手状态！");
				}
		
				
		
				$isexist = pdo_fetch("SELECT id FROM " .tablename($this->table_player). " WHERE uniacid='{$uniacid}' AND playername='{$data['playername']}' LIMIT 1");
		
				if (!empty($id)) {
					
					if($isexist && $id!=$isexist['id']){
						message("抱歉，该棋手名称已存在！");
					}
					$updatedata = array(
					'uniacid'		=> $_W['uniacid'],
					'playername'	=> trim($_GPC['playername']),
					'playerlevel'	=> trim($_GPC['playerlevel']),
					'letter'		=> $this->getFirstCharter(trim($_GPC['playername'])),
					'status'		=> trim($_GPC['status']),
					'photo'			=> trim($_GPC['photo']),
					'certificate'	=> json_encode($_GPC['certificate']),
					'qq'			=> trim($_GPC['qq']),
					'phone' 		=> trim($_GPC['phone']),
					'playerdes'		=> trim($_GPC['playerdes']),
					'playerdes'		=> trim($_GPC['playerdes']),
					'updatetime'	=> time(),
					
					);
					pdo_update($this->table_player, $updatedata, array('id' => $id));
				} else {
					if(!empty($isexist)){
						message("抱歉，该棋手已存在！");
					}
					$adddata = array(
					'uniacid'		=> $_W['uniacid'],
					'playername'	=> trim($_GPC['playername']),
					'playerlevel'	=> trim($_GPC['playerlevel']),
					'letter'		=> $this->getFirstCharter(trim($_GPC['playername'])),
					'status'		=> trim($_GPC['status']),
					'photo'			=> trim($_GPC['photo']),
					'certificate'	=> json_encode(trim($_GPC['certificate'])),
					'qq'			=> trim($_GPC['qq']),
					'phone' 		=> trim($_GPC['phone']),
					'playerdes'		=> trim($_GPC['playerdes']),
					'playerdes'		=> trim($_GPC['playerdes']),
					'updatetime'	=> time(),
					'addtime'		=> time(),
					);
					pdo_insert($this->table_player, $adddata);
				}
				
				message("更新棋手成功！", $this->createWebUrl('player', array('op' => 'display')), "success");
			}					
		}
}
include $this->template('player');