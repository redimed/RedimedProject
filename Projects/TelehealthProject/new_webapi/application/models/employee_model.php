<?php
class Employee_model extends CI_Model {

    var $title   = '';
    var $content = '';
    var $date    = '';
	var $table 	 = 'employees';


    function __construct()
    {
        // Call the Model constructor
        parent::__construct();
		$this->load->database();
    }
    
    function getAll($offset = 0, $limit = 0)
    {
        $this->db->order_by('updatedTime', 'desc');
		if (0==$limit){
			$query = $this->db->get($this->table);
		}else{
			$query = $this->db->get($this->table,$offset,$limit);
		}
        return $query->result_array();
    }
	function getAllComp($compId, $offset = 0, $limit = 0)
    {
        $this->db->order_by('updatedTime', 'desc');
		if (0==$limit){
			$query = $this->db->get_where($this->table, array('employerId' => $compId));
		}else{
			$query = $this->db->get_where($this->table, array('employerId' => $compId),$offset,$limit);
		}
        return $query->result_array();
    }
	function get($id)
    {
		$query = $this->db->get_where($this->table, array('id' => $id));
        return $query->result_array();
    }

    function insert($member)
    {
		$data = array(
			'employerId'		=> $member['employerId'],
		   	'salut'		=> $member['salut'],
			'fname'		=> $member['fname'],
			'gname'		=> $member['gname'],
			'nok'		=> $member['nok'],
			'kfone'		=> $member['kfone'],
			'hfone'		=> $member['hfone'],
			'wfone'		=> $member['wfone'],
			'mfone'		=> $member['mfone'],
			'address'	=> $member['address'],
			'suburb'	=> $member['suburb'],
			'postcode'	=> $member['postcode'],
			'dob' 		=> $member['dob'],
		);
		
		$this->db->set('createdTime', 'NOW()', FALSE);
		$this->db->set('updatedTime', 'NOW()', FALSE);
        $this->db->insert($this->table, $data);
    }

    function update($id,$member)
    {
        $data = array(
			'employerId'		=> $member['employerId'],
		   	'salut'		=> $member['salut'],
			'fname'		=> $member['fname'],
			'gname'		=> $member['gname'],
			'nok'		=> $member['nok'],
			'kfone'		=> $member['kfone'],
			'hfone'		=> $member['hfone'],
			'wfone'		=> $member['wfone'],
			'mfone'		=> $member['mfone'],
			'address'	=> $member['address'],
			'suburb'	=> $member['suburb'],
			'postcode'	=> $member['postcode'],
			'dob' 		=> $member['dob'],
		);
		
		$this->db->set('updatedTime', 'NOW()', FALSE);
        $this->db->update($this->table, $data, array('ID' => $id));
    }
	function delete($id){
		$query = "SELECT * FROM entries WHERE employeeId=".$id;
		$entries = $this->db->query($query);
		foreach ($entries->result_object() as $key=> $entry){
			//print_r($entry);
			$querydelete = "DELETE FROM progressAssessment WHERE entryId = ".$entry->id;
			$this->db->query($query);
		}
		$query = "DELETE FROM entries WHERE employeeId = ".$id;
		$result = $this->db->query($query);
		$query = "DELETE FROM employees WHERE id = ".$id;
		$result = $this->db->query($query);
		//echo $this->db->last_query();
		return $result;
	}
	function checkPossess($employeeId,$compId)
    {
		$entry = $this->get($employeeId);
        if (count($entry)>0)
			if ($compId == $entry[0]['employerId'])
				return false;
			else
				return true;
		else
			return true;
    }
	function checkExist($member){
		$query = $this->db->get_where($this->table, array('fname' => $member['fname'], 'gname' => $member['gname'], 'dob' => $member['dob'], ));
        $employee = $query->result_array();
		if (count($employee)>0)
			return $employee[0]['id'];
		else
			return 0;
	}
	
}
?>