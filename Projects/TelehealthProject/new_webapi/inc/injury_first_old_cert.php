<?php
print_r($pdata);
// get the current page break margin
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


$bMargin = $pdf->getBreakMargin();
// get current auto-page-break mode
$auto_page_break = $pdf->getAutoPageBreak();
// disable auto-page-break
$pdf->SetAutoPageBreak(false, 0);
// set bacground image
$img_file = "images/FirstWAPart1.jpg";
$checkMark = "images/CheckMark.jpg";
$pdf->Image($img_file, 0, 0, 210, 297, '', '', '', false, 300, '', false, false, 0);
// restore auto-page-break status
//$pdf->SetAutoPageBreak($auto_page_break, $bMargin);
// set the starting point for the page content
$pdf->setPageMark();
$pdf->setPage(1);

//Edit here
//Page1
//Client
//first Name
if(array_key_exists("fname",$pdata)){
    $fname = $pdata['fname'];
}else{
    $fname = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=45,$y=68,$fname,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //First name
//Date of birth
if(array_key_exists("dob",$pdata)){
    $dateofbirth = $pdata["dob"];
}else{
    $dateofbirth = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=45,$y=77,$dateofbirth,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //Date of birth

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
$pdf->writeHTMLCell($w=80,$h=20,$x=45,$y=86,$phone,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //Phone

//Address
if(array_key_exists("address",$pdata)){
    $address = $pdata["address"];
}else{
    $address = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=45,$y=94,$address,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //address

//Last name
if(array_key_exists("gname",$pdata)){
    $lastname = $pdata["gname"];
}else{
    $lastname = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=127,$y=68.5,$lastname,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //Last name

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
$pdf->writeHTMLCell($w=80,$h=20,$x=127,$y=77,$postcode,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //Claim no

//Email
if(array_key_exists("emmail",$pdata)){
    $email = $pdata["email"];
}else{
    $email = "";
}
$pdf->writeHTMLCell($w=80,$h=20,$x=127,$y=85.5,$email,$border=0,$ln=0,$fill=0,$reseth=true,$align='',$autopadding=true); //Email

///doctor
if(array_key_exists("info_drname",$pdata)){
    $nameDorctor = $pdata["info_drname"];
}else{
    $nameDorctor = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=52, $y=119.5, $nameDorctor, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); //first name

if(array_key_exists("info_draddress",$pdata)){
    $addressDoctor = $pdata["info_draddress"];
}else{
    $addressDoctor = "";
}
$pdf->writeHTMLCell($w=300, $h=20, $x=52, $y=128, $addressDoctor, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // last name

if(array_key_exists("info_drphone",$pdata)){
    $phoneDoctor = $pdata["info_drphone"];
}else{
    $phoneDoctor = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=145, $y=119.5, $phoneDoctor, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//consent authority

//worker's signature
//$signature = "images/signup.jpg";
if(array_key_exists("signtxt",$pdata)){
    $sign = $pdata["signtxt"];
    $signdecode = base64_decode($sign);
    $pdf->Image($signdecode, 54, 166, 46, 13, '', '', '', false, 300, '', false, false, 0);
}else{

}

//Signature
if(array_key_exists("signtxt",$pdata)){
    $sign = $pdata["signtxt"];
}else{
    $sign = "";
}
if(strlen($sign) > 0){
    //
    $imgdata = str_replace(' ','+',$sign);
    preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $imgdata);
    copy("data:image/png;base64,".$imgdata,"output/temp3.png");
    $pdf->Image("output/temp3.png", 54, 166, 46, 13, '', '', '', false, 300, '', false, false, 0);
}
//print name

$pdf->writeHTMLCell($w=80, $h=20, $x=130, $y=167, $fname.' '.$lastname, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address
//date
$pdf->writeHTMLCell($w=80, $h=20, $x=130, $y=174.5, "hungcaothanh", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//Worker's description of injury
//date of injury
if(array_key_exists("textfield_DateOfExamination",$pdata)){
    $dateofInjury = $pdata["textfield_DateOfExamination"];
}else{
    $dateofInjury = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=54, $y=191.5, $dateofInjury, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address
//what's happen
$pdf->writeHTMLCell($w=80, $h=20, $x=54, $y=199.5, "hungcaothanh", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address
//worker's sympton
$pdf->writeHTMLCell($w=80, $h=20, $x=54, $y=207, "hungcaothanh", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address


//Medical assessment
//date of this assessment
$pdf->writeHTMLCell($w=80, $h=20, $x=61, $y=235, "hungcaothanh", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address
//clinical finding
if(array_key_exists("textview_clinicalfindings",$pdata)){
    $clinicalFindings = $pdata["textview_clinicalfindings"];
}else{
    $clinicalFindings = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=61, $y=243, $clinicalFindings, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address
//Dianologic
if(array_key_exists("textfield_diagnosis",$pdata)){
    $dianologic = $pdata["textfield_diagnosis"];
}else{
    $dianologic = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=61, $y=255.5, $dianologic, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//checkbox in medical assessment
if(array_key_exists("radio_theinjuryinconsistent_yes",$pdata)){
    if($pdata["radio_theinjuryinconsistent_yes"]=="yes"){
        $pdf->Image($checkMark, 135, 262, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}else{

}

if(array_key_exists("radio_theinjuryinconsistent_no",$pdata)){
    if($pdata["radio_theinjuryinconsistent_no"]=="yes"){
        $pdf->Image($checkMark, 148, 262, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}else{

}
if(array_key_exists("radio_theinjuryinconsistent_uncertain",$pdata)){
    if($pdata["radio_theinjuryinconsistent_uncertain"]=="yes"){
        $pdf->Image($checkMark, 160, 262, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}else{

}

if(array_key_exists("radio_theinjuryis_newcondition",$pdata)){
    if($pdata["radio_theinjuryis_newcondition"]=="yes"){
        $pdf->Image($checkMark, 55, 270, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}else{

}

if(array_key_exists("radio_theinjuryis_recurrence",$pdata)){
    if($pdata["radio_theinjuryis_recurrence"]=="yes"){
        $pdf->Image($checkMark, 99, 270, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}else{

}


//Page2
$pdf->AddPage();
$image_file2 = "images/FirstWAPart2.jpg";
$pdf->Image($image_file2, 0, 0, 210, 297, '', '', '', false, 300, '', false, false, 0);


//Start page 2
//Work capacity
//worker's usual duties
if(array_key_exists("textfield_workerusualduties",$pdata)){
    $workderusualsuties = $pdata["textfield_workerusualduties"];
}else{
    $workderusualsuties = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=57, $y=19, $workderusualsuties, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//checkbox
if(array_key_exists("checkbox_fullcapacityforwork",$pdata)){
    if($pdata["checkbox_fullcapacityforwork"] == "yes"){
        $pdf->Image($checkMark, 19, 34, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}else{

}

if(array_key_exists("checkbox_requirefurthertreatment",$pdata)){
    if($pdata["checkbox_requirefurthertreatment"]=="yes"){
        $pdf->Image($checkMark, 133, 34, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}else{

}

//full capacity for work from
if(array_key_exists("textfield_fullcapacityforwork",$pdata)){
    $fullcapacityforwork = $pdata["textfield_fullcapacityforwork"];
}else{
    $fullcapacityforwork = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=77, $y=34.5, $fullcapacityforwork, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

if(array_key_exists("checkbox_somecapacityforwork",$pdata)){
    if($pdata["checkbox_somecapacityforwork"]=="yes"){
        $pdf->Image($checkMark, 19, 41, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}else{

}

//from
if(array_key_exists("textfield_somecapacityforwork",$pdata)){
    $somecapacityforwork = $pdata["textfield_somecapacityforwork"];
}else{
    $somecapacityforwork = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=77, $y=43, $somecapacityforwork, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//to
if(array_key_exists("textfield_tosomecapacityforwork",$pdata)){
    $tosomecapacityforwork = $pdata["textfield_tosomecapacityforwork"];
}else{
    $tosomecapacityforwork = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=135, $y=43, $tosomecapacityforwork, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//checkbox pre-injury
//front
if(array_key_exists("checkbox_pre-injuryduties",$pdata)){
    if($pdata["checkbox_pre-injuryduties"]=="yes"){
        $pdf->Image($checkMark, 27, 49, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}else{

}
if(array_key_exists("checkbox_modifiedoralternative",$pdata)){
    if($pdata["checkbox_modifiedoralternative"]=="yes"){
        $pdf->Image($checkMark, 70, 49, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}else{

}
if(array_key_exists("checkbox_workplacemodifications",$pdata)){
    if($pdata["checkbox_workplacemodifications"]=="yes"){
        $pdf->Image($checkMark, 142, 49, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}else{

}

//below
if(array_key_exists("checkbox_pre-injuryhours",$pdata)){
    if($pdata["checkbox_pre-injuryhours"] =="yes"){
        $pdf->Image($checkMark, 27, 57, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}else{

}

if(array_key_exists("checkbox_modifiedhoursof",$pdata)){
    if($pdata["checkbox_modifiedhoursof"]=="yes"){
        $pdf->Image($checkMark, 70, 57, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}else{

}

//hours/day
if(array_key_exists("textfield_hrs/day",$pdata)){
    $hrs = $pdata["textfield_hrs/day"];
}else{
    $hrs = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=110, $y=57.5, $hrs, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address
//days/wk
if(array_key_exists("textfield_days/wk",$pdata)){
    $days = $pdata["textfield_days/wk"];
}else{
    $days = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=142, $y=57.5, $days, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//checkbox no capacity for any work
if(array_key_exists("checkbox_nocapacityforanywork",$pdata)){
    if($pdata["checkbox_nocapacityforanywork"] == "yes"){
        $pdf->Image($checkMark, 19, 64, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}else{

}

//from
if(array_key_exists("textfield_nocapacityforanywork",$pdata)){
    $nocapacityforanywork = $pdata["textfield_nocapacityforanywork"];
}else{
    $nocapacityforanywork = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=80, $y=65.5, $nocapacityforanywork, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address
//to
if(array_key_exists("textfield_tonocapacityforanywork",$pdata)){
    $tonocapacityforanywork = $pdata["textfield_tonocapacityforanywork"];
}else{
    $tonocapacityforanywork = "";
}

$pdf->writeHTMLCell($w=80, $h=20, $x=112, $y=65.5, $tonocapacityforanywork, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address


//Worker has capacity to
//checkbox
if(array_key_exists("checkbox_liftupto",$pdata)){
    if($pdata["checkbox_liftupto"] == "yes"){
        $pdf->Image($checkMark, 19, 88, 5, 5, '', '', '', false, 300, '', false, false, 0); //lift up to
    }
}else{

}

if(array_key_exists("checkbox_situpto",$pdata)){
    if($pdata["checkbox_situpto"]=="yes"){
        $pdf->Image($checkMark, 19, 96, 5, 5, '', '', '', false, 300, '', false, false, 0); //sit up to
    }
}else{

}

if(array_key_exists("checkbox_standuptp",$pdata)){
    if($pdata["checkbox_standuptp"]=="yes"){
        $pdf->Image($checkMark, 19, 103.5, 5, 5, '', '', '', false, 300, '', false, false, 0); // stand up to
    }
}else{

}
if(array_key_exists("checkbox_walkupto",$pdata)){
    if($pdata["checkbox_walkupto"]=="yes"){
        $pdf->Image($checkMark, 19, 111, 5, 5, '', '', '', false, 300, '', false, false, 0); // walk up to
    }
}else{

}

if(array_key_exists("checkbox_m",$pdata)){
    if($pdata["checkbox_m"]=="yes"){
        $pdf->Image($checkMark, 19, 119, 5, 5, '', '', '', false, 300, '', false, false, 0); // work below shoulder height
    }
}else{

}

//kg
if(array_key_exists("textfield_kg",$pdata)){
    $kg = $pdata["textfield_kg"];
}else{
    $kg = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=48, $y=90.5, $kg, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address
//sit up to mins
if(array_key_exists("textfield_minssitupto",$pdata)){
    $minssitup = $pdata["textfield_minssitupto"];
}else{
    $minssitup = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=48, $y=98, $minssitup, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address
//stand up to mins
if(array_key_exists("textfield_minsstandupto",$pdata)){
    $minsstandup = $pdata["textfield_minsstandupto"];
}else{
    $minsstandup = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=48, $y=106.5, $minsstandup, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address
//walk up to m
if(array_key_exists("textfield_m",$pdata)){
    $m = $pdata["textfield_m"];
}else{
    $m = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=48, $y=114, $m, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address


//textfield
if(array_key_exists("textview_workbelowshoulderheight",$pdata)){
    $workbelowshoulder = $pdata["textview_workbelowshoulderheight"];
}else{
    $workbelowshoulder = "";
}
$pdf->writeHTMLCell($w=200, $h=100, $x=81, $y=93, $workbelowshoulder, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address
//$pdf->writeHTMLCell($w=80, $h=20, $x=81, $y=98, "hungcaothanh", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//$pdf->writeHTMLCell($w=80, $h=20, $x=81, $y=103, "hungcaothanh", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//$pdf->writeHTMLCell($w=80, $h=20, $x=81, $y=107.5, "hungcaothanh", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//$pdf->writeHTMLCell($w=80, $h=20, $x=81, $y=112.5, "hungcaothanh", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address


//7. Injurry management plan
//column
if(array_key_exists("textfield_activities1",$pdata)){
    $activities1 = $pdata["textfield_activities1"];
}else{
    $activities1 = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=19, $y=140, $activities1, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

if(array_key_exists("textfield_activities2",$pdata)){
    $activities2 = $pdata["textfield_activities2"];
}else{
    $activities2 = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=19, $y=145.5, $activities2, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

if(array_key_exists("textfield_activities3",$pdata)){
    $activities3 = $pdata["textfield_activities3"];
}else{
    $activities3 = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=19, $y=151, $activities3, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

if(array_key_exists("textfield_activities4",$pdata)){
    $activities4 = $pdata["textfield_activities4"];
}else{
    $activities4 ="";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=19, $y=157, $activities4, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

if(array_key_exists("textfield_activities5",$pdata)){
    $activities5 = $pdata["textfield_activities5"];
}else{
    $activities5 = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=19, $y=162.5, $activities5, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

if(array_key_exists("textfield_activities6",$pdata)){
    $activities6 = $pdata["textfield_activities6"];
}else{
    $activities6 = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=19, $y=168.5, $activities6, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//row

if(array_key_exists("textfield_purpose1",$pdata)){
    $purpose1 = $pdata["textfield_purpose1"];
}else{
    $purpose1 = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=69, $y=140, $purpose1, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

if(array_key_exists("textfield_purpose2",$pdata)){
    $purpose2 = $pdata["textfield_purpose2"];
}else{
    $purpose2 = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=69, $y=145.5, $purpose2, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

if(array_key_exists("textfield_purpose3",$pdata)){
    $purpose3 = $pdata["textfield_purpose3"];
}else{
    $purpose3 = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=69, $y=151, $purpose3, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

if(array_key_exists("textfield_purpose4",$pdata)){
    $purpose4 = $pdata["textfield_purpose4"];
}else{
    $purpose4 = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=69, $y=157, $purpose4, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

if(array_key_exists("textfield_purpose5",$pdata)){
    $purpose5 = $pdata["textfield_purpose5"];
}else{
    $purpose5 = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=69, $y=162.5, $purpose5, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

if(array_key_exists("textfield_purpose6",$pdata)){
    $purpose6 = $pdata["textfield_purpose6"];
}else{
    $purpose6 = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=69, $y=168.5, $purpose6, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address


//I would like checkbox
if(array_key_exists("checkbox_moreinformation",$pdata)){
    if($pdata["checkbox_moreinformation"]=="yes"){
        $pdf->Image($checkMark, 52, 173, 5, 5, '', '', '', false, 300, '', false, false, 0); // work below shoulder height
    }
}else{

}

if(array_key_exists("checkbox_aRTWprogram",$pdata)){
    if($pdata["checkbox_aRTWprogram"]=="yes"){
        $pdf->Image($checkMark, 126, 173, 5, 5, '', '', '', false, 300, '', false, false, 0); // work below shoulder height
    }
}else{

}

if(array_key_exists("checkbox_tobeinvolved",$pdata)){
    if($pdata["checkbox_tobeinvolved"]=="yes"){
        $pdf->Image($checkMark, 52, 178, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}else
{

}

//8. Next review day
if(array_key_exists("checkbox_workerdoesnotneed",$pdata)){
    if($pdata["checkbox_workerdoesnotneed"]=="yes"){
        $pdf->Image($checkMark, 19, 213, 5, 5, '', '', '', false, 300, '', false, false, 0); // work below shoulder height
    }
}else{

}

if(array_key_exists("",$pdata)){
    if($pdata[""]=="yes"){
        $pdf->Image($checkMark, 19, 220, 5, 5, '', '', '', false, 300, '', false, false, 0);
    }
}else{

}

//textfield
if(array_key_exists("textfield_Iwillreviewagain",$pdata)){
    $reviewWorkerAgain = $pdata["textfield_Iwillreviewagain"];
}else{
    $reviewWorkerAgain = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=74, $y=221.5, $reviewWorkerAgain, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//comment
if(array_key_exists("textfield_comments",$pdata)){
    $comment = $pdata["textfield_comments"];
}else{
    $comment = "";
}
$pdf->writeHTMLCell($w=80, $h=20, $x=39, $y=228.5, $comment, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//9. Medical Practitioner's detail
//name
if(array_key_exists("info_drname",$pdata)){
    $drname = $pdata["info_drname"];
}else{
    if(array_key_exists("dname",$pdata)){
        $drname = $pdata["dname"];
    }else{
        $drname = "";
    }
}
$pdf->writeHTMLCell($w=80, $h=20, $x=34, $y=244.5, $drname, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//Address
if(array_key_exists("info_draddress",$pdata)){
    $draddress = $pdata["info_draddress"];
}else{
    if(array_key_exists("daddress",$pdata)){
        $draddress = $pdata["daddress"];
    }else{
        $draddress = "";
    }
}
$pdf->writeHTMLCell($w=80, $h=20, $x=34, $y=252.5, $draddress, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//phone
if(array_key_exists("info_drphone",$pdata)){
    $drphone = $pdata["info_drphone"];
}else{
    if(array_key_exists("dphone",$pdata)){
        $drphone = $pdata["dphone"];
    }else{
        $drphone = "";
    }
}
$pdf->writeHTMLCell($w=80, $h=20, $x=34, $y=267, $drphone, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//fax
if(array_key_exists("info_drcode",$pdata)){
    $drfax = $pdata["info_drcode"];
}else{
    if(array_key_exists("dcode",$pdata)){
        $drfax = $pdata["dcode"];
    }else{
        $drfax = "";
    }
}
$pdf->writeHTMLCell($w=80, $h=20, $x=34, $y=275, $drfax, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address


//AHPHA NO MAD
if(array_key_exists("info_drcode",$pdata)){
    $drahpha = $pdata["info_drcode"];
}else{
    if(array_key_exists("dcode",$pdata)){
        $drahpha = $pdata["dcode"];
    }else{
        $drahpha = "";
    }
}
$pdf->writeHTMLCell($w=80, $h=20, $x=139, $y=244.5, $drahpha, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//Email
if(array_key_exists("info_dremail",$pdata)){
    $dremail = $pdata["info_dremail"];
}else{
    if(array_key_exists("demail",$pdata)){
        $dremail = $pdata["demail"];
    }else{
        $dremail = "";
    }
}
$pdf->writeHTMLCell($w=80, $h=20, $x=129, $y=252.5, $dremail, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//Signature
//$signature = "images/signup.jpg";
if(array_key_exists("info_drsign",$pdata)){
    $drsign = $pdata["info_drsign"];
}else{
    if(array_key_exists("drsign",$pdata)){
        $drsign = $pdata["drsign"];
    }else{
        $drsign = "";
    }
}
//
if(strlen($drsign) > 0){

}
$imgdata = str_replace(' ','+',$drsign);
preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $imgdata);
copy("data:image/png;base64,".$imgdata,"output/temp2.png");

list($width, $height, $type, $attr)= getimagesize("output/temp2.png");
//$pdf->Image("output/temp2.png", 40, 179, 9, 9*$height/$width, '', '', '', false, 300, '', false, false, 0);
$pdf->Image("output/temp2.png", 127, 259,64, 13, '', '', '', false, 300, '', false, false, 0); // no capacity for any work

//Date
if(array_key_exists("info_drexamdate",$pdata)){
    $drexamdate = $pdata["info_drexamdate"];
}else{
    if(array_key_exists("examdate",$pdata)){
        $drexamdate = $pdata["examdate"];
    }else{
        $drexamdate = "";
    }
}

$pdf->writeHTMLCell($w=80, $h=20, $x=129, $y=275, $drexamdate, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address

//End
//// start printing data
//$pdf->writeHTMLCell($w=40, $h=0, $x=36, $y=41, $salutation[$data['data']['salut']-1].' '.$data['data']['gname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); //first name
//$pdf->writeHTMLCell($w=40, $h=0, $x=95, $y=41, $data['data']['fname'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // last name
//$pdf->writeHTMLCell($w=140, $h=0, $x=31, $y=44.5, $data['data']['address'].(($data['data']['suburb']!='')?', ':'').$data['data']['suburb'].(($data['data']['postcode']!='')?', ':'').$data['data']['postcode'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // address
//$pdf->writeHTMLCell($w=80, $h=0, $x=35, $y=48, $data['data']['wfone'].(($data['data']['hfone']!='')?'-':'').$data['data']['hfone'].(($data['data']['mfone']!='')?'-':'').$data['data']['mfone'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // fone
//$pdf->writeHTMLCell($w=40, $h=0, $x=99, $y=48, $data['data']['dob'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // dob
//$pdf->writeHTMLCell($w=40, $h=0, $x=149, $y=48, ((array_key_exists('occupation',$data['data']))?$data['data']['occupation']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // occupation
//$pdf->Image($checkMark, 17, 52, 2.5, 2.5, '', '', '', false, 300, '', false, false, 0);
//$pdf->writeHTMLCell($w=170, $h=8, $x=17, $y=64, $data['employer']['name'].' - '.$data['employer']['address'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // employer's detail
//$pdf->writeHTMLCell($w=40, $h=0, $x=37, $y=104, $data['data']['adate'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // date
//$pdf->writeHTMLCell($w=40, $h=0, $x=81, $y=108, $data['data']['alocation'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // location
//$injDesc = ((array_key_exists('injdesc-1',$data['data']))?(('on'==$data['data']['injdesc-1'])?'Sprain/Strain':''):"").
//		   ((array_key_exists('injdesc-2',$data['data']))?(('on'==$data['data']['injdesc-2'])?'Laceration, ':''):"").
//		   ((array_key_exists('injdesc-3',$data['data']))?(('on'==$data['data']['injdesc-3'])?'Crush, ':''):"").
//		   ((array_key_exists('injdesc-4',$data['data']))?(('on'==$data['data']['injdesc-4'])?'Fall. ':''):"").
//		   ((array_key_exists('injdesctxt',$data['data']))?$data['data']['injdesctxt']:"");
//// area of effect
//
//$redLine = array('color' => array(255, 0, 0));
//if (array_key_exists('bdypart-1',$data['data']))    // Left lower leg
//	if ('on'==$data['data']['bdypart-1']){
//		$pdf->Ellipse( 167.5, 130,2,4,0,0,360,'',$redLine,array(),2);
//		$pdf->Ellipse( 185.5, 130,2,4,0,0,360,'',$redLine,array(),2);
//	}
//if (array_key_exists('bdypart-2',$data['data']))    // Right lower leg
//	if ('on'==$data['data']['bdypart-2']){
//		$pdf->Ellipse( 163.5, 130,2,4,0,0,360,'',$redLine,array(),2);
//		$pdf->Ellipse( 188.5, 130,2,4,0,0,360,'',$redLine,array(),2);
//	}
//if (array_key_exists('bdypart-3',$data['data']))    // Left upper leg
//	if ('on'==$data['data']['bdypart-3']){
//		$pdf->Ellipse( 168, 119,2,4,0,0,360,'',$redLine,array(),2);
//		$pdf->Ellipse( 185, 119,2,4,0,0,360,'',$redLine,array(),2);
//	}
//if (array_key_exists('bdypart-4',$data['data']))    // Right upper leg
//	if ('on'==$data['data']['bdypart-4']){
//		$pdf->Ellipse( 164, 119,2,4,0,0,360,'',$redLine,array(),2);
//		$pdf->Ellipse( 190, 119,2,4,0,0,360,'',$redLine,array(),2);
//	}
//if (array_key_exists('bdypart-5',$data['data']))    // Left lower arm
//	if ('on'==$data['data']['bdypart-5']){
//		$pdf->Ellipse( 172.5, 110,2,4,40,0,360,'',$redLine,array(),2);
//		$pdf->Ellipse( 181, 110,2,4,-40,0,360,'',$redLine,array(),2)	;
//	}
//if (array_key_exists('bdypart-6',$data['data']))    // Right lower arm
//	if ('on'==$data['data']['bdypart-6']){
//		$pdf->Ellipse( 159.5, 110,2,4,-40,0,360,'',$redLine,array(),2);
//		$pdf->Ellipse( 194, 110,2,4,40,0,360,'',$redLine,array(),2);
//	}
//if (array_key_exists('bdypart-7',$data['data']))    // Left upper arm
//	if ('on'==$data['data']['bdypart-7']){
//		$pdf->Ellipse( 171, 104,2,4,0,0,360,'',$redLine,array(),2);
//		$pdf->Ellipse( 182.5, 104,2,4,0,0,360,'',$redLine,array(),2);
//	}
//if (array_key_exists('bdypart-8',$data['data']))    // Right upper arm
//	if ('on'==$data['data']['bdypart-8']){
//		$pdf->Ellipse( 161, 104,2,4,0,0,360,'',$redLine,array(),2);
//		$pdf->Ellipse( 192.5, 104,2,4,0,0,360,'',$redLine,array(),2);
//	}
//if (array_key_exists('bdypart-9',$data['data']))    // Left hand
//	if ('on'==$data['data']['bdypart-9']){
//		$pdf->Ellipse( 174, 117,3,3,0,0,360,'',$redLine,array(),2);
//		$pdf->Ellipse( 179, 117,3,3,0,0,360,'',$redLine,array(),2);
//	}
//if (array_key_exists('bdypart-10',$data['data']))    // Right hand
//	if ('on'==$data['data']['bdypart-10']){
//		$pdf->Ellipse( 157, 117,3,3,0,0,360,'',$redLine,array(),2);
//		$pdf->Ellipse( 196, 117,3,3,0,0,360,'',$redLine,array(),2);
//	}
//if (array_key_exists('bdypart-11',$data['data']))    // Left shoulder
//	if ('on'==$data['data']['bdypart-11']){
//		$pdf->Ellipse( 172, 99.5,3,3,0,0,360,'',$redLine,array(),2);
//		$pdf->Ellipse( 183, 99.5,3,3,0,0,360,'',$redLine,array(),2);
//	}
//if (array_key_exists('bdypart-12',$data['data']))    // Right shoulder
//	if ('on'==$data['data']['bdypart-12']){
//		$pdf->Ellipse( 161, 99.5,3,3,0,0,360,'',$redLine,array(),2);
//		$pdf->Ellipse( 192, 99.5,3,3,0,0,360,'',$redLine,array(),2);
//	}
//if (array_key_exists('bdypart-13',$data['data']))    // Abdomen
//	if ('on'==$data['data']['bdypart-13']){
//		$pdf->Ellipse( 166, 108,3,3,0,0,360,'',$redLine,array(),2);
//	}
//if (array_key_exists('bdypart-14',$data['data']))    // Chest
//	if ('on'==$data['data']['bdypart-14']){
//		$pdf->Ellipse( 166, 102,5,3,0,0,360,'',$redLine,array(),2);
//	}
//if (array_key_exists('bdypart-15',$data['data']))    // Lower back
//	if ('on'==$data['data']['bdypart-15']){
//		$pdf->Ellipse( 187, 105,3,3,0,0,360,'',$redLine,array(),2);
//	}
//
//$pdf->writeHTMLCell($w=80, $h=8, $x=63, $y=112, $injDesc, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // desc
//$pdf->writeHTMLCell($w=140, $h=8, $x=17, $y=122, $data['data']['reason'], $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // reason
//$pdf->writeHTMLCell($w=140, $h=8, $x=17, $y=137, array_key_exists('massessment',$data['data'])?$data['data']['massessment']:"", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true); // assessment
//if (array_key_exists('does',$data['data'])&&(1==$data['data']['does']))
//	$pdf->Image($checkMark, 64.5, 147, 4, 4, '', '', '', false, 300, '', false, false, 0);
//else
//	$pdf->Image($checkMark, 92, 147, 4, 4, '', '', '', false, 300, '', false, false, 0);
////injury management
//if (array_key_exists('assessment-1',$data['data']))
//	if ('on'==$data['data']['assessment-1'])
//		$pdf->Image($checkMark, 17, 169, 3, 3, '', '', '', false, 300, '', false, false, 0); //Fit to return to pre-injury duties
//if (array_key_exists('assessment-2',$data['data']))
//	if ('on'==$data['data']['assessment-2'])
//		$pdf->Image($checkMark, 17, 172, 3, 3, '', '', '', false, 300, '', false, false, 0);
//if (array_key_exists('assessment-3',$data['data']))
//	if ('on'==$data['data']['assessment-3'])
//		$pdf->Image($checkMark, 17, 175.5, 3, 3, '', '', '', false, 300, '', false, false, 0);
//$pdf->writeHTMLCell($w=40, $h=0, $x=68, $y=175.5, ((array_key_exists('dateFrom',$data['data']))?$data['data']['dateFrom']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//$pdf->writeHTMLCell($w=40, $h=0, $x=87, $y=175.5, ((array_key_exists('dateTo',$data['data']))?$data['data']['dateTo']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//if (array_key_exists('assessment-4',$data['data']))
//	if ('on'==$data['data']['assessment-4'])
//		$pdf->Image($checkMark, 24, 179, 3, 3, '', '', '', false, 300, '', false, false, 0); //restricted hours
//$pdf->writeHTMLCell($w=40, $h=0, $x=69, $y=179, ((array_key_exists('restrictedHours',$data['data']))?$data['data']['restrictedHours']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//if (array_key_exists('assessment-5',$data['data']))
//	if ('on'==$data['data']['assessment-5'])
//		$pdf->Image($checkMark, 24, 182.5, 3, 3, '', '', '', false, 300, '', false, false, 0);
//$pdf->writeHTMLCell($w=40, $h=0, $x=69, $y=183, ((array_key_exists('restrictedDays',$data['data']))?$data['data']['restrictedDays']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//if (array_key_exists('assessment-6',$data['data']))
//	if ('on'==$data['data']['assessment-6'])
//		$pdf->Image($checkMark, 24, 186, 3, 3, '', '', '', false, 300, '', false, false, 0);
//if (array_key_exists('assessment-7',$data['data']))
//	if ('on'==$data['data']['assessment-7'])
//		$pdf->Image($checkMark, 17, 189.5, 3, 3, '', '', '', false, 300, '', false, false, 0); //Work restrictions
//if (array_key_exists('assessment-8',$data['data']))
//	if ('on'==$data['data']['assessment-8'])
//		$pdf->Image($checkMark, 24, 193, 3, 3, '', '', '', false, 300, '', false, false, 0); //
//$pdf->writeHTMLCell($w=40, $h=0, $x=73, $y=192.5, ((array_key_exists('weight',$data['data']))?$data['data']['weight']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//$pdf->writeHTMLCell($w=90, $h=0, $x=117, $y=192.5, ((array_key_exists('otherRes',$data['data']))?$data['data']['otherRes']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//if (array_key_exists('assessment-9',$data['data']))
//	if ('on'==$data['data']['assessment-9'])
//		$pdf->Image($checkMark, 24, 196.5, 3, 3, '', '', '', false, 300, '', false, false, 0);
//if (array_key_exists('assessment-10',$data['data']))
//	if ('on'==$data['data']['assessment-10'])
//		$pdf->Image($checkMark, 24, 200, 3, 3, '', '', '', false, 300, '', false, false, 0);
//if (array_key_exists('assessment-11',$data['data']))
//	if ('on'==$data['data']['assessment-11'])
//		$pdf->Image($checkMark, 129, 196.5, 3, 3, '', '', '', false, 300, '', false, false, 0);// Avoid repetitive use
//if (array_key_exists('assessment-12',$data['data']))
//	if ('on'==$data['data']['assessment-12'])
//		$pdf->Image($checkMark, 129, 200, 3, 3, '', '', '', false, 300, '', false, false, 0);
//if (array_key_exists('assessment-21',$data['data']))
//	if ('on'==$data['data']['assessment-21'])
//		$pdf->Image($checkMark, 146, 168, 3, 3, '', '', '', false, 300, '', false, false, 0);  // First and final certificate
//if (array_key_exists('assessment-13',$data['data']))
//	if ('on'==$data['data']['assessment-13'])
//		$pdf->Image($checkMark, 17, 204.5, 3, 3, '', '', '', false, 300, '', false, false, 0); // unfit
//$pdf->writeHTMLCell($w=15, $h=0, $x=59, $y=204, ((array_key_exists('unfitDays',$data['data']))?$data['data']['unfitDays']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//$pdf->writeHTMLCell($w=20, $h=0, $x=81, $y=204, ((array_key_exists('unfitFrom',$data['data']))?$data['data']['unfitFrom']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//$pdf->writeHTMLCell($w=20, $h=0, $x=99, $y=204, ((array_key_exists('unfitTo',$data['data']))?$data['data']['unfitTo']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//if (array_key_exists('assessment-14',$data['data']))
//	if ('on'==$data['data']['assessment-14'])
//		$pdf->Image($checkMark, 17, 213, 3, 3, '', '', '', false, 300, '', false, false, 0);
//if (array_key_exists('assessment-15',$data['data']))
//	if ('on'==$data['data']['assessment-15'])
//		$pdf->Image($checkMark, 17, 216.5, 3, 3, '', '', '', false, 300, '', false, false, 0);
//if (array_key_exists('assessment-17',$data['data']))
//	if ('on'==$data['data']['assessment-17'])
//		$pdf->Image($checkMark, 17, 220, 3, 3, '', '', '', false, 300, '', false, false, 0);
//if (array_key_exists('assessment-16',$data['data']))
//	if ('on'==$data['data']['assessment-16'])
//		$pdf->Image($checkMark, 176, 217, 3, 3, '', '', '', false, 300, '', false, false, 0);
//
//$pdf->setCellHeightRatio(0.8);
//$pdf->SetFontSize(7, true);
//$pdf->writeHTMLCell($w=160, $h=0, $x=37, $y=213, ((array_key_exists('medicationtxt',$data['data']))?$data['data']['medicationtxt']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//$pdf->writeHTMLCell($w=20, $h=0, $x=153, $y=216.5, ((array_key_exists('treatmenttxt',$data['data']))?$data['data']['treatmenttxt']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//$pdf->setCellHeightRatio(1.25);
//$pdf->SetFontSize(8, true);
//$pdf->writeHTMLCell($w=40, $h=0, $x=192, $y=216.5, ((array_key_exists('imagingtxt',$data['data']))?$data['data']['imagingtxt']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//$pdf->writeHTMLCell($w=100, $h=0, $x=73, $y=220, ((array_key_exists('refertxt',$data['data']))?$data['data']['refertxt']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//$pdf->writeHTMLCell($w=140, $h=0, $x=43, $y=224, ((array_key_exists('treatmentother',$data['data']))?$data['data']['treatmentother']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//$pdf->writeHTMLCell($w=40, $h=0, $x=89, $y=228, ((array_key_exists('datenext',$data['data']))?$data['data']['datenext']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//$pdf->writeHTMLCell($w=40, $h=0, $x=114, $y=228, ((array_key_exists('timenext',$data['data']))?$data['data']['timenext']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//if (array_key_exists('assessment-18',$data['data']))
//	if ('on'==$data['data']['assessment-18'])
//		$pdf->Image($checkMark, 17, 247.5, 3, 3, '', '', '', false, 300, '', false, false, 0);
//if (array_key_exists('assessment-19',$data['data']))
//	if ('on'==$data['data']['assessment-19'])
//		$pdf->Image($checkMark, 17, 251, 3, 3, '', '', '', false, 300, '', false, false, 0);
//if (array_key_exists('assessment-20',$data['data']))
//	if ('on'==$data['data']['assessment-20'])
//		$pdf->Image($checkMark, 17, 258, 3, 3, '', '', '', false, 300, '', false, false, 0);
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
//	//echo substr($data['data']['drsigntxt'],22);
//	$pdf->Image("output/temp.png", 136, 275, 20, 20*$height/$width, '', '', '', false, 300, '', false, false, 0);
//	//$pdf->Image("output/temp.png", 10, 10, 50, 20, '', '', '', false, 300, '', false, false, 0);
//	//$pdf->Image('@'.$imgdata);
//}
//if (array_key_exists('signtxt',$data['data'])&& (''!=$data['data']['signtxt'])){
//	//$imgdata = base64_decode(substr($data['data']['drsigntxt'],22));
//	//$imgdata = str_replace(' ','+',$imgdata);
//	$imgdata = $data['data']['signtxt'];
//	$imgdata = str_replace(' ','+',$imgdata);
//
//	preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $imgdata);
//
//	copy("data:image/png;base64,".$imgdata,"output/temp2.png");
//
//	//file_put_contents("output/temp.png", $imgdata);
//	//fclose($image);
//	list($width, $height, $type, $attr)= getimagesize("output/temp2.png");
//	//echo substr($data['data']['drsigntxt'],22);
//	$pdf->Image("output/temp2.png", 45, 83, 8, 8*$height/$width, '', '', '', false, 300, '', false, false, 0);
//	//$pdf->Image("output/temp.png", 10, 10, 50, 20, '', '', '', false, 300, '', false, false, 0);
//	//$pdf->Image('@'.$imgdata);
//}
//$pdf->writeHTMLCell($w=40, $h=0, $x=126, $y=85, ((array_key_exists('createdTime',$data['entry']))? date("m/d/Y", strtotime($data['entry']['createdTime'])):""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//
////$pdf->writeHTMLCell($w=40, $h=0, $x=66, $y=56, ((array_key_exists('examdate',$data['data']))?$data['data']['examdate']:"").'  '.((array_key_exists('examtime',$data['data']))?$data['data']['examtime']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//
//// redimed's detail
//$pdf->writeHTMLCell($w=70, $h=0, $x=33, $y=267.5, ((array_key_exists('dname',$data['data']))?$data['data']['dname']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//$pdf->writeHTMLCell($w=70, $h=0, $x=143, $y=267.5, ((array_key_exists('dcode',$data['data']))?$data['data']['dcode']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//$pdf->writeHTMLCell($w=70, $h=0, $x=33, $y=270.7, ((array_key_exists('daddress',$data['data']))?$data['data']['daddress']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//$pdf->writeHTMLCell($w=70, $h=0, $x=33, $y=274.5, "(08) 9230 0900", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//$pdf->writeHTMLCell($w=40, $h=0, $x=57, $y=278, ((array_key_exists('examdate',$data['data']))?$data['data']['examdate']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//$pdf->writeHTMLCell($w=40, $h=0, $x=73, $y=278, ((array_key_exists('examtime',$data['data']))?$data['data']['examtime']:""), $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
//
//$pdf->writeHTMLCell($w=70, $h=0, $x=125, $y=274.5, "(08)9230 0999", $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
?>