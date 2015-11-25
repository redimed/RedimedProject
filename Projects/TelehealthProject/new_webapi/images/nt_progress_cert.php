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
$pdf->writeHTMLCell($w=50, $h=0, $x=49, $y=77, $data['data']['fname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // last name

$pdf->writeHTMLCell($w=50, $h=0, $x=49, $y=82.5, $data['data']['gname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // first name

// dob
$xarray = array(62,64,71,73,80,82,84,86);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['dob'])));
for ($i = 0; $i<strlen($dob); $i++)  { 
    $character = substr($dob, $i,1); 
	$pdf->writeHTMLCell($w=60, $h=0, $x=$xarray[$i], $y=103, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);    
} 


$pdf->writeHTMLCell($w=60, $h=0, $x=49, $y=87.5, $data['data']['address'].', '.$data['data']['suburb'].', '.$data['data']['postcode'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

$pdf->writeHTMLCell($w=60, $h=0, $x=49, $y=93, $data['data']['mfone'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

$pdf->writeHTMLCell($w=60, $h=8, $x=57, $y=113, $data['employer']['name'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // employer's detail
$pdf->writeHTMLCell($w=60, $h=8, $x=46, $y=123, $data['employer']['address'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // employer's detail

// date of injury
$xarray = array(62,64,71,73,80,82,84,86);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['adate'])));
for ($i = 0; $i<strlen($dob); $i++)  { 
    $character = substr($dob, $i,1); 
	$pdf->writeHTMLCell($w=60, $h=0, $x=$xarray[$i], $y=98, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);    
} 
// examdate

$xarray = array(72,74,81,83,89,91,93,95);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['examdate'])));
for ($i = 0; $i<strlen($dob); $i++)  { 
    $character = substr($dob, $i,1); 
	$pdf->writeHTMLCell($w=60, $h=0, $x=$xarray[$i], $y=141.5, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);    
}
//exam time
$pdf->Rect($x=30, $y=141.5, $w=29, $h=4, 'F', null, array(255, 255, 255));
$pdf->writeHTMLCell($w=40, $h=8, $x=30, $y=141.5, $data['data']['examtime'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//diagnosis
$pdf->writeHTMLCell($w=80, $h=0, $x=21, $y=151, $data['data']['diagnosis'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

$checkboxes = array(array(20.5,191.7,1),
					array(20.5,195.5,1),
					array(20.5, 199.3,1),
					array(20.5, 211.5,1),
					array(24.5, 223,1), //5
					array(24.5, 226.3,1),
					array(24.5, 229.7,1),
					array(24.5, 233.2,1),
					array(24.5, 236.5,1),
					array(24.5, 239.9,1), //10
					array(24.5, 243.2,1),
					array(20.5, 252,1),
					array(20.5, 259,1),
					array(111, 82.5,1),
					array(111, 92.3,1), //15
					array(111, 108,1),
					array(111, 118,1),
					array(164, 118,1),
					array(111, 123,1),
					array(111, 131.5,1), //20
					array(111, 147.5,1),
					array(111, 157,1),
					array(111, 186.5,1),
					array(111, 192.5,1),
					);
//checkboxes
foreach ($checkboxes as $key=>$value){
	if ($data['data']['assessment-'.($key+11)]=='on'){
		//$pdf->setPage($value[2]);
		$pdf->Image($checkMark, $value[0], $value[1], 3.1, 3.1, '', '', '', false, 300, '', false, false, 0);
	}
}
// fromdate 1
$xarray = array(26,28,35,37,42,44,46,48);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['fromdate1'])));
for ($i = 0; $i<strlen($dob); $i++)  { 
    $character = substr($dob, $i,1); 
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=203, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);    
}
// todate 1
$xarray = array(56,58,66,68,72.5,74.5,76.5,78.5);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['todate1'])));
for ($i = 0; $i<strlen($dob); $i++)  { 
    $character = substr($dob, $i,1); 
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=203, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);    
}
// days
$pdf->writeHTMLCell($w=150, $h=0, $x=26, $y=207, $data['data']['days'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); 
// weeks
$pdf->writeHTMLCell($w=150, $h=0, $x=51, $y=207, $data['data']['weeks'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); 
// fromdate 2
$xarray = array(26,28,35,37,42,44,46,48);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['fromdate2'])));
for ($i = 0; $i<strlen($dob); $i++)  { 
    $character = substr($dob, $i,1); 
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=215, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);    
}
// todate 2
$xarray = array(56,58,66,68,72.5,74.5,76.5,78.5);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['todate2'])));
for ($i = 0; $i<strlen($dob); $i++)  { 
    $character = substr($dob, $i,1); 
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=215, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);    
}
//liftlimit
if ($data['data']['liftlimit']==1){
	$pdf->Image($checkMark,66 ,229.6, 3.1, 3.1, '', '', '', false, 300, '', false, false, 0);
}
if ($data['data']['liftlimit']==2){
	$pdf->Image($checkMark,73 ,229.6 , 3.1, 3.1, '', '', '', false, 300, '', false, false, 0);
}
if ($data['data']['liftlimit']==3){
	$pdf->Image($checkMark,81 ,229.6 , 3.1, 3.1, '', '', '', false, 300, '', false, false, 0);
}
if ($data['data']['liftlimit']==4){
	$pdf->Image($checkMark,91.7,229.6 , 3.1, 3.1, '', '', '', false, 300, '', false, false, 0);
}
// other restriction
$pdf->writeHTMLCell($w=45, $h=0, $x=51.5, $y=239, $data['data']['restrictother'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); 
// duties recommend
$pdf->writeHTMLCell($w=35, $h=0, $x=68, $y=242.5, $data['data']['recommend'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); 
// unfitdays
$pdf->writeHTMLCell($w=35, $h=0, $x=54, $y=251.5, $data['data']['unfitdays'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// unfitdays
$pdf->writeHTMLCell($w=35, $h=0, $x=54, $y=251.5, $data['data']['unfitdays'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); 

// fromdate 3
$xarray = array(32,34,41,43,48,50,52,54);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['fromdate3'])));
for ($i = 0; $i<strlen($dob); $i++)  { 
    $character = substr($dob, $i,1); 
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=255, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);    
}
// todate 3
$xarray = array(62,64,72,74,78.5,80.5,82.5,84.5);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['todate3'])));
for ($i = 0; $i<strlen($dob); $i++)  { 
    $character = substr($dob, $i,1); 
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=255, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);    
}

