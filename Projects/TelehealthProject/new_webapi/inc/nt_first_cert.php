<?php
function getAge($birthday) {

	$birthday = str_replace('/', '-', $birthday);
	return floor((strtotime(date('d-m-Y')) - strtotime($birthday))/(60*60*24*365.2421896));
}
$pdf->SetAutoPageBreak(TRUE, 1);
$pdf->setPage(1);
$pdf->SetFontSize(9, true);
$checkMark = "images/CheckMark.jpg";
$pdata =$data['data'];
// start printing data/
/*
if (1==$this->uri->segment(4)){
	$pdf->Image($checkMark, 145, 69, 4, 4, '', '', '', false, 300, '', false, false, 0);
}
*/
$pdf->writeHTMLCell($w=80, $h=0, $x=50, $y=66, $data['data']['fname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // last name

$pdf->writeHTMLCell($w=80, $h=0, $x=50, $y=72, $data['data']['gname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // first name

// dob
$xarray = array(167.5,169.5,178,180,188,190,192,194);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['dob'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=60, $h=0, $x=$xarray[$i], $y=66, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}


$pdf->writeHTMLCell($w=60, $h=0, $x=50, $y=78, $data['data']['address'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=60, $h=0, $x=136, $y=78, $data['data']['suburb'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=60, $h=0, $x=182, $y=78, $data['data']['postcode'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
/*
for ($i = 0; $i<strlen($data['data']['medicareno']); $i++)  {
    $character = substr($data['data']['medicareno'], $i,1);
	$pdf->writeHTMLCell($w=60, $h=0, $x=(16+$i*5.4), $y=124.5, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
*/
$pdf->writeHTMLCell($w=60, $h=0, $x=111, $y=84, $data['data']['occupation'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

$pdf->writeHTMLCell($w=120, $h=8, $x=70, $y=96, $data['employer']['name'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // employer's detail
$pdf->Rect($x=65, $y=102, $w=120, $h=4, 'F', null, array(255, 255, 255));
$pdf->writeHTMLCell($w=120, $h=8, $x=65, $y=102, $data['employer']['address'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // employer's detail

// date of injury
$xarray = array(91,93,101,103,112,114,116,118);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['adate'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=60, $h=0, $x=$xarray[$i], $y=114, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// location of injury
if (array_key_exists('alocation',$data['data']))
	$pdf->writeHTMLCell($w=100, $h=8, $x=101, $y=120, $data['data']['alocation'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// description of injury
$tempstr = "";
$tempstr = ((array_key_exists('injdesc-1',$data['data']))?(('on'==$data['data']['injdesc-1'])?'Sprain/Strain, ':''):"")
			.((array_key_exists('injdesc-2',$data['data']))?(('on'==$data['data']['injdesc-2'])?'Laceration, ':''):"")
			.((array_key_exists('injdesc-3',$data['data']))?(('on'==$data['data']['injdesc-3'])?'Crush, ':''):"")
			.((array_key_exists('injdesc-4',$data['data']))?(('on'==$data['data']['injdesc-4'])?'Fall. ':''):"")
			.((array_key_exists('injdesctxt',$data['data']))?$data['data']['injdesctxt']:"");
$pdf->writeHTMLCell($w=100, $h=8, $x=90, $y=132, $tempstr, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// reason of injury
if (array_key_exists('reason',$data['data']))
	$pdf->writeHTMLCell($w=100, $h=8, $x=110, $y=149, $data['data']['reason'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

// examdate

$xarray = array(152,154,162,164,175,177,179,181);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['examdate'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=60, $h=0, $x=$xarray[$i], $y=172, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
//exam time
$pdf->Rect($x=86, $y=172, $w=40, $h=4, 'F', null, array(255, 255, 255));
$pdf->writeHTMLCell($w=40, $h=8, $x=86, $y=172, $data['data']['examtime'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // employer's detail
$checkboxes = array(array(84,178,1),
					array(140,178,1),
					array(20.5, 184,1),
					array(20.5, 36,2),
					array(20.5, 41,2), //5
					array(20.5, 45.5,2),
					array(20.5, 55.5,2),
					array(28, 69.2,2),
					array(28, 73.7,2),
					array(28, 78.2,2), //10
					array(28, 82.7,2),
					array(28, 87.2,2),
					array(28, 91.9,2),
					array(20.5, 96.6,2),
					array(24.5, 119,2), //15
					array(24.5, 123.7,2),
					array(24.5, 139.5,2),
					array(24.5, 150.5,2),
					array(24.5, 162,2),
					array(24.5, 173.7,2), //20
					array(24.5, 179.5,2),
					array(30.5, 183.2,2),
					array(30.5, 192.2,2),
					array(30.5, 200,2),
					array(24.5, 206,2), //25
					);
//checkboxes
foreach ($checkboxes as $key=>$value){
	if ($data['data']['assessment-'.($key+1)]=='on'){
		$pdf->setPage($value[2]);
		$pdf->Image($checkMark, $value[0], $value[1], 4, 4, '', '', '', false, 300, '', false, false, 0);
	}
}
$pdf->setPage(1);

// cause comment
$pdf->writeHTMLCell($w=120, $h=0, $x=76, $y=184, $data['data']['uncertaincomment'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// history
$pdf->writeHTMLCell($w=120, $h=0, $x=64, $y=195, $data['data']['history'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// prior history
$pdf->writeHTMLCell($w=100, $h=0, $x=86, $y=207, $data['data']['priorhistory'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// examination
$pdf->writeHTMLCell($w=150, $h=0, $x=44, $y=218, $data['data']['examination'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// investigations
$pdf->writeHTMLCell($w=150, $h=0, $x=44, $y=230, $data['data']['investigations'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// diagnosis
$pdf->writeHTMLCell($w=150, $h=0, $x=40, $y=241, $data['data']['diagnosis'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// complications
$pdf->writeHTMLCell($w=150, $h=0, $x=44, $y=252, $data['data']['complications'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

$pdf->setPage(2);
// fromdate 1
$xarray = array(30,32,42,44,52,54,56,58);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['fromdate1'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=50, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// todate 1
$xarray = array(68,70,79,81,89.5,91.5,93.5,95.5);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['todate1'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=50, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// days
$pdf->writeHTMLCell($w=150, $h=0, $x=119, $y=50, $data['data']['days'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// weeks
$pdf->writeHTMLCell($w=150, $h=0, $x=151, $y=50, $data['data']['weeks'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// fromdate 2
$xarray = array(30,32,42,44,52,54,56,58);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['fromdate2'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=60, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// todate 2
$xarray = array(68,70,79,81,89.5,91.5,93.5,95.5);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['todate2'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=60, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
//liftlimit
if ($data['data']['liftlimit']==1){
	$pdf->Image($checkMark,79 ,78.7, 4, 4, '', '', '', false, 300, '', false, false, 0);
}
if ($data['data']['liftlimit']==2){
	$pdf->Image($checkMark,87 ,78.7 , 4, 4, '', '', '', false, 300, '', false, false, 0);
}
if ($data['data']['liftlimit']==3){
	$pdf->Image($checkMark,97.5 ,78.7 , 4, 4, '', '', '', false, 300, '', false, false, 0);
}
if ($data['data']['liftlimit']==4){
	$pdf->Image($checkMark,111 ,78.7 , 4, 4, '', '', '', false, 300, '', false, false, 0);
}

// fromdate 3
$xarray = array(72,74,84,86,93.5,95.5,97.5,99.5);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['fromdate3'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=97, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// todate 3
$xarray = array(110,112,121,123,131,133,135,137);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['todate3'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=97, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
//first
if ($data['data']['firstandfinal']==2){
	$pdf->Image($checkMark,114 ,102.5, 4, 4, '', '', '', false, 300, '', false, false, 0);
}else{
	$pdf->Image($checkMark,155 ,102.5, 4, 4, '', '', '', false, 300, '', false, false, 0);
}
// day contact
$pdf->writeHTMLCell($w=30, $h=0, $x=116, $y=128, $data['data']['contactday'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// time contact
if (array_key_exists('contactname',$data['data']))
	$pdf->writeHTMLCell($w=30, $h=0, $x=166, $y=128, $data['data']['contactname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// treatment
$pdf->writeHTMLCell($w=145, $h=0, $x=48, $y=140, $data['data']['treatment'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// medication
$pdf->writeHTMLCell($w=145, $h=0, $x=50, $y=151, $data['data']['medication'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// todate 4
$xarray = array(65,67,77,79,89,91,93,95);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['appdate'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=167, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// apptime
$pdf->writeHTMLCell($w=45, $h=0, $x=118, $y=167, $data['data']['apptime'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// refhospital
$pdf->writeHTMLCell($w=105, $h=0, $x=118, $y=174, $data['data']['refhospital'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// physioname
$pdf->writeHTMLCell($w=105, $h=0, $x=75, $y=184, $data['data']['physioname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// physiosess
$pdf->writeHTMLCell($w=105, $h=0, $x=91, $y=188, $data['data']['physiosess'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// chironame
$pdf->writeHTMLCell($w=105, $h=0, $x=70, $y=192, $data['data']['chironame'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// chirosess
$pdf->writeHTMLCell($w=105, $h=0, $x=91, $y=196, $data['data']['chirosess'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// other
$pdf->writeHTMLCell($w=105, $h=0, $x=62, $y=200, $data['data']['other'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// conference
$pdf->writeHTMLCell($w=105, $h=0, $x=97, $y=206, $data['data']['conference'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

//rehab
if ($data['data']['rehab']==1){
	$pdf->Image($checkMark,96.5 ,215.5, 4, 4, '', '', '', false, 300, '', false, false, 0);
}else{
	$pdf->Image($checkMark,140 ,215.5, 4, 4, '', '', '', false, 300, '', false, false, 0);
}
// todate 4
$xarray = array(67,69,79,81,91,93,95,97);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['reviewdate'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=226, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}


if (''!=$drsign){
	//$imgdata = base64_decode(substr($data['data']['drsigntxt'],22));
	//$imgdata = str_replace(' ','+',$imgdata);

	$imgdata = $drsign;
	$imgdata = str_replace(' ','+',$imgdata);

	preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $imgdata);

	//echo $imgdata;
	copy("data:image/png;base64,".$imgdata,"output/temp.png");

	//file_put_contents("output/temp.png", $imgdata);
	//fclose($image);
	list($width, $height, $type, $attr)= getimagesize("output/temp.png");
	//echo substr($data['data']['drsigntxt'],22);
	$pdf->Image("output/temp.png", 45, 254, 20, 20*$height/$width, '', '', '', false, 300, '', false, false, 0);
}

// redimed's detail
$pdf->writeHTMLCell($w=150, $h=0, $x=42, $y=238, ((array_key_exists('dname', $pdata))? $pdata['dname']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->Rect($x=42, $y=243.5, $w=150, $h=4, 'F', null, array(255, 255, 255));
$pdf->writeHTMLCell($w=150, $h=0, $x=42, $y=243.5, ((array_key_exists('daddress', $pdata))? $pdata['daddress']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=50, $h=0, $x=152, $y=238, ((array_key_exists('dcode', $pdata))? $pdata['dcode']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=50, $h=0, $x=42, $y=248, '0892300900', $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=50, $h=0, $x=85, $y=248, '0892300999', $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=150, $h=0, $x=135, $y=248, ((array_key_exists('demail', $pdata))? $pdata['demail']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

// todate 4
$xarray = array(164,166,176,178,186,188,190,192);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['reviewdate'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=259.5, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}

?>