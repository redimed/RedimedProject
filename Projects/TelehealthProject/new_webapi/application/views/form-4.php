<!-- Start of fourth page: #step 4 -->
<div data-mini="true" data-role="page" id="form-4">
	<script type="text/javascript">
		$("#form-4").bind( "pageinit", function(){
			function resetForm(id) {
				$('#'+id).each(function(){
						this.reset();
				});
			}
				
			
			
			$("#backbtn4").click(function() {
			  	$.mobile.showPageLoadingMsg();
				var data = $('#form-form4').serializeObject();
				var olddata = jQuery.parseJSON('<?= $formdata;?>');
				var z = $.toJSON($.extend({},olddata, data));
			  	$.mobile.changePage( "/telehealth/index.php/form/loadPage/3/0", {
					transition: "slide",
					data :"data=" + z,
					allowSamePageTransition : true,
					reloadPage: true,
					reverse: true,
					changeHash: false,
					type: "post"
				});
			});	
			$("#nextbtn4").click(function() {
				var data = $('#form-form4').serializeObject();
				var olddata = jQuery.parseJSON('<?= $formdata;?>');
				var z = $.toJSON($.extend({},olddata, data));
				
			  	$.mobile.showPageLoadingMsg();								
				$.ajax({
				  type: "POST",
				  url: "/telehealth/index.php/form/submit",
				  data: "data="+z,
				}).done(function( msg ) {
				  //
				  	
					if ('1'==msg){
						$.mobile.changePage( "/telehealth/index.php/form/succeed", {
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
		});
	</script>
	<div data-mini="true" data-role="header" data-id="foo1" data-position="fixed">
        <div data-mini="true" data-role="navbar">
            <ul>
                <li><a href="/telehealth/index.php/form" data-icon="home" class="ui-btn-active ui-state-persist" data-ajax="false">Patient's details</a></li>
                <li><a href="/telehealth/index.php/results"data-icon="grid" data-ajax="false">Results</a></li>
                <li><a href="/telehealth/index.php/settings"  data-icon="gear" data-ajax="false">Settings</a></li>
                
            </ul>
        </div><!-- /navbar -->
    </div><!-- /header -->

  <div data-mini="true" data-role="content" >	
         <h3><strong>Section 4: Symptoms</strong></h3>
         <form action="index.php/submit" method="post" id="form-form4" name="form-form4">
         	<strong>Injury:</strong>		  
                <table width="100%">
                    <tr>
                        <td colspan="2">
                           <div data-mini="true" data-role="fieldcontain">
                                <fieldset data-mini="true" data-role="controlgroup" data-type="horizontal" >
                                    <label><input type="checkbox" name="symptoms-1" <?= ((array_key_exists('symptoms-1',$data))?(('on'==$data['symptoms-1'])?'checked="checked"':''):"");?>/> Open wound </label>
                                   <label><input type="checkbox" name="symptoms-2" <?= ((array_key_exists('symptoms-2',$data))?(('on'==$data['symptoms-2'])?'checked="checked"':''):"");?>/> Swelling </label>
                                   <label><input type="checkbox" name="symptoms-3" <?= ((array_key_exists('symptoms-3',$data))?(('on'==$data['symptoms-3'])?'checked="checked"':''):"");?>/> Redness </label>
                                   <label><input type="checkbox" name="symptoms-4" <?= ((array_key_exists('symptoms-4',$data))?(('on'==$data['symptoms-4'])?'checked="checked"':''):"");?>/> Reduced movement </label>
                                </fieldset>
                            </div>
                        </td>
                    </tr>
                    <tr>
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
                        <td colspan="2">
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
			<strong>General Illness:</strong>		  
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
                                               <label><input type="checkbox" name="gillness-15" <?= ((array_key_exists('gillness-15',$data))?(('on'==$data['gillness-15'])?'checked="checked"':''):"");?>/> Ear pain </label>                                             
                                            </fieldset>
                                         	
                                        </div>
                                   </td>
                                   <td></td>
                                   <td width="23%" valign="top">
                                       <div data-mini="true" data-role="fieldcontain">
                                            <fieldset data-mini="true" data-role="controlgroup" >
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
                        
                </table>    
      </form>
      <table width="100%">
      	<tr>
      		<td width="200px">
		      	<a href="#" id="backbtn4" data-role="button" data-inline="true" data-icon="arrow-l" data-iconpos="left">Previous</a>
            </td>
            <td></td>
            <td width="200px" align="right">
				<a href="#" id="nextbtn4" data-role="button" data-inline="true" data-theme="b" data-icon="arrow-r" data-iconpos="right">Next</a>
            </td>
        </tr>
      </table>
        </p>	
  </div><!-- /content -->
</div><!-- /page four -->
