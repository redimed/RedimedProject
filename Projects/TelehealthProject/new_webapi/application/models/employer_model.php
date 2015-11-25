<?php
class Employer_model extends CI_Model {

    var $title   = '';
    var $content = '';
    var $date    = '';
	var $entries_table 	 = 'employers';


    function __construct()
    {
        // Call the Model constructor
        parent::__construct();
		$this->load->database();
    }
    
    function getAll($offset = 0, $limit = 0)
    {
		//$this->db->where('name !=', $name);
        $this->db->order_by('name', 'asc');
		if (0==$limit){
			$query = $this->db->get($this->entries_table);
		}else{
			$query = $this->db->get($this->entries_table,$offset,$limit);
		}
        return $query->result_array();
    }
	function getAllButRedimed($offset = 0, $limit = 0)
    {
		$this->db->where('id !=', '99999');
        $this->db->order_by('name', 'asc');
		if (0==$limit){
			$query = $this->db->get($this->entries_table);
		}else{
			$query = $this->db->get($this->entries_table,$offset,$limit);
		}
        return $query->result_array();
    }
	
	function get($id)
    {
		$query = $this->db->get_where($this->entries_table, array('ID' => $id));
        return $query->result_array();
    }
    function insert($data)
    {
        $data = array(
		   'name' 		=> 	$data['name'],
		   'code' 		=> 	$data['code'],
		   'IMA' 		=> 	$data['IMA'],
		   'insurer' 	=> 	$data['insurer'],
		   'email' 		=> 	$data['email'],
		   'phone' 		=> 	$data['phone'],
		   'address' 	=> 	$data['address'],
		   'smedic' 		=> 	$data['smedic'],
		   'sname' 		=> 	$data['sname'],
		   'smphone' 	=> 	$data['smphone'],
		   'lastip' 	=> 	$data['lastip'],
		   'detailEmployer' => $data['detailEmployer'],
		);
		$this->db->set('lastlogin', 'NOW()', FALSE);
		$this->db->set('createdTime', 'NOW()', FALSE);
		$this->db->set('updatedTime', 'NOW()', FALSE);
        $this->db->insert($this->entries_table, $data);
		
		return mysql_insert_id();

    }

    function update($id,$data)
    {
        $data = array(
		   'name' 		=> 	$data['name'],
		   'code' 		=> 	$data['code'],
		   'IMA' 		=> 	$data['IMA'],
		   'insurer' 	=> 	$data['insurer'],
		   'email' 		=> 	$data['email'],
		   'phone' 		=> 	$data['phone'],
		   'address' 	=> 	$data['address'],
		    'smedic' 		=> 	$data['smedic'],
		   'sname' 		=> 	$data['sname'],
		   'smphone' 	=> 	$data['smphone'],
		   'lastip' 	=> 	$data['lastip'],
            'detailEmployer' => $data['detailEmployer'],
		);
		$this->db->set('updatedTime', 'NOW()', FALSE);
        return $this->db->update($this->entries_table, $data, array('id' => $id));
    }
	function add2SMS($str)
    {
        $data = array(
		   'sms' 		=> 	$str,
		);
		$this->db->set('updatedTime', 'NOW()', FALSE);
        return $this->db->update($this->entries_table, $data, array('id' => 99999));
    }
	
	function delete($id){
		return $this->db->delete($this->entries_table, array('id' => $id)); 
	}

}
?>