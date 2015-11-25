<!-- Start of third page: #step 3 -->
<div data-mini="true" data-role="page" id="settings">
	<script type="text/javascript">
		$("#settings").bind( "pageinit", function(){
			//alert('done');
			$("#update").click(function() {
				var data = $.toJSON($('#form-form').serializeObject());
				
			  	$.mobile.showPageLoadingMsg();								
				$.ajax({
					type: "POST",
					url: "/telehealth/index.php/settings/update",
					data: "data="+data+"&url=/telehealth/index.php/settings",
				}).done(function( msg ) {
					//alert(msg);
					if ('1'==msg){
						$.mobile.changePage( "/telehealth/index.php/settings/succeed", {
							transition: "flip",
							reverse: false,
							changeHash: false,
							role: 'dialog'
						});
					}else{
						// error control here
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
	</script>
	<div data-mini="true" data-role="header" data-id="foo1" data-theme="b" data-position="fixed">
        <a href="#" data-rel="back" data-direction="reverse" data-role="button"  data-icon="back" data-ajax="false">Back</a>
        <a href="/telehealth" data-icon="home" data-role="button"  data-ajax="false">Home</a>
        <h1>REDiMED TELEHEALTH - Settings</h1>
    </div><!-- /header -->

  <div data-mini="true" data-role="content" >	
         <h3><strong>Settings</strong></h3>
         <form action="index.php/submit" method="post" id="form-form" name="form-form">		  
                <table width="100%">
                    <tr>
                        <td width="49%">
                            <table width="100%">
                                <tr>
                                    <td width="200" align="right">
                                        Company's name:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="name" id="name" value="<?= ((array_key_exists('name',$data))?$data['name']:'');?>" data-mini="true" />
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
                                        Code:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="code" id="code" value="<?= ((array_key_exists('code',$data))?$data['code']:"");?>" data-mini="true" />
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
                                    <td width="200" align="right">
                                        IMA:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="IMA" id="IMA" value="<?= ((array_key_exists('IMA',$data))?$data['IMA']:"");?>" data-mini="true" />
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
                                        Insurer:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="insurer" id="insurer" value="<?= ((array_key_exists('insurer',$data))?$data['insurer']:"");?>" data-mini="true" />
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
                                    <td width="200" align="right">
                                        Address:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="address" id="address" value="<?= ((array_key_exists('address',$data))?$data['address']:"");?>" data-mini="true" />
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
                                          <input type="text" name="phone" id="phone" value="<?= ((array_key_exists('phone',$data))?$data['phone']:"");?>" data-mini="true" />
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
                                    <td width="200" align="right">
                                        Site's name:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="sname" id="sname" value="<?= ((array_key_exists('sname',$data))?$data['sname']:"");?>" data-mini="true" />
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
                                        Site's medic:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="smedic" id="smedic" value="<?= ((array_key_exists('smedic',$data))?$data['smedic']:"");?>" data-mini="true" />
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
                                    <td width="200" align="right">
                                        Medic's contact number:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="smphone" id="smphone" value="<?= ((array_key_exists('smphone',$data))?$data['smphone']:"");?>" data-mini="true" />
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
                                    <td width="200" align="right">
                                        Email:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="email" id="email" value="<?= ((array_key_exists('email',$data))?$data['email']:"");?>" data-mini="true" />
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
                                        Username:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="username" id="username" value="<?= $username;?>" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                    </tr>              
                </table>     
      </form>
      <table width="100%">
      	<tr>
            <td align="center">
				<a href="#" id="changePass" name="list-change" data-role="button" data-sheet='functions' data-inline="true" data-theme="b" data-icon="info" data-iconpos="left">Change password</a>
                <a href="#" id="update" data-role="button" data-inline="true" data-theme="b" data-icon="check" data-iconpos="left">Update</a>
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