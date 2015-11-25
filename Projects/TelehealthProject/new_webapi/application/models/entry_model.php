<?php
class Entry_model extends CI_Model {

    var $title   = '';
    var $content = '';
    var $date    = '';
	var $entries_table 	 = 'entries';


    function __construct()
    {
        // Call the Model constructor
        parent::__construct();
		$this->load->database();
    }
    
    function getAllComp($compId, $offset = 0, $limit = 0)
    {
		$this->db->order_by('updatedTime', 'desc');
        if (0==$limit){
			$query = $this->db->get_where($this->entries_table, array('employerId' => $compId));
		}else{
			$query = $this->db->get_where($this->entries_table, array('employerId' => $compId),$offset,$limit);
		}
        return $query->result_array();
    }
	
	function getAllEmployee($empId, $offset = 0, $limit = 0)
    {
        $this->db->order_by('updatedTime', 'desc');
		if (0==$limit){
			$query = $this->db->get_where($this->entries_table, array('employeeId' => $empId));
		}else{
			$query = $this->db->get_where($this->entries_table, array('employeeId' => $empId),$offset,$limit);
		}
        return $query->result_array();
    }
	function getAllEmployeeSimple($empId, $offset = 0, $limit = 0)
    {
		$this->db->order_by('updatedTime', 'desc');
		$this->db->select('id,status');
        if (0==$limit){
			$query = $this->db->get_where($this->entries_table, array('employeeId' => $empId));
		}else{
			$query = $this->db->get_where($this->entries_table, array('employeeId' => $empId),$offset,$limit);
		}
        return $query->result_array();
    }
	
	function getAll( $offset = 0, $limit = 0)
    {
       $this->db->order_by('updatedTime', 'desc');
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
	
	function checkPossess($entryId,$compId)
    {
		$entry = $this->get($entryId);
        if (count($entry)>0)
			if ($compId == $entry[0]['employerId'])
				return false;
			else
				return true;
		else
			return true;
    }

    function insert($data)
    {
        $data = array(
		   'employerId' 	=> 	$data['employerId'],
		   'employeeId' 	=> 	$data['employeeId'],
		   'detail' 		=> 	$data['detail'],
		   'images' 		=> 	$data['images'],
		   'authen' 		=> 	$data['authen'],
		   'status' 		=> 	$data['status'],
		);
		$this->db->set('createdTime', 'NOW()', FALSE);
		$this->db->set('updatedTime', 'NOW()', FALSE);
        return $this->db->insert($this->entries_table, $data);
    }

    function update($id,$data)
    {
        $data = array(
		   'employerId' 	=> 	$data['employerId'],
		   'employeeId' 	=> 	$data['employeeId'],
		   'detail' 		=> 	$data['detail'],
		   'images' 		=> 	$data['images'],
		   'authen' 		=> 	$data['authen'],
		   'status' 		=> 	$data['status'],
		);
		$this->db->set('updatedTime', 'NOW()', FALSE);
        return $this->db->update($this->entries_table, $data, array('id' => $id));
    }
	function flagError($id)
    {
        $data = array(
		   'status' 		=> 	999,
		);
		$this->db->set('updatedTime', 'NOW()', FALSE);
        return $this->db->update($this->entries_table, $data, array('id' => $id));
    }
	function addMoreDetail($id,$detail,&$entry_data,&$employer)
    {
        $entry = $this->get($id);
        if (count($entry)>0){
			$json = $entry[0]['detail'];
			preg_match('#^data:[\w/]+(;[\w=]+)*,[\w+/=%]+$#', $json);
			//get employer
			$this->load->model('employer_model', '', true); 
			$company = $this->employer_model->get($entry[0]['employerId']); 
			if (count($company)>0)
				$employer = $company[0];
			//echo urldecode($json).'<br>';
			$entry[0]['detail'] = json_decode($json,true);
			$entry_data = $entry[0]['detail'];
			$temp = str_replace('\"','"',$detail);
			$temp = str_replace("\'",'\u0027',$temp);
			$requests = json_decode($temp,true);
			$requests['date'] =  date("d/m/Y H:i");
			$entry[0]['detail']['requestProgress'][] = $requests;
		}
		$data = array(
		   'detail' 		=> 	json_encode($entry[0]['detail']),
		);
		$this->db->set('updatedTime', 'NOW()', FALSE);
        if ($this->db->update($this->entries_table, $data, array('id' => $id)))
			return 1;
		else
			return 0;
    }
	
	function delete($id){
		return $this->db->delete($this->entries_table, array('id' => $id)); 
	}

}
?>