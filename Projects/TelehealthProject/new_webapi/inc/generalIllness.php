<?php
if (!($this->uri->segment(5))){
	$pdata=$data['data'];
}else{
	$this->load->model('progress_model');
	$progress = $this->progress_model->get($this->uri->segment(5));
	if (count($progress)>0){
		$json = $progress[0]['detail'];
		preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $json);

		//echo urldecode($json).'<br>';
		$progress[0]['detail'] = json_decode($json,true);
		//print_r($progress)
		$pdata = $progress[0]['detail'];
		$doctor = $this->member_model->get($pdata['drId']);
		if (count($doctor)>0){
			$temp = str_replace('\"','"',$doctor[0]['detail']);
			$temp = str_replace("\'",'\u0027',$temp);

			$temp = json_decode($temp,true);
			$pdata['drsign'] = array_key_exists('drsign', $temp)?$temp['drsign']:'';

		}else{
			$pdata['drsign'] = '';
		}
	}else
		$pdata = array();
}


// set background
// get the current page break margin
$pdf->AddPage();
$pdf->setPageMark();
$pdf->setPage(1);
$pdf->setPageOrientation("P",false,	'');
$bMargin = $pdf->getBreakMargin();
// get current auto-page-break mode
$auto_page_break = $pdf->getAutoPageBreak();
// disable auto-page-break
$pdf->SetAutoPageBreak(false, 0);
// set bacground image
$img_file = "images/FirstMedicalCertRebrandedWord.png";
$checkMark = "images/CheckMark.jpg";
$pdf->Image("images/header.png", 0, 0, 210, 22.5, '', '', '', false, 300, '', false, false, 0);
$pdf->Image("images/footer.png", 0, 267, 210, 30, '', '', '', false, 300, '', false, false, 0);
//set margins
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

// set the starting point for the page content

$html = file_get_contents("inc/illness.php");

$temp = ((array_key_exists('require-1',$pdata))?(('on'==$pdata['require-1'])?'Emergency Telehealth Consult, ':''):"")
		.((array_key_exists('require-2',$pdata))?(('on'==$pdata['require-2'])?'First Medical Certificate, ':''):"")
		.((array_key_exists('require-3',$pdata))?(('on'==$pdata['require-3'])?'Follow up in Perth, ':''):"")
		.((array_key_exists('require-4',$pdata))?(('on'==$pdata['require-4'])?'Initial Telehealth Consult, ':''):"")
		.((array_key_exists('require-5',$pdata))?(('on'==$pdata['require-5'])?'Transport to/from Airport':''):"");

$html = str_replace("##!!##SERVICE##!!##", $temp, $html);



//$html = str_replace("##!!##PATIENT##!!##", $salutation[$pdata['salut']-1].' '.$pdata['gname'].' '.$pdata['fname'], $html);
$html = str_replace("##!!##ADDRESS##!!##", ((array_key_exists('address',$pdata))?$pdata['address']:""), $html);
$html = str_replace("##!!##POSTCODE##!!##", ((array_key_exists('postcode',$pdata))?$pdata['postcode']:""), $html);
$html = str_replace("##!!##MOB##!!##", ((array_key_exists('mfone',$pdata))?$pdata['mfone']:""), $html);
$html = str_replace("##!!##NOK##!!##", ((array_key_exists('nok',$pdata))?$pdata['nok']:""), $html);
$html = str_replace("##!!##NAME##!!##", ((array_key_exists('name',$data['employer']))?$data['employer']['name']:''), $html);
$html = str_replace("##!!##IMA##!!##", ((array_key_exists('IMA',$data['employer']))?$data['employer']['IMA']:""), $html);
$html = str_replace("##!!##EMAIL##!!##", ((array_key_exists('email',$data['employer']))?$data['employer']['email']:""), $html);
$html = str_replace("##!!##MEMNO##!!##", ((array_key_exists('memno',$pdata))?$pdata['memno']:""), $html);
$html = str_replace("##!!##EXPIRY##!!##", ((array_key_exists('expiry',$pdata))?$pdata['expiry']:""), $html);
$html = str_replace("##!!##MEDICARE##!!##", ((array_key_exists('medicareno',$pdata))?$pdata['medicareno']:""), $html);
$html = str_replace("##!!##SECTION##!!##", ((array_key_exists('relation',$pdata))?((1==$pdata['relation'])?'Work related':'Not work related'):'Work related'), $html);
$html = str_replace("##!!##DOB##!!##", ((array_key_exists('dob',$pdata))?$pdata['dob']:""), $html);
$html = str_replace("##!!##SUBURB##!!##", ((array_key_exists('suburb',$pdata))?$pdata['suburb']:""), $html);
$html = str_replace("##!!##HOME##!!##", ((array_key_exists('hfone',$pdata))?$pdata['hfone']:""), $html);
$html = str_replace("##!!##WORK##!!##", ((array_key_exists('wfone',$pdata))?$pdata['wfone']:""), $html);
$html = str_replace("##!!##NOKPHONE##!!##", ((array_key_exists('Kfone',$pdata))?$pdata['Kfone']:""), $html);
$html = str_replace("##!!##INSURER##!!##", ((array_key_exists('insurer',$data['employer']))?$data['employer']['insurer']:""), $html);
$html = str_replace("##!!##CADDRESS##!!##", ((array_key_exists('address',$data['employer']))?$data['employer']['address']:""), $html);
$html = str_replace("##!!##CPHONE##!!##", ((array_key_exists('phone',$data['employer']))?$data['employer']['phone']:""), $html);
$html = str_replace("##!!##POSNO##!!##", ((array_key_exists('posno',$pdata))?$pdata['posno']:""), $html);
$html = str_replace("##!!##HEALTHFUND##!!##", ((array_key_exists('healFund',$pdata))?$pdata['healFund']:""), $html);
$html = str_replace("##!!##VANO##!!##", ((array_key_exists('vano',$pdata))?$pdata['vano']:""), $html);

