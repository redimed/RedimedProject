<?php
class Progress_model extends CI_Model {

    var $title   = '';
    var $content = '';
    var $date    = '';
	var $entries_table 	 = 'progressAssessment';


    function __construct()
    {
        // Call the Model constructor
        parent::__construct();
		$this->load->database();
    }
	
	function get($id)
    {
		$query = $this->db->get_where($this->entries_table, array('id' => $id));
        return $query->result_array();
    }
	
	function getAllEntries($id){
		$query = $this->db->get_where($this->entries_table, array('entryId'=>$id));
		return $query->result_array();
	}
	
	function getWithEntry($id,$type)
    {
		$query = $this->db->get_where($this->entries_table, array('entryId' => $id, 'type'=>$type));
        return $query->result_array();
    }
	function getWithEntryLatest($id,$type)
    {
		$this->db->order_by('updatedTime','DESC');
		$this->db->limit(1);
		$query = $this->db->get_where($this->entries_table, array('entryId' => $id, 'type'=>$type));
        return $query->result_array();
    }
    function insert($data)
    {
        $data = array(
		   'entryId' 	=> 	$data['entryId'],
		   'detail' 		=> 	$data['detail'],
		   'type' 		=> 	$data['type'],
		);
		$this->db->set('createdTime', 'NOW()', FALSE);
		$this->db->set('updatedTime', 'NOW()', FALSE);
        return $this->db->insert($this->entries_table, $data);
    }

    function update($id,$data)
    {
        $data = array(
		   'entryId' 	=> 	$data['entryId'],
		   'detail' 		=> 	$data['detail'],
		   'type' 		=> 	$data['type'],
		);
		$this->db->set('updatedTime', 'NOW()', FALSE);
        return $this->db->update($this->entries_table, $data, array('id' => $id));
    }
	
	function delete($id){
		return $this->db->delete($this->entries_table, array('id' => $id)); 
	}
	function deleteWithEntryId($id){
		return $this->db->delete($this->entries_table, array('entryId' => $id)); 
	}
	
}
?>