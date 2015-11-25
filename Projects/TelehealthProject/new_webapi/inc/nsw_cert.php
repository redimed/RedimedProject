<?php
function getAge($birthday) {
	return floor((strtotime(date('d-m-Y')) - strtotime($birthday))/(60*60*24*365.2421896));
}

$pdf->setPage(1);
$pdf->SetFontSize(9, true);
$checkMark = "images/CheckMark.jpg";
if (1!=$this->uri->segment(4)){
	$this->load->model('progress_model');
	$progress = $this->progress_model->get($this->uri->segment(5));
	if (count($progress)>0){
		$json = $progress[0]['detail'];
		preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $json);

		//echo urldecode($json).'<br>';
		$progress[0]['detail'] = json_decode($json,true);
		//print_r($progress)
		$pdata = $progress[0]['detail'];
	}else
		$pdata = array();

}else{
	$pdata =$data['data'];
}
// start printing data
if (1==$this->uri->segment(4)){
	$pdf->Image($checkMark, 145, 69, 4, 4, '', '', '', false, 300, '', false, false, 0);
}

$pdf->writeHTMLCell($w=60, $h=0, $x=110, $y=85, $data['data']['fname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // last name

$pdf->writeHTMLCell($w=60, $h=0, $x=16, $y=85, $data['data']['gname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // first name

// dob
$xarray = array(16,21.5,28.5,33.5,41,46.5,52,57.5);
$dob = date("dmY",strtotime($data['data']['dob']));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=60, $h=0, $x=$xarray[$i], $y=95, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}


$pdf->writeHTMLCell($w=60, $h=0, $x=16, $y=105, $data['data']['address'].', '.$data['data']['suburb'].', '.$data['data']['postcode'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

for ($i = 0; $i<strlen($data['data']['medicareno']); $i++)  {
    $character = substr($data['data']['medicareno'], $i,1);
	$pdf->writeHTMLCell($w=60, $h=0, $x=(16+$i*5.4), $y=124.5, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
$pdf->writeHTMLCell($w=60, $h=0, $x=16, $y=142, $data['data']['occupation'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

$pdf->writeHTMLCell($w=170, $h=8, $x=16, $y=152, $data['employer']['name'].' - '.$data['employer']['address'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // employer's detail

if (array_key_exists('signtxt',$data['data'])&& (''!=$data['data']['signtxt'])){
	$imgdata = str_replace(' ','+',$data['data']['signtxt']);
	preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $imgdata);
	copy("data:image/png;base64,".$imgdata,"output/temp2.png");

	list($width, $height, $type, $attr)= getimagesize("output/temp2.png");
	$pdf->Image("output/temp2.png", 40, 179, 9, 9*$height/$width, '', '', '', false, 300, '', false, false, 0);

}
$signdate = date("dmY",strtotime($data['entry']['createdTime']));
$xarray = array(101.5, 107, 114, 119.5, 126, 131.5, 137, 142.5);
for ($i = 0; $i<strlen($signdate); $i++)  {
    $character = substr($signdate, $i,1);
	$pdf->writeHTMLCell($w=60, $h=0, $x=$xarray[$i], $y=179.5, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
//diagnosis
$pdf->writeHTMLCell($w=170, $h=8, $x=16, $y=210, $pdata['diagnosis'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// date of injury
if (""!=$pdata['adate']){
$xarray = array(116,121.5,128.5,134,141,146,151.5,157);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['adate'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=228, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
}

// date of injury
if (""!=$pdata['adate']){
$xarray = array(56,61.5,68.5,74,81,86,91.5,97);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['adate'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=216, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
}
//description of cause yes/no/certain
if ($pdata['check-1']==0){
	$pdf->Image($checkMark, 104, 233.5, 4, 4, '', '', '', false, 300, '', false, false, 0);
}else if($pdata['check-1']==1){
	$pdf->Image($checkMark, 117, 233.5, 4, 4, '', '', '', false, 300, '', false, false, 0);
}else{
	$pdf->Image($checkMark, 129, 233.5, 4, 4, '', '', '', false, 300, '', false, false, 0);
}

// how injury/disease related to work
$pdf->writeHTMLCell($w=180, $h=10, $x=16, $y=244, $pdata['reason'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// pre-existing
$pdf->writeHTMLCell($w=180, $h=10, $x=16, $y=259.5, $pdata['pre-existing'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// second page
$pdf->setPage(2);
//claimant name
$pdf->writeHTMLCell($w=60, $h=0, $x=38, $y=19, $data['data']['gname'].' '.$data['data']['fname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // last name
//medication
$pdf->writeHTMLCell($w=180, $h=10, $x=16, $y=38, $pdata['medication'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//referral
$pdf->writeHTMLCell($w=180, $h=10, $x=16, $y=53, $pdata['referralname'].' - '.$pdata['referraldetails'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
 //require copy
if ($pdata['check-2']==0){
	$pdf->Image($checkMark, 104, 73.5, 4, 4, '', '', '', false, 300, '', false, false, 0);
}else{
	$pdf->Image($checkMark, 117, 73.5, 4, 4, '', '', '', false, 300, '', false, false, 0);
}
// fite date from 1
if (""!=$pdata['fitdatefrom-1']){
$xarray = array(88,93.5,100.5,106,113,118,123.5,129);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['fitdatefrom-1'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=88, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
}
// fit date to 1
if (""!=$pdata['fitdateto-1']){
$xarray = array(139,144.5,151.5,157,164,169,174.5,180);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['fitdateto-1'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=88, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
}
// restricthours
if (array_key_exists('restrictedhours',$pdata)){
	for ($i = (min(array(strlen($pdata['restrictedhours']),2))-1); $i>=0; $i--)  {
		$character = substr($pdata['restrictedhours'], $i,1);
		$pdf->writeHTMLCell($w=60, $h=0, $x=(26+$i*5.4), $y=94.5, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
	}

}
// restrictdays
if (array_key_exists('restrictdays',$pdata)){
	for ($i = (min(array(strlen($pdata['restrictdays']),2))-1); $i>=0; $i--)  {
		$character = substr($pdata['restrictdays'], $i,1);
		$pdf->writeHTMLCell($w=60, $h=0, $x=(53+$i*5.4), $y=94.5, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
	}
}
// fite date from 2
if (""!=$pdata['fitdatefrom-2']){
$xarray = array(97,102.5,109.5,115,122,127,131.5,138);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['fitdatefrom-2'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=100.5, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
}
// fit date to 2
if (""!=$pdata['fitdateto-2']){
$xarray = array(148,153.5,160.5,166,173,178,183.5,189);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['fitdateto-2'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=100.5, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
}
// estimated time
$pdf->writeHTMLCell($w=40, $h=0, $x=130, $y=106, $pdata['estimatetime'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=120, $h=0, $x=57, $y=112, $pdata['factorsdelay'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//description of cause yes/no/certain
if ($pdata['check-3']==0){
	$pdf->Image($checkMark, 107, 118, 4, 4, '', '', '', false, 300, '', false, false, 0);
}else{
	$pdf->Image($checkMark, 120, 118, 4, 4, '', '', '', false, 300, '', false, false, 0);
}
$pdf->writeHTMLCell($w=120, $h=0, $x=72, $y=134, $pdata['lift'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=120, $h=0, $x=72, $y=140, $pdata['sit'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=120, $h=0, $x=72, $y=146, $pdata['stand'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=120, $h=0, $x=72, $y=152, $pdata['push'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=120, $h=0, $x=72, $y=158, $pdata['bend'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=120, $h=0, $x=72, $y=164, $pdata['drive'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=180, $h=0, $x=18, $y=175, $pdata['othertxt'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// next date
if (""!=$pdata['nextdate-1']){
$xarray = array(41,46.5,53.5,59,66,71,76.5,82);
$dob = date("dmY",strtotime(str_replace('/', '-', $pdata['nextdate-1'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=20, $h=0, $x=$xarray[$i], $y=181.5, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
}
//reason
$pdf->writeHTMLCell($w=180, $h=0, $x=18, $y=192.5, $pdata['comments'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

// checkboxes
if ($pdata['checkbox-1']=="on")
	$pdf->Image($checkMark, 14.5, 83, 4, 4, '', '', '', false, 300, '', false, false, 0);
if ($pdata['checkbox-2']=="on")
	$pdf->Image($checkMark, 14.5, 89, 4, 4, '', '', '', false, 300, '', false, false, 0);
if ($pdata['checkbox-3']=="on")
	$pdf->Image($checkMark, 14.5, 101, 4, 4, '', '', '', false, 300, '', false, false, 0);
if ($pdata['checkbox-6']=="on")
	$pdf->Image($checkMark, 14.5, 207, 4, 4, '', '', '', false, 300, '', false, false, 0);
if ($pdata['checkbox-7']=="on")
	$pdf->Image($checkMark, 45.5, 212.5, 4, 4, '', '', '', false, 300, '', false, false, 0);
if ($pdata['checkbox-8']=="on")
	$pdf->Image($checkMark, 92, 212.5, 4, 4, '', '', '', false, 300, '', false, false, 0);
if ($pdata['checkbox-9']=="on")
	$pdf->Image($checkMark, 126, 212.5, 4, 4, '', '', '', false, 300, '', false, false, 0);

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
	$pdf->Image("output/temp.png", 55, 225, 15, 15*$height/$width, '', '', '', false, 300, '', false, false, 0);
}

// next date
$pdf->writeHTMLCell($w=40, $h=0, $x=88+13, $y=229, $pdata['examdate'][0], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // date
$pdf->writeHTMLCell($w=40, $h=0, $x=93.5+13, $y=229, $pdata['examdate'][1], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // date
$pdf->writeHTMLCell($w=40, $h=0, $x=100.5+13, $y=229, $pdata['examdate'][3], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // date
$pdf->writeHTMLCell($w=40, $h=0, $x=106+13, $y=229, $pdata['examdate'][4], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // date
$pdf->writeHTMLCell($w=40, $h=0, $x=113+13, $y=229, $pdata['examdate'][6], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // date
$pdf->writeHTMLCell($w=40, $h=0, $x=118+13, $y=229, $pdata['examdate'][7], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // date
$pdf->writeHTMLCell($w=40, $h=0, $x=123.5+13, $y=229, $pdata['examdate'][8], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // date
$pdf->writeHTMLCell($w=40, $h=0, $x=129+13, $y=229, $pdata['examdate'][9], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // date
//reason
$pdf->writeHTMLCell($w=180, $h=0, $x=18, $y=245, $pdata['otherdoctor'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

// redimed's detail
$pdf->writeHTMLCell($w=70, $h=0, $x=18, $y=259, ((array_key_exists('dname', $pdata))? $pdata['dname']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=70, $h=0, $x=18, $y=268, ((array_key_exists('daddress', $pdata))? $pdata['daddress']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->SetAutoPageBreak(false, 0);
// fone number
for ($i = 0; $i<strlen("0892300900"); $i++)  {
    $character = substr("0892300900", $i,1);
	$pdf->writeHTMLCell($w=60, $h=0, $x=(16+$i*5.4), $y=278, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// fone number
for ($i = 0; $i<strlen($pdata['dcode']); $i++)  {
    $character = substr($pdata['dcode'], $i,1);
	$pdf->writeHTMLCell($w=60, $h=0, $x=(76+$i*5.4), $y=278, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}

?>