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
$categories = pdo_fetchall("SELECT * FROM " .tablename($this->table_category). " WHERE uniacid='{$uniacid}' ORDER BY displayorder DESC");

//根据不同的操作展示不同的界面
switch($operation){
    case 'display':
        {
            $condition = " uniacid='{$uniacid}' ";
			$categoryid = $_GPC['categoryid'];
			$title = $_GPC['title'];
            $playername = $_GPC['playername'];
			$iszhiding = $_GPC['iszhiding'];
			$isjinghua = $_GPC['isjinghua'];
			$ishot = $_GPC['ishot'];
            $status  = $_GPC['status'];
            
            
			
            if(!empty($title)){
                $condition .= " AND title LIKE '%{$title}%'";
            }
            
			if($_GPC['iszhiding']==1){
                $condition .= " AND iszhiding = 1";
            }
			if($_GPC['isjinghua']==1){
                $condition .= " AND isjinghua = 1";
            }
			if($_GPC['ishot']==1){
                $condition .= " AND ishot = 1";
            }
			
			if($categoryid!=''){
                $condition .= " AND categoryid = {$categoryid}";
            }
			
            if($status!=''){
                $condition .= " AND status LIKE '%{$status}%'";
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
					
					$condition .= " AND chesstime >= $starttime AND chesstime <= $endtime ";
				}
			}
            
			if(!empty($playername)){
                $condition .= " AND redname LIKE '%{$playername}%' OR blackname LIKE '%{$playername}%'";
            }
            $list = pdo_fetchall("SELECT * FROM " . tablename($this->table_chess) . " WHERE {$condition} ORDER BY id DESC LIMIT " . ($pindex - 1) * $psize . ',' . $psize);
			
                        
            $total = pdo_fetchcolumn("SELECT COUNT(*) FROM " . tablename($this->table_chess) . " WHERE {$condition} ");
            $pager = pagination($total, $pindex, $psize);
            
            
        }break;
		case 'post':
		{
			$id = intval($_GPC['id']); /* 当前棋手id */
			$chess['chesstime'] = time();
	

			if (!empty($id)) {
				$chess= pdo_fetch("SELECT * FROM " . tablename($this->table_chess) . " WHERE uniacid = '$uniacid' AND id = '$id'");
				if(empty($chess)){
					message("该棋谱不存在或已被删除！", "", "error");
				}
			}

			if (checksubmit('submit')) {
				if (empty($_GPC['title'])) {
					message("抱歉，请输入棋谱标题！");
				}
			if (empty($_GPC['blackname']) || empty($_GPC['redname'])) {
					message("抱歉，请输入棋手名字！");
				}
				if (empty($_GPC['status'])) {
					message("抱歉，请选择审核状态！");
				}				
					
				
		
				$isexist = pdo_fetch("SELECT id FROM " .tablename($this->table_chess). " WHERE uniacid='{$uniacid}' AND title='{$data['title']}' LIMIT 1");
		
				if (!empty($id)) {
					
					if($isexist && $id!=$isexist['id']){
						message("抱歉，该棋手名称已存在！");
					}
					$updatedata = array(
					'uniacid'      => $_W['uniacid'],
					'categoryid'   => trim($_GPC['categoryid']),
					'title'	       => trim($_GPC['title']),
					'redname'      => trim($_GPC['redname']),
					'blackname'    => trim($_GPC['blackname']),
					'comment'      => trim($_GPC['comment']),
					'chesstime'    => trim(strtotime($_GPC['chesstime'])),
					'status'       => trim($_GPC['status']),
					'iszhiding'    => trim($_GPC['iszhiding']),
					'isjinghua'    => trim($_GPC['isjinghua']),
					'ishot'        => trim($_GPC['ishot']),
					'updatetime'   => time(),
					
					);
					pdo_update($this->table_chess, $updatedata, array('id' => $id));
				} else {
					if(!empty($isexist)){
						message("抱歉，该棋手已存在！");
					}
					$adddata = array(
					'uniacid'      => $_W['uniacid'],
					'categoryid'   => trim($_GPC['categoryid']),
					'title'	       => trim($_GPC['title']),
					'redname'      => trim($_GPC['redname']),
					'blackname'    => trim($_GPC['blackname']),
					'comment'      => trim($_GPC['comment']),
					'chesstime'    => trim(strtotime($_GPC['chesstime'])),
					'status'       => trim($_GPC['status']),
					'iszhiding'    => trim($_GPC['iszhiding']),
					'isjinghua'    => trim($_GPC['isjinghua']),
					'ishot'        => trim($_GPC['ishot']),
					'updatetime'      => time(),
					'addtime'      => time(),
					);
					pdo_insert($this->table_chess, $adddata);
				}
				message("更新棋手成功！", $this->createWebUrl('chess', array('op' => 'display')), "success");
			}					
		}break;
}
include $this->template('chess');