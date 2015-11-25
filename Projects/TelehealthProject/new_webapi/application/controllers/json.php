<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require_once('inc/tcpdf/config/lang/eng.php');
require_once('inc/tcpdf/tcpdf.php');
require_once('inc/fpdf/fpdi.php');

class Json extends CI_Controller {

	public function __construct()
    {
        parent::__construct();
        session_start();
		
		/*if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 900)) {
			
			$token = $this->security->get_csrf_hash();
			var_dump(time()-$_SESSION['LAST_ACTIVITY']);
		
			
			$_SESSION['sessionid'] = $token;
		}
		$_SESSION['LAST_ACTIVITY'] = time(); // update last activity time stamp*/
    }
	public function writeScript($data,$script,$pbs,$rpbs,$other, $email){
		$pdf = new PDF();
		ini_set('memory_limit', '-1');
		set_time_limit(0);
		ini_set('max_execution_time', '500');
		
		$pagecount = $pdf->setSourceFile('inc/templates/script.pdf');
		//echo $pagecount;
		for ($i = 1; $i <= $pagecount; $i++) {
			//echo $i;
			$tplidx = $pdf->ImportPage($i);
			$s = $pdf->getTemplatesize($tplidx);
			$pdf->AddPage();
			$pdf->useTemplate($tplidx);
		}
		
		$this->load->model('member_model');
		include_once("inc/script.php");
		
		//clean the output buffer
		if (count(ob_list_handlers()) > 0) {
 			ob_clean();
		}
		
		
		@unlink('output/script.pdf');
		//Close and output PDF document
		$pdf->Output('output/script.pdf', 'F');
		$result=$this->SendAttachedEmail('output/script.pdf', $email);
	}
	public function index()
	{
		show_404('page');
	}
	public function entries(){
		if (!($this->uri->segment(3))){
			echo 0;
		}else{

			// VUONG
			/*$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

			var_dump($_SESSION);
			
			if((isset($token) && $token !== $_SESSION["sessionid"])){
				show_404();
			}*/
			// END VUONG

			$this->load->model("entry_model");

			// dictionary for listview
			$entries = $this->entry_model->getAllEmployee($this->uri->segment(3));
			$names = array();
			foreach ($entries as $entry){
				$entry_data = json_decode($entry['detail'], true);
				$itype = 0;
				if(isset($entry_data['entry']))
					$itype = $entry_data['entry']['itype'];
				else{
					$itype = $entry_data['itype'];
				}
				$names[] = array('id' => $entry['id'],'status' => $entry['status'], 'createdTime'=>date("M j Y ", strtotime($entry['createdTime'])),'itype'=>$itype); 
			}
			
			//print_r($names);
			echo json_encode($names);
		}
	}
	public function updateNotification(){
		// VUONG
		$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}
		// END VUONG

		$this->load->model('notification_model');
		$this->notification_model->updateStatus($this->uri->segment(3),$this->uri->segment(4));
		
