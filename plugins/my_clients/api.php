<?php

// Import Librairies
require_once dirname(__FILE__,3) . '/plugins/organizations/api.php';

class my_clientsAPI extends organizationsAPI {

	public function read($request = null, $data = null){
		if(($data != null)||($data == null)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			$clients = $this->Auth->query('SELECT * FROM `organizations` WHERE `isClient` = ? AND (`assigned_to` = ? OR `assigned_to` LIKE ? OR `assigned_to` LIKE ? OR `assigned_to` LIKE ?)',
				'true',
				$this->Auth->User['id'],
				$this->Auth->User['id'].';%',
				'%;'.$this->Auth->User['id'],
				'%;'.$this->Auth->User['id'].';%'
			)->fetchAll();
			if($clients != null){
				$clients = $clients->all();
				// Init Result
				$result = [];
				foreach($clients as $key => $client){ $result[$key] = $this->convertToDOM($client); }
				$headers = $this->Auth->getHeaders('organizations',true);
				foreach($headers as $key => $header){
					if(!$this->Auth->valid('field',$header,1,'organizations')){
						foreach($clients as $row => $values){
							unset($clients[$row][$header]);
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
						'raw' => $clients,
						'results' => $result,
					],
				];
			} else {
				$results = [
					"error" => $this->Language->Field["Unable to complete the request"],
					"request" => $request,
					"data" => $data,
					"output" => [
						"leads" => $clients,
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
