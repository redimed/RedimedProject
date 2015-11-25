<!-- Start of third page: #step 3 -->
<div data-mini="true" data-role="page" id="addComp">
	<script type="text/javascript">
		$("#addComp").bind( "pageinit", function(){
			//alert('done');
			$("#submit").click(function() {
				//alert('test');
				var data = $.toJSON($('#form-form').serializeObject());
				
			  	$.mobile.showPageLoadingMsg();								
				$.ajax({
					type: "POST",
					url: "/telehealth/index.php/redimed/submitUser",
					data: "type=<?= ((array_key_exists('id',$data))?'edit&id='.$data['id']:"add");?>&data="+data+"&url=/telehealth/index.php/redimed",
				}).done(function( msg ) {
					//alert(msg);
					if ('1'==msg){
						$.mobile.changePage( "#alert", {
							transition: "flip",
							reverse: false,
							changeHash: false,
							role: 'dialog'
						});
					}else{
						// error control here
						$.mobile.hidePageLoadingMsg();	
						alert("Invalid username or data. Please try again.");
					};
				});
			});
			$.fn.keyPressed = function (fnc) {
				return this.each(function () {
					$(this).keypress(function (ev) {
						fnc.call(this, ev);
					})
				})
			}
			
			$('input[name$="pwd"]').keyPressed(function () {
				$("#npwd").attr("style","");
				$("#cnpwd").attr("style","");
				$("#cpwd").attr("style","");
				$("#mess").html('');
			})
			
			function checkInput(){
				var valid = true;
				if (''==$("#cpwd").val()){
					valid = false;
					$("#cpwd").attr("style","background: none repeat scroll 0 0 #FFFDE3 !important;");
					$("#mess").html('Please fill in passwords.');
				}
				if (''==$("#npwd").val()){
					valid = false;
					$("#npwd").attr("style","background: none repeat scroll 0 0 #FFFDE3 !important;");
					$("#mess").html('Please fill in passwords.');
				}
				if (''==$("#cnpwd").val()){
					valid = false;
					$("#cnpwd").attr("style","background: none repeat scroll 0 0 #FFFDE3 !important;");
					$("#mess").html('Please fill in passwords.');
				}
				if ($("#cnpwd").val()!=$("#npwd").val()){
					valid = false;
					$("#npwd").attr("style","background: none repeat scroll 0 0 #FFFDE3 !important;");
					$("#cnpwd").attr("style","background: none repeat scroll 0 0 #FFFDE3 !important;");
					$("#mess").html('Confirm password does not match.');
				}
				return valid;
			}
			
			function getUniqueTime() {
			  var time = new Date().getTime();
			  while (time == new Date().getTime());
			  return new Date().getTime();
			}
			$('a[name|="changeCancel"]').click(function() {	
				$("#successdiv").hide();
				$("#formdiv").show();
				$("#cpwd").val('');
				$("#npwd").val('');
				$("#cnpwd").val('');
			});
			$(".ui-actionsheet-wallpaper").live( 'click',function() {							
			  	//alert('dsad');
				$("#successdiv").hide();
				$("#formdiv").show();
				$("#cpwd").val('');
				$("#npwd").val('');
				$("#cnpwd").val('');
			});	
			$('a[name|="changepwdbtn"]').click(function() {		
				//alert("cpwd="+$("#cpwd").val()+"&npwd="+$("#npwd").val()+"&timestmp="+getUniqueTime());
				
				if (checkInput()){										
					$.mobile.showPageLoadingMsg();			
					
					$.ajax({
					  type: "POST",
					  url: "/telehealth/index.php/authen/changePwd",
					  data: "cpwd="+$("#cpwd").val()+"&npwd="+$("#npwd").val()+"&timestmp="+getUniqueTime(),
					}).done(function( msg ) {
					  //				  	
						//$(".ui-actionsheet-wallpaper").click();
						//$('a[name|="changeCancel"]').trigger('click');
						//alert(msg);
						if ('1'==msg){
							$("#successdiv").show();
							$("#formdiv").hide();							
							$.mobile.hidePageLoadingMsg();
						}else{
							// error control here
							$.mobile.hidePageLoadingMsg();
							$("#mess").html('Current password is not correct.');
							$("#cpwd").attr("style","background: none repeat scroll 0 0 #FFFDE3 !important;");
						};
					});
				}
			});
			
		});
		
		function fileSelected() {
			var file = document.getElementById('fileToUpload').files[0];
			if (file) {
				uploadFile();
			}
		
		}
		
		function uploadFile() {
			var fd = new FormData();
			fd.append("fileToUpload", document.getElementById('fileToUpload').files[0]);
			var xhr = new XMLHttpRequest();
			xhr.upload.addEventListener("progress", uploadProgress, false);
			xhr.addEventListener("load", uploadComplete, false);
			xhr.addEventListener("error", uploadFailed, false);
			xhr.addEventListener("abort", uploadCanceled, false);
			xhr.open("POST", "/telehealth/upload.php");
			xhr.send(fd);
		}
		
		function uploadProgress(evt) {
			if (evt.lengthComputable) {
				var percentComplete = Math.round(evt.loaded * 100 / evt.total);
				document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
			}
			else {
				document.getElementById('progressNumber').innerHTML = 'unable to compute';
			}
		}
		
		function uploadComplete(evt) {
		/* This event is raised when the server send back a response */
			//alert(evt.target.responseText);
			$("#drsign").val(evt.target.responseText);
			$("#signImg").attr('src',evt.target.responseText);
			$("#progressNumber").html("");
		}
		
		function uploadFailed(evt) {
			alert("There was an error attempting to upload the file.");
		}
		
		function uploadCanceled(evt) {
			alert("The upload has been canceled by the user or the browser dropped the connection.");
		}
	</script>
	<div data-mini="true" data-role="header" data-id="foo1" data-theme="b" data-position="fixed">
        <a href="#" data-rel="back" data-direction="reverse" data-role="button"  data-icon="back" data-ajax="false">Back</a>
        <a href="/telehealth" data-icon="home" data-role="button"  data-ajax="false">Home</a>
        <h1>REDiMED TELEHEALTH - Users</h1>
    </div><!-- /header -->
  	<div data-mini="true" data-role="content" >
         <h3><strong> <?php if (array_key_exists('id',$data)): ?>Edit user
                        <?php else:?>Add new user<?php endif;?></strong></h3>
         <form action="index.php/submit" method="post" id="form-form" name="form-form">		  
                <table width="100%">
                    <tr>
                        <td width="49%">
                            <table width="100%">
                                <tr>
                                    <td width="100" align="right">
                                        Name:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="name" id="name" value="<?= ((array_key_exists('detail',$data))?$data['detail']['name']:'');?>" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                        <td></td>
                        <td width="49%">
                            <table width="100%">
                                <tr>
                                    <td width="100" align="right"> Provider no:
                               </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="code" id="code" value="<?= ((array_key_exists('detail',$data))?$data['detail']['code']:"");?>" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <tr>
                        <td width="49%">
                            <table width="100%">
                                <tr>
                                    <td width="100" align="right">
                                        Address:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="address" id="address" value="<?= ((array_key_exists('detail',$data))?$data['detail']['address']:"");?>" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                        <td></td>
                        <td width="49%">
                            <table width="100%">
                                <tr>
                                    <td width="100" align="right">
                                        Phone:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="phone" id="phone" value="<?= ((array_key_exists('detail',$data))?$data['detail']['phone']:"");?>" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                    </tr> 
                    <tr>
                        <td width="49%">
                            <table width="100%">
                                <tr>
                                    <td width="100" align="right">
                                        Email:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="email" id="email" value="<?= ((array_key_exists('detail',$data))?$data['detail']['email']:"");?>" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                        <td></td>
                        <td width="49%">
                        
                        </td>
                    </tr> 
                    <tr>
                        <td width="49%">
                            <table width="100%">
                                <tr>
                                    <td width="100" align="right">
                                        Username:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="username" id="username" value="<?= ((array_key_exists('username',$data))?$data['username']:"");?>" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                        <td></td>
                        <td width="49%">
                        <?php if (array_key_exists('id',$data)): ?>
                        <?php else:?>
                
                            <table width="100%">
                                <tr>
                                    <td width="100" align="right">
                                        Password:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="password" name="password" id="password" value="" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                		<?php endif;?>
                        </td>
                    </tr> 
                    <tr>
                        <td width="49%">
                            <table width="100%">
                                <tr>
                                    <td width="100" align="right">
                                        Signature:
                                   </td>
                                    <td>
                                    	
                                       <div class="row">
                                          <img src="<?= ((array_key_exists('detail',$data))?((array_key_exists('drsign',$data['detail']))?$data['detail']['drsign']:""):"");?>" id="signImg" width="100px"/>
                                          <input type="file" name="fileToUpload" id="fileToUpload" onchange="fileSelected();"/> <div id="progressNumber"></div>
                                        </div>
                                        
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="hidden" name="drsign" id="drsign" value="" data-mini="true" />
                                        </div>
                                        
                                   </td>
                                </tr>
                            </table>
                        </td>
                        <td></td>
                        <td width="49%">
                        </td>
                    </tr> 
                              
                </table>     
      </form>
      <table width="100%">
      	<tr>
            <td align="center">
            	<a href="#" id="changePass" name="list-change" data-role="button" data-sheet='functions' data-inline="true" data-theme="b" data-icon="info" data-iconpos="left">Change password</a>
            	<?php if (array_key_exists('id',$data)): ?>
				<a href="#" id="submit" data-role="button" data-inline="true" data-theme="b" data-icon="check" data-iconpos="left">Update</a>
                <?php else:?>
                <a href="#" id="submit" data-role="button" data-inline="true" data-theme="b" data-icon="check" data-iconpos="left">Add</a>
                <?php endif;?>
            </td>
        </tr>
      </table>
      <div data-role="actionsheet" class="ui-actionsheet-content ui-corner-top ui-corner-bottom" id="functions" data-theme="b">
            <div data-role="content" id="formdiv" data-theme="b" class="ui-corner-top ui-corner-bottom ui-content ui-body-b">
                <h3>Please choose a function.</h3>
                <form action="index.php/submit" method="post" id="cpwd-form" name="cpwd-form" autocomplete="off">	
                <table>
                	<tr>
                        <td >
                            <table width="100%">
                                <tr>
                                    <td width="150" align="right">
                                        Current password:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="password" name="cpwd" id="cpwd" value="" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td >
                            <table width="100%">
                                <tr>
                                    <td width="150" align="right">
                                        New password:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="password" name="npwd" id="npwd" value="" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td >
                            <table width="100%">
                                <tr>
                                    <td width="150" align="right">
                                        Confirm:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="password" name="cnpwd" id="cnpwd" value="" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                    </tr>              
                </table> 
                </form>
                <div id="mess"></div>
                <a href="#" data-role="button" data-rel="static" data-inline="true" name="changepwdbtn" data-icon="check"> Change</a>  
                <a href="#" data-role="button" data-inline="true" name="changeCancel" data-icon="check" >Cancel</a>      
            </div>
            <div data-role="content" id="successdiv" style="display:none" class="ui-corner-top ui-corner-bottom ui-content ui-body-b">
                <h1>Success!</h1>
                <p>Click OK to go back.</p>
                <a href="#" data-role="button" data-inline="true" name="changeCancel" data-icon="check" >OK</a> 
            </div>
        </div>
        </p>	
  </div><!-- /content -->
</div><!-- /page three -->

<div data-role="dialog" id="alert">
    <div data-role="content" data-theme="c">
        <h1>Success!</h1>
        <p>Click OK to go back.</p>
        
        <?php if (array_key_exists('id',$data)): ?>
        <a data-transition="pop" href="settings" data-inline="true" data-role="button" data-icon="back" data-theme="c" data-ajax="false">OK</a>
        <?php else:?>
        <a data-transition="pop" href="settings" data-inline="true" data-role="button" data-icon="back" data-theme="c" data-ajax="false">OK</a>
        <?php endif;?>
        
        
    </div>
</div>