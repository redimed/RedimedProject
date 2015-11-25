<?php
class Notification_model extends CI_Model {

    var $title   = '';
    var $content = '';
    var $date    = '';
	var $entries_table 	 = 'notifications';


    function __construct()
    {
        // Call the Model constructor
        parent::__construct();
		$this->load->database();
    }
	
	function getAll( $offset = 0, $limit = 0)
    {
		
		//$this->db->where('status', '0');
        $this->db->order_by('createdTime', 'desc');
		if (0==$limit){
			$this->db->limit(20, 0);
			$query = $this->db->get($this->entries_table);
		}else{
			$query = $this->db->get($this->entries_table,$offset,$limit);
		}
        return $query->result_array();
    }
	function getAllActive()
    {
       	$this->db->order_by('createdTime', 'desc');
		
		$this->db->from($this->entries_table);
		$this->db->where('status', '0');
		return $this->db->count_all_results();
    }
	
	function get($id)
    {
		$query = $this->db->get_where($this->entries_table, array('ID' => $id));
        return $query->result_array();
    }
	
    function insert($data)
    {
        $data = array(
		   'patient' 	=> 	$data['patient'],
		   'email' 	=> 	$data['email'],
		   'status' 		=> 	$data['status'],
		);
		$this->db->set('createdTime', 'NOW()', FALSE);
		$this->db->set('updatedTime', 'NOW()', FALSE);
        return $this->db->insert($this->entries_table, $data);
    }

    function update($id,$data)
    {
        $data = array(
		   'patient' 	=> 	$data['patient'],
		   'email' 	=> 	$data['email'],
		   'status' 		=> 	$data['status'],
		);
		$this->db->set('updatedTime', 'NOW()', FALSE);
        return $this->db->update($this->entries_table, $data, array('id' => $id));
    }
	function updateStatus($id,$status)
    {
        $data = array(
		   'status' 		=> 	$status,
		);
		$this->db->set('updatedTime', 'NOW()', FALSE);
        return $this->db->update($this->entries_table, $data, array('id' => $id));
    }

}
?>