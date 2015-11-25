<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Results extends CI_Controller {

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
		$this->load->model('employee_model');
		// dictionary for listview
		$employees = $this->employee_model->getAllComp($_SESSION['companyId']); 
		//echo $_SESSION['companyId'];
		//echo count($names['A']);
		//echo "<br>".count($names['F']);
		//print_r($names);
		$data['results'] = $employees;
		$this->load->view('header');
		$this->load->view('employees',$data);
		$this->load->view('footer');
	}
	public function detail(){
		//get employer's details
		if (!($this->uri->segment(3))){
			show_404('page');
		}else{
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
			//echo $this->entry_model->checkPossess($entryId,$_SESSION['companyId']);
			if ($this->entry_model->checkPossess($entryId,$_SESSION['companyId'])){
				//show_404('page');
			}else{
				$this->load->model('employer_model');
				$company = $this->employer_model->get($_SESSION['companyId']); 
				if (count($company)>0)
					$data['employer'] = $company[0];
				else
					$data['employer'] = array();
					
				$this->load->model('entry_model');
				//get employee's detail
				$entry = $this->entry_model->get($entryId); 
				if (count($entry)>0)
					$data['formdata'] = $entry[0];
				else
					$data['formdata'] = array();
					
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
				$this->load->view('results',$data);
				$this->load->view('footer');
			}
		}
	}
	
	public function certs(){
		if (!($this->uri->segment(3))){
			show_404('page');
		}else{
			$this->load->model('entry_model');
			if (($this->entry_model->checkPossess($this->uri->segment(3),$_SESSION['companyId']))){
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
				$data['redimed'] = false;
				$this->load->view('header');
				$this->load->view('certs',$data);
				$this->load->view('footer');
			}
		}
	}
	public function delete(){
		if (!($this->uri->segment(3))){
			show_404('page');
		}else{
			$this->load->model('entry_model');
			if ($this->entry_model->checkPossess($this->uri->segment(3),$_SESSION['companyId'])){
				show_404('page');
			}else{
				$this->load->model('entry_model');
				echo $this->entry_model->delete($this->uri->segment(3));
			}
		}
	}
	
	public function function_popup(){	
		$data['id'] = $this->uri->segment(3);
		$this->load->view('header');
		$this->load->view('functions_popup',$data);
		$this->load->view('footer');
	}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
/*
Array
(
    [relation] => 1
    [salut] => 4
    [fname] => 
    [gname] => 
    [dob] => 
    [address] => 
    [suburb] => 
    [postcode] => 
    [hfone] => 
    [mfone] => 
    [wfone] => 
    [nok] => 
    [Kfone] => 
    [PHI] => no
    [HC] => no
    [healFund] => 
    [memno] => 
    [medicareno] => 
    [posno] => 
    [expiry] => 
    [vano] => 
    [cholder] => 1
    [adate] => 
    [alocation] => 
    [reason] => 
    [injdesctxt] => 
    [bdyparttxt] => 
    [mhistorytxt] => 
    [medications] => 
    [allergies] => 
    [slider] => 5
    [gillnesstxt] => 
    [__utma] => 251400474.536973373.1317913469.1337070243.1341314044.13
    [__utmz] => 251400474.1333470302.7.2.utmcsr=facebook.com|utmccn=(referral)|utmcmd=referral|utmcct=/l.php
    [wp-settings-1] => m8=c&m6=c&m5=c&m7=c&m0=o&m3=c&editor=tinymce&m9=o&align=center&imgsize=full&m4=c&hidetb=1&uploader=1&m11=c&m2=c&m1=o&m12=o
    [wp-settings-time-1] => 1321986747
    [__utmc] => 251400474
    [cprelogin] => no
    [cpsession] => :MlzzA8ktKqYgcpkBasZfDx2cMhB16ra0u2bTBt6Pnnqb3GiTRKzWxriaNoncmZU6
	[itype] => 1
)
*/