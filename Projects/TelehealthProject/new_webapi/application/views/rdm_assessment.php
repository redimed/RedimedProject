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
			var obj = $.mobile.path.parseUrl(window.location.href);
			$('#dateFrom,#dateTo,#unfitFrom,#unfitTo,#datenext,#examdate').scroller({preset: 'date',theme: 'ios',display: 'modal',mode: 'scroller',dateOrder: 'Mddyy'});
			$('#timenext, #examtime').scroller({preset: 'time',theme: 'ios',display: 'modal',mode: 'scroller'});
			if (2==obj.filename){
				$('#p-dateFrom,#p-dateTo,p-unfitDays,#p-unfitFrom,#p-unfitTo,#p-datenext,#p-examdate').scroller({preset: 'date',theme: 'ios',display: 'modal',mode: 'scroller',dateOrder: 'Mddyy'});
				$('#p-timenext, #p-examtime').scroller({preset: 'time',theme: 'ios',display: 'modal',mode: 'scroller'});
			}
			if (3==obj.filename){
				$('#f-from-date1,#f-from-date,#f-examdate').scroller({preset: 'date',theme: 'ios',display: 'modal',mode: 'scroller',dateOrder: 'Mddyy'});
				$('#f-examtime').scroller({preset: 'time',theme: 'ios',display: 'modal',mode: 'scroller'});
			}
			$('a[name|="nextbtn"]').click(function() {
			  	$.mobile.showPageLoadingMsg();
				var data = $('#form-assess').serializeObject();
				
				var obj = $.mobile.path.parseUrl(window.location.href);
				var path = obj.pathname;
				var paths = path.split('/');
				//alert(paths[4]);
				var id = $(this).attr('id');			
				//alert(id);
				var olddata = jQuery.parseJSON('<?= $formdata;?>');
				var z = $.toJSON($.extend({},olddata, data));
				
				var extra = "&type=assess&id="+id;
				<?php if ((1!=$data['itype'])): ?>
					if (3==obj.filename){
						var progressdata = $.toJSON( $('#f-form-assess').serializeObject());
						extra = extra +"&progressdata="+progressdata+'&hasProgress=3';
					}
					if (2==obj.filename){
						var progressdata = $.toJSON( $('#p-form-assess-progress').serializeObject());
						extra = extra +"&progressdata="+progressdata+'&hasProgress=2';
					}
				<?php endif;?>						
				$.ajax({
				  type: "POST",
				  url: "/telehealth/index.php/redimed/submit",
				  data: "data="+z+extra+"&url=/telehealth/index.php/redimed",
				}).done(function( msg ) {			  	
					if ('1'==msg){
						$.mobile.changePage( "#alert", {
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
	<div data-mini="true" data-role="header" data-id="foo1" data-theme="b" data-position="fixed">
        <a href="#" data-rel="back" data-direction="reverse" data-role="button"  data-icon="back" data-ajax="false">Back</a>
        <a href="/telehealth" data-icon="home" data-role="button"  data-ajax="false">Home</a>
        <h1>REDiMED TELEHEALTH - Assessment</h1>
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
                            <?= ((array_key_exists('wfone',$data))?$data['wfone']:"");?>
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
                    	<td align="right"><strong>Symptoms</strong>:</td>                        
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
                    <tr>
                    	<td align="right"><strong>Vital signs</strong>:</td>                        
						<td colspan="5">
                        	HR(bpm): <?= ((array_key_exists('hr',$data))?$data['hr']:"");?>, 
                            Temp(C<sup>o</sup>): <?= ((array_key_exists('temp',$data))?$data['temp']:"");?>, 
                            RR: <?= ((array_key_exists('rr',$data))?$data['rr']:"");?>, 
                            SaO<sub>2</sub>(%): <?= ((array_key_exists('sao2',$data))?$data['sao2']:"");?>, 
                            Blood pressure (BP): <?= ((array_key_exists('bp',$data))?$data['bp']:"");?>
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
							<?= ((array_key_exists('bdypart-1',$data))?(('on'==$data['bdypart-1'])?'Left lower leg, ':''):"");?>
                            <?= ((array_key_exists('bdypart-2',$data))?(('on'==$data['bdypart-2'])?'Right lower leg, ':''):"");?>
                            <?= ((array_key_exists('bdypart-3',$data))?(('on'==$data['bdypart-3'])?'Left upper leg, ':''):"");?>
                            <?= ((array_key_exists('bdypart-4',$data))?(('on'==$data['bdypart-4'])?'Right upper leg, ':''):"");?>
                            <?= ((array_key_exists('bdypart-5',$data))?(('on'==$data['bdypart-5'])?'Left lower arm, ':''):"");?>
                            <?= ((array_key_exists('bdypart-6',$data))?(('on'==$data['bdypart-6'])?'Right lower arm, ':''):"");?>
                            <?= ((array_key_exists('bdypart-7',$data))?(('on'==$data['bdypart-7'])?'Left upper arm, ':''):"");?>
                            <?= ((array_key_exists('bdypart-8',$data))?(('on'==$data['bdypart-8'])?'Right upper arm. ':''):"");?>
                            <?= ((array_key_exists('bdypart-9',$data))?(('on'==$data['bdypart-9'])?'Left hand, ':''):"");?>
                            <?= ((array_key_exists('bdypart-10',$data))?(('on'==$data['bdypart-10'])?'Right hand, ':''):"");?>
                            <?= ((array_key_exists('bdypart-11',$data))?(('on'==$data['bdypart-11'])?'Left shoulder, ':''):"");?>
                            <?= ((array_key_exists('bdypart-12',$data))?(('on'==$data['bdypart-12'])?'Right shoulder, ':''):"");?>
                            <?= ((array_key_exists('bdypart-13',$data))?(('on'==$data['bdypart-13'])?'Abdomen, ':''):"");?>
                            <?= ((array_key_exists('bdypart-14',$data))?(('on'==$data['bdypart-14'])?'Chest, ':''):"");?>
                            <?= ((array_key_exists('bdypart-15',$data))?(('on'==$data['bdypart-15'])?'Lower back. ':''):"");?>
                            <?= ((array_key_exists('bdyparttxt',$data))?$data['bdyparttxt']:"");?>
						</td>
                    </tr>
                    <tr>
                    	<td align="right"><strong>Injury symptoms</strong>:</td>                        
						<td colspan="2">
							<?= ((array_key_exists('symptoms-1',$data))?(('on'==$data['symptoms-1'])?'Open wound':''):"");?>  
                            <?= ((array_key_exists('symptoms-2',$data))?(('on'==$data['symptoms-2'])?'Swelling, ':''):"");?>
                            <?= ((array_key_exists('symptoms-3',$data))?(('on'==$data['symptoms-3'])?'Redness, ':''):"");?>
                            <?= ((array_key_exists('symptoms-4',$data))?(('on'==$data['symptoms-4'])?'Reduced movement. ':''):"");?>
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
        
        <div data-role="collapsible" data-theme="d" data-content-theme="d" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d" data-mini="true" data-collapsed="<?= ((1==$type)?"false":"true");?>">
        	<h3>Medical assessment and recommendations</h3>            
            <?php if ((1!=$data['itype'])): ?>
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
                        	In my opinion the above diagnosis <div data-mini="true" data-role="fieldcontain" style="width: 140px; display: inline-block; margin-top: 0px; top: 18px;">
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
                                <td width="5%"></td>
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
                            	<td width="5%"></td>
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
                            	<td width="5%"></td>
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
                            	<td width="5%"></td>
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
                            Next appointment (Unless &quot;First & Final Certificate&quot;) Date 
                            <input type="text" name="datenext" id="datenext" value="<?= ((array_key_exists('datenext',$data))?$data['datenext']:"");?>" data-mini="true"  placeholder="date..." style="margin-left: 0px; width: 100px; display: inline-block;"/> Time <input type="text" name="timenext" id="timenext" value="<?= ((array_key_exists('timenext',$data))?$data['timenext']:"");?>" data-mini="true"  placeholder="time..." style="margin-left: 0px; width: 100px; display: inline-block;"/>
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
                  <h4>Medical practitioner's details</h4>
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
                                          <input type="text" name="name" id="name" value="<?= ((array_key_exists('name',$redimed['detail']))?$redimed['detail']['name']:'');?>" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                        <td></td>
                        <td width="49%">
                            <table width="100%">
                                <tr>
                                    <td width="200" align="right">
                                        Registration no.:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="code" id="code" value="<?= ((array_key_exists('code',$redimed['detail']))?$redimed['detail']['code']:"");?>" data-mini="true" />
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
                                          <input type="text" name="address" id="address" value="<?= ((array_key_exists('address',$redimed['detail']))?$redimed['detail']['address']:"");?>" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                        <td></td>
                        <td width="49%">
                            <table width="100%">
                                <tr>
                                    <td width="200" align="right">
                                        Phone:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="phone" id="phone" value="<?= ((array_key_exists('phone',$redimed['detail']))?$redimed['detail']['phone']:"");?>" data-mini="true" />
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
                                          <input type="text" name="email" id="email" value="<?= ((array_key_exists('email',$redimed['detail']))?$redimed['detail']['email']:"");?>" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                        <td colspan="2"></td>
                        
                    </tr>  
                    <tr>                    
                        <td>
                            Examination date: <input type="text" name="examdate" id="examdate" value="<?= date("m/d/Y");?>" data-mini="true"  style="margin-left: 0px; width: 100px; display: inline-block;"/> time: <input type="text" name="examtime" id="examtime" value="<?= date("g:i a");?>" data-mini="true" style="margin-left: 0px; width: 100px; display: inline-block;"/>
                        </td>
                        <td></td>
                        <td width="49%">
                            <table width="100%">
                                <tr>
                                    <td width="100" align="right">
                                        Signature:
                                   </td>
                                    <td>
                                        <img src="<?= ((array_key_exists('drsign',$redimed['detail']))?$redimed['detail']['drsign']:"");?>" id="signImg" width="100px"/>
                                        <input type="hidden" name="drsign" id="drsign" value="<?= ((array_key_exists('drsign',$redimed['detail']))?$redimed['detail']['drsign']:"");?>" data-mini="true" />
                                   </td>
                                </tr>
                            </table>
                        </td>
					</tr>       
                </table>
                  <!-- signature -->
            
            </form>       
            <?php else:?>
            <form action="index.php/submit" method="post" id="form-assess" name="form-assess">
                 <table width="100%">
                    <tr>
                        <td width="250px" align="right">                                    	                            	
                            <label for="massessment">Symptomology:</label>
                   	  	</td>
                        <td colspan="2">
                        	<input type="text" name="symptomology" id="symptomology" value="<?= ((array_key_exists('symptomology',$data))?$data['symptomology']:"");?>" data-mini="true" />
                        </td>
                    </tr>
                    <tr>
                        <td align="right">                                    	                            	
                            <label for="massessment">Examination:</label>
                   	  	</td>
                        <td colspan="2">
                        	<input type="text" name="examination" id="examination" value="<?= ((array_key_exists('examination',$data))?$data['examination']:"");?>" data-mini="true" />
                        </td>
                    </tr>
                    <tr>
                        <td align="right">                                    	                            	
                            <label for="massessment">Differential Diagnosis:</label>
                   	  	</td>
                        <td colspan="2">
                        	<input type="text" name="ddiagnosis" id="ddiagnosis" value="<?= ((array_key_exists('ddiagnosis',$data))?$data['ddiagnosis']:"");?>" data-mini="true" />
                        </td>
                    </tr>
            	</table>
                <h4>Management plan</h4>
                <table width="100%">
                    <tr>
                        <td align="right" width="250px" >                                    	                            	
                            <label for="massessment">Medication:</label>
                   	  	</td>
                        <td colspan="2">
                        	<input type="text" name="mmedication" id="mmedication" value="<?= ((array_key_exists('mmedication',$data))?$data['mmedication']:"");?>" data-mini="true" />
                        </td>
                    </tr>
                    <tr>
                        <td align="right">                                    	                            	
                            <label for="massessment">Physio/allied:</label>
                   	  	</td>
                        <td colspan="2">
                        	<input type="text" name="physioallied" id="physioallied" value="<?= ((array_key_exists('physioallied',$data))?$data['physioallied']:"");?>" data-mini="true" />
                        </td>
                    </tr>
                    <tr>
                        <td align="right">                                    	                            	
                            <label for="massessment">Duty restriction:</label>
                   	  	</td>
                        <td colspan="2">
                        	<input type="text" name="drestriction" id="drestriction" value="<?= ((array_key_exists('drestriction',$data))?$data['drestriction']:"");?>" data-mini="true" />
                        </td>
                    </tr>
                    <tr>
                        <td align="right">                                    	                            	
                            <label for="massessment">Recommendations:</label>
                   	  	</td>
                        <td colspan="2">
                        	<input type="text" name="recommendations" id="recommendations" value="<?= ((array_key_exists('recommendations',$data))?$data['recommendations']:"");?>" data-mini="true" />
                        </td>
                    </tr>
                    <tr>
                        <td align="right">                                    	                            	
                            <label for="massessment">Follow up/review:</label>
                   	  	</td>
                        <td colspan="2">
                        	<input type="text" name="followreview" id="followreview" value="<?= ((array_key_exists('recommefollowreviewndations',$data))?$data['followreview']:"");?>" data-mini="true" />
                        </td>
                    </tr>
                    <tr>
                        <td align="right">                                    	                            	
                            <label for="massessment">Referrals:</label>
                   	  	</td>
                        <td colspan="2">
                        	<input type="text" name="referral" id="referral" value="<?= ((array_key_exists('referral',$data))?$data['referral']:"");?>" data-mini="true" />
                        </td>
                    </tr>
            	</table>
                <h4>Medical practitioner's details</h4>
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
                                          <input type="text" name="name" id="name" value="<?= ((array_key_exists('name',$redimed['detail']))?$redimed['detail']['name']:'');?>" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                        <td></td>
                        <td width="49%">
                            <table width="100%">
                                <tr>
                                    <td width="200" align="right">
                                        Registration no.:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="code" id="code" value="<?= ((array_key_exists('code',$redimed['detail']))?$redimed['detail']['code']:"");?>" data-mini="true" />
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
                                          <input type="text" name="address" id="address" value="<?= ((array_key_exists('address',$redimed['detail']))?$redimed['detail']['address']:"");?>" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                        <td></td>
                        <td width="49%">
                            <table width="100%">
                                <tr>
                                    <td width="200" align="right">
                                        Phone:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="phone" id="phone" value="<?= ((array_key_exists('phone',$redimed['detail']))?$redimed['detail']['phone']:"");?>" data-mini="true" />
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
                                          <input type="text" name="email" id="email" value="<?= ((array_key_exists('email',$redimed['detail']))?$redimed['detail']['email']:"");?>" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                        <td colspan="2"></td>
                        
                    </tr>  
                    <tr>                    
                        <td>
                            Examination date: <input type="text" name="examdate" id="examdate" value="<?= date("m/d/Y");?>" data-mini="true" style="margin-left: 0px; width: 100px; display: inline-block;"/> time: <input type="text" name="examtime" id="examtime" value="<?= date("g:i a");?>" data-mini="true" style="margin-left: 0px; width: 100px; display: inline-block;"/>
                       
                        </td>
                        <td></td>
                        <td width="49%">
                        	<table width="100%">
                                <tr>
                                    <td width="100" align="right">
                                        Signature:
                                   </td>
                                    <td>
                                        <img src="<?= ((array_key_exists('drsign',$redimed['detail']))?$redimed['detail']['drsign']:"");?>" id="signImg" width="100px"/>
                                        <input type="hidden" name="drsign" id="drsign" value="<?= ((array_key_exists('drsign',$redimed['detail']))?$redimed['detail']['drsign']:"");?>" data-mini="true" />
                                   </td>
                                </tr>
                            </table>
                            
                        </td>
					</tr>       
                </table>
            </form>
            <?php endif;?>      
        </div>
		<?php if ((1!=$data['itype'])&&(2==$type)): ?>
        <?php foreach($progress as $pkey => $pentry) : ?>	
        <div data-role="collapsible" data-theme="d" data-content-theme="d" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d" data-mini="true" data-collapsed="true">
        	<h3>Progress assessment <em>(<?= $pentry['createdTime'];?>)</em></h3>  
            	<table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                    	<td align="right" width="200px"><strong>Progress Report</strong>:</td>                        
						<td colspan="2"> <?= ((array_key_exists('p-massessment',$pentry['detail']))?$pentry['detail']['p-massessment']:"");?></td>
                    </tr>
					<tr>
                        <td colspan="3"><strong> <em>It is my opinion that as from the date of this certificate the worker is:</em></strong></td>
					</tr>
                    <tr>        
                    	<td></td>            
						<td colspan="2">
                            <?= ((array_key_exists('p-assessment-1',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-1'])?'- Fit to return to pre-injury duties, no further treatment required.':''):"");?>
                            <?= ((array_key_exists('p-assessment-2',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-2'])?'<br />- Fit to return to pre-injury duties, but requires further treatment.':''):"");?>
							<?= ((array_key_exists('p-assessment-3',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-3'])?'<br />- Fit for restricted return to work from: '.((array_key_exists('p-dateFrom',$pentry['detail']))?$pentry['detail']['p-dateFrom']:"").' to '.((array_key_exists('p-dateTo',$pentry['detail']))?$pentry['detail']['p-dateTo']:""):''):"");?>                            
                        	<?= ((array_key_exists('p-assessment-4',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-4'])?'<br />- Restricted hours (please specify): '.((array_key_exists('p-restrictedHours',$pentry['detail']))?$pentry['detail']['p-restrictedHours']:""):''):"");?>
                            <?= ((array_key_exists('p-assessment-5',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-5'])?'<br />- Restricted days ( please specify): '.((array_key_exists('p-restrictedDays',$pentry['detail']))?$pentry['detail']['p-restrictedDays']:""):''):"");?>
                            <?= ((array_key_exists('p-assessment-6',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-6'])?'<br />- Restricted duties.':''):"");?>
                            <?= ((array_key_exists('p-assessment-7',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-7'])?'<br />- Work restrictions: ':''):"");?>
							<?=((array_key_exists('p-assessment-8',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-8'])?'No lifting anything heavier than '.((array_key_exists('p-weight',$pentry['detail']))?$pentry['detail']['p-weight']:"").' kg. '.((array_key_exists('p-otherRes',$pentry['detail']))?'Other restrictions: '.$pentry['detail']['p-otherRes'].'.':""):''):"");?>
							<?= ((array_key_exists('p-assessment-9',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-9'])?'Avoid repetitive bending / lifting.':''):"");?>
                            <?= ((array_key_exists('p-assessment-10',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-10'])?'Avoid prolonged standing / walking / sitting.':''):"");?>
                            <?= ((array_key_exists('p-assessment-11',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-11'])?'Avoid repetitive use of affected body part.':''):"");?>
                            <?= ((array_key_exists('p-assessment-12',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-12'])?'Keep injured area clean & dry.':''):"");?>
                            <?= ((array_key_exists('p-assessment-22',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-22'])?'Able to undertake duties agreed between doctor & employer.':''):"");?>
                            <?= ((array_key_exists('p-assessment-13',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-13'])?'<br />- Unfit Totally unfit for work for '.((array_key_exists('p-unfitDays',$pentry['detail']))?$pentry['detail']['p-unfitDays']:"").' days from '.((array_key_exists('p-unfitFrom',$pentry['detail']))?$pentry['detail']['p-unfitFrom']:"").' to '.((array_key_exists('p-unfitTo',$pentry['detail']))?$pentry['detail']['p-unfitTo']:"").' (inclusive).':''):"");?>
                            
                            <?= ((array_key_exists('p-assessment-14',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-14'])?'<br />- Medication: '.((array_key_exists('p-medicationtxt',$pentry['detail']))?$pentry['detail']['p-medicationtxt']:""):''):"");?>
                            <?= ((array_key_exists('p-assessment-15',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-15'])?'<br />- Approved allied health treatments: '.((array_key_exists('p-treatmenttxt',$pentry['detail']))?$pentry['detail']['p-treatmenttxt']:""):''):"");?>
                            <?= ((array_key_exists('p-assessment-16',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-16'])?'<br />- Imaging: '.((array_key_exists('p-imagingtxt',$pentry['detail']))?$pentry['detail']['p-imagingtxt']:""):''):"");?>
                            <?= ((array_key_exists('p-assessment-17',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-17'])?'<br />- Referred to hospital/specialist: '.((array_key_exists('p-refertxt',$pentry['detail']))?$pentry['detail']['p-refertxt']:""):''):"");?>
                            <?= ((array_key_exists('p-treatmentother',$pentry['detail']))?'<br />- Other treatment: '.$pentry['detail']['p-treatmentother']:"");?>
                            <?= ((array_key_exists('p-datenext',$pentry['detail']))?'<br />- Next appointment: '.$pentry['detail']['p-datenext']:"");?>
                            <?= ((array_key_exists('p-timenext',$pentry['detail']))?'/'.$pentry['detail']['p-timenext']:"");?>
                            
                        </td>
					</tr>
                    <tr>                    
                        <td colspan="3">
                           <?= ((array_key_exists('p-assessment-18',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-18'])?'<br />- I have made contact with the employer and discussed alternative work options.':''):"");?>
                            <?= ((array_key_exists('p-assessment-19',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-19'])?'<br />- The worker will be off work for more than 3 working days and/or is unable to return to normal duties. Employer please fax your contact details as I will contact you to discuss return to work options.':''):"");?>
                            <?= ((array_key_exists('p-assessment-20',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-20'])?'<br />- The worker is able to return to normal duties. Contact with employer not necessary at this stage.':''):"");?>
                            <?= ((array_key_exists('p-assessment-23',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-23'])?'<br />- I have received contact details from the employer and I will contact the employer to discuss return to work options.':''):"");?>
                        </td>
					</tr>   
                    <tr>                    
                        <td colspan="3">
                           <strong>Return to work options</strong>
                        </td>
					</tr>   
                    <tr>       
                    	<td></td>             
                        <td colspan="2">
                        	<?= ((array_key_exists('p-assessment-24',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-24'])?'<br />- Doctor and employer to coordinate return to work.':''):"");?>
                           	<?= ((array_key_exists('p-assessment-25',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-25'])?'<br />- Vocational rehabilitation not required.':''):"");?>
                            <?= ((array_key_exists('p-assessment-26',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-26'])?'<br />- Vocational rehabilitation likely to be necessary, subject to review in '.((array_key_exists('p-reviewweek',$pentry['detail']))?$pentry['detail']['p-reviewweek']:"").' weeks':''):"");?>
                            <?= ((array_key_exists('p-assessment-27',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-27'])?'<br />- Vocational rehabilitation assessment required - choice of provider to be discussed with the worker.':''):"");?>
                            
                        </td>
					</tr>      
                    <tr>       
                    	<td colspan="2"></td>             
                        <td>
                        	<?= ((array_key_exists('p-assessment-28',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-28'])?'<br />- I have referred the worker to (name of vocational rehabilitation provider):'.((array_key_exists('p-refprovider',$pentry['detail']))?$pentry['detail']['p-refprovider']:""):''):"");?>
                           	<?= ((array_key_exists('p-assessment-29',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-29'])?'<br />- The worker has nominated (name of vocational rehabilitation provider):'.((array_key_exists('p-noprovider',$pentry['detail']))?$pentry['detail']['p-noprovider']:""):''):"");?>
                            <?= ((array_key_exists('p-assessment-30',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-30'])?'<br />- I would like the employer / insurer to discuss with me organising referral.':''):"");?>
                            
                        </td>
					</tr>  
                    <tr>       
                    	<td></td>             
                        <td colspan="2">
                        	<?= ((array_key_exists('p-assessment-31',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-31'])?'<br />- Vocational rehabilitation has been initiated and is continuing with:'.((array_key_exists('p-withtxt',$pentry['detail']))?$pentry['detail']['p-withtxt']:""):''):"");?>
                            
                        </td>
					</tr>  
                    <tr>       
                    	<td><strong>Comments:</strong></td>             
                        <td colspan="2">
                        	<?= ((array_key_exists('p-comments',$pentry['detail']))?$pentry['detail']['p-comments']:"");?>
                            
                        </td>
					</tr>                  
                </table>
            </form>             
        </div>
        <?php endforeach; ?>
        
		<div data-role="collapsible" data-theme="d" data-content-theme="d" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d" data-mini="true" data-collapsed="false">
        	<h3>Progress assessment</h3>            
            
            <form action="index.php/submit" method="post" id="p-form-assess-progress" name="p-form-assess-progress">
                 <table width="100%">
                    <tr>
                        <td colspan="3">                                    	                            	
                           <strong>Progress Report </strong>(clinical findings/diagnosis at this consultation and  possible barriers to return to work):
                            <textarea name="p-massessment" id="p-massessment" style="resize: none !important;"></textarea>
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
                                   <label><input type="checkbox" name="p-assessment-1" id="p-recommendation-1" /> Fit to return to pre-injury duties, no further treatment required.   </label>
                                   <label><input type="checkbox" name="p-assessment-2" id="p-recommendation-2" /> Fit to return to pre-injury duties, but requires further treatment. </label>
                                   <label><input type="checkbox" name="p-assessment-3" id="p-recommendation-3" /> Fit for restricted return to work from:</label>                                         
                                </fieldset>
                            </div>
                        </td>
					</tr>
                    <tr>
                    	<td colspan="3">
                        	<div data-mini="true" data-role="fieldcontain">
                            <input type="text" name="p-dateFrom" id="p-dateFrom" value="" data-mini="true" placeholder="from..." style="margin-left: 0px; width: 100px; display: inline-block;"/> to  
                            <input type="text" name="p-dateTo" id="p-dateTo" value="" data-mini="true" placeholder="to..." style="margin-left: 0px; width: 100px; display: inline-block;"/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                   	  <td colspan="3">
                        	<table width="100%">
                                <td width="5%"></td>
                                <td colspan="2">
                                    <div data-mini="true" data-role="fieldcontain">
                                        <fieldset data-mini="true" data-role="controlgroup" >                              	
                                           <label><input type="checkbox" name="p-assessment-4" id="p-assessment-4" /> restricted hours (please specify): </label>
                                           <label><input type="checkbox" name="p-assessment-5" id="p-assessment-5"/> restricted days ( please specify):  </label>
                                           <label><input type="checkbox" name="p-assessment-6" id="p-assessment-6" /> restricted duties. </label>                                          
                                        </fieldset>
                                    </div>	
                                </td>
                                <td valign="top">
                                	<input type="text" name="p-restrictedHours" id="p-restrictedHours" value="" data-mini="true"  placeholder="hours..." style="margin-left: 0px; width: 100px; margin-top: 0px; margin-bottom: 0px;"/>
                                    <input type="text" name="p-restrictedDays" id="p-restrictedDays" value="" data-mini="true"  placeholder="days..." style="margin-left: 0px; width: 100px; display: inline-block; margin-top: 2px;"/>	
                                </td>
                            </table>
					  </td>
                    </tr>
                    <tr>                    
<td colspan="3">
                            <div data-mini="true" data-role="fieldcontain">
                                <fieldset data-mini="true" data-role="controlgroup" >                              	
                                   <label><input type="checkbox" name="p-assessment-7" id="p-assessment-7" /> Work restrictions: </label>                                     
                                </fieldset>
                            </div>
                        </td>
					</tr>
                    <tr>
                    	<td colspan="3">
                        	<table width="100%">
                            	<td width="5%"></td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <fieldset data-mini="true" data-role="controlgroup" >                              	
                                           <label><input type="checkbox" name="p-assessment-8" id="p-assessment-8" /> No lifting anything heavier than </label>                                         
                                        </fieldset>
                                    </div>	
                                </td>
                    		</table>
						</td>            
                    </tr>
                    <tr>
                    	<td colspan="3">
                        	<table width="100%">
                            	<td width="5%"></td>
                                <td>
                                    <input type="text" name="p-weight" id="p-weight" value="" data-mini="true" placeholder="weight..." style="margin-left: 0px; width: 100px; display: inline-block;"/> kg. Other restrictions:  
                                    <input type="text" name="p-otherRes" id="p-otherRes" value="" data-mini="true" placeholder="other..." style="margin-left: 0px; width: 300px; display: inline-block;"/>	
                                </td>
                    		</table>
                        </td>
                    </tr>
                    <tr>
                    	<td colspan="3">
                        	<table width="100%">
                            	<td width="5%"></td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <fieldset data-mini="true" data-role="controlgroup" > 
                                           <label><input type="checkbox" name="p-assessment-9" id="p-assessment-9" /> Avoid repetitive bending / lifting. </label>
                                           <label><input type="checkbox" name="p-assessment-10" id="p-assessment-10" /> Avoid prolonged standing / walking / sitting. </label>   
                                           <label><input type="checkbox" name="p-assessment-11" id="p-assessment-11"/> Avoid repetitive use of affected body part. </label>
                                           <label><input type="checkbox" name="p-assessment-12" id="p-assessment-12" /> Keep injured area clean & dry. </label> 
                                           <label><input type="checkbox" name="p-assessment-22" id="p-assessment-22"/> Able to undertake duties agreed between doctor & employer. </label>                                          
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
                                   <label><input type="checkbox" name="p-assessment-13" id="p-assessment-13"/> Unfit Totally unfit for work for  </label>                                     
                                </fieldset>
                            </div>
                        </td>
					</tr>
                    <tr>
                    	<td colspan="3">
                            <input type="text" name="p-unfitDays" id="p-unfitDays" value="" data-mini="true" placeholder="days..." style="margin-left: 0px; width: 100px; display: inline-block;"/> days from  
                            <input type="text" name="p-unfitFrom" id="p-unfitFrom" value="" data-mini="true"  placeholder="from..." style="margin-left: 0px; width: 100px; display: inline-block;"/> to  
                        <input type="text" name="p-unfitTo" id="p-unfitTo" value="" data-mini="true"  placeholder="to..." style="margin-left: 0px; width: 100px; display: inline-block;"/> <em>(inclusive).</em></td>
                    </tr>
                    <tr>
                        <td colspan="3"><strong><em>Medical management</em></strong><em>:                          
                        </em></td>
					</tr>                    
                    <tr>                    
						<td colspan="2">
                            <div data-mini="true" data-role="fieldcontain">
                                <fieldset data-mini="true" data-role="controlgroup" >
                                   <label><input type="checkbox" name="p-assessment-14" id="p-assessment-14" /> Medication   </label>
                                   <label><input type="checkbox" name="p-assessment-15" id="p-assessment-15" /> Approved allied health treatments (specify type and include number of sessions recommended): </label>
                                   <label><input type="checkbox" name="p-assessment-16" id="p-assessment-16" /> Imaging: </label>  
                                   <label><input type="checkbox" name="p-assessment-17" id="p-assessment-17" /> Referred to hospital/specialist (name):  </label>                                                                         
                                </fieldset>
                            </div>
                        </td>
                        <td valign="top">
                        	<input type="text" name="p-medicationtxt" id="p-medicationtxt" value="" data-mini="true" placeholder="medication..." style="margin-top: 0px; margin-bottom: 0px;"/>
                            <input type="text" name="p-treatmenttxt" id="p-treatmenttxt" value="" data-mini="true" placeholder="treatment..." style="margin-top: 2px; margin-bottom: 0px;"/>
                            <input type="text" name="p-imagingtxt" id="p-imagingtxt" value="" data-mini="true" placeholder="imaging..." style="margin-top: 2px; margin-bottom: 0px;"/>
                            <input type="text" name="p-refertxt" id="p-refertxt" value="" data-mini="true" placeholder="referrer..." style="margin-top: 2px; margin-bottom: 0px;"/>
                        </td>
					</tr>  
                    <tr>                    
                        <td colspan="3">
                            Other treatment: <input type="text" name="p-treatmentother" id="p-treatmentother" value="" data-mini="true"  placeholder="other..." style="margin-left: 0px; width: 400px; display: inline-block;"/>
                        </td>
					</tr>
                    <tr>                    
                        <td colspan="3">
                            Next appointment: Date 
                              <input type="text" name="p-datenext" id="p-datenext" value="" data-mini="true"  placeholder="date..." style="margin-left: 0px; width: 100px; display: inline-block;"/> Time <input type="text" name="p-timenext" id="p-timenext" value="" data-mini="true"  placeholder="time..." style="margin-left: 0px; width: 100px; display: inline-block;"/>
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
                                   <label><input type="checkbox" name="p-assessment-18" id="p-assessment-18" /> I have made contact with the employer and discussed alternative work options.   </label>
                                   <label><input type="checkbox" name="p-assessment-19" id="p-assessment-19" /> The worker will be off work for more than 3 working days and/or is unable to return to normal duties. Employer please fax your contact details as I will contact you to discuss return to work options. </label>
                                   <label><input type="checkbox" name="p-assessment-20" id="p-assessment-20" /> The worker is able to return to normal duties. Contact with employer not necessary at this stage. </label>                      
                                   <label><input type="checkbox" name="p-assessment-23" id="p-assessment-23" /> I have received contact details from the employer and I will contact the employer to discuss return to work options. </label>                           
                                </fieldset> 
                            </div>
                        </td>
					</tr>
                    <tr>
                        <td colspan="3"><strong><em>Return to Work Options</em></strong><em>:
                            
                        </em></td>
					</tr>
                    <tr>                    
                        <td colspan="2">
                            <div data-mini="true" data-role="fieldcontain">
                                <fieldset data-mini="true" data-role="controlgroup" >                              	
                                   <label><input type="checkbox" name="p-assessment-24" id="p-assessment-24" /> Doctor and employer to coordinate return to work.   </label>
                                   <label><input type="checkbox" name="p-assessment-25" id="p-assessment-25" /> Vocational rehabilitation not required. </label>
                                   <label><input type="checkbox" name="p-assessment-26" id="p-assessment-26" /> Vocational rehabilitation likely to be necessary, subject to review in (weeks) </label>                      
                                   <label><input type="checkbox" name="p-assessment-27" id="p-assessment-27" /> 
                                   Vocational rehabilitation assessment required - choice of provider to be discussed with the worker. </label>                           
                                </fieldset> 
                            </div>
                        </td>
                        <td valign="top">
                            <input type="text" name="p-reviewweek" id="p-reviewweek" value="" data-mini="true" placeholder="week(s)" style="margin-top: 64px; margin-bottom: 0px;"/>
                            
                            
                        </td>
					</tr>
                    <tr>
                    	<td colspan="3">
                        	<table width="100%">
                            	<td width="5%"></td>
                                <td>
                                    <div data-mini="true" data-role="fieldcontain">
                                        <fieldset data-mini="true" data-role="controlgroup" >                              	
                                           <label><input type="checkbox" name="p-assessment-28" id="p-assessment-28" /> I have referred the worker to (name of vocational rehabilitation provider):  </label>                                         <label><input type="checkbox" name="p-assessment-29" id="p-assessment-29" /> The worker has nominated (name of vocational rehabilitation provider):   </label>                                         <label><input type="checkbox" name="p-assessment-30" id="p-assessment-30" /> I would like the employer / insurer to discuss with me organising referral.  </label>                                         
                                        </fieldset>
                                    </div>	
                                </td>
                                <td valign="top">
                                    <input type="text" name="p-refprovider" id="p-refprovider" value="" data-mini="true" placeholder="provider" style="margin-top: 0px; margin-bottom: 0px;"/>
                                    <input type="text" name="p-noprovider" id="p-noprovider" value="" data-mini="true" placeholder="provider" style="margin-top: 2px; margin-bottom: 0px;"/>
                                    
                                </td>
                    		</table>
						</td>            
                    </tr>
                    <tr>                    
                        <td colspan="2">
                            <div data-mini="true" data-role="fieldcontain">
                                <fieldset data-mini="true" data-role="controlgroup" >                              	
                                   <label><input type="checkbox" name="p-assessment-31" id="p-assessment-31" /> Vocational rehabilitation has been initiated and is continuing with   </label>
                                </fieldset> 
                            </div>
                        </td>
                        <td valign="top">
                                    <input type="text" name="p-withtxt" id="p-withtxt" value="" data-mini="true" placeholder="" style="margin-top: 0px; margin-bottom: 0px;"/>
                                    
                                </td>
					</tr>
                    <tr>                    
                        <td colspan="3">
                            Comments: <input type="text" name="p-comments" id="p-comments" value="" data-mini="true"  placeholder="" style="margin-left: 0px; width: 400px; display: inline-block;"/>
                        </td>
					</tr>					
                  </table>
                  <h4>Medical practitioner's details</h4>
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
                                          <input type="text" name="p-name" id="p-name" value="<?= ((array_key_exists('name',$redimed['detail']))?$redimed['detail']['name']:'');?>" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                        <td></td>
                        <td width="49%">
                            <table width="100%">
                                <tr>
                                    <td width="200" align="right">
                                        Registration no.:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="p-code" id="p-code" value="<?= ((array_key_exists('code',$redimed['detail']))?$redimed['detail']['code']:"");?>" data-mini="true" />
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
                                          <input type="text" name="p-address" id="p-address" value="<?= ((array_key_exists('address',$redimed['detail']))?$redimed['detail']['address']:"");?>" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                        <td></td>
                        <td width="49%">
                            <table width="100%">
                                <tr>
                                    <td width="200" align="right">
                                        Phone:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="p-phone" id="p-phone" value="<?= ((array_key_exists('phone',$redimed['detail']))?$redimed['detail']['phone']:"");?>" data-mini="true" />
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
                                          <input type="text" name="p-email2" id="p-email2" value="<?= ((array_key_exists('email',$redimed['detail']))?$redimed['detail']['email']:"");?>" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                      </td>
                        <td colspan="2"></td>
                        
                    </tr>  
                    <tr>                    
                        <td>
                            Examination date: <input type="text" name="p-examdate" id="p-examdate" value="<?= date("m/d/Y");?>" data-mini="true"  style="margin-left: 0px; width: 100px; display: inline-block;"/> time: <input type="text" name="p-examtime" id="p-examtime" value="<?= date("g:i a");?>" data-mini="true" style="margin-left: 0px; width: 100px; display: inline-block;"/>
                        </td>
                        <td></td>
                        <td width="49%">
                            <table width="100%">
                                <tr>
                                    <td width="100" align="right">
                                        Signature:
                                   </td>
                                    <td>
                                        <img src="<?= ((array_key_exists('drsign',$redimed['detail']))?$redimed['detail']['drsign']:"");?>" id="p-signImg" width="100px"/>
                                        <input type="hidden" name="p-drsign" id="p-drsign" value="<?= ((array_key_exists('drsign',$redimed['detail']))?$redimed['detail']['drsign']:"");?>" data-mini="true" />
                                   </td>
                                </tr>
                            </table>
                        </td>
					</tr>       
                </table>
                  <!-- signature -->
            
            </form>       
                 
        </div>
        <?php endif;?>
        
        <?php if ((1!=$data['itype'])&&(3==$type)): ?>
        <?php foreach($progress as $pkey => $pentry) : ?>	
        <div data-role="collapsible" data-theme="d" data-content-theme="d" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d" data-mini="true" data-collapsed="true">
        	<h3>Progress assessment <em>(<?= $pentry['createdTime'];?>)</em></h3>  
            	<table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                    	<td align="right" width="200px"><strong>Progress Report</strong>:</td>                        
						<td colspan="2"> <?= ((array_key_exists('p-massessment',$pentry['detail']))?$pentry['detail']['p-massessment']:"");?></td>
                    </tr>
					<tr>
                        <td colspan="3"><strong> <em>It is my opinion that as from the date of this certificate the worker is:</em></strong></td>
					</tr>
                    <tr>        
                    	<td></td>            
						<td colspan="2">
                            <?= ((array_key_exists('p-assessment-1',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-1'])?'- Fit to return to pre-injury duties, no further treatment required.':''):"");?>
                            <?= ((array_key_exists('p-assessment-2',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-2'])?'<br />- Fit to return to pre-injury duties, but requires further treatment.':''):"");?>
							<?= ((array_key_exists('p-assessment-3',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-3'])?'<br />- Fit for restricted return to work from: '.((array_key_exists('p-dateFrom',$pentry['detail']))?$pentry['detail']['p-dateFrom']:"").' to '.((array_key_exists('p-dateTo',$pentry['detail']))?$pentry['detail']['p-dateTo']:""):''):"");?>                            
                        	<?= ((array_key_exists('p-assessment-4',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-4'])?'<br />- Restricted hours (please specify): '.((array_key_exists('p-restrictedHours',$pentry['detail']))?$pentry['detail']['p-restrictedHours']:""):''):"");?>
                            <?= ((array_key_exists('p-assessment-5',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-5'])?'<br />- Restricted days ( please specify): '.((array_key_exists('p-restrictedDays',$pentry['detail']))?$pentry['detail']['p-restrictedDays']:""):''):"");?>
                            <?= ((array_key_exists('p-assessment-6',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-6'])?'<br />- Restricted duties.':''):"");?>
                            <?= ((array_key_exists('p-assessment-7',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-7'])?'<br />- Work restrictions: ':''):"");?>
							<?=((array_key_exists('p-assessment-8',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-8'])?'No lifting anything heavier than '.((array_key_exists('p-weight',$pentry['detail']))?$pentry['detail']['p-weight']:"").' kg. '.((array_key_exists('p-otherRes',$pentry['detail']))?'Other restrictions: '.$pentry['detail']['p-otherRes'].'.':""):''):"");?>
							<?= ((array_key_exists('p-assessment-9',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-9'])?'Avoid repetitive bending / lifting.':''):"");?>
                            <?= ((array_key_exists('p-assessment-10',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-10'])?'Avoid prolonged standing / walking / sitting.':''):"");?>
                            <?= ((array_key_exists('p-assessment-11',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-11'])?'Avoid repetitive use of affected body part.':''):"");?>
                            <?= ((array_key_exists('p-assessment-12',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-12'])?'Keep injured area clean & dry.':''):"");?>
                            <?= ((array_key_exists('p-assessment-22',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-22'])?'Able to undertake duties agreed between doctor & employer.':''):"");?>
                            <?= ((array_key_exists('p-assessment-13',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-13'])?'<br />- Unfit Totally unfit for work for '.((array_key_exists('p-unfitDays',$pentry['detail']))?$pentry['detail']['p-unfitDays']:"").' days from '.((array_key_exists('p-unfitFrom',$pentry['detail']))?$pentry['detail']['p-unfitFrom']:"").' to '.((array_key_exists('p-unfitTo',$pentry['detail']))?$pentry['detail']['p-unfitTo']:"").' (inclusive).':''):"");?>
                            
                            <?= ((array_key_exists('p-assessment-14',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-14'])?'<br />- Medication: '.((array_key_exists('p-medicationtxt',$pentry['detail']))?$pentry['detail']['p-medicationtxt']:""):''):"");?>
                            <?= ((array_key_exists('p-assessment-15',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-15'])?'<br />- Approved allied health treatments: '.((array_key_exists('p-treatmenttxt',$pentry['detail']))?$pentry['detail']['p-treatmenttxt']:""):''):"");?>
                            <?= ((array_key_exists('p-assessment-16',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-16'])?'<br />- Imaging: '.((array_key_exists('p-imagingtxt',$pentry['detail']))?$pentry['detail']['p-imagingtxt']:""):''):"");?>
                            <?= ((array_key_exists('p-assessment-17',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-17'])?'<br />- Referred to hospital/specialist: '.((array_key_exists('p-refertxt',$pentry['detail']))?$pentry['detail']['p-refertxt']:""):''):"");?>
                            <?= ((array_key_exists('p-treatmentother',$pentry['detail']))?'<br />- Other treatment: '.$pentry['detail']['p-treatmentother']:"");?>
                            <?= ((array_key_exists('p-datenext',$pentry['detail']))?'<br />- Next appointment: '.$pentry['detail']['p-datenext']:"");?>
                            <?= ((array_key_exists('p-timenext',$pentry['detail']))?'/'.$pentry['detail']['p-timenext']:"");?>
                            
                        </td>
					</tr>
                    <tr>                    
                        <td colspan="3">
                           <?= ((array_key_exists('p-assessment-18',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-18'])?'<br />- I have made contact with the employer and discussed alternative work options.':''):"");?>
                            <?= ((array_key_exists('p-assessment-19',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-19'])?'<br />- The worker will be off work for more than 3 working days and/or is unable to return to normal duties. Employer please fax your contact details as I will contact you to discuss return to work options.':''):"");?>
                            <?= ((array_key_exists('p-assessment-20',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-20'])?'<br />- The worker is able to return to normal duties. Contact with employer not necessary at this stage.':''):"");?>
                            <?= ((array_key_exists('p-assessment-23',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-23'])?'<br />- I have received contact details from the employer and I will contact the employer to discuss return to work options.':''):"");?>
                        </td>
					</tr>   
                    <tr>                    
                        <td colspan="3">
                           <strong>Return to work options</strong>
                        </td>
					</tr>   
                    <tr>       
                    	<td></td>             
                        <td colspan="2">
                        	<?= ((array_key_exists('p-assessment-24',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-24'])?'<br />- Doctor and employer to coordinate return to work.':''):"");?>
                           	<?= ((array_key_exists('p-assessment-25',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-25'])?'<br />- Vocational rehabilitation not required.':''):"");?>
                            <?= ((array_key_exists('p-assessment-26',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-26'])?'<br />- Vocational rehabilitation likely to be necessary, subject to review in '.((array_key_exists('p-reviewweek',$pentry['detail']))?$pentry['detail']['p-reviewweek']:"").' weeks':''):"");?>
                            <?= ((array_key_exists('p-assessment-27',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-27'])?'<br />- Vocational rehabilitation assessment required - choice of provider to be discussed with the worker.':''):"");?>
                            
                        </td>
					</tr>      
                    <tr>       
                    	<td colspan="2"></td>             
                        <td>
                        	<?= ((array_key_exists('p-assessment-28',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-28'])?'<br />- I have referred the worker to (name of vocational rehabilitation provider):'.((array_key_exists('p-refprovider',$pentry['detail']))?$pentry['detail']['p-refprovider']:""):''):"");?>
                           	<?= ((array_key_exists('p-assessment-29',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-29'])?'<br />- The worker has nominated (name of vocational rehabilitation provider):'.((array_key_exists('p-noprovider',$pentry['detail']))?$pentry['detail']['p-noprovider']:""):''):"");?>
                            <?= ((array_key_exists('p-assessment-30',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-30'])?'<br />- I would like the employer / insurer to discuss with me organising referral.':''):"");?>
                            
                        </td>
					</tr>  
                    <tr>       
                    	<td></td>             
                        <td colspan="2">
                        	<?= ((array_key_exists('p-assessment-31',$pentry['detail']))?(('on'==$pentry['detail']['p-assessment-31'])?'<br />- Vocational rehabilitation has been initiated and is continuing with:'.((array_key_exists('p-withtxt',$pentry['detail']))?$pentry['detail']['p-withtxt']:""):''):"");?>
                            
                        </td>
					</tr>  
                    <tr>       
                    	<td><strong>Comments:</strong></td>             
                        <td colspan="2">
                        	<?= ((array_key_exists('p-comments',$pentry['detail']))?$pentry['detail']['p-comments']:"");?>
                            
                        </td>
					</tr>                  
                </table>
            </form>             
        </div>
        <?php endforeach; ?>
        <div data-role="collapsible" data-theme="d" data-content-theme="d" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d" data-mini="true" data-collapsed="false">
        	<h3>Final assessment</h3>            
            
            <form action="index.php/submit" method="post" id="f-form-assess" name="f-form-assess">
                 <table width="100%">
                   
                    <tr>
                      <td colspan="3"><strong>Medical assessment</strong>:
                            
                        </td>
					</tr>
                   
					<tr>
                        <td colspan="3"><strong> <em>Having examined the worker, it is my opinion that as from: </em></strong><input type="text" name="f-from-date1" id="f-from-date1" value="<?= ((array_key_exists('f-from-date1',$final))?$final['f-from-date1']:'');?>" data-mini="true" style="width: 120px; display: inline;"/></td>
					</tr>

                    <tr>                    
<td colspan="3">
                            <div data-mini="true" data-role="fieldcontain">
                                <fieldset data-mini="true" data-role="controlgroup" >                              	
                                   <label><input type="checkbox" name="f-assessment-1" id="f-recommendation-1" <?= ((array_key_exists('f-assessment-1',$final))?(('on'==$final['f-assessment-1'])?'checked="checked"':''):"");?>/> the worker has wholly recovered from the effects of the disability.   </label>
                                   <label><input type="checkbox" name="f-assessment-2" id="f-recommendation-2" <?= ((array_key_exists('f-assessment-2',$final))?(('on'==$final['f-assessment-2'])?'checked="checked"':''):"");?>/> the worker has partially recovered from the effects of the disability. </label>
                                   <label><input type="checkbox" name="f-assessment-3" id="f-recommendation-3" <?= ((array_key_exists('f-assessment-3',$final))?(('on'==$final['f-assessment-3'])?'checked="checked"':''):"");?>/> 
                                   the worker's incapacity is no longer a result of the disability.</label>                                         
                                </fieldset>
                            </div>
                        </td>
					</tr>
                    <tr>
                        <td colspan="3"><strong> <em>It is also my opinion that as from <input type="text" name="f-from-date" id="f-from-date" value="<?= ((array_key_exists('f-from-date',$final))?$final['f-from-date']:'');?>" data-mini="true" style="width: 120px; display: inline;"/> the worker is:</em></strong></td>
					</tr>

                    <tr>                    
<td colspan="3">
                            <div data-mini="true" data-role="fieldcontain">
                                <fieldset data-mini="true" data-role="controlgroup" >                              	
                                   <label><input type="checkbox" name="f-assessment-4" id="f-recommendation-4" <?= ((array_key_exists('f-assessment-4',$final))?(('on'==$final['f-assessment-4'])?'checked="checked"':''):"");?>/> fit.   </label>
                                   <label><input type="checkbox" name="f-assessment-5" id="f-recommendation-5" <?= ((array_key_exists('f-assessment-5',$final))?(('on'==$final['f-assessment-5'])?'checked="checked"':''):"");?>/>fit for alternative duties with the following limitations: </label>
                             
                                </fieldset>
                            </div>
                        </td>
					</tr>
                    <tr>
                        <td colspan="3"><input type="text" name="f-fittxt" id="f-fittxt" value="<?= ((array_key_exists('f-fittxt',$final))?$final['f-fittxt']:'');?>" data-mini="true" /> </td>
					</tr>
                    <tr>
                        <td colspan="3"><strong> <em>Grounds for the opinion in medical assessment:</em></strong> Claim is capable of finalisation</td>
					</tr>

                    <tr>                    
<td colspan="3">
                            <div data-mini="true" data-role="fieldcontain">
                                <fieldset data-mini="true" data-role="controlgroup" >                              	
                                   <label><input type="checkbox" name="f-assessment-6" id="f-recommendation-6" <?= ((array_key_exists('f-assessment-6',$final))?(('on'==$final['f-assessment-6'])?'checked="checked"':''):"");?>/> No permanent impairment </label>
                                   <label><input type="checkbox" name="f-assessment-7" id="f-recommendation-7" <?= ((array_key_exists('f-assessment-7',$final))?(('on'==$final['f-assessment-7'])?'checked="checked"':''):"");?>/>Permanent impairment present </label>
                             
                                </fieldset>
                            </div>
                        </td>
					</tr>			
                    <tr>
                        <td colspan="3"><input type="text" name="f-other" id="f-other" value="<?= ((array_key_exists('f-other',$final))?$final['f-other']:'');?>" data-mini="true" /> </td>
					</tr>	
                  </table>
                  <h4>Medical practitioner's details</h4>
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
                                          <input type="text" name="f-name" id="f-name" value="<?= ((array_key_exists('name',$redimed['detail']))?$redimed['detail']['name']:'');?>" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                        <td></td>
                        <td width="49%">
                            <table width="100%">
                                <tr>
                                    <td width="200" align="right">
                                        Registration no.:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="f-code" id="f-code" value="<?= ((array_key_exists('code',$redimed['detail']))?$redimed['detail']['code']:"");?>" data-mini="true" />
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
                                          <input type="text" name="f-address" id="f-address" value="<?= ((array_key_exists('address',$redimed['detail']))?$redimed['detail']['address']:"");?>" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                        <td></td>
                        <td width="49%">
                            <table width="100%">
                                <tr>
                                    <td width="200" align="right">
                                        Phone:
                                   </td>
                                    <td>
                                        <div data-mini="true" data-role="fieldcontain">
                                          <input type="text" name="f-phone" id="f-phone" value="<?= ((array_key_exists('phone',$redimed['detail']))?$redimed['detail']['phone']:"");?>" data-mini="true" />
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
                                          <input type="text" name="f-email" id="f-email" value="<?= ((array_key_exists('email',$redimed['detail']))?$redimed['detail']['email']:"");?>" data-mini="true" />
                                        </div>
                                   </td>
                                </tr>
                            </table>
                        </td>
                        <td colspan="2"></td>
                        
                    </tr>  
                    <tr>                    
                        <td>
                            Examination date: <input type="text" name="f-examdate" id="f-examdate" value="<?= date("m/d/Y");?>" data-mini="true"  style="margin-left: 0px; width: 100px; display: inline-block;"/> time: <input type="text" name="f-examtime" id="f-examtime" value="<?= date("g:i a");?>" data-mini="true" style="margin-left: 0px; width: 100px; display: inline-block;"/>
                        </td>
                        <td></td>
                        <td width="49%">
                            <table width="100%">
                                <tr>
                                    <td width="100" align="right">
                                        Signature:
                                   </td>
                                    <td>
                                        <img src="<?= ((array_key_exists('drsign',$redimed['detail']))?$redimed['detail']['drsign']:"");?>" id="f-signImg" width="100px"/>
                                        <input type="hidden" name="f-drsign" id="f-drsign" value="<?= ((array_key_exists('drsign',$redimed['detail']))?$redimed['detail']['drsign']:"");?>" data-mini="true" />
                                   </td>
                                </tr>
                            </table>
                        </td>
					</tr>       
                </table>
                  <!-- signature -->
            
            </form>       
                 
        </div>
        <?php endif;?> 
        <table width="100%">
            <tr>
                <td width="200px">
                    
                </td>
                <td></td>
                <td width="200px" align="right">
                    <a href="#" data-role="button" id="<?= $entryId;?>" data-inline="true" data-theme="b" data-icon="arrow-r" data-iconpos="right"  name="nextbtn">Submit assessment</a>
                </td>
            </tr>
        </table>
  </div><!-- /content -->
</div><!-- /page one -->


<div data-role="dialog" id="alert">
    <div data-role="content" data-theme="c">
        <h1>Success!</h1>
        <p>Click OK to go back.</p>
        <a data-transition="pop" href="../../../redimed/results" data-inline="true" data-role="button" data-icon="back" data-theme="c" data-ajax="false">OK</a>
    </div>
</div>