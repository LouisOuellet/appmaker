<?php
class APIextend extends API{

	protected function convertToDOM($result){
		if((!empty($result))&&(is_array($result))){
			foreach($result as $key => $value){
				switch($value){
					case "true": $result[$key]=true;break;
					case "false": $result[$key]=false;break;
					case null:
					case "null": $result[$key]='';break;
				}
				switch($key){
					case"updated_by":
					case"supervisor":
					case"user":
					case"owner":
						if(($value != null)&&($value != '')){
							$user = $this->Auth->read('users',$value);
							if($user != null){ $result[$key] = $user->all()[0]['username']; }
						}
						break;
					case"contact":
						if($value != ''){
							if(is_numeric($value)){
								$contact = $this->Auth->read('contacts',$value);
								if($contact != null){
									$relation = $contact->all()[0];
									$result[$key] = '';
									if(($relation['first_name'] != null)&&($relation['first_name'] != '')){ if($result[$key] != ''){ $result[$key] .= ' ';}$result[$key] .= $relation['first_name'];}
									if(($relation['middle_name'] != null)&&($relation['middle_name'] != '')){ if($result[$key] != ''){ $result[$key] .= ' ';}$result[$key] .= $relation['middle_name'];}
									if(($relation['last_name'] != null)&&($relation['last_name'] != '')){ if($result[$key] != ''){ $result[$key] .= ' ';}$result[$key] .= $relation['last_name'];}
									if($result[$key] == ''){ $result[$key] = $value;}
								}
							}
						}
						break;
					case"role_id":
						$role = $this->Auth->read('roles',$value);
						if($role != null){ $result[$key] = $role->all()[0]['name']; }
						break;
					case"by":
						$user = $this->Auth->read('users',$value);
						if($user != null){ $result[$key] = $user->all()[0]['initials']; }
						break;
					case"assigned_to":
						$users = '';
						foreach(explode(";", $result[$key]) as $user){
							if(is_numeric($user)){
								$fetch = $this->Auth->read('users',$user);
								if($fetch != null){ $users .= $fetch->all()[0]['username'].';'; }
							} elseif($user != '') {
								$fetch = $this->Auth->read('users',$user, 'username');
								if($fetch != null){ $users .= $fetch->all()[0]['id'].';'; }
							}
						}
						$result[$key] = trim($users,";");
						break;
					case"organizations":
						$organizations = '';
						foreach(explode(";", $result[$key]) as $organization){
							if(is_numeric($organization)){
								$fetch = $this->Auth->read('organizations',$organization);
								if($fetch != null){ $organizations .= $fetch->all()[0]['name'].';'; }
							} elseif($organization != '') {
								$fetch = $this->Auth->read('organizations',$organization, 'name');
								if($fetch != null){ $organizations .= $fetch->all()[0]['id'].';'; }
							}
						}
						$result[$key] = trim($organizations,";");
						break;
					case"carrier":
					case"client":
					case"organization":
						if($value != ''){
							if(is_numeric($value)){
								$relation = $this->Auth->read('organizations',$value);
							} else {
								$relation = $this->Auth->read('organizations',$value, 'name');
							}
							if($relation != null){
								$relation = $relation->all()[0];
								$result[$key] = $relation['name'];
							}
						}
						break;
					case"sub_location":
						if($value != ''){
							if(is_numeric($value)){ $relation = $this->Auth->read('sub_locations',$value); }
							else { $relation = null; }
							if($relation != null){
								$relation = $relation->all()[0];
								$result[$key] = $relation['code']." - ".$relation['name'];
							}
						}
						break;
					case"port":
						if($value != ''){
							if(is_numeric($value)){ $relation = $this->Auth->read('ports',$value); }
							else { $relation = null; }
							if($relation != null){
								$relation = $relation->all()[0];
								$result[$key] = $relation['code']." - ".$relation['name'];
							}
						}
						break;
					case"customs_office":
						if($value != ''){
							if(is_numeric($value)){ $relation = $this->Auth->read('customs_offices',$value); }
							else { $relation = null; }
							if($relation != null){
								$relation = $relation->all()[0];
								$result[$key] = $relation['code']." - ".$relation['name'];
							}
						}
						break;
					case"category":
						if($value != ''){
							if(is_numeric($value)){
								$relation = $this->Auth->read('categories',$value);
							} else {
								$relation = $this->Auth->read('categories',$value, 'name');
							}
							if($relation != null){
								$relation = $relation->all()[0];
								$result[$key] = $relation['name'];
							}
						}
						break;
					case"sub_category":
						if($value != ''){
							if(is_numeric($value)){
								$relation = $this->Auth->read('sub_categories',$value);
							} else {
								$relation = $this->Auth->read('sub_categories',$value, 'name');
							}
							if($relation != null){
								$relation = $relation->all()[0];
								$result[$key] = $relation['name'];
							}
						}
						break;
					case"from":
						if((isset($result['type']))&&($result['type'] != '')&&($value != '')){
							if(is_numeric($value)){
								$relation = $this->Auth->read($result['type'],$value);
								if($relation != null){
									$relation = $relation->all()[0];
									if(isset($relation['username'])){
										$result[$key] = $relation['username'];
									} else {
										$result[$key] = $relation['email'];
									}
								}
							} else {
								$result[$key] = $value;
							}
						}
						break;
					case"record":
						if((isset($result['type']))&&($result['type'] != '')&&($value != '')){
							if(is_numeric($value)){
								$test = $this->Auth->read($result['type'],$value);
								if($test != null){
									$relation = $test->all()[0];
								} else {
									$relation['id'] = $value;
								}
							} else {
								if(isset($result['username'])){
									$relkey = 'username';
								} elseif(isset($result['name'])){
									$relkey = 'name';
								} else {
									$relkey = 'id';
								}
								$temp = $this->Auth->read($result['type'],$value, $relkey);
								if($temp != null){ $relation = $temp->all()[0]; }
							}
							if((isset($relation))&&(!empty($relation))&&(is_numeric($value))){
								if(isset($relation['username'])){
									$result[$key] = $relation['username'];
								} elseif(isset($relation['name'])){
									$result[$key] = $relation['name'];
								} else {
									$result[$key] = $relation['id'];
								}
							} else {
								if(isset($relation)){$result[$key] = $relation['id'];}
							}
						}
						break;
					case"link_to":
						if((isset($result['relationship']))&&($result['relationship'] != '')&&($value != '')){
							if(is_numeric($value)){
								$test = $this->Auth->read($result['relationship'],$value);
								if($test != null){
									$relation = $test->all()[0];
								} else {
									$relation['id'] = $value;
								}
							} else {
								if(isset($result['username'])){
									$relkey = 'username';
								} elseif(isset($result['name'])){
									$relkey = 'name';
								} else {
									$relkey = 'id';
								}
								$fetch = $this->Auth->read($result['relationship'],$value, $relkey);
								if($fetch != null){ $relation = $fetch->all()[0]; }
							}
							if((!empty($relation))&&(is_numeric($value))){
								if(isset($relation['username'])){
									$result[$key] = $relation['username'];
								} elseif(isset($relation['name'])){
									$result[$key] = $relation['name'];
								} else {
									$result[$key] = $relation['id'];
								}
							} else {
								if(isset($relation,$relation['username'])){ $result[$key] = $relation['id']; }
							}
						}
						break;
					case"link_to_1":
						if((isset($result['relationship_1']))&&($result['relationship_1'] != '')&&($value != '')){
							if(is_numeric($value)){
								$test = $this->Auth->read($result['relationship_1'],$value);
								if($test != null){
									$relation = $test->all()[0];
								} else {
									$relation['id'] = $value;
								}
							} else {
								if(isset($result['username'])){
									$relkey = 'username';
								} elseif(isset($result['name'])){
									$relkey = 'name';
								} else {
									$relkey = 'id';
								}
								$relation = $this->Auth->read($result['relationship_1'],$value, $relkey)->all()[0];
							}
							if((!empty($relation))&&(is_numeric($value))){
								if(isset($relation['username'])){
									$result[$key] = $relation['username'];
								} elseif(isset($relation['name'])){
									$result[$key] = $relation['name'];
								} else {
									$result[$key] = $relation['id'];
								}
							} else {
								$result[$key] = $relation['id'];
							}
						}
						break;
					case"link_to_2":
						if((isset($result['relationship_2']))&&($result['relationship_2'] != '')&&($value != '')){
							if(is_numeric($value)){
								$test = $this->Auth->read($result['relationship_2'],$value);
								if($test != null){
									$relation = $test->all()[0];
								} else {
									$relation['id'] = $value;
								}
							} else {
								if(isset($result['username'])){
									$relkey = 'username';
								} elseif(isset($result['name'])){
									$relkey = 'name';
								} else {
									$relkey = 'id';
								}
								$relation = $this->Auth->read($result['relationship_2'],$value, $relkey)->all()[0];
							}
							if((!empty($relation))&&(is_numeric($value))){
								if(isset($relation['username'])){
									$result[$key] = $relation['username'];
								} elseif(isset($relation['name'])){
									$result[$key] = $relation['name'];
								} else {
									$result[$key] = $relation['id'];
								}
							} else {
								$result[$key] = $relation['id'];
							}
						}
						break;
					case"link_to_3":
						if((isset($result['relationship_3']))&&($result['relationship_3'] != '')&&($value != '')){
							if(is_numeric($value)){
								$test = $this->Auth->read($result['relationship_3'],$value);
								if($test != null){
									$relation = $test->all()[0];
								} else {
									$relation['id'] = $value;
								}
							} else {
								if(isset($result['username'])){
									$relkey = 'username';
								} elseif(isset($result['name'])){
									$relkey = 'name';
								} else {
									$relkey = 'id';
								}
								$relation = $this->Auth->read($result['relationship_3'],$value, $relkey)->all()[0];
							}
							if((!empty($relation))&&(is_numeric($value))){
								if(isset($relation['username'])){
									$result[$key] = $relation['username'];
								} elseif(isset($relation['name'])){
									$result[$key] = $relation['name'];
								} else {
									$result[$key] = $relation['id'];
								}
							} else {
								$result[$key] = $relation['id'];
							}
						}
						break;
					default:
						break;
				}
			}
			// Extend
			$result = $this->extend('convertToDOM',$result);
		}
		return $result;
	}
	protected function convertToDB($result){
		if((!empty($result))&&(is_array($result))){
			foreach($result as $key => $value){
				if(is_bool($value)){
					if($value){$result[$key]="true";}else{$result[$key]="false";}
				}
				switch($key){
					case"phone":
					case"office_num":
					case"mobile":
					case"other_num":
						$result[$key] = str_replace('_','',$value);
						break;
					case"locked":
						$result[$key] = $value ? 'true' : 'false';
						break;
					case"updated_by":
					case"supervisor":
					case"user":
					case"owner":
						if((!is_numeric($value))&&($value != null)&&($value != '')){
							$record = $this->Auth->read('users',$value, 'username')->all();
							if(!empty($record)){ $result[$key] = $record[0]['id']; }
						}
						break;
					case"role_id":
						if(!is_numeric($value)){
							$record = $this->Auth->read('roles',$value, 'name')->all();
							if(!empty($record)){ $result[$key] = $record[0]['id']; }
						}
						break;
					case"by":
						if(!is_numeric($value)){
							$record = $this->Auth->read('users',$value, 'initials')->all();
							if(!empty($record)){ $result[$key] = $record[0]['id']; }
						}
						break;
					case"assigned_to":
						if(trim($result[$key],";") != ''){
							$users = '';
							foreach(explode(";", trim($result[$key],";")) as $user){
								if(!is_numeric($user)){
									$query = $this->Auth->read('users',$user, 'username');
									if($query != null){
										$users .= $query->all()[0]['id'].';';
									} else { unset($result[$key]); }
								} elseif($user != '') {
									$users .= $user.';';
								}
							}
							$result[$key] = trim($users,";");
						} else {
							$result[$key] = trim($result[$key],";");
						}
						break;
					case"divisions":
						if(trim($result[$key],";") != ''){
							$divisions = '';
							foreach(explode(";", trim($result[$key],";")) as $division){
								if(!is_numeric($division)){
									$divisions .= $this->Auth->read('divisions',$division, 'name')->all()[0]['id'].';';
								} elseif($division != '') {
									$divisions .= $division.';';
								}
							}
							$result[$key] = trim($divisions,";");
						} else {
							$result[$key] = trim($result[$key],";");
						}
						break;
					case"client":
						if($value != ''){
							if(is_numeric($value)){
								$relation = $this->Auth->read('clients',$value);
							} else {
								$relation = $this->Auth->read('clients',$value, 'name');
							}
							if($relation != null){
								$relation = $relation->all()[0];
								$result[$key] = $relation['id'];
							}
						}
						break;
					case"organization":
						if($value != ''){
							if(is_numeric($value)){
								$relation = $this->Auth->read('organizations',$value);
							} else {
								$relation = $this->Auth->read('organizations',$value, 'name');
							}
							if($relation != null){
								$relation = $relation->all()[0];
								$result[$key] = $relation['id'];
							}
						}
						break;
					case"record":
						if((isset($result['type']))&&($result['type'] != '')&&($value != '')){
							if(is_numeric($value)){
								$relation = $this->Auth->read($result['type'],$value)->all()[0];
							} else {
								if(isset($result['username'])){
									$relkey = 'username';
								} elseif(isset($result['name'])){
									$relkey = 'name';
								} else {
									$relkey = 'id';
								}
								$temp = $this->Auth->read($result['type'],$value, $relkey);
								if($temp != null){$relation = $temp->all()[0];}
							}
							if(isset($relation)){ $result[$key] = $relation['id']; }
						}
						break;
					case"link_to":
						if((isset($result['relationship']))&&($result['relationship'] != '')&&($value != '')){
							if(is_numeric($value)){
								$relation = $this->Auth->read($result['relationship'],$value);
							} else {
								if(isset($this->Structure[$result['relationship']]['username'])){
									$relkey = 'username';
								} elseif(isset($this->Structure[$result['relationship']]['name'])){
									$relkey = 'name';
								} else {
									$relkey = 'id';
								}
								$relation = $this->Auth->read($result['relationship'],$value, $relkey);
							}
							if($relation != null){ $result[$key] = $relation->all()[0]['id']; }
						}
						break;
					default:
						break;
				}
			}
		}
		return $result;
	}

