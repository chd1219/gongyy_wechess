<?php

switch($op){
	case 'display':{
		$filename = $_GPC['file'];
		$file = $_GPC['file'];
		$title = '';
		$chessid = $_GPC['chessid'];
		$condition['uniacid'] = $_W['uniacid'];
		$condition['filename'] = $_GPC['file'];

		$chess = pdo_get($this->table_chess,$condition);
		if(empty($chess)){
			message("该棋谱不存在或者被删除！", $this->createMobileUrl('index'), "error");
		}
		$id = $chess['id'];
		$click=($chess['clicksum']+1);
		pdo_update($this->table_chess, array('clicksum' => $click), array('id' => $chess['id']));
		//var_dump($this->playertoImage($chess['blackname']));
		$chessdata = $chess['chessdata'];
		$comment = $chess['comment'];


		$memberid = mc_openid2uid($chess['openid']);
        $memberinfo = pdo_fetch("SELECT uid,credit1,credit2,nickname,avatar FROM " .tablename('mc_members'). " WHERE uniacid='{$uniacid}' AND uid='{$memberid}' LIMIT 1");
        $thumb = $this->getUserInfo($chess['openid'])['headimgurl'];

		
		if(!empty($filename)){
			$condition['uniacid'] = $_W['uniacid'];
			$condition['filename'] = $_GPC['file'];
			$chess = pdo_get($this->table_chess,$condition);
			$title = $chess['title'];
		}if(!empty($this->getUserInfo($chess['openid'])['headimgurl'])){
		    $chess['blackimg'] = $this->playertoImageFollow($chess['blackname'])['image']?$this->playertoImageFollow($chess['blackname'])['image']: $this->getUserInfo($chess['openid'])['headimgurl'];
		}else {
		    $chess['blackimg'] = tomedia($setting['logo']);//公众号头像
		}
		$chess['blackfollowsum'] = $this->playertoImageFollow($chess['blackname'])['followsum'];
		$chess['redfollowsum'] = $this->playertoImageFollow($chess['redname'])['followsum'];
		if(!empty($this->getUserInfo($chess['openid'])['headimgurl'])){
		    $chess['redimg'] = $this->playertoImageFollow($chess['redname'])['image']?$this->playertoImageFollow($chess['redname'])['image']: $this->getUserInfo($chess['openid'])['headimgurl'];
		}else {
		    $chess['redimg'] = tomedia($setting['logo']);//公众号头像
		}
		
		
		$sharechessurl = $_W['siteroot'] .'app/'. $this->createMobileUrl('chess', array('file'=>$file,'uid'=>$_W['openid'],'u'=>'click'));
		//var_dump($this->getUserInfo($chess['openid']));
        include $this->template('chess');
    }break;
	   
    case 'delete':{
       	$condition['uniacid'] = $_W['uniacid'];
		$condition['id'] = $_GPC['id'];
		$chess = pdo_get($this->table_chess, $condition);
		$redplayerid = $chess['redplayerid'];
		$blackplayerid = $chess['blackplayerid'];
		$result = pdo_delete($this->table_chess, $condition);
		$result1 = pdo_delete($this->table_collect, array('uniacid'=>$_W['uniacid'],'chessid'=>$_GPC['id']));
		if (!empty($result)&&!empty($result1)) {
			//删除成功
			if(!empty($redplayerid)){
				$this->edit_chess_sum($redplayerid,'minus');
			}
			if(!empty($blackplayerid)){
				$this->edit_chess_sum($blackplayerid,'minus');
			}
			
			echo '1';
		}else{
			echo '-1';
		}
    }break;
	case 'release':{
		$condition['uniacid'] = $_W['uniacid'];
		$condition['id'] = $_GPC['id'];
		$file = $_GPC['file'];
		$playercondition['uniacid'] = $_W['uniacid'];
		
		//前期自动审核成功
		$data['status'] = 1;
		$data['categoryid'] = $_GPC['categoryid'];
		$data['title'] = $_GPC['title'];
		$data['redname'] = $_GPC['redname'];
		$data['blackname'] = $_GPC['blackname'];
		$data['comment'] = $_GPC['comment'];
		
		$data['updatetime'] = time();
		
		if(!empty($data['redname'])){
			$playercondition['playername'] = $data['redname'];
			$red = pdo_get($this->table_player,$playercondition);
			if(!empty($red)){
				$data['redplayerid'] = $red['id'];
				$this->edit_chess_sum($red['id'],'add');
				$this->template_chess_addbyplayer($file,0,$red['id']);
			}
		};
		
		if(!empty($data['blackname'])){
			$playercondition['playername'] = $data['blackname'];
			$black = pdo_get($this->table_player,$playercondition);
			if(!empty($black)){
				$data['blackplayerid'] = $black['id'];
				$this->edit_chess_sum($black['id'],'add');
				$this->template_chess_addbyplayer($file,0,$black['id']);
			}
		};
		$handsel = array('module' => 'chess', 'sign' =>$file, 'action' => 'release', 'credit_value' => 10, 'credit_log' => '发布棋谱,赠送10积分');
		$chess_openid = $_W['openid'];
		load()->model('mc');
		$formuid = $touid = mc_openid2uid($_W['openid']);
		$status = $this->mc_handsel_rewrite($touid, $formuid, $handsel, $_W['uniacid']);
		if(is_error($status)) {
			message("请不要重复发布！", $this->createMobileUrl('index'), "error");
		} else {
			$message['value'] = '10';
			$message['reason'] = '发布棋谱获得积分';
			$message['url'] = $_W['siteroot'] . 'app/' . $this -> createMobileUrl('chess',array('file'=>$file));
			$this->template_chess_collect_player_follow($_W['openid'],$message,3);
			$this->template_chess_addbyplayer($file,1);//公众号新增棋谱通知
			pdo_update($this->table_chess, $data, $condition);
			message("发布棋谱成功,系统奖励积分：10", $this->createMobileUrl('chess',array('file'=>$file)), "success");
		}
	}break;
	case 'edit':{
		$condition['uniacid'] = $_W['uniacid'];
		$condition['id'] = $_GPC['id'];
		$file = $_GPC['file'];
		$playercondition['uniacid'] = $_W['uniacid'];
		
		
		$data['categoryid'] = $_GPC['categoryid'];
		$data['title'] = $_GPC['title'];
		$data['redname'] = $_GPC['redname'];
		$data['blackname'] = $_GPC['blackname'];
		$data['comment'] = $_GPC['comment'];
		$data['updatetime'] = time();
		
		if(!empty($data['redname'])){
			$playercondition['playername'] = $data['redname'];
			$red = pdo_get($this->table_player,$playercondition);
			if(!empty($red)){
				$data['redplayerid'] = $red['id'];
				
			}
		};
		
		if(!empty($data['blackname'])){
			$playercondition['playername'] = $data['blackname'];
			$black = pdo_get($this->table_player,$playercondition);
			if(!empty($black)){
				$data['blackplayerid'] = $black['id'];
				
			}
		};
		
		pdo_update($this->table_chess, $data, $condition);
		message("更新棋谱成功！", $this->createMobileUrl('chess',array('file'=>$file)), "success");
		
	}break;
    case 'edit_collect':{
		$ajaxreturn = array();
		$ctype = trim($_GPC['ctype']);
		$file = trim($_GPC['file']);
		$condition['uniacid'] = $_W['uniacid'];
		$condition['filename'] = $_GPC['file'];
		$chess = pdo_get($this->table_chess,$condition);
		$chessid = $chess['id'];
		load()->model('mc');
		$uid = mc_openid2uid($openid);
		$collect = pdo_get($this->table_collect, array('uniacid' => $uniacid,'openid'=>$openid,'filename'=>$file));
		
		if(empty($collect)){
			$insertdata = array(
				'uniacid' => $uniacid,
				'uid'	  => $uid,
				'openid'  => $openid,
				'chessid' => $chessid,
				'filename'   => $file,
				'addtime' => time(),
		);
		if(pdo_insert($this->table_collect, $insertdata)){
			$formuid = CLIENT_IP;
			$handsel = array('module' => 'collect', 'sign' =>$file, 'action' => 'share', 'credit_value' => 5, 'credit_log' => '棋谱被收藏奖励积分：5');
			$touid = mc_openid2uid($chess['openid']);
			if(!($chess['openid']==$_W['openid'])){
			$status = $this->mc_handsel_rewrite($touid, $formuid, $handsel, $_W['uniacid']);
			if(is_error($status)) {
			} else {
				$message['value'] = '5';
				$message['reason'] = '您的棋谱被收藏';
				$message['url'] = $_W['siteroot'] . 'app/' . $this -> createMobileUrl('chess',array('file'=>$file));
				$this->template_chess_collect_player_follow($chess['openid'],$message);
			}
			
		}
		 
			$ajaxreturn['result'] = '1';
		}
			}else{
				pdo_delete($this->table_collect, array('uniacid'=>$uniacid,'openid'=>$openid,'filename'=>$file));
				
				$ajaxreturn['result'] = '2';
			}
			
			echo json_encode($ajaxreturn);
	}break;
    case 'delete_collect':{
		//取消收藏
       	$condition['uniacid'] = $_W['uniacid'];
		$condition['chessid'] = $_GPC['chessid'];
		$condition['openid'] = $openid;
		$result = pdo_delete($this->table_collect, $condition);
		if (!empty($result)) {
			echo '1';
		}else{
			echo '-1';
		}
   
	}break;
	//分享成功奖励棋谱作者2个积分
	case 'share':{
		global $_W,$_GPC;
		$filename = $_GPC['filename'];
		$formuid = CLIENT_IP;
		$handsel_chessauthor = array('module' => 'chess', 'sign' =>$filename, 'action' => 'share', 'credit_value' => 2, 'credit_log' => '分享棋谱赠送棋谱作者积分');
		$handsel_openid = array('module' => 'chess', 'sign' =>$filename, 'action' => 'share', 'credit_value' => 1, 'credit_log' => '分享棋谱获得积分');
		$chess_openid = $_GPC['chess_openid'];
		$condition['uniacid'] = $_W['uniacid'];
		$condition['filename'] = $filename;
		$chess = pdo_get($this->table_chess,$condition);
		$sharesum = ++$chess['sharesum'];
		pdo_update($this->table_chess,array('sharesum'=>$sharesum),$condition);
		load()->model('mc');
		$touid_author = mc_openid2uid($_GPC['chess_openid']);
		$touid_openid = mc_openid2uid($_W['openid']);
		if($touid_author == $touid_openid){
			$handsel_openid['action'] = 'share_self';
		}
		$status_author = $this->mc_handsel_rewrite($touid_author, $formuid, $handsel_chessauthor, $_W['uniacid']);
		$status_openid = $this->mc_handsel_rewrite($touid_openid, $formuid, $handsel_openid, $_W['uniacid']);
		if(is_error($status_author)||is_error($status_openid)) {
			exit(json_encode($status_openid));
		} else {
			$message1['value'] = '2';
			$message1['reason'] = '您的棋谱被分享';
			$message1['url'] = $_W['siteroot'] . 'app/' . $this -> createMobileUrl('chess',array('file'=>$filename));
			$this->template_chess_collect_player_follow($chess_openid,$message1,1);
			$message2['value'] = '1';
			$message2['reason'] = '分享棋谱获得积分';
			$message2['url'] = $_W['siteroot'] . 'app/' . $this -> createMobileUrl('self');
			$this->template_chess_collect_player_follow($_W['openid'],$message2,2);

		}

		
	}
		break;


	case 'prize':{
		$chessid = $_GPC['chessid'];
		$type = intval($_GPC['type']);
		$data = array(
			'uniacid' => $_W['uniacid'],
			'chessid' => $chessid,
			'avatar' => $_W['fans']['avatar'],
			'prizedate' => time(),
			'level' => 0,
			'type' =>$type,
			'name' =>$_W['fans']['nickname'],
			'openid' =>$_W['openid']
			);
		$results=array();
		$results['type'] = $type;
		if($type ===0){
			if($this->isprized($openid,$chessid,0)==1){
       		$results['ptype']=1;//减赞
       		$prize = pdo_get($this->table_chess,array('uniacid'=>$uniacid,'id'=>$chessid));
       		$prizesum = $prize['prizesum'];
       		pdo_delete($this->table_prize, array('uniacid'=>$uniacid,'openid'=>$openid,'chessid'=>$chessid,'type'=>$type));
       		$results['prizesum']=--$prizesum;
       		pdo_update($this->table_chess,array('prizesum'=>$prizesum),array('uniacid'=>$uniacid,'id'=>$chessid));
       	}else{
	        $results['ptype']=0;//加赞
	        $prize = pdo_get($this->table_chess,array('uniacid'=>$uniacid,'id'=>$chessid));
	        $prizesum = $prize['prizesum'];
	        pdo_insert($this->table_prize, $data);
	        $results['prizesum']=++$prizesum;
	        pdo_update($this->table_chess,array('prizesum'=>$prizesum),array('uniacid'=>$uniacid,'id'=>$chessid));
	    	}
	    }
	    else{
	    	if($this->istread($openid,$chessid)==1){
	       		$results['ttype']=1;//减踩
	       		$prize = pdo_get($this->table_chess,array('uniacid'=>$uniacid,'id'=>$chessid));
	       		$treadsum = $prize['treadsum'];
	       		pdo_delete($this->table_prize, array('uniacid'=>$uniacid,'openid'=>$openid,'chessid'=>$chessid,'type'=>$type));
	       		$results['treadsum']=--$treadsum;
	       		pdo_update($this->table_chess,array('treadsum'=>$treadsum),array('uniacid'=>$uniacid,'id'=>$chessid));
	       	}else{
		      $results['ttype']=0;//加踩
		        $prize = pdo_get($this->table_chess,array('uniacid'=>$uniacid,'id'=>$chessid));
		        $treadsum = $prize['treadsum'];
		        pdo_insert($this->table_prize, $data);
		        $results['treadsum']=++$treadsum;
		        pdo_update($this->table_chess,array('treadsum'=>$treadsum),array('uniacid'=>$uniacid,'id'=>$chessid));
		    }
	    }
	

	echo json_encode($results);
}
break;
	//分享成功被打开后奖励棋谱分享者2个积分
/*	case 'click':{
		global $_W;
		global $_GPC;
		$filename = $_GPC['filename'];
		$formuid = CLIENT_IP;
		$handsel = array('module' => 'chess', 'sign' =>$filename, 'action' => 'click', 'credit_value' => 2, 'credit_log' => '分享的棋谱在朋友圈被阅读,赠送积分');
		$chess_openid = $_GPC['chess_openid'];
		load()->model('mc');
		if(!($chess_openid==$_W['openid'])){
			$touid = mc_openid2uid($chess_openid);
			$status = $this->mc_handsel_rewrite($touid, $formuid, $handsel, $_W['uniacid']);
			if(is_error($status)) {
				exit(json_encode($status));
			} else {
				$this->template_chess_collect_player_follow($chess_openid,2);
			}
		}
	}
		break;*/
	case 'manage':{
		// 前台管理设置是否置顶，精华，热门
		global $_W,$_GPC;
		$chessid = $_GPC['chessid'];
		$type = $_GPC['type'];
		$condition['uniacid'] = $_W['uniacid'];
		$condition['id'] = $chessid;
		$chess = pdo_get($this->table_chess,$condition);
		$formuid = mc_openid2uid($_W['openid']);
		$touid = mc_openid2uid($chess['openid']);
		$handsel_chessauthor = array('module' => 'chess', 'sign' =>$chess['filename'], 'action' => 'manage', 'credit_value' => 2, 'credit_log' => '分享棋谱赠送棋谱作者积分');
		switch ($type) {
			case 'ding':
				pdo_update($this->table_chess,array('iszhiding' => $_GPC['ding']),array('uniacid'=>$uniacid,'id'=>$chessid));
				if($_GPC['ding']==1){
					$handsel_chessauthor['action'] = 'ding';
					$handsel_chessauthor['credit_value'] = 100;
					$handsel_chessauthor['credit_log'] = '棋谱被置顶送棋谱作者积分';
					$status = $this->mc_handsel_rewrite($touid, $formuid, $handsel_chessauthor, $_W['uniacid']);
					if(!is_error($status)) {
						$message['value'] = '100';
						$message['reason'] = '您的棋谱被置顶';
						$message['url'] = $_W['siteroot'] . 'app/' . $this -> createMobileUrl('chess',array('file'=>$chess['filename']));
						$this->template_chess_collect_player_follow($_W['openid'],$message,3);
						//公众号新增棋谱通知
					}
				}
				 
				echo json_encode('ding');
				break;
			case 'jing':
				pdo_update($this->table_chess,array('isjinghua' => $_GPC['jing']),array('uniacid'=>$uniacid,'id'=>$chessid));
				if($_GPC['jing']==1){
					$handsel_chessauthor['action'] = 'jing';
					$handsel_chessauthor['credit_value'] = 50;
					$handsel_chessauthor['credit_log'] = '棋谱被设置精华送棋谱作者积分';
					$status = $this->mc_handsel_rewrite($touid, $formuid, $handsel_chessauthor, $_W['uniacid']);
					if(!is_error($status)) {
						$message['value'] = '50';
						$message['reason'] = '您的棋谱被设为精华棋谱';
						$message['url'] = $_W['siteroot'] . 'app/' . $this -> createMobileUrl('chess',array('file'=>$chess['filename']));
						$this->template_chess_collect_player_follow($_W['openid'],$message,3);
						//公众号新增棋谱通知
					}
				}
				echo json_encode('jing');
				break;
			case 'huo':
				pdo_update($this->table_chess,array('ishot' => $_GPC['huo']),array('uniacid'=>$uniacid,'id'=>$chessid));
				if($_GPC['ding']==1){
					$handsel_chessauthor['action'] = 'huo';
					$handsel_chessauthor['credit_value'] = 50;
					$handsel_chessauthor['credit_log'] = '棋谱被设为热门送棋谱作者积分';
					$status = $this->mc_handsel_rewrite($touid, $formuid, $handsel_chessauthor, $_W['uniacid']);
					if(!is_error($status)) {
						$message['value'] = '50';
						$message['reason'] = '您的棋谱被设为热门棋谱';
						$message['url'] = $_W['siteroot'] . 'app/' . $this -> createMobileUrl('chess',array('file'=>$chess['filename']));
						$this->template_chess_collect_player_follow($_W['openid'],$message,3);
						//公众号新增棋谱通知
					}
				}
				echo json_encode('huo');
			break;
			default:
				# code...
				break;
		}
		//echo json_encode($results);
	}break;
	case 'blacklist':{
		// 前台管理设置是否置顶，精华，热门
		global $_W,$_GPC;
		if(isset($_GPC['chessid'])){
			$map['id'] = $_GPC['chessid'];
			$chess = pdo_get($this->table_chess,$map);
			$member = pdo_get($this->table_user,array('openid'=>$chess['openid']));
			if(isset($member['status']) && $member['status']==0){
				echo json_encode('failed');
			}else{
				$result =pdo_update($this->table_user,array('status'=>0),array('openid'=>$chess['openid'])); 
				if($result){
					echo json_encode('success');
				}else{
					echo json_encode('fail');
				}
			}
		}else{
			echo json_encode('fail');
		}
		
		
			
	}break;
	case 'fix':{
		// 修复棋谱库
		$list  = pdo_getall($this->table_chess);
		echo 1;
		foreach($list as $k=>$v){
			$condition['id'] = $v['id'];
			$data['filename'] =  md5($v['addtime']);
			pdo_update($this->table_chess,$data,$condition);
			echo "成功！";
		}
	}
}


