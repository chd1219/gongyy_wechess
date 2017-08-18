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

// 根据不同的操作展示不同的界面
switch ($operation) {
    case 'display':
        {
            $condition = " uniacid='{$uniacid}' ";
            //$isplayer = ($_GPC['isplayer']);
            $addtime = intval($_GPC['addtime']);
            $nickname = trim($_GPC['nickname']);
			$isblack = trim($_GPC['isblack']);
            $params = array();
            if ($addtime > 0) {
                $condition .= ' AND addtime >= :addtime';
                $params[':addtime'] = strtotime("-{$addtime} days");
            }
            if (! empty($nickname)) {
                $condition .= " AND nickname LIKE :nickname";
                $params[':nickname'] = "%{$nickname}%";
            }
			
            $condition .= " AND status = :isblack";
            $params[':isblack'] = intval($isblack);
           
            $sql = "SELECT * FROM " . tablename($this->table_user) . " WHERE {$condition} ORDER BY flowsum DESC LIMIT " . ($pindex - 1) * $psize . ',' . $psize;
            $list = pdo_fetchall($sql, $params);
            $i=0;
            foreach ($list as $key=>$player){
                $list[$key]['isplayer'] = $this->isplayer($player['openid']);   
            }
            //var_dump(tomedia($photos[0][0]));
             $total = pdo_fetchcolumn("SELECT COUNT(*) FROM " . tablename($this->table_user) . " WHERE {$condition} ",$params);
             $pager = pagination($total, $pindex, $psize);    
        }
        break;
    case 'delete':
        {
            $id = intval($_GPC['id']);
            pdo_delete($this->table_user, array(
                'id' => $id
            ));
            message('删除用户成功',  $this->createWebUrl('user', array(
                    'op' => 'display'
                )), 'success');
        }
}
include $this->template('user');