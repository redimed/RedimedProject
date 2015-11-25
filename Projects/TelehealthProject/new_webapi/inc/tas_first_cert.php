<?php

$pdf->SetAutoPageBreak(TRUE, 1);
$pdf->setPage(1);
$pdf->SetFontSize(9, true);
$checkMark = "images/checkmarkalone.png";
//$pdata =$pdata;
// start printing data/
$pdf->writeHTMLCell($w=80, $h=0, $x=15, $y=56, $pdata['gname']." ".$pdata['fname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

$pdf->writeHTMLCell($w=80, $h=8, $x=15, $y=70, $data['employer']['name'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // employer's detail
// examdate
$xarray = array(56,58,65,67,74,76,78,80);
if (array_key_exists('examdate',$pdata)){
	$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['examdate'])));
	for ($i = 0; $i<strlen($dob); $i++)  {
		$character = substr($dob, $i,1);
		$pdf->writeHTMLCell($w=60, $h=0, $x=$xarray[$i], $y=83, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
	}
}
// psymptoms
if (array_key_exists('psymptoms',$pdata))
	$pdf->writeHTMLCell($w=85, $h=8, $x=15, $y=92, $pdata['psymptoms'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// diagnosis
if ($pdata['diagnosis']==1){
	$pdf->Image($checkMark, 28, 103.5, 3, 3, '', '', '', false, 300, '', false, false, 0);
}else{
	$pdf->Image($checkMark, 47.5, 103.5, 3, 3, '', '', '', false, 300, '', false, false, 0);
}
// diagnosisdetails
if (array_key_exists('diagnosisdetails',$pdata))
	$pdf->writeHTMLCell($w=85, $h=8, $x=15, $y=114, $pdata['diagnosisdetails'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$checkboxes = array(array(13.5,184,1),
					array(13.5,189,1),
					array(13.5, 208,1),
					array(13.5, 231,1),
					array(13.5, 235,1), //5
					array(13.5, 239,1),
					array(13.5, 276.5,0),
					array(111.5, 50,1),
					array(111.5, 57,1),
					array(111.5, 62,1), //10
					array(111.5, 96,1),
					array(111.5, 129.5,1),
					array(111.5, 203.5,1),
					array(159, 203.5,1),
					);
//checkboxes
// 26/04/2013 assessment 14 error so changed to $key + 1 instead of 11
foreach ($checkboxes as $key=>$value){
	if ($pdata['assessment-'.($key+1)]=='on'){
		$pdf->Image($checkMark, $value[0], $value[1], 3, 3, '', '', '', false, 300, '', false, false, 0);
	}else{
		if ($value[2]==0)
			$pdf->Image($checkMark, 13.5, 281, 3, 3, '', '', '', false, 300, '', false, false, 0);
	}
}
// adate
$xarray = array(57,59,66,68,75,77,79,81);
if (array_key_exists('adate',$pdata)){
	$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['adate'])));
	for ($i = 0; $i<strlen($dob); $i++)  {
		$character = substr($dob, $i,1);
		$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=137, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
	}
}
// adate2
$xarray = array(57,59,66,68,75,77,79,81);
if (array_key_exists('adate',$pdata)){
	$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['adate'])));
	for ($i = 0; $i<strlen($dob); $i++)  {
		$character = substr($dob, $i,1);
		$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=146, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
	}
}
// reason
if (array_key_exists('reason',$pdata))
	$pdf->writeHTMLCell($w=85, $h=8, $x=15, $y=161, $pdata['reason'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// reason1
if (array_key_exists('reason1',$pdata))
	$pdf->writeHTMLCell($w=85, $h=8, $x=15, $y=195, $pdata['reason1'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// reason2
if (array_key_exists('reason2',$pdata))
	$pdf->writeHTMLCell($w=85, $h=8, $x=15, $y=213, $pdata['reason2'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// historytxt
if (array_key_exists('historytxt',$pdata))
	$pdf->writeHTMLCell($w=85, $h=8, $x=15, $y=250, $pdata['historytxt'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// workplacecontact
if (array_key_exists('workplacecontact',$pdata))
	$pdf->writeHTMLCell($w=45, $h=8, $x=27, $y=277, $pdata['workplacecontact'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// contactdate
if (""!=$pdata['contactdate']){
$xarray = array(77,79,86,88,94,96,98,100);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['contactdate'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=277.5, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
}
// fitdatefrom1
if (""!=$pdata['fitdatefrom1']){
$xarray = array(126,128,134,136,142,144,146,148);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['fitdatefrom1'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=67.5, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
}
// fitdateto1
if (""!=$pdata['fitdateto1']){
$xarray = array(161,163,169,171,176,178,180,182);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['fitdateto1'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=67.5, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
}
// restrictionstxt
if (array_key_exists('restrictionstxt',$pdata))
	$pdf->writeHTMLCell($w=85, $h=8, $x=113, $y=82, $pdata['restrictionstxt'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// reason3
if (array_key_exists('reason3',$pdata))
	$pdf->writeHTMLCell($w=85, $h=8, $x=113, $y=116, $pdata['reason3'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// fitdatefrom2
if (""!=$pdata['fitdatefrom2']){
$xarray = array(118,120,126,128,134,136,138,140);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['fitdatefrom2'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=102, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
}
// fitdateto2
if (""!=$pdata['fitdateto2']){
$xarray = array(154,156,161,163,169,171,173,175);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['fitdateto2'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=102, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
}
// fitdatefrom3
if (""!=$pdata['fitdatefrom3']){
$xarray = array(172,174,181,183,189,191,193,195);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['fitdatefrom3'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=132, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
}
//consulted
if ($pdata['consulted']==2){
	$pdf->Image($checkMark, 112.5, 155, 3, 3, '', '', '', false, 300, '', false, false, 0);
}else{
	$pdf->Image($checkMark, 112.5, 149.5, 3, 3, '', '', '', false, 300, '', false, false, 0);
}
// consulteddetail
if (array_key_exists('consulteddetail',$pdata))
	$pdf->writeHTMLCell($w=60, $h=8, $x=136, $y=148, $pdata['consulteddetail'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// medication
if (array_key_exists('medication',$pdata))
	$pdf->writeHTMLCell($w=85, $h=8, $x=113, $y=167, $pdata['medication'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// GPname
if (array_key_exists('GPname',$pdata))
	$pdf->writeHTMLCell($w=85, $h=8, $x=137, $y=185, $pdata['GPname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// GPdetails
if (array_key_exists('GPdetails',$pdata))
	$pdf->writeHTMLCell($w=85, $h=8, $x=124, $y=192, $pdata['GPdetails'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// reviewdate
$xarray = array(129,131,139,141,146,148,150,152);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['reviewdate'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=205, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// examdate
$xarray = array(175,177,184,186,192,194,196,198);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['examdate'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=225, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// examdate
$xarray = array(175,177,184,186,192,194,196,198);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['examdate'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=238, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}

if (array_key_exists('signtxt',$pdata)&& (''!=$pdata['signtxt'])){
	$imgdata = $pdata['signtxt'];
	$imgdata = str_replace(' ','+',$imgdata);

	preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $imgdata);

	copy("data:image/png;base64,".$imgdata,"output/temp2.png");
	list($width, $height, $type, $attr)= getimagesize("output/temp2.png");
	//echo substr($pdata['drsigntxt'],22);
	$pdf->Image("output/temp2.png", 130, 224, 10, 10*$height/$width, '', '', '', false, 300, '', false, false, 0);
}

if (''!=$drsign){

	$imgdata = $drsign;
	$imgdata = str_replace(' ','+',$imgdata);

	preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $imgdata);
	copy("data:image/png;base64,".$imgdata,"output/temp.png");
	list($width, $height, $type, $attr)= getimagesize("output/temp.png");
	$pdf->Image("output/temp.png", 130, 237, 10, 10*$height/$width, '', '', '', false, 300, '', false, false, 0);
}

// redimed's detail
$pdf->writeHTMLCell($w=70, $h=0, $x=127, $y=252.5, ((array_key_exists('dname', $pdata))? $pdata['dname']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=70, $h=0, $x=127, $y=257, ((array_key_exists('daddress', $pdata))? $pdata['daddress']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=50, $h=0, $x=178, $y=275.5, ((array_key_exists('dcode', $pdata))? $pdata['dcode']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=50, $h=0, $x=124, $y=271, '0892300900', $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=50, $h=0, $x=168, $y=271, '0892300999', $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
?>