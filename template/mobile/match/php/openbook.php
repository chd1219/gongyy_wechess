<?php

	try {
		$id = $_POST['id'];
		$value = $_POST['msg'];
		$msg = json_decode($value);
		$key = $msg->command;
		$fen = substr($key,9,strlen($key)-9);
		$redisRead2 = new Redis();
		$redisRead2->connect('47.96.28.91', 8642);
		$redisRead2->auth("jiao19890228");	
		$vkey = myext_helloworld($fen);		
		if($redisRead2->exists($vkey)) {
			$json_arr = $redisRead2->zRange($vkey, 0, -1);	
		}
		else{
			$json_arr = $vkey;
		}
		$json_obj = json_encode($json_arr);
		$redisRead2->close();
		echo $json_obj;
	}
	catch (Exception $e) {
		$json_obj = json_encode($e);
		echo $json_obj;
	}
	
?>
