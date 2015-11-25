<!-- Start of third page: #step 3 -->
<div data-mini="true" data-role="page" id="form-3">
	<script type="text/javascript">
		$("#form-3").bind( "pageinit", function(){
			//$(function(){
				$('#adate').scroller({
					preset: 'date',
					invalid: { daysOfWeek: [0, 6], daysOfMonth: ['5/1', '12/24', '12/25'] },
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
			  	$.mobile.changePage( "/telehealth/index.php/form/loadPage/4/1", {
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
	</script>
	<div data-mini="true" data-role="header" data-id="foo1" data-position="fixed">
        <div data-mini="true" data-role="navbar">
            <ul>
                <li><a href="/telehealth/index.php/form" data-icon="home" class="ui-btn-active ui-state-persist" data-ajax="false">Form</a></li>
                <li><a href="/telehealth/index.php/results"data-icon="grid" data-ajax="false">Results</a></li>
                <li><a href="/telehealth/index.php/settings"  data-icon="gear" data-ajax="false">Settings</a></li>
                
            </ul>
        </div><!-- /navbar -->
    </div><!-- /header -->

  <div data-mini="true" data-role="content" >	
         <h3><strong>Section 3</strong></h3>
         <form action="index.php/submit" method="post" id="form-form3" name="form-form3">
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
                        </td>
                    </tr>
                    
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
                        <td colspan="3">
                            <table width="100%">
                                <tr>
                                    <td width="250" align="right">
                                        Describe the injury:
                                   </td>
                                    <td width="325">
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
                    </tr>
                    <tr>
                        <td colspan="3">
                            <table width="100%">
                                <tr>
                                    <td width="250" align="right" valign="top">
                                        Which body part/s is/are affected?
                                   </td>
                                    <td>
                                       <div data-mini="true" data-role="fieldcontain">
                                            <fieldset data-mini="true" data-role="controlgroup" data-type="horizontal">
                                               <label><input type="checkbox" name="bdypart-1" <?= ((array_key_exists('bdypart-1',$data))?(('on'==$data['bdypart-1'])?'checked="checked"':''):"");?>/> Lower leg </label>
                                               <label><input type="checkbox" name="bdypart-2" <?= ((array_key_exists('bdypart-2',$data))?(('on'==$data['bdypart-2'])?'checked="checked"':''):"");?>/> Upper leg </label>
                                               <label><input type="checkbox" name="bdypart-3" <?= ((array_key_exists('bdypart-3',$data))?(('on'==$data['bdypart-3'])?'checked="checked"':''):"");?>/> Abdomen </label>
                                               <label><input type="checkbox" name="bdypart-4" <?= ((array_key_exists('bdypart-4',$data))?(('on'==$data['bdypart-4'])?'checked="checked"':''):"");?>/> Chest </label>
                                               <label><input type="checkbox" name="bdypart-5" <?= ((array_key_exists('bdypart-5',$data))?(('on'==$data['bdypart-5'])?'checked="checked"':''):"");?>/> Shoulder </label>
                                               <label><input type="checkbox" name="bdypart-6" <?= ((array_key_exists('bdypart-6',$data))?(('on'==$data['bdypart-6'])?'checked="checked"':''):"");?>/> Upper arm </label>
                                               <label><input type="checkbox" name="bdypart-7" <?= ((array_key_exists('bdypart-7',$data))?(('on'==$data['bdypart-7'])?'checked="checked"':''):"");?>/> Lower arm </label>
                                               <label><input type="checkbox" name="bdypart-8" <?= ((array_key_exists('bdypart-8',$data))?(('on'==$data['bdypart-8'])?'checked="checked"':''):"");?>/> Hand </label>
                                            </fieldset>
                                            <input type="text" name="bdyparttxt" id="bdyparttxt" value="<?= ((array_key_exists('bdyparttxt',$data))?$data['bdyparttxt']:"");?>" data-mini="true" style="margin-left:0px;" placeholder="Other..."/>
                                      </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                    </tr>                
                </table>  
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
                                         	<input type="text" name="mhistorytxt" id="mhistorytx" value="<?= ((array_key_exists('mhistorytx',$data))?$data['mhistorytx']:"");?>" data-mini="true" style="margin-left:0px;" placeholder="Other..."/>
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
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="medications" id="medications" value="<?= ((array_key_exists('medications',$data))?$data['medications']:"");?>" data-mini="true" />
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
                                        Allergies:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="allergies" id="allergies" value="<?= ((array_key_exists('allergies',$data))?$data['allergies']:"");?>" data-mini="true" />
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
      		<td width="200px">
		      	<a href="#" id="backbtn3" data-role="button" data-inline="true"data-icon="arrow-l" data-iconpos="left">Previous</a>
            </td>
            <td></td>
            <td width="200px" align="right">
				<a href="#" id="nextbtn3" data-role="button" data-inline="true" data-theme="b" data-icon="arrow-r" data-iconpos="right">Next</a>
            </td>
        </tr>
      </table>
        </p>	
  </div><!-- /content -->
</div><!-- /page three -->