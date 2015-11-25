<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Dashboard extends CI_Controller {

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
		header("Cache-Control: no-cache");
 		header("Pragma: no-cache");
    }
	
	public function index()
	{	
		$data['companyId'] = $_SESSION['companyId'];
		$data['type'] = $_SESSION['type'];
		$output  = $this->load->view('header', '', true);
		$output .= $this->load->view('home', $data, true);
		$output .= $this->load->view('footer', '', true);
		print_r($_SESSION);
		$this->output->set_output($output);
	}
}

