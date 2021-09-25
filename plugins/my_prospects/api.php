<?php

// Import Librairies
require_once dirname(__FILE__,3) . '/plugins/organizations/api.php';

class my_prospectsAPI extends organizationsAPI {

	public function read($request = null, $data = null){
		if(($data != null)||($data == null)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			$leads = $this->Auth->query('SELECT * FROM `organizations` WHERE `isLead` = ? AND (`assigned_to` = ? OR `assigned_to` LIKE ? OR `assigned_to` LIKE ? OR `assigned_to` LIKE ?)',
				'true',
				$this->Auth->User['id'],
				$this->Auth->User['id'].';%',
				'%;'.$this->Auth->User['id'],
				'%;'.$this->Auth->User['id'].';%'
			)->fetchAll();
			if($leads != null){
				$leads = $leads->all();
				// Init Result
				$result = [];
				foreach($leads as $key => $lead){
					$isProspect = false;
					$calls = $this->Auth->query('SELECT * FROM `calls` WHERE `organization` = ? AND `status` <= ?',
						$lead['id'],
						2
					)->fetchAll();
					if($calls != null){
						$calls = $calls->all();
						foreach($calls as $call){
							if(strtotime($call['date'].' '.$call['time']) <= time()){ $isProspect = true; }
						};
					}
					if($isProspect){$result[$key] = $this->convertToDOM($lead);} else {unset($leads[$key]);}
				}
				$headers = $this->Auth->getHeaders('organizations',true);
				foreach($headers as $key => $header){
					if(!$this->Auth->valid('field',$header,1,'organizations')){
						foreach($leads as $row => $values){
							unset($leads[$row][$header]);
							unset($result[$row][$header]);
						}
						unset($headers[$key]);
					}
				}
				$results = [
					"success" => $this->Language->Field["This request was successfull"],
					"request" => $request,
					"data" => $data,
					"output" => [
						'headers' => $headers,
						'raw' => $leads,
						'results' => $result,
					],
				];
			} else {
				$results = [
					"error" => $this->Language->Field["Unable to complete the request"],
					"request" => $request,
					"data" => $data,
					"output" => [
						"leads" => $leads,
					],
				];
			}
		} else {
			$results = [
				"error" => $this->Language->Field["Unable to complete the request"],
				"request" => $request,
				"data" => $data,
			];
		}
		return $results;
	}
}
