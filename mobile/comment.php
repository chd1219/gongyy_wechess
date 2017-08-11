<?php
$chessid = intval($_GPC['chessid']);
//var_dump($chessid);
$title = '评论列表';
$openid = $_W['openid'];
$uniacid =$_W['uniacid'];

switch ($op) {
    case 'display':
    {   
        $pindex = max(1, intval($_GPC['page']));
        $psize = 5;
        $condition = " uniacid=:uniacid AND chessid=:chessid ";
        $param[':uniacid'] = $_W['uniacid'];
        $param[':chessid'] = $chessid;
        $list = pdo_fetchall("SELECT * FROM " . tablename($this->table_comments) . " WHERE {$condition} ORDER BY prizesum DESC, commentdate DESC LIMIT " . ($pindex - 1) * $psize . ',' . $psize,$param);
        $chess1 = pdo_get($this->table_chess,array('uniacid'=>$uniacid,'id'=>$chessid));
        $prizesum = $chess1['prizesum'];
        $commentsum = $chess1['comment'];
        $memberid = mc_openid2uid($chess1['openid']);
        $memberinfo = pdo_fetch("SELECT uid,credit1,credit2,nickname,avatar FROM " .tablename('mc_members'). " WHERE uniacid='{$_W['uniacid']}' AND uid='{$memberid}' LIMIT 1");
        $thumb = $this->getUserInfo($chess1['openid'])['headimgurl'];
        include $this->template('comment');
    }

    break;

    case 'bac':{
        include $this->template('comment-bac');

    }
    break;

    case 'ajax':
    {
        $pindex = max(1, intval($_GPC['page']));
        $psize = 5;
        $condition = " uniacid=:uniacid AND chessid=:chessid ";
        $param[':uniacid'] = $_W['uniacid'];
        $param[':chessid'] = $chessid;
        $list = pdo_fetchall("SELECT * FROM " . tablename($this->table_comments) . " WHERE {$condition} ORDER BY prizesum DESC , commentdate DESC LIMIT " . ($pindex - 1) * $psize . ',' . $psize,$param);

        echo json_encode($this->data2commentshtml($list));
    }
    break;
    case 'ajax_user':
    {
            // 只放第一页
        $pindex = max(1, intval($_GPC['page']));
        $psize = 5;
        $condition = " uniacid=:uniacid ";

        $param[':uniacid'] = $_W['uniacid'];
        //$param[':level'] = 1;
        $parentid = intval($_GPC['parentid']);
        //$param[':parentid'] = $_GPC['parentid'];
        $list_hot = pdo_fetchall("SELECT * FROM " . tablename($this->table_comments_user) . " WHERE {$condition} AND  pcid={$_GPC['parentid']} AND prizesum>4 ORDER BY prizesum DESC, commentdate DESC LIMIT " . ($pindex - 1) * $psize . ',' . $psize,$param);
        $list_all = pdo_fetchall("SELECT * FROM " . tablename($this->table_comments_user) . " WHERE {$condition} AND pcid={$parentid} ORDER BY prizesum DESC ",$param);
        /*foreach ($list_all as $key => $value) {
            $list_all = array_merge($list_all ,pdo_fetchall("SELECT * FROM " . tablename($this->table_comments_user) . " WHERE uniacid={$_W['uniacid']} AND level=2 AND parentid={$value['id']}  ORDER BY prizesum DESC")) ;
        }*///这是一个数组相加的方法
        //var_dump($list_all);
        $list['hot'] = $this->data2commentshtml($list_hot);
        $list['all'] = $this->data2commentshtml($list_all);
    //echo json_encode($list_hot);
        echo json_encode($list);
    }
    break;
//添加评论
    case 'add':
    {
       $level = intval($_GPC['level']);
       $commentid = intval($_GPC['commentid']);
       if(trim($_GPC['commenttext'])==''){
        echo "";
        exit();
    }
    $data = array(
        'uniacid' => $_W['uniacid'],
        'commenttext' => trim($_GPC['commenttext']),
        'chessid' => $chessid,
        'comment' => 0,
        'avatar' => $_W['fans']['avatar'],
        'commentdate' => time(),
        'level' => $level,
        'name' =>$_W['fans']['nickname'],
        'openid' =>$_W['openid'],
        'prizesum' =>0
        );
        //判断是否棋手，如果是，则输出棋手姓名，如果不是，则输出昵称
    if($level ==0){
        $pcomment = pdo_get($this->table_chess,array('uniacid'=>$uniacid,'id'=>$chessid));
        $pcommentsum = $pcomment['comment'];
        $results['commentsum']=++$pcommentsum;
        pdo_update($this->table_chess,array('comment'=>$pcommentsum),array('uniacid'=>$uniacid,'id'=>$chessid));
        $result = pdo_insert($this->table_comments, $data) ;
        if (!empty($result)) {
            $data['id'] = pdo_insertid();
            $results['html'] = $this->data2commentshtml(array($data));
            $results['level'] = $level;
            echo json_encode($results);
        } 
    }
    elseif($level == 1){
        $data['parentid'] = $commentid;
        $data['level'] = $level;
        $data['pcid'] = $_GPC['pcid'];
        $pcomment = pdo_get($this->table_comments,array('uniacid'=>$uniacid,'id'=>$commentid));
        $pcommentsum = $pcomment['comment'];
        $results['commentsum']=++$pcommentsum;
        pdo_update($this->table_comments,array('comment'=>$pcommentsum),array('uniacid'=>$uniacid,'id'=>$commentid));
        $result = pdo_insert($this->table_comments_user, $data) ;
        if (!empty($result)) {
            $data['id'] = pdo_insertid();
            $results['html'] = $this->data2commentshtml(array($data));
            $results['level'] = $level;
            echo json_encode($results);
        } 
    }
    elseif($level == 2){
        $data['parentid'] = $commentid;
        $data['level'] = $level;
        $data['pcid'] = $_GPC['pcid'];
        $pcomment = pdo_get($this->table_comments_user,array('uniacid'=>$uniacid,'id'=>$commentid));
        if($pcomment['level']==1){
             $data['pcrid'] = $commentid;
         }else{
            $data['pcrid'] = $pcomment['pcrid'];
         }
        $pcommentsum = $pcomment['comment'];
        $data['commenttext'] = $_GPC['commenttext'].'//@'.$pcomment['name'].':'.$pcomment['commenttext'];
        $results['commentsum']=++$pcommentsum;
        pdo_update($this->table_comments_user,array('comment'=>$pcommentsum),array('uniacid'=>$uniacid,'id'=>$commentid));
        $result = pdo_insert($this->table_comments_user, $data) ;
        if (!empty($result)) {
            $data['id'] = pdo_insertid();
            $results['html'] = $this->data2commentshtml(array($data));
            $results['level'] = $level;
            echo json_encode($results);
        } 
    }
}
    break;
    case 'prize':{
       
   $id = $_GPC['id'];
    $level = intval($_GPC['level']);
    $data = array(
        'uniacid' => $_W['uniacid'],
        'chessid' => $chessid,
        'avatar' => $_W['fans']['avatar'],
        'prizedate' => time(),
        'name' =>$_W['fans']['nickname'],
        'openid' =>$_W['openid']
        );
    $results=array();
    $results['level'] = $level;
    if($this->isprized($openid,$id,$level)==1){

        $results['type']=1;//减赞
        if($level==0){
            $prize = pdo_get($this->table_chess,array('uniacid'=>$uniacid,'id'=>$chessid));
            $prizesum = $prize['prizesum'];
            pdo_delete($this->table_prize, array('uniacid'=>$uniacid,'openid'=>$openid,'chessid'=>$id));
            $results['prizesum']=--$prizesum;
            pdo_update($this->table_chess,array('prizesum'=>$prizesum),array('uniacid'=>$uniacid,'id'=>$chessid));
        }
        else if($level==1){
            $prize = pdo_get($this->table_comments,array('uniacid'=>$uniacid,'id'=>$id));
            $prizesum = $prize['prizesum'];
            pdo_delete($this->table_prize_user, array('uniacid'=>$uniacid,'openid'=>$openid,'commentid'=>$id,'level'=>1));
            $results['prizesum']=--$prizesum;
            pdo_update($this->table_comments,array('prizesum'=>$prizesum),array('uniacid'=>$uniacid,'id'=>$id));
        }
        else if($level==2){
            $prize = pdo_get($this->table_comments_user,array('uniacid'=>$uniacid,'id'=>$id,'level'=>1));
            $prizesum = $prize['prizesum'];
            pdo_delete($this->table_prize_user, array('uniacid'=>$uniacid,'commentid'=>$id,'level'=>2));
            $results['prizesum']=--$prizesum;
            pdo_update($this->table_comments_user,array('prizesum'=>$prizesum),array('uniacid'=>$uniacid,'id'=>$id,'level'=>1));
        }
        else if($level==3){
            $prize = pdo_get($this->table_comments_user,array('uniacid'=>$uniacid,'id'=>$id,'level'=>2));
            $prizesum = $prize['prizesum'];
            pdo_delete($this->table_prize_user, array('uniacid'=>$uniacid,'commentid'=>$id,'level'=>3));
            $results['prizesum']=--$prizesum;
            pdo_update($this->table_comments_user,array('prizesum'=>$prizesum),array('uniacid'=>$uniacid,'id'=>$id,'level'=>2));
        }
    }else{
        $results['type']=0;//加赞
        if($level==0){
         $prize = pdo_get($this->table_chess,array('uniacid'=>$uniacid,'id'=>$chessid));
         $prizesum = $prize['prizesum'];
         pdo_insert($this->table_prize, $data);
         $results['prizesum']=++$prizesum;
         pdo_update($this->table_chess,array('prizesum'=>$prizesum),array('uniacid'=>$uniacid,'id'=>$chessid));
     }
     else if($level==1){
        $prize = pdo_get($this->table_comments,array('uniacid'=>$uniacid,'id'=>$id));
        $prizesum = $prize['prizesum'];
        $data['commentid'] = $id;
        $data['level'] = $level;
        pdo_insert($this->table_prize_user,$data);
        $results['prizesum']=++$prizesum;
        pdo_update($this->table_comments,array('prizesum'=>$prizesum),array('uniacid'=>$uniacid,'id'=>$id,'level'=>0));
    }
    else if($level==2){
        $prize = pdo_get($this->table_comments_user,array('uniacid'=>$uniacid,'id'=>$id,'level'=>1));
        $prizesum = $prize['prizesum'];
        $data['commentid'] = $id;
        $data['level'] = $level;
        $data['pcid'] = $prize['pcid'];
        pdo_insert($this->table_prize_user,$data);
        $results['prizesum']=++$prizesum;
        pdo_update($this->table_comments_user,array('prizesum'=>$prizesum),array('uniacid'=>$uniacid,'id'=>$id,'level'=>1));
    }
    else if($level==3){
        $prize = pdo_get($this->table_comments_user,array('uniacid'=>$uniacid,'id'=>$id,'level'=>2));
        $prizesum = $prize['prizesum'];
        $data['commentid'] = $id;
        $data['level'] = $level;
         $data['pcid'] = $prize['pcid'];
          $data['pcrid'] = $prize['pcrid'];
        pdo_insert($this->table_prize_user,$data);
        $results['prizesum']=++$prizesum;
        pdo_update($this->table_comments_user,array('prizesum'=>$prizesum),array('uniacid'=>$uniacid,'id'=>$id,'level'=>2));
    }
}
echo json_encode($results);
}break;

case 'delete':{
 $id =$_GPC['deleteid'] ;
 $level = intval($_GPC['level']);
$results['level'] = $level;
 if($level==0){
    $pcomment = pdo_get($this->table_chess,array('uniacid'=>$uniacid,'id'=>$chessid));
    $pcommentsum = $pcomment['comment'];
   
    /*$level1ids = pdo_fetchall("SELECT id FROM ". tablename($this->table_comments_user)." WHERE uniacid={$uniacid} AND parentid={$id} AND level=1");
    
   foreach ($level1ids as $key => $value) {
        pdo_delete($this->table_comments_user, array('uniacid'=>$uniacid,'pcid'=>$value['id'],'level'=>2));
    }*/
     pdo_delete($this->table_comments, array('uniacid'=>$uniacid,'openid'=>$openid,'id'=>$id));
    pdo_delete($this->table_comments_user, array('uniacid'=>$uniacid,'pcid'=>$id));
     pdo_delete($this->table_prize_user, array('uniacid'=>$uniacid,'commentid'=>$id,'level'=>1));
    pdo_delete($this->table_prize_user, array('uniacid'=>$uniacid,'pcid'=>$id));
    $results['pcommentsum']=--$pcommentsum;
    pdo_update($this->table_chess,array('comment'=>$pcommentsum),array('uniacid'=>$uniacid,'id'=>$chessid));
}
else if($level==1){
    $pid = pdo_get($this->table_comments_user, array('uniacid'=>$uniacid,'openid'=>$openid,'id'=>$id,'level'=>1));
    $pcomment = pdo_get($this->table_comments,array('uniacid'=>$uniacid,'id'=>$pid['parentid']));
    $pcommentsum = $pcomment['comment'];
    pdo_delete($this->table_comments_user, array('uniacid'=>$uniacid,'openid'=>$openid,'id'=>$id,'level'=>1));

    pdo_delete($this->table_comments_user, array('uniacid'=>$uniacid,'pcrid'=>$id,'level'=>2));
    pdo_delete($this->table_prize_user, array('uniacid'=>$uniacid,'commentid'=>$id,'level'=>2));
    pdo_delete($this->table_prize_user, array('uniacid'=>$uniacid,'pcrid'=>$id,'level'=>3));
    $results['pcommentsum']=--$pcommentsum;
    pdo_update($this->table_comments,array('comment'=>$pcommentsum),array('uniacid'=>$uniacid,'id'=>$pid['parentid']));
}
else if($level==2){
 $pid = pdo_get($this->table_comments_user, array('uniacid'=>$uniacid,'openid'=>$openid,'id'=>$id,'level'=>2));
 $pcomment = pdo_get($this->table_comments_user,array('uniacid'=>$uniacid,'id'=>$pid['parentid'],'level'=>1));
 $pcommentsum = $pcomment['comment'];
 pdo_delete($this->table_comments_user, array('uniacid'=>$uniacid,'openid'=>$openid,'id'=>$id,'level'=>2));
 pdo_delete($this->table_prize_user, array('uniacid'=>$uniacid,'commentid'=>$id,'level'=>3));
 $results['pcommentsum']=--$pcommentsum;
 pdo_update($this->table_comments_user,array('comment'=>$pcommentsum),array('uniacid'=>$uniacid,'id'=>$pid['parentid'],'level'=>1));
}


//echo json_encode($results);
}

break;
}

