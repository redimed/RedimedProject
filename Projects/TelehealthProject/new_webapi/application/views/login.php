<style>.ui-dialog .ui-header .ui-btn-icon-notext { display:none;} </style>
<div data-role="page" id="home">
	<script type="text/javascript">
		$("#home").bind( "pageinit", function(){
			$.mobile.ajaxEnabled = false;
			$("#hiddenDialog").click(function() {
				$.mobile.changePage( "#login", {
					transition: "flip",
					reverse: false,
					changeHash: false,
					role: 'dialog'
				});
			});
			$.fn.enterKey = function (fnc) {
				return this.each(function () {
					$(this).keypress(function (ev) {
						var keycode = (ev.keyCode ? ev.keyCode : ev.which);
						if (keycode == '13') {
							fnc.call(this, ev);
						}
					})
				})
			}
			
			$("#password").enterKey(function () {
				$("#loginbtn").trigger("click");
			})
			function getUniqueTime() {
			  var time = new Date().getTime();
			  while (time == new Date().getTime());
			  return new Date().getTime();
			}

			$("#loginbtn").click(function() {
				var data = $("#loginform").serialize();
			  	$.mobile.showPageLoadingMsg();								
				$.ajax({
				  type: "POST",
				  url: "/telehealth/index.php/authen/authenticate",
				  data: data+"&timestmp="+getUniqueTime(),
				}).done(function( msg ) {
				  //
					if ('0'!=msg){
						var obj = $.mobile.path.parseUrl(window.location.href);
						//alert(obj.search.substring(5));
						var url = obj.search.substring(5);    
						$(location).attr('href',url);

					}else{
						// error control here
						$("#mess").html('Username and password do not match.');
						$.mobile.hidePageLoadingMsg();
					};
				});
			});
			
			$('#hiddenDialog').trigger('click');
		});
	</script>
    <a href="#" id="hiddenDialog" data-role="button" style="display:none;">Open dialog</a>
</div>

<div data-role="page" data-rel="dialog" id="login">

	<div data-role="header">
		<h1>Login</h1>
	</div>

	<div data-role="content">
		
		<p>Please login to continue.</p>
		<form action="/telehealth/index.php/authen/authenticate" id="loginform" method="post">

			<div data-role="fieldcontain">
			    <label for="username">Username:</label>
			    <input type="text" name="username" id="username"  />
			</div>	

			<div data-role="fieldcontain">
			    <label for="password">Password:</label>
			    <input type="password" name="password" id="password" />
			</div>	
			<div id="mess"></div>
			<input type="button" name="loginbtn" id="loginbtn" value="Login" />
		</form>
			
	</div>
</div>


