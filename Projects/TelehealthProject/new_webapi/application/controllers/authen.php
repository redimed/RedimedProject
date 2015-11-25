<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Authen extends CI_Controller {

	public function __construct()
    {
        parent::__construct();
        session_start();
		header("Cache-Control: no-cache");
		 header("Pragma: no-cache");
	
		//echo 1232123213213213;exit;

    }
	public function index()
	{
		if (isset($_REQUEST['url'])) 
			$data['url'] = $_REQUEST['url'];
		else
			$data['url'] = "/telehealth";
		$this->load->view('header');
		$this->load->view('login',$data);
		$this->load->view('footer');
	}


	
    public function login()
    {
        $this->load->view('header');
		$this->load->view('login');
		$this->load->view('footer');
    }

	
	public function vuong_authenticate(){
		$token = $this->security->get_csrf_hash();
		
		$this->load->model("member_model");
		//$params = file_get_contents("php://input");
		//$params = json_decode($params);
		
		if ($this->member_model->authenticate($this->input->post('username'), $this->input->post('password')))
		//if (('admin' == $_REQUEST['username'])&&('testtest' == $_REQUEST['password']))
        {
            $_SESSION['loggedin']= 	true;
			$_SESSION['username']=  $this->input->post('username');
			$this->load->helper('cookie');
			$member = $this->member_model->getName($this->input->post('username')); 
			if (count($member)>0){
				$_SESSION['companyId']=  $member[0]['companyId'];	
				$_SESSION['type']=  $member[0]['type'];
				$_SESSION['memId']=  $member[0]['id'];
				$_SESSION['sessionid'] = $token;
			}
			if (isset($_REQUEST['deviceId']))
				$this->member_model->updateDeviceId($_SESSION['memId'],$_REQUEST['deviceId']);	
			header("Content-type: application/json");
			echo json_encode(array("companyId"=>$_SESSION["companyId"], "username"=>$this->input->post('username'), "memId"=>$_SESSION['memId'], "type"=>$_SESSION["type"], "message"=>"OK", "token"=>$_SESSION['sessionid']));
        }else{
			header("Content-type: application/json");
			echo json_encode(array("message"=>"failed"));
		}
	}

    public function authenticate()
    {
		 header('Access-Control-Allow-Origin: *');
		header('Access-Control-Allow-Methods: GET, POST');  
        $this->load->model('member_model');
		
		//var_dump($_POST);
        if ($this->member_model->authenticate($this->input->post('username'), $this->input->post('password')))
		//if (('admin' == $_REQUEST['username'])&&('testtest' == $_REQUEST['password']))
        {
            $_SESSION['loggedin']= 	true;
			$_SESSION['username']=  $_REQUEST['username'];
			
			$member = $this->member_model->getName($_REQUEST['username']); 
			
			if (count($member)>0){
				$_SESSION['companyId']=  $member[0]['companyId'];	
				$_SESSION['type']=  $member[0]['type'];	
				$_SESSION['memId']=  $member[0]['id'];	
			}
			if (isset($_REQUEST['deviceId']))
				$this->member_model->updateDeviceId($_SESSION['memId'],$_REQUEST['deviceId']);	
			echo $_SESSION['companyId']."##".$_SESSION['memId']."##".$_SESSION['type'];
        }else{
			echo 0;
		}
        
    }
	public function changePwd(){
		// TOKEN
		$token = isset($_REQUEST["token"])?$_REQUEST["token"]:0;

		if((isset($token) && $token !== $_SESSION["sessionid"])){
			show_404();
		}
		
		$this->load->model('member_model', '', true);
		if ($this->member_model->authenticate($_SESSION['username'], $this->input->post('cpwd'))){
			$this->member_model->changePwd($_SESSION['username'], $this->input->post('npwd'));
			echo 1;
		}else{
			echo 0;
		}
	
		// END TOKEN
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
			$this->load->model('member_model', '', true);
			if ($this->member_model->authenticate($_SESSION['username'], $this->input->post('cpwd'))){
				$this->member_model->changePwd($_SESSION['username'], $this->input->post('npwd'));
				echo 1;
			}else{
				echo 0;
			}
		}
	}
    public function logout()
    {
        session_destroy();
        header('Location: /telehealth');
    }
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */