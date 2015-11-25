<!-- Start of first page: #one -->

<div data-mini="true" data-role="page" id="detail">
	<script type="text/javascript">
		$("#detail").bind( "pageinit", function(){
			
		});
		
		
	</script>
	<div data-mini="true" data-role="header" data-id="foo1" data-theme="b" data-position="fixed">
        <a href="#" data-rel="back" data-direction="reverse" data-role="button"  data-icon="back" data-ajax="false">Back</a>
        <a href="/telehealth" data-icon="home" data-role="button"  data-ajax="false">Home</a>
        <h1>REDiMED TELEHEALTH - Detail</h1>
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
        
		<div data-role="collapsible" data-theme="d" data-content-theme="d" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d" data-mini="true" data-collapsed="true">
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
        <div data-role="collapsible" data-theme="d" data-content-theme="d" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d" data-mini="true" data-collapsed="true">
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
                    <tr>
                    	<td align="right"><strong>Vital signs</strong>:</td>                        
						<td colspan="5">
                        	HR(bpm): <?= ((array_key_exists('hr',$data))?$data['hr']:"");?>, 
                            Temp(C<sup>o</sup>): <?= ((array_key_exists('temp',$data))?$data['temp']:"");?>, 
                            RR: <?= ((array_key_exists('rr',$data))?$data['rr']:"");?>, 
                            SaO<sub>2</sub>(%): <?= ((array_key_exists('sao2',$data))?$data['sao2']:"");?>,
                            Blood pressure (BP): <?= ((array_key_exists('bp',$data))?$data['bp']:"");?>. 
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
							<?= ((array_key_exists('injdesc-1',$data))?(('on'==$data['injdesc-1'])?'Open wound':''):"");?>  
                            <?= ((array_key_exists('injdesc-2',$data))?(('on'==$data['injdesc-2'])?'Swelling, ':''):"");?>
                            <?= ((array_key_exists('injdesc-3',$data))?(('on'==$data['injdesc-3'])?'Redness, ':''):"");?>
                            <?= ((array_key_exists('injdesc-4',$data))?(('on'==$data['injdesc-4'])?'Reduced movement. ':''):"");?>
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
        <a href="#" data-role="button" data-sheet="functions" name="list" data-icon="check" data-ajax="false" data-mini="true" data-inline="true" data-theme="b">Assess</a>
        <div data-role="actionsheet" class="ui-actionsheet-content ui-corner-top ui-corner-bottom" id="functions" data-theme="b">
            <div data-role="content" class="ui-corner-top ui-corner-bottom ui-content ui-body-b">
                <h3>Please choose a type of assessment.</h3>
                <a href="../assess/<?= $entryId;?>/1" data-role="button" data-ajax="false">First Certificate</a>  
                <a href="../assess/<?= $entryId;?>/2" data-role="button" data-ajax="false">Progress Certificate</a>
                <a href=../"assess/<?= $entryId;?>/3" data-role="button" data-ajax="false">Final Certificate</a> 
            </div>
        </div>
        <div data-role="collapsible" data-theme="d" data-content-theme="d" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d" data-mini="true" data-collapsed="true">
        	<h3>Medical assessment</h3>  
            	<table width="100%" border="0" cellspacing="0" cellpadding="0" >
                    <tr>
                    	<td align="right" width="200px"><strong>Medical assessment</strong>:</td>                        
						<td colspan="2"><?= ((array_key_exists('massessment',$data))?$data['massessment']:"");?></td>
                    </tr>  
                 	<tr>                        
						<td colspan="3">
                        	In my opinion the above diagnosis <strong><?= ((array_key_exists('does',$data))?((1==$data['does'])?'does':'does not'):'does / does not');?></strong> correlate with the injury described to me by the worker.
                        </td>
                    </tr>
					<tr>
                        <td colspan="3"><strong> <em>It is my opinion that as from the date of this certificate the worker is:</em></strong></td>
					</tr>
                    <tr>        
                    	<td></td>            
						<td colspan="2">
                            <?= ((array_key_exists('assessment-1',$data))?(('on'==$data['assessment-1'])?'- Fit to return to pre-injury duties, no further treatment required.':''):"");?>
                            <?= ((array_key_exists('assessment-2',$data))?(('on'==$data['assessment-2'])?'<br />- Fit to return to pre-injury duties, but requires further treatment.':''):"");?>
							<?= ((array_key_exists('assessment-3',$data))?(('on'==$data['assessment-3'])?'<br />- Fit for restricted return to work from: '.((array_key_exists('dateFrom',$data))?$data['dateFrom']:"").' to '.((array_key_exists('dateTo',$data))?$data['dateTo']:""):''):"");?>                            
                        	<?= ((array_key_exists('assessment-4',$data))?(('on'==$data['assessment-4'])?'<br />- Restricted hours (please specify): '.((array_key_exists('restrictedHours',$data))?$data['restrictedHours']:""):''):"");?>
                            <?= ((array_key_exists('assessment-5',$data))?(('on'==$data['assessment-5'])?'<br />- Restricted days ( please specify): '.((array_key_exists('restrictedDays',$data))?$data['restrictedDays']:""):''):"");?>
                            <?= ((array_key_exists('assessment-6',$data))?(('on'==$data['assessment-6'])?'<br />- Restricted duties.':''):"");?>
                            <?= ((array_key_exists('assessment-7',$data))?(('on'==$data['assessment-7'])?'<br />- Work restrictions: ':''):"");?>
							<?=((array_key_exists('assessment-8',$data))?(('on'==$data['assessment-8'])?'No lifting anything heavier than '.((array_key_exists('weight',$data))?$data['weight']:"").' kg. '.((array_key_exists('otherRes',$data))?'Other restrictions: '.$data['otherRes'].'.':""):''):"");?>
							<?= ((array_key_exists('assessment-9',$data))?(('on'==$data['assessment-9'])?'Avoid repetitive bending / lifting.':''):"");?>
                            <?= ((array_key_exists('assessment-10',$data))?(('on'==$data['assessment-10'])?'Avoid prolonged standing / walking / sitting.':''):"");?>
                            <?= ((array_key_exists('assessment-11',$data))?(('on'==$data['assessment-11'])?'Avoid repetitive use of affected body part.':''):"");?>
                            <?= ((array_key_exists('assessment-12',$data))?(('on'==$data['assessment-12'])?'Keep injured area clean & dry.':''):"");?>
                            <?= ((array_key_exists('assessment-13',$data))?(('on'==$data['assessment-13'])?'<br />- Unfit Totally unfit for work for '.((array_key_exists('unfitDays',$data))?$data['unfitDays']:"").' days from '.((array_key_exists('unfitFrom',$data))?$data['unfitFrom']:"").' to '.((array_key_exists('unfitTo',$data))?$data['unfitTo']:"").' (inclusive).':''):"");?>
                            
                            <?= ((array_key_exists('assessment-14',$data))?(('on'==$data['assessment-14'])?'<br />- Medication: '.((array_key_exists('medicationtxt',$data))?$data['medicationtxt']:""):''):"");?>
                            <?= ((array_key_exists('assessment-15',$data))?(('on'==$data['assessment-15'])?'<br />- Approved allied health treatments: '.((array_key_exists('treatmenttxt',$data))?$data['treatmenttxt']:""):''):"");?>
                            <?= ((array_key_exists('assessment-16',$data))?(('on'==$data['assessment-16'])?'<br />- Imaging: '.((array_key_exists('imagingtxt',$data))?$data['imagingtxt']:""):''):"");?>
                            <?= ((array_key_exists('assessment-17',$data))?(('on'==$data['assessment-17'])?'<br />- Referred to hospital/specialist: '.((array_key_exists('refertxt',$data))?$data['refertxt']:""):''):"");?>
                            <?= ((array_key_exists('treatmentother',$data))?'<br />- Other treatment: '.$data['treatmentother']:"");?>
                            <?= ((array_key_exists('datenext',$data))?'<br />- Next appointment: '.$data['datenext']:"");?>
                            <?= ((array_key_exists('timenext',$data))?'/'.$data['timenext']:"");?>
                            <?= ((array_key_exists('assessment-18',$data))?(('on'==$data['assessment-18'])?'<br />- I have made contact with the employer and discussed alternative work options.':''):"");?>
                            <?= ((array_key_exists('assessment-19',$data))?(('on'==$data['assessment-19'])?'<br />- The worker will be off work for more than 3 working days and/or is unable to return to normal duties. Employer please fax your contact details as I will contact you to discuss return to work options.':''):"");?>
                            <?= ((array_key_exists('assessment-20',$data))?(('on'==$data['assessment-20'])?'<br />- The worker is able to return to normal duties. Contact with employer not necessary at this stage.':''):"");?>
                        </td>
					</tr>
                    <tr>                    
                        <td colspan="3">
                            <?= ((array_key_exists('assessment-21',$data))?(('on'==$data['assessment-21'])?'This is First and final certificate. See reg 7 and s. 61(1) of the Act.':''):"");?>
                        </td>
					</tr>                    
                </table>
            </form>             
        </div>
        <?php foreach($progress as $pkey => $pentry) : ?>	
        <div data-role="collapsible" data-theme="d" data-content-theme="d" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d" data-mini="true" data-collapsed="true">
        	<h3>Progress assessment <em>(<?= $pentry['createdTime'];?>)</em></h3>  
            	<table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                    	<td align="right" width="200px"><strong>Progress Report</strong>:</td>                        
						<td colspan="2"><?= ((array_key_exists('p-massessment',$pentry['detail']))?$pentry['detail']['p-massessment']:"");?></td>
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
        <?php foreach($final as $fkey => $fentry) : ?>	
        <div data-role="collapsible" data-theme="d" data-content-theme="d" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d" data-mini="true" data-collapsed="true">
        	<h3>Final assessment <em>(<?= $fentry['createdTime'];?>)</em></h3>  
            	<table width="100%" border="0" cellspacing="0" cellpadding="0">
                    
                 	<tr>                        
						<td colspan="3">
                        	Having examined the worker, it is my opinion that as from: <?= ((array_key_exists('f-from-date1',$fentry['detail']))?$fentry['detail']['f-from-date1']:'');?>
                        </td>
                    </tr>
                    <tr>        
                    	<td width="100"></td>            
						<td colspan="2">
                            <?= ((array_key_exists('f-assessment-1',$fentry['detail']))?(('on'==$fentry['detail']['f-assessment-1'])?'- the worker has wholly recovered from the effects of the disability.':''):"");?>
                            <?= ((array_key_exists('f-assessment-2',$fentry['detail']))?(('on'==$fentry['detail']['f-assessment-2'])?'<br />- the worker has partially recovered from the effects of the disability.':''):"");?>
							<?= ((array_key_exists('f-assessment-3',$fentry['detail']))?(('on'==$fentry['detail']['f-assessment-3'])?'<br />- the worker\'s incapacity is no longer a result of the disability.':''):"");?>                            
                        	
                        </td>
					</tr>
                    <tr>                        
						<td colspan="3">
                        	It is also my opinion that as from <?= ((array_key_exists('f-from-date',$fentry['detail']))?$fentry['detail']['f-from-date']:'');?> the worker is:
                        </td>
                    </tr>
                    <tr>        
                    	<td></td>            
						<td colspan="2">
                            <?= ((array_key_exists('f-assessment-4',$fentry['detail']))?(('on'==$fentry['detail']['f-assessment-4'])?'- fit.':''):"");?>
                            <?= ((array_key_exists('f-assessment-5',$fentry['detail']))?(('on'==$fentry['detail']['f-assessment-5'])?'<br />- fit for alternative duties with the following limitations:'.((array_key_exists('f-fittxt',$fentry['detail']))?$fentry['detail']['f-fittxt']:''):''):"");?>                          
                        	
                        </td>
					</tr> 
                    <tr>                        
						<td colspan="3">
                        	Grounds for the opinion in medical assessment: Claim is capable of finalisation
                        </td>
                    </tr>
                    <tr>        
                    	<td></td>            
						<td colspan="2">
                            <?= ((array_key_exists('f-assessment-6',$fentry['detail']))?(('on'==$fentry['detail']['f-assessment-6'])?'- No permanent impairment':''):"");?>
                            <?= ((array_key_exists('f-assessment-7',$fentry['detail']))?(('on'==$fentry['detail']['f-assessment-7'])?'<br />- Permanent impairment present':''):"");?>                          
                        	
                        </td>
					</tr>                      
                </table>
            </form>             
        </div>
        <?php endforeach; ?>
  </div><!-- /content -->
</div><!-- /page one -->