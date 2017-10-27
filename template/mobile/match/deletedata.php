<?php
	$id = $_POST['id'];
	$msg = $_POST['msg'];
	$key = $msg;
	$fen = substr($key,13,strlen($key)-13);
	$redisRead = new Redis();
	$redisRead->connect('118.178.228.206', 8641);
	$redisRead->auth("jiao19890228");	
    $redisRead->del($fen);
	$redisRead->close();
	$redisWrite = new Redis();
	$redisWrite->connect('118.190.46.210', 8641);
	$redisWrite->auth("jiao19890228");
	$redisWrite->del($fen);
	$redisWrite->close();	
	$json_obj = json_encode($fen);
	echo $json_obj;
?>