		echo $this->notification_model->getAllActive(); 
	}
	public function notifications(){
		// VUONG
		$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}
		// END VUONG

		$this->load->model('notification_model');
		// dictionary for listview
		$entries = $this->notification_model->getAll(); 
		
		//print_r($names);
		echo json_encode($entries);
	}
	public function activeNotifications(){
		// VUONG
		$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}
		// END VUONG

		$this->load->model('notification_model');
		// dictionary for listview
		 echo $this->notification_model->getAllActive(); 
	}
	public function entry(){
		if (!($this->uri->segment(3))){
			echo 0;
		}else{
			// VUONG
			/*$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

			if((isset($token) && $token !== $_SESSION["sessionid"])){
				show_404();
			}*/
			// END VUONG

			$this->load->model('entry_model');
			// dictionary for listview
			$entry = $this->entry_model->get($this->uri->segment(3)); 
			if (count($entry)>0){
				$entry_data = json_decode($entry[0]['detail'], true);
				$entry[0]['detail']=$entry_data;
				//print_r($names);
				echo json_encode($entry[0]);
			}else{
				echo 0;
			}
			
			
		}
	}
	/* notification section */
	public function setDefault(){
		if (!($this->uri->segment(3))){
			echo 0;
		}else{

			// VUONG
			/*$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

			if((isset($token) && $token !== $_SESSION["sessionid"])){
				show_404();
			}*/
			// END VUONG

			$this->load->model('employer_model', '', true);
			$this->load->model('member_model', '', true);
			//$user = $this->member_model->get($this->uri->segment(3)); 
			$redimed = $this->employer_model->get(99999); 
			$sms = json_decode($redimed[0]['sms'],true);
			$sms[$this->uri->segment(3)] = 1;
			if ($this->employer_model->add2SMS(json_encode($sms))){
					//echo trim($user[0]['detail']['phone']);
				echo 1;
			}else{
				echo 'failed adding';
			}
		}
	}
	public function removeDefault(){
		if (!($this->uri->segment(3))){
			echo 0;
		}else{
			// VUONG
			/*$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

			if((isset($token) && $token !== $_SESSION["sessionid"])){
				show_404();
			}*/
			// END VUONG

			$this->load->model('employer_model', '', true);
			$this->load->model('member_model', '', true);
			//$user = $this->member_model->get($this->uri->segment(3)); 
			$redimed = $this->employer_model->get(99999); 
			$sms = json_decode($redimed[0]['sms'],true);
			$sms[$this->uri->segment(3)] = 0;
			if ($this->employer_model->add2SMS(json_encode($sms))){
					//echo trim($user[0]['detail']['phone']);
				echo 1;
			}else{
				echo 'failed adding';
			}
		}
	}
	public function members(){
		if (!($this->uri->segment(3))){
			echo 0;
		}else{
			// VUONG
			/*$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

			if((isset($token) && $token !== $_SESSION["sessionid"])){
				show_404();
			}*/
			// END VUONG

			$this->load->model('member_model');
			$this->load->model('employer_model', '', true); 
			$redimed = $this->employer_model->get(99999); 
			$user = $this->member_model->getAllRedimed(); 
			//echo $redimed[0]['sms'];
			$sms = json_decode($redimed[0]['sms'],true);
			if (count($user)>0){
				foreach ($user as $key=>$entry){
					$json = $entry['detail'];
					
					preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $json);
					
					$user[$key]['detail'] = json_decode($json,true);
					if (array_key_exists('drsign',$user[$key]['detail']))
						$user[$key]['detail']['drsign'] = "";
					//$pos = strpos($redimed[0]['sms'],'##!!##'.trim(str_replace(' ', "",$user[$key]['id'])).'!!!');
					//(array_key_exists('gillness-1',$data))?(('on'==$data['gillness-1'])
					
					$user[$key]['detail']['default'] = (array_key_exists($user[$key]['id'],$sms))?$sms[$user[$key]['id']]:0;
					
					//echo $pos.'-##!!##'.trim(str_replace(' ', "",$user[$key]['id'])).'!!!';
				}
				$data['data'] = $user;
			}else
				$data['data'] = array();
			//echo json_encode($temp);
			echo json_encode($data['data']);
		}
	}
	public function member(){
		if (!($this->uri->segment(3))){
			echo 0;
		}else{
			// VUONG
			/*$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

			if((isset($token) && $token !== $_SESSION["sessionid"])){
				show_404();
			}*/
			// END VUONG

			$this->load->model('member_model');
			// dictionary for listview
			$entry = $this->member_model->get($this->uri->segment(3)); 
			if (count($entry)>0){
				$json = $entry[0]['detail'];
					
				preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $json);
				
				//echo urldecode($json).'<br>';
				$entry[0]['detail'] = json_decode($json,true);
				//print_r($entry);
				echo json_encode($entry[0]);
			}else{
				echo 0;
			}
			
			
		}
	}
	public function memberComp(){
		if (!($this->uri->segment(3))){
			echo 0;
		}else{
			// VUONG
			/*$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

			if((isset($token) && $token !== $_SESSION["sessionid"])){
				show_404();
			}*/
			// END VUONG

			$this->load->model('member_model');
			// dictionary for listview
			$entry = $this->member_model->getCompIdSimple($this->uri->segment(3)); 
			if (count($entry)>0){
				echo json_encode($entry[0]);
			}else{
				echo 0;
			}
			
			
		}
	}
	public function employees(){
		if (!($this->uri->segment(3))){
			echo 0;
		}else{
			// VUONG
			/*$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

			if((isset($token) && $token !== $_SESSION["sessionid"])){
				show_404();
			}*/
			// END VUONG

			$this->load->model('employee_model');
			$this->load->model('entry_model');
			// dictionary for listview
			if (99999==$this->uri->segment(3))
				$employees = $this->employee_model->getAll(); 
			else
				$employees = $this->employee_model->getAllComp($this->uri->segment(3)); 
			foreach ($employees as $key=>$entry){
				$entries = $this->entry_model->getAllEmployeeSimple($entry['id']); 
				$old = true;
				foreach ($entries as $row){
					if ($row['status']=="1")
						$old = false;
				}
				$employees[$key]['status'] = ($old)?2:1;
				
			}
			echo json_encode($employees);
		}
	}
	public function employee(){
		if (!($this->uri->segment(3))){
			echo 0;
		}else{
			// VUONG
			/*$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

			if((isset($token) && $token !== $_SESSION["sessionid"])){
				show_404();
			}*/
			// END VUONG

			$this->load->model('employee_model');
			// dictionary for listview
			$entry = $this->employee_model->get($this->uri->segment(3)); 
			if (count($entry)>0){
				echo json_encode($entry[0]);
			}else{
				echo 0;
			}
			
			
		}
	}
	public function employers(){
			// VUONG
			/*$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

			if((isset($token) && $token !== $_SESSION["sessionid"])){
				show_404();
			}*/
			// END VUONG

			$this->load->model('employer_model');
			// dictionary for listview
			$entries = $this->employer_model->getAllButRedimed(); 

			echo json_encode($entries);
	}
	public function employer(){
		if (!($this->uri->segment(3))){
			echo 0;
		}else{
			// VUONG
			/*$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

			if((isset($token) && $token !== $_SESSION["sessionid"])){
				show_404();
			}*/
			// END VUONG

			$this->load->model('employer_model');
			// dictionary for listview
			$entry = $this->employer_model->get($this->uri->segment(3)); //'detailEmployer'
			if (count($entry)>0){
				echo json_encode($entry[0]);
			}else{
				echo 0;
			}
			
			
		}
	}
	public function requestProgress(){
		// VUONG
		/*$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}*/
		// END VUONG

		//print_r($_REQUEST);
		$this->load->model('entry_model');
		$entry_data = array();$employer = array();
                //*** IGL FIX *** : Fix PHP Error Message: Call-time pass-by-reference has been deprecated
	        //echo $this->entry_model->addMoreDetail($_REQUEST['id'],$_REQUEST['data'],&$entry_data,&$employer);
		echo $this->entry_model->addMoreDetail($_REQUEST['id'],$_REQUEST['data'],$entry_data,$employer); 
		$patient = "New request for progress assessment ".$entry_data['gname']." ".$entry_data['fname'];
		$contentnotification = 'New request for progress assessment;'.
							'Name:'.$entry_data['gname']." ".$entry_data['fname'].'; '
							.'DOB: '.$entry_data['dob'].';'
							.'Location: '.((array_key_exists('sname',$employer))?$employer['sname']:"").' - '.((array_key_exists('address',$employer))?$employer['address']:"").'; '
							.'Time: '.date("g:i a").';'
							.'Email: '.((array_key_exists('email',$employer))?$employer['email']:"");
		$this->sendNotification("telehealth@redimed.com.au", $patient, $contentnotification);
		$hour = date("H");
		$dayinweek = date("w");
		
                //*** IGL FIX *** : Temporary disable time check for Sandbox configuration
//		if ((($hour >= 8) && ($hour < 17))&&(($dayinweek>=1) && ($dayinweek<=5))){ 
//			//echo "Its between the time given";
//		}else{
			
			
			$this->load->model('employer_model', '', true);
			$this->load->model('member_model', '', true); 
			$redimed = $this->employer_model->get(99999);
			$ids =  explode("##!!##",$redimed[0]['sms']);
			$sms = json_decode($redimed[0]['sms'],true);
			
			foreach ($sms as $did=>$value){
				$doctor = $this->member_model->get($did);
                                //*** IGL FIX *** : Disable checking deviceId to be sure an email is sent anyway
                                //if ((1==$value)&&(""!=$doctor[0]['deviceId'])){
                                if (1==$value){
                                        //*** IGL FIX *** : Temporary disable email sending
					//$this->sendNotification($doctor[0]['email'], $patient, $content);
					//$this->pushNotification($doctor[0]['deviceId'], $contentnotification);
				}
			}
		//}
	}
	public function test(){
		// VUONG
		/*$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}*/
		// END VUONG

		$this->load->model('employer_model', '', true);
		$this->load->model('member_model', '', true); 
		$redimed = $this->employer_model->get(99999);
		$ids =  explode("##!!##",$redimed[0]['sms']);
		$sms = json_decode($redimed[0]['sms'],true);
		
		foreach ($sms as $did=>$value){
			$doctor = $this->member_model->get($did);
			if (1==$value){
				
				//$this->sendNotification($doctor[0]['email'], $patient, $content);
				echo $this->pushNotification($doctor[0]['deviceId'], "test notification");
				echo $doctor[0]['deviceId'].'<br>';
			}
		}
	}
        // IGL Test Device
        public function test2(){
        	// VUONG
			$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

			if((isset($token) && $token !== $_SESSION["sessionid"])){
				show_404();
			}
			// END VUONG

            $deviceToken = 'f2a8e1b66504ba9680247ff80539645ac362cf5315336e2fb725b9351150ebfb';
            //echo $this->pushNotification($deviceToken, "test notification");
            echo $deviceToken.'<br>';
	}
	public function updatePass(){
		// VUONG
		/*$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}*/
		// END VUONG

		if (!isset($_REQUEST['id'])){
			echo 0;
		}else{
			$this->load->model('member_model');
			echo $this->member_model->changePwdId($_REQUEST['id'],$_REQUEST['newpass']);
		}
	}
	public function updateDoctor(){
		// VUONG
		/*$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}*/
		// END VUONG

		//print_r($_REQUEST);	
		$temp = str_replace('\"','"',$_REQUEST['data']);
		$temp = str_replace("\'",'\u0027',$temp);
		//echo $temp;
		$temparray = json_decode($temp,true);
		//print_r($temparray);
		$data = array(
		   'name' 		=> 	$temparray['name'],
		   'code' 		=> 	$temparray['code'],
		   'email' 		=> 	$temparray['email'],
		   'phone' 		=> 	$temparray['phone'],
		   'address' 	=> 	$temparray['address'],
		);
		
		$datamem = array(
		   'username' 		=> 	$temparray['username'],
		   'companyId' 		=> 	$temparray['companyId'],
		   'detail' 		=> 	$temp,
		   'email' 		=> 	$temparray['email'],
		   'type' 		=> 	$temparray['type'],
		);
		
		$this->load->model('employer_model');
		$this->load->model('member_model');
		//echo $temparray['username'];
		echo ($this->member_model->update($temparray['memId'],$datamem));	
	}
	public function addDoctor(){
		// VUONG
		/*$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}*/
		// END VUONG

		//print_r($_REQUEST);	
		$temp = str_replace('\"','"',$_REQUEST['data']);
		$temp = str_replace("\'",'\u0027',$temp);
		//echo $temp;
		$temparray = json_decode($temp,true);
		
		$datamem = array(
		   'username' 		=> 	$temparray['username'],
		   'companyId' 		=> 	$temparray['companyId'],
		   'detail' 		=> 	$temp,
		   'email' 		=> 	$temparray['email'],
		   'deviceId' 		=> 	'',
		   'password' 		=> 	$temparray['password'],
		   'type' 		=> 	$temparray['type'],
		);
		
		$this->load->model('member_model');
		echo ($this->member_model->insert($datamem));	
	}
	public function updateEmployer(){
		// VUONG
		/*$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}*/
		// END VUONG

		//print_r($_REQUEST);	
		$temp = str_replace('\"','"',$_REQUEST['data']);
		$temp = str_replace("\'",'\u0027',$temp);
		//echo $temp;
		$temparray = json_decode($temp);
		
		//print_r($temparray);
		$data = array(
		   'name' 		=> 	$temparray->name,
		   'code' 		=> 	$temparray->code,
		   'IMA' 		=> 	$temparray->IMA,
		   'insurer' 	=> 	$temparray->insurer,
		   'email' 		=> 	$temparray->email,
		   'phone' 		=> 	$temparray->phone,
		   'address' 	=> 	$temparray->address,
		   'smedic' 	=> 	$temparray->smedic,
		   'sname' 	=> 	$temparray->sname,
		   'smphone' 	=> 	$temparray->smphone,
		   'lastip' 	=> 	$_SERVER['REMOTE_ADDR'],
		   'detailEmployer' => $temp,
            /*Add */
			/*
            'radio_NA' => $temparray->radio_NA,
            'radio_air' => $temparray->radio_air,
            'radio_ambulance' =>$temparray->radio_ambulance,
            'radio_no' => $temparray->radio_no,
            'radio_others' => $temparray->radio_others,
            'radio_rail' => $temparray->radio_rail,
            'radio_road' => $temparray->radio_road,
            'radio_surface' => $temparray->radio_surface,
            'radio_underground' => $temparray->radio_underground,
            'radio_yes' => $temparray->radio_yes,
            'textfield_ContactNumber1' => $temparray->textfield_ContactNumber1,
            'textfield_ContactNumber2' => $temparray->textfield_ContactNumber2,
            'textfield_ContactNumber3' => $temparray->textfield_ContactNumber3,
            'textfield_ContactNumber4' => $temparray->textfield_ContactNumber4,
            'textfield_ContactNumber5' => $temparray->textfield_ContactNumber5,
            'textfield_ContactNumber6' => $temparray->textfield_ContactNumber6,
            'textfield_Medic1' => $temparray->textfield_Medic1,
            'textfield_Medic2' => $temparray->textfield_Medic2,
            'textfield_Medic3' => $temparray->textfield_Medic3,
            'textfield_Medic4' => $temparray->textfield_Medic4,
            'textfield_Medic5' => $temparray->textfield_Medic5,
            'textfield_Medic6' => $temparray->textfield_Medic6,
            'textfield_closest_medical_centre' => $temparray->textfield_closest_medical_centre,
            'textfield_frequency_of_commerical' => $temparray->textfield_frequency_of_commerical,
            'textfield_have_a_physical' => $temparray->textfield_have_a_physical,
            'textfield_light_duty_options' => $temparray->textfield_light_duty_options,
            'textfield_medical_centre' => $temparray->textfield_medical_centre,
            'textfield_mode_of_transfer' => $temparray->textfield_mode_of_transfer,
            'textview_further_informations' => $temparray->textview_further_informations, */
		);
		
		$datamem = array(
		   'username' 		=> 	$temparray->username,
		   'companyId' 		=> 	$temparray->companyId,
		   'email' 		=> 	$temparray->email,
		   'detail' 		=> 	json_encode($data),
		   'type' 		=> 	0,
		   'detailEmployer' => $temp,
		);
		
		$this->load->model('employer_model');
		$this->load->model('member_model');
		//echo $temparray['username'];
		echo ($this->employer_model->update($temparray->companyId,$data)&&$this->member_model->update($temparray->memId,$datamem));	
	}
	public function addEmployer(){
		// VUONG
		$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}
		// END VUONG

		//print_r($_REQUEST);
		$this->load->model('employer_model');
		$this->load->model('member_model');	
		$temp = str_replace('\"','"',$_REQUEST['data']);
		$temp = str_replace("\'",'\u0027',$temp);
		//echo $temp;
		$temparray = json_decode($temp,true);
		//print_r($temparray);
		$data = array(
		   'name' 		=> 	$temparray['name'],
		   'code' 		=> 	$temparray['code'],
		   'IMA' 		=> 	$temparray['IMA'],
		   'insurer' 	=> 	$temparray['insurer'],
		   'email' 		=> 	$temparray['email'],
		   'phone' 		=> 	$temparray['phone'],
		   'address' 	=> 	$temparray['address'],
		   'smedic' 	=> 	$temparray['smedic'],
		   'sname' 	=> 	$temparray['sname'],
		   'smphone' 	=> 	$temparray['smphone'],
		   'lastip' 	=> 	$_SERVER['REMOTE_ADDR'],
		);
		
		$datamem = array(
		   'username' 		=> 	$temparray['username'],
		   'companyId' 		=> 	$this->employer_model->insert($data),
		   'detail' 		=> 	json_encode($data),
		   'type' 		=> 	0,
		   'email' 		=> 	$temparray['email'],
		   'deviceId' 		=> 	'',
		   'password' 		=> 	((array_key_exists('password',$temparray))?$temparray['password']:""),
		);
		
		//echo $temparray['username'];
		echo ($this->member_model->insert($datamem));	
	}
	public function entryReports(){
		if (!($this->uri->segment(3))){
			show_404('page');
		}else{
			// VUONG
			/*$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

			if((isset($token) && $token !== $_SESSION["sessionid"])){
				show_404();
			}*/
			// END VUONG

			$this->load->model('entry_model');
			// get progress data
			$this->load->model('progress_model');
			$data = array();
			$progress = $this->progress_model->getAllEntries($this->uri->segment(3)); 
			if (count($progress)>0){
				
				foreach ($progress as $entry){
					$temp = array(
								  	'id' => $entry['id'],
									'entryId' => $entry['entryId'],
									'createdTime' => date("M j Y ", strtotime($entry['createdTime'])),
									'updatedTime' => date("M j Y ", strtotime($entry['updatedTime'])),
									'type' => $entry['type'],
								  );	
					$data[] = $temp;
				}
				
			}
			// get final data
			/*$final = $this->progress_model->getWithEntry($this->uri->segment(3),3); 
			if (count($final)>0){
				
				foreach ($final as $entry){
					$temp = array(
								  	'id' => $entry['id'],
									'entryId' => $entry['entryId'],
									'createdTime' => date("M j Y ", strtotime($entry['createdTime'])),
									'updatedTime' => date("M j Y ", strtotime($entry['updatedTime'])),
									'type' => $entry['type'],
								  );	
					$data[] = $temp;
				}
				
			}*/
				
			//print_r($data);
			echo json_encode($data);
		}
	}
	public function entryDetail(){
		if (!($this->uri->segment(3))){
			show_404('page');
		}else{
			//$this->load->model('entry_model');
			//if (($this->entry_model->checkPossess($this->uri->segment(3),$_SESSION['companyId']))){
				//show_404('page');
			//}else{
				// VUONG
				/*$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

				if((isset($token) && $token !== $_SESSION["sessionid"])){
					show_404();
				}*/
				// END VUONG

				$this->load->model('employer_model');
				$company = $this->employer_model->get($this->uri->segment(4)); 
				if (count($company)>0)
					$data['employer'] = $company[0];
				else
					$data['employer'] = array();
					
				$this->load->model('entry_model');
				//get employee's detail
				$entry = $this->entry_model->get($this->uri->segment(3)); 
				if (count($entry)>0)
					$temp = $entry[0];
				else
					$temp = array();
					
				$temp = str_replace('\"','"',$temp['detail']);
				$temp = str_replace("\'",'\u0027',$temp);
				
				$data['data'] = json_decode($temp,true);
				$salutation = array('Mr', 'Mrs', 'Ms', 'Miss', 'Master', 'Dr');
				$data['name'] = $salutation[$data['data']['salut']-1].' '.$data['data']['gname'].' '.$data['data']['fname'];	
				//print_r($data);
				//$this->load->view('header');
				$this->load->view('entryDetail',$data);
			//}
		}	
	}
	public function entryInjureDesc(){
		if (!($this->uri->segment(3))){
			show_404('page');
		}else{
			//$this->load->model('entry_model');
			//if (($this->entry_model->checkPossess($this->uri->segment(3),$_SESSION['companyId']))){
				//show_404('page');
			//}else{
				// VUONG
				/*$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

				if((isset($token) && $token !== $_SESSION["sessionid"])){
					show_404();
				}*/
				// END VUONG

				$this->load->model('employer_model');
				$company = $this->employer_model->get($this->uri->segment(4)); 
				if (count($company)>0)
					$data['employer'] = $company[0];
				else
					$data['employer'] = array();
					
				$this->load->model('entry_model');
				//get employee's detail
				$entry = $this->entry_model->get($this->uri->segment(3)); 
				if (count($entry)>0)
					$temp = $entry[0];
				else
					$temp = array();
					
				$temp2 = str_replace('\"','"',$temp['images']);
				$temp = str_replace('\"','"',$temp['detail']);
				$temp = str_replace("\'",'\u0027',$temp);
				
				$data['data'] = json_decode($temp,true);
				$temp2 = str_replace("\'",'\u0027',$temp2);
				$temp2 = str_replace("+",' ',$temp2);
				
				$data['images'] = json_decode($temp2,true);
				if ($data['images']=='')
					$data['images'] = array();
				$salutation = array('Mr', 'Mrs', 'Ms', 'Miss', 'Master', 'Dr');
				$data['name'] = $salutation[$data['data']['salut']].' '.$data['data']['gname'].' '.$data['data']['fname'];	
				
				$strredflags = '';
				
				if ((array_key_exists('redflags',$data['data']))&&($data['data']['redflags']!=null)){
					foreach ($data['data']['redflags'] as $key=> $value){
						foreach ($value as $str){
							$strredflags .= $str.', ';
						}
					}
				}
				$data['strredflags'] = $strredflags;
				
				$this->load->view('entryInjuryDesc',$data);
			//}
		}	
	}
	public function entryProgressUpdates(){
		if (!($this->uri->segment(3))){
			show_404('page');
		}else{
			//$this->load->model('entry_model');
			//if (($this->entry_model->checkPossess($this->uri->segment(3),$_SESSION['companyId']))){
				//show_404('page');
			//}else{
				// VUONG
				$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

				if((isset($token) && $token !== $_SESSION["sessionid"])){
					show_404();
				}
				// END VUONG


				$this->load->model('entry_model');
				//get employee's detail
				$entry = $this->entry_model->get($this->uri->segment(3)); 
				if (count($entry)>0)
					$temp = $entry[0];
				else
					$temp = array();
					
				$temp = str_replace('\"','"',$temp['detail']);
				$temp = str_replace("\'",'\u0027',$temp);
				
				$data['data'] = json_decode($temp,true);
				
				$this->load->view('entryProgressUpdates',$data);
			//}
		}	
	}
	public function entryReport(){
		if (!($this->uri->segment(3))||!($this->uri->segment(4))){
			show_404('page');
		}else{
			//$this->load->model('entry_model');
			//if (($this->entry_model->checkPossess($this->uri->segment(3),$_SESSION['companyId']))){
				//show_404('page');
			//}else{
				// VUONG
				$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

				if((isset($token) && $token !== $_SESSION["sessionid"])){
					show_404();
				}
				// END VUONG


				$this->load->model('entry_model');
				//get employee's detail
				$entry = $this->entry_model->get($this->uri->segment(3)); 
				if (count($entry)>0)
					$temp = $entry[0];
				else
					$temp = array();
					
				$temp = str_replace('\"','"',$temp['detail']);
				$temp = str_replace("\'",'\u0027',$temp);
				
				$data['data'] = json_decode($temp,true);
				
				if (1==$this->uri->segment(4)){
						
					
					$salutation = array('Mr', 'Mrs', 'Ms', 'Miss', 'Master', 'Dr');
					$data['name'] = $salutation[$data['data']['salut']].' '.$data['data']['gname'].' '.$data['data']['fname'];	
					//print_r($data);
					//$this->load->view('header');
					if (2==$data['data']['itype'])
						$this->load->view('entryfirstcert',$data);
					else
						$this->load->view('entrygeneralillnesscert',$data);	
				}else{
					$this->load->model('progress_model');
					$final = $this->progress_model->get($this->uri->segment(5)); 
					if (count($final)>0){
						foreach($final as $fkey=>$fentry){
							$json = $fentry['detail'];
							preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $json);
							
							//echo urldecode($json).'<br>';
							$final[$fkey]['detail'] = json_decode($json,true);
						}
						$data['pentry'] = $final[0];
					}else
						$data['pentry'] = array();
					if (2==$data['data']['itype'])
						if (2==$this->uri->segment(4))
							$this->load->view('entryprogresscert',$data);
						else
							$this->load->view('entryfinalcert',$data);
					else{
						$data['data'] = $data['pentry']['detail'];
						$this->load->view('entrygeneralillnesscert',$data);	
					}
					
				}
			//}
		}	
	}

	public function tienGetProgressData(){
		// VUONG
		$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}
		// END VUONG

		$params = file_get_contents("php://input");
		$params = json_decode($params);

		$this->load->model('progress_model');
		$data = $this->progress_model->getWithEntry($params->id, $params->type);

		header("Content-Type: application/json");
		echo json_encode($data[0]['detail']);
	}

	public function tienSubmit(){
		// VUONG
		$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}
		// END VUONG

		$params = file_get_contents("php://input");
		$params = json_decode($params);

		if (isset($params->hasProgress)){
			if (1!=$params->hasProgress){
				$temp = $params->progressdata;
				$this->load->model('progress_model');
				$dataprogress = array(
				   'entryId' 	=> 	$params->id,
				   'detail' 		=>  json_encode($temp),
				   'type' 		=>  $params->hasProgress,
				);

				$dataprogress = (array)$dataprogress;
				
				if (2==($params->hasProgress)){
					$this->progress_model->insert($dataprogress); 
				}else{
					$final = $this->progress_model->getWithEntry($params->id,3);
					//echo count($final(;
					if (count($final)>0)
						$this->progress_model->update($final[0]['id'],$dataprogress); 
					else
						$this->progress_model->insert($dataprogress); 
				}
			}else{
				$temp = $params->progressdata;
				$this->load->model("progress_model");
				$dataprogress = array(
					'entryId' => $params->id,
					'detail' => json_encode($temp),
					'type' => $params->hasProgress
				);
				
				$first = $this->progress_model->getWithEntry($params->id, 1);
				
				if(count($first) > 0)
					$this->progress_model->update($first[0]['id'], $dataprogress);
				else
					$this->progress_model->insert($dataprogress);
			}
		}// end if

		$temp = $params->data;
		$this->load->model('entry_model');
		$entry = $this->entry_model->get($params->id); 
		if (count($entry)>0){
			$eid = $entry[0]['employerId'];
			$employeeId = $entry[0]['employeeId'];
		}else{
			$eid = 99999;
			$employeeId = 0;
		}
		$data = array(
		   'employerId' 	=> 	$eid ,
		   'employeeId' 	=> 	$employeeId,
		   'detail' 		=>  json_encode($temp),
		   'status' 		=> 	1,
		   'images' => $entry[0]['images'],
		   'authen' => $entry[0]['authen'],
		);
		
		/*if (('add'!=$params->type)&&('edit'!=$params->type))
			$data['status'] = 2;
			
		if ('add'==$params->type){
			echo $this->entry_model->insert($data);
		}else{
			echo $this->entry_model->update($params->id,$data);
		}*/
	}

	// assessment
	public function submit()
	{
		// VUONG
		$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}
		// END VUONG
		
		//print_r($_REQUEST);
		if (isset($_REQUEST['hasProgress'])){
			if (1!=($_REQUEST['hasProgress'])){
				$temp = str_replace('\"','"',$_REQUEST['progressdata']);
				$temp = str_replace("\'",'\u0027',$temp);
				$this->load->model('progress_model');
				$dataprogress = array(
				   'entryId' 	=> 	$_REQUEST['id'],
				   'detail' 		=>  $temp,
				   'type' 		=>  $_REQUEST['hasProgress'],
				);
				
				if (2==($_REQUEST['hasProgress'])){
					$this->progress_model->insert($dataprogress); 
				}else{
					$final = $this->progress_model->getWithEntry($_REQUEST['id'],3);
					//echo count($final(;
					if (count($final)>0)
						$this->progress_model->update($final[0]['id'],$dataprogress); 
					else
						$this->progress_model->insert($dataprogress); 
				}
			}else{
				$temp = str_replace('\"','"',$_REQUEST['progressdata']);
				$temp = str_replace("\'",'\u0027',$temp);
				$this->load->model("progress_model");
				$dataprogress = array(
					'entryId' => $_REQUEST["id"],
					'detail' => $temp,
					'type' => $_REQUEST["hasProgress"]
				);
				
				$first = $this->progress_model->getWithEntry($_REQUEST['id'], 1);
				
				if(count($first) > 0)
					$this->progress_model->update($first[0]['id'], $dataprogress);
				else
					$this->progress_model->insert($dataprogress);
			}
		}
		
		$temp = str_replace('\"','"',$_REQUEST['data']);
		$temp = str_replace("\'",'\u0027',$temp);
		$this->load->model('entry_model');
		$entry = $this->entry_model->get($_REQUEST['id']); 
		if (count($entry)>0){
			$eid = $entry[0]['employerId'];
			$employeeId = $entry[0]['employeeId'];
		}else{
			$eid = 99999;
			$employeeId = 0;
		}
