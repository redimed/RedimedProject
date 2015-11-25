<?php
function getAge($birthday) {
	return floor((strtotime(date('d-m-Y')) - strtotime($birthday))/(60*60*24*365.2421896));
}
//$pdf->SetAutoPageBreak(TRUE, 1);
$bMargin = $pdf->getBreakMargin();
// get current auto-page-break mode
$auto_page_break = $pdf->getAutoPageBreak();
// disable auto-page-break
$pdf->SetAutoPageBreak(false, 0);
$pdf->setPage(1);
$pdf->SetFontSize(8, true);
$checkMark = "images/checked.png";
$emptybox = "images/uncheck.png";
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

$pdf->writeHTMLCell($w=80, $h=0, $x=109, $y=61, $pdata['gname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=80, $h=0, $x=35, $y=65, $pdata['fname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=80, $h=0, $x=116, $y=65, $pdata['dob'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=80, $h=0, $x=74, $y=69.5, $pdata['wfone'].(($pdata['hfone']!='')?(($pdata['wfone']!='')?'-':''):'').$pdata['hfone'].(($pdata['mfone']!='')?(($pdata['wfone']!='')?'-':''):'').$pdata['mfone'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // fone
$pdf->writeHTMLCell($w=80, $h=8, $x=55, $y=73.5, $data['employer']['name'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // employer's detail

// examdate
if (array_key_exists('examdate',$pdata))
	$pdf->writeHTMLCell($w=85, $h=0, $x=42, $y=61, $pdata['examdate'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

// diagnosis
$pdf->setCellHeightRatio(0.7);

$pdf->SetFontSize(7, true);
if (array_key_exists('diagnosis',$pdata))
	$pdf->writeHTMLCell($w=115, $h=0, $x=35, $y=81, $pdata['diagnosis'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

$pdf->SetFontSize(8, true);
$pdf->setCellHeightRatio(1);
// consistent
if ($pdata['consistent']==2){
	$pdf->Image($checkMark, 100.5, 108, 3.5, 3.5, '', '', '', false, 300, '', false, false, 0);
	$pdf->Image($emptybox, 109.5, 108, 3.5, 35., '', '', '', false, 300, '', false, false, 0);
}else{
	$pdf->Image($checkMark, 109.5, 108, 3.5, 3.5, '', '', '', false, 300, '', false, false, 0);
	$pdf->Image($emptybox, 100.5, 108, 3.5, 3.5, '', '', '', false, 300, '', false, false, 0);
}

$checkboxes = array(array(20,86),
					array(20,128.5),
					array(20, 133),
					array(20, 137.5),
					array(101, 141.5), //5
					array(112, 141.5),
					array(124.5, 141.5),
					array(20, 154),
					array(20, 158.5),
					array(95, 158.5), //10
					array(39.5,171),
					array(68,171),
					array(84.5, 171),
					array(155, 52.9),
					array(185, 52.9), //15
					array(214.5, 52.9),
					array(247.5, 52.9),
					array(155, 57),
					array(155, 61.5),
					array(155, 82.5), //20
					array(155, 121),
					array(155, 133.5),
					);
//checkboxes
foreach ($checkboxes as $key=>$value){
	//echo $key."-";
	if (array_key_exists('checkbox-'.($key+1),$pdata)){
		if ($pdata['checkbox-'.($key+1)]=='on'){
			$pdf->Image($checkMark, $value[0], $value[1], 4, 4, '', '', '', false, 300, '', false, false, 0);
		}else{
			$pdf->Image($emptybox, $value[0], $value[1], 4, 4, '', '', '', false, 300, '', false, false, 0);
		}
	}else{
		$pdf->Image($emptybox, $value[0], $value[1], 4, 4, '', '', '', false, 300, '', false, false, 0);
	}
}
$guidelines = array(91,95,99,103.5,108,112.1,116.3);
//guidelines
foreach ($guidelines as $key=>$value){
	//echo $key."-";

	if ($pdata['check-'.($key+2)]=='1'){
		$pdf->Image($checkMark, 204,$value, 4, 4, '', '', '', false, 300, '', false, false, 0);
		$pdf->Image($emptybox, 216,$value, 4, 4, '', '', '', false, 300, '', false, false, 0);
		$pdf->Image($emptybox, 228,$value, 4, 4, '', '', '', false, 300, '', false, false, 0);
	}
	if ($pdata['check-'.($key+2)]=='2'){
		$pdf->Image($emptybox, 204,$value, 4, 4, '', '', '', false, 300, '', false, false, 0);
		$pdf->Image($checkMark, 216,$value, 4, 4, '', '', '', false, 300, '', false, false, 0);
		$pdf->Image($emptybox, 228,$value, 4, 4, '', '', '', false, 300, '', false, false, 0);
	}
	if ($pdata['check-'.($key+2)]=='3'){
		$pdf->Image($emptybox, 204,$value, 4, 4, '', '', '', false, 300, '', false, false, 0);
		$pdf->Image($emptybox, 216,$value, 4, 4, '', '', '', false, 300, '', false, false, 0);
		$pdf->Image($checkMark, 228,$value, 4, 4, '', '', '', false, 300, '', false, false, 0);
	}
}
// weight
if (array_key_exists('weight',$pdata))
	$pdf->writeHTMLCell($w=40, $h=0, $x=174.7, $y=91, $pdata['weight'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// comments
if (array_key_exists('comments',$pdata))
	$pdf->writeHTMLCell($w=40, $h=0, $x=240, $y=92, $pdata['comments'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

// adate
if (array_key_exists('adate',$pdata)){
	$pdf->writeHTMLCell($w=45, $h=0, $x=113, $y=90.5, $pdata['adate'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
	$pdf->writeHTMLCell($w=45, $h=0, $x=59, $y=95, $pdata['adate'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// reason
$pdf->SetFontSize(8, true);
if (array_key_exists('reason',$pdata)){
	$pdf->writeHTMLCell($w=120, $h=0, $x=21, $y=102, $pdata['reason'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}

// pre-existing
if (array_key_exists('pre-existing',$pdata)){
	$pdf->writeHTMLCell($w=120, $h=0, $x=21, $y=114.5, $pdata['pre-existing'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
$pdf->SetFontSize(8, true);

// fromdate1
if (array_key_exists('fromdate1',$pdata)){
	$pdf->writeHTMLCell($w=45, $h=0, $x=67, $y=129, $pdata['fromdate1'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// fromdate2
if (array_key_exists('fromdate2',$pdata)){
	$pdf->writeHTMLCell($w=45, $h=0, $x=58, $y=133, $pdata['fromdate2'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// todate2
if (array_key_exists('todate2',$pdata)){
	$pdf->writeHTMLCell($w=45, $h=0, $x=85, $y=133, $pdata['todate2'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// fromdate3
if (array_key_exists('fromdate3',$pdata)){
	$pdf->writeHTMLCell($w=45, $h=0, $x=70, $y=137, $pdata['fromdate3'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// todate3
if (array_key_exists('todate3',$pdata)){
	$pdf->writeHTMLCell($w=45, $h=0, $x=95, $y=137, $pdata['todate3'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// estimate
if (array_key_exists('estimate',$pdata)){
	$pdf->writeHTMLCell($w=45, $h=0, $x=91, $y=141.5, $pdata['estimate'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// fromdate4
if (array_key_exists('fromdate4',$pdata)){
	$pdf->writeHTMLCell($w=45, $h=0, $x=70, $y=154, $pdata['fromdate4'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// todate4
if (array_key_exists('todate4',$pdata)){
	$pdf->writeHTMLCell($w=45, $h=0, $x=96, $y=154, $pdata['todate4'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// nextdate
if (array_key_exists('nextdate',$pdata)){
	$pdf->writeHTMLCell($w=120, $h=0, $x=71, $y=159, $pdata['nextdate'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// details
if (array_key_exists('details',$pdata)){
	$pdf->writeHTMLCell($w=45, $h=0, $x=32, $y=175.5, $pdata['details'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// treatment
if (array_key_exists('treatment',$pdata)){
	$pdf->writeHTMLCell($w=110, $h=0, $x=171, $y=27.5, $pdata['treatment'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// medication
if (array_key_exists('medication',$pdata)){
	$pdf->writeHTMLCell($w=90, $h=0, $x=186, $y=32, $pdata['medication'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// referralspecialist
if (array_key_exists('referralspecialist',$pdata)){
	$pdf->writeHTMLCell($w=60, $h=0, $x=206, $y=36, $pdata['referralspecialist'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// referralahp
if (array_key_exists('referralahp',$pdata)){
	$pdf->writeHTMLCell($w=90, $h=0, $x=226, $y=40, $pdata['referralahp'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// detail2
if (array_key_exists('detail2',$pdata)){
	$pdf->writeHTMLCell($w=45, $h=0, $x=177, $y=44, $pdata['detail2'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// further
if (array_key_exists('further',$pdata)){
	$pdf->writeHTMLCell($w=45, $h=0, $x=155, $y=69, $pdata['further'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// otherconsiderations
if (array_key_exists('otherconsiderations',$pdata)){
	$pdf->writeHTMLCell($w=45, $h=0, $x=197, $y=125, $pdata['otherconsiderations'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
// restricteddays
if (array_key_exists('restricteddays',$pdata)){
	$pdf->writeHTMLCell($w=45, $h=0, $x=197, $y=129.5, $pdata['restricteddays'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}


if (''!=$drsign){

	$imgdata = $drsign;
	$imgdata = str_replace(' ','+',$imgdata);

	preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $imgdata);
	copy("data:image/png;base64,".$imgdata,"output/temp.png");
	list($width, $height, $type, $attr)= getimagesize("output/temp.png");
	$pdf->Image("output/temp.png", 175, 171, 20, 20*$height/$width, '', '', '', false, 300, '', false, false, 0);
}

// redimed's detail
$pdf->writeHTMLCell($w=70, $h=0, $x=176, $y=153, ((array_key_exists('dname', $pdata))? $pdata['dname']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=70, $h=0, $x=176, $y=157, ((array_key_exists('daddress', $pdata))? $pdata['daddress']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=50, $h=0, $x=234, $y=153, "REDiMED", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=50, $h=0, $x=202, $y=161.5, '0892300900', $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=50, $h=0, $x=166, $y=166, '0892300999', $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
$pdf->writeHTMLCell($w=50, $h=0, $x=205, $y=166, 'teleheahlth@redimed.com.au', $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
// examdate
$xarray = array(224,226,233,235,241,243,245,247);
$dob = date("dmY",strtotime(str_replace('/', '-', $data['data']['examdate'])));
for ($i = 0; $i<strlen($dob); $i++)  {
    $character = substr($dob, $i,1);
	$pdf->writeHTMLCell($w=60, $h=0, $x=$xarray[$i], $y=170, $character, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
}
?>