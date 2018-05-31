<?php

	try {
		$id = $_POST['id'];
		$value = $_POST['msg'];
		$msg = json_decode($value);
		$redisWrite = new Redis();
		$redisWrite->connect('47.96.28.91', 6379);
		$redisWrite->auth("jiao19890228");
		/*历史消息按日期入第一个库*/
		$redisWrite->select(0);	
		$today = date("Ymd");    
		$redisWrite->incr($today);
		$type = $msg->type;
		$redisWrite->select(6);
		$redisWrite->incr($today."_count_".$type);
		$key = $msg->command;
		$fen = substr($key,13,strlen($key)-13);
		if (!empty($fen)) {
			/*消息队列入第二个库*/
			$redisWrite->select(2);
			$redisWrite->set($fen,$value,60);
			/*统计频次*/
			//$redisWrite->select(5);
			//$redisWrite->incr($fen);
		}
		if (!empty($id)) {
			/*棋盘数据入第三个库*/
			$redisWrite->select(3);
			$redisWrite->incr($id);
			
			//$redisWrite->rpush($id, $value);			
			//if($redisWrite->llen($id) == 1) {
			if($redisWrite->get($id) == 2) {
				/*每天下了多少盘棋入第四个库*/				
				$redisWrite->select(4);
				$redisWrite->rpush($today, $id);
				$redisWrite->select(6);
				$redisWrite->incr($today."_board_".$type);
			}
			
			/*棋盘数据入第一个库*/
			$redisWrite->select(1);
			if(!$redisWrite->exists($id)) {
				$redisWrite->set($id,$value,60);
			}			
		}		
		
		if($msg->type == 0) {
			$power = $msg->power;
			switch ($power) {
		        case 'level-0':
		            $depth = 3;
		            break;
		        case 'level-1':
		            $depth = 6;
		            break;
		        case 'level-2':
		            $depth = 9;
		            break;
		        case 'level-3':
		            $depth = 12;
		            break;
		        case 'level-4':
		            $depth = 15;
		            break;
		        case 'level-5':
		            $depth = 16;
		            break;
		        case 'level-6':
		            $depth = 17;
		            break;
		        default:
		            $depth = 17;
		            break;
		    }
		}
		else {
			 $depth = 17;
		}
		$redisRead = new Redis();
		$redisRead->connect('47.96.26.54', 8641);
		$redisRead->auth("jiao19890228");			
		if($redisRead->exists($fen)) {
			$redisWrite->select(6);	
			$redisWrite->incr($today."_redis_".$type);
		}
		$json_arr = '';
//		$json_arr = $redisRead->lrange($fen,0,$depth-1);
//		$arrlen = sizeof($json_arr);
//		if($arrlen > 0) {
//			$json_arr[$arrlen] = "bestmove ".substr( strstr($json_arr[$arrlen-1], ' pv '), 4, 4);			
//		}

		$json_obj = json_encode($json_arr);
		
		$redisWrite->close();
		$redisRead->close();
		echo $json_obj;
	}
	catch (Exception $e) {
		$json_obj = json_encode($e);
		echo $json_obj;
	}
	
?>