	protected function buildRelations($get){
		if(isset($get['output']['relationships'])){ $getRelations['relationships'] = $get['output']['relationships']; }
		else { $getRelations['relationships'] = $get; }
		foreach($getRelations['relationships'] as $rid => $relations){
			foreach($relations as $uid => $relation){
				if(isset($getRelations['details'][$relation['relationship']]['dom'][$relation['link_to']])){
					$getRelations['relations'][$relation['relationship']][$relation['link_to']] = $getRelations['details'][$relation['relationship']]['dom'][$relation['link_to']];
					$getRelations['relations'][$relation['relationship']][$relation['link_to']]['owner'] = $relation['owner'];
					$getRelations['relations'][$relation['relationship']][$relation['link_to']]['created'] = $relation['created'];
				} else {
					$getRelations['relations'][$relation['relationship']][$relation['link_to']] = $this->convertToDOM($this->Auth->query('SELECT * FROM `'.$relation['relationship'].'` WHERE `id` = ?',$relation['link_to'])->fetchAll()->All()[0]);
					$getRelations['relations'][$relation['relationship']][$relation['link_to']]['owner'] = $relation['owner'];
					$getRelations['relations'][$relation['relationship']][$relation['link_to']]['created'] = $relation['created'];
				}
				// Generate Name
				if(!isset($getRelations['relations'][$relation['relationship']][$relation['link_to']]['name']) && isset($getRelations['relations'][$relation['relationship']][$relation['link_to']]['first_name'])){
					$getRelations['relations'][$relation['relationship']][$relation['link_to']]['name'] = '';
					if($getRelations['relations'][$relation['relationship']][$relation['link_to']]['first_name'] != ''){
						if($getRelations['relations'][$relation['relationship']][$relation['link_to']]['name'] != ''){
							$getRelations['relations'][$relation['relationship']][$relation['link_to']]['name'] .= ' ';
						}
						$getRelations['relations'][$relation['relationship']][$relation['link_to']]['name'] .= $getRelations['relations'][$relation['relationship']][$relation['link_to']]['first_name'];
					}
					if($getRelations['relations'][$relation['relationship']][$relation['link_to']]['middle_name'] != ''){
						if($getRelations['relations'][$relation['relationship']][$relation['link_to']]['name'] != ''){
							$getRelations['relations'][$relation['relationship']][$relation['link_to']]['name'] .= ' ';
						}
						$getRelations['relations'][$relation['relationship']][$relation['link_to']]['name'] .= $getRelations['relations'][$relation['relationship']][$relation['link_to']]['middle_name'];
					}
					if($getRelations['relations'][$relation['relationship']][$relation['link_to']]['last_name'] != ''){
						if($getRelations['relations'][$relation['relationship']][$relation['link_to']]['name'] != ''){
							$getRelations['relations'][$relation['relationship']][$relation['link_to']]['name'] .= ' ';
						}
						$getRelations['relations'][$relation['relationship']][$relation['link_to']]['name'] .= $getRelations['relations'][$relation['relationship']][$relation['link_to']]['last_name'];
					}
				}
				// MetaData
				if(isset($getRelations['relations'][$relation['relationship']][$relation['link_to']]['meta']) && !is_array($getRelations['relations'][$relation['relationship']][$relation['link_to']]['meta'])){
					if($getRelations['relations'][$relation['relationship']][$relation['link_to']]['meta'] != '' && $getRelations['relations'][$relation['relationship']][$relation['link_to']]['meta'] != null){
						$getRelations['relations'][$relation['relationship']][$relation['link_to']]['meta'] = json_decode($getRelations['relations'][$relation['relationship']][$relation['link_to']]['meta'], true);
					} else {
						$getRelations['relations'][$relation['relationship']][$relation['link_to']]['meta'] = [];
					}
				}
			}
		}
		// Extend
		$getRelations['relations'] = $this->extend('buildRelations',$getRelations['relations']);
		if(isset($get['output']['relationships'])){ $get['output']['relations'] = $getRelations['relations']; return $get; }
		else { return $getRelations['relations']; }
	}

