<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Settings extends CI_Controller {

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
		$this->load->model('employer_model');
		
		$company = $this->employer_model->get($_SESSION['companyId']); 
		if (count($company)>0)
			$data['data'] = $company[0];
		else
			$data['data'] = array();
		$data['username'] = $_SESSION['username'];
		//print_r($_SESSION);
		$this->load->view('header');
		$this->load->view('settings',$data);
		$this->load->view('footer');
	}
	public function update(){
		//print_r($_REQUEST);	
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
		   'companyId' 		=> 	$_SESSION['companyId'],
		   'detail' 		=> 	json_encode($data),
		   'type' 		=> 	0,
		);
		//print_r($_SESSION);
		$_SESSION['username'] = $temparray['username'];
		$this->load->model('employer_model');
		$this->load->model('member_model');
		//echo $temparray['username'];
		echo ($this->employer_model->update($_SESSION['companyId'],$data)&&$this->member_model->update($_SESSION['memId'],$datamem));	
	}
	public function succeed(){
		$data['url']= '/telehealth/index.php/settings';
		$this->load->view('header');
		$this->load->view('notification',$data);	
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
)
*/