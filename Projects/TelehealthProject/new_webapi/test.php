<?php 
// Put your device token here (without spaces):
	$content="test";
		//$deviceToken = $id;
		$deviceToken = 'b6f83af60b13429ec0a882ad97b562b082bb599242fe9cc3e7b4863100cedca5';
		// Put your private key's passphrase here:
		$passphrase = '700120@mk';
		
		// Put your alert message here:
		$message = $content;
		
		////////////////////////////////////////////////////////////////////////////////
		
		$ctx = stream_context_create();
		stream_context_set_option($ctx, 'ssl', 'local_cert', 'ck.pem');
		stream_context_set_option($ctx, 'ssl', 'passphrase', $passphrase);
		
		// Open a connection to the APNS server
		$fp = stream_socket_client(
			'ssl://gateway.sandbox.push.apple.com:2195', $err,
			$errstr, 60, STREAM_CLIENT_CONNECT|STREAM_CLIENT_PERSISTENT, $ctx);
		
		if (!$fp)
			return 0;
			//exit("Failed to connect: $err $errstr" . PHP_EOL);
		
		//echo 'Connected to APNS' . PHP_EOL;
		
		// Create the payload body
		$body['aps'] = array(
			'alert' => $message,
			'sound' => 'alert.caf',
			'badge' => 5
			);
		
		// Encode the payload as JSON
		$payload = json_encode($body);
		
		// Build the binary notification
		$msg = chr(0) . pack('n', 32). pack('H*', $deviceToken) . pack('n', strlen($payload)) . $payload;
		
		// Send it to the server
		$result = fwrite($fp, $msg, strlen($msg));
		
		if (!$result)
			return 0;
		else
			return 1;
		//echo $result;
		// Close the connection to the server
		fclose($fp);
		?>