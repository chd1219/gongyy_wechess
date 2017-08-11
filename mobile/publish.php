<?php
switch ($op){
    case 'create':{
		$file = $_GPC['file'];
		$chessid = $_GPC['chessid'];
		$title = '创建棋谱';
        include $this->template('publish_create');
    }break;

	case 'ai':{
		$file = $_GPC['file'];
		$chessid = $_GPC['chessid'];
		$title = '人机对弈';
        include $this->template('publish_ai');
    }break;

    case 'analyse':{
		$file = $_GPC['file'];
		$chessid = $_GPC['chessid'];
		//判断用户是否VIP,如果不是VIP则普通模式，如果是VIP则VIP模式，有云库、拆棋棋力高
		$title = '拆解研究';
        include $this->template('publish_analyse');
    }break;

    case 'analyse_vip':{
		$file = $_GPC['file'];
		$chessid = $_GPC['chessid'];
		//判断用户是否VIP,如果不是VIP则普通模式，如果是VIP则VIP模式，有云库、拆棋棋力高
		$title = '拆解研究';
        include $this->template('publish_analyse_vip');
    }break;

    
    
	case 'save':{
		//保存棋谱
		
		$map = $_GPC['map'];
		$moves = $_GPC['moves'];	
		$notes = $_GPC['notes'];	
		$filename = $_GPC['filename'];
		$BillType = $_GPC['BillType']+0;
		$maplist = explode(' ',$map);
		$moveslist = explode(' ',$moves);
		$noteslist = explode(' ',$notes);
		$chessdata = '';
		
		$chessdata .= '{"BillType":'.$BillType;	
		$chessdata .= ',"map":[';
		for ($index=1;$index<count($maplist);$index+=3){
			$chessdata .= '{"cid":';
			$chessdata .= $maplist[$index];
			$chessdata .= ',"x":';
			$chessdata .= $maplist[$index+1];
			$chessdata .= ',"y":';
			$chessdata .= $maplist[$index+2];
			if($index == count($maplist)-3)
				$chessdata .= '}';
			else
				$chessdata .= '},';
		}
		
		if($BillType){
			
			if(count($moveslist) >0){
				$chessdata .= '],"moves":[';
				for ($index=1;$index<count($moveslist);$index+=4){
					$chessdata .= '{"step":"';			
					$chessdata .= $moveslist[$index];
					$chessdata .= '","id":';
					$chessdata .= $moveslist[$index+1];
					$chessdata .= ',"perid":';
					$chessdata .= $moveslist[$index+2];
					$chessdata .= ',"index":';
					$chessdata .= $moveslist[$index+3];
	
					if($index == count($moveslist)-4)
						$chessdata .= '}';
					else
						$chessdata .= '},';
				}		
			}		
		}
		else{
			if(count($moveslist) >0){
				$chessdata .= '],"moves":[';
				for ($index=1;$index<count($moveslist);$index+=4){
					$chessdata .= '{"src":';			
					$chessdata .= '{"x":';
					$chessdata .= $moveslist[$index];
					$chessdata .= ',"y":';
					$chessdata .= $moveslist[$index+1];
					$chessdata .= '},"dst":';
					$chessdata .= '{"x":';
					$chessdata .= $moveslist[$index+2];
					$chessdata .= ',"y":';
					$chessdata .= $moveslist[$index+3];
					if($index == count($moveslist)-4)
						$chessdata .= '}}';
					else
						$chessdata .= '}},';
				}		
			}		
		}
		if(count($noteslist) >0){
			$chessdata .= '],"notes":[';
			for ($index=1;$index<count($noteslist);$index+=2){
				$chessdata .= '{"id":';					
				$chessdata .= $noteslist[$index];
				$chessdata .= ',"note":"';
				$chessdata .= $noteslist[$index+1];
				$chessdata .= '"';
				if($index == count($noteslist)-2)
					$chessdata .= '}';
				else
					$chessdata .= '},';
			}		
		}	
		
		$chessdata .= ']}';
		
		$data['filename'] = $filename;
		$data['chessdata'] = preg_replace("/\s/","",$chessdata);
		$data['uniacid'] = $_W['uniacid'];
		$data['openid'] = $openid;
		//自站对局
		//判断是否是棋手
		if($this->isplayer($_W['openid'])==1){
			$player = pdo_get($this->table_player,array('openid'=>$_W['openid']));
			$data['redname'] = $data['blackname'] = $player['playername'];
			$data['redplayerid'] = $data['blackplayerid'] = $player['id'];
		}else{
			$data['redname'] = $data['blackname'] = $_W['fans']['nickname'];
		}
		/*$data['redname'] = $_W['fans']['nickname'];*/
		$data['redopenid'] = $openid;
		/*$data['blackname'] = $_W['fans']['nickname'];*/
		$data['blackopenid'] = $openid;
		//设置标题
		//判断保存来源
		$source = $_GPC['source'];
		if($source=='create'){
			$data['title'] = $_W['fans']['nickname'].'创建的动态棋谱'.date("Y-m-d_H:i:s");
		}elseif($source=='ai'){
			$data['title'] = $_W['fans']['nickname'].'和象棋微学堂手机软件的人机对弈'.date("Y-m-d_H:i:s");
		}elseif($source=='analyse'){
			$data['title'] = $_W['fans']['nickname'].'的研究拆解棋谱'.date("Y-m-d_H:i:s");
		}
		
		$data['categoryid'] = 9;
		$data['addtime'] = time();
		$data['updatetime'] = time();
		pdo_insert($this->table_chess,$data);
	}break;
	
	case 'release':{
		
		//输入详细信息，然后发布棋谱
		$condition['uniacid'] = $_W['uniacid'];
		$condition['id'] = $_GPC['chessid'];
		//print_r($condition);
		$chess = pdo_get($this->table_chess,$condition);
		include $this->template('publish_release');
		
	}break;
	
	case 'edit':{
		//输入详细信息，然后发布棋谱
		$condition['uniacid'] = $_W['uniacid'];
		$condition['id'] = $_GPC['chessid'];
		//print_r($condition);
		$chess = pdo_get($this->table_chess,$condition);
		include $this->template('publish_edit');
		
	}break;
	
	
}



