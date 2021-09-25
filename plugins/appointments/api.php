<?php
class appointmentsAPI extends CRUDAPI {
	public function create($request = null, $data = null){
		$results = parent::create($request, $data);
		if((isset($results['success'],$results['output']['raw']['assigned_to']))&&($results['output']['raw']['assigned_to'] != '')){
			parent::create('notifications',[
				'icon' => 'icon icon-appointments mr-2',
				'subject' => 'You have a new appointment',
				'dissmissed' => 1,
				'user' => $results['output']['raw']['assigned_to'],
				'href' => '?p=appointments&v=details&id='.$results['output']['raw']['id'],
			]);
		}
		return $results;
	}
	public function delete($request = null, $data = null){
		if(!is_array($data)){ $data = json_decode($data, true); }
		$results = parent::delete($request, $data);
		$notes = $this->Auth->read('notes',$data['id'],'link_to');
		if($notes != null){ foreach($notes->all() as $note){ if($note['relationship'] == 'appointments'){ $this->Auth->delete('notes',$note['id']); } } }
		return $results;
	}
}
