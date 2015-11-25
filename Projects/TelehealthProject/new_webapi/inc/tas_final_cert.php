<?php

$pdf->SetAutoPageBreak(TRUE, 1);
$pdf->setPage(1);
$pdf->SetFontSize(9, true);
$checkMark = "images/checkmarkalone.png";
//$pdata =$pdata;
// start printing data/
$pdf->writeHTMLCell($w=80, $h=0, $x=15, $y=58, $pdata['gname']." ".$pdata['fname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

$pdf->writeHTMLCell($w=80, $h=8, $x=15, $y=70, $data['employer']['name'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // employer's detail
// examdate
$xarray = array(56,58,65,67,74,76,78,80);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['examdate'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=60, $h=0, $x=$xarray[$i], $y=83, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// psymptoms
if (array_key_exists('psymptoms',$pdata))
	$pdf->writeHTMLCell($w=85, $h=0, $x=15, $y=92, $pdata['psymptoms'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// pdiagnosis
if (array_key_exists('pdiagnosis',$pdata))
	$pdf->writeHTMLCell($w=85, $h=0, $x=15, $y=110, $pdata['pdiagnosis'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// diagnosisdetails
if (array_key_exists('diagnosisdetails',$pdata))
	$pdf->writeHTMLCell($w=85, $h=0, $x=15, $y=132, $pdata['diagnosisdetails'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// diagnosis
if ($pdata['diagnosis']==2){
	$pdf->Image($checkMark, 52, 123, 3, 3, '', '', '', false, 300, '', false, false, 0);
}else{
	$pdf->Image($checkMark, 65, 123, 3, 3, '', '', '', false, 300, '', false, false, 0);
}

$checkboxes = array(array(13.5,157.5,0),
					array(13.5,187.5,1),
					array(13.5, 192.5,1),
					array(13.5, 204.5,1),
					array(13.5, 238.5,1), //5
					array(13.5, 246,1),
					array(111.5, 193,1.5),
					array(111.5, 200.5,1),
					array(111.5, 209,1),
					array(111.5, 214.5,1), //10
					);
//checkboxes
foreach ($checkboxes as $key=>$value){
	//echo $key."-";
	if ($pdata['assessment-'.($key+11)]=='on'){

		$pdf->Image($checkMark, $value[0], $value[1], 3, 3, '', '', '', false, 300, '', false, false, 0);
	}else{
		if ($value[2]==0)
			$pdf->Image($checkMark, 13.5, 163, 3, 3, '', '', '', false, 300, '', false, false, 0);
	}
}

// workplacecontact
if (array_key_exists('workplacecontact',$pdata))
	$pdf->writeHTMLCell($w=45, $h=8, $x=27, $y=158, $pdata['workplacecontact'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// contactdate
$xarray = array(77,79,86.5,88.5,95,97,99,101);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['contactdate'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=159, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// fitdatefrom1
$xarray = array(28,30,37,39,45,47,49,51);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['fitdatefrom1'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=199, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// fitdateto1
$xarray = array(64,66,71,73,80,82,84,86);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['fitdateto1'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=199, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// fitdatefrom2
$xarray = array(28,30,37,39,45,47,49,51);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['fitdatefrom2'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=211, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// fitdateto2
$xarray = array(64,66,71,73,80,82,84,86);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['fitdateto2'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=211, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// reason1
if (array_key_exists('reason1',$pdata))
	$pdf->writeHTMLCell($w=85, $h=0, $x=15, $y=225, $pdata['reason1'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// fitdatefrom3
$xarray = array(73,75,82,84,90,92,94,96);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['fitdatefrom3'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=240, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// fitdatefrom4
$xarray = array(67,69,75,77,84,86,88,90);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['fitdatefrom4'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=247, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// permanent
if ($pdata['permanent']==2){
	$pdf->Image($checkMark, 45, 252, 3, 3, '', '', '', false, 300, '', false, false, 0);
}else{
	$pdf->Image($checkMark, 58, 252, 3, 3, '', '', '', false, 300, '', false, false, 0);
}
// fulltime
if ($pdata['fulltime']==2){
	$pdf->Image($checkMark, 35, 264, 3, 3, '', '', '', false, 300, '', false, false, 0);
}else{
	$pdf->Image($checkMark, 53, 264, 3, 3, '', '', '', false, 300, '', false, false, 0);
}
// graduated
if ($pdata['graduated']==2){
	$pdf->Image($checkMark, 35, 268, 3, 3, '', '', '', false, 300, '', false, false, 0);
}else{
	$pdf->Image($checkMark, 53, 268, 3, 3, '', '', '', false, 300, '', false, false, 0);
}
// reason1
if (array_key_exists('hdfrom1',$pdata))
	$pdf->writeHTMLCell($w=10, $h=0, $x=40, $y=281, $pdata['hdfrom1'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
if (array_key_exists('hdto1',$pdata))
	$pdf->writeHTMLCell($w=10, $h=0, $x=57, $y=281, $pdata['hdto1'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
if (array_key_exists('hdfrom2',$pdata))
	$pdf->writeHTMLCell($w=10, $h=0, $x=75, $y=281, $pdata['hdfrom2'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
if (array_key_exists('hdto2',$pdata))
	$pdf->writeHTMLCell($w=10, $h=0, $x=92, $y=281, $pdata['hdto2'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

if (array_key_exists('dwfrom1',$pdata))
	$pdf->writeHTMLCell($w=10, $h=0, $x=40, $y=285, $pdata['dwfrom1'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
if (array_key_exists('dwto1',$pdata))
	$pdf->writeHTMLCell($w=10, $h=0, $x=57, $y=285, $pdata['dwto1'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
if (array_key_exists('dwfrom1',$pdata))
	$pdf->writeHTMLCell($w=10, $h=0, $x=75, $y=285, $pdata['dwfrom2'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
if (array_key_exists('dwto2',$pdata))
	$pdf->writeHTMLCell($w=10, $h=0, $x=92, $y=285, $pdata['dwto2'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

if (array_key_exists('weekfrom1',$pdata))
	$pdf->writeHTMLCell($w=10, $h=0, $x=43, $y=275.5, $pdata['weekfrom1'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
if (array_key_exists('weekto1',$pdata))
	$pdf->writeHTMLCell($w=10, $h=0, $x=63, $y=275.5, $pdata['weekto1'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
if (array_key_exists('weekfrom2',$pdata))
	$pdf->writeHTMLCell($w=10, $h=0, $x=79, $y=275.5, $pdata['weekfrom2'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
if (array_key_exists('weekto2',$pdata))
	$pdf->writeHTMLCell($w=10, $h=0, $x=97, $y=275.5, $pdata['weekto2'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//break
if ($pdata['break']==2){
	$pdf->Image($checkMark, 111.8, 36, 3, 3, '', '', '', false, 300, '', false, false, 0);
}else{
	$pdf->Image($checkMark, 173.6, 36, 3, 3, '', '', '', false, 300, '', false, false, 0);
}
//break mins
if (array_key_exists('mins',$pdata))
	$pdf->writeHTMLCell($w=10, $h=0, $x=123, $y=36, $pdata['mins'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//break hours
if (array_key_exists('hrs',$pdata))
	$pdf->writeHTMLCell($w=10, $h=0, $x=147, $y=36, $pdata['hrs'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

$checkboxes2 = array(44.5,48,51.5,55.5,59.5,63.5,67.7, 71.5,75.5,79.5,83);
//reduce capacity checkboxes
foreach ($checkboxes2 as $key=>$value){
	if ($pdata['cap'.($key+1)]=='2'){
		$pdf->Image($checkMark, 173.5, $value, 3, 3, '', '', '', false, 300, '', false, false, 0);
	}else{
		$pdf->Image($checkMark, 186.5, $value, 3, 3, '', '', '', false, 300, '', false, false, 0);
	}
}
// comments
if (array_key_exists('comments',$pdata))
	$pdf->writeHTMLCell($w=85, $h=0, $x=113, $y=93, $pdata['comments'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

// impedimentsdetails
if (array_key_exists('impedimentsdetails',$pdata))
	$pdf->writeHTMLCell($w=65, $h=0, $x=135, $y=113.5, $pdata['impedimentsdetails'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
if ($pdata['impediments']=='2'){
	$pdf->Image($checkMark, 112.6, 113.5, 3, 3, '', '', '', false, 300, '', false, false, 0);
}else{
	$pdf->Image($checkMark, 112.6, 118.5, 3, 3, '', '', '', false, 300, '', false, false, 0);
}
// consulteddetails
if (array_key_exists('consulteddetails',$pdata))
	$pdf->writeHTMLCell($w=65, $h=0, $x=135, $y=138, $pdata['consulteddetails'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
if ($pdata['consulted']=='2'){
	$pdf->Image($checkMark, 112.6, 138, 3, 3, '', '', '', false, 300, '', false, false, 0);
}else{
	$pdf->Image($checkMark, 112.6, 143.5, 3, 3, '', '', '', false, 300, '', false, false, 0);
}
// comments
if (array_key_exists('treatment',$pdata))
	$pdf->writeHTMLCell($w=85, $h=0, $x=113, $y=156, $pdata['treatment'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// GP
if (array_key_exists('GP',$pdata))
	$pdf->writeHTMLCell($w=65, $h=0, $x=135, $y=174, $pdata['GP'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
if (array_key_exists('GPdetails',$pdata))
	$pdf->writeHTMLCell($w=65, $h=0, $x=125, $y=181, $pdata['GPdetails'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

// proceduredetails
if (array_key_exists('proceduredetails',$pdata))
	$pdf->writeHTMLCell($w=65, $h=0, $x=133, $y=194, $pdata['proceduredetails'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// scheduled
$xarray = array(157,159,167,169,174,176,178,180);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['scheduled'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=202, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// reviewdate
$xarray = array(128,130,138,140,146,148,150,152);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['reviewdate'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=210.5, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// examdate
$xarray = array(175,177,184,186,192,194,196,198);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['examdate'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=239, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// examdate
$xarray = array(175,177,184,186,192,194,196,198);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['examdate'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=252, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}

if (array_key_exists('signtxt',$pdata)&& (''!=$pdata['signtxt'])){
	$imgdata = $pdata['signtxt'];
	$imgdata = str_replace(' ','+',$imgdata);

	preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $imgdata);

	copy("data:image/png;base64,".$imgdata,"output/temp2.png");
	list($width, $height, $type, $attr)= getimagesize("output/temp2.png");
	//echo substr($pdata['drsigntxt'],22);
	$pdf->Image("output/temp2.png", 128, 238, 10, 10*$height/$width, '', '', '', false, 300, '', false, false, 0);
}

if (''!=$drsign){

	$imgdata = $drsign;
	$imgdata = str_replace(' ','+',$imgdata);

	preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $imgdata);
	copy("data:image/png;base64,".$imgdata,"output/temp.png");
	list($width, $height, $type, $attr)= getimagesize("output/temp.png");
	$pdf->Image("output/temp.png", 128, 251, 10, 10*$height/$width, '', '', '', false, 300, '', false, false, 0);
}

// redimed's detail
$pdf->writeHTMLCell($w=70, $h=0, $x=127, $y=266.5, ((array_key_exists('dname', $pdata))? $pdata['dname']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=70, $h=0, $x=127, $y=271, ((array_key_exists('daddress', $pdata))? $pdata['daddress']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=50, $h=0, $x=178, $y=286, ((array_key_exists('dcode', $pdata))? $pdata['dcode']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=50, $h=0, $x=124, $y=281.5, '0892300900', $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=50, $h=0, $x=168, $y=281.5, '0892300999', $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
?>