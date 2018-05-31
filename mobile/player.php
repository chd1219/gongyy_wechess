<?php

switch($op){
    case 'display':{
        $keywords = $_GPC['keywords'];
        include $this->template('player');
    }break;
    case 'search':{
        //只放第一页
        $pindex = max(1, intval($_GPC['page']));
        $psize = $listnum;
        $condition = " uniacid='{$uniacid}' ";
        $categoryid = $_GPC['categoryid'];
        $keywords = $_GPC['keywords'];
        //只展示审核通过的
        $status  = 1;
        
        // where 条件
        
        if($status!=''){
            $condition .= " AND status = {$status}";
        }
        
        if(!empty($keywords)){
            $condition .= " AND playername LIKE '%{$keywords}%'";
        }
        
        
        $list = pdo_fetchall("SELECT * FROM " . tablename($this->table_player) . " WHERE {$condition} ORDER BY followsum DESC, addtime DESC LIMIT " . ($pindex - 1) * $psize . ',' . $psize);
        include $this->template('player_search');
    }break;
    case 'ajax':{
        //只放第一页
        $pindex = max(1, intval($_GPC['page']));
        $psize = $listnum;
        $condition = " uniacid='{$uniacid}' ";
        $categoryid = $_GPC['categoryid'];
        $keywords = $_GPC['keywords'];
        //只展示审核通过的
        $status  = 1;
        
        // where 条件
        
        if($status!=''){
            $condition .= " AND status = {$status}";
        }
        
        if(!empty($keywords)){
            $condition .= " AND playername LIKE '%{$keywords}%'";
        }
        
        
        $list = pdo_fetchall("SELECT * FROM " . tablename($this->table_player) . " WHERE {$condition} ORDER BY followsum DESC, addtime DESC LIMIT " . ($pindex - 1) * $psize . ',' . $psize);
        echo json_encode($this->data2playerhtml($list,$openid));
    }break;
	case 'fix':{
		// 修复棋手库
		$list  = pdo_getall($this->table_player);
		echo 1;
		foreach($list as $k=>$v){
			$condition['id'] = $v['id'];
			$data['playername'] =  preg_replace("/\s/","",$v['playername']);
			pdo_update($this->table_player,$data,$condition);
			echo "成功！<br>";
		}
	}
    
}


