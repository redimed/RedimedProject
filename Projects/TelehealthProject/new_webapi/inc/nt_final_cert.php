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
$pdf->writeHTMLCell($w=50, $h=0, $x=52, $y=78, $data['data']['fname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // last name

$pdf->writeHTMLCell($w=50, $h=0, $x=52, $y=83, $data['data']['gname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // first name

$pdf->Rect($x=49, $y=95, $w=80, $h=4, 'F', null, array(255, 255, 255));
$pdf->writeHTMLCell($w=60, $h=0, $x=52, $y=90, $data['data']['address'].', '.$data['data']['suburb'].', '.$data['data']['postcode'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

$pdf->writeHTMLCell($w=60, $h=0, $x=165, $y=95, $data['data']['mfone'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

$pdf->writeHTMLCell($w=60, $h=8, $x=71, $y=113, $data['employer']['name'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // employer's detail
$pdf->Rect($x=49, $y=125, $w=140, $h=4, 'F', null, array(255, 255, 255));
$pdf->writeHTMLCell($w=60, $h=8, $x=52, $y=120, $data['employer']['address'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // employer's detail

// examdate
$xarray = array(153,155,163,165,175,177,179,181);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['examdate'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=60, $h=0, $x=$xarray[$i], $y=137, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// location
$pdf->writeHTMLCell($w=60, $h=0, $x=138, $y=101, $data['data']['alocation'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// date of injury

$xarray = array(90,92,102,104,113,115,117,119);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['adate'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=60, $h=0, $x=$xarray[$i], $y=101, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}

//exam time
$pdf->Rect($x=100, $y=137, $w=30, $h=4, 'F', null, array(255, 255, 255));
$pdf->writeHTMLCell($w=40, $h=8, $x=87, $y=137, $data['data']['examtime'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

//ground
$pdf->writeHTMLCell($w=170, $h=0, $x=22, $y=174, $data['data']['groundidea'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

$checkboxes = array(array(20.5,153.5,1),
					array(20.5,158,1),
					array(20.5, 163,1),
					);
//checkboxes
foreach ($checkboxes as $key=>$value){
	if ($data['data']['assessment-'.($key+1)]=='on'){
		//$pdf->setPage($value[2]);
		$pdf->Image($checkMark, $value[0], $value[1], 4, 4, '', '', '', false, 300, '', false, false, 0);
	}
}
// fromdate 1
$xarray = array(33,35,44,46,55,57,59,61);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['date'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=148, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
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
	$pdf->Image("output/temp.png", 48, 235, 20, 20*$height/$width, '', '', '', false, 300, '', false, false, 0);
}

// redimed's detail
$pdf->writeHTMLCell($w=70, $h=0, $x=52, $y=204, ((array_key_exists('dname', $pdata))? $pdata['dname']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->Rect($x=49, $y=215, $w=140, $h=4, 'F', null, array(255, 255, 255));
$pdf->writeHTMLCell($w=70, $h=0, $x=52, $y=210, ((array_key_exists('daddress', $pdata))? $pdata['daddress']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=70, $h=0, $x=175, $y=204, ((array_key_exists('dcode', $pdata))? $pdata['dcode']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=50, $h=0, $x=52, $y=221, '0892300900', $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=50, $h=0, $x=125, $y=221, '0892300999', $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

// todate 4
$xarray = array(165,167,176,178,187,189,191,193);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['examdate'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=248.5, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}

?>