if (isset($_REQUEST['script'])&&($_REQUEST['script']!='')){
$this->load->model('employer_model', '', true);
	
		$employer= $this->employer_model->get($entry[0]['employerId']); 
		//print_r($employer);
			$temp = str_replace('\"','"',$_REQUEST['data']);
			$temp = str_replace("\'",'\u0027',$temp);
			$this->writeScript($temp, $_REQUEST['script'],$_REQUEST['pbs'],$_REQUEST['rpbs'],$_REQUEST['other'], $employer[0]['email']);
		}
		$data = array(
		   'employerId' 	=> 	$eid ,
		   'employeeId' 	=> 	$employeeId,
		   'detail' 		=>  $temp,
		   'status' 		=> 	1,
		   'images' => $entry[0]['images'],
		   'authen' => $entry[0]['authen'],
		);
		
		if (('add'!=$_REQUEST['type'])&&('edit'!=$_REQUEST['type']))
			$data['status'] = 2;
			
		if ('add'==$_REQUEST['type']){
			echo $this->entry_model->insert($data);
		}else{
			echo $this->entry_model->update($_REQUEST['id'],$data);
		}
	}
	
	public function vuongFormSubmit(){
		// VUONG
		$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}
		// END VUONG

		$params = file_get_contents("php://input");
		
		$this->load->model("entry_model");
		$this->load->model("employer_model");
		$this->load->model("employee_model");
		
		$params = json_decode($params);
		
		if(isset($params->images)){
			$images = $params->images;
		}
		
		$data = $params->data;
		
		$employee_data = array(
			'employerId' => $params->company_id,
			'salut' => $data->salut,
			'fname' => $data->fname,
			'gname' => $data->gname,
			'nok' => $data->nok,
			'kfone' => $data->Kfone,
			'hfone' => $data->kfone,
			'wfone' => $data->wfone,
			'mfone' => $data->mfone,
			'address' => $data->address,
			'suburb' => $data->suburb,
			'postcode' => $data->postcode,
			'dob' => $data->dob
		);
		
		$employeeId = $this->employee_model->checkExist($employee_data);
		if(0 != $employeeId){
			$this->employee_model->update($employeeId, $employeeData);
		}else{
			$this->employee_model->insert($employee_data);
			$employeeId = mysql_insert_id();
		}
		
		$data->employeeId = $employeeId;
		$data->employerId = $params->company_id;
		$data->detail = json_encode($params->data);
		$data->images = json_encode($images);
		
		$data->authen = 1;
		$data->status = 1;
		
		$data = (array)$data;
		
		echo $this->entry_model->insert($data);
	}
	
	public function formSubmit()
	{
		if (!isset($_REQUEST['type'])){
			show_404('page');
		}else{

			// VUONG
			$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

			if((isset($token) && $token !== $_SESSION["sessionid"])){
				show_404();
			}
			// END VUONG
			
			$temp = $_REQUEST['data'];
			$temp = str_replace('\"','"',$temp);
			//$temp = str_replace("\\\\","",$temp);
			$temp = str_replace("\'",'\u0027',$temp);
			$temp2 = str_replace('\"','"',$_REQUEST['images']);
			$temp2 = str_replace("\'",'\u0027',$temp2);
			
			$temp3 = str_replace('\"','"',$_REQUEST['redflags']);
			$temp3 = str_replace("\'",'\u0027',$temp3);
			//echo $temp3;
			$this->load->model('entry_model');
			$this->load->model('employer_model');
			$this->load->model('employee_model');
			$this->load->model('notification_model');
			$entry_data = json_decode($temp,true);
			$redflags = json_decode($temp3,true);
			$entry_data['redflags'] = $redflags;
			$data = array(
			   'employerId' 	=> 	$_REQUEST['companyId'],
			   'employeeId' 	=> 	1,
			   'detail' 		=>  json_encode($entry_data),
			   'status' 		=> 	1,
			   'images' 		=>  $temp2,
			);
			
			 $data['authen'] = ((array_key_exists('authen-1',$entry_data))?(('on'==$entry_data['authen-1'])?1:0):0);
			$employee_data = array(
					'employerId'		=> $_REQUEST['companyId'],
					'salut'		=> $entry_data['salut'],
					'fname'		=> $entry_data['fname'],
					'gname'		=> $entry_data['gname'],
					'nok'		=> $entry_data['nok'],
					'kfone'		=> $entry_data['Kfone'],
					'hfone'		=> $entry_data['hfone'],
					'wfone'		=> $entry_data['wfone'],
					'mfone'		=> $entry_data['mfone'],
					'address'	=> $entry_data['address'],
					'suburb'	=> $entry_data['suburb'],
					'postcode'	=> $entry_data['postcode'],
					'dob' 		=> $entry_data['dob'],
			);
			
			//print_r($entry_data);
			if (('add'!=$_REQUEST['type'])&&('edit'!=$_REQUEST['type']))
				$data['status'] = 2;
				
			$employeeId = $this->employee_model->checkExist($employee_data);
			//echo $employeeId;
			if (isset($_REQUEST['id'])){
				$entry = $this->entry_model->get($_REQUEST['id']); 
				if (count($entry)>0){
					$this->employee_model->update($entry[0]['employeeId'],$employee_data);
					$employeeId = $entry[0]['employeeId'];
				}else{
					$this->employee_model->insert($employee_data);
					$employeeId = mysql_insert_id();
				}
			}else{
				if (0!=$employeeId){
					$this->employee_model->update($employeeId,$employee_data);
				}else{
					$this->employee_model->insert($employee_data);
					$employeeId = mysql_insert_id();
				}
				
			}
			$data['employeeId'] = $employeeId;
			
				//var_dump($data);
				//echo "test";
			if ('add'!=$_REQUEST['type']){
				echo $this->entry_model->update($_REQUEST['id'],$data);
				$patient = 'Updated remote consult patient: '.$entry_data['gname']." ".$entry_data['fname'];
			}else{			
				echo $this->entry_model->insert($data); 
				$patient = 'New remote consult patient: '.$entry_data['gname']." ".$entry_data['fname'];
				
				// send email notification
				$company = $this->employer_model->get($_REQUEST['companyId']); 
				if (count($company)>0)
					$employer = $company[0];
				else
					$employer = array();
				//insert to notification table
				$data['patient'] = $entry_data['gname']." ".$entry_data['fname'].' - '
									.((array_key_exists('name',$employer))?$employer['name']:"");
				$data['email'] = ((array_key_exists('email',$employer))?$employer['email']:"").' - '.date("g:i a");
				$data['status'] = 0;
				$this->notification_model->insert($data);
				$required = ((array_key_exists('require-1',$data))?(('on'==$data['require-1'])?'Trauma Consult, ':''):"")
				.((array_key_exists('require-2',$entry_data))?(('on'==$entry_data['require-2'])?'First Medical Certificate, ':''):"")
				.((array_key_exists('require-3',$entry_data))?(('on'==$entry_data['require-3'])?'Follow up in Perth, ':''):"")
				.((array_key_exists('require-4',$entry_data))?(('on'==$entry_data['require-4'])?'Fitness for work, ':''):"")
				.((array_key_exists('require-5',$entry_data))?(('on'==$entry_data['require-5'])?'Initial Telehealth Consult, ':''):"")
				.((array_key_exists('require-6',$entry_data))?(('on'==$entry_data['require-6'])?'Progress Telehealth Consult':''):"")
				.((array_key_exists('require-7',$entry_data))?(('on'==$entry_data['require-7'])?'Transport to/from Airport':''):"");
				$content = $patient
							."<br> DOB: ".$entry_data['dob']
							."<br> Time: ". date("m/d/Y")." ".date("g:i a")
							."<br> Company: ".((array_key_exists('name',$employer))?$employer['name']:"")
							."<br> Email: ".((array_key_exists('email',$employer))?$employer['email']:"")
							."<br> Site Medic: ".((array_key_exists('smedic',$entry_data))?$entry_data['smedic']:"")
							."<br> Site phone number: ".((array_key_exists('smphone',$employer))?$employer['smphone']:"");
				if ($entry_data['itype']==2){
					$content .="<br> Description of injury: ".((array_key_exists('injdesc-1',$entry_data))?(('on'==$entry_data['injdesc-1'])?'Sprain/Strain':''):"")  
								.((array_key_exists('injdesc-2',$entry_data))?(('on'==$entry_data['injdesc-2'])?'Laceration, ':''):"")
								.((array_key_exists('injdesc-3',$entry_data))?(('on'==$entry_data['injdesc-3'])?'Crush, ':''):"")
								.((array_key_exists('injdesc-4',$entry_data))?(('on'==$entry_data['injdesc-4'])?'Fall. ':''):"")
								.((array_key_exists('injdesctxt',$entry_data))?$entry_data['injdesctxt']:"")
							."<br> Body part: ".((array_key_exists('bdypart-1',$entry_data))?(('on'==$entry_data['bdypart-1'])?'Left lower leg, ':''):"")
								.((array_key_exists('bdypart-2',$entry_data))?(('on'==$entry_data['bdypart-2'])?'Right lower leg, ':''):"")
								.((array_key_exists('bdypart-3',$entry_data))?(('on'==$entry_data['bdypart-3'])?'Left upper leg, ':''):"")
								.((array_key_exists('bdypart-4',$entry_data))?(('on'==$entry_data['bdypart-4'])?'Right upper leg, ':''):"")
								.((array_key_exists('bdypart-5',$entry_data))?(('on'==$entry_data['bdypart-5'])?'Left lower arm, ':''):"")
								.((array_key_exists('bdypart-6',$entry_data))?(('on'==$entry_data['bdypart-6'])?'Right lower arm, ':''):"")
								.((array_key_exists('bdypart-7',$entry_data))?(('on'==$entry_data['bdypart-7'])?'Left upper arm, ':''):"")
								.((array_key_exists('bdypart-8',$entry_data))?(('on'==$entry_data['bdypart-8'])?'Right upper arm. ':''):"")
								.((array_key_exists('bdypart-9',$entry_data))?(('on'==$entry_data['bdypart-9'])?'Left hand, ':''):"")
								.((array_key_exists('bdypart-10',$entry_data))?(('on'==$entry_data['bdypart-10'])?'Right hand, ':''):"")
								.((array_key_exists('bdypart-11',$entry_data))?(('on'==$entry_data['bdypart-11'])?'Left shoulder, ':''):"")
								.((array_key_exists('bdypart-12',$entry_data))?(('on'==$entry_data['bdypart-12'])?'Right shoulder, ':''):"")
								.((array_key_exists('bdypart-13',$entry_data))?(('on'==$entry_data['bdypart-13'])?'Abdomen, ':''):"")
								.((array_key_exists('bdypart-14',$entry_data))?(('on'==$entry_data['bdypart-14'])?'Chest, ':''):"")
								.((array_key_exists('bdypart-15',$entry_data))?(('on'==$entry_data['bdypart-15'])?'Lower back. ':''):"")
								.((array_key_exists('bdyparttxt',$entry_data))?$entry_data['bdyparttxt']:"");
				}else{
					$content .=	((array_key_exists('gillness-1',$entry_data))?(('on'==$entry_data['gillness-1'])?'Headache, ':''):"")
								.((array_key_exists('gillness-2',$entry_data))?(('on'==$entry_data['gillness-2'])?'Nausea, ':''):"")
								.((array_key_exists('gillness-3',$entry_data))?(('on'==$entry_data['gillness-3'])?'Fatigue, ':''):"")
								.((array_key_exists('gillness-4',$entry_data))?(('on'==$entry_data['gillness-4'])?'Fever, ':''):"")
								.((array_key_exists('gillness-5',$entry_data))?(('on'==$entry_data['gillness-5'])?'Sore throat, ':''):"")
								.((array_key_exists('gillness-6',$entry_data))?(('on'==$entry_data['gillness-6'])?'Cough, ':''):"")
								.((array_key_exists('gillness-7',$entry_data))?(('on'==$entry_data['gillness-7'])?'Sinus congestion, ':''):"")
								.((array_key_exists('gillness-8',$entry_data))?(('on'==$entry_data['gillness-8'])?'Body aches, ':''):"")
								.((array_key_exists('gillness-9',$entry_data))?(('on'==$entry_data['gillness-9'])?'Vomiting, ':''):"")
								.((array_key_exists('gillness-10',$entry_data))?(('on'==$entry_data['gillness-10'])?'Light headedness, ':''):"")
								.((array_key_exists('gillness-11',$entry_data))?(('on'==$entry_data['gillness-11'])?'Diarrhea, ':''):"")
								.((array_key_exists('gillness-12',$entry_data))?(('on'==$entry_data['gillness-12'])?'Shortness of breath, ':''):"")
								.((array_key_exists('gillness-13',$entry_data))?(('on'==$entry_data['gillness-13'])?'Chest pain, ':''):"")
								.((array_key_exists('gillness-14',$entry_data))?(('on'==$entry_data['gillness-14'])?'Abdomen pain, ':''):"")
								.((array_key_exists('gillness-20',$entry_data))?(('on'==$entry_data['gillness-20'])?'Back pain, ':''):"")
								.((array_key_exists('gillness-15',$entry_data))?(('on'==$entry_data['gillness-15'])?'Ear pain, ':''):"")
								.((array_key_exists('gillness-16',$entry_data))?(('on'==$entry_data['gillness-16'])?'Low mood, ':''):"")
								.((array_key_exists('gillness-17',$entry_data))?(('on'==$entry_data['gillness-17'])?'Decreased appetite, ':''):"")
								.((array_key_exists('gillness-18',$entry_data))?(('on'==$entry_data['gillness-18'])?'Feeling depressed, ':''):"")
								.((array_key_exists('gillness-19',$entry_data))?(('on'==$entry_data['gillness-19'])?'Tooth pain. ':''):"")
								.((array_key_exists('gillnesstxt',$entry_data))?$entry_data['gillnesstxt']:"");
					$strredflags = '';
					foreach ($redflags as $key=> $value){
						foreach ($value as $str){
							$strredflags .= $str.', ';
						}
					}
					$content .= "<br>Redflags: ".$strredflags;
				}
						$content .= "<br> Services Required: ".$required;
					
				if ($_REQUEST['allauthen']!='yes')
					$content .= "<br> Unchecked consent(s): "
						.((array_key_exists('authen-1',$entry_data))?(('on'==$entry_data['authen-1'])?'':'<br> - "I, authorise any doctor who treats me (whether named in this certificate or not) to discuss my medical condition, in relation to my claim for workers\' compensation and return to work options, with my employer and with their insurer."'):'<br> - "I, authorise any doctor who treats me (whether named in this certificate or not) to discuss my medical condition, in relation to my claim for workers\' compensation and return to work options, with my employer and with their insurer."')
						.((array_key_exists('authen-2',$entry_data))?(('on'==$entry_data['authen-2'])?'':'<br> - "If your claim is NOT ACCEPTED by the insurance company, or your accounts are not settled by your employer, you will be liable for any invoices issued during the course of your treatment. If your account is forwarded to the debt collector, you will be liable for all fees associated."'):'<br> - "If your claim is NOT ACCEPTED by the insurance company, or your accounts are not settled by your employer, you will be liable for any invoices issued during the course of your treatment. If your account is forwarded to the debt collector, you will be liable for all fees associated."')
						.((array_key_exists('authen-3',$entry_data))?(('on'==$entry_data['authen-3'])?'':'<br> - "I, agree to having medic/supervisor present as a third party during a medical consult with REDiMED"'):'<br> - "I, agree to having medic/supervisor present as a third party during a medical consult with REDiMED"');
				
				$this->sendNotification("telehealth@redimed.com.au", $patient, $content);
				$hour = date("H");
				$dayinweek = date("w");
				
//				if ((($hour >= 8) && ($hour < 17))&&(($dayinweek>=1) && ($dayinweek<=5))){ 
//					//echo "Its between the time given";
//				} else {
					$contentnotification = 'New remote consult patient;'.
									'Name:'.$entry_data['gname']." ".$entry_data['fname'].'; '
									.'DOB: '.$entry_data['dob'].';'
									.'Location: '.((array_key_exists('sname',$employer))?$employer['sname']:"").' - '.((array_key_exists('address',$employer))?$employer['address']:"").'; '
									.'Time: '.date("g:i a").';'
									.'Email: '.((array_key_exists('email',$employer))?$employer['email']:"");
					
					$this->load->model('employer_model', '', true);
					$this->load->model('member_model', '', true); 
					$redimed = $this->employer_model->get(99999);
					$ids =  explode("##!!##",$redimed[0]['sms']);
					$sms = json_decode($redimed[0]['sms'],true);
					foreach ($sms as $did=>$value){
						if (1==$value){
							$doctor = $this->member_model->get($did);
                                                        //*** IGL FIX *** : Temporary disable email sending
							//$this->sendNotification($doctor[0]['email'], $patient, $content);
							//$this->pushNotification($doctor[0]['deviceId'], $contentnotification);
						}
					}
				//}
			}
			
			
		}
	}
	// send script to email
	public function SendAttachedEmail($filepath,$email){
		// VUONG
		$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}
		// END VUONG

		$this->load->library('email');
        $this->email->from('telehealth@redimed.com.au', 'REDiSITE Script');
        $this->email->to('telehealth@redimed.com.au');
		$this->email->cc($email);
		$this->email->subject('REDiSITE Script');
        $this->email->message('REDiSITE Script');
 		$this->email->attach($filepath);
		//$this->email->send();
		if ($this->email->send())
		{$results='1';}
		else 
		{ 
		$results='0';
		}
		return $results;
	}
    //*** IGL FIX *** : Add a function to send a report email in case PN fail
    public function sendEmailErrorReport($result){
    	// VUONG
		$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}
		// END VUONG

        $this->load->library('email');
        $this->email->initialize(array('mailtype' => 'html','newline' => "\r\n"));
        $this->email->clear();
        $this->email->from('telehealth@redimed.com.au', 'Redimed');
        //$this->email->to('tdarch@2hands.net.au');
        //$this->email->bcc('andrey@ingeniuslabs.com.au, olivier@ingeniuslabs.com.au, stuart@ingeniuslabs.com.au');
        $this->email->to('andrey@ingeniuslabs.com.au, olivier@ingeniuslabs.com.au, stuart@ingeniuslabs.com.au');
        $this->email->subject('TeleHealth API - Push Notifications Error Report');
        $this->email->message($this->load->view('email_to_admin', array('result' => $result), true));
        $this->email->send();
    }    
    //*** IGL FIX *** : Rewrite Push Notifications function with error handler
    public function pushNotification($id,$content){
        
    	// VUONG
		$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}
		// END VUONG

        if($id == "") return 1;
        else {
            
        // Put your device token here (without spaces):
		$deviceToken = $id;
		//$deviceToken = '9ceefe755646093786e74f20849328721e7bc37d01491f38db271ed2bc914972';
		// Put your private key's passphrase here:
		//$passphrase = '700120@mk';
		$passphrase = 'redimed';
		
		// Put your alert message here:
		$message = $content;
        
        //Prepare data to embed in email report if needed
        $result['action'] = 'pushNotification - json.php';
        $result['deviceToken'] = $deviceToken;
        $result['content'] = $content;
        $result['payload'] = "";
		
        $this->load->model('notification_model', '', true);
        // Create the payload body
        $badge = intval($this->notification_model->getAllActive());
        $body['aps'] = array(
            'alert' => $message,
            'sound' => 'sound.caf',
            'badge' => $badge);
        
        // Encode the payload as JSON
        $payload = json_encode($body);
        $result['payload'] = $payload;
        
	////////////////////////////////////////////////////////////////////////////////
        
        if($deviceToken != ""){     
		
            $ctx = stream_context_create();
            // development		
            //stream_context_set_option($ctx, 'ssl', 'local_cert', 'ck.pem');
            // production
            stream_context_set_option($ctx, 'ssl', 'local_cert', 'REDiPUSH_Dist_Certificates.pem');  
            stream_context_set_option($ctx, 'ssl', 'passphrase', $passphrase);

            // development		    
            // Open a connection to the APNS server
//            $fp = stream_socket_client(
//                          'ssl://gateway.sandbox.push.apple.com:2195', $err,
//                          $errstr, 60, STREAM_CLIENT_CONNECT|STREAM_CLIENT_PERSISTENT, $ctx);
            // production
            $fp = stream_socket_client(
                          'ssl://gateway.push.apple.com:2195', $err,
                          $errstr, 60, STREAM_CLIENT_CONNECT|STREAM_CLIENT_PERSISTENT, $ctx);
             
            //Add blocking
            stream_set_blocking ($fp, 0);

            if (!$fp){
                //Send email report
                $result['status'] = 'error';
                $result['message'] = "Failed to connect: $err $errstr";
                $this->sendEmailErrorReport($result);
                return 0;
                //exit("Failed to connect: $err $errstr" . PHP_EOL);
            }

            //If payload is too long (256 bytes, truncate it)
            $payload_len = strlen($payload);
            if($payload_len > 256){
                $tmp['aps'] = array(
                    'alert' => '',
                    'sound' => 'sound.caf',
                    'badge' => $badge);
                $tmp_len = strlen(json_encode($tmp));
                $message = substr($message, 0, 256 - 1 - $tmp_len - 3);
                $body['aps'] = array(
                    'alert' => $message.'...',
                    'sound' => 'sound.caf',
                    'badge' => $badge);
                $payload = json_encode($body);
            }

            // Build the binary notification
            //Add expiry time
            //$msg = chr(0) . pack('n', 32). pack('H*', $deviceToken) . pack('n', strlen($payload)) . $payload;
            $expiry = time() + 60 * 60;
            $msg = chr(1).pack("N",1).pack("N",$expiry).pack("n",32).pack('H*',$deviceToken).pack("n",strlen($payload)).$payload;

            // Send it to the server
            //$result = fwrite($fp, $msg, strlen($msg));
            $fwrite = fwrite($fp, $msg);

            if(!$fwrite) {
                fclose($fp);
                //Send email report
                $result['status'] = 'error';
                $result['message'] = 'Connection closed.';
                $this->sendEmailErrorReport($result);
                return 0;
            }

            $read = array($fp);
            $null = null;
            $changedStreams = stream_select($read, $null, $null, 0, 10000000);

            if ($changedStreams === false) {    
                fclose($fp);
                //Send email report
                $result['status'] = 'error';
                $result['message'] = 'Unabled to wait for a stream availability.';
                $this->sendEmailErrorReport($result);
                return 0;
            } elseif ($changedStreams > 0) {
                // get apple response
                $appleResponse = $this->checkAppleErrorResponse($fp);
                fclose($fp);

                if($appleResponse['status'] == 'error'){
                    //Send email report
                    $result['status'] = 'error';
                    $result['message'] = $appleResponse['message'];
                    $this->sendEmailErrorReport($result);
                    return 0;
                } else {
                    // Everything went OK
                    return 1;
                }
            } else {
                // Everything went OK
                fclose($fp);
                return 1;
            }
        
        } else {
            $result['status'] = 'error';
            $result['message'] = 'Empty Device Token';
            $this->sendEmailErrorReport($result);
            return 0;
        }
      }
    }
    
    //*** IGL FIX *** : Add a function to handle all possible APNS errors
    public function checkAppleErrorResponse($fp) {
    	// VUONG
		$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}
		// END VUONG

         $responseBinary = fread($fp, 6);
         
         if ($responseBinary !== false || strlen($responseBinary) == 6) {
            $error_response = unpack('Ccommand/Cstatus_code/Nidentifier', $responseBinary); 

            if ($error_response['status_code'] == '0') {
                $error_response['status_code'] = '0 - No errors encountered';
            } else if ($error_response['status_code'] == '1') {
                $error_response['status_code'] = '1 - Processing error';
            } else if ($error_response['status_code'] == '2') {
                $error_response['status_code'] = '2 - Missing device token';
            } else if ($error_response['status_code'] == '3') {
                $error_response['status_code'] = '3 - Missing topic';
            } else if ($error_response['status_code'] == '4') {
                $error_response['status_code'] = '4 - Missing payload';
            } else if ($error_response['status_code'] == '5') {
                $error_response['status_code'] = '5 - Invalid token size';
            } else if ($error_response['status_code'] == '6') {
                $error_response['status_code'] = '6 - Invalid topic size';
            } else if ($error_response['status_code'] == '7') {
                $error_response['status_code'] = '7 - Invalid payload size';
            } else if ($error_response['status_code'] == '8') {
                $error_response['status_code'] = '8 - Invalid token';
            } else if ($error_response['status_code'] == '255') {
                $error_response['status_code'] = '255 - None (unknown)';
            } else {
                $error_response['status_code'] = $error_response['status_code'].' - Not listed';
            }
            return array('status' => 'error', 'message' => $error_response['status_code']);
        }
        return array('status' => 'success');
    }
          //*** IGL FIX *** : Old Push function
