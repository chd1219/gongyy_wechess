<?php
switch ($op) {
    case 'display':
    {

        $categoryid = $_GPC['categoryid'];
        $keywords = $_GPC['keywords'];
       

        //粉丝信息
        $fans = pdo_fetch("SELECT follow FROM " .tablename('mc_mapping_fans'). " WHERE uniacid='{$uniacid}' AND openid='{$openid}'");
        include $this->template('index');
    }
    break;
    case 'search':
        {
            
            // 只放第一页
            $pindex = max(1, intval($_GPC['page']));
            $psize = $listnum;
            $condition = " uniacid='{$uniacid}' ";
            $categoryid = $_GPC['categoryid'];
            $keywords = $_GPC['keywords'];
            // 只展示审核通过的
            $status = 1;
            
            // where 条件
            if ($categoryid != '') {
                $condition .= " AND categoryid = {$categoryid}";
            }
            
            if ($status != '') {
                $condition .= " AND status = {$status}";
            }
            
            if (! empty($keywords)) {
                // 用空格分开，默认或搜索
                $searchArr = explode(" ", $keywords);
                foreach ($searchArr as $k => $v) {
                    $condition .= " AND (title LIKE '%{$v}%'";
                    $condition .= " OR redname LIKE '%{$v}%'";
                    $condition .= " OR blackname LIKE '%{$v}%')";
                }
            }
            
            $list = pdo_fetchall("SELECT * FROM " . tablename($this->table_chess) . " WHERE {$condition} ORDER BY iszhiding DESC, addtime DESC LIMIT " . ($pindex - 1) * $psize . ',' . $psize);
             $setting = pdo_fetch("SELECT isfollow,qrcode FROM " . tablename($this->table_setting) . " WHERE uniacid =:uniacid LIMIT 1", array(':uniacid' => $uniacid));

            //粉丝信息
            $fans = pdo_fetch("SELECT follow FROM " .tablename('mc_mapping_fans'). " WHERE uniacid='{$uniacid}' AND openid='{$openid}'");
                include $this->template('index_search');
        }
        break;
    case 'ajax':
        {
            // 只放第一页
            $pindex = max(1, intval($_GPC['page']));
            $psize = $listnum;
            $condition = " uniacid='{$uniacid}' ";
            $categoryid = $_GPC['categoryid'];
            $keywords = $_GPC['keywords'];
            // 只展示审核通过的
            $status = 1;
            
            // where 条件
            if ($categoryid != '') {
                $condition .= " AND categoryid = {$categoryid}";
            }
            
            if ($status != '') {
                $condition .= " AND status = {$status}";
            }
            
            if (! empty($keywords)) {
                // 用空格分开，默认或搜索
                $searchArr = explode(" ", $keywords);
                foreach ($searchArr as $k => $v) {
                    $condition .= " AND (title LIKE '%{$v}%'";
                    $condition .= " OR redname LIKE '%{$v}%'";
                    $condition .= " OR blackname LIKE '%{$v}%')";
                }
            }
            
            $list = pdo_fetchall("SELECT * FROM " . tablename($this->table_chess) . " WHERE {$condition} ORDER BY iszhiding DESC, addtime DESC LIMIT " . ($pindex - 1) * $psize . ',' . $psize);
            echo json_encode($this->data2chesshtml($list));
        }
        break;
}




