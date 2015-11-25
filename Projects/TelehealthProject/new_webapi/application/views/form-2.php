<!-- Start of second page: #step 2 -->
<div data-mini="true" data-role="page" id="form-2">
	<script type="text/javascript">
		$("#form-2").bind( "pageinit", function(){
			//$(function(){
				$('#expiry').scroller({
					preset: 'date',
					theme: 'ios',
					display: 'modal',
					mode: 'scroller',
					endYear: (new Date).getFullYear()+20,
					dateOrder: 'Myy'
				});
			
			$("#authen-3").click(function() {
			  	if ($('#authen-3').is(':checked')) {
					$('#trigger').trigger('click');
				}
			});
			$('a[name|="statename"]').click(function() {
				$(".ui-actionsheet-wallpaper").click();
				$('#medictxt').val($('#medicn').val());
				$("#medicname").html($('#medicn').val());
			});	
			$("#backbtn2").click(function() {
			  	$.mobile.showPageLoadingMsg();
				var data = $('#form-form2').serializeObject();
				var olddata = jQuery.parseJSON('<?= $formdata;?>');
				var z = $.toJSON($.extend({},olddata, data));
			  	$.mobile.changePage( "/telehealth/index.php/form/loadPage/1", {
					transition: "slide",
					allowSamePageTransition : true,
					reloadPage: true,
					data :"data=" + z,
					reverse: true,
					changeHash: false,
					type: "post"
				});
			});	
			$("#nextbtn2").click(function() {
			  	$.mobile.showPageLoadingMsg();
				var data = $('#form-form2').serializeObject();
				var olddata = jQuery.parseJSON('<?= $formdata;?>');
				var z = $.toJSON($.extend({},olddata, data));
			  	$.mobile.changePage( "/telehealth/index.php/form/loadPage/3", {
					transition: "slide",
					data :"data=" + z,
					allowSamePageTransition : true,
					reloadPage: true,
					reverse: false,
					changeHash: false,
					type: "post"
				});
			});
		});
		$("#form-2").bind( "pageinit", function(){

		var restorePoints = [];
		var canvas = $( "canvas" );
		var a=false;var b,c="";var d=document.getElementById("can");
		
		var e=d.getContext("2d");e.strokeStyle="red";
		e.lineWidth=2;e.lineCap="round";
		e.fillStyle="#fff";e.fillRect(0,0,d.width,d.height);
		var maxx =0; var maxy=0;var minx = d.width; var miny=d.height;
		$("#bsz").change(function(a){e.lineWidth=this.value; });
		$("#bcl").change(function(a){e.strokeStyle=this.value; window.location.hash = '#';});
			//$("#can").mousedown(function(d){saveRestorePoint();a=true;e.save();b=d.pageX-this.offsetLeft;c=d.pageY-this.offsetTop});

			$(document).click(function(){a=false;});
			
			var isIPhone = (new RegExp( "iPhone", "i" )).test(
				navigator.userAgent
			);
			var isIPad = (new RegExp( "iPad", "i" )).test(
				navigator.userAgent
			);
 			isIPhone = (isIPhone||isIPad);
			//alert(isIPhone);
			var getCanvasLocalCoordinates = function( pageX, pageY ){
				var position = canvas.offset();
				
				return({
					x: (pageX - position.left),
					y: (pageY - position.top)
				});
			};
 
			var getTouchEvent = function( event ){
				return(
					isIPhone ?
						window.event.targetTouches[ 0 ] :
						event
				);
			};
 

			var onTouchStart = function( event ){

				//e.preventDefault();
			
				var touch = getTouchEvent( event );
				var localPosition = getCanvasLocalCoordinates(
					touch.pageX,
					touch.pageY
				);

				saveRestorePoint();
				a=true;
				e.save();
				b=localPosition.x;
				c=localPosition.y;


				if(a==true){
				e.beginPath();
				e.moveTo(localPosition.x,localPosition.y);
				e.lineTo(localPosition.x+1,localPosition.y+1);
				e.stroke();
				e.closePath();
				b=localPosition.x;
				c=localPosition.y;
					minx = Math.min(localPosition.x,minx);
					miny = Math.min(localPosition.y,miny);
					maxx = Math.max(localPosition.x,maxx);
					maxy = Math.max(localPosition.y,maxy);
				}

				lastPenPoint = {
					x: localPosition.x,
					y: localPosition.y
				};
 
				canvas.bind(
					(isIPhone ? "touchmove" : "mousemove"),
					onTouchMove
				);
 
				canvas.bind(
					(isIPhone ? "touchend" : "mouseup"),
					onTouchEnd
				);
			};


			var OnClick = function( event ){
				var touch = getTouchEvent( event );
				var localPosition = getCanvasLocalCoordinates(
					touch.pageX,
					touch.pageY
				);

				lastPenPoint = {
					x: localPosition.x,
					y: localPosition.y
				};

				if(a==true){
				e.beginPath();
				e.moveTo(localPosition.x,localPosition.y);
				e.lineTo(localPosition.x+1,localPosition.y+1);
				e.stroke();
				e.closePath();
				b=localPosition.x;
				c=localPosition.y;
					minx = Math.min(localPosition.x,minx);
					miny = Math.min(localPosition.y,miny);
					maxx = Math.max(localPosition.x,maxx);
					maxy = Math.max(localPosition.y,maxy);
				}
				

			};

 
			var onTouchMove = function( event ){
				var touch = getTouchEvent( event );
				var localPosition = getCanvasLocalCoordinates(
					touch.pageX,
					touch.pageY
				);

				lastPenPoint = {
					x: localPosition.x,
					y: localPosition.y
				};

				if(a==true){
				e.beginPath();
				e.moveTo(localPosition.x,localPosition.y);
				e.lineTo(b,c);
				e.stroke();
				e.closePath();
				b=localPosition.x;
				c=localPosition.y;
					minx = Math.min(localPosition.x,minx);
					miny = Math.min(localPosition.y,miny);
					maxx = Math.max(localPosition.x,maxx);
					maxy = Math.max(localPosition.y,maxy);
				}
				

			};
 
			var onTouchEnd = function( event ){
				canvas.unbind(
					(isIPhone ? "touchmove" : "mousemove")
				);

				canvas.unbind(
					(isIPhone ? "touchend" : "mouseup")
				);
			};
 

			canvas.bind(
				(isIPhone ? "touchstart" : "mousedown"),
				function( event ){
					onTouchStart( event );
					return( false );
				}
			);
			$("#checkbtn").click(function(){
				$("#signImgImg").attr('src',canvasToImage(e, d,minx, miny, maxx,maxy));
				$("#signtxt").val(canvasToImage(e, d,minx, miny, maxx,maxy));
				/*$("#result").html("<img src="+d.toDataURL()+' /><br /><a href="#" id="get" class="minimal" >Download This</a>');
				$("#data").val(d.toDataURL());
				$("#get").click(function(){$("#frm").trigger("submit")})
				*/
				$("#signImg").show();
			});
			$("#clearbtn").click(function(){
				e.fillStyle="#fff";
				e.fillRect(0,0,d.width,d.height);
				e.strokeStyle="red";
				e.fillStyle="red";
				$("#authen-1").attr('checked',false);
				$("#authen-2").attr('checked',false);
				$("#authen-1").checkboxradio("refresh");
				$("#authen-2").checkboxradio("refresh");
				$("#signtxt").val('');
				$("#signImgImg").attr('src',"");
				$("#signImg").hide();
			});
			$("#authen-1").click(function() {
			  	if ($('#authen-1').is(':checked')) {
					$('#sign').trigger('click');
				}else{
					$('#clearbtn').trigger('click');
				}	
			});
		});
		var restorePoints = [];
		function canvasToImage(e, d,minx, miny, maxx,maxy)
		{
			//cache height and width		
			var w = d.width;
			var h = d.height;
		 	// get the image data object
			var image;
			//alert(minx+', '+miny+', '+(maxx-minx)+', '+(maxy-miny));
			image = e.getImageData(minx, miny, maxx-minx, maxy-miny);
			
			var newCanvas = document.createElement("canvas");
			newCanvas.width =  maxx-minx;
			newCanvas.height = maxy-miny;
			
			newCanvas.getContext("2d").putImageData(image, 0, 0);
			
			// Now call save to file with your new canvas
			imageData = newCanvas.toDataURL("image/png");
			//var imageData = d.toDataURL("image/png");
			
		 
			//return the Base64 encoded data url string
			return imageData;
		}
		function saveRestorePoint() {
			var oCanvas = document.getElementById("can");
			var imgSrc = oCanvas.toDataURL("image/png");
			restorePoints.push(imgSrc);
		}
		
		function undoDrawOnCanvas() {
				if (restorePoints.length > 0) {
				var oImg = new Image();
				oImg.onload = function() {
					var canvasContext = document.getElementById("can").getContext("2d");		
					canvasContext.drawImage(oImg, 0, 0);
				}
				oImg.src = restorePoints.pop();
			}
		}	
	</script>
	<div data-mini="true" data-role="header" data-id="foo1" data-theme="b" data-position="fixed">
        <a href="#" data-rel="back" data-direction="reverse" data-role="button"  data-icon="back" data-ajax="false">Back</a>
        <a href="/telehealth" data-icon="home" data-role="button"  data-ajax="false">Home</a>
        <h1>REDiMED TELEHEALTH - Form section 2/3</h1>
    </div><!-- /header -->
  <div data-mini="true" data-role="content" >	
         <h3><strong>Section 2</strong></h3>
         <form action="index.php/submit" method="post" id="form-form2" name="form-form2">
         	<strong> Health insurance details</strong>		  
          		<table width="100%">
                <tr>
                    <td width="50%">
