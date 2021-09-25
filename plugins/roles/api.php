<?php
class rolesAPI extends CRUDAPI {
	public function fetch($request, $data){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			$role = $this->Auth->read('roles',$data['id'],'name')->all()[0];
			if(!empty($role)){
				// Init Permissions
				$permissions = ["dom" => [],"raw" => []];
				$list = $this->Auth->read('permissions',$role['id'],'role_id');
				if($list != null){
					$list = $list->all();
					foreach($list as $permission){
						array_push($permissions["raw"],$permission);
						array_push($permissions["dom"],$this->convertToDOM($permission));
					}
				}
				// Fetch Relationships
				$relationships = $this->getRelationships('roles',$role['id']);
				// Init Members
				$members = ["dom" => [],"raw" => []];
				// Fetch Members
				foreach($relationships as $relations){
					foreach($relations as $relation){
						if(($this->Auth->valid('table',$relation['relationship'],1))&&(($relation['relationship'] == 'users')||($relation['relationship'] == 'groups'))){
							$fetch = $this->Auth->read($relation['relationship'],$relation['link_to']);
							if($fetch != null){
								array_push($members["raw"],$fetch->all()[0]);
								array_push($members["dom"],$this->convertToDOM($fetch->all()[0]));
							}
						}
					}
				}
				$results = [
					"success" => $this->Language->Field["This request was successfull"],
					"request" => $request,
					"data" => $data,
					"output" => [
						'dom' => [
							'role' => $this->convertToDOM($role),
							'permissions' => $permissions["dom"],
							'members' => $members["dom"],
						],
						'raw' => [
							'role' => $role,
							'permissions' => $permissions["raw"],
							'members' => $members["raw"],
						],
					],
				];
			} else {
				$results = [
					"error" => $this->Language->Field["Unable to complete the request"],
					"request" => $request,
					"data" => $data,
				];
			}
		}
		return $results;
	}
}
