<?php
//棋手个人中心
switch($op){
    case 'display':{
        $playerid = $_GPC['playerid'];
        $keywords = $_GPC['keywords'];
        //分享信息
        $player = $this->playerid2info($playerid);
        $title = $player['playername'];
        $sharelogo = $_W['attachurl'].$player['photo'];
        $sharecenterurl = $_W['siteroot'] .'app/'. $this->createMobileUrl('center', array('playerid'=>$playerid,'uid'=>$shareuid));
        
        include $this->template('center');
    }break;
    
   
    case 'search':{
        
        $playercondition = " uniacid='{$uniacid}' ";
        $playerid = $_GPC['playerid'];
       
        if(!empty($playerid)){
            $playercondition .= " AND id = {$playerid}";
        }
        $player = pdo_get($this->table_player,$playercondition);
        
        //只放第一页
        $pindex = max(1, intval($_GPC['page']));
        $psize = $listnum;
        $condition = " uniacid='{$uniacid}' ";
        $categoryid = $_GPC['categoryid'];
        $keywords = $_GPC['keywords'];
        //只展示审核通过的
        $status  = 1;
        
        // where 条件
        if($categoryid!=''){
            $condition .= " AND categoryid = {$categoryid}";
        }
        
        if($status!=''){
            $condition .= " AND status = {$status}";
        }
        
       
        
        if(!empty($keywords)){
            //用空格分开，默认或搜索
            $searchArr =explode(" ",$keywords);
            foreach($searchArr as $k=>$v){
                $condition .= " AND title LIKE '%{$v}%'";
            }
        }
        
        if(!empty($playerid)){
            $condition .= " AND redplayerid = {$playerid}";
            $condition .= " OR blackplayerid = {$playerid}";
        }
        
        
        
        
        
        $list = pdo_fetchall("SELECT * FROM " . tablename($this->table_chess) . " WHERE {$condition} ORDER BY addtime DESC, iszhiding DESC LIMIT " . ($pindex - 1) * $psize . ',' . $psize);
        
        include $this->template('center_search');
    }break;
    case 'ajax':{
        $playercondition = " uniacid='{$uniacid}' ";
        $playerid = $_GPC['playerid'];
         
        if(!empty($playerid)){
            $playercondition .= " AND id = {$playerid}";
        }
        $player = pdo_get($this->table_player,$playercondition);
        
        //只放第一页
        $pindex = max(1, intval($_GPC['page']));
        $psize = $listnum;
        $condition = " uniacid='{$uniacid}' ";
        $categoryid = $_GPC['categoryid'];
        $keywords = $_GPC['keywords'];
        //只展示审核通过的
        $status  = 1;
        
        // where 条件
        if($categoryid!=''){
            $condition .= " AND categoryid = {$categoryid}";
        }
        
        if($status!=''){
            $condition .= " AND status = {$status}";
        }
        
         
        
        if(!empty($keywords)){
            //用空格分开，默认或搜索
            $searchArr =explode(" ",$keywords);
            foreach($searchArr as $k=>$v){
                $condition .= " AND title LIKE '%{$v}%'";
            }
        }
        
        if(!empty($playerid)){
            $condition .= " AND redplayerid = {$playerid}";
            $condition .= " OR blackplayerid = {$playerid}";
        }
        $list = pdo_fetchall("SELECT * FROM " . tablename($this->table_chess) . " WHERE {$condition} ORDER BY addtime DESC, iszhiding DESC LIMIT " . ($pindex - 1) * $psize . ',' . $psize);
        echo json_encode($this->data2chesshtml($list));
    }
}