<table width="100%">
                        	<tr>
                            	<td width="280" align="right">
                                    Do you have Private Health Insurance?
                               </td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <select name="PHI" id="PHI" data-mini="true" data-role="slider">
                                            <option value="no" <?= ((array_key_exists('PHI',$data))?(('no'==$data['PHI'])?'selected="selected"':''):"");?>>No</option>
                                            <option value="yes" <?= ((array_key_exists('PHI',$data))?(('yes'==$data['PHI'])?'selected="selected"':''):"");?>>Yes</option>
                                        </select> 
                                    </div>
                               </td>
                            </tr>
                        </table>
                    </td>
                  <td width="50%">
<table width="100%">
                        	<tr>
                            	<td width="280" align="right">
                                    Do you have Hospital Cover?
                               </td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <select name="HC" id="HC" data-mini="true" data-role="slider">
                                            <option value="no" <?= ((array_key_exists('HC',$data))?(('no'==$data['HC'])?'selected="selected"':''):"");?>>No</option>
                                            <option value="yes" <?= ((array_key_exists('HC',$data))?(('yes'==$data['HC'])?'selected="selected"':''):"");?>>Yes</option>
                                        </select> 
                                    </div>
                               </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td width="50%">
                    	<table width="100%">
                        	<tr>
<td width="150px" align="right">
                                    Health Fund:
                               </td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <input type="text" name="healFund" id="healFund" value="<?= ((array_key_exists('healFund',$data))?$data['healFund']:"");?>" data-mini="true" />
                                    </div>
                               </td>
                            </tr>
                        </table>
                    </td>
                    <td width="50%">
                    	<table width="100%">
                        	<tr>
