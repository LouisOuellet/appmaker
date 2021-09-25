<?php
class my_containersAPI extends containersAPI {
	public function create($request = null, $data = null){
		if($data != null){
			if(!is_array($data)){ $data = json_decode($data, true); }
			if(!isset($data['client'])){ $data['client'] = $this->Auth->User['client']; }
			return parent::create('containers', $data);
		}
	}
	public function read($request = null, $data = null){
		if($data != null){
			if(!is_array($data)){ $data = json_decode($data, true); }
			if(!isset($data['client'])){ $data['client'] = $this->Auth->User['client']; }
			// Fetch Assigned Clients
			$clients = $this->Auth->query('SELECT * FROM `clients` WHERE `assigned_to` = ? OR `assigned_to` LIKE ? OR `assigned_to` LIKE ? OR `assigned_to` LIKE ?',
				$this->Auth->User['id'],
				$this->Auth->User['id'].';%',
				'%;'.$this->Auth->User['id'],
				'%;'.$this->Auth->User['id'].';%'
			)->fetchAll();
			if($clients != null){ $clients = $clients->all(); }
			// Init Containers
			$containers = [];
			// Init Relationships
			$relationships = [];
			// Init Parameters
			$parameters = [];
			// Fetch Relationships
			$statement = 'SELECT * FROM `relationships` WHERE ';
			$statement .= '(`relationship_1` = ? AND `link_to_1` = ? AND (`relationship_2` = ? OR `relationship_3` = ?))';
			$statement .= ' OR ';
			$statement .= '(`relationship_2` = ? AND `link_to_2` = ? AND (`relationship_1` = ? OR `relationship_3` = ?))';
			$statement .= ' OR ';
			$statement .= '(`relationship_3` = ? AND `link_to_3` = ? AND (`relationship_2` = ? OR `relationship_1` = ?))';
			$parameters = [
				'users',$this->Auth->User['id'],'containers','containers',
				'users',$this->Auth->User['id'],'containers','containers',
				'users',$this->Auth->User['id'],'containers','containers',
			];
			if(($data['client'] != '')&&(!empty($data['client']))){
				$statement .= ' OR ';
				$statement .= '(`relationship_1` = ? AND `link_to_1` = ? AND (`relationship_2` = ? OR `relationship_3` = ?))';
				$statement .= ' OR ';
				$statement .= '(`relationship_2` = ? AND `link_to_2` = ? AND (`relationship_1` = ? OR `relationship_3` = ?))';
				$statement .= ' OR ';
				$statement .= '(`relationship_3` = ? AND `link_to_3` = ? AND (`relationship_2` = ? OR `relationship_1` = ?))';
				array_push($parameters,
					'clients',$data['client'],'containers','containers',
					'clients',$data['client'],'containers','containers',
					'clients',$data['client'],'containers','containers'
				);
			}
			if($clients != null){
				foreach($clients as $client){
					$statement .= ' OR ';
					$statement .= '(`relationship_1` = ? AND `link_to_1` = ? AND (`relationship_2` = ? OR `relationship_3` = ?))';
					$statement .= ' OR ';
					$statement .= '(`relationship_2` = ? AND `link_to_2` = ? AND (`relationship_1` = ? OR `relationship_3` = ?))';
					$statement .= ' OR ';
					$statement .= '(`relationship_3` = ? AND `link_to_3` = ? AND (`relationship_2` = ? OR `relationship_1` = ?))';
					array_push($parameters,
						'clients',$client['id'],'containers','containers',
						'clients',$client['id'],'containers','containers',
						'clients',$client['id'],'containers','containers'
					);
				}
			}
			$relations = $this->Auth->query($statement,$parameters)->fetchAll();
			// Creating Relationships Array
			if($relations != null){
				$relations = $relations->all();
				foreach($relations as $relation){
					$relationships[$relation['id']] = [];
					if($relation['relationship_1'] == 'containers'){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_1'],'link_to' => $relation['link_to_1'],'created' => $relation['created']]); }
					if($relation['relationship_2'] == 'containers'){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_2'],'link_to' => $relation['link_to_2'],'created' => $relation['created']]); }
					if($relation['relationship_3'] == 'containers'){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_3'],'link_to' => $relation['link_to_3'],'created' => $relation['created']]); }
				}
			}
			foreach($relationships as $relations){
				foreach($relations as $relation){
					if(!isset($containers[$relation['link_to']])){
						$container = $this->Auth->read('containers', $relation['link_to']);
						if($container != null){
							$container = $container->all()[0];
							if($container['active'] == 'true'){ $containers[$container['id']] = $container; }
						}
					}
				}
			}
			// Init Array
			$raw = [];
			foreach($containers as $id => $container){
				if(!$this->Auth->valid('custom','containers_charges',1)){
					unset($container['charge_to_other']);
					unset($container['charge_to_shipper']);
				}
				unset($container['active']);
				array_push($raw,$container);
			}
			// Format Array
			// Init Results
			$results = [];
			// Format Results
			foreach($raw as $row => $result){
				if(!$this->Auth->valid('custom','containers_charges',1)){
					unset($raw[$row]['charge_to_other']);
					unset($raw[$row]['charge_to_shipper']);
				}
				unset($raw[$row]['active']);
				$results[$row] = $this->convertToDOM($raw[$row]);
			}
			if(($raw != null)&&(!empty($raw))){
				// Fetch Headers
				$headers = $this->Auth->getHeaders('containers');
				// Remove columns
				if(!$this->Auth->valid('custom','containers_charges',1)){
					unset($headers[array_search('charge_to_other', $headers)]);
					unset($headers[array_search('charge_to_shipper', $headers)]);
				}
				unset($headers[array_search('active', $headers)]);
				// Return
				return [
					"success" => $this->Language->Field["This request was successfull"],
					"request" => $request,
					"data" => $data,
					"output" => [
						'headers' => $headers,
						'raw' => $raw,
						'results' => $results,
						"relationships" => $relationships,
						"containers" => $containers,
					],
				];
			} else {
				return [
					"success" => $this->Language->Field["This request was successfull"],
					"request" => $request,
					"data" => $data,
					"output" => [
						'headers' => $this->Auth->getHeaders('containers'),
						'raw' => $raw,
						'results' => $results,
						"relationships" => $relationships,
						"containers" => $containers,
					]
				];
			}
		} else {
			return [
				"error" => $this->Language->Field["Unable to complete the request"],
				"request" => $request,
				"data" => $data,
			];
		}
	}
}
