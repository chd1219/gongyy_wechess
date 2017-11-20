<?php
	$id = $_POST['id'];
	$msg = $_POST['msg'];
	$key = $msg;
	$fen = substr($key,13,strlen($key)-13);
//	$redisWrite = new Redis();
//	$redisWrite->connect('47.96.28.91', 8640);
//	$redisWrite->auth("jiao19890228");
//	$redisWrite->del($fen);
//	$redisWrite->close();	
	$redisRead = new Redis();
	$redisRead->connect('47.96.28.91', 8641);
	$redisRead->auth("jiao19890228");	
    $redisRead->del($fen);
	$redisRead->close();
	$json_obj = json_encode($fen);
	echo $json_obj;
?>