<td width="150px" align="right">
                                    Membership No:
                               </td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <input type="text" name="memno" id="memno" value="<?= ((array_key_exists('memno',$data))?$data['memno']:"");?>" data-mini="true" />
                                    </div>
                               </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td width="50%">
                    	<table width="100%">
                        	<tr>
<td width="150px" align="right">
                                    Medicare No.:
                               </td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <input type="text" name="medicareno" id="medicareno" value="<?= ((array_key_exists('medicareno',$data))?$data['medicareno']:"");?>" data-mini="true" />
                                    </div>
                               </td>
                            </tr>
                        </table>
                    </td>
<td width="50%">
                    	<table width="100%">
                        	<tr>
<td width="150px" align="right">
                                    Position No:
                               </td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <input type="text" name="posno" id="posno" value="<?= ((array_key_exists('posno',$data))?$data['posno']:"");?>" data-mini="true" />
                                    </div>
                               </td>
<td width="150px" align="right">
                                    Expiry:
                               </td>
<td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <input type="text" name="expiry" id="expiry" value="<?= ((array_key_exists('expiry',$data))?$data['expiry']:"");?>" data-mini="true" />
                                    </div>
                               </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td width="50%">
                    	<table width="100%">
                        	<tr>
<td width="150px" align="right">
                                    Veteran Affairs No.:
                               </td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <input type="text" name="vano" id="vano" value="<?= ((array_key_exists('vano',$data))?$data['vano']:"");?>" data-mini="true" />
                                    </div>
                               </td>
                            </tr>
                        </table>
                    </td>
                    <td width="50%">
                    	<table width="100%">
                        	<tr>
