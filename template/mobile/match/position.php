<?php

	try {
		$id = $_POST['id'];
		$value = $_POST['msg'];
		$msg = json_decode($value);
		$redisWrite = new Redis();
		$redisWrite->connect('118.190.46.210', 6379);
		$redisWrite->auth("jiao19890228");
		/*历史消息按日期入第一个库*/
		$redisWrite->select(0);	
		$today = date("Ymd");    
		$redisWrite->incr($today);
		$key = $msg->command;
		$fen = substr($key,13,strlen($key)-13);
		if (!empty($fen)) {
			/*消息队列入第二个库*/
			$redisWrite->select(2);
			$redisWrite->set($fen,$value,600);
			/*统计频次*/
			$redisWrite->select(5);
			$redisWrite->incr($fen);
		}
		if (!empty($id)) {
			/*棋盘数据入第三个库*/
			$redisWrite->select(3);
			$redisWrite->rpush($id, $value);			
			if($redisWrite->llen($id) == 1) {
				/*每天下了多少盘棋入第四个库*/
				$redisWrite->select(4);
				$redisWrite->rpush($today, $id);
			}
		}
		$redisWrite->close();
		
		if($msg->type == 0) {
			$power = substr($msg->power,5,1);
			switch ($power) {
		        case 0:
		            $depth = 3;
		            break;
		        case 1:
		            $depth = 6;
		            break;
		        case 2:
		            $depth = 9;
		            break;
		        case 3:
		            $depth = 12;
		            break;
		        case 4:
		            $depth = 15;
		            break;
		        case 5:
		            $depth = 16;
		            break;
		        case 6:
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
		$redisRead->connect('118.178.228.206', 8641);
		$redisRead->auth("jiao19890228");	
	    $json_arr = $redisRead->lrange($fen,0,$depth-1);
		$arrlen = sizeof($json_arr);
		
		if($arrlen > 0) {
			$json_arr[$arrlen] = "bestmove ".substr( strstr($json_arr[$arrlen-1], ' pv '), 4, 4);
		}
		$json_obj = json_encode($json_arr);
		$redisRead->close();
		echo $json_obj;
	}
	catch (Exception $e) {
		$json_obj = json_encode($e);
		echo $json_obj;
	}
	
?>
