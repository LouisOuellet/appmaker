<?php
class permissionsAPI extends CRUDAPI {
	public function fix(){
		$this->Auth->setLimit(0);
		$permissions = $this->Auth->read('permissions')->all();
		foreach($permissions as $key => $permission){
			if($permission['isLocked'] != 'true'){ $permission['isLocked'] = 'false'; }
			if($permission['table'] == ''){ $permission['table'] = null; }
			$this->Auth->update('permissions',$this->convertToDB($permission),$permission['id']);
		}
		return ["success" => $this->Language->Field["Records successfully fixed"]];
	}
	public function read($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			$this->Auth->setLimit(0);
			if((isset($data['options'],$data['options']['link_to'],$data['options']['plugin'],$data['options']['view']))&&(!empty($data['options']))){
				$filters = $this->Auth->query(
					'SELECT * FROM options WHERE user = ? AND type = ? AND link_to = ? AND plugin = ? AND view = ? AND record = ?',
					$this->Auth->User['id'],
					'filter',
					$data['options']['link_to'],
					$data['options']['plugin'],
					$data['options']['view'],
					'any'
				)->fetchAll()->all();
			}
			if(isset($data['filters'])){ $filters = $data['filters']; }
			if(isset($data['id'])){
				if(isset($data['key'])){ $key = $data['key']; } else { $key = 'id'; }
				$raw = [];
				$result = [];
				if($this->Auth->read($request) != null){
					$db = $this->Auth->read($request,$data['id'],$key);
					if($db != null){
						if(isset($filters)){
							$raw = $db->filter($filters)->all()[0];
						} else {
							$raw = $db->all()[0];
						}
						$result = $this->convertToDOM($raw);
					}
				}
			} else {
				$raw = [];
				$results = [];
				if($this->Auth->read($request) != null){
					if((isset($filters))&&(!empty($filters))){
						$raw = $this->Auth->read($request)->filter($filters)->all();
					} else {
						$raw = $this->Auth->read($request)->all();
					}
				}
				foreach($raw as $row => $result){
					$results[$row] = $this->convertToDOM($result);
				}
				$raw = array_values($raw);
				$result = array_values($results);
			}
			$results = [
				"request" => $request,
				"data" => $data,
				"output" => [
					'headers' => $this->Auth->getHeaders($request),
					'raw' => $raw,
					'results' => $result,
				],
			];
			if($this->Settings['debug']){
				$results['success'] = $this->Language->Field["This request was successfull"];
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
	public function delete($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			$record = $this->Auth->read($request,$data['id'])->all()[0];
			if((!$record['isLocked'])&&($record['isLocked'] != 'true')){
				$result = $this->Auth->delete($request,$record['id']);
				if((is_int($result))&&($result > 0)){
					$results = [
						"success" => $this->Language->Field["Record successfully deleted"],
						"request" => $request,
						"data" => $data,
						"output" => [
							'results' => $result,
							'record' => $this->convertToDOM($record),
							'raw' => $record,
						],
					];
				} else {
					$results = [
						"error" => $this->Language->Field["Unable to complete the request"],
						"request" => $request,
						"data" => $data,
						"output" => [
							'results' => $result,
						],
					];
				}
			} else {
				$results = [
					"error" => $this->Language->Field["Unable to complete the request"],
					"request" => $request,
					"data" => $data,
					"output" => [
						'results' => $result,
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
