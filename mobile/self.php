<?php


switch($op){
	case 'display':{
	    $memberid = mc_openid2uid($openid);
	    $mc_memberurl = $_W['siteroot'] .'app/'."index.php?i={$uniacid}&c=mc";
	    $memberinfo = pdo_fetch("SELECT uid,credit1,credit2,nickname,avatar FROM " .tablename('mc_members'). " WHERE uniacid='{$uniacid}' AND uid='{$memberid}' LIMIT 1");
		//我发布的棋谱数量
		$mypublishsum = pdo_fetchcolumn("SELECT COUNT(*) FROM " . tablename($this->table_chess) . " WHERE uniacid='{$uniacid}' AND openid='{$openid}'");
		$mycollectsum = pdo_fetchcolumn("SELECT COUNT(*) FROM " . tablename($this->table_collect) . " WHERE uniacid='{$uniacid}' AND openid='{$openid}'");
		$myfollowsum = pdo_fetchcolumn("SELECT COUNT(*) FROM " . tablename($this->table_follow) . " WHERE uniacid='{$uniacid}' AND openid='{$openid}'");
		include $this->template('self');
	}break;
	case 'main':{
		//模块用户信息
		$memberid = mc_openid2uid($openid);
		$userinfo = pdo_fetch("SELECT vip,vip_validity FROM " .tablename($this->table_user). " WHERE uniacid=:uniacid AND uid=:uid LIMIT 1", array(':uniacid'=>$uniacid,':uid'=>$memberid));
		include $this->template('self_main');
	}break;
	
	case 'my':{
	    $playerid = $_GPC['playerid'];
		$chessid = $_GPC['chessid'];
	    $displaytype = $_GPC['displaytype'];
	    $title = '';
	    switch($displaytype){
	        case 'publish':{
	            $title = '我的棋谱';
	        }break;
	        case 'collect':{
	            $title = '我的收藏';
	        }break;
	        case 'follow':{
	            $title = '我的关注';
	        }break;
	        case 'test':{
	            $title = '我的练习棋谱';
	        }break;
	        case 'blacklist':{
	            $title = '黑名单管理';
	        }break;
	        
	    }
	    include $this->template('my');
	}break;
	case 'send' :{
	    $playerid = $_GPC['playerid'];
	    $displaytype = $_GPC['displaytype'];
	    $title = '';
	    switch($displaytype){
	        case 'feedback':{
	            $title = '我的反馈';
	        }break;
	        case 'setting':{
	            $title = '系统设置';
	        }break;
	        case 'myself':{
	            $title = '申请棋手';
	        }break;
	        case 'notplayer':{
	            $title = '申请棋手';
	        }break;
	        
	    }
	    include $this->template('send');
	}break;
	case 'publish':{
		//我发布的
			//只放第一页
			$pindex = max(1, intval($_GPC['page']));
			$psize = $listnum;
			$condition = " uniacid='{$uniacid}' ";
			$keywords = $_GPC['keywords'];
			// where 条件
			
            if(!empty($openid)){
                $condition .= " AND openid ='{$openid}'";
            }
            if(!empty($keywords)){
                //用空格分开，默认或搜索
                $searchArr =explode(" ",$keywords);
                foreach($searchArr as $k=>$v){
                    $condition .= " AND (title LIKE '%{$v}%'";
                    $condition .= " OR redname LIKE '%{$v}%'";
                    $condition .= " OR blackname LIKE '%{$v}%')";
                }
            
            
            
            }
            $list = pdo_fetchall("SELECT * FROM " . tablename($this->table_chess) . " WHERE {$condition} ORDER BY addtime DESC,status");
			
		
			include $this->template('self_publish');
	}break;
	case 'publish_ajax':{
		//只放第一页
			$pindex = max(1, intval($_GPC['page']));
			$psize = $listnum;
			$condition = " uniacid='{$uniacid}' ";
			$keywords = $_GPC['keywords'];
			// where 条件
			
            if(!empty($openid)){
                $condition .= " AND openid ='{$openid}'";
            }
            if(!empty($keywords)){
                //用空格分开，默认或搜索
                $searchArr =explode(" ",$keywords);
                foreach($searchArr as $k=>$v){
                    $condition .= " AND (title LIKE '%{$v}%'";
                    $condition .= " OR redname LIKE '%{$v}%'";
                    $condition .= " OR blackname LIKE '%{$v}%')";
                }
            
            
            
            }
            $list = pdo_fetchall("SELECT * FROM " . tablename($this->table_chess) . " WHERE {$condition} ORDER BY addtime DESC LIMIT " . ($pindex - 1) * $psize . ',' . $psize);
			
			echo json_encode($this->data2publishchesshtml($list));
	}break;
	case 'test':{
		//我发布的
			//只放第一页
			$pindex = max(1, intval($_GPC['page']));
			$psize = $listnum;
			$condition = " uniacid='{$uniacid}' ";
			$keywords = $_GPC['keywords'];
			// where 条件
			
            /*if(!empty($openid)){
                $condition .= " AND openid ='{$openid}'";
            }*/
            if(!empty($keywords)){
                //用空格分开，默认或搜索
                $searchArr =explode(" ",$keywords);
                foreach($searchArr as $k=>$v){
                    $condition .= " AND (title LIKE '%{$v}%')";
                    
                }
            
            
            
            }
            $list = pdo_fetchall("SELECT * FROM " . tablename($this->table_chesstest) . " WHERE {$condition} ORDER BY addtime DESC,status");
			
		
			include $this->template('self_chesstest');
	}break;
	case 'test_ajax':{
		//只放第一页
			$pindex = max(1, intval($_GPC['page']));
			$psize = $listnum;
			$condition = " uniacid='{$uniacid}' ";
			$keywords = $_GPC['keywords'];
			// where 条件
			
           /* if(!empty($openid)){
                $condition .= " AND openid ='{$openid}'";
            }*/
            if(!empty($keywords)){
                //用空格分开，默认或搜索
                $searchArr =explode(" ",$keywords);
                foreach($searchArr as $k=>$v){
                    $condition .= " AND (title LIKE '%{$v}%')";
                    
                }
            
            
            
            }
            $list = pdo_fetchall("SELECT * FROM " . tablename($this->table_chesstest) . " WHERE {$condition} ORDER BY addtime DESC LIMIT " . ($pindex - 1) * $psize . ',' . $psize);
			
			echo json_encode($this->data2publishchesstesthtml($list));
	}break;
	
		case 'blacklist':{
		//我发布的
			//只放第一页
			$pindex = max(1, intval($_GPC['page']));
			$psize = $listnum;
			$condition = " uniacid='{$uniacid}' ";
			$keywords = $_GPC['keywords'];
			// where 条件
			
            /*if(!empty($openid)){
                $condition .= " AND openid ='{$openid}'";
            }*/
            if(!empty($keywords)){
                //用空格分开，默认或搜索
                $searchArr =explode(" ",$keywords);
                foreach($searchArr as $k=>$v){
                    $condition .= " AND (nickname LIKE '%{$v}%')";
                    
                }
            }
            $condition .= " AND status = 0";
            $list = pdo_fetchall("SELECT * FROM " . tablename($this->table_user) . " WHERE {$condition} ORDER BY addtime DESC LIMIT " . ($pindex - 1) * $psize . ',' . $psize);
			
		
			include $this->template('blacklist');
	}break;
	case 'blacklist_ajax':{
		//只放第一页
			$pindex = max(1, intval($_GPC['page']));
			$psize = $listnum;
			$condition = " uniacid='{$uniacid}' ";
			$keywords = $_GPC['keywords'];
			// where 条件
			
           /* if(!empty($openid)){
                $condition .= " AND openid ='{$openid}'";
            }*/
            if(!empty($keywords)){
                //用空格分开，默认或搜索
                $searchArr =explode(" ",$keywords);
                foreach($searchArr as $k=>$v){
                    $condition .= " AND (nickname LIKE '%{$v}%')";
                    
                }
            }
			$condition .= " AND status = 0";
            $list = pdo_fetchall("SELECT * FROM " . tablename($this->table_user) . " WHERE {$condition} ORDER BY updatetime DESC LIMIT " . ($pindex - 1) * $psize . ',' . $psize);
			//echo json_encode($list);
echo json_encode($this->data2blacklisthtml($list));
	}break;
	case 'collect':{
		//我收藏的
	       //只放第一页
			$pindex = max(1, intval($_GPC['page']));
			$psize = $listnum;
			$condition['uniacid'] = $uniacid;
			$chesscondition = " uniacid='{$uniacid}' ";
			$keywords = $_GPC['keywords'];
			$list = array();
			
			// where 条件
			
            if(!empty($openid)){
                $condition['openid'] = $openid;
            }
            
            $chessids =  pdo_getall($this->table_collect, $condition, 'chessid' , '' , 'addtime DESC');
           // print_r($chessids);
            if(!empty($keywords)){
                //用空格分开，默认或搜索
                $searchArr =explode(" ",$keywords);
                foreach($searchArr as $k=>$v){
                    $chesscondition .= " AND (title LIKE '%{$v}%'";
                    $chesscondition .= " OR redname LIKE '%{$v}%'";
                    $chesscondition .= " OR blackname LIKE '%{$v}%')";
                }
            }
            
            if(!empty($chessids)){
                $chesscondition .= " AND ( ";
                $temp = array();
                foreach($chessids as $k=>$v){
                    //print_r($v['chessid']);
                    array_push($temp, "id = ".$v[chessid]);
                }
                //print_r($temp);
                $chesscondition .= implode(" OR ",$temp);
                $chesscondition .= " )";
				$list = pdo_fetchall("SELECT * FROM " . tablename($this->table_chess) . " WHERE {$chesscondition} ORDER BY addtime DESC");
            }
            //echo $chesscondition;
            
            
            //echo count($list);
		
			include $this->template('self_collect');
	}break;
	case 'collect_ajax':{
	//我收藏的
	//只放第一页
			$pindex = max(1, intval($_GPC['page']));
			$psize = $listnum;
			$condition['uniacid'] = $uniacid;
			$chesscondition = " uniacid='{$uniacid}' ";
			$keywords = $_GPC['keywords'];
			$list = array();
			
			// where 条件
			
            if(!empty($openid)){
                $condition['openid'] = $openid;
            }
            
            $chessids =  pdo_getall($this->table_collect, $condition, 'chessid' , '' , 'addtime DESC');
            //print_r($chessids);
            if(!empty($keywords)){
                //用空格分开，默认或搜索
                $searchArr =explode(" ",$keywords);
                foreach($searchArr as $k=>$v){
                    $chesscondition .= " AND (title LIKE '%{$v}%'";
                    $chesscondition .= " OR redname LIKE '%{$v}%'";
                    $chesscondition .= " OR blackname LIKE '%{$v}%')";
                }
            }
            
            if(!empty($chessids)){
                $chesscondition .= " AND ( ";
                $temp = array();
                foreach($chessids as $k=>$v){
                    //print_r($v['chessid']);
                    array_push($temp, "id = ".$v[chessid]);
                }
                //print_r($temp);
                $chesscondition .= implode(" OR ",$temp);
                $chesscondition .= " )";
				$list = pdo_fetchall("SELECT * FROM " . tablename($this->table_chess) . " WHERE {$chesscondition} ORDER BY addtime DESC LIMIT " . ($pindex - 1) * $psize . ',' . $psize);
            }
            
           
           
			
			
			echo json_encode($this->data2collectchesshtml($list));
	}break;
	case 'follow':{
		//我关注的
	    //只放第一页
	    $pindex = max(1, intval($_GPC['page']));
	    $psize = $listnum;
	    $condition['uniacid'] = $uniacid;
	    $chesscondition = " uniacid='{$uniacid}' ";
	    $keywords = $_GPC['keywords'];
	    $list = array();
	    	
	    // where 条件
	    	
	    if(!empty($openid)){
	        $condition['openid'] = $openid;
	    }
	    
	    $chessids =  pdo_getall($this->table_follow, $condition, 'playerid' , '' , 'addtime DESC');
	    //print_r($chessids);
	    if(!empty($keywords)){
	        //用空格分开，默认或搜索
	       $chesscondition .= " AND playername like '%{$keywords}%'";
	    }
	    
	    if(!empty($chessids)){
	        $chesscondition .= " AND ( ";
	        $temp = array();
	        foreach($chessids as $k=>$v){
	            //print_r($v['chessid']);
	            array_push($temp, "id = ".$v[playerid]);
	        }
	        //print_r($temp);
	        $chesscondition .= implode(" OR ",$temp);
	        $chesscondition .= " )";
	    }
	    //echo $chesscondition;
	    
	    $list = pdo_fetchall("SELECT * FROM " . tablename($this->table_player) . " WHERE {$chesscondition} ORDER BY addtime DESC");
	    //echo count($list);
			
		
		include $this->template('self_follow');
	}break;
	case 'follow_ajax':{
	//我关注的
		//只放第一页
	    $pindex = max(1, intval($_GPC['page']));
	    $psize = $listnum;
	    $condition['uniacid'] = $uniacid;
	    $chesscondition = " uniacid='{$uniacid}' ";
	    $keywords = $_GPC['keywords'];
	    $list = array();
	    	
	    // where 条件
	    	
	    if(!empty($openid)){
	        $condition['openid'] = $openid;
	    }
	    
	    $chessids =  pdo_getall($this->table_follow, $condition, 'playerid' , '' , 'addtime DESC');
	    //print_r($chessids);
	    if(!empty($keywords)){
	        //用空格分开，默认或搜索
	       $chesscondition .= " AND playername like '%{$keywords}%'";
	    }
	    
	    if(!empty($chessids)){
	        $chesscondition .= " AND ( ";
	        $temp = array();
	        foreach($chessids as $k=>$v){
	            //print_r($v['chessid']);
	            array_push($temp, "id = ".$v[playerid]);
	        }
	        //print_r($temp);
	        $chesscondition .= implode(" OR ",$temp);
	        $chesscondition .= " )";
	    }
	    //echo $chesscondition;
	    
	    $list = pdo_fetchall("SELECT * FROM " . tablename($this->table_player) . " WHERE {$chesscondition} ORDER BY addtime DESC LIMIT " . ($pindex - 1) * $psize . ',' . $psize);
	    
		echo json_encode($this->data2playerhtml($list,$openid));
	}break;
	case 'edit_follow':{
		$ajaxreturn = array();
		$ctype = trim($_GPC['ctype']);
		$id = intval($_GPC['id']);
		$openid = trim($_GPC['openid']);
		load()->model('mc');
		$uid = mc_openid2uid($openid);
		$collect = pdo_get($this->table_follow, array('uniacid' => $uniacid,'openid'=>$openid,'playerid'=>$id));
		if(empty($collect)){
			$insertdata = array(
				'uniacid' => $uniacid,
				'uid'	  => $uid,
				'openid'  => $openid,
				'playerid'   => $id,
				'addtime' => time(),
		);
		pdo_insert($this->table_follow, $insertdata);
		$ajaxreturn['followsum'] = $this->edit_follow_sum($id,'add');
		$ajaxreturn['result'] = '1';
		
			}else{
				pdo_delete($this->table_follow, array('uniacid'=>$uniacid,'openid'=>$openid,'playerid'=>$id));
				$ajaxreturn['followsum'] = $this->edit_follow_sum($id,'minus');
				$ajaxreturn['result'] = '2';
			}
			
			echo json_encode($ajaxreturn);

	}break;
	case 'myself':{
		//我是棋手
		//判断是不是棋手

		 if($this->isplayer($openid)==0){
		    message('请点击注册棋手！',$this->createMobileUrl('self',array('op'=>'notplayer')),'error');
		}else if($this->isplayer($openid)==2){
		    message('您还未审核通过，点此编辑棋手信息！',$this->createMobileUrl('self',array('op'=>'notplayer')),'error');
		}
		else if($this->isplayer($openid)==1){
		    $result['openid'] = $_W['openid'];
		    $result['uniacid'] = $uniacid;
		    $player = pdo_get($this->table_player, $result);
		    
		    message('', $this->createMobileUrl('player', array('op'=>'search','keywords'=>$player['playername'])),'succsss');
		  
		} 
		
	}break;
	case 'feedback' :
	    {
	        
	        load()->func('tpl');
	        if ($_W['isajax'] || $_W['ispost']) {
	             
	            $data = array(
	                'uniacid' => $_W['uniacid'],
	                'description' => trim($_GPC['description']),
	                'score' => $_GPC['score'],
	                'photo' => json_encode($_GPC['photo']),
	                'nickname' => $_W['fans']['nickname'],
	                'openid' => $_W['openid'],
	                'contact' => $_GPC['contact'],
	                'createtime' => time()
	            );
	            if (checkauth()) {
	                $data['uid'] = $_W['member']['uid'];
	            }
	            if (pdo_insert($this->table_feedback, $data)) {
	
	                echo json_encode('success');
	            }
	        } else {
	             
	            include $this->template('feedback');
	        }
	    }
	    break;
	case 'notplayer':{
	    //load()->func('util');
	    load()->func('tpl');
	    $result['openid'] = $_W['openid'];
	    $result['uniacid'] = $uniacid;
	    $player = pdo_get($this->table_player, $result);
	    if(empty($player)){
	        $player['photo'] = $_W['fans']['avatar'];
	    }
	       
/* 	    if(!empty($player)){
	         if(!strpos($player['photo'],   "http:")){
	            $player['photo'] = tomedia($player['photo']);
	        } 
	        if(!$player['certificate']){
	            foreach ($player['certificate'] as $key=>$photo){
	                $player['certificate'][$key] = json_decode($player['certificate'][$key]);
	            }
	        } 
	    }*/
	    include $this->template('self_notplayer');
	}break;
	case 'applyplayer':{// 申请成为棋手
	    
	    if ($_W['isajax'] || $_W['ispost']) {
	         
	        $condition['uniacid'] = $uniacid;
	        if (!$_GPC['playername']) {
	            message("抱歉，姓名不能为空！");
	        } else {
	            $condition['playername'] = trim($_GPC['playername']);
	            // 判断棋手是否存在，如果存在，返回0
	            if ($this->isplayer($openid)==0&&pdo_get($this->table_player, $condition)) {
	                echo json_encode('0');
	            }else{
	                $data = array(
	                    'uniacid' => $_W['uniacid'],
	                    'playername' => trim($_GPC['playername']),
	                    'playerlevel' => trim($_GPC['playerlevel']),
	                    'status' => 2,
	                    'letter'=> $this->getFirstCharter(trim($_GPC['playername'])),
	                    'qq' => trim($_GPC['qq']),
	                    'openid' => $_W['openid'],
	                    'phone' => trim($_GPC['phone']),
	                    
	                    'certificate' => json_encode($_GPC['certificate']),
	                    'playerdes'=> trim($_GPC['playerdes']),
	                    'addtime' => time()
	                );
	                if (checkauth()) {
	                    $data['uid'] = $_W['member']['uid'];
	                    
	                }
	                if($_GPC['photo']!='undefined'){
	                    $data['photo'] = $_GPC['photo'];
	                }else {
	                    $data['photo'] = $_W['fans']['avatar'];
	                }
	                if(($this->isplayer($openid)==2)&&pdo_update($this->table_player, $data,array('openid'=>$_W['openid']))){
	                    //如果编辑成功，返回2，代表待审核,编辑信息成功
	                    echo json_encode('2');
	                }
	                if(($this->isplayer($openid)==0)&&pdo_insert($this->table_player, $data)){
	                    //如果添加成功，返回1，代表待审核,添加信息成功
	                    echo json_encode('1');
	                }
	                
	            }
	        }
	         
	     
	    }
                
            
	    
	}break;
	
	
	case 'setting':{
	    $condition['uniacid'] = $uniacid;
	    $condition['openid']=$_W['openid'];
	    $setting1 = pdo_get($this->table_user_setting, $condition);

	    if ($_W['ispost']){
	           $data = array(
	            'uniacid' => $_W['uniacid'],
	           'openid' => $_W['openid'],
	           'chess_add_info' => $_GPC['chess_add_info'],
	           'player_add_info' => $_GPC['player_add_info'],
	           'collect_update_info' => $_GPC['collect_update_info'],
	           'follow_update_info' => $_GPC['follow_update_info'],
	           'publish_read_info' => $_GPC['publish_read_info'],
	           'publish_share_info' => $_GPC['publish_share_info'],
	           'addtime' => time()  
	       );
	           
	       if(pdo_get($this->table_user_setting, $condition)){
	       		$url = $this->createMobileUrl('self');
	           if(pdo_update($this->table_user_setting, $data,array('openid'=>$_W['openid']))){
	           	//var_dump($_SERVER['SERVER_NAME']);
	              //message('更新设置成功！', $this->createMobileUrl('self',array('op'=>'main')),'success');
	              echo "<script type='text/javascript'>alert('更新设置成功！');window.open('$url','_top');</script>";
	           }
	       }else {
	           if(pdo_insert($this->table_user_setting, $data)){
	              echo "<script type='text/javascript'>alert('设置成功！');window.open('$url','_parent');</script>";
	              
	           }
	       }
	       
	    }else {
	         include $this->template('setting');
	    }
	}break;
	case 'upload':{
	    include $this->template('upload');
	}break;
	case 'rank':{
		$pindex = max(1, intval($_GPC['page']));
		$psize = 10;
		$memberinfo = pdo_fetchall("SELECT uid,credit1,nickname,avatar FROM " .tablename('mc_members'). " WHERE uniacid={$_W['uniacid']} ORDER BY credit1 DESC LIMIT ". ($pindex - 1) * $psize . ',' . $psize);
		//var_dump($memberinfo);
		include $this->template('rank');
	}
	break;
	/**
	 * 所有会员添加积分，by cfy
	 */
	case 'credit_add':
		$condition = 'uniacid=:uniacid';
		$param[':uniacid'] = $_W['uniacid'];
		$coin = 1000;
		 $list_all = pdo_fetchall("SELECT * FROM " . tablename($this->table_user) . " WHERE {$condition}  ",$param);
		//var_dump($list_all);
		load()->model('mc');
		foreach ($list_all as $key => $value) {
			var_dump($value['uid']);
			
		 mc_credit_update($value['uid'], 'credit1', $coin, array($value['uid'], '上传棋谱奖励积分：'.$coin));
		}	
		break;

}




?>