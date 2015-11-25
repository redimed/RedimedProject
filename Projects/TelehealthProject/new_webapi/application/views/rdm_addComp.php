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
					url: "/telehealth/index.php/redimed/submitComp",
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
						alert('This username is already taken, please try again. If the problem still exist, please contact webadmin.');
						$.mobile.hidePageLoadingMsg();
					};
				});
			});
		});
	</script>
	<div data-mini="true" data-role="header" data-id="foo1" data-theme="b" data-position="fixed">
        <a href="#" data-rel="back" data-direction="reverse" data-role="button"  data-icon="back" data-ajax="false">Back</a>
        <a href="/telehealth" data-icon="home" data-role="button"  data-ajax="false">Home</a>
        <h1>REDiMED TELEHEALTH - Companies</h1>
    </div><!-- /header -->
  	<div data-mini="true" data-role="content" >	
         <h3><strong>Add new company</strong></h3>
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
                             <table width="100%">
                                <tr>
                                    <td width="100" align="right">
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
                    </tr> 
                    <tr>
                        <td width="49%">
                            <table width="100%">
                                <tr>
                                    <td width="200" align="right">
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
                </table>     
      </form>
      <table width="100%">
      	<tr>
            <td align="center">
            	<?php if (array_key_exists('id',$data)): ?>
				<a href="#" id="submit" data-role="button" data-inline="true" data-theme="b" data-icon="check" data-iconpos="left">Update</a>
                <?php else:?>
                <a href="#" id="submit" data-role="button" data-inline="true" data-theme="b" data-icon="check" data-iconpos="left">Add</a>
                <?php endif;?>
                <a href="#" id="cancel" data-role="button" data-inline="true" data-theme="b" data-rel="back" data-icon="back" data-iconpos="left">Cancel</a>
            </td>
        </tr>
      </table>
        </p>	
  </div><!-- /content -->
</div><!-- /page three -->

<div data-role="dialog" id="alert">
    <div data-role="content" data-theme="c">
        <h1>Success!</h1>
        <p>Click OK to go back.</p>
        
        <?php if (array_key_exists('id',$data)): ?>
        <a data-transition="pop" href="../../redimed/companies" data-inline="true" data-role="button" data-icon="back" data-theme="c" data-ajax="false">OK</a>
        <?php else:?>
        <a data-transition="pop" href="companies" data-inline="true" data-role="button" data-icon="back" data-theme="c" data-ajax="false">OK</a>
        <?php endif;?>
        
        
    </div>
</div>