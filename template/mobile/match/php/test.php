<?php

	try {
		$id = $_POST['id'];
		$value = $_POST['msg'];
		$msg = json_decode($value);
		$key = $msg->command;
		$fen = substr($key,13,strlen($key)-13);
		
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
	    	$len = $redisRead->lSize($fen);
			$index = rand(0, $len);
			$json_arr = $redisRead->lGet($fen,$index);
			$json_obj = json_encode($json_arr);
	    }
		else {
			$json_obj = "";
		}
		

		$redisRead->close();
		echo $json_obj;
	}
	catch (Exception $e) {
		$json_obj = json_encode($e);
		echo $json_obj;
	}
	
?>
