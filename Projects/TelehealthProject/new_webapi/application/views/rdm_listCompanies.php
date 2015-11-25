<div data-role="page" id="list">
	<script type="text/javascript">
		$("#list").bind( "pageinit", function(){
			//alert('done');
			$.mobile.ajaxEnabled = false;
			$('a[name|="delete"]').click(function() {							
			  	$.mobile.showPageLoadingMsg();								
				$.ajax({
				  type: "POST",
				  url: "/telehealth/index.php/redimed/deleteComp/"+$(this).attr('id'),
				}).done(function( msg ) {
				  //				  	
					$(".ui-actionsheet-wallpaper").click();
					if ('1'==msg){
						$.mobile.changePage( "#alert", {
							transition: "fade",
							reverse: true,
							changeHash: false,
							role: 'dialog'
						});
						$.mobile.hidePageLoadingMsg();
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
				$('input[name|="npwd"]').attr("style","");
				$('input[name|="cnpwd"]').attr("style","");
				$('input[name|="mess"]').html('');
			})
			
			function checkInput(id){
				var valid = true;
				if (''==$("#npwd-"+id).val()){
					valid = false;
					$("#npwd-"+id).attr("style","background: none repeat scroll 0 0 #FFFDE3 !important;");
					$("#mess-"+id).html('Please fill in passwords.');
				}
				if (''==$("#cnpwd-"+id).val()){
					valid = false;
					$("#cnpwd-"+id).attr("style","background: none repeat scroll 0 0 #FFFDE3 !important;");
					$("#mess-"+id).html('Please fill in passwords.');
				}
				if ($("#cnpwd-"+id).val()!=$("#npwd-"+id).val()){
					valid = false;
					$("#npwd-"+id).attr("style","background: none repeat scroll 0 0 #FFFDE3 !important;");
					$("#cnpwd-"+id).attr("style","background: none repeat scroll 0 0 #FFFDE3 !important;");
					$("#mess-"+id).html('Confirm password does not match.');
				}
				return valid;
			}
			
			function getUniqueTime() {
			  var time = new Date().getTime();
			  while (time == new Date().getTime());
			  return new Date().getTime();
			}
			$('a[name|="changeCancel"]').click(function() {	
				$("#successdiv-"+id).hide();
				$("#formdiv-"+id).show();
				$("#npwd-"+id).val('');
				$("#cnpwd-"+id).val('');
			});
			
			$('a[name|="changepwdbtn"]').click(function() {		
				//alert(checkInput());
				id = $(this).attr('id');
				//alert("id="+id+"&cpwd="+$("#cpwd-"+id).val()+"&npwd="+$("#npwd-"+id).val()+"&timestmp="+getUniqueTime());
				if (checkInput(id)){										
					$.mobile.showPageLoadingMsg();			
					
					$.ajax({
					  type: "POST",
					  url: "/telehealth/index.php/redimed/changePwd",
					  data: "id="+id+"&npwd="+$("#npwd-"+id).val()+"&timestmp="+getUniqueTime(),
					}).done(function( msg ) {
					  //				  	
						//$(".ui-actionsheet-wallpaper").click();
						//$('a[name|="changeCancel"]').trigger('click');
						//alert(msg);
						if ('1'==msg){
							$("#successdiv-"+id).show();
							$("#formdiv-"+id).hide();							
							$.mobile.hidePageLoadingMsg();
						}else{
							// error control here
							$.mobile.hidePageLoadingMsg();
							$("#mess-"+id).html('Current password is not correct.');
						};
					});
				}
			});
		});
	</script>
    <style>
		.old{
			background:rgba(243, 243, 243, 0.85) !important;
		}
		
		.new{
			background:rgba(255, 255, 255, 0.9) !important;
		}
	</style>
	<div data-mini="true" data-role="header" data-id="foo1" data-theme="b" data-position="fixed">
        <a href="#" data-rel="back" data-direction="reverse" data-role="button"  data-icon="back" data-ajax="false">Back</a>
        <a href="/telehealth" data-icon="home" data-role="button"  data-ajax="false">Home</a>
        <h1>REDiMED TELEHEALTH - Companies</h1>
    </div><!-- /header -->
    
	<div data-role="content">	
		<a href="/telehealth/index.php/redimed/addCompany" data-role="button" id="addComp" data-icon="plus" data-inline="true">Add Company</a>
		<p>
        	<ul data-role="listview" data-inset="true" data-filter="true">
            	<?php foreach($data as $key => $entry) : ?>	
                	<?php if (99999!=($entry['id'])): ?>
                            <li data-theme="d">                            		
                                <a href="#" data-sheet='functions' name="list-<?= $entry['id'];?>" id="<?= $entry['id'];?>">
                                	<?= $entry['name'];?>
                                </a>  
                            </li>
                            <div data-role="actionsheet" class="ui-actionsheet-content ui-corner-top ui-corner-bottom" id="functions" data-theme="b">
                                <div data-role="content" data-theme="b" class="ui-corner-top ui-corner-bottom ui-content ui-body-b">
                                    <h3>Please choose a function for <?= $entry['name']." ".$entry['name'];?>.</h3>                            
                                    <!--<a href="detail/<?= $entry['id'];?>" data-role="button" data-icon="search">View</a>-->	
                                    <a href="editCompany/<?= $entry['id'];?>" data-role="button" data-icon="info" >Edit</a>
                                    <a href="#" data-role="button" data-sheet='change' name="list-cpwd<?= $entry['memid'];?>" id="<?= $entry['id'];?>"> Change password</a>
                                    <a href="#" data-role="button" name="delete-<?= $entry['id'];?>" data-icon="delete" id="<?= $entry['id'];?>">Delete</a>      
                                </div>
                            </div>
                            <div data-role="actionsheet" class="ui-actionsheet-content ui-corner-top ui-corner-bottom" id="change" data-theme="b">
                                <div data-role="content" id="formdiv-<?= $entry['memid'];?>" data-theme="b" class="ui-corner-top ui-corner-bottom ui-content ui-body-b">
                                    <h3>Please choose a function.</h3>
                                    <form action="index.php/submit" method="post" id="cpwd-form-<?= $entry['memid'];?>" name="cpwd-form-<?= $entry['memid'];?>" autocomplete="off">	
                                    <table>
                                        <tr>
                                            <td >
                                                <table width="100%">
                                                    <tr>
                                                        <td width="150" align="right">
                                                            New password:
                                                       </td>
                                                        <td>
                                                            <div data-mini="true" data-role="fieldcontain">
                                                              <input type="password" name="npwd-<?= $entry['memid'];?>" id="npwd-<?= $entry['memid'];?>" value="" data-mini="true" />
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
                                                              <input type="password" name="cnpwd-<?= $entry['memid'];?>" id="cnpwd-<?= $entry['memid'];?>" value="" data-mini="true" />
                                                            </div>
                                                       </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>              
                                    </table> 
                                    </form>
                                    <div id="mess-<?= $entry['memid'];?>"></div>
                                    <a href="#" data-role="button" data-rel="static" data-inline="true" name="changepwdbtn-<?= $entry['memid'];?>" id="<?= $entry['memid'];?>" data-icon="check"> Change</a>  
                                    <a href="#" data-role="button" data-inline="true" name="changeCancel" data-icon="check" >Cancel</a>      
                                </div>
                                <div data-role="content" id="successdiv-<?= $entry['memid'];?>"  style="display:none" class="ui-corner-top ui-corner-bottom ui-content ui-body-b">
                                    <h1>Success!</h1>
                                    <p>Click OK to go back.</p>
                                    <a href="#" data-role="button" data-inline="true" name="changeCancel" data-icon="check" >OK</a> 
                                </div>
                            </div>
					<?php endif; ?>        
                <?php endforeach; ?>
            </ul>
        </p>	
        
	</div><!-- /content -->
</div><!-- /page two -->

<div data-role="dialog" id="alert">
    <div data-role="content" data-theme="c">
        <h1>Success!</h1>
        <p>Click OK to go back.</p>
        <a data-transition="pop" href="companies" data-inline="true" data-role="button" data-icon="back" data-theme="c" data-ajax="false">OK</a>
    </div>
</div>