// reviewdate
$xarray = array(26,28,35,37,42,44,46,48);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['reviewdate'])));
for ($i = 0; $i<strlen($dob); $i++)  { 
    $character = substr($dob, $i,1); 
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=262, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);    
}
// medication
$pdf->writeHTMLCell($w=80, $h=0, $x=116, $y=110, $data['data']['medication'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); 
// medicalother
$pdf->writeHTMLCell($w=80, $h=0, $x=116, $y=126, $data['data']['medicalother'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); 
// refspecname
$pdf->writeHTMLCell($w=80, $h=0, $x=153, $y=130.7, $data['data']['refspecname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); 
// refspecspec
$pdf->writeHTMLCell($w=80, $h=0, $x=125, $y=138, $data['data']['refspecspec'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// refhospital
$pdf->writeHTMLCell($w=80, $h=0, $x=152, $y=146.5, $data['data']['refhospital'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// comments
$pdf->writeHTMLCell($w=80, $h=0, $x=117, $y=164, $data['data']['comments'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// rehabweeks
$pdf->writeHTMLCell($w=80, $h=0, $x=169.5, $y=185.5, $data['data']['rehabweeks'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); 


if (''!=$drsign){
	//$imgdata = base64_decode(substr($data['data']['drsigntxt'],22));
	//$imgdata = str_replace(' ','+',$imgdata);
	
	$imgdata = $drsign;
	$imgdata = str_replace(' ','+',$imgdata);
	
	preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $imgdata);
	
	//echo $imgdata;
	copy("data:image/png;base64,".$imgdata,"output/temp.jpg");
	
	//file_put_contents("output/temp.png", $imgdata);
	//fclose($image);
	list($width, $height, $type, $attr)= getimagesize("output/temp.jpg");
	//echo substr($data['data']['drsigntxt'],22);
	$pdf->Image("output/temp.jpg", 126, 252, 20, 20*$height/$width, '', '', '', false, 300, '', false, false, 0);
}

// redimed's detail
$pdf->writeHTMLCell($w=70, $h=0, $x=122, $y=206, ((array_key_exists('dname', $pdata))? $pdata['dname']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=70, $h=0, $x=124, $y=218, ((array_key_exists('daddress', $pdata))? $pdata['daddress']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); 
$pdf->writeHTMLCell($w=70, $h=0, $x=135, $y=213, ((array_key_exists('dcode', $pdata))? $pdata['dcode']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); 
$pdf->writeHTMLCell($w=50, $h=0, $x=130, $y=240, '0892300900', $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); 
$pdf->writeHTMLCell($w=50, $h=0, $x=130, $y=245.3, '0892300999', $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);   

$pdf->writeHTMLCell($w=50, $h=0, $x=120, $y=234.5, $data['data']['contactdays'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);   
$pdf->writeHTMLCell($w=50, $h=0, $x=170, $y=234.5, $data['data']['contacttimes'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);    

// todate 4
$xarray = array(170,172,179,181,187,189,191,193);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['reviewdate'])));
for ($i = 0; $i<strlen($dob); $i++)  { 
    $character = substr($dob, $i,1); 
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=256.4, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);    
}

?>