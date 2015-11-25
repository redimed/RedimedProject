<?php
function getAge($birthday) {
	return floor((strtotime(date('d-m-Y')) - strtotime($birthday))/(60*60*24*365.2421896));
}
$pdf->SetAutoPageBreak(TRUE, 1);
$pdf->setPage(1);
$pdf->SetFontSize(8, true);
$checkMark = "images/checked.png";
$emptybox = "images/uncheck.png";
$pdata = json_decode($data,true);

if (2==$pbs){
	$pdf->Image($checkMark, 45, 143, 6, 6, '', '', '', false, 300, '', false, false, 0);
}else{
	$pdf->Image($emptybox, 45, 143, 6, 6, '', '', '', false, 300, '', false, false, 0);
}
if (2==$rpbs){
	$pdf->Image($checkMark, 80, 143, 6, 6, '', '', '', false, 300, '', false, false, 0);
}else{
	$pdf->Image($emptybox, 80, 143, 6, 6, '', '', '', false, 300, '', false, false, 0);
}
if (2==$other){
	$pdf->Image($checkMark, 167, 143, 6, 6, '', '', '', false, 300, '', false, false, 0);
}else{
	$pdf->Image($emptybox, 167, 143, 6, 6, '', '', '', false, 300, '', false, false, 0);
}

$doctor = $this->member_model->get($pdata['drId']);
if (count($doctor)>0){
	$temp = str_replace('\"','"',$doctor[0]['detail']);
	$temp = str_replace("\'",'\u0027',$temp);

	$temp = json_decode($temp,true);
	$drsign = array_key_exists('drsign', $temp)?$temp['drsign']:'';

}else{
	$drsign = '';
}

if (array_key_exists('medicareno',$pdata))
	$pdf->writeHTMLCell($w=80, $h=0, $x=60, $y=60, $pdata['medicareno'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
if (array_key_exists('gname',$pdata))
	$pdf->writeHTMLCell($w=80, $h=0, $x=73, $y=75, $pdata['gname']." ".$pdata['fname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
if (array_key_exists('address',$pdata))
	$pdf->writeHTMLCell($w=80, $h=0, $x=73, $y=84, $pdata['address'].(($pdata['suburb']!='')?', ':'').$pdata['suburb'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
if (array_key_exists('postcode',$pdata))
	$pdf->writeHTMLCell($w=40, $h=0, $x=157, $y=93, $pdata['postcode'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
if (array_key_exists('postcode',$pdata))
	$pdf->writeHTMLCell($w=110, $h=0, $x=67, $y=155, $script, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

if (''!=$drsign){

	$imgdata = $drsign;
	$imgdata = str_replace(' ','+',$imgdata);

	preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $imgdata);
	copy("data:image/png;base64,".$imgdata,"output/temp.png");
	list($width, $height, $type, $attr)= getimagesize("output/temp.png");
	$pdf->Image("output/temp.png", 80, 220, 15*$width/$height, 15, '', '', '', false, 300, '', false, false, 0);
}

$pdf->writeHTMLCell($w=40, $h=0, $x=160, $y=230, ((array_key_exists('examdate',$pdata))?$pdata['examdate']:"").'  '.((array_key_exists('examtime',$pdata))?$pdata['examtime']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=70, $h=0, $x=45, $y=9, ((array_key_exists('dname',$pdata))?$pdata['dname']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=70, $h=0, $x=30, $y=46, ((array_key_exists('dcode',$pdata))?$pdata['dcode']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=70, $h=0, $x=162, $y=46, date("dmyhis"), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
?>