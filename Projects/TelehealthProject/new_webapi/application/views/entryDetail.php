<table id="table" width="100%" border="0" cellspacing="0" cellpadding="0" class="rounded-corner">
    <tr>
        <td class="top" width="150px" align="right"><strong>Service required</strong>:</td>
        <td class="top" colspan="3">
            <?= ((array_key_exists('require-1',$data))?(('on'==$data['require-1'])?'Trauma Consult, ':''):"")
				.((array_key_exists('require-2',$data))?(('on'==$data['require-2'])?'First Medical Certificate, ':''):"")
				.((array_key_exists('require-3',$data))?(('on'==$data['require-3'])?'Follow up in Perth, ':''):"")
				.((array_key_exists('require-4',$data))?(('on'==$data['require-4'])?'Fitness for work, ':''):"")
				.((array_key_exists('require-5',$data))?(('on'==$data['require-5'])?'Initial Telehealth Consult, ':''):"")
				.((array_key_exists('require-6',$data))?(('on'==$data['require-6'])?'Progress Telehealth Consult':''):"")
				.((array_key_exists('require-7',$data))?(('on'==$data['require-7'])?'Transport to/from Airport':''):"");?>
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
        <td width="150px" align="right"><strong>Occupation</strong>:</td>
        <td colspan="3">
            <?= ((array_key_exists('occupation',$data))?$data['occupation']:"");?>
        </td>
        <td width="120px" align="right"></td>
        <td></td>
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
        <td width="120px"><?= ((array_key_exists('email',$employer))?$employer['email']:"");?></td>
        <td width="70px" align="right"><strong>Phone</strong>:</td>
        <td><?= ((array_key_exists('phone',$employer))?$employer['phone']:"");?></td>
    </tr>
    <tr>
        <td width="150px" align="right"><strong> Membership No</strong>:</td>                        
        <td><?= ((array_key_exists('memno',$data))?$data['memno']:"");?></td>
        <td width="100px" align="right"><strong>Position No</strong>:</td>
        <td width="120px"><?= ((array_key_exists('posno',$data))?$data['posno']:"");?></td>
        <td width="70px" align="right"><strong>Expiry</strong>:</td>
        <td><?= ((array_key_exists('expiry',$data))?$data['expiry']:"");?></td>
    </tr>
    <tr>
        <td width="150px" align="right"><strong>Health Fund</strong>:</td>                        
        <td><?= ((array_key_exists('healFund',$data))?$data['healFund']:"");?></td>
        <td width="100px" align="right"><strong>Medicare</strong>:</td>
        <td width="120px"><?= ((array_key_exists('medicareno',$data))?$data['medicareno']:"");?></td>
        <td width="70px" align="right"><strong>VA No.</strong>:</td>
        <td><?= ((array_key_exists('vano',$data))?$data['vano']:"");?></td>
    </tr>
</table>