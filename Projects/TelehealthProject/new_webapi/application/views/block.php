<!-- Start of second page: #step 2 -->
<div data-mini="true" data-role="page" id="form-2">
	<div data-mini="true" data-role="header" data-id="foo1" data-position="fixed">
        <div data-mini="true" data-role="navbar">
            <ul>
                <li><a href="/tools/index.php/form" data-icon="home" class="ui-btn-active ui-state-persist" data-ajax="false">Form</a></li>
                <li><a href="/tools/index.php/results"data-icon="grid" data-ajax="false">Results</a></li>
                <li><a href="/tools/index.php/settings" data-icon="gear" data-ajax="false">Settings</a></li>
                
            </ul>
        </div><!-- /navbar -->
    </div><!-- /header -->
  <div data-mini="true" data-role="content" >	
         <?php
			$stuff="String to enc/enc/dec/dec =,=,";
			$key="XiTo74dOO09N48YeUmuvbL0E";
			function hexToStr($hex)
			{
				$string='';
				for ($i=0; $i < strlen($hex)-1; $i+=2)
				{
					$string .= chr(hexdec($hex[$i].$hex[$i+1]));
				}
				return $string;
			}
			function strToHex($string)
			{
				$hex='';
				for ($i=0; $i < strlen($string); $i++)
				{
					$hex .= dechex(ord($string[$i]));
				}
				return $hex;
			}
			function nl() {
				echo "<br/> \n";
			}
			$iv = mcrypt_create_iv (mcrypt_get_block_size (MCRYPT_TripleDES, MCRYPT_MODE_CBC), MCRYPT_DEV_RANDOM);
			echo mcrypt_get_block_size (MCRYPT_TripleDES, MCRYPT_MODE_CBC);
			// Encrypting
			function encrypt($string, $key) {
				$enc = "";
				global $iv;
				$enc=mcrypt_cbc (MCRYPT_TripleDES, $key, $string, MCRYPT_ENCRYPT, $iv);
			
			  return base64_encode($enc);
			}
			
			// Decrypting 
			function decrypt($string, $key) {
				$dec = "";
				$string = trim(base64_decode($string));
				global $iv;
				$dec = mcrypt_cbc (MCRYPT_TripleDES, $key, $string, MCRYPT_DECRYPT, $iv);
			  return $dec;
			}
			
			$encrypted = encrypt($stuff, $key);
			$decrypted = decrypt($encrypted, $key);
			
			echo "Encrypted is ".$encrypted . nl(); 
			echo "Decrypted is ".$decrypted . nl(); 
		?>
  </div><!-- /content -->
</div><!-- /page two -->