<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Redimed extends CI_Controller {

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
        }else{
			if (99999!=$_SESSION['companyId'])
        	{	
				$mystring = $_SERVER["REQUEST_URI"];
				$findme   = 'getPdf';
				$pos = strpos($mystring, $findme);
				if ($pos === false) 
					header('Location: /telehealth');
			}
		}
    }
	/*
	public function index()
	{
		$this->load->model('entry_model');
		// dictionary for listview
		$names = array("A"=>array(),"B"=>array(),"C"=>array(),"D"=>array(),"E"=>array(),"F"=>array(),"G"=>array(),"H"=>array(),"I"=>array(),"J"=>array(),"K"=>array(),"L"=>array(),"M"=>array(),"N"=>array(),"O"=>array(),"P"=>array(),"Q"=>array(),"R"=>array(),"S"=>array(),"T"=>array(),"U"=>array(),"V"=>array(),"W"=>array(),"X"=>array(),"Y"=>array(),"Z"=>array());
		$entries = $this->entry_model->getAll(); 
		foreach ($entries as $entry){
			$entry_data = json_decode($entry['detail'], true);
			// append data into corresponding separator
			$char = strtoupper(substr($entry_data['gname'],0,1));
			if (""!=$char)
				$names[$char][] = array('data' => $entry_data, 'aux'=> $entry);
			else
				$this->entry_model->flagError($entry['id']); 
		}
		//echo count($names['A']);
		//echo "<br>".count($names['F']);
		//print_r($names);
		$data['results'] = $names;
		$this->load->view('header');
		$this->load->view('rdm_results',$data);
		$this->load->view('footer');
	}*/
	public function changePwd(){
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
		}else{
			//print_r($_REQUEST);
			$this->load->model('member_model', '', true);
			if ($this->member_model->changePwdId($_REQUEST['id'], $this->input->post('npwd'))){
				echo 1;
			}else{
				echo 0;
			}
		}
	}
	public function detail(){
		$this->load->model('entry_model');
		$entries = $this->entry_model->getAllEmployee($this->uri->segment(3));
		if (count($entries)==0)
			header('Location: '.BASE_APP_URL.'results');
		foreach ($entries as $key=>$entry){
			$entry_data = json_decode($entry['detail'], true);
			$entries[$key]['detail'] = $entry_data;
		}
		$data['results'] = $entries;
		$data['employeeId'] = $this->uri->segment(3);
		//print_r($entries);
		if (!($this->uri->segment(4))){
				$entryId = $entries[0]['id'];
		}else{
			$entryId = $this->uri->segment(4);
		}
		$data['entryId'] = $entryId;
		//get employee's detail
		$entry = $this->entry_model->get($entryId); 
		if (count($entry)>0){
			$data['formdata'] = $entry[0];
			$this->load->model('employer_model');
		
			$company = $this->employer_model->get($entry[0]['employerId']); 
			if (count($company)>0)
				$data['employer'] = $company[0];
			else
				$data['employer'] = array();
			
			$company = $this->employer_model->get(99999); 
			if (count($company)>0)
				$data['redimed'] = $company[0];
			else
				$data['redimed'] = array();
				
		}else{
			$data['employer'] = array();
			$data['redimed'] = array();
			$data['formdata'] = array();
		}
			
		$data['formdata'] = str_replace('\"','"',$data['formdata']['detail']);
		$data['formdata'] = str_replace("\'",'\u0027',$data['formdata']);
		$data['data'] = json_decode($data['formdata'],true);
		// get progress data
		$this->load->model('progress_model');
		$progress = $this->progress_model->getWithEntry($entryId,2); 
		if (count($progress)>0){
			foreach($progress as $pkey=>$pentry){
				$json = $pentry['detail'];
				preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $json);
				
				//echo urldecode($json).'<br>';
				$progress[$pkey]['detail'] = json_decode($json,true);
			}
			$data['progress'] = $progress;
		}else
			$data['progress'] = array();
		// get final data
		$final = $this->progress_model->getWithEntry($entryId,3); 
		if (count($final)>0){
			foreach($final as $fkey=>$fentry){
				$json = $fentry['detail'];
				preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $json);
				
				//echo urldecode($json).'<br>';
				$final[$fkey]['detail'] = json_decode($json,true);
			}
			$data['final'] = $final;
		}else
			$data['final'] = array();	
		$salutation = array('Mr', 'Mrs', 'Ms', 'Miss', 'Master', 'Dr');
		$data['name'] = $salutation[$data['data']['salut']].' '.$data['data']['gname'].' '.$data['data']['fname'];
		//print_r($data);
		$this->load->view('header'); 
		$this->load->view('rdm_results',$data);
		$this->load->view('footer');
	}
	public function assess(){
		if ((!($this->uri->segment(3)))||(!($this->uri->segment(4)))){
			show_404('page');
		}else{	
			$this->load->model('entry_model');
			//get employee's detail
			$entry = $this->entry_model->get($this->uri->segment(3)); 
			if (count($entry)>0){
				$data['formdata'] = $entry[0];
				$this->load->model('employer_model');
			
				$company = $this->employer_model->get($entry[0]['employerId']); 
				if (count($company)>0)
					$data['employer'] = $company[0];
				else
					$data['employer'] = array();
				// get progress data
				$this->load->model('progress_model');
				if (1!=$this->uri->segment(4)){
					$progress = $this->progress_model->getWithEntry($this->uri->segment(3),2); 
					if (count($progress)>0){
						foreach($progress as $pkey=>$pentry){
							$json = $pentry['detail'];
							preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $json);
							
							//echo urldecode($json).'<br>';
							$progress[$pkey]['detail'] = json_decode($json,true);
						}
						$data['progress'] = $progress;
					}else
						$data['progress'] = array();
				}
				
				// get final data
				if (3==$this->uri->segment(4)){
					$final = $this->progress_model->getWithEntryLatest($this->uri->segment(3),3); 
					if (count($final)>0){
						$json = $final[0]['detail'];
						preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $json);
						
						//echo urldecode($json).'<br>';
						$final[0]['detail'] = json_decode($json,true);
						//print_r($progress);
						$data['final'] = $final[0]['detail'];
					}else
						$data['final'] = array();
				}
				$this->load->model('member_model');
				$mem = $this->member_model->get($_SESSION['memId']); 
				if (count($mem)>0){
					//$mem[0]['detail'] = json_decode($mem[0]['detail'],true);
					
					
					$json = $mem[0]['detail'];
					preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $json);
					
					//echo urldecode($json).'<br>';
					$mem[0]['detail'] = json_decode($json,true);
					if (array_key_exists('drsign',$mem[0]['detail']))
						$mem[0]['detail']['drsign'] = str_replace(' ','+',$mem[0]['detail']['drsign']);
							
							
					$data['redimed'] = $mem[0];
				}else
					$data['redimed'] = array();
					
			}else{
				$data['employer'] = array();
				$data['redimed'] = array();
				$data['formdata'] = array();
			}
			
			$data['type'] = $this->uri->segment(4);	
			$data['entryId'] = $this->uri->segment(3);	
			$data['formdata'] = str_replace('\"','"',$data['formdata']['detail']);
			$data['formdata'] = str_replace("\'",'\u0027',$data['formdata']);
				
			$data['data'] = json_decode($data['formdata'],true);

			$salutation = array('Mr', 'Mrs', 'Ms', 'Miss', 'Master', 'Dr');
			$data['name'] = $salutation[$data['data']['salut']].' '.$data['data']['gname'].' '.$data['data']['fname'];
			//print_r($data);
			//print_r($data['progress']);
			$this->load->view('header'); 
			$this->load->view('rdm_assessment',$data);
			$this->load->view('footer');
		}
	}
	public function submit()
	{
		if (!isset($_REQUEST['type'])){
			show_404('page');
		}else{
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
						if (count($final)>0)
							$this->progress_model->update($final[0]['id'],$dataprogress); 
						else
							$this->progress_model->insert($dataprogress); 
					}
				}
			}
			
			$temp = str_replace('\"','"',$_REQUEST['data']);
			$temp = str_replace("\'",'\u0027',$temp);
			$this->load->model('entry_model');
			$entry = $this->entry_model->get($_REQUEST['id']); 
			if (count($entry)>0)
				$eid = $entry[0]['employerId'];
			else
				$eid = 99999;
			$data = array(
			   'employerId' 	=> 	$eid ,
			   'employeeId' 	=> 	1,
			   'detail' 		=>  $temp,
			   'status' 		=> 	1,
			);
			
			if (('add'!=$_REQUEST['type'])&&('edit'!=$_REQUEST['type']))
				$data['status'] = 2;
				
			if ('add'!=$_REQUEST['type']){
				echo $this->entry_model->update($_REQUEST['id'],$data);
			}else{			
				echo $this->entry_model->insert($data); 
			}
		}
	}
	/* Redimed's settings */
	public function updateSettings(){
		//print_r($_REQUEST);	
		$temp = str_replace('\"','"',$_REQUEST['data']);
		$temp = str_replace("\'",'\u0027',$temp);
		//echo $temp;
		$temparray = json_decode($temp,true);
		
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
		
		$this->load->model('employer_model');
		
		echo ($this->employer_model->update(99999,$data)&&$this->member_model->update($_SESSION['username'],$temparray['username']));
	}
	public function settings()
	{
		if (isset($_SESSION['loggedin'])){
			$this->load->model('member_model');
		
			$user = $this->member_model->get($_SESSION['memId']); 
			if (count($user)>0){
				foreach ($user as $key=>$entry){
					$json = $entry['detail'];
					preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $json);
					
					//echo urldecode($json).'<br>';
					$user[$key]['detail'] = json_decode($json,true);
					if (array_key_exists('drsign',$user[$key]['detail']))
						$user[$key]['detail']['drsign'] = str_replace(' ','+',$user[$key]['detail']['drsign']);
				}
				$data['data'] = $user[0];
			}else
				$data['data'] = array();
			//print_r($data['data']);
			$this->load->view('header');
			$this->load->view('rdm_settings',$data);
			$this->load->view('footer');
		}else{
			header('Location: /telehealth/index.php/authen');
		}
	}
	public function results()
	{
		$this->load->model('employee_model');
		// dictionary for listview
		$employees = $this->employee_model->getAll(); 
		//echo $_SESSION['companyId'];
		//echo count($names['A']);
		//echo "<br>".count($names['F']);
		//print_r($names);
		$data['results'] = $employees;
		$this->load->view('header');
		$this->load->view('rdm_employees',$data);
		$this->load->view('footer');
	}
	/* notification section */
	public function setDefault(){
		if (!isset($_SESSION['loggedin']))
        {
			header('Location: /telehealth');
		}else{
			//print_r($_REQUEST);
			$this->load->model('employer_model', '', true);
			$this->load->model('member_model', '', true);
			$user = $this->member_model->get($_REQUEST['id']); 
			$redimed = $this->employer_model->get(99999); 
			if (count($user)>0){
				foreach ($user as $key=>$entry){
					$json = $entry['detail'];
					preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $json);
					
					//echo urldecode($json).'<br>';
					$user[$key]['detail'] = json_decode($json,true);
				}
				
				$pos = strpos($redimed[0]['sms'],'##!!##'.trim(str_replace(' ', "",$user[0]['detail']['phone'])));
				
				if (false==$pos){
					if ($this->employer_model->add2SMS($redimed[0]['sms'].'##!!##'.trim(str_replace(' ', "",$user[0]['detail']['phone'])))){
						//echo trim($user[0]['detail']['phone']);
						echo 1;
					}else{
						echo 'failed adding';
					}
				}else
					echo 1;	
				
			}else
				echo 'not exist';
		}
	}
	public function removeDefault(){
		if (!isset($_SESSION['loggedin']))
        {
			header('Location: /telehealth');
		}else{
			//print_r($_REQUEST);
			$this->load->model('employer_model', '', true);
			$this->load->model('member_model', '', true);
			$user = $this->member_model->get($_REQUEST['id']); 
			$redimed = $this->employer_model->get(99999); 
			if (count($user)>0){
				foreach ($user as $key=>$entry){
					$json = $entry['detail'];
					preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $json);
					
					//echo urldecode($json).'<br>';
					$user[$key]['detail'] = json_decode($json,true);
				}
				
				$pos = strpos($redimed[0]['sms'],'##!!##'.$user[0]['detail']['phone']);
				
				if (false!=$pos){
					if ($this->employer_model->add2SMS(str_replace('##!!##'.trim(str_replace(' ', "",$user[0]['detail']['phone'])),'',$redimed[0]['sms']))){
						echo 1;
					}else{
						echo 'failed removing';
					}
				}else
					echo 1;	
				
			}else
				echo 'not exist';
		}
	}
	public function notification()
	{
		$this->load->model('member_model');
		$this->load->model('employer_model', '', true); 
		$redimed = $this->employer_model->get(99999); 
		$user = $this->member_model->getAllRedimed(); 
		
		if (count($user)>0){
			foreach ($user as $key=>$entry){
				$json = $entry['detail'];
				
				preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $json);
				
				//echo urldecode($json).'<br>';
				$user[$key]['detail'] = json_decode($json,true);
				if (array_key_exists('drsign',$user[$key]['detail']))
					$user[$key]['detail']['drsign'] = str_replace(' ','+',$user[$key]['detail']['drsign']);
					
				$pos = strpos($redimed[0]['sms'],trim(str_replace(' ', "",$user[$key]['detail']['phone'])));
				if (false!=$pos)
					$user[$key]['detail']['default'] = 1;
				else
					$user[$key]['detail']['default'] = 0;
				//echo $pos.'-'.$redimed[0]['sms'].'##!!##'.$user[$key]['detail']['phone'];
			}
			$data['data'] = $user;
		}else
			$data['data'] = array();
		//print_r($data['data']);
		$this->load->view('header');
		$this->load->view('afterhour',$data);
		$this->load->view('footer');
	}
	
	/* user section */
	public function users()
	{
		$this->load->model('member_model');
		
		$user = $this->member_model->getAllRedimed(); 
		//print_r($user);
		if (count($user)>0){
			foreach ($user as $key=>$entry){
				$json = $entry['detail'];
				
				preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $json);
				
				$user[$key]['detail'] = json_decode($json,true);
				//print_r($user[$key]);
				if (array_key_exists('drsign',$user[$key]['detail']))
					$user[$key]['detail']['drsign'] = str_replace(' ','+',$user[$key]['detail']['drsign']);
				//print_r($user[$key]['detail']);
			}
			$data['data'] = $user;
		}else
			$data['data'] = array();
		//print_r($data['data']);
		$this->load->view('header');
		$this->load->view('rdm_users',$data);
		$this->load->view('footer');
	}
	public function addUser()
	{
		$data['data'] = array();
		
		//print_r($data['data']);
		$this->load->view('header');
		$this->load->view('rdm_addUser',$data);
		$this->load->view('footer');
	}
	public function editUser()
	{
		if (($this->uri->segment(3))){
			$this->load->model('member_model');
		
			$user = $this->member_model->get($this->uri->segment(3)); 
			if (count($user)>0){
				foreach ($user as $key=>$entry){
					$json = $entry['detail'];
					preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $json);
					
					//echo urldecode($json).'<br>';
					$user[$key]['detail'] = json_decode($json,true);
					if (array_key_exists('drsign',$user[$key]['detail']))
						$user[$key]['detail']['drsign'] = str_replace(' ','+',$user[$key]['detail']['drsign']);
				}
				$data['data'] = $user[0];
			}else
				$data['data'] = array();
			//print_r($data['data']);
			$this->load->view('header');
			$this->load->view('rdm_addUser',$data);
			$this->load->view('footer');
		}else{
			show_404('page');
		}
	}
	public function submitUser(){
		if (!isset($_REQUEST['type'])){
			show_404('page');
		}else{
			$this->load->model('member_model');
			$temp = str_replace('\"','"',$_REQUEST['data']);
			$temp = str_replace("\'",'\u0027',$temp);
			
			$temp = json_decode($temp,true);
			
			$detail = array(
			   'name' 		=> 	$temp['name'],
			   'code' 		=> 	$temp['code'],
			   'email' 		=> 	$temp['email'],
			   'phone' 		=> 	$temp['phone'],
			   'address' 	=> 	$temp['address'],
			   'drsign' 	=> 	$temp['drsign'],
			);
			if ('add'!=$_REQUEST['type']){	
				$user = $this->member_model->get($_REQUEST['id']); 
				//print_r($user);
				if (count($user)>0){
					$type = $user[0]['type'];
				}else
					$type = 1;
			}
				
			$data = array(
			   'username' 		=> 	$temp['username'],
			   'detail' 		=> 	json_encode($detail),
			   'type' 		=> 	('add'!=$_REQUEST['type'])?$type:1,
			   'companyId' 		=> 	99999,
			   'password' 		=> 	((array_key_exists('password',$temp))?$temp['password']:""),
			);
			//print_r($temp);
			if ('add'!=$_REQUEST['type']){	
			   
				echo $this->member_model->update($_REQUEST['id'],$data);
			}else{		
				echo $this->member_model->insert($data); 
			}
		}
	}
	public function deleteUser(){
		if ($this->uri->segment(3)){
			$this->load->model('member_model');
			echo $this->member_model->delete($this->uri->segment(3));
		}else{
			show_404('page');			
		}	
	}
	public function deleteUserWithId($id){
		$this->load->model('member_model');
		return $this->member_model->delete($id);	
	}
	/* Company section*/
	public function companies()
	{
		$this->load->model('employer_model');
		$this->load->model('member_model');
		
		$company = $this->employer_model->getAll(); 
		if (count($company)>0){
			foreach ($company as $key=>$entry){
				
				$member = $this->member_model->getCompId($entry['id']); 
				//print_r($member);
				$company[$key]['memid'] = $member[0]['id'];
			}
			$data['data'] = $company;
		}else
			$data['data'] = array();
		//print_r($data['data']);
		$this->load->view('header');
		$this->load->view('rdm_listCompanies',$data);
		$this->load->view('footer');
	}
	public function addCompany()
	{
		$data['data'] = array();
		//print_r($data['data']);
		$this->load->view('header');
		$this->load->view('rdm_addComp',$data);
		$this->load->view('footer');
	}
	public function editCompany()
	{
		if (($this->uri->segment(3))){
			$this->load->model('employer_model');
			$this->load->model('member_model');
		
			$company = $this->employer_model->get($this->uri->segment(3)); 
			if (count($company)>0){
				$data['data'] = $company[0];
				$member = $this->member_model->getCompId($company[0]['id']); 
				$data['data']['username'] = $member[0]['username'];
			}else
				$data['data'] = array();
			//print_r($data['data']);
			$this->load->view('header');
			$this->load->view('rdm_addComp',$data);
			$this->load->view('footer');
		}else{
			show_404('page');
		}
	}
	public function submitComp(){
		if (!isset($_REQUEST['type'])){
			show_404('page');
		}else{
			$this->load->model('employer_model');
			$temp = str_replace('\"','"',$_REQUEST['data']);
			$temp = str_replace("\'",'\u0027',$temp);
			
			$temp = json_decode($temp,true);
			$this->load->model('member_model');
			$data = array(
			   'name' 		=> 	$temp['name'],
			   'code' 		=> 	$temp['code'],
			   'IMA' 		=> 	$temp['IMA'],
			   'insurer' 	=> 	$temp['insurer'],
			   'email' 		=> 	$temp['email'],
			   'phone' 		=> 	$temp['phone'],
			   'address' 	=> 	$temp['address'],
			   'smedic' 	=> 	$temp['smedic'],
			   'sname' 	=> 	$temp['sname'],
			   'smphone' 	=> 	$temp['smphone'],
			   'lastip' 	=> 	$_SERVER['REMOTE_ADDR'],
			);
			
			$exist = $this->member_model->getName($temp['username']);
			if (count($exist)>0){
				echo 0;
			}else{
				if ('add'!=$_REQUEST['type']){	
					$detail = $data;
				
					$datamember = array(
					   'username' 		=> 	$temp['username'],
					   'detail' 		=> 	json_encode($detail),
					   'type' 		=> 	0,
					   'companyId' 		=> 	$_REQUEST['id'],
					);
					echo ($this->employer_model->update($_REQUEST['id'],$data)&&$this->member_model->updateCompUser($_REQUEST['id'],$datamember)); 
				}else{		
					$id = $this->employer_model->insert($data); 
					$detail = $data;
				
					$datamember = array(
					   'username' 		=> 	$temp['username'],
					   'detail' 		=> 	json_encode($detail),
					   'type' 		=> 	0,
					   'companyId' 		=> 	$id,
					   'password' 		=> 	((array_key_exists('password',$temp))?$temp['password']:""),
					);
					echo $this->member_model->insert($datamember);
				}
			}
		}
	}
	public function deleteComp(){
		if ($this->uri->segment(3)){
			$this->load->model('employer_model');
			$this->load->model('member_model');
			$company = $this->employer_model->get($this->uri->segment(3)); 
			if (count($company)>0){
				$member = $this->member_model->getCompId($company[0]['id']); 
				$userId = $member[0]['id'];
			}else
				$userId = 0;
				
			echo ($this->employer_model->delete($this->uri->segment(3))&&$this->deleteUserWithId($userId));
		}else{
			show_404('page');			
		}	
	}
	// view certificates
	public function certs(){
		if (!($this->uri->segment(3))){
			show_404('page');
		}else{
			$this->load->model('entry_model');
			if ((99999!=$_SESSION['companyId'])&&($this->entry_model->checkPossess($this->uri->segment(3),$_SESSION['companyId']))){
				show_404('page');
			}else{
				$this->load->model('entry_model');
				//get employee's detail
				$entry = $this->entry_model->get($this->uri->segment(3)); 
				if (count($entry)>0){
					$data['entry']=$entry[0];
					if ($entry[0]['status']==2)
						$data['has1st'] = true;
					else
						$data['has1st'] = false;
				}else{
					$data['entry']=$entry[0];
					$data['has1st'] = false;
				}
				$data['entry']['detail'] = str_replace('\"','"',$data['entry']['detail']);
				$data['entry'] = str_replace("\'",'\u0027',$data['entry']);	
				$data['entry']['detail'] = json_decode($data['entry']['detail'],true);
				// get progress data
				$this->load->model('progress_model');
				$progress = $this->progress_model->getWithEntry($this->uri->segment(3),2); 
				if (count($progress)>0){
					$data['progress'] = $progress;
				}else
					$data['progress'] = array();
				// get final data
				$final = $this->progress_model->getWithEntry($this->uri->segment(3),3); 
				if (count($final)>0){
					$data['final'] = $final;
				}else
					$data['final'] = array();
				$data['redimed'] = true;
				$this->load->view('header');
				$this->load->view('certs',$data);
				$this->load->view('footer');
			}
		}
	}
	function deleteAssess(){
		if ($this->uri->segment(3)){
			$this->load->model('progress_model');
				
			echo ($this->progress_model->delete($this->uri->segment(3)));
		}else{
			show_404('page');			
		}	
	}
	/* Generate PDF */
	public function getPdf(){
		require_once('inc/tcpdf/config/lang/eng.php');
		require_once('inc/tcpdf/tcpdf.php');	
		$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
		if (!($this->uri->segment(3))||!($this->uri->segment(4))){
			show_404('page');
		}else{
			$this->load->model('entry_model');
			if ((99999!=$_SESSION['companyId'])&&($this->entry_model->checkPossess($this->uri->segment(3),$_SESSION['companyId']))){
				show_404('page');
			}else{
				$this->load->model('entry_model');
				// dictionary for listview
				$entry = $this->entry_model->get($this->uri->segment(3)); 
				if (count($entry)>0){
					$data['entry'] = $entry[0];
					$this->load->model('employer_model');
			
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
					//print_r($data);
					// set document information
					$salutation = array('Mr', 'Mrs', 'Ms', 'Miss', 'Master', 'Dr');
					$pdf->SetCreator(PDF_CREATOR);
					$pdf->SetAuthor('REDIMED');
					$pdf->SetTitle('Frist Certificate');
					$pdf->SetSubject('Frist Certificate');
					$pdf->SetKeywords('TCPDF, PDF, certificate');
					
					// set default header data
					//$pdf->SetHeaderData("../report/img/logo.png", PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE.' 006', PDF_HEADER_STRING);
					
					// remove default header/footer
					$pdf->setPrintHeader(false);
					$pdf->setPrintFooter(false);
					
					// set default monospaced font
					$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
					
					//set margins
					$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
					$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
					$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);
					
					//set auto page breaks
					$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);
					
					//set image scale factor
					$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
					
					//set some language-dependent strings
					//$pdf->setLanguageArray($l);
					
					// ---------------------------------------------------------
					$dateType=array("Last week","Last month","Last calendar month","Custom");
					// set font
					$pdf->SetFontSize(8, true);
					// insert to db
					// add a page
					
					//$html = file_get_contents("inc/firstCertTemplate.php");
					// ----------------------------------------------------------------
					// replace value
					// ------------------------------------------------------------------
					//$html = str_replace("#!#REPORT_TITLE#!#", $config['info']['Report title']['value'], $html);
					ini_set('memory_limit', '-1');
					$pdf->AddPage();
					//echo $html;
					if (1==$this->uri->segment(4)){
						if (1==$data['data']['itype']){
							include_once("inc/generalIllness.php");						
						}else{
							include_once("inc/injury_first_cert.php");							
						}
					}
					if (2==$this->uri->segment(4)){
						include_once("inc/injury_progress_cert.php");
					}
					if (3==$this->uri->segment(4)){
						include_once("inc/injury_final_cert.php");
					}
					// reset pointer to the last page
					$pdf->lastPage();
				
					//print_r($data);
					echo $pdf->Output("output/test.pdf", 'I');
				}else{
					show_404('page');			
				}
			}
		}
	}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */