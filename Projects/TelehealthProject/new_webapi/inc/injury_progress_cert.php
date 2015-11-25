<?php

// get progress data
//$pdf->AddPage();
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

//print_r($progress);
// get the current page break margin
//$pdf->setPageMark();
$bMargin = $pdf->getBreakMargin();
// get current auto-page-break mode
$auto_page_break = $pdf->getAutoPageBreak();
// disable auto-page-break
$pdf->SetAutoPageBreak(false, 0);
// set bacground image
$img_file = "images/ProgressWA.jpeg"; //
//$img_file ="images/Two_Hands_Final.png";
$checkMark = "images/CheckMark.jpg";
$pdf->Image($img_file, 0, 0, 210, 297, '', '', '', false, 300, '', false, false, 0);
// restore auto-page-break status
//$pdf->SetAutoPageBreak($auto_page_break, $bMargin);
// set the starting point for the page content
$pdf->setPageMark();
$pdf->setPage(1); // <!-- x:4, y~4,5,6 -->
//// start printing data
//Client
if(array_key_exists("fname",$pdata)){
    $fname = $pdata['fname'];
}else{
    $fname = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=41,$y=62,$fname,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

//Date of birth
if(array_key_exists("dob",$pdata)){
    $dateofbirth = $pdata["dob"];
}else{
    $dateofbirth = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=41,$y=71,$dateofbirth,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //Date of birth

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
$pdf->writeHTMLCell($w=80,$h=20,$x=41,$y=80,$phone,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //Phone

//Address
if(array_key_exists("address",$pdata)){
    $address = $pdata["address"];
}else{
    $address = "";
}
$pdf->writeHTMLCell($w=200,$h=20,$x=41,$y=88,$address,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //address

//Last name
if(array_key_exists("gname",$pdata)){
    $lastname = $pdata["gname"];
}else{
    $lastname = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=127,$y=62,$lastname,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //Last name

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

$pdf->writeHTMLCell($w=80,$h=20,$x=127,$y=71,$postcode,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //Claim no
//Email
if(array_key_exists("emmail",$pdata)){
    $email = $pdata["email"];
}else{
    $email = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=127,$y=80,$email,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //Email

///doctor
$pdf->writeHTMLCell($w=80, $h=20, $x=52, $y=105, $pdata['info_drname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); //first name
$pdf->writeHTMLCell($w=220, $h=20, $x=52, $y=114, $pdata['info_draddress'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // last name
$pdf->writeHTMLCell($w=80, $h=20, $x=145, $y=105, $pdata['info_drphone'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

///Medical Assessment
//date of this assessment

if(array_key_exists("textfield_DateOfExamination",$pdata)){
    $dateofInjury = $pdata["textfield_DateOfExamination"];
}else{
    $dateofInjury = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=60,$y=132,$dateofInjury,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //Date of this assessment

//Diagnosis
if(array_key_exists("textfield_diagnosis",$pdata)){
    $diagnosis = $pdata["textfield_diagnosis"];
}else
{
    $diagnosis = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=38,$y=141,$diagnosis,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //Diagnosis


//Date of injury
$pdf->writeHTMLCell($w=80,$h=20,$x=137,$y=132,"25/09/2014",$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //Date of injury

//Progress report
if(array_key_exists("textfield_activities2",$pdata)){
    $activities2 = $pdata["textfield_activities2"];
}else{
    $activities2 = "";
}
$pdf->writeHTMLCell($w=60,$h=20,$x=18,$y=165,$activities2,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

if(array_key_exists("textfield_actual1",$pdata)){
    $actual1 = $pdata["textfield_actual1"];
}else{
    $actual1 = "";
}
$pdf->writeHTMLCell($w=120,$h=20,$x=58,$y=165,$actual1,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

if(array_key_exists("textfield_activities1",$pdata)){
    $activities1 = $pdata["textfield_activities1"];
}else{
    $activities1 = "";
}
$pdf->writeHTMLCell($w=60,$h=20,$x=18,$y=170.5,$activities1,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

if(array_key_exists("textfield_actual2",$pdata)){
    $actual2 = $pdata["textfield_actual2"];
}else{
    $actual2 = "";
}
$pdf->writeHTMLCell($w=120,$h=20,$x=58,$y=170.5,$actual2,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

if(array_key_exists("textfield_activities3",$pdata)){
    $activities3 = $pdata["textfield_activities3"];
}else{
    $activities3 = "";
}
$pdf->writeHTMLCell($w=60,$h=20,$x=18,$y=176,$activities3,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

if(array_key_exists("textfield_actual3",$pdata)){
    $actual3 = $pdata["textfield_actual3"];
}else{
    $actual3 = "";
}
$pdf->writeHTMLCell($w=120,$h=20,$x=58,$y=176,$actual3,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

if(array_key_exists("textfield_activities4",$pdata)){
    $activities4 = $pdata["textfield_activities4"];
}else{
    $activities4 = "";
}
$pdf->writeHTMLCell($w=60,$h=20,$x=18,$y=181.5,$activities4,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

if(array_key_exists("textfield_actual4",$pdata)){
    $actual4 = $pdata["textfield_actual4"];
}else{
    $actual4 = "";
}
$pdf->writeHTMLCell($w=120,$h=20,$x=58,$y=181.5,$actual4,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

if(array_key_exists("textfield_activities5",$pdata)){
    $activities5 = $pdata["textfield_activities5"];
}else{
    $activities5 = "";
}
$pdf->writeHTMLCell($w=60,$h=20,$x=18,$y=187,$activities5,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

if(array_key_exists("textfield_actual5",$pdata)){
    $actual5 = $pdata["textfield_actual5"];
}else{
    $actual5 = "";
}
$pdf->writeHTMLCell($w=120,$h=20,$x=58,$y=187,$actual5,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

if(array_key_exists("textfield_activities6",$pdata)){
    $activities6 = $pdata["textfield_activities6"];
}else{
    $activities6 = "";
}
$pdf->writeHTMLCell($w=60,$h=20,$x=18,$y=192.5,$activities6,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

if(array_key_exists("textfield_actual6",$pdata)){
    $actual6 = $pdata["textfield_actual6"];
}else{
    $actual6 = "";
}
$pdf->writeHTMLCell($w=120,$h=20,$x=58,$y=192.5,$actual6,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

//image check in still require
if(array_key_exists("radio_activites1_yes",$pdata)){
    if($pdata["radio_activites1_yes"]=="yes"){
        $pdf->Image($checkMark, 169.5, 164, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}else{

}

if(array_key_exists("radio_activites1_no",$pdata)){
    if($pdata["radio_activites1_no"]=="yes"){
        $pdf->Image($checkMark, 183, 164, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}

if(array_key_exists("radio_activities2_yes",$pdata)){
    if($pdata["radio_activities2_yes"]=="yes"){
        $pdf->Image($checkMark, 169.5, 169.5, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}

if(array_key_exists("radio_activities2_no",$pdata)){
    if($pdata["radio_activities2_no"]=="yes"){
        $pdf->Image($checkMark, 183, 169.5, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}

if(array_key_exists("radio_activities3_yes",$pdata)){
    if($pdata["radio_activities3_yes"]=="yes"){
        $pdf->Image($checkMark, 169.5, 175, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}

if(array_key_exists("radio_activities3_no",$pdata)){
    if($pdata["radio_activities3_no"]=="yes"){
        $pdf->Image($checkMark, 183, 175, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}

if(array_key_exists("radio_activities4_yes",$pdata)){
    if($pdata["radio_activities4_yes"]=="yes"){
        $pdf->Image($checkMark, 169.5, 180.5, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}

if(array_key_exists("radio_activities4_no",$pdata)){
    if($pdata["radio_activities4_no"]=="yes"){
        $pdf->Image($checkMark, 183, 180.5, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}

if(array_key_exists("radio_activities5_yes",$pdata)){
    if($pdata["radio_activities5_yes"]=="yes"){
        $pdf->Image($checkMark, 169.5, 186, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}

if(array_key_exists("radio_activities5_no",$pdata)){
    if($pdata["radio_activities5_no"]=="yes"){
        $pdf->Image($checkMark, 183, 186, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}

if(array_key_exists("radio_activities6_yes",$pdata)){
    if($pdata["radio_activities6_yes"]=="yes"){
        $pdf->Image($checkMark, 169.5, 191.5, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}

if(array_key_exists("radio_activities6_no",$pdata)){
    if($pdata["radio_activities6_no"]=="yes"){
        $pdf->Image($checkMark, 183, 191.5, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}

//checkbox below
if(array_key_exists("checkbox_otherfactorsappear",$pdata)){
    if($pdata["checkbox_otherfactorsappear"]=="yes"){
        $pdf->Image($checkMark, 16.5, 204.5, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}else{

}


//comment
if(array_key_exists("textview_comment",$pdata)){
    $comment = $pdata["textview_comment"];
}else{
    $comment = "";
}
$pdf->writeHTMLCell($w=200,$h=20,$x=35,$y=213,$comment,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

//Work capacity
if(array_key_exists("textfield_workerusualduties",$pdata)){
    $workerusualduties = $pdata["textfield_workerusualduties"];
}else{
    $workerusualduties= "";
}
$pdf->writeHTMLCell($w=200,$h=20,$x=58,$y=231,$workerusualduties,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //Worker's usual duties
//full capacity checkbox
if(array_key_exists("checkbox_fullcapacityforwork",$pdata)){
    if($pdata["checkbox_fullcapacityforwork"]=="yes"){
        $pdf->Image($checkMark, 16.5, 244.5, 5, 5, '', '', '', false, 300, '', false, false, 0); //full capacity for work
    }
}else{

}
if(array_key_exists("checkbox_butrequiresfurthertreatment",$pdata)){
    if($pdata["checkbox_butrequiresfurthertreatment"]=="yes"){
        $pdf->Image($checkMark, 125.5, 244.5, 5, 5, '', '', '', false, 300, '', false, false, 0); //but requires further treatment
    }
}else{

}

if(array_key_exists("checkbox_somecapacityforwork",$pdata)){
    if($pdata["checkbox_somecapacityforwork"]=="yes"){
        $pdf->Image($checkMark, 16.5, 252.5, 5, 5, '', '', '', false, 300, '', false, false, 0); // some capacity for work
    }
}else{

}

//pre-injurry
//tren
if(array_key_exists("checkbox_pre-injuryduties",$pdata)){
    if($pdata["checkbox_pre-injuryduties"]=="yes"){
        $pdf->Image($checkMark, 21.5, 259.5, 5, 5, '', '', '', false, 300, '', false, false, 0); // some capacity for work
    }
}else{

}

if(array_key_exists("checkbox_modifiedoralternativeduties",$pdata)){
    if($pdata["checkbox_modifiedoralternativeduties"]=="yes"){
        $pdf->Image($checkMark, 66.5, 259.5, 5, 5, '', '', '', false, 300, '', false, false, 0); // some capacity for work
    }
}else{

}
if(array_key_exists("checkbox_workplacemodifications",$pdata)){
    if($pdata["checkbox_workplacemodifications"]=="yes"){
        $pdf->Image($checkMark, 134.5, 259.5, 5, 5, '', '', '', false, 300, '', false, false, 0); // some capacity for work
    }
}else{

}

//duoi
if(array_key_exists("checkbox_pre-injuryhours",$pdata)){
    if($pdata["checkbox_pre-injuryhours"]=="yes"){
        $pdf->Image($checkMark, 21.5, 266.5, 5, 5, '', '', '', false, 300, '', false, false, 0); // some capacity for work
    }
}else{

}

if(array_key_exists("checkbox_modifiedhoursof",$pdata)){
    if($pdata["checkbox_modifiedhoursof"]=="yes"){
        $pdf->Image($checkMark, 66.5, 266.5, 5, 5, '', '', '', false, 300, '', false, false, 0); // some capacity for work
    }
}else{

}

//end
if(array_key_exists("checkbox_nocapacityforanywork",$pdata)){
    if($pdata["checkbox_nocapacityforanywork"]=="yes"){
        $pdf->Image($checkMark, 16.5, 274.5, 5, 5, '', '', '', false, 300, '', false, false, 0); // no capacity for any work
    }
}else{

}

//text field
// full capacity for work from
if(array_key_exists("textfield_fullcapacityforwork",$pdata)){
    $fullcapacityforwork = $pdata["textfield_fullcapacityforwork"];
}else{
    $fullcapacityforwork = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=80,$y=246,$fullcapacityforwork,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name
//some capacity for work from
if(array_key_exists("textfield_somecapacityforwork",$pdata)){
    $somecapacityforwork = $pdata["textfield_somecapacityforwork"];
}else{
    $somecapacityforwork = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=80,$y=253.5,$somecapacityforwork,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name
//some capacity for work to

if(array_key_exists("textfield_tosomecapacityforwork",$pdata)){
    $somecapacityforworkto = $pdata["textfield_tosomecapacityforwork"];
}else{
    $somecapacityforworkto = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=125,$y=253.5,$somecapacityforworkto,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

//hrs/dayk
if(array_key_exists("hoursday",$pdata)){
    $hoursday = $pdata["hoursday"];
}else{
    $hoursday = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=106.5,$y=268.5,$hoursday,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name
//days/wk
if(array_key_exists("dayswk",$pdata)){
    $dayswk = $pdata["dayswk"];
}else{
    $dayswk = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=137,$y=268.5,$dayswk,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name



//textfield for no capacity
//from
if(array_key_exists("textfield_nocapacityforanywork",$pdata)){
    $nocapacityforanywork = $pdata["textfield_nocapacityforanywork"];
}else{
    $nocapacityforanywork = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=80,$y=277,$nocapacityforanywork,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name
//to
if(array_key_exists("textfield_tonocapacityforanywork",$pdata)){
    $tonocapacityforanywork = $pdata["textfield_tonocapacityforanywork"];
}else{
    $tonocapacityforanywork = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=114,$y=277,$tonocapacityforanywork,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name


//Page thu 2
$pdf->AddPage();
//list($width, $height, $type, $attr) = getimagesize("images/ProgressWA.jpeg");
$img_filePart2 = "images/ProgressWAPart2.jpg"; //
$pdf->Image($img_filePart2, 0, 0, 210, 297, '', '', '', false, 300, '', false, false, 0);
// start page 2

//checkbox
if(array_key_exists("checkbox_liftupto",$pdata)){
    if($pdata["checkbox_liftupto"]=="yes"){
        $pdf->Image($checkMark, 12, 35, 5, 5, '', '', '', false, 300, '', false, false, 0); // no capacity for any work
    }
}else{

}

if(array_key_exists("checkbox_situpto",$pdata)){
    if($pdata["checkbox_situpto"]=="yes"){
        $pdf->Image($checkMark, 12, 42, 5, 5, '', '', '', false, 300, '', false, false, 0); // no capacity for any work
    }
}else{

}

if(array_key_exists("checkbox_standupto",$pdata)){
    if($pdata["checkbox_standupto"]=="yes"){
        $pdf->Image($checkMark, 12, 49, 5, 5, '', '', '', false, 300, '', false, false, 0); // no capacity for any work
    }
}else{

}

if(array_key_exists("checkbox_walkupto",$pdata)){
    if($pdata["checkbox_walkupto"]=="yes"){
        $pdf->Image($checkMark, 12, 56, 5, 5, '', '', '', false, 300, '', false, false, 0); // no capacity for any work
    }
}else{

}

if(array_key_exists("checkbox_workbelowshoulder",$pdata)){
    if($pdata["checkbox_workbelowshoulder"]=="yes"){
        $pdf->Image($checkMark, 12, 63, 5, 5, '', '', '', false, 300, '', false, false, 0); // no capacity for any work
    }
}else{

}

//kg
if(array_key_exists("textfield_kg",$pdata)){
    $kg = $pdata["textfield_kg"];
}else{
    $kg = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=42,$y=37.5,$kg,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

if(array_key_exists("textfield_situptomins",$pdata)){
    $situptomins = $pdata["textfield_situptomins"];
}else{
    $situptomins = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=42,$y=43.5,$situptomins,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

if(array_key_exists("textfield_standuptomins",$pdata)){
    $standuptomins = $pdata["textfield_standuptomins"];
}else{
    $standuptomins = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=42,$y=50.5,$standuptomins,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

if(array_key_exists("textfield_m",$pdata)){
    $m = $pdata["textfield_m"];
}else{
    $m = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=42,$y=57,$m,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

//textview
if(array_key_exists("textview_workbelowshoulder",$pdata)){
    $workbelowshoulder = $pdata["textview_workbelowshoulder"];
}else{
    $workbelowshoulder = "";
}
$pdf->writeHTMLCell($w=200,$h=100,$x=75,$y=37.5,$workbelowshoulder,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

//injury management plan
//column
if(array_key_exists("textfield_activities1_1",$pdata)){
    $activities1_1 = $pdata["textfield_activities1_1"];
}else{
    $activities1_1 = "";
}
$pdf->writeHTMLCell($w=60,$h=20,$x=17,$y=88,$activities1_1,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

if(array_key_exists("textfield_activities2_2",$pdata)){
    $activities1_2 = $pdata["textfield_activities2_2"];
}else{
    $activities1_2 = "";
}
$pdf->writeHTMLCell($w=60,$h=20,$x=17,$y=94.5,$activities1_2,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name
if(array_key_exists("textfield_activities3_3",$pdata)){
    $activities1_3 = $pdata["textfield_activities3_3"];
}else{
    $activities1_3 = "";
}
$pdf->writeHTMLCell($w=60,$h=20,$x=17,$y=100.5,$activities1_3,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name
if(array_key_exists("textfield_activities4_4",$pdata)){
    $activities1_4 = $pdata["textfield_activities4_4"];
}else{
    $activities1_4 = "";
}
$pdf->writeHTMLCell($w=60,$h=20,$x=17,$y=106.5,$activities1_4,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name
if(array_key_exists("textfield_activities5_5",$pdata)){
    $activities1_5 = $pdata["textfield_activities5_5"];
}else{
    $activities1_5 = "";
}
$pdf->writeHTMLCell($w=60,$h=20,$x=17,$y=112.5,$activities1_5,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name
if(array_key_exists("textfield_activities6_6",$pdata)){
    $activities1_6 = $pdata["textfield_activities6_6"];
}else{
    $activities1_6 = "";
}
$pdf->writeHTMLCell($w=60,$h=20,$x=17,$y=118.5,$activities1_6,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

//row
if(array_key_exists("textfield_purpose1_1",$pdata)){
    $purpose1 = $pdata["textfield_purpose1_1"];
}else{
    $purpose1 = "";
}
$pdf->writeHTMLCell($w=120,$h=20,$x=65,$y=88,$purpose1,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

if(array_key_exists("textfield_purpose2_2",$pdata)){
    $purpose2 = $pdata["textfield_purpose2_2"];
}else{
    $purpose2 = "";
}
$pdf->writeHTMLCell($w=120,$h=20,$x=65,$y=94.5,$purpose2,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

if(array_key_exists("textfield_purpose3_3",$pdata)){
    $purpose3 = $pdata["textfield_purpose3_3"];
}else{
    $purpose3 = "";
}
$pdf->writeHTMLCell($w=120,$h=20,$x=65,$y=100.5,$purpose3,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

if(array_key_exists("textfield_purpose4_4",$pdata)){
    $purpose4 = $pdata["textfield_purpose4_4"];
}else{
    $purpose4 = "";
}
$pdf->writeHTMLCell($w=120,$h=20,$x=65,$y=106.5,$purpose4,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

if(array_key_exists("textfield_purpose5_5",$pdata)){
    $purpose5 = $pdata["textfield_purpose5_5"];
}else{
    $purpose5 = "";
}
$pdf->writeHTMLCell($w=120,$h=20,$x=65,$y=112.5,$purpose5,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

if(array_key_exists("textfield_purpose6_6",$pdata)){
    $purpose6 = $pdata["textfield_purpose6_6"];
}else{
    $purpose6 = "";
}
$pdf->writeHTMLCell($w=120,$h=20,$x=65,$y=118.5,$purpose6,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

//checkbox in injury management plan
if(array_key_exists("checkbox_IsupporttheRTWprogram",$pdata)){
    if($pdata["checkbox_IsupporttheRTWprogram"]=="yes"){
        $pdf->Image($checkMark, 12.5, 124.5, 5, 5, '', '', '', false, 300, '', false, false, 0); // no capacity for any work
    }
}else{

}

if(array_key_exists("checkbox_Iwouldlikemoreinformation",$pdata)){
    if($pdata["checkbox_Iwouldlikemoreinformation"]=="yes"){
        $pdf->Image($checkMark, 12.5, 131.5, 5, 5, '', '', '', false, 300, '', false, false, 0); // no capacity for any work
    }
}else{

}

if(array_key_exists("checkbox_Iwouldliketobeinvolved",$pdata)){
    if($pdata["checkbox_Iwouldliketobeinvolved"]=="yes"){
        $pdf->Image($checkMark, 12.5, 138.5, 5, 5, '', '', '', false, 300, '', false, false, 0); // no capacity for any work
    }
}else{

}

if(array_key_exists("checkbox_pleaseengageaworkplaceehabilitationprovider",$pdata)){
    if($pdata["checkbox_pleaseengageaworkplaceehabilitationprovider"]=="yes"){
        $pdf->Image($checkMark, 12.5, 145.5, 5, 5, '', '', '', false, 300, '', false, false, 0); // no capacity for any work
    }
}else{

}

//textfield WRP dated
if(array_key_exists("textfield_IsupporttheRTWprogramestablished",$pdata)){
    $isupporttheRTW = $pdata["textfield_IsupporttheRTWprogramestablished"];
}else{
    $isupporttheRTW = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=155,$y=126,$isupporttheRTW,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

if(array_key_exists("textfield_providenamenandcontact",$pdata)){
    $providenameandcontact = $pdata["textfield_providenamenandcontact"];
}else{
    $providenameandcontact = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=15,$y=155,$providenameandcontact,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name


//Part Next review date
//checkbox
if(array_key_exists("checkbox_Iwillreviewworkeragain",$pdata)){
    if($pdata["checkbox_Iwillreviewworkeragain"]=="yes"){
        $pdf->Image($checkMark, 14.5, 190, 5, 5, '', '', '', false, 300, '', false, false, 0); // no capacity for any work
    }
}else{

}

if(array_key_exists("textfield_comment",$pdata)){
    $reviewComment = $pdata["textfield_comment"];
}else{
    $reviewComment = "";
}
$pdf->writeHTMLCell($w=200,$h=20,$x=36,$y=200,$reviewComment,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name


if(array_key_exists("textfield_reviewworkeragain",$pdata)){
    $reviewworkeragain = $pdata["textfield_reviewworkeragain"];
}else{
    $reviewworkeragain = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=72,$y=192,$reviewworkeragain,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

//Part Medical practitioner's detail
//Name
if(array_key_exists("info_drname",$pdata)){
    $drname = $pdata["info_drname"];
}else{
    if(array_key_exists("dname",$pdata)){
        $drname = $pdata["dname"];
    }
}
$pdf->writeHTMLCell($w=80,$h=20,$x=28,$y=221.5,$drname,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name
//Address
if(array_key_exists("info_draddress",$pdata)){
    $draddress = $pdata["info_draddress"];
}else{
    if(array_key_exists("daddress",$pdata)){
        $draddress = $pdata["daddress"];
    }
}
$pdf->writeHTMLCell($w=80,$h=20,$x=28,$y=230,$draddress,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

//phone
if(array_key_exists("info_drphone",$pdata)){
    $drphone = $pdata["info_drphone"];
}else{
    if(array_key_exists("dphone",$pdata)){
        $drphone = $pdata["dphone"];
    }
}
$pdf->writeHTMLCell($w=80,$h=20,$x=28,$y=254.5,$drphone,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

//fax
if(array_key_exists("info_drcode",$pdata)){
    $drfax = $pdata["info_drcode"];
}else{
    if(array_key_exists("dcode",$pdata)){
        $drfax = $pdata["dcode"];
    }
}
$pdf->writeHTMLCell($w=80,$h=20,$x=28,$y=263,$drfax,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

//AHPRA no
if(array_key_exists("info_drcode",$pdata)){
    $drahpha = $pdata["info_drcode"];
}else{
    if(array_key_exists("dcode",$pdata)){
        $drahpha = $pdata["dcode"];
    }
}
$pdf->writeHTMLCell($w=80,$h=20,$x=138,$y=221.5,$drahpha,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

//Email
if(array_key_exists("info_dremail",$pdata)){
    $dremail = $pdata["info_dremail"];
}else{
    if(array_key_exists("demail",$pdata)){
        $dremail = $pdata["demail"];
    }
}
$pdf->writeHTMLCell($w=80,$h=20,$x=128,$y=230,$dremail,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

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
    $pdf->Image("output/temp5.png", 125, 238,67, 11.5, '', '', '', false, 300, '', false, false, 0); // no capacity for any work
}


//Date
if(array_key_exists("info_drexamdate",$pdata)){
    $drexamdate = $pdata["info_drexamdate"];
}else{
    if(array_key_exists("examdate",$pdata)){
        $drexamdate = $pdata["examdate"];
    }
}
$pdf->writeHTMLCell($w=80,$h=20,$x=128,$y=255,$drexamdate,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name

/////////
// Set some contet to print
//$html = "<p>".$pdata['info_drsign']." Sign: ". $pdata['info_drname']." Test</p>";
//    if(array_key_exists('info_drsign',$pdata)){
//        $html = $html.$pdata['info_drsign'];
//    }else{
//        echo('not exist');
//    }

//$imageData = base64_decode('');
//$pdf->Image('@'.$imageData);

// ---------------------------------------------------------
?>