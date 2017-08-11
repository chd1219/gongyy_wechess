<?php

switch($op){
	
	case 'display':{
	    $categoryid = $_GPC['categoryid'];
	    $title = $_GPC['title'];
	    $redname = $_GPC['redname'];
	    $blackname = $_GPC['blackname'];
	    $orderbychesstime = $_GPC['orderbychesstime'];
	    $orderbyclicksum = $_GPC['orderbychesstime'];
	    $orderbycollectsum = $_GPC['orderbycollectsum'];
	    $orderbysharesum = $_GPC['ordersharesum'];
		include $this->template('search');
		
	}break;
	case 'main':{
	    $categoryid = $_GPC['categoryid'];
	    $title = $_GPC['title'];
	    $redname = $_GPC['redname'];
	    $blackname = $_GPC['blackname'];
	    $orderbychesstime = $_GPC['orderbychesstime'];
	    $orderbyclicksum = $_GPC['orderbychesstime'];
	    $orderbycollectsum = $_GPC['orderbycollectsum'];
	    $orderbysharesum = $_GPC['ordersharesum'];
	    include $this->template('search_main');
	}break;
	case 'search':{
			//只放第一页
			$pindex = max(1, intval($_GPC['page']));
			$psize = $listnum;
			$condition = " uniacid='{$uniacid}' ";
			$orderStr = '';
			$orderArr = array();
			$categoryid = $_GPC['categoryid'];
			$title = $_GPC['title'];
            $redname = $_GPC['redname'];
			$blackname = $_GPC['blackname'];
			$orderbyaddtime = 1;
			$orderbychesstime = $_GPC['orderbychesstime'];
			$orderbyclicksum = $_GPC['orderbychesstime'];
			$orderbycollectsum = $_GPC['orderbycollectsum'];
			$orderbysharesum = $_GPC['ordersharesum'];
			
			//只展示审核通过的
            $status  = 1;
			
			// where 条件
			if($categoryid!=''){
                $condition .= " AND categoryid = {$categoryid}";
            }
			
            if(!empty($title)){
                $condition .= " AND title LIKE '%{$title}%'";
            }
			
			if(!empty($redname)){
                $condition .= " AND redname LIKE '%{$redname}%'";
            }
			
			if(!empty($blackname)){
                $condition .= " AND title LIKE '%{$blackname}%'";
            }
			if($status!=''){
                $condition .= " AND status = {$status}";
            }
            // 排序条件orderby
			if($orderbyaddtime == 1){
                array_push($orderArr," addtime DESC ");
            }
			if($orderbychesstime == 1){
                array_push($orderArr," chesstime DESC ");
            }
			if($orderbyclicksum == 1){
                array_push($orderArr," clicksum DESC ");
            }
			if($orderbycollectsum == 1){
                array_push($orderArr," collectsum DESC ");
            }
			if($orderbysharesum == 1){
                array_push($orderArr," sharesum DESC ");
            }
			$orderStr = implode(',',$orderArr);
            $list = pdo_fetchall("SELECT * FROM " . tablename($this->table_chess) . " WHERE {$condition} ORDER BY ". $orderStr." LIMIT " . ($pindex - 1) * $psize . ',' . $psize);
			include $this->template('search_search');
		
	}break;
	case 'ajax':{
		
		//只放第一页
			$pindex = max(1, intval($_GPC['page']));
			$psize = $listnum;
			$condition = " uniacid='{$uniacid}' ";
			$orderStr = '';
			$orderArr = array();
			$categoryid = $_GPC['categoryid'];
			$title = $_GPC['title'];
            $redname = $_GPC['redname'];
			$blackname = $_GPC['blackname'];
			$orderbyaddtime = 1;
			$orderbychesstime = $_GPC['orderbychesstime'];
			$orderbyclicksum = $_GPC['orderbychesstime'];
			$orderbycollectsum = $_GPC['orderbycollectsum'];
			$orderbysharesum = $_GPC['ordersharesum'];
			//只展示审核通过的
            $status  = 1;
			// where 条件
			if($categoryid!=''){
                $condition .= " AND categoryid = {$categoryid}";
            }
            if(!empty($title)){
                $condition .= " AND title LIKE '%{$title}%'";
            }
			if(!empty($redname)){
                $condition .= " AND redname LIKE '%{$redname}%'";
            }
			if(!empty($blackname)){
                $condition .= " AND title LIKE '%{$blackname}%'";
            }
			if($status!=''){
                $condition .= " AND status = {$status}";
            }
            // 排序条件orderby
			if($orderbyaddtime == 1){
                array_push($orderArr," addtime DESC ");
            }
			if($orderbychesstime == 1){
                array_push($orderArr," chesstime DESC ");
            }
			if($orderbyclicksum == 1){
                array_push($orderArr," clicksum DESC ");
            }
			if($orderbycollectsum == 1){
                array_push($orderArr," collectsum DESC ");
            }
			if($orderbysharesum == 1){
                array_push($orderArr," sharesum DESC ");
            }
			$orderStr = implode(',',$orderArr);
            $list = pdo_fetchall("SELECT * FROM " . tablename($this->table_chess) . " WHERE {$condition} ORDER BY ". $orderStr." LIMIT " . ($pindex - 1) * $psize . ',' . $psize);
			echo json_encode($this->data2chesshtml($list));
	}
	
}


	
			
                        
       

?>