$html = str_replace("##!!##DATE##!!##", ((array_key_exists('adate',$pdata))?$pdata['adate']:""), $html);
$temp = ((array_key_exists('gillness-1',$pdata))?(('on'==$pdata['gillness-1'])?'Headache, ':''):"")
			.((array_key_exists('gillness-2',$pdata))?(('on'==$pdata['gillness-2'])?'Nausea, ':''):"")
			.((array_key_exists('gillness-3',$pdata))?(('on'==$pdata['gillness-3'])?'Fatigue, ':''):"")
			.((array_key_exists('gillness-4',$pdata))?(('on'==$pdata['gillness-4'])?'Fever, ':''):"")
			.((array_key_exists('gillness-5',$pdata))?(('on'==$pdata['gillness-5'])?'Sore throat, ':''):"")
			.((array_key_exists('gillness-6',$pdata))?(('on'==$pdata['gillness-6'])?'Cough, ':''):"")
			.((array_key_exists('gillness-7',$pdata))?(('on'==$pdata['gillness-7'])?'Sinus congestion, ':''):"")
			.((array_key_exists('gillness-8',$pdata))?(('on'==$pdata['gillness-8'])?'Body aches, ':''):"")
			.((array_key_exists('gillness-9',$pdata))?(('on'==$pdata['gillness-9'])?'Vomiting, ':''):"")
			.((array_key_exists('gillness-10',$pdata))?(('on'==$pdata['gillness-10'])?'Light headedness, ':''):"")
			.((array_key_exists('gillness-11',$pdata))?(('on'==$pdata['gillness-11'])?'Diarrhea, ':''):"")
			.((array_key_exists('gillness-12',$pdata))?(('on'==$pdata['gillness-12'])?'Shortness of breath, ':''):"")
			.((array_key_exists('gillness-13',$pdata))?(('on'==$pdata['gillness-13'])?'Chest pain, ':''):"")
			.((array_key_exists('gillness-14',$pdata))?(('on'==$pdata['gillness-14'])?'Abdomen pain, ':''):"")
			.((array_key_exists('gillness-15',$pdata))?(('on'==$pdata['gillness-15'])?'Ear pain, ':''):"")
			.((array_key_exists('gillness-16',$pdata))?(('on'==$pdata['gillness-16'])?'Low mood, ':''):"")
			.((array_key_exists('gillness-17',$pdata))?(('on'==$pdata['gillness-17'])?'Decreased appetite, ':''):"")
			.((array_key_exists('gillness-18',$pdata))?(('on'==$pdata['gillness-18'])?'Feeling depressed, ':''):"")
			.((array_key_exists('gillness-19',$pdata))?(('on'==$pdata['gillness-19'])?'Tooth pain. ':''):"")
			.((array_key_exists('gillnesstxt',$pdata))?$pdata['gillnesstxt']:"");

$html = str_replace("##!!##SYMPTOM##!!##", $temp, $html);
$temp = ((array_key_exists('hr',$pdata))?'HR(bpm): '.$pdata['hr']:"")
			.((array_key_exists('temp',$pdata))?'. Temp(C<sup>o</sup>): '.$pdata['temp']:"")
			.((array_key_exists('rr',$pdata))?'. RR: '.$pdata['rr']:"")
			.((array_key_exists('sao2',$pdata))?'. SaO<sub>2</sub>(%): '.$pdata['sao2']:"");

