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
$psize = 4;

// 根据不同的操作展示不同的界面
switch ($operation) {
    case 'display':
        {
            $condition = " uniacid='{$uniacid}' ";
            $issolved = ($_GPC['issolved']);
            $createtime = intval($_GPC['createtime']);
            $title = trim($_GPC['title']);
            $params = array();
            if (""!==$issolved) {
                //$issolved = intval($issolved);
                $condition .= " AND issolved = :issolved";
                $params[':issolved'] = "{$issolved}";
            }
            if ($createtime > 0) {
                $condition .= ' AND createtime >= :createtime';
                $params[':createtime'] = strtotime("-{$createtime} days");
            }
            if (! empty($title)) {
                $condition .= " AND title LIKE :title";
                $params[':title'] = "%{$title}%";
            }
            $sql = "SELECT * FROM " . tablename($this->table_feedback) . " WHERE {$condition} ORDER BY id DESC LIMIT " . ($pindex - 1) * $psize . ',' . $psize;
            $list = pdo_fetchall($sql, $params);
            $i=0;
            foreach ($list as $key=>$photo){
                $photos[$key] = $list[$key]['photo'] = json_decode($list[$key]['photo']);
                
            }
            //var_dump(tomedia($photos[0][0]));
             $total = pdo_fetchcolumn("SELECT COUNT(*) FROM " . tablename($this->table_feedback) . " WHERE {$condition} ",$params);
           var_dump($total);
           var_dump($issolved);
             $pager = pagination($total, $pindex, $psize);
            
        }
        break;
    case 'post':
        {
            $id = intval($_GPC['id']); /* 当前棋手id */
            $chess['chesstime'] = time();
            
            if (! empty($id)) {
                $chess = pdo_fetch("SELECT * FROM " . tablename($this->table_feedback) . " WHERE uniacid = '$uniacid' AND id = '$id'");
                if (empty($chess)) {
                    message("该反馈信息不存在或已被删除！", "", "error");
                }
           
           $chess['photo'] = json_decode( $chess['photo']);
                
                
            }
            if (checksubmit('submit')) {
                if (! empty($id)) {
                    
                    $updatedata = array(
                        'uniacid' => $_W['uniacid'],
                        'issolved' => trim($_GPC['issolved']),
                        'solvedname' => trim($_GPC['solvedname']),
                        'solvedtime' => time(),
                        'record' => trim($_GPC['record'])
                    );
                    pdo_update($this->table_feedback, $updatedata, array(
                        'id' => $id
                    ));
                }
                message("更新反馈信息成功！", $this->createWebUrl('feedback', array(
                    'op' => 'display'
                )), "success");
            }
        }
        break;
    
    case 'delete':
        {
            $id = intval($_GPC['id']);
            pdo_delete($this->table_feedback, array(
                'id' => $id
            ));
            message('删除反馈信息成功',  $this->createWebUrl('feedback', array(
                    'op' => 'display'
                )), 'success');
        }
}
include $this->template('feedback');