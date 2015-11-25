<table id="table" width="100%" border="0" cellspacing="0" cellpadding="0"> 
    <tr>                        
        <td colspan="3">
            Having examined the worker, it is my opinion that as from: <?= ((array_key_exists('f-from-date1',$pentry['detail']))?$pentry['detail']['f-from-date1']:'');?>
        </td>
    </tr>
    <tr>        
        <td width="100"></td>            
        <td colspan="2">
            <?= ((array_key_exists('f-assessment-1',$pentry['detail']))?(('on'==$pentry['detail']['f-assessment-1'])?'- the worker has wholly recovered from the effects of the disability.':''):"");?>
            <?= ((array_key_exists('f-assessment-2',$pentry['detail']))?(('on'==$pentry['detail']['f-assessment-2'])?'<br />- the worker has partially recovered from the effects of the disability.':''):"");?>
            <?= ((array_key_exists('f-assessment-3',$pentry['detail']))?(('on'==$pentry['detail']['f-assessment-3'])?'<br />- the worker\'s incapacity is no longer a result of the disability.':''):"");?>                            
            
        </td>
    </tr>
    <tr>                        
        <td colspan="3">
            It is also my opinion that as from <?= ((array_key_exists('f-from-date',$pentry['detail']))?$pentry['detail']['f-from-date']:'');?> the worker is:
        </td>
    </tr>
    <tr>        
        <td></td>            
        <td colspan="2">
            <?= ((array_key_exists('f-assessment-4',$pentry['detail']))?(('on'==$pentry['detail']['f-assessment-4'])?'- fit.':''):"");?>
            <?= ((array_key_exists('f-assessment-5',$pentry['detail']))?(('on'==$pentry['detail']['f-assessment-5'])?'<br />- fit for alternative duties with the following limitations:'.((array_key_exists('f-fittxt',$pentry['detail']))?$pentry['detail']['f-fittxt']:''):''):"");?>                          
            
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
            <?= ((array_key_exists('f-assessment-6',$pentry['detail']))?(('on'==$pentry['detail']['f-assessment-6'])?'- No permanent impairment':''):"");?>
            <?= ((array_key_exists('f-assessment-7',$pentry['detail']))?(('on'==$pentry['detail']['f-assessment-7'])?'<br />- Permanent impairment present':''):"");?>                          
            
        </td>
    </tr>                      
</table>