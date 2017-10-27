<?php
	$id = $_POST['id'];
	$value = $_POST['msg'];
	$msg = json_decode($value);
	$redisWrite = new Redis();
	$redisWrite->connect('118.190.46.210', 6379);
	$redisWrite->auth("jiao19890228");
	$redisWrite->select(1);	
	$today = date("Ymd");    
	$redisWrite->rpush($today, $value);
	$key = $msg->command;
	$fen = substr($key,13,strlen($key)-13);
	if (!empty($fen)) {
		$redisWrite->select(2);
		$redisWrite->set($fen,$value,600);
	}
	if (!empty($id)) {
		$redisWrite->select(3);
		$redisWrite->rpush($id, $value);
	}
	$redisWrite->close();
	
	$redisRead = new Redis();
	$redisRead->connect('118.178.228.206', 8641);
	if(empty($msg->type)) {
		$power = $msg->$power;
		switch ($power) {
	        case "level-0":
	            $depth = 3;
	            break;
	        case "level-1":
	            $depth = 6;
	            break;
	        case "level-2":
	            $depth = 9;
	            break;
	        case "level-3":
	            $depth = 12;
	            break;
	        case "level-4":
	            $depth = 15;
	            break;
	        case "level-5":
	            $depth = 16;
	            break;
	        case "level-6":
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
	$redisRead->auth("jiao19890228");	
    $json_arr = $redisRead->lrange($fen,0,$depth-1);
	$arrlen = sizeof($json_arr);
	
	if($arrlen > 0) {
		$json_arr[$arrlen] = "bestmove ".substr( strstr($json_arr[$arrlen-1], ' pv '), 4, 4);
	}
	$json_obj = json_encode($json_arr);
	$redisRead->close();
	echo $json_obj;
?>
