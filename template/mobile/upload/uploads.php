<?php
    if(!$_POST){
        header("Location: http://".$_SERVER['HTTP_HOST']);
    }

    $id = $_POST['upload_id'];
    $base64 = $_POST['upload_pic'];

    $filename = time();
    $rand = rand(10000, 99999);
    if (preg_match('/^(data:\s*image\/(\w+);base64,)/', $base64, $result)){
        $type = $result[2];
        if($type = "jpeg")$type = "jpg";
        $new_file = "./uploads/".$filename."_".$rand.".{$type}";
        file_put_contents($new_file, base64_decode(str_replace($result[1], '', $base64)));
    }

    $data['errCode'] = 0;
    $data['data']['id'] = $id;
    $data['data']['picId'] = $filename."_".$rand;
    echo (json_encode($data));
?>