<td width="150px" align="right">
                                    Card holder: 
                               </td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <fieldset data-mini="true" data-role="controlgroup" data-type="horizontal">
                                            <input type="radio" name="cholder" id="cholder-1" value="1" <?= ((array_key_exists('cholder',$data))?((1==$data['cholder'])?'checked="checked"':''):'checked="checked"');?> />
                                            <label for="cholder-1">N/A</label>
                                            <input type="radio" name="cholder" id="cholder-2" value="2" <?= ((array_key_exists('cholder',$data))?((2==$data['cholder'])?'checked="checked"':''):'');?>/>
                                            <label for="cholder-2">Gold</label>                                    
                                            <input type="radio" name="cholder" id="cholder-3" value="3" <?= ((array_key_exists('cholder',$data))?((3==$data['cholder'])?'checked="checked"':''):'');?>/>
                                            <label for="cholder-3">White</label>
                                      </fieldset>
                                    </div>
                               </td>
                            </tr>
                        </table>
                    </td>
                </tr>
              </table>    
              <div align="center">
                <p><strong>CONSENT AUTHORISATION</strong>
                <br />Please ensure the following boxes are checked, non-work related consults are bulk billed through Medicare at no charge to the patient.
				<br />Please read the terms and conditions for more information.</p>
 </div>
              
              	<div data-mini="true" data-role="fieldcontain">
         			<fieldset data-mini="true" data-role="controlgroup" >
                       	<label><input type="checkbox" name="authen-1" id="authen-1" <?= ((array_key_exists('authen-1',$data))?(('on'==$data['authen-1'])?'checked="checked"':''):"");?>/>I, <strong><?= $data['fname'].' '.$data['gname'];?></strong> authorise any doctor who treats me (whether named in this certificate or not) to discuss my medical condition, in relation to my claim for workers' compensation and return to work options, with my employer and with their insurer. </label>
                  	
     					<label><input type="checkbox" name="authen-2" id="authen-2"  <?= ((array_key_exists('authen-2',$data))?(('on'==$data['authen-2'])?'checked="checked"':''):"");?>/>If your claim is <u><strong>NOT ACCEPTED</strong></u> by the insurance company, or your accounts are not settled by your employer, you will be liable for any invoices issued during the course of your treatment. If your account is forwarded to the debt collector, you will be liable for all fees associated. </label>
                        <label><input type="checkbox" name="authen-3" id="authen-3"  <?= ((array_key_exists('medictxt',$data))?((''!=$data['medictxt'])?'checked="checked"':''):"");?>/>I, <strong><?= $data['fname'].' '.$data['gname'];?></strong> agree to having <strong><span id="medicname"><?= ((array_key_exists('medictxt',$data))?$data['medictxt']:"medic");?></span></strong> present as a third party during a medical consult with REDiMED  </label>
                  	</fieldset>
                </div>
				<em>Checking boxes confirms that I have read the above statements and that I understand and agree with them. </em>
                <em>*Uncheck and then check third option again to change medic's name. </em>
                <a href="#" data-sheet="signature" name="list-sign" id="sign" style="display:none">Signature</a>
                <div id="signImg" style="display:none">
                	<span>Your signature is: </span>
                	<img src='' id="signImgImg"width="100px"/>
                    <a href="#" id="clearbtn" name="clearbtn" data-role="button" data-mini="true" data-inline="true" data-theme="b" data-icon="delete">Clear</a>                    
                </div>
                  
                <input type="hidden" name="signtxt" id="signtxt" value="<?= ((array_key_exists('signtxt',$data))?$data['signtxt']:"");?>" data-mini="true" />
                <input type="hidden" name="medictxt" id="medictxt" value="<?= ((array_key_exists('medictxt',$data))?$data['medictxt']:"");?>" data-mini="true" />
                <div data-role="actionsheet" class="ui-actionsheet-content ui-corner-top ui-corner-bottom" id="signature" data-theme="b">
                    <div data-role="content" data-theme="b" class="ui-corner-top ui-corner-bottom ui-content ui-body-b">
                    	<h4>Please sign on the pad below and click Done button</h4>
                        <canvas id="can" width="900" height="400" style="border:1px solid #d3d3d3; overflow:hidden; display:block;">Your browser does not support the canvas tag </canvas> 	
                        <a href="#" id="checkbtn" name="checkbtn" data-role="button" data-mini="true" data-inline="true" data-theme="b" data-icon="check" style="margin: 0px; position: absolute; display: block; top: 85px; left: 20px;">Done</a>  
                    </div>
                </div>
                
      </form>
      <table width="100%">
      	<tr>
      		<td width="200px">
		      	<a href="#" id="backbtn2" data-role="button" data-inline="true" data-icon="arrow-l" data-iconpos="left" >Previous</a>
            </td>
            <td></td>
            <td width="200px" align="right">
				<a href="#" id="nextbtn2" name="nextbtn2" data-role="button" data-inline="true" data-theme="b" data-icon="arrow-r" data-iconpos="right">Next</a>
            </td>
        </tr>
      </table>
        </p>	
       <a href="#" id="trigger" name="list-change" data-role="button" data-sheet='functions' style="visibility:hidden">trigger</a>
                <div data-role="actionsheet" class="ui-actionsheet-content ui-corner-top ui-corner-bottom" id="functions" data-theme="b">
                    <div data-role="content" id="formdiv" data-theme="b" class="ui-corner-top ui-corner-bottom ui-content ui-body-b">
                        <h3>Please state medic's name.</h3>
                        <table>
                            <tr>
                                <td >
                                    <table width="100%">
                                        <tr>
                                            <td width="150" align="right">
                                                Name:
                                           </td>
                                            <td>
                                                <div data-mini="true" data-role="fieldcontain">
                                                  <input type="text" name="medicn" id="medicn" value="" data-mini="true" />
                                                </div>
                                           </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>              
                        </table> 
                        <div id="mess"></div>
                        <a href="#" data-role="button" data-rel="static" data-inline="true" name="statename" data-icon="check"> Confirm</a>  
                        <a href="#" data-role="button" data-inline="true" name="changeCancel" data-icon="check" >Cancel</a>      
                    </div>
                </div> 
  </div><!-- /content -->
</div><!-- /page two -->