	protected function createRelationship($relationship = [],$force = false){
		if(!empty($relationship)){
			// Initialize
			$create = true;
			// Sanitization
			if(isset($relationship['relationship_1'],$relationship['link_to_1'])){
				if($this->Auth->query('SELECT * FROM `'.$relationship['relationship_1'].'` WHERE `id` = ?',$relationship['link_to_1'])->numRows() > 0){
					$new['relationship_1'] = $relationship['relationship_1'];
					$new['link_to_1'] = $relationship['link_to_1'];
				}
			}
			if(isset($relationship['relationship_2'],$relationship['link_to_2'])){
				if($this->Auth->query('SELECT * FROM `'.$relationship['relationship_2'].'` WHERE `id` = ?',$relationship['link_to_2'])->numRows() > 0){
					$new['relationship_2'] = $relationship['relationship_2'];
					$new['link_to_2'] = $relationship['link_to_2'];
				}
			}
			if(isset($relationship['relationship_3'],$relationship['link_to_3'])){
				if($this->Auth->query('SELECT * FROM `'.$relationship['relationship_3'].'` WHERE `id` = ?',$relationship['link_to_3'])->numRows() > 0){
					$new['relationship_3'] = $relationship['relationship_3'];
					$new['link_to_3'] = $relationship['link_to_3'];
				}
			}
			if(isset($new['relationship_1'],$new['relationship_2'])){
				if(!$force){
					$relationships = $this->getRelationships($new['relationship_1'],$new['link_to_1']);
					foreach($relationships as $id => $relations){
						foreach($relations as $relation){
							if($relation['relationship'] == $new['relationship_2'] && $relation['link_to'] == $new['link_to_2']){ $create = false;$new['id'] = $id; }
						}
					}
				}
			}
			if($create||$force){
				$new['created'] = date("Y-m-d H:i:s");
				$new['modified'] = date("Y-m-d H:i:s");
				$new['owner'] = $this->Auth->User['id'];
				$new['updated_by'] = $this->Auth->User['id'];
				if(isset($new['relationship_3'])){
					$new['id'] = $this->Auth->query('INSERT INTO `relationships` (created,modified,owner,updated_by,relationship_1,link_to_1,relationship_2,link_to_2,relationship_3,link_to_3) VALUES (?,?,?,?,?,?,?,?,?,?)',
						$new['created'],$new['modified'],$new['owner'],$new['updated_by'],
						$new['relationship_1'],$new['link_to_1'],
						$new['relationship_2'],$new['link_to_2'],
						$new['relationship_3'],$new['link_to_3']
					)->dump()['insert_id'];
				} else {
					$new['id'] = $this->Auth->query('INSERT INTO `relationships` (created,modified,owner,updated_by,relationship_1,link_to_1,relationship_2,link_to_2) VALUES (?,?,?,?,?,?,?,?)',
						$new['created'],$new['modified'],$new['owner'],$new['updated_by'],
						$new['relationship_1'],$new['link_to_1'],
						$new['relationship_2'],$new['link_to_2']
					)->dump()['insert_id'];
				}
				if($new['id'] != NULL){ return $new; }
			} else {
				if($new['id'] != NULL){ return $new; }
			}
		}
	}

