<table id="table" width="100%" border="0" cellspacing="0" cellpadding="0">
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