<?php
	$id = $_POST['id'];
	$msg = $_POST['msg'];
	$key = $msg;
	$fen = substr($key,13,strlen($key)-13);
	$redisWrite = new Redis();
	$redisWrite->connect('118.190.46.210', 8641);
	$redisWrite->auth("jiao19890228");
	$redisRead->del($fen);
	$redisWrite->close();
	
	$redisRead = new Redis();
	$redisRead->connect('118.178.228.206', 8641);
	$redisRead->auth("jiao19890228");	
    $json_arr = $redisRead->del($fen);
	$json_obj = json_encode($json_arr);
	$redisRead->close();
	echo $json_obj;
?>