	protected function copyRelationships($tbl1,$id1,$tbl2,$id2){
		$relations = $this->getRelationships($tbl1,$id1);
		foreach($relations as $relationship){
			foreach($relationship as $relation){
				if($relation['relationship'] != $tbl2 && $relation['relationship'] != 'statuses' && $relation['link_to'] != '' && $relation['link_to'] != null){
					$new = [
						'relationship_1' => $tbl2,
						'link_to_1' => $id2,
						'relationship_2' => $relation['relationship'],
						'link_to_2' => $relation['link_to'],
					];
					if(isset($relation['status'])){
						$new['relationship_3'] = 'statuses';
						$new['link_to_3'] = $relation['status'];
					}
					if(isset($relation['meta'])){ $new['meta'] = $relation['meta']; }
					$this->createRelationship($new);
				}
			}
		}
	}

	protected function getRelationships($table,$id){
		// Init Relationships
		$relationships = [];
		// Fetch Relationships
		$relations = $this->Auth->query('SELECT * FROM `relationships` WHERE (`relationship_1` = ? AND `link_to_1` = ?) OR (`relationship_2` = ? AND `link_to_2` = ?) OR (`relationship_3` = ? AND `link_to_3` = ?)',[
			$table,
			$id,
			$table,
			$id,
			$table,
			$id,
		])->fetchAll();
		$relations = $relations->all();
		// Creating Relationships Array
		if(!empty($relations)){
			foreach($relations as $relation){
				$relationships[$relation['id']] = [];
				if(($relation['relationship_1'] != '')&&($relation['relationship_1'] != null)&&(($relation['relationship_1'] != $table)||(($relation['relationship_1'] == $table)&&($relation['link_to_1'] != $id)))){
					$new = [
						'relationship' => $relation['relationship_1'],
						'link_to' => $relation['link_to_1'],
					];
					array_push($relationships[$relation['id']],$new);
				}
				if(($relation['relationship_2'] != '')&&($relation['relationship_2'] != null)&&(($relation['relationship_2'] != $table)||(($relation['relationship_2'] == $table)&&($relation['link_to_2'] != $id)))){
					$new = [
						'relationship' => $relation['relationship_2'],
						'link_to' => $relation['link_to_2'],
					];
					array_push($relationships[$relation['id']],$new);
				}
				foreach($relationships[$relation['id']] as $key => $value){
					$relationships[$relation['id']][$key]['created'] = $relation['created'];
					$relationships[$relation['id']][$key]['owner'] = $relation['owner'];
					$relationships[$relation['id']][$key]['meta'] = $relation['meta'];
					// 3rd Relation
					if(($relation['relationship_3'] != '')||($relation['relationship_3'] != null)){
						$relationships[$relation['id']][$key][$relation['relationship_3']] = $relation['link_to_3'];
					}
					// MetaData
					if($relationships[$relation['id']][$key]['meta'] != '' && $relationships[$relation['id']][$key]['meta'] != null && !is_array($relationships[$relation['id']][$key]['meta'])){
						$relationships[$relation['id']][$key]['meta'] = json_decode($relationships[$relation['id']][$key]['meta'], true);
					} else { $relationships[$relation['id']][$key]['meta'] = []; }
				}
			}
		}
		// Return
		return $relationships;
	}

