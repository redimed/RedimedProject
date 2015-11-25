<!-- Start of first page: #one -->
<style type="text/css">
<!--
#assess div div #form-assess table tr td div fieldset label strong {
	color: #F00;
}
-->
</style>


<div data-mini="true" data-role="page" id="assess">
	<script type="text/javascript">
		$("#assess").bind( "pageinit", function(){
			if ($('#recommendation-1').is(':checked')) {
				$('#txt1').show();
				$('#inp1').show();
			}else{
				$('#txt1').hide();
				$('#inp1').hide();
			}
			if ($('#recommendation-2').is(':checked')) {
				$('#txt2').show();
				$('#inp2').show();
			}else{
				$('#txt2').hide();
				$('#inp2').hide();
			}
			if ($('#recommendation-3').is(':checked')) {
				$('#txt3').show();
				$('#inp3').show();
			}else{
				$('#txt3').hide();
				$('#inp3').hide();
			}
			// general illness - hide:  1, 2, 3. show: 4
			$('#recommendation-1').click(function() {
				$('#txt1').toggle();
				$('#inp1').toggle();
			});
			$('#recommendation-2').click(function() {
				$('#txt2').toggle();
				$('#inp2').toggle();
			});
			$('#recommendation-3').click(function() {
				$('#txt3').toggle();
				$('#inp3').toggle();
			});
			$('#dateFrom').scroller({
				preset: 'date',
				theme: 'ios',
				display: 'modal',
				mode: 'scroller',
				dateOrder: 'Mddyy'
			});
			$('#dateTo').scroller({
				preset: 'date',
				theme: 'ios',
				display: 'modal',
				mode: 'scroller',
				dateOrder: 'Mddyy'
			});
			$('#unfitFrom').scroller({
				preset: 'date',
				//invalid: { daysOfWeek: [0, 6], daysOfMonth: ['5/1', '12/24', '12/25'] },
				theme: 'ios',
				display: 'modal',
				mode: 'scroller',
				dateOrder: 'Mddyy'
			});
			$('#unfitTo').scroller({
				preset: 'date',
				theme: 'ios',
				display: 'modal',
				mode: 'scroller',
				dateOrder: 'Mddyy'
			});
			$('#datenext').scroller({
				preset: 'date',
				theme: 'ios',
				display: 'modal',
				mode: 'scroller',
				dateOrder: 'Mddyy'
			});
			$('#timenext').scroller({
				preset: 'time',
				theme: 'ios',
				display: 'modal',
				mode: 'scroller'
			});
			$("#nextbtn").click(function() {
			  	$.mobile.showPageLoadingMsg();
				var data = $('#form-assess').serializeObject();
				var obj = $.mobile.path.parseUrl(window.location.href);
				var path = obj.pathname;
				var paths = path.split('/');
				//alert(paths[4]);
				var id = obj.filename;			
				
				var olddata = jQuery.parseJSON('<?= $formdata;?>');
				var z = $.toJSON($.extend({},olddata, data));
				
				var extra = "&type=assess&id="+id;
											
				$.ajax({
				  type: "POST",
				  url: "/telehealth/index.php/form/submit",
				  data: "data="+z+extra+"&url=/telehealth/index.php/results",
				}).done(function( msg ) {			  	
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
		});
		
		
	</script>
	<div data-mini="true" data-role="header" data-id="foo1" data-position="fixed">
        <div data-mini="true" data-role="navbar">
            <ul>
                <li><a href="/telehealth/index.php/form" data-icon="home" data-ajax="false">Patient's details</a></li>
                <li><a href="/telehealth/index.php/results"data-icon="grid" class="ui-btn-active ui-state-persist" data-ajax="false">Results</a></li>
                <li><a href="/telehealth/index.php/settings"  data-icon="gear" data-ajax="false">Settings</a></li>
                
            </ul>
        </div><!-- /navbar -->
    </div><!-- /header -->
	<style>
		.rounded-corner
		{
			font-family: "Lucida Sans Unicode", "Lucida Grande", Sans-Serif;
			font-size: 14px;
			margin: 0px;
			width: 100%;
			text-align: left;
			border-collapse: collapse;
		}
		
		.rounded-corner th
		{
			padding: 8px;
			font-weight: normal;
			font-size: 13px;
			color: #039;
			background: #b9c9fe;
		}
		.rounded-corner td
		{
			padding: 8px;
			background: #F6F6F6;
			border-top: 1px solid #BBBBBB;
			color: #669;
		}
		
		.top
		{
			padding: 8px;
			background: #F6F6F6;
			border-top: 0px !important; 
			color: #669;
		}
		
		.rounded-corner tbody tr:hover td
		{
			background: #EEEEEE;
		}
	</style>
	<div data-mini="true" data-role="content" >	
		<h2 align="center" style="margin-top: 0px; margin-bottom: 0px;">REDiMED TELEHEALTH CONSULT INITIAL FORM        </h2>
        
		<div data-role="collapsible" data-theme="d" data-content-theme="d" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d" data-mini="true">
        	<h3>Employer's, worker's and Insurance's details</h3>
            <div class="ui-corner-top ui-corner-bottom ui-content ui-body-b" style="padding:0px !important;">
				<table width="100%" border="0" cellspacing="0" cellpadding="0" class="rounded-corner">
                   	<tr>
                       	<td class="top" width="150px" align="right"><strong>Service required</strong>:</td>
                        <td class="top" colspan="3">
                            <?= ((array_key_exists('require-1',$data))?(('on'==$data['require-1'])?'Emergency Telehealth Consult, ':''):"");?>
                            <?= ((array_key_exists('require-2',$data))?(('on'==$data['require-2'])?'First Medical Certificate, ':''):"");?>
                            <?= ((array_key_exists('require-3',$data))?(('on'==$data['require-3'])?'Follow up in Perth, ':''):"");?>
                            <?= ((array_key_exists('require-4',$data))?(('on'==$data['require-4'])?'Initial Telehealth Consult, ':''):"");?>
                            <?= ((array_key_exists('require-5',$data))?(('on'==$data['require-5'])?'Transport to/from Airport':''):"");?>
                        </td>
                        <td class="top" width="70px" align="right"><strong>Section</strong>:</td>
                        <td class="top"><?= ((array_key_exists('relation',$data))?((1==$data['relation'])?'Work related':'Not work related'):'Work related');?></td>
                    </tr>
                    <tr>
                        <td width="150px" align="right"><strong>Patient</strong>:</td>
                        <td colspan="3">
                            <?= $name;?>
                        </td>
                        <td width="120px" align="right"><strong>Date of birth</strong>:</td>
                        <td>
                            <?= ((array_key_exists('dob',$data))?$data['dob']:"");?>
                        </td>
                    </tr>
           			<tr>
                    	<td width="150px" align="right"><strong>Address</strong>:</td>                        
						<td>
                            <?= ((array_key_exists('address',$data))?$data['address']:"");?>
                        </td>
                        <td width="120px" align="right"><strong>Suburb</strong>:</td>
                        <td width="120px">
                            <?= ((array_key_exists('suburb',$data))?$data['suburb']:"");?>
                        </td>
                        <td width="70px" align="right"><strong>Postcode</strong>:</td>
                        <td>
                            <?= ((array_key_exists('postcode',$data))?$data['postcode']:"");?>
                        </td>
                    </tr>
                    <tr>
                    	<td width="150px" align="right"><strong>Telephone:(Hm)</strong>:</td>                        
						<td>
                            <?= ((array_key_exists('hfone',$data))?$data['hfone']:"");?>
                        </td>
                        <td width="120px" align="right"><strong>(Mob)</strong>:</td>
                        <td width="120px">
                            <?= ((array_key_exists('mfone',$data))?$data['mfone']:"");?>
                        </td>
                        <td width="70px" align="right"><strong>(Wk)</strong>:</td>
                        <td>
                            <?= ((array_key_exists('mfone',$data))?$data['mfone']:"");?>
                        </td>
                    </tr>
                    <tr>
                    	<td width="150px" align="right"><strong>Next of Kin:(Hm)</strong>:</td>                        
						<td colspan="3">
                            <?= ((array_key_exists('nok',$data))?$data['nok']:"");?>
                        </td>
                        <td width="120px" align="right"><strong>Telephone</strong>:</td>
                        <td>
                            <?= ((array_key_exists('Kfone',$data))?$data['Kfone']:"");?>
                        </td>
                    </tr>
                    <tr>
                       	<td width="150px" align="right"><strong>Company's name</strong>:</td>
                        <td><?= ((array_key_exists('name',$employer))?$employer['name']:'');?></td>
                        <td width="100px" align="right"><strong>Insurer</strong>:</td>
                        <td ><?= ((array_key_exists('insurer',$employer))?$employer['insurer']:"");?></td>
                        <td width="70px" align="right"><strong>IMA</strong>:</td>
                        <td ><?= ((array_key_exists('IMA',$employer))?$employer['IMA']:"");?></td>
                    </tr>
           			<tr>
                    	<td width="150px" align="right"><strong>Address</strong>:</td>                        
						<td><?= ((array_key_exists('address',$employer))?$employer['address']:"");?></td>
                        <td width="100px" align="right"><strong>Email</strong>:</td>
                        <td width="120px"><?= ((array_key_exists('phone',$employer))?$employer['phone']:"");?></td>
                        <td width="70px" align="right"><strong>Phone</strong>:</td>
                        <td><?= ((array_key_exists('email',$employer))?$employer['email']:"");?></td>
                    </tr>
                    <?php if (('no'!=$data['HC'])): ?>
                    <tr>
                    	<td width="150px" align="right"><strong> Membership No</strong>:</td>                        
						<td><?= ((array_key_exists('memno',$data))?$data['memno']:"");?></td>
                        <td width="100px" align="right"><strong>Position No</strong>:</td>
                        <td width="120px"><?= ((array_key_exists('posno',$data))?$data['posno']:"");?></td>
                        <td width="70px" align="right"><strong>Expiry</strong>:</td>
                        <td><?= ((array_key_exists('expiry',$data))?$data['expiry']:"");?></td>
                    </tr>
                    <?php endif; ?> 
                    <?php if (('no'!=$data['PHI'])): ?>
                    <tr>
                    	<td width="150px" align="right"><strong>Health Fund</strong>:</td>                        
						<td><?= ((array_key_exists('healFund',$data))?$data['healFund']:"");?></td>
                        <td width="100px" align="right"><strong>Medicare</strong>:</td>
                        <td width="120px"><?= ((array_key_exists('medicareno',$data))?$data['medicareno']:"");?></td>
                        <td width="70px" align="right"><strong>VA No.</strong>:</td>
                        <td><?= ((array_key_exists('vano',$data))?$data['vano']:"");?></td>
                    </tr>
                    <?php endif; ?> 
            	</table>
            </div>                  
        </div>
        
        <div data-role="collapsible" data-theme="d" data-content-theme="d" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d" data-mini="true">
        	<h3>Description of injury</h3>
            <div class="ui-corner-top ui-corner-bottom ui-content ui-body-b" style="padding:0px !important;">
				<table width="100%" border="0" cellspacing="0" cellpadding="0" class="rounded-corner">
                	<?php if ((1==$data['itype'])): ?>
                    <tr>
                    	<td class="top" align="right"><strong>Date of Accident / Onset of Symptoms</strong>:</td>                        
						<td class="top" colspan="5"><?= ((array_key_exists('adate',$data))?$data['adate']:"");?></td>
                    </tr>
                    <tr>
                    	<td align="right"><strong>General Illness</strong>:</td>                        
						<td colspan="5">
                        	<?= ((array_key_exists('gillness-1',$data))?(('on'==$data['gillness-1'])?'Headache, ':''):"");?> 
							<?= ((array_key_exists('gillness-2',$data))?(('on'==$data['gillness-2'])?'Nausea, ':''):"");?>
                            <?= ((array_key_exists('gillness-3',$data))?(('on'==$data['gillness-3'])?'Fatigue, ':''):"");?>
                            <?= ((array_key_exists('gillness-4',$data))?(('on'==$data['gillness-4'])?'Fever, ':''):"");?>
                            <?= ((array_key_exists('gillness-5',$data))?(('on'==$data['gillness-5'])?'Sore throat, ':''):"");?>
                            <?= ((array_key_exists('gillness-6',$data))?(('on'==$data['gillness-6'])?'Cough, ':''):"");?>
                            <?= ((array_key_exists('gillness-7',$data))?(('on'==$data['gillness-7'])?'Sinus congestion, ':''):"");?>
                            <?= ((array_key_exists('gillness-8',$data))?(('on'==$data['gillness-8'])?'Body aches, ':''):"");?>
                            <?= ((array_key_exists('gillness-9',$data))?(('on'==$data['gillness-9'])?'Vomiting, ':''):"");?>
                            <?= ((array_key_exists('gillness-10',$data))?(('on'==$data['gillness-10'])?'Light headedness, ':''):"");?>
                            <?= ((array_key_exists('gillness-11',$data))?(('on'==$data['gillness-11'])?'Diarrhea, ':''):"");?>
                            <?= ((array_key_exists('gillness-12',$data))?(('on'==$data['gillness-12'])?'Shortness of breath, ':''):"");?>
                            <?= ((array_key_exists('gillness-13',$data))?(('on'==$data['gillness-13'])?'Chest pain, ':''):"");?>
                            <?= ((array_key_exists('gillness-14',$data))?(('on'==$data['gillness-14'])?'Abdomen pain, ':''):"");?>
                            <?= ((array_key_exists('gillness-20',$data))?(('on'==$data['gillness-20'])?'Back pain, ':''):"");?>
                            <?= ((array_key_exists('gillness-15',$data))?(('on'==$data['gillness-15'])?'Ear pain, ':''):"");?>
                            <?= ((array_key_exists('gillness-16',$data))?(('on'==$data['gillness-16'])?'Low mood, ':''):"");?>
                            <?= ((array_key_exists('gillness-17',$data))?(('on'==$data['gillness-17'])?'Decreased appetite, ':''):"");?>
                            <?= ((array_key_exists('gillness-18',$data))?(('on'==$data['gillness-18'])?'Feeling depressed, ':''):"");?>
                            <?= ((array_key_exists('gillness-19',$data))?(('on'==$data['gillness-19'])?'Tooth pain. ':''):"");?>
                            <?= ((array_key_exists('gillnesstxt',$data))?$data['gillnesstxt']:"");?>
                        </td>
                    </tr>
                    <?php endif; ?>
                    <?php if ((1!=$data['itype'])): ?>
                    <tr>
                    	<td class="top" align="right"><strong>Date of Accident / Onset of Symptoms</strong>:</td>                        
						<td class="top" colspan="2"><?= ((array_key_exists('adate',$data))?$data['adate']:"");?></td>
                        <td class="top" align="right"><strong>Workplace location where incident occurred?</strong>:</td>
                        <td class="top" colspan="2"><?= ((array_key_exists('alocation',$data))?$data['alocation']:"");?></td>
                    </tr>
                    <tr>                    	
                        <td align="right"><strong>What actually happened and what caused the occurrence?</strong>:</td>
                        <td colspan="5"><?= ((array_key_exists('reason',$data))?$data['reason']:"");?></td>
                    </tr>
                    <tr>
                    	<td align="right"><strong>Describe the injury</strong>:</td>                        
						<td colspan="2">
							<?= ((array_key_exists('injdesc-1',$data))?(('on'==$data['injdesc-1'])?'Sprain/Strain':''):"");?>  
                            <?= ((array_key_exists('injdesc-2',$data))?(('on'==$data['injdesc-2'])?'Laceration, ':''):"");?>
                            <?= ((array_key_exists('injdesc-3',$data))?(('on'==$data['injdesc-3'])?'Crush, ':''):"");?>
                            <?= ((array_key_exists('injdesc-4',$data))?(('on'==$data['injdesc-4'])?'Fall. ':''):"");?>
                            <?= ((array_key_exists('injdesctxt',$data))?$data['injdesctxt']:"");?>
                        </td>
                        <td align="right"><strong>Which body part/s is/are affected?</strong>:</td>
                        <td colspan="2">
							<?= ((array_key_exists('bdypart-1',$data))?(('on'==$data['bdypart-1'])?'Lower leg, ':''):"");?>
                            <?= ((array_key_exists('bdypart-2',$data))?(('on'==$data['bdypart-2'])?'Upper leg, ':''):"");?>
                            <?= ((array_key_exists('bdypart-3',$data))?(('on'==$data['bdypart-3'])?'Abdomen, ':''):"");?>
                            <?= ((array_key_exists('bdypart-4',$data))?(('on'==$data['bdypart-4'])?'Chest, ':''):"");?>
                            <?= ((array_key_exists('bdypart-5',$data))?(('on'==$data['bdypart-5'])?'Shoulder, ':''):"");?>
                            <?= ((array_key_exists('bdypart-6',$data))?(('on'==$data['bdypart-6'])?'Upper arm, ':''):"");?>
                            <?= ((array_key_exists('bdypart-7',$data))?(('on'==$data['bdypart-7'])?'Lower arm, ':''):"");?>
                            <?= ((array_key_exists('bdypart-8',$data))?(('on'==$data['bdypart-8'])?'Hand. ':''):"");?>
                            <?= ((array_key_exists('bdyparttxt',$data))?$data['bdyparttxt']:"");?>
						</td>
                    </tr>
                    <tr>
                    	<td align="right"><strong>Injury symptoms</strong>:</td>                        
						<td colspan="2">
							<?= ((array_key_exists('symptoms-1',$data))?(('on'==$data['injdesc-1'])?'Open wound':''):"");?>  
                            <?= ((array_key_exists('symptoms-2',$data))?(('on'==$data['injdesc-2'])?'Swelling, ':''):"");?>
                            <?= ((array_key_exists('symptoms-3',$data))?(('on'==$data['injdesc-3'])?'Redness, ':''):"");?>
                            <?= ((array_key_exists('symptoms-4',$data))?(('on'==$data['injdesc-4'])?'Reduced movement. ':''):"");?>
                            <?= ((array_key_exists('injuretxt',$data))?$data['injuretxt']:"");?>
                        </td>
                        <td align="right"><strong>Pain</strong>: (1 - least; 10 - most)</td>
                        <td colspan="2">
							<?= ((array_key_exists('slider',$data))?$data['slider']:5);?>/10
						</td>
                    </tr>
                    <?php endif; ?> 
                    <tr>
                    	<td align="right"><strong>Medical history</strong>:</td>                        
						<td colspan="5">
                        	<?= ((array_key_exists('mhistory-1',$data))?(('on'==$data['mhistory-1'])?'Asthma, ':''):"");?> 
							<?= ((array_key_exists('mhistory-2',$data))?(('on'==$data['mhistory-2'])?'Epilepsy, ':''):"");?>
                            <?= ((array_key_exists('mhistory-3',$data))?(('on'==$data['mhistory-3'])?'Heart Condition, ':''):"");?>
                            <?= ((array_key_exists('mhistory-4',$data))?(('on'==$data['mhistory-4'])?'High Cholesterol, ':''):"");?>
                            <?= ((array_key_exists('mhistory-5',$data))?(('on'==$data['mhistory-5'])?'Diabetes type I, ':''):"");?>
                            <?= ((array_key_exists('mhistory-6',$data))?(('on'==$data['mhistory-6'])?'Diabetes type II, ':''):"");?>
                            <?= ((array_key_exists('mhistory-7',$data))?(('on'==$data['mhistory-7'])?'High blood pressure, ':''):"");?>
                            <?= ((array_key_exists('mhistory-8',$data))?(('on'==$data['mhistory-8'])?'Arthritis, ':''):"");?>
                            <?= ((array_key_exists('mhistory-9',$data))?(('on'==$data['mhistory-9'])?'Blood Condition. ':''):"");?>
                            <?= ((array_key_exists('mhistorytx',$data))?$data['mhistorytx']:"");?>
                        </td>
                    </tr>
                    <tr>
                    	<td  align="right"><strong>Medications</strong>:</td>                        
						<td  colspan="2"><?= ((array_key_exists('medications',$data))?$data['medications']:"");?></td>
                        <td  align="right"><strong>Allergies</strong>:</td>
                        <td  colspan="2"><?= ((array_key_exists('allergies',$data))?$data['allergies']:"");?></td>
                    </tr>
            	</table>
            </div>                  
        </div>
        
        <div data-role="collapsible" data-theme="d" data-content-theme="d" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d" data-mini="true" data-collapsed="false">
        	<h3>Medical assessment and recommendations</h3>            
            <form action="index.php/submit" method="post" id="form-assess" name="form-assess">
                 <table width="100%">
                    <tr>
                        <td colspan="3">                                    	                            	
                            <label for="massessment"><strong>Medical assessment</strong>:</label>
                            <textarea name="massessment" id="massessment" style="resize: none !important;"><?= ((array_key_exists('massessment',$data))?$data['massessment']:"");?></textarea>
                   	  </td>
                    </tr>
                    <tr>                        
<td colspan="3">
                        	In my opinion the above diagnosis <div data-mini="true" data-role="fieldcontain" style="width: 130px; display: inline-block; margin-top: 0px; top: 18px;">
                                <fieldset data-mini="true" data-role="controlgroup" data-type="horizontal">
                                    <input type="radio" name="does" id="does-1" value="1" <?= ((array_key_exists('does',$data))?((1==$data['does'])?'checked="checked"':''):'checked="checked"');?> />
                                    <label for="does-1">does</label>
                        
                                    <input type="radio" name="does" id="does-2" value="2" <?= ((array_key_exists('does',$data))?((2==$data['does'])?'checked="checked"':''):"");?> />
                                        <label for="does-2">does not</label>
                              </fieldset>
                            </div> correlate with the injury described to me by the worker.
                        </td>
                    </tr>
                    
                    <tr>
                      <td colspan="3"><strong>Injury Management</strong>:
                            
                        </td>
					</tr>
                   
					<tr>
                        <td colspan="3"><strong> <em>Fitness for work It is my opinion that as from the date of this certificate the worker is:</em></strong></td>
					</tr>

                    <tr>                    
<td colspan="3">
                            <div data-mini="true" data-role="fieldcontain">
                                <fieldset data-mini="true" data-role="controlgroup" >                              	
                                   <label><input type="checkbox" name="assessment-1" id="recommendation-1" <?= ((array_key_exists('assessment-1',$data))?(('on'==$data['assessment-1'])?'checked="checked"':''):"");?>/> Fit to return to pre-injury duties, no further treatment required.   </label>
                                   <label><input type="checkbox" name="assessment-2" id="recommendation-2" <?= ((array_key_exists('assessment-2',$data))?(('on'==$data['assessment-2'])?'checked="checked"':''):"");?>/> Fit to return to pre-injury duties, but requires further treatment. </label>
                                   <label><input type="checkbox" name="assessment-3" id="recommendation-3" <?= ((array_key_exists('assessment-3',$data))?(('on'==$data['assessment-3'])?'checked="checked"':''):"");?>/> Fit for restricted return to work from:</label>                                         
                                </fieldset>
                            </div>
                        </td>
					</tr>
                    <tr>
                    	<td colspan="3">
                        	<div data-mini="true" data-role="fieldcontain">
                            <input type="text" name="dateFrom" id="dateFrom" value="<?= ((array_key_exists('dateFrom',$data))?$data['dateFrom']:"");?>" data-mini="true" placeholder="from..." style="margin-left: 0px; width: 100px; display: inline-block;"/> to  
                            <input type="text" name="dateTo" id="dateTo" value="<?= ((array_key_exists('dateTo',$data))?$data['dateTo']:"");?>" data-mini="true" placeholder="to..." style="margin-left: 0px; width: 100px; display: inline-block;"/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                   	  <td colspan="3">
                        	<table width="100%">
                                <td width="10%"></td>
                                <td colspan="2">
                                    <div data-mini="true" data-role="fieldcontain">
                                        <fieldset data-mini="true" data-role="controlgroup" >                              	
                                           <label><input type="checkbox" name="assessment-4" id="assessment-4" <?= ((array_key_exists('assessment-4',$data))?(('on'==$data['assessment-4'])?'checked="checked"':''):"");?>/> restricted hours (please specify): </label>
                                           <label><input type="checkbox" name="assessment-5" id="assessment-5" <?= ((array_key_exists('assessment-5',$data))?(('on'==$data['assessment-5'])?'checked="checked"':''):"");?>/> restricted days ( please specify):  </label>
                                           <label><input type="checkbox" name="assessment-6" id="assessment-6" <?= ((array_key_exists('assessment-6',$data))?(('on'==$data['assessment-6'])?'checked="checked"':''):"");?>/> restricted duties. </label>                                          
                                        </fieldset>
                                    </div>	
                                </td>
                                <td valign="top">
                                	<input type="text" name="restrictedHours" id="restrictedHours" value="<?= ((array_key_exists('restrictedHours',$data))?$data['restrictedHours']:"");?>" data-mini="true"  placeholder="hours..." style="margin-left: 0px; width: 100px; margin-top: 0px; margin-bottom: 0px;"/>
                                    <input type="text" name="restrictedDays" id="restrictedDays" value="<?= ((array_key_exists('restrictedDays',$data))?$data['restrictedDays']:"");?>" data-mini="true"  placeholder="days..." style="margin-left: 0px; width: 100px; display: inline-block; margin-top: 2px;"/>	
                                </td>
                            </table>
					  </td>
                    </tr>
                    <tr>                    
<td colspan="3">
                            <div data-mini="true" data-role="fieldcontain">
                                <fieldset data-mini="true" data-role="controlgroup" >                              	
                                   <label><input type="checkbox" name="assessment-7" id="assessment-7" <?= ((array_key_exists('assessment-7',$data))?(('on'==$data['assessment-7'])?'checked="checked"':''):"");?>/> Work restrictions: </label>                                     
                                </fieldset>
                            </div>
                        </td>
					</tr>
                    <tr>
                    	<td colspan="3">
                        	<table width="100%">
                            	<td width="10%"></td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <fieldset data-mini="true" data-role="controlgroup" >                              	
                                           <label><input type="checkbox" name="assessment-8" id="assessment-8" <?= ((array_key_exists('assessment-8',$data))?(('on'==$data['assessment-8'])?'checked="checked"':''):"");?>/> No lifting anything heavier than </label>                                         
                                        </fieldset>
                                    </div>	
                                </td>
                    		</table>
						</td>            
                    </tr>
                    <tr>
                    	<td colspan="3">
                        	<table width="100%">
                            	<td width="10%"></td>
                                <td>
                                    <input type="text" name="weight" id="weight" value="<?= ((array_key_exists('weight',$data))?$data['weight']:"");?>" data-mini="true" placeholder="weight..." style="margin-left: 0px; width: 100px; display: inline-block;"/> kg. Other restrictions:  
                                    <input type="text" name="otherRes" id="otherRes" value="<?= ((array_key_exists('otherRes',$data))?$data['otherRes']:"");?>" data-mini="true" placeholder="other..." style="margin-left: 0px; width: 300px; display: inline-block;"/>	
                                </td>
                    		</table>
                        </td>
                    </tr>
                    <tr>
                    	<td colspan="3">
                        	<table width="100%">
                            	<td width="10%"></td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <fieldset data-mini="true" data-role="controlgroup" > 
                                           <label><input type="checkbox" name="assessment-9" id="assessment-9" <?= ((array_key_exists('assessment-9',$data))?(('on'==$data['assessment-9'])?'checked="checked"':''):"");?>/> Avoid repetitive bending / lifting. </label>
                                           <label><input type="checkbox" name="assessment-10" id="assessment-10" <?= ((array_key_exists('assessment-10',$data))?(('on'==$data['assessment-10'])?'checked="checked"':''):"");?>/> Avoid prolonged standing / walking / sitting. </label>   
                                           <label><input type="checkbox" name="assessment-11" id="assessment-11" <?= ((array_key_exists('assessment-11',$data))?(('on'==$data['assessment-11'])?'checked="checked"':''):"");?>/> Avoid repetitive use of affected body part. </label>
                                           <label><input type="checkbox" name="assessment-12" id="assessment-12" <?= ((array_key_exists('assessment-12',$data))?(('on'==$data['assessment-12'])?'checked="checked"':''):"");?>/> Keep injured area clean & dry. </label>                                          
                                        </fieldset>
                                    </div>	
                                </td>
                    		</table>
						</td>            
                    </tr>
                    <tr>                    
						<td colspan="3">
                            <div data-mini="true" data-role="fieldcontain">
                                <fieldset data-mini="true" data-role="controlgroup" >                              	
                                   <label><input type="checkbox" name="assessment-13" id="assessment-13" <?= ((array_key_exists('assessment-13',$data))?(('on'==$data['assessment-13'])?'checked="checked"':''):"");?>/> Unfit Totally unfit for work for  </label>                                     
                                </fieldset>
                            </div>
                        </td>
					</tr>
                    <tr>
                    	<td colspan="3">
                            <input type="text" name="unfitDays" id="unfitDays" value="<?= ((array_key_exists('unfitDays',$data))?$data['unfitDays']:"");?>" data-mini="true" placeholder="days..." style="margin-left: 0px; width: 100px; display: inline-block;"/> days from  
                            <input type="text" name="unfitFrom" id="unfitFrom" value="<?= ((array_key_exists('unfitFrom',$data))?$data['unfitFrom']:"");?>" data-mini="true"  placeholder="from..." style="margin-left: 0px; width: 100px; display: inline-block;"/> to  
                        <input type="text" name="unfitTo" id="unfitTo" value="<?= ((array_key_exists('unfitTo',$data))?$data['unfitTo']:"");?>" data-mini="true"  placeholder="to..." style="margin-left: 0px; width: 100px; display: inline-block;"/> <em>(inclusive).</em></td>
                    </tr>
                    <tr>
                        <td colspan="3"><strong><em>Medical management</em></strong><em>:                          
                        </em></td>
					</tr>                    
                    <tr>                    
						<td colspan="2">
                            <div data-mini="true" data-role="fieldcontain">
                                <fieldset data-mini="true" data-role="controlgroup" >
                                   <label><input type="checkbox" name="assessment-14" id="assessment-14" <?= ((array_key_exists('assessment-14',$data))?(('on'==$data['assessment-14'])?'checked="checked"':''):"");?>/> Medication   </label>
                                   <label><input type="checkbox" name="assessment-15" id="assessment-15" <?= ((array_key_exists('assessment-15',$data))?(('on'==$data['assessment-15'])?'checked="checked"':''):"");?>/> Approved allied health treatments (specify type and include number of sessions recommended): </label>
                                   <label><input type="checkbox" name="assessment-16" id="assessment-16" <?= ((array_key_exists('assessment-16',$data))?(('on'==$data['assessment-16'])?'checked="checked"':''):"");?>/> Imaging: </label>  
                                   <label><input type="checkbox" name="assessment-17" id="assessment-17" <?= ((array_key_exists('assessment-17',$data))?(('on'==$data['assessment-17'])?'checked="checked"':''):"");?>/> Referred to hospital/specialist (name):  </label>                                                                         
                                </fieldset>
                            </div>
                        </td>
                        <td valign="top">
                        	<input type="text" name="medicationtxt" id="medicationtxt" value="<?= ((array_key_exists('medicationtxt',$data))?$data['medicationtxt']:"");?>" data-mini="true" placeholder="medication..." style="margin-top: 0px; margin-bottom: 0px;"/>
                            <input type="text" name="treatmenttxt" id="treatmenttxt" value="<?= ((array_key_exists('treatmenttxt',$data))?$data['treatmenttxt']:"");?>" data-mini="true" placeholder="treatment..." style="margin-top: 2px; margin-bottom: 0px;"/>
                            <input type="text" name="imagingtxt" id="imagingtxt" value="<?= ((array_key_exists('imagingtxt',$data))?$data['imagingtxt']:"");?>" data-mini="true" placeholder="imaging..." style="margin-top: 2px; margin-bottom: 0px;"/>
                            <input type="text" name="refertxt" id="refertxt" value="<?= ((array_key_exists('refertxt',$data))?$data['refertxt']:"");?>" data-mini="true" placeholder="referrer..." style="margin-top: 2px; margin-bottom: 0px;"/>
                        </td>
					</tr>  
                    <tr>                    
                        <td colspan="3">
                            Other treatment: <input type="text" name="treatmentother" id="treatmentother" value="<?= ((array_key_exists('treatmentother',$data))?$data['treatmentother']:"");?>" data-mini="true"  placeholder="other..." style="margin-left: 0px; width: 400px; display: inline-block;"/>
                        </td>
					</tr>
                    <tr>                    
                        <td colspan="3">
                            Next appointment (Unless “First & Final Certificate”) Date <input type="text" name="datenext" id="datenext" value="<?= ((array_key_exists('datenext',$data))?$data['datenext']:"");?>" data-mini="true"  placeholder="date..." style="margin-left: 0px; width: 100px; display: inline-block;"/> Time <input type="text" name="timenext" id="timenext" value="<?= ((array_key_exists('timenext',$data))?$data['timenext']:"");?>" data-mini="true"  placeholder="time..." style="margin-left: 0px; width: 100px; display: inline-block;"/>
                        </td>
					</tr>
                    <tr>
                        <td colspan="3"><strong><em>Medical practitioner / employer contact</em></strong><em>:
                            
                        </em></td>
					</tr>
                    <tr>                    
                        <td colspan="3">
                            <div data-mini="true" data-role="fieldcontain">
                                <fieldset data-mini="true" data-role="controlgroup" >                              	
                                   <label><input type="checkbox" name="assessment-18" id="assessment-18" <?= ((array_key_exists('assessment-18',$data))?(('on'==$data['assessment-18'])?'checked="checked"':''):"");?>/> I have made contact with the employer and discussed alternative work options.   </label>
                                   <label><input type="checkbox" name="assessment-19" id="assessment-19" <?= ((array_key_exists('assessment-19',$data))?(('on'==$data['assessment-19'])?'checked="checked"':''):"");?>/> The worker will be off work for more than 3 working days and/or is unable to return to normal duties. Employer please fax your contact details as I will contact you to discuss return to work options. </label>
                                   <label><input type="checkbox" name="assessment-20" id="assessment-20" <?= ((array_key_exists('assessment-20',$data))?(('on'==$data['assessment-20'])?'checked="checked"':''):"");?>/> The worker is able to return to normal duties. Contact with employer not necessary at this stage. </label>                                         
                                </fieldset>
                            </div>
                        </td>
					</tr>
                    <tr>                    
                        <td colspan="3">
                            <div data-mini="true" data-role="fieldcontain">
                              <fieldset data-mini="true" data-role="controlgroup" >                              	
                         <label><input type="checkbox" name="assessment-21" id="assessment-21" <?= ((array_key_exists('assessment-21',$data))?(('on'==$data['assessment-21'])?'checked="checked"':''):"");?>/>
                                   <strong> First and final certificate. See reg 7 and s. 61(1) of the Act. </strong></label>                                      
                                </fieldset>
                            </div>
                        </td>
					</tr>					
                  </table>
            </form>             
        </div>

        <table width="100%">
            <tr>
                <td width="200px">
                    
                </td>
                <td></td>
                <td width="200px" align="right">
                    <a href="#" data-role="button" data-inline="true" data-theme="b" data-icon="arrow-r" data-iconpos="right" id="nextbtn" name="nextbtn">Submit assessment</a>
                </td>
            </tr>
        </table>
  </div><!-- /content -->
</div><!-- /page one -->