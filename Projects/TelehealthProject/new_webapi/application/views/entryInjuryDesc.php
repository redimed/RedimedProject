<table id="table" width="100%" border="0" cellspacing="0" cellpadding="0" class="rounded-corner">
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
    <tr>
        <td  align="right"><strong>Initial treatment provided</strong>:</td>                        
        <td  colspan="3"><?= ((array_key_exists('inittreatment',$data))?$data['inittreatment']:"");?></td>
    </tr>
    <tr>
        <td  align="right"><strong>Redflags</strong>:</td>                        
        <td  colspan="3"><?= $strredflags;?></td>
    </tr>
    <tr>
    	<td colspan="6">
   
        	 <?php foreach($images as $key => $imagedata) : ?>
             		<img src="data:image/jpg;base64,<?= str_replace(" ","+",$imagedata);?>" id="signImgImg"width="300px"/>
             <?php endforeach; ?>
        </td>
    </tr>
</table>