	public function pluginCompile($request = null, $data = null){
		if(($request != null)&&($this->Settings['developer'])&&(isset($this->Structure[$request]))&&($this->Auth->valid("custom","compile",2))){
			// Creating DB Structure
			$structure = $this->LSP->createStructure(dirname(__FILE__,3).'/plugins/'.$request.'/structure.json',[$request]);
			$records=[];
			if($data != null){
				if(!is_array($data)){ $data = json_decode($data, true); }
				if((isset($data['type']))&&(($data['type'] == 'sample')||($data['type'] == 'skeleton'))){
					$records = $this->LSP->createRecords(dirname(__FILE__,3).'/plugins/'.$request.'/'.$data['type'].'.json',[$request]);
				}
			}
			if(is_file(dirname(__FILE__,3).'/plugins/'.$request.'/structure.json')){
				return ["success" => $this->Language->Field["Plugin successfully compiled"], "Structure" => $structure, "Records" => $records];
			} else {
				return ["error" => $this->Language->Field["Unable to compile plugin"], "Structure" => $structure, "Records" => $records];
			}
		} else {
			return ["error" => $this->Language->Field["Unable to compile plugin"]];
		}
	}

	public function pluginInstall($request = null, $data = null){
		if(($request != null)&&($this->Auth->valid("plugin","plugins",2))){
			return ["success" => $this->Language->Field["Plugin successfully installed"]];
		} else {
			return ["error" => $this->Language->Field["Unable to install plugin"]];
		}
	}

	public function pluginUpdate($request = null, $data = null){
		if(($request != null)&&($this->Auth->valid("plugin","plugins",3))){
			return ["success" => $this->Language->Field["Plugin successfully updated"]];
		} else {
			return ["error" => $this->Language->Field["Unable to update plugin"]];
		}
	}

	public function pluginUninstall($request = null, $data = null){
		if(($request != null)&&($this->Auth->valid("plugin","plugins",4))){
			return ["success" => $this->Language->Field["Plugin successfully uninstalled"]];
		} else {
			return ["error" => $this->Language->Field["Unable to uninstall plugin"]];
		}
	}
}
