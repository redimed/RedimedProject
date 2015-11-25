<!DOCTYPE html> 
<html> 
	<head> 
	<title>Redimed - TELEHEALTH</title> 
	<meta name="viewport" content="width=device-width, initial-scale=1"> 
    <meta charset="UTF-8">
    <link rel="apple-touch-icon" href="http://mynote.net.au/telehealth/apple-touch-icon.png"/>
    <meta http-equiv="cache-control" content="max-age=0" />
    <meta http-equiv="cache-control" content="no-cache" />
    <meta http-equiv="expires" content="0" />
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
    <meta http-equiv="pragma" content="no-cache" />
    

    <link rel="shortcut icon" href="http://mynote.net.au/telehealth/images/favicon.ico">
	<link rel="stylesheet" href="http://mynote.net.au/telehealth/css/style.css" />
	<script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
	<script src="http://code.jquery.com/mobile/1.1.0/jquery.mobile-1.1.0.min.js"></script>
    <link rel="stylesheet" href="http://mynote.net.au/telehealth/css/mobiscroll-2.0.custom.min.css" />
	<script src="http://mynote.net.au/telehealth/js/mobiscroll-2.0.custom.min.js"></script>
    <script src="http://mynote.net.au/telehealth/js/subpage.js"></script>
    <script src="http://mynote.net.au/telehealth/js/jquery.json-2.3.min.js"></script>
    <link rel="stylesheet" href="http://mynote.net.au/telehealth/css/actionsheet.css" />
	<script src="http://mynote.net.au/telehealth/js/actionsheet.js"></script>
	<script>
		
		var pages =["#form","#results","#settings"];
		/*
		$(document).ready(function() {
			$(document).bind("swipeleft", function(){
				var obj = $.mobile.path.parseUrl(window.location.href);
				if (obj.hash == '')
					k = 1;
				if (obj.hash == '#results')
					k = 2;
				if (obj.hash == '#settings')
					k = 0;
			  	$.mobile.changePage(pages[k]);
			});
			
			$(document).bind("swiperight", function(){
				var obj = $.mobile.path.parseUrl(window.location.href);
				if (obj.hash == '')
					k = 2;
				if (obj.hash == '#results')
					k = 0;
				if (obj.hash == '#settings')
					k = 1;
			  	$.mobile.changePage(pages[k]);
			});
		});
		
		*/
		
		$.fn.serializeObject = function(){
			var o = {};
			var a = this.serializeArray();
			$.each(a, function() {
				if (o[this.name]) {
					if (!o[this.name].push) {
						o[this.name] = [o[this.name]];
					}
					o[this.name].push(this.value || '');
				} else {
					o[this.name] = this.value || '';
				}
			});
			return o;
		};


		$(document).bind("mobileinit", function () {
            $.mobile.defaultPageTransition = "slide";
            $.mobile.loadingMessage = "Loading...";
			$.mobile.page.prototype.options.domCache = false;
			
        });
		$(document).bind('pagechange', function() {
		  $('.ui-page-active .ui-listview').listview('refresh');
		  $('.ui-page-active :jqmData(role=content)').trigger('create');
		});
		
	</script>
		
</head> 
<body id="4swipe"> 