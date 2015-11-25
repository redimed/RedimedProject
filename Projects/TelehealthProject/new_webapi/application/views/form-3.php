<!-- Start of third page: #step 3 -->
<div data-mini="true" data-role="page" id="form-3">
	<script type="text/javascript">
		$("#form-3").bind( "pageinit", function(){
			//$(function(){
			var obj = $.mobile.path.parseUrl(window.location.href);
			var path = obj.pathname;
			var paths = path.split('/');
			//alert(paths[4]);
			var id = obj.filename;
			
			$('#adate').scroller({
				preset: 'date',
				theme: 'ios',
				display: 'modal',
				mode: 'scroller',
				endYear: (new Date).getFullYear()+20,
				dateOrder: 'MMddyy'
			});
				
			
			$("#backbtn3").click(function() {
			  	$.mobile.showPageLoadingMsg();
				var data = $('#form-form3').serializeObject();
				var olddata = jQuery.parseJSON('<?= $formdata;?>');
				var z = $.toJSON($.extend({},olddata, data));
			  	$.mobile.changePage( "/telehealth/index.php/form/loadPage/2/0", {
					transition: "slide",
					data :"data=" + z,
					allowSamePageTransition : true,
					reloadPage: true,
					reverse: true,
					changeHash: false,
					type: "post"
				});
			});	
			$("#nextbtn3").click(function() {
			  	$.mobile.showPageLoadingMsg();
				var data = $('#form-form3').serializeObject();
							
				var olddata = jQuery.parseJSON('<?= $formdata;?>');
				var z = $.toJSON($.extend({},olddata, data));
				if ('edit'==paths[4])
					var extra = "&type=edit&id="+id;
				else
					var extra = "&type=add";
			  	$.mobile.showPageLoadingMsg();								
				$.ajax({
				  type: "POST",
				  url: "/telehealth/index.php/form/submit",
				  data: "data="+z+extra+"&url=/telehealth/index.php/results",
				}).done(function( msg ) {
				  //
				  	
					if ('1'==msg){
						$.mobile.changePage( "/telehealth/index.php/form/succeed", {
							data: "url=/telehealth/index.php/results",
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
			if ($('#itype-1').is(':checked')) {
				$('#s1').hide();
				$('#s2').hide();
				$('#s3').hide();
				$('#s4').show();
			}else{
				$('#s1').show();
				$('#s2').show();
				$('#s3').show();
				$('#s4').hide();
			}
			// general illness - hide:  1, 2, 3. show: 4
			$('#itype-1').click(function() {
				if ($(this).is(':checked')) {
					$('#s1').hide();
					$('#s2').hide();
					$('#s3').hide();
					$('#s4').show();
					$('#s7').show();
				}
			});
			// injury
			$('#itype-2').click(function() {
				if ($(this).is(':checked')) {
					$('#s1').show();
					$('#s2').show();
					$('#s3').show();
					$('#s4').hide();
					$('#s7').hide();
				}
			});
			
			if ($('#myn-1').is(':checked')) {
				$('#medications').show();
			}else{
				$('#medications').hide();
				$('#medications').val('');
			}
			
			if ($('#ayn-1').is(':checked')) {
				$('#allergies').show();
			}else{
				$('#allergies').hide();
				$('#allergies').val('');
			}
			$('#ayn-1').click(function() {
				if ($(this).is(':checked')) {
					$('#allergies').show();
				}
			});
			$('#ayn-2').click(function() {
				if ($(this).is(':checked')) {
					$('#allergies').hide();
					$('#allergies').val('');
				}
			});
			$('#myn-1').click(function() {
				if ($(this).is(':checked')) {
					$('#medications').show();
				}
			});
			$('#myn-2').click(function() {
				if ($(this).is(':checked')) {
					$('#medications').hide();
					$('#medications').val('');
				}
			});
		});
	</script>
	<div data-mini="true" data-role="header" data-id="foo1" data-theme="b" data-position="fixed">
        <a href="#" data-rel="back" data-direction="reverse" data-role="button"  data-icon="back" data-ajax="false">Back</a>
        <a href="/telehealth" data-icon="home" data-role="button"  data-ajax="false">Home</a>
        <h1>REDiMED TELEHEALTH - Form section 3/3</h1>
    </div><!-- /header -->

  <div data-mini="true" data-role="content" >	
         <h3><strong>Section 3</strong></h3>
         <form action="index.php/submit" method="post" id="form-form3" name="form-form3">
         <table width="100%">
                <tr>
                	<td colspan="2" align="center">
                        <div data-mini="true" data-role="fieldcontain" style="margin:auto;width:240px;">
                            <fieldset data-mini="true" data-role="controlgroup" data-type="horizontal">
                                    <input type="radio" name="itype" id="itype-1" value="1" <?= ((array_key_exists('itype',$data))?((1==$data['itype'])?'checked="checked"':''):'checked="checked"');?>/>
                                    <label for="itype-1">General illness</label>
                        
                                    <input type="radio" name="itype" id="itype-2" value="2" <?= ((array_key_exists('itype',$data))?((2==$data['itype'])?'checked="checked"':''):"");?>/>
                                        <label for="itype-2">Injury</label>
                              </fieldset>
                        </div>
                    </td>
                </tr>
          </table>
         	<strong>INJURY DETAILS:</strong>		  
                <table width="100%">
                    <tr>
                        <td width="49%">
                            <table width="100%">
                                <tr>
                                    <td width="300" align="right">
                                        Date of Accident / Onset of Symptoms:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="adate" id="adate" value="<?= ((array_key_exists('adate',$data))?$data['adate']:"");?>" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                        <td></td>
                        <td width="49%">
                        	<div id="s1">
                                <table width="100%">
                                    <tr>
                                        <td width="330" align="right">
                                            Workplace location where incident occurred?
                                       </td>
                                        <td>
                                            <div data-mini="true" data-role="fieldcontain">
                                              <input type="text" name="alocation" id="alocation" value="<?= ((array_key_exists('alocation',$data))?$data['alocation']:"");?>" data-mini="true" />
                                            </div>
                                       </td>
                                    </tr>
                                </table>
                            </div>
                            <div  id="s7">
                            	<table width="100%">
                                    <tr>
                                        <td width="270px" align="right">
                                            Have you had these symptoms before?
                                       </td>
                                        <td align="left">
                                       <div data-mini="true" data-role="fieldcontain">
                                        <select name="hasbe4" id="hasbe4" data-mini="true" data-role="slider">
                                            <option value="no" <?= ((array_key_exists('hasbe4',$data))?(('no'==$data['hasbe4'])?'selected="selected"':''):"");?>>No</option>
                                            <option value="yes" <?= ((array_key_exists('hasbe4',$data))?(('yes'==$data['hasbe4'])?'selected="selected"':''):"");?>>Yes</option>
                                        </select> 
                                    </div>
                                        
                                   		</td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
				</table>
                <div id="s2">
                    <table width="100%">                    
                        <tr>
                            <td colspan="3">
                                <table width="100%">
                                    <tr>
                                        <td width="420" align="right">
                                            What actually happened and what caused the occurrence?
                                       </td>
                                        <td>
                                            <div data-mini="true" data-role="fieldcontain">
                                              <input type="text" name="reason" id="reason" value="<?= ((array_key_exists('reason',$data))?$data['reason']:"");?>" data-mini="true" />
                                            </div>
                                       </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                        	
                            <td colspan="1">
                                <table width="100%">
                                    <tr>
                                        <td width="150" align="right">
                                            Describe the injury:
                                       </td>
                                        <td width="310">
                                           <div data-mini="true" data-role="fieldcontain">
                                                <fieldset data-mini="true" data-role="controlgroup" data-type="horizontal" >
                                                    <label><input type="checkbox" name="injdesc-1" <?= ((array_key_exists('injdesc-1',$data))?(('on'==$data['injdesc-1'])?'checked="checked"':''):"");?>/> Sprain/Strain </label>
                                                   <label><input type="checkbox" name="injdesc-2" <?= ((array_key_exists('injdesc-2',$data))?(('on'==$data['injdesc-2'])?'checked="checked"':''):"");?>/> Laceration </label>
                                                   <label><input type="checkbox" name="injdesc-3" <?= ((array_key_exists('injdesc-3',$data))?(('on'==$data['injdesc-3'])?'checked="checked"':''):"");?>/> Crush </label>
                                                   <label><input type="checkbox" name="injdesc-4" <?= ((array_key_exists('injdesc-4',$data))?(('on'==$data['injdesc-4'])?'checked="checked"':''):"");?>/> Fall </label>
                                                   
                                                </fieldset>
                                             
                                            </div>
                                       </td>
                                       <td>
                                            <div data-mini="true" data-role="fieldcontain">
                                              <input type="text" name="injdesctxt" id="injdesctxt" value="<?= ((array_key_exists('injdesctxt',$data))?$data['injdesctxt']:"");?>" data-mini="true" placeholder="Other..." />
                                            </div>
                                       </td>
                                    </tr>
                                </table>
                            </td>
                            <td></td>
                            <td colspan="1" width="36%">
                                <table width="100%">
                                    <tr>
                                        <td  width="2700px" align="right">
                                            Have you had these symptoms before?
                                       </td>
                                        <td width="70px" align="left">
                                       <div data-mini="true" data-role="fieldcontain">
                                        <select name="hasbe4" id="hasbe4" data-mini="true" data-role="slider">
                                            <option value="no" <?= ((array_key_exists('hasbe4',$data))?(('no'==$data['hasbe4'])?'selected="selected"':''):"");?>>No</option>
                                            <option value="yes" <?= ((array_key_exists('hasbe4',$data))?(('yes'==$data['hasbe4'])?'selected="selected"':''):"");?>>Yes</option>
                                        </select> 
                                    </div>
                                        
                                   		</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <table width="100%">
                                    <tr>
                                        <td width="150" align="right" valign="top">
                                            Which body part/s is/are affected?
                                       </td>
                                        <td>
                                           <div data-mini="true" data-role="fieldcontain">
                                                <fieldset data-mini="true" data-role="controlgroup">
                                                   <label><input type="checkbox" name="bdypart-1" <?= ((array_key_exists('bdypart-1',$data))?(('on'==$data['bdypart-1'])?'checked="checked"':''):"");?>/> Left lower leg </label>
                                                   <label><input type="checkbox" name="bdypart-2" <?= ((array_key_exists('bdypart-2',$data))?(('on'==$data['bdypart-2'])?'checked="checked"':''):"");?>/> Right lower leg </label>
                                                   <label><input type="checkbox" name="bdypart-3" <?= ((array_key_exists('bdypart-3',$data))?(('on'==$data['bdypart-3'])?'checked="checked"':''):"");?>/> Left upper leg </label>
                                                   <label><input type="checkbox" name="bdypart-4" <?= ((array_key_exists('bdypart-4',$data))?(('on'==$data['bdypart-4'])?'checked="checked"':''):"");?>/> Right upper leg </label>
                                                </fieldset>
                                          </div>
                                       </td>
                                       <td>
                                           <div data-mini="true" data-role="fieldcontain">
                                                <fieldset data-mini="true" data-role="controlgroup">
                                                   <label><input type="checkbox" name="bdypart-5" <?= ((array_key_exists('bdypart-5',$data))?(('on'==$data['bdypart-5'])?'checked="checked"':''):"");?>/> Left lower arm </label>
                                                   <label><input type="checkbox" name="bdypart-6" <?= ((array_key_exists('bdypart-6',$data))?(('on'==$data['bdypart-6'])?'checked="checked"':''):"");?>/> Right lower arm </label>
                                                   <label><input type="checkbox" name="bdypart-7" <?= ((array_key_exists('bdypart-7',$data))?(('on'==$data['bdypart-7'])?'checked="checked"':''):"");?>/> Left upper arm </label>
                                                   <label><input type="checkbox" name="bdypart-8" <?= ((array_key_exists('bdypart-8',$data))?(('on'==$data['bdypart-8'])?'checked="checked"':''):"");?>/> Right upper arm </label>
                                                </fieldset>
                                          </div>
                                       </td>
                                       <td>
                                           <div data-mini="true" data-role="fieldcontain">
                                                <fieldset data-mini="true" data-role="controlgroup">
                                                   <label><input type="checkbox" name="bdypart-9" <?= ((array_key_exists('bdypart-9',$data))?(('on'==$data['bdypart-9'])?'checked="checked"':''):"");?>/> Left hand </label>
                                                   <label><input type="checkbox" name="bdypart-10" <?= ((array_key_exists('bdypart-10',$data))?(('on'==$data['bdypart-10'])?'checked="checked"':''):"");?>/> Right hand </label>
                                                   <label><input type="checkbox" name="bdypart-11" <?= ((array_key_exists('bdypart-11',$data))?(('on'==$data['bdypart-11'])?'checked="checked"':''):"");?>/> Left shoulder </label>
                                                   <label><input type="checkbox" name="bdypart-12" <?= ((array_key_exists('bdypart-12',$data))?(('on'==$data['bdypart-12'])?'checked="checked"':''):"");?>/> Right shoulder </label>
                                                </fieldset>
                                           </div>
                                       </td>
                                       <td valign="top">
                                           <div data-mini="true" data-role="fieldcontain">
                                                <fieldset data-mini="true" data-role="controlgroup">
                                                   <label><input type="checkbox" name="bdypart-13" <?= ((array_key_exists('bdypart-13',$data))?(('on'==$data['bdypart-13'])?'checked="checked"':''):"");?>/> Abdomen </label>
                                                   <label><input type="checkbox" name="bdypart-14" <?= ((array_key_exists('bdypart-14',$data))?(('on'==$data['bdypart-14'])?'checked="checked"':''):"");?>/> Chest </label>
                                                   <label><input type="checkbox" name="bdypart-15" <?= ((array_key_exists('bdypart-15',$data))?(('on'==$data['bdypart-15'])?'checked="checked"':''):"");?>/> Lower back </label>
                                                </fieldset>
                                                <input type="text" name="bdyparttxt" id="bdyparttxt" value="<?= ((array_key_exists('bdyparttxt',$data))?$data['bdyparttxt']:"");?>" data-mini="true" style="margin-left:0px;" placeholder="Other..."/>
                                          </div>
                                       </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>                
                    </table>  
				</div>
				<strong>MEDICAL HISTORY:</strong>		  
                <table width="100%">
                    <tr>
                        <td colspan="3">
                            <table width="100%">
                                <tr>
                                    <td>
                                       <div data-mini="true" data-role="fieldcontain">
                                            <fieldset data-mini="true" data-role="controlgroup" data-type="horizontal" >
                                               <label><input type="checkbox" name="mhistory-1" <?= ((array_key_exists('mhistory-1',$data))?(('on'==$data['mhistory-1'])?'checked="checked"':''):"");?>/> Asthma </label>
                                               <label><input type="checkbox" name="mhistory-2" <?= ((array_key_exists('mhistory-2',$data))?(('on'==$data['mhistory-2'])?'checked="checked"':''):"");?>/> Epilepsy </label>
                                               <label><input type="checkbox" name="mhistory-3" <?= ((array_key_exists('mhistory-3',$data))?(('on'==$data['mhistory-3'])?'checked="checked"':''):"");?>/> Heart Condition </label>
                                               <label><input type="checkbox" name="mhistory-4" <?= ((array_key_exists('mhistory-4',$data))?(('on'==$data['mhistory-4'])?'checked="checked"':''):"");?>/> High Cholesterol </label>
                                               <label><input type="checkbox" name="mhistory-5" <?= ((array_key_exists('mhistory-5',$data))?(('on'==$data['mhistory-5'])?'checked="checked"':''):"");?>/> Diabetes type I </label>
                                               <label><input type="checkbox" name="mhistory-6" <?= ((array_key_exists('mhistory-6',$data))?(('on'==$data['mhistory-6'])?'checked="checked"':''):"");?>/> Diabetes type II </label>
                                               <label><input type="checkbox" name="mhistory-7" <?= ((array_key_exists('mhistory-7',$data))?(('on'==$data['mhistory-7'])?'checked="checked"':''):"");?>/> High blood pressure </label>
                                               <label><input type="checkbox" name="mhistory-8" <?= ((array_key_exists('mhistory-8',$data))?(('on'==$data['mhistory-8'])?'checked="checked"':''):"");?>/> Arthritis </label>
                                               <label><input type="checkbox" name="mhistory-9" <?= ((array_key_exists('mhistory-9',$data))?(('on'==$data['mhistory-9'])?'checked="checked"':''):"");?>/> Blood Condition </label>                                               
                                            </fieldset>
                                         	<input type="text" name="mhistorytxt" id="mhistorytxt" value="<?= ((array_key_exists('mhistorytxt',$data))?$data['mhistorytxt']:"");?>" data-mini="true" style="margin-left:0px;" placeholder="Other..."/>
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <table width="100%">
                                <tr>
                                    <td width="100" align="right">
                                        Medications:
                                   </td>
                                    <td>
                                    	
                                       <div data-mini="true" data-role="fieldcontain" style="display:inline-block !important; width:100px; top:12px;">
                                            <fieldset data-mini="true" data-role="controlgroup" data-type="horizontal">
                                                    <input type="radio" name="myn" id="myn-1" value="1" <?= ((array_key_exists('medications',$data))?((''!=$data['medications'])?'checked="checked"':''):'');?>/>
                                                    <label for="myn-1">Yes</label>
                                        
                                                    <input type="radio" name="myn" id="myn-2" value="2" <?= ((array_key_exists('medications',$data))?((''==$data['medications'])?'checked="checked"':''):'checked="checked"');?>/>
                                                        <label for="myn-2">No</label>
                                              </fieldset>
                                        </div>
                                         <div data-mini="true" data-role="fieldcontain" style="display:inline-block !important;width:70%; top:-6px;">
                                          <input type="text" name="medications" id="medications" value="<?= ((array_key_exists('medications',$data))?$data['medications']:'');?>" placeholder="please state" data-mini="true" />
                                        </div>
                                   </td>
                                   <td width="100" align="right">
                                        Allergies:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain" style="display:inline-block !important; width:100px; top:12px;">
                                            <fieldset data-mini="true" data-role="controlgroup" data-type="horizontal">
                                                    <input type="radio" name="ayn" id="ayn-1" value="1" <?= ((array_key_exists('allergies',$data))?((''!=$data['allergies'])?'checked="checked"':''):'');?>/>
                                                    <label for="ayn-1">Yes</label>
                                        
                                                    <input type="radio" name="ayn" id="ayn-2" value="2" <?= ((array_key_exists('allergies',$data))?((''==$data['allergies'])?'checked="checked"':''):'checked="checked"');?>/>
                                                        <label for="ayn-2">No</label>
                                              </fieldset>
                                        </div>
                                         <div data-mini="true" data-role="fieldcontain" style="display:inline-block !important;width:70%; top:-6px;">
                                          <input type="text" name="allergies" id="allergies" value="<?= ((array_key_exists('allergies',$data))?$data['allergies']:'');?>"  placeholder="please state" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table> 
                <div id="s3">
         		<strong>Injury Symptoms:</strong>		  
                    <table width="100%">
                        <tr>
                            <td width="450px">
                               <div data-mini="true" data-role="fieldcontain">
                                    <fieldset data-mini="true" data-role="controlgroup" data-type="horizontal" >
                                        <label><input type="checkbox" name="symptoms-1" <?= ((array_key_exists('symptoms-1',$data))?(('on'==$data['symptoms-1'])?'checked="checked"':''):"");?>/> Open wound </label>
                                       <label><input type="checkbox" name="symptoms-2" <?= ((array_key_exists('symptoms-2',$data))?(('on'==$data['symptoms-2'])?'checked="checked"':''):"");?>/> Swelling </label>
                                       <label><input type="checkbox" name="symptoms-3" <?= ((array_key_exists('symptoms-3',$data))?(('on'==$data['symptoms-3'])?'checked="checked"':''):"");?>/> Redness </label>
                                       <label><input type="checkbox" name="symptoms-4" <?= ((array_key_exists('symptoms-4',$data))?(('on'==$data['symptoms-4'])?'checked="checked"':''):"");?>/> Reduced movement </label>
                                    </fieldset>
                                </div>
                            </td>
                            <td width="200px" style="padding-bottom:0.4em">Pain: (1 - least; 10 - most)</td>
                            <td>
                               <div data-mini="true" data-role="fieldcontain">
                                  <fieldset data-mini="true" data-mini="true" data-role="controlgroup">
                                    <input type="number" data-type="range" data-highlight="true" max="10" min="1" value="<?= ((array_key_exists('slider',$data))?$data['slider']:5);?>" id="slider" name="slider" >
                                  </fieldset>
                                </div>
                            </td>
                        </tr>    
                        <tr>
                            <td colspan="3">
                                <table width="100%">
                                    <tr>
                                        <td width="50" align="right">
                                            Other:
                                       </td>
                                        <td>
                                            <div data-mini="true" data-role="fieldcontain">
                                              <input type="text" name="injuretxt" id="injuretxt" value="<?= ((array_key_exists('injuretxt',$data))?$data['injuretxt']:"");?>" data-mini="true" style="margin-left:0px;" placeholder="Other..."/>
                                            </div>
                                       </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>       
                    </table>  
                </div>
                <div id="s4">
                    <strong>SYMPTOMS:</strong>		  
                    <table width="100%">
                        <tr>
                            <td colspan="3">
                                <table width="100%">
                                    <tr>
                                        <td width="23%">
                                           <div data-mini="true" data-role="fieldcontain">
                                                <fieldset data-mini="true" data-role="controlgroup" >
                                                   <label><input type="checkbox" name="gillness-1" <?= ((array_key_exists('gillness-1',$data))?(('on'==$data['gillness-1'])?'checked="checked"':''):"");?>/> Headache  </label>
                                                   <label><input type="checkbox" name="gillness-2" <?= ((array_key_exists('gillness-2',$data))?(('on'==$data['gillness-2'])?'checked="checked"':''):"");?>/> Nausea </label>
                                                   <label><input type="checkbox" name="gillness-3" <?= ((array_key_exists('gillness-3',$data))?(('on'==$data['gillness-3'])?'checked="checked"':''):"");?>/> Fatigue </label>
                                                   <label><input type="checkbox" name="gillness-4" <?= ((array_key_exists('gillness-4',$data))?(('on'==$data['gillness-4'])?'checked="checked"':''):"");?>/> Fever </label>
                                                   <label><input type="checkbox" name="gillness-5" <?= ((array_key_exists('gillness-5',$data))?(('on'==$data['gillness-5'])?'checked="checked"':''):"");?>/> Sore throat </label>                                             
                                                </fieldset>
                                            </div>
                                       </td>
                                       <td></td>
                                       <td width="23%">
                                           <div data-mini="true" data-role="fieldcontain">
                                                <fieldset data-mini="true" data-role="controlgroup" >
                                                   <label><input type="checkbox" name="gillness-6" <?= ((array_key_exists('gillness-6',$data))?(('on'==$data['gillness-6'])?'checked="checked"':''):"");?>/> Cough </label> 
                                                   <label><input type="checkbox" name="gillness-7" <?= ((array_key_exists('gillness-7',$data))?(('on'==$data['gillness-7'])?'checked="checked"':''):"");?>/> Sinus congestion </label>
                                                   <label><input type="checkbox" name="gillness-8" <?= ((array_key_exists('gillness-8',$data))?(('on'==$data['gillness-8'])?'checked="checked"':''):"");?>/> Body aches </label>
                                                   <label><input type="checkbox" name="gillness-9" <?= ((array_key_exists('gillness-9',$data))?(('on'==$data['gillness-9'])?'checked="checked"':''):"");?>/> Vomiting </label> 
                                                   <label><input type="checkbox" name="gillness-10" <?= ((array_key_exists('gillness-10',$data))?(('on'==$data['gillness-10'])?'checked="checked"':''):"");?>/> Light headedness </label>                                             
                                                </fieldset>
                                                
                                            </div>
                                       </td>
                                       <td></td>
                                       <td width="23%">
                                           <div data-mini="true" data-role="fieldcontain">
                                                <fieldset data-mini="true" data-role="controlgroup" >
                                                   <label><input type="checkbox" name="gillness-11" <?= ((array_key_exists('gillness-11',$data))?(('on'==$data['gillness-11'])?'checked="checked"':''):"");?>/> Diarrhea </label>
                                                   <label><input type="checkbox" name="gillness-12" <?= ((array_key_exists('gillness-12',$data))?(('on'==$data['gillness-12'])?'checked="checked"':''):"");?>/> Shortness of breath  </label> 
                                                   <label><input type="checkbox" name="gillness-13" <?= ((array_key_exists('gillness-13',$data))?(('on'==$data['gillness-13'])?'checked="checked"':''):"");?>/> Chest pain </label>
                                                   <label><input type="checkbox" name="gillness-14" <?= ((array_key_exists('gillness-14',$data))?(('on'==$data['gillness-14'])?'checked="checked"':''):"");?>/> Abdomen pain </label>
                                                   <label><input type="checkbox" name="gillness-20" <?= ((array_key_exists('gillness-20',$data))?(('on'==$data['gillness-20'])?'checked="checked"':''):"");?>/> Back pain </label>                                             
                                                </fieldset>
                                                
                                            </div>
                                       </td>
                                       <td></td>
    
                                       <td width="23%" valign="top">
                                           <div data-mini="true" data-role="fieldcontain">
                                                <fieldset data-mini="true" data-role="controlgroup" >
                                                <label><input type="checkbox" name="gillness-15" <?= ((array_key_exists('gillness-15',$data))?(('on'==$data['gillness-15'])?'checked="checked"':''):"");?>/> Ear pain </label> 
                                                   <label><input type="checkbox" name="gillness-16" <?= ((array_key_exists('gillness-16',$data))?(('on'==$data['gillness-16'])?'checked="checked"':''):"");?>/> Low mood </label>
                                                   <label><input type="checkbox" name="gillness-17" <?= ((array_key_exists('gillness-17',$data))?(('on'==$data['gillness-17'])?'checked="checked"':''):"");?>/> Decreased appetite </label>
                                                   <label><input type="checkbox" name="gillness-18" <?= ((array_key_exists('gillness-18',$data))?(('on'==$data['gillness-18'])?'checked="checked"':''):"");?>/> Feeling depressed </label>
                                                   <label><input type="checkbox" name="gillness-19" <?= ((array_key_exists('gillness-19',$data))?(('on'==$data['gillness-19'])?'checked="checked"':''):"");?>/> Tooth pain </label>                                               
                                                </fieldset>
                                                
                                            </div>
                                       </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>                    
                        <tr>
                            <td colspan="3">
                                <table width="100%">
                                    <tr>
                                        <td width="50" align="right">
                                            Other:
                                       </td>
                                        <td>
                                            <div data-mini="true" data-role="fieldcontain">
                                              <input type="text" name="gillnesstxt" id="gillnesstxt" value="<?= ((array_key_exists('gillnesstxt',$data))?$data['gillnesstxt']:"");?>" data-mini="true" style="margin-left:0px;" placeholder="Other..."/>
                                            </div>
                                       </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <table width="100%">
                                    <tr>
                                       <td width="50" align="right" style="width: 170px;">
                                            Vital signs: HR (bpm)
                                       </td>
                                       <td>
                                            <div data-mini="true" data-role="fieldcontain">
                                              <input type="text" name="hr" id="hr" value="<?= ((array_key_exists('hr',$data))?$data['hr']:"");?>" data-mini="true" style="margin-left:0px;" />
                                            </div>
                                       </td>
                                       <td width="50" align="right" style="width: 80px;"> 
                                            Temp (C<sup>o</sup>)
                                       </td>
                                       <td>
                                            <div data-mini="true" data-role="fieldcontain">
                                              <input type="text" name="temp" id="temp" value="<?= ((array_key_exists('temp',$data))?$data['temp']:"");?>" data-mini="true" style="margin-left:0px;" />
                                            </div>
                                       </td>
                                       <td width="50" align="right">
                                            RR
                                       </td>
                                       <td>
                                            <div data-mini="true" data-role="fieldcontain">
                                              <input type="text" name="rr" id="rr" value="<?= ((array_key_exists('rr',$data))?$data['rr']:"");?>" data-mini="true" style="margin-left:0px;" />
                                            </div>
                                       </td>
                                       <td width="50" align="right" style="width: 90px;">
                                            SaO<sub>2</sub> (%)
                                       </td>
                                       <td>
                                            <div data-mini="true" data-role="fieldcontain">
                                              <input type="text" name="sao2" id="sao2" value="<?= ((array_key_exists('sao2',$data))?$data['sao2']:"");?>" data-mini="true" style="margin-left:0px;" />
                                              
                                            </div>
                                       </td>
                                       <td  align="right" style="width: 150px;">
                                            Blood pressure (BP)
                                       </td>
                                       <td>
                                            <div data-mini="true" data-role="fieldcontain">
                                              <input type="text" name="bp" id="bp" value="<?= ((array_key_exists('bp',$data))?$data['bp']:"");?>" data-mini="true" style="margin-left:0px;" />
                                              
                                            </div>
                                       </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                            
                    </table>    
				</div>
      </form>
      <table width="100%">
      	<tr>
      		<td width="200px">
		      	<a href="#" id="backbtn3" data-role="button" data-inline="true"data-icon="arrow-l" data-iconpos="left">Previous</a>
            </td>
            <td></td>
            <td width="200px" align="right">
				<a href="#" id="nextbtn3" data-role="button" data-inline="true" data-theme="b" data-icon="arrow-r" data-iconpos="right">Submit</a>
            </td>
        </tr>
      </table>
        </p>	
  </div><!-- /content -->
</div><!-- /page three -->