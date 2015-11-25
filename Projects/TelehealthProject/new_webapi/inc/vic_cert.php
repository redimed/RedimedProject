<?php
function getAge($birthday) {
	return floor((strtotime(date('d-m-Y')) - strtotime($birthday))/(60*60*24*365.2421896));
}
$pdf->SetAutoPageBreak(TRUE, 1);
$pdf->setPage(1);
$pdf->SetFontSize(8, true);
$checkMark = "images/checked.png";
$emptybox = "images/uncheck.png";
if (1!=$this->uri->segment(4)){
	$this->load->model('progress_model');
	$progress = $this->progress_model->get($this->uri->segment(5));
//    echo($progress);
//    var_dump($progress);

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

$pdf->writeHTMLCell($w=120, $h=0, $x=46, $y=48, $pdata['gname']." ".$pdata['fname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=50, $h=0, $x=167, $y=48, $pdata['dob'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=120, $h=0, $x=45, $y=51.5, $pdata['address'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$injDesc = ((array_key_exists('injdesc-1',$pdata))?(('on'==$pdata['injdesc-1'])?'Sprain/Strain':''):"").
		   ((array_key_exists('injdesc-2',$pdata))?(('on'==$pdata['injdesc-2'])?'Laceration, ':''):"").
		   ((array_key_exists('injdesc-3',$pdata))?(('on'==$pdata['injdesc-3'])?'Crush, ':''):"").
		   ((array_key_exists('injdesc-4',$pdata))?(('on'==$pdata['injdesc-4'])?'Fall. ':''):"").
		   ((array_key_exists('injdesctxt',$pdata))?$pdata['injdesctxt']:"");


$pdf->writeHTMLCell($w=150, $h=8, $x=57, $y=55, $injDesc, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

// diagnosis
if (array_key_exists('diagnosis',$pdata))
	$pdf->writeHTMLCell($w=110, $h=0, $x=35, $y=58.5, $pdata['diagnosis'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// diagnosisother
if (array_key_exists('diagnosisother',$pdata))
	$pdf->writeHTMLCell($w=110, $h=0, $x=70, $y=64.5, $pdata['diagnosisother'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

// consistent
if ($pdata['consistent']==2){
	$pdf->Image($checkMark, 66, 80, 3.5, 3.5, '', '', '', false, 300, '', false, false, 0);
	$pdf->Image($emptybox, 77, 80, 3.5, 3.5, '', '', '', false, 300, '', false, false, 0);
}else{
	$pdf->Image($checkMark, 77, 80, 3.5, 3.5, '', '', '', false, 300, '', false, false, 0);
	$pdf->Image($emptybox, 66, 80, 3.5, 3.5, '', '', '', false, 300, '', false, false, 0);
}
// occupation
if (array_key_exists('occupation',$pdata))
	$pdf->writeHTMLCell($w=110, $h=0, $x=153, $y=80, $pdata['occupation'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// treatment
if (array_key_exists('treatment',$pdata))
	$pdf->writeHTMLCell($w=110, $h=0, $x=49, $y=87, $pdata['treatment'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// GP + GPdetails
if (array_key_exists('GPdetails',$pdata))
	$pdf->writeHTMLCell($w=110, $h=0, $x=22, $y=96, $pdata['GP']." - ".$pdata['GPdetails'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// fromdate1
if (array_key_exists('fromdate1',$pdata))
	$pdf->writeHTMLCell($w=110, $h=0, $x=77, $y=120, $pdata['fromdate1'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// fromdate2
if (array_key_exists('fromdate2',$pdata))
	$pdf->writeHTMLCell($w=110, $h=0, $x=77, $y=123.5, $pdata['fromdate2'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// todate2
if (array_key_exists('todate2',$pdata))
	$pdf->writeHTMLCell($w=110, $h=0, $x=77, $y=127.5, $pdata['todate2'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// fromdate3
if (array_key_exists('fromdate3',$pdata))
	$pdf->writeHTMLCell($w=110, $h=0, $x=77, $y=136.5, $pdata['fromdate3'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// todate3
if (array_key_exists('todate3',$pdata))
	$pdf->writeHTMLCell($w=110, $h=0, $x=77, $y=140, $pdata['todate3'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// fromdate4
if (array_key_exists('fromdate4',$pdata))
	$pdf->writeHTMLCell($w=110, $h=0, $x=77, $y=145.5, $pdata['fromdate4'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// todate4
if (array_key_exists('todate4',$pdata))
	$pdf->writeHTMLCell($w=110, $h=0, $x=77, $y=149, $pdata['todate4'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// restriction1
if (array_key_exists('restriction1',$pdata))
	$pdf->writeHTMLCell($w=90, $h=0, $x=116, $y=120, $pdata['restriction1'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// restriction2
if (array_key_exists('restriction2',$pdata))
	$pdf->writeHTMLCell($w=90, $h=0, $x=116, $y=123.5, $pdata['restriction2'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// restriction3
if (array_key_exists('restriction3',$pdata))
	$pdf->writeHTMLCell($w=90, $h=0, $x=116, $y=136.5, $pdata['restriction3'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// reviewdate
if (array_key_exists('reviewdate',$pdata))
	$pdf->writeHTMLCell($w=90, $h=0, $x=156, $y=153, $pdata['reviewdate'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// comments
if (array_key_exists('comments',$pdata))
	$pdf->writeHTMLCell($w=110, $h=0, $x=37, $y=156, $pdata['comments'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

$checkboxes = array(array(23,40),
					array(83,40),
					array(150, 40),
					);
//checkboxes
foreach ($checkboxes as $key=>$value){
	//echo $key."-";

	if ($pdata['checkbox-'.($key+1)]=='on'){
		$pdf->Image($checkMark, $value[0], $value[1], 4, 4, '', '', '', false, 300, '', false, false, 0);
	}else{
		$pdf->Image($emptybox, $value[0], $value[1], 4, 4, '', '', '', false, 300, '', false, false, 0);
	}
}



if (''!=$drsign){

	$imgdata = $drsign;
	$imgdata = str_replace(' ','+',$imgdata);

	preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $imgdata);
	copy("data:image/png;base64,".$imgdata,"output/temp.png");
	list($width, $height, $type, $attr)= getimagesize("output/temp.png");
	$pdf->Image("output/temp.png", 160, 175, 20, 20*$height/$width, '', '', '', false, 300, '', false, false, 0);
}

// redimed's detail
$pdf->writeHTMLCell($w=80, $h=0, $x=22, $y=181, ((array_key_exists('dname', $pdata))? $pdata['dname']:"")."<br>".((array_key_exists('daddress', $pdata))? $pdata['daddress']:"").'<br>0892300900', $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=50, $h=0, $x=155, $y=187, $pdata['dcode'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=50, $h=0, $x=143, $y=197, $pdata['examdate'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=50, $h=0, $x=180, $y=197, $pdata['examdate'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->setPage(2);

$pdf->writeHTMLCell($w=170, $h=8, $x=58, $y=21, $data['employer']['name'].' - '.$data['employer']['address'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->Image($emptybox, 22, 49, 4, 4, '', '', '', false, 300, '', false, false, 0);
$pdf->Image($emptybox, 22, 56, 4, 4, '', '', '', false, 300, '', false, false, 0);
?>