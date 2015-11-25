<table  id="table" width="100%" border="0" cellspacing="0" cellpadding="0" >
    <tr>
        <td width="173" align="right">                                    	                            	
            <label for="massessment">Symptomology:</label>
        </td>
        <td width="785" colspan="2"><span class="top"><?= ((array_key_exists('symptomology',$data))?$data['symptomology']:"");?></span></td>
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