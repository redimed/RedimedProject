<?php if (array_key_exists('massessment',$data)):?>
<table  id="table" width="100%" border="0" cellspacing="0" cellpadding="0" >
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
<?php endif;?>
<?php if (array_key_exists('symptomology',$data)):?>
<table  id="table" width="100%" border="0" cellspacing="0" cellpadding="0" >
    <tr>
        <td width="182" align="right">                                    	                            	
            <label for="massessment">Symptomology:</label>
        </td>
        <td width="776" colspan="2"><span class="top"><?= ((array_key_exists('symptomology',$data))?$data['symptomology']:"");?></span></td>
    </tr>
    <tr>
        <td align="right">                                    	                            	
            <label for="massessment">Examination:</label>
        </td>
        <td colspan="2"><span class="top"><?= ((array_key_exists('examination',$data))?$data['examination']:"");?></span></td>
    </tr>
    <tr>
        <td align="right">                                    	                            	
            <label for="massessment">Differential Diagnosis:</label>
        </td>
        <td colspan="2"><span class="top"><?= ((array_key_exists('ddiagnosis',$data))?$data['ddiagnosis']:"");?></span></td>
    </tr>
    <tr>
    	<td colspan="3"><h4>Management plan</h4>
            <table width="100%">
          <tr>
                    <td align="right" width="131" >                                    	                            	
                        <label for="massessment">Medication:</label>
                    </td>
                    <td width="1221" colspan="2"><span class="top"><?= ((array_key_exists('medication',$data))?$data['medication']:"");?></span></td>
                </tr>
                <tr>
                    <td align="right">                                    	                            	
                        <label for="massessment">Physio/allied:</label>
                    </td>
                    <td colspan="2"><span class="top"><?= ((array_key_exists('physioallied',$data))?$data['physioallied']:"");?></span></td>
                </tr>
                <tr>
                    <td align="right">                                    	                            	
                        <label for="massessment">Duty restriction:</label>
                    </td>
                    <td colspan="2"><span class="top"><?= ((array_key_exists('dutyrestriction',$data))?$data['dutyrestriction']:"");?></span></td>
                </tr>
                <tr>
                    <td align="right">                                    	                            	
                        <label for="massessment">Recommendations:</label>
                    </td>
                    <td colspan="2"><span class="top"><?= ((array_key_exists('recommendation',$data))?$data['recommendation']:"");?></span></td>
                </tr>
                <tr>
                    <td align="right">                                    	                            	
                        <label for="massessment">Follow up/review:</label>
                    </td>
                    <td colspan="2"><span class="top"><?= ((array_key_exists('follow',$data))?$data['follow']:"");?></span></td>
                </tr>
                <tr>
                    <td align="right">                                    	                            	
                        <label for="massessment">Referrals:</label>
                    </td>
                    <td colspan="2"><span class="top"><?= ((array_key_exists('referrals',$data))?$data['referrals']:"");?></span></td>
                </tr>
            </table>
        </td>
    </tr>
</table>
<?php endif;?>