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
        <h1>REDiMED TELEHEALTH - Doctors</h1>
    </div><!-- /header -->
  	<div data-mini="true" data-role="content" >
         <h3><strong> <?php if (array_key_exists('id',$data)): ?>Edit doctor
                        <?php else:?>Add new doctor<?php endif;?></strong></h3>
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
        <a data-transition="pop" href="../../redimed/users" data-inline="true" data-role="button" data-icon="back" data-theme="c" data-ajax="false">OK</a>
        <?php else:?>
        <a data-transition="pop" href="users" data-inline="true" data-role="button" data-icon="back" data-theme="c" data-ajax="false">OK</a>
        <?php endif;?>
        
        
    </div>
</div>