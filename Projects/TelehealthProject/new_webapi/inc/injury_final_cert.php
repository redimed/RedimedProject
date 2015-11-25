<?php

$pdf->SetFontSize(10, true);
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

//print_r($pdata);
// get the current page break margin
$bMargin = $pdf->getBreakMargin();
// get current auto-page-break mode
$auto_page_break = $pdf->getAutoPageBreak();
// disable auto-page-break
$pdf->SetAutoPageBreak(false, 0);
// set bacground image
$img_file = "images/FinalWA.jpg";
$checkMark = "images/CheckMark.jpg";
$pdf->Image($img_file, 0, 0, 210, 297, '', '', '', false, 300, '', false, false, 0);
// restore auto-page-break status
//$pdf->SetAutoPageBreak($auto_page_break, $bMargin);
// set the starting point for the page content
$pdf->setPageMark();
$pdf->setPage(1);

//Start
//Client

//first Name
if(array_key_exists("fname",$pdata)){
    $fname = $pdata['fname'];
}else{
    $fname = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=45,$y=56.5,$fname,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

//Date of birth
if(array_key_exists("dob",$pdata)){
    $dateofbirth = $pdata["dob"];
}else{
    $dateofbirth = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=45,$y=64,$dateofbirth,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //Date of birth

//Phone
if(array_key_exists("mfone",$pdata)){
    $phone = $pdata["mfone"];
}else{
    if(array_key_exists("hfone",$pdata)){
        $phone = $pdata["hfone"];
    }else{
        if(array_key_exists("wfone",$pdata)){
            $phone = $pdata["wfone"];
        }else{
            $phone = "";
        }
    }
}
$pdf->writeHTMLCell($w=80,$h=20,$x=45,$y=72,$phone,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //Phone

//Address
if(array_key_exists("address",$pdata)){
    $address = $pdata["address"];
}else{
    $address = "";
}
$pdf->writeHTMLCell($w=200,$h=20,$x=45,$y=80.5,$address,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //address

//Last name
if(array_key_exists("gname",$pdata)){
    $lastname = $pdata["gname"];
}else{
    $lastname = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=127,$y=56,$lastname,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //Last name

//Claim no.
if(array_key_exists("postcode",$pdata)){
    $postcode = $pdata["postcode"];
}else{
    if(array_key_exists("posno",$pdata)){
        $postcode = $pdata["posno"];
    }else{
        $postcode = "";
    }
}
$pdf->writeHTMLCell($w=80,$h=20,$x=127,$y=63.5,$postcode,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //Claim no

//Email
if(array_key_exists("emmail",$pdata)){
    $email = $pdata["email"];
}else{
    $email = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=127,$y=72,$email,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //Email

///doctor
$pdf->writeHTMLCell($w=80, $h=20, $x=56, $y=96.5, "hungcaothanh", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); //first name
$pdf->writeHTMLCell($w=80, $h=20, $x=56, $y=105, "hungcaothanh", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // last name
$pdf->writeHTMLCell($w=200, $h=20, $x=145, $y=96.5, "hungcaothanh", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address


//3. Medical assessment
//Date of this assessment
if(array_key_exists("textfield_dateofthisassessment",$pdata)){
    $dateofassessment = $pdata["textfield_dateofthisassessment"];
}else{

}
$pdf->writeHTMLCell($w=80, $h=20, $x=62, $y=121.5, $dateofassessment, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//Date of injury
if(array_key_exists("adate",$pdata)){
    $dateofInjurry = $pdata["adate"];
}else{

}
$pdf->writeHTMLCell($w=80, $h=20, $x=132, $y=121.5, $dateofInjurry, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address
//checkbox the worker direction
if(array_key_exists("checkbox_theworkercondition",$pdata)){
    if($pdata["checkbox_theworkercondition"] == "yes"){
        $pdf->Image($checkMark, 25.5, 127.5, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}else{

}

//4. Work capacity
if(array_key_exists("checkbox_fullcapacityforwordperforming",$pdata)){
    if($pdata["checkbox_fullcapacityforwordperforming"] == "yes"){
        $pdf->Image($checkMark, 22, 150, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}else{

}
if(array_key_exists("textfield_capacityforworkfrom",$pdata)){
    $datacapacity = $pdata["textfield_capacityforworkfrom"];
}else{

}
$pdf->writeHTMLCell($w=80, $h=20, $x=72, $y=151, $datacapacity, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

if(array_key_exists("checkbox_requiresfurthertreatment",$pdata)){
    if($pdata["checkbox_requiresfurthertreatment"] == "yes"){
        $pdf->Image($checkMark, 106, 150, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}

//checkbox capacity for work performing
if(array_key_exists("checkbox_capacityforwork",$pdata)){
    if($pdata["checkbox_capacityforwork"] == "yes"){
        $pdf->Image($checkMark, 21.5, 158.5, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}else{

}

//hrs/day
if(array_key_exists("textfield_hoursperday",$pdata)){
    $datahourperday = $pdata["textfield_hoursperday"];
}else{

}
$pdf->writeHTMLCell($w=80, $h=20, $x=76.5, $y=159, $datahourperday, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//days/wk
if(array_key_exists("textfield_daysperweek",$pdata)){
    $datadaysPerWeek = $pdata["textfield_daysperweek"];
}else{

}
$pdf->writeHTMLCell($w=80, $h=20, $x=121, $y=159, $datadaysPerWeek, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//week from
if(array_key_exists("textfield_capacityforworkfrom",$pdata)){
    $datacapacityForWorkFrom = $pdata["textfield_capacityforworkfrom"];
}else{

}
$pdf->writeHTMLCell($w=80, $h=20, $x=166, $y=159, $datacapacityForWorkFrom, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address


//as outline below
//checkbox
if(array_key_exists("checkbox_liftupto",$pdata)){
    if($pdata["checkbox_liftupto"] == "yes"){
        $pdf->Image($checkMark, 21, 175, 5, 5, '', '', '', false, 300, '', false, false, 0); //lift up to
    }
}else{

}
if(array_key_exists("checkbox_situpto",$pdata)){
    if($pdata["checkbox_situpto"] == "yes"){
        $pdf->Image($checkMark, 21, 181, 5, 5, '', '', '', false, 300, '', false, false, 0); //sit up to
    }
}else{

}

if(array_key_exists("checkbox_standupto",$pdata)){
    if($pdata["checkbox_standupto"] == "yes"){
        $pdf->Image($checkMark, 21, 187.5, 5, 5, '', '', '', false, 300, '', false, false, 0); // stand up to
    }
}else{

}

if(array_key_exists("checkbox_walkupto",$pdata)){
    if($pdata["checkbox_walkupto"] == "yes"){
        $pdf->Image($checkMark, 21, 193, 5, 5, '', '', '', false, 300, '', false, false, 0); // walk up to
    }
}else{

}

if(array_key_exists("checkbox_workbelowshoulder",$pdata)){
    if($pdata["checkbox_workbelowshoulder"] == "yes"){
        $pdf->Image($checkMark, 21, 199, 5, 5, '', '', '', false, 300, '', false, false, 0); // work below shoulder height
    }
}else{

}

if(array_key_exists("checkbox_theworkerincapacity",$pdata)){
    if($pdata["checkbox_theworkerincapacity"] == "yes"){
        $pdf->Image($checkMark, 21, 204, 5, 5, '', '', '', false, 300, '', false, false, 0); // work below shoulder height

    }
}else{

}

//kg
if(array_key_exists("textfield_liftupto",$pdata)){
    $dataLiftUpTo = $pdata["textfield_liftupto"];
}else{

}
$pdf->writeHTMLCell($w=80, $h=20, $x=50, $y=176.5, $dataLiftUpTo, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address
//sit up to mins
if(array_key_exists("textfield_situpto",$pdata)){
    $dataSitupto = $pdata["textfield_situpto"];
}else{

}
$pdf->writeHTMLCell($w=80, $h=20, $x=50, $y=182.5, $dataSitupto, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address
//stand up to mins
if(array_key_exists("textfield_standupto",$pdata)){
    $dataStandupto = $pdata["textfield_standupto"];
}else{

}
$pdf->writeHTMLCell($w=80, $h=20, $x=50, $y=188.5, $dataStandupto, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address
//walk up to m
if(array_key_exists("textfield_walkupto",$pdata)){
    $dataWalkupto = $pdata["textfield_walkupto"];
}else{

}
$pdf->writeHTMLCell($w=80, $h=20, $x=50, $y=194.5, $dataWalkupto, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address


//textfield
if(array_key_exists("textview_theworkerincapacity",$pdata)){
    $dataComment = $pdata["textview_theworkerincapacity"];
}else{

}
$pdf->writeHTMLCell($w=120, $h=100, $x=81, $y=177, $dataComment, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address
//$pdf->writeHTMLCell($w=80, $h=20, $x=81, $y=182, "hungcaothanh", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address
//
//$pdf->writeHTMLCell($w=80, $h=20, $x=81, $y=187, "hungcaothanh", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address
//
//$pdf->writeHTMLCell($w=80, $h=20, $x=81, $y=191.5, "hungcaothanh", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address
//
//$pdf->writeHTMLCell($w=80, $h=20, $x=81, $y=196, "hungcaothanh", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//5.Reason for capacity /incapacity
if(array_key_exists("textview_outlineyourclinical",$pdata)){
    $dataoulineyourclinical = $pdata["textview_outlineyourclinical"];
}else{
    $dataoulineyourclinical = "";
}
$pdf->writeHTMLCell($w=250, $h=20, $x=23, $y=224.5, $dataoulineyourclinical, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//6. Medical PRactitioner's detail
if(array_key_exists("info_drname",$pdata)){
    $drname = $pdata["info_drname"];
}else{
    if(array_key_exists("dname",$pdata)){
        $drname = $pdata["dname"];
    }
}
//name
$pdf->writeHTMLCell($w=80, $h=20, $x=36, $y=244, $drname, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

if(array_key_exists("info_draddress",$pdata)){
    $draddress = $pdata["info_draddress"];
}else{
    if(array_key_exists("daddress",$pdata)){
        $draddress = $pdata["daddress"];
    }
}
//Address
$pdf->writeHTMLCell($w=80, $h=20, $x=36, $y=252, $draddress, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

if(array_key_exists("info_drphone",$pdata)){
    $drphone = $pdata["info_drphone"];
}else{
    if(array_key_exists("dphone",$pdata)){
        $drphone = $pdata["dphone"];
    }
}
//phone
$pdf->writeHTMLCell($w=80, $h=20, $x=36, $y=266.5, $drphone, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

if(array_key_exists("info_drcode",$pdata)){
    $drfax = $pdata["info_drcode"];
}else{
    if(array_key_exists("dcode",$pdata)){
        $drfax = $pdata["dcode"];
    }
}
//fax
$pdf->writeHTMLCell($w=80, $h=20, $x=36, $y=274.5, $drfax, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//Can kiem tra lai cho nay
if(array_key_exists("info_drcode",$pdata)){
    $drahpha = $pdata["info_drcode"];
}else{
    if(array_key_exists("dcode",$pdata)){
        $drahpha = $pdata["dcode"];
    }
}
//AHPHA NO MAD
$pdf->writeHTMLCell($w=80, $h=20, $x=137, $y=244, $drahpha, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

if(array_key_exists("info_dremail",$pdata)){
    $dremail = $pdata["info_dremail"];
}else{
    if(array_key_exists("demail",$pdata)){
        $dremail = $pdata["demail"];
    }
}
//Email
$pdf->writeHTMLCell($w=80, $h=20, $x=127, $y=252, $dremail, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//if(array_key_exists("info_drsign",$pdata)){
//    $drsign = $pdata["info_drsign"];
//}else{
//    if(array_key_exists("drsign",$pdata)){
//        $drsign = $pdata["drsign"];
//    }
//}

//SIGNATURE
if(array_key_exists("info_drsign",$pdata)){
    $drsign = $pdata["info_drsign"];
}else{
    if(array_key_exists("drsign",$pdata)){
        $drsign = $pdata["drsign"];
    }else{
		$drsign = "";
	}
}

if(strlen($drsign) > 0){
	$imgdata = str_replace(' ','+',$drsign);
	preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $imgdata);
	copy("data:image/png;base64,".$imgdata,"output/temp5.png");

	list($width, $height, $type, $attr)= getimagesize("output/temp5.png");
}

$pdf->Image("output/temp5.png", 125, 260,64, 11, '', '', '', false, 300, '', false, false, 0); // no capacity for any work


if(array_key_exists("info_drexamdate",$pdata)){
    $drexamdate = $pdata["info_drexamdate"];
}else{
    if(array_key_exists("examdate",$pdata)){
        $drexamdate = $pdata["examdate"];
    }
}

//Date
$pdf->writeHTMLCell($w=80, $h=20, $x=127, $y=274.5, $drexamdate, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address


//End
//// start printing data
//$pdf->writeHTMLCell($w=40, $h=0, $x=46, $y=84, $salutation[$data['data']['salut']-1].' '.$data['data']['gname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); //first name
//$pdf->writeHTMLCell($w=40, $h=0, $x=125, $y=84, $data['data']['fname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // last name
//$pdf->writeHTMLCell($w=140, $h=0, $x=38, $y=89, $data['data']['address'].(($data['data']['suburb']!='')?', ':'').$data['data']['suburb'].(($data['data']['postcode']!='')?', ':'').$data['data']['postcode'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address
//$pdf->writeHTMLCell($w=80, $h=0, $x=42, $y=94, $data['data']['wfone'].(($data['data']['hfone']!='')?'-':'').$data['data']['hfone'].(($data['data']['mfone']!='')?'-':'').$data['data']['mfone'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // fone
//$pdf->writeHTMLCell($w=40, $h=0, $x=97, $y=99, $data['data']['adate'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // date
//$pdf->writeHTMLCell($w=40, $h=0, $x=97, $y=103.5, $data['data']['alocation'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // location
//
//$pdf->writeHTMLCell($w=140, $h=8, $x=22, $y=43, $data['employer']['name'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//$pdf->writeHTMLCell($w=140, $h=8, $x=22, $y=48, $data['employer']['address'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);// employer's detail
//
//if (array_key_exists('f-assessment-1',$pdata))
//	if ('on'==$pdata['f-assessment-1'])
//		$pdf->Image($checkMark,19, 126.5, 3.5, 3.5, '', '', '', false, 300, '', false, false, 0); //Fit to return to pre-injury duties
//if (array_key_exists('f-assessment-2',$pdata))
//	if ('on'==$pdata['f-assessment-2'])
//		$pdf->Image($checkMark,19, 131, 3.5, 3.5, '', '', '', false, 300, '', false, false, 0);
//if (array_key_exists('f-assessment-3',$pdata))
//	if ('on'==$pdata['f-assessment-3'])
//		$pdf->Image($checkMark,19, 136.5, 3.5, 3.5, '', '', '', false, 300, '', false, false, 0);
//
//$pdf->writeHTMLCell($w=40, $h=0, $x=120, $y=121.5, ((array_key_exists('f-from-date1',$pdata))?$pdata['f-from-date1']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//
//if (array_key_exists('f-assessment-4',$pdata))
//	if ('on'==$pdata['f-assessment-4'])
//		$pdf->Image($checkMark, 19, 151, 3.5, 3.5, '', '', '', false, 300, '', false, false, 0); //restricted hours
//$pdf->writeHTMLCell($w=170, $h=0, $x=77, $y=145, ((array_key_exists('f-from-date',$pdata))?$pdata['f-from-date']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//if (array_key_exists('f-assessment-5',$pdata))
//	if ('on'==$pdata['f-assessment-5']){
//		$pdf->Image($checkMark, 19, 155.5, 3.5, 3.5, '', '', '', false, 300, '', false, false, 0);
//		$pdf->writeHTMLCell($w=170, $h=0, $x=24, $y=162, ((array_key_exists('f-fittxt',$pdata))?$pdata['f-fittxt']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//}
//if (array_key_exists('f-assessment-6',$pdata))
//	if ('on'==$pdata['f-assessment-6'])
//		$pdf->Image($checkMark, 24.5, 206, 3.5, 3.5, '', '', '', false, 300, '', false, false, 0);
//if (array_key_exists('f-assessment-7',$pdata))
//	if ('on'==$pdata['f-assessment-7'])
//		$pdf->Image($checkMark,24.5, 213, 3.5, 3.5, '', '', '', false, 300, '', false, false, 0); //Work restrictions
//
//if (''!=$data['data']['drsign']){
//	//$imgdata = base64_decode(substr($data['data']['drsigntxt'],22));
//	//$imgdata = str_replace(' ','+',$imgdata);
//
//	$imgdata = $drsign;
//	$imgdata = str_replace(' ','+',$imgdata);
//
//	preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $imgdata);
//
//	//echo $imgdata;
//	copy("data:image/png;base64,".$imgdata,"output/temp.png");
//
//	//file_put_contents("output/temp.png", $imgdata);
//	//fclose($image);
//	list($width, $height, $type, $attr)= getimagesize("output/temp.png");
//	//echo substr($pdata['drsigntxt'],22);
//	$pdf->Image("output/temp.png", 45, 257, 20, 20*$height/$width, '', '', '', false, 300, '', false, false, 0);
//	//$pdf->Image("output/temp.png", 10, 10, 50, 20, '', '', '', false, 300, '', false, false, 0);
//	//$pdf->Image('@'.$imgdata);
//}
//
//$pdf->writeHTMLCell($w=40, $h=0, $x=88, $y=69, ((array_key_exists('examdate',$pdata))?$pdata['examdate']:"").'  '.((array_key_exists('examtime',$pdata))?$pdata['examtime']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//
//// redimed's detail
//$pdf->writeHTMLCell($w=70, $h=0, $x=40, $y=236.5, ((array_key_exists('dname',$pdata))?$pdata['dname']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//$pdf->writeHTMLCell($w=70, $h=0, $x=147, $y=236.5, ((array_key_exists('dcode',$pdata))?$pdata['dcode']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//$pdf->writeHTMLCell($w=70, $h=0, $x=40, $y=241.5, ((array_key_exists('daddress',$pdata))?$pdata['daddress']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//$pdf->writeHTMLCell($w=70, $h=0, $x=40, $y=246.5, "(08) 9230 0900", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//
//$pdf->writeHTMLCell($w=70, $h=0, $x=27, $y=251.5, "(08)9230 0999", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);

?>