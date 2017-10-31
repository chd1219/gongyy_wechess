<?php
   class MyDB extends SQLite3
   {
      function __construct()
      {
         $this->open('../openbook/独醉飞刀开局库第三十三季.obk');
      }
   }
   $db = new MyDB();
   if(!$db){
      echo $db->lastErrorMsg();
   } else {
      echo "Opened database successfully\n";
	  echo "<br/>";
   }

   $sql ="SELECT * from bhobk where vkey = 5102328636083531887;";

   $ret = $db->query($sql);
   while($row = $ret->fetchArray(SQLITE3_ASSOC) ){
      echo "ID = ". $row['id'] . "\n";
      echo "vkey = ". $row['vkey'] ."\n";
      echo "vmove = ". $row['vmove'] ."\n";
      echo "vscore =  ".$row['vscore'] ."\n\n";
	  echo "<br/>";
   }
   echo "Operation done successfully\n";
   $db->close();
?>