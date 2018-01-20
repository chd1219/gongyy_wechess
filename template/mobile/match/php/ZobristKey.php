<?php
header("Content-Type:text/html; charset=utf-8");
if(isset($_POST['a']) && !empty($_POST['a'])) {
    $command = './ZobristKey '.$_POST['a'];
    $result = passthru($command);
    print_r($result);
} else {
    echo "输入不能为空！";
}

?>