$html = str_replace("##!!##VITAL##!!##", $temp, $html);
$temp = ((array_key_exists('mhistory-1',$pdata))?(('on'==$pdata['mhistory-1'])?'Asthma, ':''):"")
			.((array_key_exists('mhistory-2',$pdata))?(('on'==$pdata['mhistory-2'])?'Epilepsy, ':''):"")
			.((array_key_exists('mhistory-3',$pdata))?(('on'==$pdata['mhistory-3'])?'Heart Condition, ':''):"")
			.((array_key_exists('mhistory-4',$pdata))?(('on'==$pdata['mhistory-4'])?'High Cholesterol, ':''):"")
			.((array_key_exists('mhistory-5',$pdata))?(('on'==$pdata['mhistory-5'])?'Diabetes type I, ':''):"")
			.((array_key_exists('mhistory-6',$pdata))?(('on'==$pdata['mhistory-6'])?'Diabetes type II, ':''):"")
			.((array_key_exists('mhistory-7',$pdata))?(('on'==$pdata['mhistory-7'])?'High blood pressure, ':''):"")
			.((array_key_exists('mhistory-8',$pdata))?(('on'==$pdata['mhistory-8'])?'Arthritis, ':''):"")
			.((array_key_exists('mhistory-9',$pdata))?(('on'==$pdata['mhistory-9'])?'Blood Condition. ':''):"")
			.((array_key_exists('mhistorytx',$pdata))?$pdata['mhistorytx']:"");

$html = str_replace("##!!##MEDICALHIS##!!##", $temp, $html);
$html = str_replace("##!!##MEDICATION##!!##", ((array_key_exists('medications',$pdata))?$pdata['medications']:""), $html);
$html = str_replace("##!!##ALLERGIES##!!##", ((array_key_exists('allergies',$pdata))?$pdata['allergies']:""), $html);
$html = str_replace("##!!##SYMTOMOLOGY##!!##", ((array_key_exists('symptomology',$pdata))?$pdata['symptomology']:""), $html);
$html = str_replace("##!!##EXAMINATION##!!##", ((array_key_exists('examination',$pdata))?$pdata['examination']:""), $html);
$html = str_replace("##!!##DDIAGNOSIS##!!##", ((array_key_exists('ddiagnosis',$pdata))?$pdata['ddiagnosis']:""), $html);
$html = str_replace("##!!##MMEDICATION##!!##", ((array_key_exists('medication',$pdata))?$pdata['medication']:""), $html);
$html = str_replace("##!!##PHYSIO##!!##", ((array_key_exists('physioallied',$pdata))?$pdata['physioallied']:""), $html);
$html = str_replace("##!!##DRESTRICTION##!!##", ((array_key_exists('dutyrestriction',$pdata))?$pdata['dutyrestriction']:""), $html);
$html = str_replace("##!!##RECOMMENDATION##!!##", ((array_key_exists('recommendation',$pdata))?$pdata['recommendation']:""), $html);
$html = str_replace("##!!##FOLLOWUP##!!##", ((array_key_exists('follow',$pdata))?$pdata['follow']:""), $html);
$html = str_replace("##!!##REFERRAL##!!##", ((array_key_exists('referrals',$pdata))?$pdata['referrals']:""), $html);
//print_r($pdata['drsign'].'s');
if (''!=$pdata['drsign']){
	//$imgdata = base64_decode(substr($pdata['drsigntxt'],22));
	//$imgdata = str_replace(' ','+',$imgdata);

	$imgdata = $drsign;
	$imgdata = str_replace(' ','+',$imgdata);

	preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $imgdata);

	//echo $imgdata;
	copy("data:image/png;base64,".$imgdata,"output/temp.jpg");

	//file_put_contents("output/temp.png", $imgdata);
	//fclose($image);
	list($width, $height, $type, $attr)= getimagesize("output/temp.jpg");
	//echo substr($pdata['drsigntxt'],22);
	$pdf->Image("output/temp.jpg", 136, 275, 20, 20*$height/$width, '', '', '', false, 300, '', false, false, 0);
	//$pdf->Image("output/temp.png", 10, 10, 50, 20, '', '', '', false, 300, '', false, false, 0);
	//$pdf->Image('@'.$imgdata);
}
//$pdf->writeHTMLCell($w=100, $h=0, $x=15, $y=30,$html, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTML("<br><br><br>".$html, true, false, true, false, '');
// redimed's detail
//$pdf->SetXY(33,267,'false');
//$pdf->Write (10, ((array_key_exists('dname',$pdata))?$pdata['dname']:""), $link='', $fill=false, $align='', $ln=false, $stretch=0, $firstline=false, $firstblock=false, $maxh=0, $wadj=0, $margin='');
$pdf->writeHTMLCell($w=70, $h=0, $x=33, $y=267, ((array_key_exists('dname',$pdata))?$pdata['dname']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=70, $h=0, $x=143, $y=267, ((array_key_exists('dcode',$pdata))?$pdata['dcode']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=70, $h=0, $x=33, $y=270, ((array_key_exists('daddress',$pdata))?$pdata['daddress']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=70, $h=0, $x=33, $y=274, "(08) 9230 0900", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=70, $h=0, $x=125, $y=274, "(08)9230 0999", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

$pdf->writeHTMLCell($w=40, $h=0, $x=57, $y=277.5, ((array_key_exists('examdate',$pdata))?$pdata['examdate']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=40, $h=0, $x=73, $y=277.5, ((array_key_exists('examtime',$pdata))?$pdata['examtime']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
?>