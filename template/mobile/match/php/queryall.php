<?php

	try {
		$id = $_POST['id'];
		$value = $_POST['msg'];
		$msg = json_decode($value);
		$redisRead = new Redis();
		$redisRead->connect('118.190.46.210', 8639);
		$redisRead->auth("jiao19890228");		
		$key = $msg->command;
		$fen = substr($key,9,strlen($key)-9);
		$json_arr = $redisRead->get($fen);		
		$json_obj = json_encode($json_arr);
		$redisRead->close();
		echo $json_obj;
	}
	catch (Exception $e) {
		$json_obj = json_encode($e);
		echo $json_obj;
	}
	
?>
