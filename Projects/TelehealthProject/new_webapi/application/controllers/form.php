<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Form extends CI_Controller {

	public function __construct()
    {
        parent::__construct();
		session_start();
        if (!isset($_SESSION['loggedin']))
        {
			$pageURL = (@$_SERVER["HTTPS"] == "on") ? "https://" : "http://";
			if ($_SERVER["SERVER_PORT"] != "80")
			{
				$pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
			} 
			else 
			{
				$pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
			}			

            header('Location: /telehealth/index.php/authen?url='.$pageURL);
        }
    }
	
	public function index()
	{	
		$data['data'] = array();
		$output  = $this->load->view('header', '', true);
		$output .= $this->load->view('form', $data, true);
		$output .= $this->load->view('footer', '', true);
		
		$this->output->set_output($output);
	}
	public function submit()
	{
		if (!isset($_REQUEST['type'])){
			show_404('page');
		}else{
			$temp = str_replace('\"','"',$_REQUEST['data']);
			$temp = str_replace("\'",'\u0027',$temp);
			$this->load->model('entry_model');
			$this->load->model('employer_model');
			$this->load->model('employee_model');
			$data = array(
			   'employerId' 	=> 	$_SESSION['companyId'],
			   'employeeId' 	=> 	1,
			   'detail' 		=>  $temp,
			   'status' 		=> 	1,
			);
			$entry_data = json_decode($temp,true);
			$employee_data = array(
					'employerId'		=> $_SESSION['companyId'],
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
			if ('add'!=$_REQUEST['type']){
				echo $this->entry_model->update($_REQUEST['id'],$data);
				$patient = 'Updated remote consult patient: '.$entry_data['gname']." ".$entry_data['fname'];
			}else{			
				echo $this->entry_model->insert($data); 
				$patient = 'New remote consult patient: '.$entry_data['gname']." ".$entry_data['fname'];
			}
			/*
			$company = $this->employer_model->get($_SESSION['companyId']); 
			if (count($company)>0)
				$employer = $company[0];
			else
				$employer = array();
				
			$required = ((array_key_exists('require-1',$entry_data))?(('on'==$entry_data['require-1'])?'Emergency Telehealth Consult, ':''):"")
						.((array_key_exists('require-2',$entry_data))?(('on'==$entry_data['require-2'])?'First Medical Certificate, ':''):"")
						.((array_key_exists('require-3',$entry_data))?(('on'==$entry_data['require-3'])?'Follow up in Perth, ':''):"")
						.((array_key_exists('require-4',$entry_data))?(('on'==$entry_data['require-4'])?'Initial Telehealth Consult, ':''):"")
						.((array_key_exists('require-5',$entry_data))?(('on'==$entry_data['require-5'])?'Transport to/from Airport':''):"");
			$content = $patient
						."<br> DOB: ".$entry_data['dob']
						."<br> Time: ". date("m/d/Y")." ".date("g:i a")
						."<br> Company: ".((array_key_exists('name',$employer))?$employer['name']:"")
						."<br> Email: ".((array_key_exists('email',$employer))?$employer['email']:"")
						."<br> Site Medic: ".((array_key_exists('smedic',$employer))?$employer['smedic']:"")
						."<br> Site phone number: ".((array_key_exists('smphone',$employer))?$employer['smphone']:"")
						."<br> Description of injury: ".((array_key_exists('injdesc-1',$entry_data))?(('on'==$entry_data['injdesc-1'])?'Sprain/Strain':''):"")  
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
                            .((array_key_exists('bdyparttxt',$entry_data))?$entry_data['bdyparttxt']:"")
						."<br> Services Required: ".$required;
				
			//$this->sendNotification("AHarper@redimed.com.au", $patient, $content);
			$this->sendNotification("tdarch@2hands.net.au", $patient, $content);
			//$this->sendNotification("SDunjey@redimed.com.au", $patient, $content);
			//$this->sendNotification("hnguyen@redimed.com.au", $patient, $content);
			$this->sendNotification("nxkhoa85@gmail.com", $patient, $content);
			$hour = date("H");

			if (($hour >= 8) && ($hour < 17)) { 
				//echo "Its between the time given";
			} else {
				$content = 'New remote consult patient;'.
								'Name:'.$entry_data['gname']." ".$entry_data['fname'].'; '
								.'DOB: '.$entry_data['dob'].';'
								.'Location: '.((array_key_exists('name',$employer))?$employer['name']:"").'; '
								.'Time: '.date("g:i a");
				
				$this->load->model('employer_model', '', true); 
				$redimed = $this->employer_model->get(99999);
				$phones =  explode("##!!##",$redimed[0]['sms']);
				foreach ($phones as $key=>$phone){
					if (''!=$phone){
						$this->utboxSMS($phone, $content);
					}
				}
			}*/
		}
	}
	
	public function test(){
		$hour = date("H");

		if (($hour >= 8) && ($hour < 17)) { 
			//echo "Its between the time given";
		} else {
			/*$content = 'New remote consult patient;'.
							'Name:'.$entry_data['gname']." ".$entry_data['fname'].'; '
							.'DOB: '.$entry_data['dob'].';'
							.'Location: '.((array_key_exists('name',$employer))?$employer['name']:"").'; '
							.'Time: '.date("g:i a");*/
			$content = 'test';
			//$this->utboxSMS($phone, $content);
			
			$this->load->model('employer_model', '', true); 
			$redimed = $this->employer_model->get(99999);
			$phones =  explode("##!!##",$redimed[0]['sms']);
			foreach ($phones as $key=>$phone){
				if (''!=$phone){
					$this->utboxSMS($phone, $content);
				}
			}
		}
	}
	public function loadPage(){
		//echo ($_REQUEST['data']);
		if ($this->uri->segment(3)){
			$data['formdata'] = str_replace('\"','"',$_REQUEST['data']);
			$data['formdata'] = str_replace("\'",'\u0027',$data['formdata']);
			
			$data['data'] = json_decode($data['formdata'],true);
			//print_r($data['data']);
			$this->load->view('header');
			$this->load->view('form-'.$this->uri->segment(3), $data);	
			$this->load->view('footer');
		}else{
			show_404('page');			
		}
	}
	
	public function succeed(){
		$data['url']= $_REQUEST['url'];
		$this->load->view('header');
		$this->load->view('notification',$data);	
		$this->load->view('footer');
	}
	public function edit(){
		if (!($this->uri->segment(3))){
			show_404('page');
		}else{
			$this->load->model('entry_model');
			if ($this->entry_model->checkPossess($this->uri->segment(3),$_SESSION['companyId'])){
				show_404('page');
			}else{
				$this->load->model('entry_model');
				// dictionary for listview
				$entry = $this->entry_model->get($this->uri->segment(3)); 
				if (count($entry)>0)
					$data['entry'] = $entry[0];
				else
					$data['entry'] = array();
			
				if (2!=$entry[0]['status']){
					
					$data['formdata'] = str_replace('\"','"',$data['entry']['detail']);
					$data['formdata'] = str_replace("\'",'\u0027',$data['formdata']);
					
					$data['data'] = json_decode($data['formdata'],true);
					//print_r($data['data']);
					$this->load->view('header');
					$this->load->view('form-1', $data);	
					$this->load->view('footer');
				}else{
					show_404('page');			
				}	
			}
		}
	}
	public function utboxSMS($phone, $content){
		$this->load->library('email');

		$this->email->from('khoa@mynote.net.au', 'REDiMED TELEHEALTH');
		$this->email->to($phone.'@sms.utbox.net');
		
		$this->email->subject('SMS');
		$this->email->message($content);
		
		$this->email->send();
	}
	
	public function sendNotification($to, $patient, $content){
		
		$this->load->library('email');
		$this->email->set_mailtype("html");
		$this->email->from('admin@mynote.net.au', 'REDiMED TELEHEALTH');
		$this->email->to($to);
		
		$this->email->subject($patient);
		$this->email->message($content);
		
		$this->email->send();
	}
	
	public function burstSMS(){
		// change api key and secret to your own
		$myAPIKey = "bf71fa9b40064fa96642555d8220afcf";
		$myAPISecret = "r3d1m3d12!";
		//echo getcwd() . "\n";
		// include base class
		require_once('inc/APIclient.php');
		
		// create new client object
		$transmitsmsAPI = new transmitsmsAPI($myAPIKey, $myAPISecret);
		
		// set parameters
		$mobileIntFormat = "61402432592";
		$body = 'New remote consult patient; Name: Joe Citizen; DOB: 1/11/2012; Location: remotelocation@me.com.au; Time: 18:26pm';
		$caller_id = 'TELEHEALTH';
		
		// execute request
		$methodResponse = $transmitsmsAPI->SMS($mobileIntFormat, $body, $caller_id);
		
		// parse response into xml object
		$xml = @simplexml_load_string($methodResponse);
		
		echo ((string) $xml->data->result == 'queued') ? "Message was added" : "Message was not added: " . (string) $xml->data->message;
	}
	
	public function sign(){
		$this->load->view('header');
		$this->load->view('signPad');	
		$this->load->view('footer');
	}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
/*
Array
(
    [relation] => 1
    [require-2] => on
    [salut] => 4
    [fname] => dasd
    [gname] => dasdasd
    [dob] => 
    [address] => 
    [suburb] => 
    [postcode] => 
    [hfone] => 
    [mfone] => 
    [wfone] => 
    [nok] => 
    [Kfone] => 
    [PHPSESSID] => 840bdecce40b83d17ea144fa70f83828
)*/