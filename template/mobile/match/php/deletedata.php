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
	try	{
		$redisRead = new Redis();
		$redisRead->connect('47.96.26.54', 8641);
		$redisRead->auth("jiao19890228");	
	    $redisRead->del($fen);
		$redisRead->close();
		$redisRead1 = new Redis();
		$redisRead1->connect('47.97.168.122', 8640);
		$redisRead1->auth("jiao19890228");	
	    $redisRead1->del($fen);
		$redisRead1->close();
	}
	
	$json_obj = json_encode($fen);
	echo $json_obj;
?>
