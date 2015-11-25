<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Member_model extends CI_Model {

    var $title   = '';
    var $content = '';
    var $date    = '';
	var $entries_table 	 = 'members';


    function __construct()
    {
        // Call the Model constructor
        parent::__construct();
		$this->load->database();
    }
    
    function getAll($offset = 0, $limit = 0)
    {
        $this->db->order_by('username', 'asc');
		if (0==$limit){
			$query = $this->db->get($this->entries_table);
		}else{
			$query = $this->db->get($this->entries_table,$offset,$limit);
		}
        return $query->result_array();
    }
	function getAllRedimed($offset = 0, $limit = 0)
    {
		$this->db->order_by('username', 'asc');
        if (0==$limit){
			$query = $this->db->get_where($this->entries_table, array('companyId' => '99999'));
		}else{
			$query = $this->db->get_where($this->entries_table, array('companyId' => '99999'),$offset,$limit);
		}
        return $query->result_array();
    }
	function getAllRedimedSimple($offset = 0, $limit = 0)
    {
		$this->db->order_by('username', 'asc');
		$this->db->select('id, companyId, username,email,deviceId,password, lastlogin, createdTime, updatedTime, type');
        if (0==$limit){
			$query = $this->db->get_where($this->entries_table, array('companyId' => '99999'));
		}else{
			$query = $this->db->get_where($this->entries_table, array('companyId' => '99999'),$offset,$limit);
		}
        return $query->result_array();
    }
	
	function get($id)
    {
		$query = $this->db->get_where($this->entries_table, array('ID' => $id));
        return $query->result_array();
    }
	function getName($id)
    {
		$query = $this->db->get_where($this->entries_table, array('username' => $id));
        return $query->result_array();
    }
	function getCompId($id)
    {
		$query = $this->db->get_where($this->entries_table, array('companyId' => $id));
        return $query->result_array();
    }
	function getCompIdSimple($id)
    {
		$this->db->select('id, companyId, username,password,email, lastlogin, createdTime, updatedTime, type, detailEmployer');
		$query = $this->db->get_where($this->entries_table, array('companyId' => $id));
        return $query->result_array();
    }
	function hashPwd($password){
		$hash = md5(substr(md5('deliciously-salty-'.$password),10));
		return $hash;
	}
    function insert($data)
    {
        $data = array(
		   'username' 		=> 	$data['username'],
		   'companyId' 		=> 	$data['companyId'],
		   'detail' 		=> 	$data['detail'],
		   'type' 		=> 	$data['type'],
		   'email' 		=> 	$data['email'],
		   'deviceId' 		=> 	$data['deviceId'],
		   'password' 	=> 	$this->hashPwd($data['password']),
		);
		$this->db->set('lastlogin', 'NOW()', FALSE);
		$this->db->set('createdTime', 'NOW()', FALSE);
		$this->db->set('updatedTime', 'NOW()', FALSE);
        return $this->db->insert($this->entries_table, $data);
    }

    function update($id,$data)
    {
		
        $data = array(
		   'username' 		=> 	$data['username'],
		   'companyId' 		=> 	$data['companyId'],
		   'detail' 		=> 	$data['detail'],
		   'email' 		=> 	$data['email'],
		   'type' 		=> 	$data['type'],
            'detailEmployer' => $data['detailEmployer'],
		);
		//echo $data;
		$this->db->set('lastlogin', 'NOW()', FALSE);
		$this->db->set('updatedTime', 'NOW()', FALSE);
		
        return $this->db->update($this->entries_table, $data, array('id' => $id));
    }
	
	function updateCompUser($id,$data)
    {
		
        $data2 = array(
		   'username' 		=> 	$data['username'],
		   'companyId' 		=> 	$data['companyId'],
		   'detail' 		=> 	$data['detail'],
		   'type' 		=> 	$data['type'],
		   'email' 		=> 	$data['email'],
		   'deviceId' 		=> 	$data['deviceId'],
		);
		//echo $data;
		$this->db->set('lastlogin', 'NOW()', FALSE);
		$this->db->set('updatedTime', 'NOW()', FALSE);
		//print_r($data2);
        return $this->db->update($this->entries_table, $data2, array('companyId' => $id));
    }
	
	function changePwd($username,$pwd){
		$data = array(
		   'password' 	=> 	$this->hashPwd($pwd),
		);
		$this->db->set('lastlogin', 'NOW()', FALSE);
		$this->db->set('updatedTime', 'NOW()', FALSE);
        return $this->db->update($this->entries_table, $data, array('username' => $username));	
	}
	function changePwdId($id,$pwd){
		$data = array(
		   'password' 	=> 	$this->hashPwd($pwd),
		);
		$this->db->set('lastlogin', 'NOW()', FALSE);
		$this->db->set('updatedTime', 'NOW()', FALSE);
        return $this->db->update($this->entries_table, $data, array('id' => $id));	
	}
	function updateDeviceId($id,$deviceId){
		$data = array(
		   'deviceId' 	=> 	$deviceId,
		);
		$this->db->set('updatedTime', 'NOW()', FALSE);
        return $this->db->update($this->entries_table, $data, array('id' => $id));	
	}
	function delete($id){
		return $this->db->delete($this->entries_table, array('id' => $id)); 
	}
	function authenticate($username, $password){
	//var_dump($company);exit;
		$query = $this->db->get_where($this->entries_table, array('username' => $username));
        $company = $query->result_array();	
		
		//print_r($company);
		//echo "<br>".$this->hashPwd($password);
		if (count($company)>0)
			if ($this->hashPwd($password) == $company[0]['password'])
				return true;
			else	
				return false;
		else
			return false;
	}
	function authenticateId($id, $password){
		$query = $this->db->get_where($this->entries_table, array('id' => $id));
        $company = $query->result_array();	
		//print_r($company);
		//echo "<br>".$this->hashPwd($password);
		if (count($company)>0)
			if ($this->hashPwd($password) == $company[0]['password']){
				//echo 'test';
				return true;
			}else	
				return false;
		else
			return false;
	}

}
?>