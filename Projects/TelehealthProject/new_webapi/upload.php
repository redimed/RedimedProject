<?php
if (isset($_FILES['fileToUpload']) && $_FILES['fileToUpload']['size'] > 0) { 

      // Temporary file name stored on the server
      $tmpName  = $_FILES['fileToUpload']['tmp_name'];  

      // Read the file 
      $fp      = fopen($tmpName, 'r');
      $data = fread($fp, filesize($tmpName));
	 
	  $imgdata = 'data:image/' . $filetype . ';base64,' . base64_encode($data);			
	  //preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $imgdata);
	
	  //copy( $imgdata,"output/temp2.png");
      //$data = addslashes($data);
      fclose($fp);

      echo $imgdata;
	
}else {
   echo 0;
}

?>