//	public function pushNotification($id,$content){
//		// Put your device token here (without spaces):
//		$deviceToken = $id;
//		//$deviceToken = '9ceefe755646093786e74f20849328721e7bc37d01491f38db271ed2bc914972';
//		// Put your private key's passphrase here:
//		$passphrase = 'redimed';
//		
//		// Put your alert message here:
//		$message = $content;
//		
//		////////////////////////////////////////////////////////////////////////////////
//		
//		$ctx = stream_context_create();
//		stream_context_set_option($ctx, 'ssl', 'local_cert', 'ck.pem');
//		stream_context_set_option($ctx, 'ssl', 'passphrase', $passphrase);
//		
//		// Open a connection to the APNS server
//		$fp = stream_socket_client(
//			'ssl://gateway.sandbox.push.apple.com:2195', $err,
//			$errstr, 60, STREAM_CLIENT_CONNECT|STREAM_CLIENT_PERSISTENT, $ctx);
//		
//		if (!$fp)
//			return 0;
//			//exit("Failed to connect: $err $errstr" . PHP_EOL);
//		
//		//echo 'Connected to APNS' . PHP_EOL;
//		
//		$this->load->model('notification_model', '', true);
//		// Create the payload body
//		$body['aps'] = array(
//			'alert' => $message,
//			'sound' => 'sound.caf',
//			'badge' => intval($this->notification_model->getAllActive())
//			);
//		
//		// Encode the payload as JSON
//		$payload = json_encode($body);
//		
//		// Build the binary notification
//		$msg = chr(0) . pack('n', 32). pack('H*', $deviceToken) . pack('n', strlen($payload)) . $payload;
//		
//		// Send it to the server
//		$result = fwrite($fp, $msg, strlen($msg));
//		
//		if (!$result)
//			return 0;
//		else
//			return 1;
//		//echo $result;
//		// Close the connection to the server
//		fclose($fp);	
//	}
	public function sendNotification($to, $patient, $content){
		// VUONG
		$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}
		// END VUONG

		$this->load->library('email');
		$this->email->set_mailtype("html");
		$this->email->from('telehealth@redimed.com.au', 'REDiMED TELEHEALTH');
		$this->email->to($to);
		
		$this->email->subject($patient);
		$this->email->message($content);
		
		$this->email->send();
	}
	public function entryDelete(){
		if (!($this->uri->segment(3))){
			echo 0;
		}else{
			// VUONG
			$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

			if((isset($token) && $token !== $_SESSION["sessionid"])){
				show_404();
			}
			// END VUONG

			$this->load->model('entry_model');
			$this->load->model('progress_model');
			if ($this->progress_model->deleteWithEntryId($this->uri->segment(3))){
				echo $this->entry_model->delete($this->uri->segment(3));
			}
		}
	}
	public function employeeDelete(){
		if (!($this->uri->segment(3))){
			echo 0;
		}else{
			// VUONG
			$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

			if((isset($token) && $token !== $_SESSION["sessionid"])){
				show_404();
			}
			// END VUONG

			$this->load->model('employee_model');
			//echo $this->uri->segment(3);
			echo $this->employee_model->delete($this->uri->segment(3));
		}
	}
	public function employerDelete(){
		// VUONG
		$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}
		// END VUONG

		if ((!($this->uri->segment(3)))||(!($this->uri->segment(4)))){
			echo 0;
		}else{
			$this->load->model('employer_model');
			$this->load->model('member_model');
			if ($this->member_model->delete($this->uri->segment(4))){
				echo $this->employer_model->delete($this->uri->segment(3));
			}
		}
	}
	public function doctorDelete(){
		// VUONG
		/*$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}*/
		// END VUONG

		if ((!($this->uri->segment(3)))){
			echo 0;
		}else{
			//$this->load->model('employer_model');
			$this->load->model('member_model');
			echo $this->member_model->delete($this->uri->segment(3));
		}
	}
	public function getPdf(){
		// VUONG
		/*$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		var_dump($_SESSION);
		
		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}*/
		// END VUONG
		
		$pdf = new PDF();
		ini_set('memory_limit', '-1');
		set_time_limit(0);
		ini_set('max_execution_time', '500');
		if ((file_exists("output/Cert".$this->uri->segment(3).$this->uri->segment(4).$this->uri->segment(5).$this->uri->segment(6).".pdf"))){
			@unlink((file_exists("output/Cert".$this->uri->segment(3).$this->uri->segment(4).$this->uri->segment(5).$this->uri->segment(6).".pdf")));
		}
			if (!($this->uri->segment(3))||!($this->uri->segment(5))||!($this->uri->segment(6))){
				show_404('page');
			}else{
				$this->load->model('entry_model');
				if ((99999!=$this->uri->segment(6))&&($this->entry_model->checkPossess($this->uri->segment(3),$this->uri->segment(6)))){
					show_404('page');
				}else{
					$this->load->model('entry_model');
					
					$entry = $this->entry_model->get($this->uri->segment(3)); 
					if (count($entry)>0){
						$data['entry'] = $entry[0];
						$this->load->model('employer_model');
						$this->load->model('member_model');
				
						$company = $this->employer_model->get($entry[0]['employerId']); 
						if (count($company)>0)
							$data['employer'] = $company[0];
						else
							$data['employer'] = array();
					}else
						$data['entry'] = array();
				
					if (2==$data['entry']['status']){
						
						$data['formdata'] = str_replace('\"','"',$data['entry']['detail']);
						$data['formdata'] = str_replace("\'",'\u0027',$data['formdata']);
						
						$data['data'] = json_decode($data['formdata'],true);
						$doctor = $this->member_model->get($data['data']['drId']); 
						if (count($doctor)>0){
							$temp = str_replace('\"','"',$doctor[0]['detail']);
							$temp = str_replace("\'",'\u0027',$temp);
							
							$temp = json_decode($temp,true);
							$drsign = array_key_exists('drsign', $temp)?$temp['drsign']:'';
							
						}else{
							$drsign = '';	
						}
						
						$data['data']['drsign'] = $drsign;
						//echo $drsign;
						//print_r($data);
						// set document information
						$salutation = array('Mr', 'Mrs', 'Ms', 'Miss', 'Master', 'Dr');
						$pdf->SetCreator(PDF_CREATOR);
						$pdf->SetAuthor('REDIMED');
						
						// ---------------------------------------------------------
						$dateType=array("Last week","Last month","Last calendar month","Custom");
						// set font
						$pdf->SetFontSize(8, true);
						if (!array_key_exists('state-'.$this->uri->segment(4),$data['data']))
								$data['data']['state-'.$this->uri->segment(4)] =6;
						switch ($data['data']['state-'.$this->uri->segment(4)]) {
							case 0:
								if ((!(array_key_exists('general',$data['data'])))||((array_key_exists('general',$data['data']))&&("FALSE"==$data['data']['general']))){
								if (1==$data['data']['itype']){
									require_once("inc/generalIllness.php");						
								}else{
									$pagecount = $pdf->setSourceFile('inc/templates/NSW.pdf');
									//echo $pagecount;
									for ($i = 1; $i <= $pagecount; $i++) {
										//echo $i;
										$tplidx = $pdf->ImportPage($i);
										$s = $pdf->getTemplatesize($tplidx);
										$pdf->AddPage();
										$pdf->useTemplate($tplidx);
									}
									//if (1==$this->uri->segment(4)){
										include_once("inc/nsw_cert.php");	
									//}
								}
								}else{
									if ("TRUE"==$data['data']['general'])
										require_once("inc/generalIllness.php");
								}
								break;
							case 1:
								if ((!(array_key_exists('general',$data['data'])))||((array_key_exists('general',$data['data']))&&("FALSE"==$data['data']['general']))){
									if (1==$data['data']['itype']){
										require_once("inc/generalIllness.php");						
									}else{
										
										if (1==$this->uri->segment(4)){
											$pagecount = $pdf->setSourceFile('inc/templates/NT_First_Medical.pdf');
											//echo $pagecount;
											for ($i = 1; $i <= $pagecount; $i++) {
												//echo $i;
												$tplidx = $pdf->ImportPage($i);
												$s = $pdf->getTemplatesize($tplidx);
												$pdf->AddPage();
												$pdf->useTemplate($tplidx);
											}
											include_once("inc/nt_first_cert.php");							
										}
										if (2==$this->uri->segment(4)){
											$pagecount = $pdf->setSourceFile('inc/templates/NT_Progress.pdf');
											//echo $pagecount;
											for ($i = 1; $i <= $pagecount; $i++) {
												//echo $i;
												$tplidx = $pdf->ImportPage($i);
												$s = $pdf->getTemplatesize($tplidx);
												$pdf->AddPage();
												$pdf->useTemplate($tplidx);
											}
											include_once("inc/nt_progress_cert.php");							
										}
										if (3==$this->uri->segment(4)){
											$pagecount = $pdf->setSourceFile('inc/templates/NT_Final.pdf');
											//echo $pagecount;
											for ($i = 1; $i <= $pagecount; $i++) {
												//echo $i;
												$tplidx = $pdf->ImportPage($i);
												$s = $pdf->getTemplatesize($tplidx);
												$pdf->AddPage();
												$pdf->useTemplate($tplidx);
											}
											include_once("inc/nt_final_cert.php");							
										}
									}
								}else{
									if ("TRUE"==$data['data']['general'])
										require_once("inc/generalIllness.php");
								}
								break;
							case 2: // QLD
								if ((!(array_key_exists('general',$data['data'])))||((array_key_exists('general',$data['data']))&&("FALSE"==$data['data']['general']))){
									if (1==$data['data']['itype']){
										require_once("inc/generalIllness.php");						
									}else{
										$pagecount = $pdf->setSourceFile('inc/templates/queensland.pdf');
										//echo $pagecount;
										for ($i = 1; $i <= $pagecount; $i++) {
											//echo $i;
											$tplidx = $pdf->ImportPage($i);
											$s = $pdf->getTemplatesize($tplidx);
											$pdf->addPage($s['h'] > $s['w'] ? 'P' : 'L');
											$pdf->useTemplate($tplidx);
											$pdf->useTemplate($tplidx);
										}
										//if (1==$this->uri->segment(4)){
											include_once("inc/qld_cert.php");	
										//}
									}
								}else{
									if ("TRUE"==$data['data']['general'])
										require_once("inc/generalIllness.php");
								}
								break;
							case 4:
								if (!($this->uri->segment(5))){
									$pdata=$data['data'];
								}else{
									$this->load->model('progress_model');
									$progress = $this->progress_model->get($this->uri->segment(5)); 
									//echo $this->uri->segment(5);
									//print_r($progress);
									if (count($progress)>0){
										$json = $progress[0]['detail'];
										preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $json);
										
										//echo urldecode($json).'<br>';
										$progress[0]['detail'] = json_decode($json,true);
										//print_r($progress);
										$pdata = $progress[0]['detail'];
										$doctor = $this->member_model->get($pdata['drId']); 
										if (count($doctor)>0){
											$temp = str_replace('\"','"',$doctor[0]['detail']);
											$temp = str_replace("\'",'\u0027',$temp);
											
											$temp = json_decode($temp,true);
											$pdata['drsign'] = array_key_exists('drsign', $temp)?$temp['drsign']:'';
											
										}else{
											$pdata['drsign'] = '';	
										}
									}else
										$pdata = array();
								}
								//echo $this->db->last_query();
								//print_r($pdata);
								if ((!(array_key_exists('general',$pdata)))||((array_key_exists('general',$pdata))&&("FALSE"==$pdata['general']))){
									if (1==$pdata['itype']){
										require_once("inc/generalIllness.php");						
									}else{
										
										if (1==$this->uri->segment(4)){
											$pagecount = $pdf->setSourceFile('inc/templates/tasmaniafirstcert.pdf');
											//echo $pagecount;
											for ($i = 1; $i <= $pagecount; $i++) {
												//echo $i;
												$tplidx = $pdf->ImportPage($i);
												$s = $pdf->getTemplatesize($tplidx);
												$pdf->AddPage();
												$pdf->useTemplate($tplidx);
											}
											include_once("inc/tas_first_cert.php");							
										}else{
										
											$pagecount = $pdf->setSourceFile('inc/templates/tasmaniaprogressfinalcert.pdf');
											//echo $pagecount;
											for ($i = 1; $i <= $pagecount; $i++) {
												//echo $i;
												$tplidx = $pdf->ImportPage($i);
												$s = $pdf->getTemplatesize($tplidx);
												$pdf->AddPage();
												$pdf->useTemplate($tplidx);
											}
											include_once("inc/tas_final_cert.php");							
										}
									}
								}else{
									if ("TRUE"==$pdata['general'])
										require_once("inc/generalIllness.php");
								}
								break;
							case 5: // VIC
								if ((!(array_key_exists('general',$data['data'])))||((array_key_exists('general',$data['data']))&&("FALSE"==$data['data']['general']))){
									if (1==$data['data']['itype']){
										require_once("inc/generalIllness.php");						
									}else{
										$pagecount = $pdf->setSourceFile('inc/templates/VIC.pdf');
										//echo $pagecount;
										for ($i = 1; $i <= $pagecount; $i++) {
											//echo $i;
											$tplidx = $pdf->ImportPage($i);
											$s = $pdf->getTemplatesize($tplidx);
											$pdf->AddPage();
											$pdf->useTemplate($tplidx);
										}
										//if (1==$this->uri->segment(4)){
											include_once("inc/vic_cert.php");	
										//}
									}
								}else{
									if ("TRUE"==$data['data']['general'])
										require_once("inc/generalIllness.php");
								}
								break;
							case 6:
								$pdf->AddPage();
								if (!($this->uri->segment(5))){
									$pdata=$data['data'];
								}else{
									$this->load->model('progress_model');
									$progress = $this->progress_model->get($this->uri->segment(5)); 
									//echo $this->uri->segment(5);
									//print_r($progress);
									if (count($progress)>0){
										$json = $progress[0]['detail'];
										preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $json);
										
										//echo urldecode($json).'<br>';
										$progress[0]['detail'] = json_decode($json,true);
										//print_r($progress);
										$pdata = $progress[0]['detail'];
										
										$doctor = $this->member_model->get($pdata['drId']); 
										if (count($doctor)>0){
											$temp = str_replace('\"','"',$doctor[0]['detail']);
											$temp = str_replace("\'",'\u0027',$temp);
											
											$temp = json_decode($temp,true);
											$pdata['drsign'] = array_key_exists('drsign', $temp)?$temp['drsign']:'';
											
										}else{
											$pdata['drsign'] = '';	
										}
									}else
										$pdata = array();
								}
								//echo $this->db->last_query();
								//print_r($pdata);
								if ((!(array_key_exists('general',$pdata)))||((array_key_exists('general',$pdata))&&("FALSE"==$pdata['general']))){
									if (1==$this->uri->segment(4)){
										if (1==$pdata['itype']){
											require_once("inc/generalIllness.php");						
										}else{
											
											include_once("inc/injury_first_cert.php");							
										}
									}
									if (2==$this->uri->segment(4)){
										if (1==$pdata['itype']){
											require_once("inc/generalIllness.php");						
										}else{
											
											include_once("inc/injury_progress_cert.php");
										}
									}
									if (3==$this->uri->segment(4)){
										
										include_once("inc/injury_final_cert.php");
									}
								}else{
									if ("TRUE"==$pdata['general'])
										require_once("inc/generalIllness.php");
								}
								break;
						}
						// reset pointer to the last page
						$pdf->lastPage();
					
						//print_r($data);
						echo $pdf->Output("output/Cert".$this->uri->segment(3).$this->uri->segment(4).$this->uri->segment(5).$this->uri->segment(6).".pdf", 'I');
					}else{
						show_404('page');			
					}
				}
			}
			/*
		}else{
			$pagecount = $pdf->setSourceFile("output/Cert".$this->uri->segment(3).$this->uri->segment(4).$this->uri->segment(5).$this->uri->segment(6).".pdf");
			//echo $pagecount;
			for ($i = 1; $i <= $pagecount; $i++) {
				//echo $i;
				$tplidx = $pdf->ImportPage($i);
				$s = $pdf->getTemplatesize($tplidx);
				$pdf->AddPage();
				$pdf->useTemplate($tplidx);
			}*/
			echo $pdf->Output("output/Cert".$this->uri->segment(3).$this->uri->segment(4).$this->uri->segment(5).$this->uri->segment(6).".pdf", 'FI');
		//}
	}
}class PDF extends FPDI {
    /**
     * "Remembers" the template id of the imported page
     */
    var $_tplIdx;
    
    /**
     * include a background template for every page
     */
    function Header() {
        if (is_null($this->_tplIdx)) {
            //$this->setSourceFile('inc/templates/fluvacc.pdf');
            //$this->_tplIdx = $this->importPage(2);
        }
		
        //$this->useTemplate($this->_tplIdx);
        
        //$this->SetFont('freesans', 'B', 9);
        //$this->SetTextColor(255);
        //$this->SetXY(60.5, 24.8);
        //$this->Cell(0, 8.6, "TCPDF and FPDI");
    }
    
    function Footer() {}
}
?>