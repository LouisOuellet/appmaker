<?php
class CRUDAPI extends APIextend{
	public function import($request = null, $data = null){
		if($data != null){
			if(!is_array($data)){ $data = json_decode($data, true); }
			if(in_array('Skip',$data['options'])){
				foreach($data['options'] as $key => $option){
					if($option == 'Skip'){
						unset($data['options'][$key]);
						unset($data['headers'][$key]);
						unset($data['values'][$key]);
					}
				}
			}
			$record = [];
			foreach($data['headers'] as $key => $header){
				$record[$header] = $data['values'][$key];
			}
			if(in_array('Update',$data['options'])){
				foreach($data['options'] as $key => $option){
					if($option == 'Update'){ $match = $data['headers'][$key]; }
				}
				$rec = $this->Auth->read($request,$record[$match],$match);
				if($rec != null){
					$result = $this->Auth->update($request,$this->convertToDB($record),$record[$match],$match);
				} else {
					$result = $this->Auth->create($request,$this->convertToDB($record));
				}
			} else {
				if(in_array('Exist',$data['options'])){
					foreach($data['options'] as $key => $option){
						if($option == 'Exist'){ $match = $data['headers'][$key]; }
					}
					$rec = $this->Auth->read($request,$record[$match],$match);
					if($rec == null){ $result = $this->Auth->create($request,$this->convertToDB($record)); } else { $result = false; }
				} else {
					$result = $this->Auth->create($request,$this->convertToDB($record));
				}
			}
			if(is_int($result)){
				$record = $this->Auth->read($request,$result)->all()[0];
			} else {
				$record = $this->Auth->read($request,$record[$match],$match)->all()[0];
			}
			$results = [
				"success" => $this->Language->Field["Records successfully imported"],
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
			];
		}
		return $results;
	}

	public function create($request = null, $data = null){
		if($data != null){
			if(!is_array($data)){ $data = json_decode($data, true); }
			$result = $this->Auth->create($request,$this->convertToDB($data));
			if((is_int($result))&&($result > 0)){
				$result = $this->Auth->read($request,$result)->all()[0];
				$results = [
					"success" => $this->Language->Field["Record successfully created"],
					"request" => $request,
					"data" => $data,
					"output" => [
						'results' => $this->convertToDOM($result),
						'dom' => $this->convertToDOM($result),
						'raw' => $result,
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
			];
		}
		return $results;
	}

	public function read($request = null, $data = null){
		if(($data != null)||($data == null)){
			if(!is_array($data)){ $data = json_decode($data, true); }
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
			$headers = $this->Auth->getHeaders($request);
			foreach($headers as $key => $header){
				if(!$this->Auth->valid('field',$header,1,$request)){
					foreach($raw as $row => $values){
						unset($raw[$row][$header]);
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
					'raw' => $raw,
					'results' => $result,
					'dom' => $result,
				],
			];
		} else {
			$results = [
				"error" => $this->Language->Field["Unable to complete the request"],
				"request" => $request,
				"data" => $data,
			];
		}
		return $results;
	}
	public function update($request = null, $data = null){
		if($data != null){
			if(!is_array($data)){ $data = json_decode($data, true); }
			$record = $this->Auth->read($request,$data['id'])->all()[0];
			$result = $this->Auth->update($request,$this->convertToDB($data),$data['id']);
			if($result){
				$result = $this->Auth->read($request,$data['id'])->all()[0];
				$results = [
					"success" => $this->Language->Field["Record successfully updated"],
					"request" => $request,
					"data" => $data,
					"output" => [
						'results' => $this->convertToDOM($result),
						'dom' => $this->convertToDOM($result),
						'raw' => $result,
					],
				];
				if((isset($record['status'],$result['status']))&&($record['status'] != $result['status'])){
					$status = $this->Auth->query('SELECT * FROM `statuses` WHERE `relationship` = ? AND `order` = ?',$request,$result['status']);
					if($status != null){
						$status = $status->fetchAll()->all();
						if(!empty($status)){
							$status = $status[0];
							$id = $this->Auth->create('relationships',[
								'relationship_1' => $request,
								'link_to_1' => $record['id'],
								'relationship_2' => 'statuses',
								'link_to_2' => $status['id'],
							]);
							$relationship = $this->Auth->read('relationships',$id)->all()[0];
							$relationship = $this->convertToDOM($relationship);
							$status['created'] = $relationship['created'];
							$status['owner'] = $relationship['owner'];
							$results['output']['status'] = $status;
						}
					}
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

	public function delete($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			// Fetch Organization
			$organization = $this->Auth->read($request,$data['id']);
			if($organization != null){
				$organization = $organization->all()[0];
				if((isset($organization['isActive']))&&($organization['isActive'] == "true")){
					$organization['isActive'] = 'false';
					$result = $this->Auth->update($request,$organization,$organization['id']);
					$results = [
						"success" => $this->Language->Field["Record successfully deleted"],
						"request" => $request,
						"data" => $data,
						"output" => [
							'results' => $result,
							'record' => $this->convertToDOM($organization),
							'dom' => $this->convertToDOM($organization),
							'raw' => $organization,
						],
					];
				} else {
					// Fetch Relationships
					$relationships = $this->getRelationships($request,$organization['id']);
					// Delete Relationships
					if((isset($relationships))&&(!empty($relationships))){
						foreach($relationships as $id => $links){
							$this->Auth->delete('relationships',$id);
						}
					}
					// Delete Record
					$result = $this->Auth->delete($request, $organization['id']);
					// Return
					$results = [
						"success" => $this->Language->Field["Record successfully deleted"],
						"request" => $request,
						"data" => $data,
						"output" => [
							'results' => $result,
							'record' => $this->convertToDOM($organization),
							'dom' => $this->convertToDOM($organization),
							'raw' => $organization,
						],
					];
				}
			} else {
				$results = [
					"error" => $this->Language->Field["Unable to complete the request"],
					"request" => $request,
					"data" => $data,
					"output" => [
						'results' => $organization,
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
		// Return
		return $results;
	}

	public function subscribe($request = null, $data = null){
		if($data != null){
			if(!is_array($data)){ $data = json_decode($data, true); }
			// Fetch Organization
			$organization = $this->Auth->read($request,$data['id']);
			if($organization != null){
				$organization = $organization->all()[0];
				$relationship = $this->Auth->create('relationships',[
					'relationship_1' => $request,
					'link_to_1' => $organization['id'],
					'relationship_2' => 'users',
					'link_to_2' => $this->Auth->User['id'],
				]);
				$relationship = $this->Auth->read('relationships',$relationship);
				if($relationship != null){
					$relationship = $relationship->All()[0];
					// Return
					$results = [
						"success" => $this->Language->Field["Record successfully subscribed"],
						"request" => $request,
						"data" => $data,
						"output" => [
							"relationship" => $relationship,
						],
					];
				} else {
					$results = [
						"error" => $this->Language->Field["Unable to complete the request"],
						"request" => $request,
						"data" => $data,
					];
				}
			} else {
				$results = [
					"error" => $this->Language->Field["Unable to complete the request"],
					"request" => $request,
					"data" => $data,
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

	public function unsubscribe($request = null, $data = null){
		if($data != null){
			if(!is_array($data)){ $data = json_decode($data, true); }
			// Fetch Organization
			$organization = $this->Auth->read($request,$data['id']);
			if($organization != null){
				$organization = $organization->all()[0];
				// Fetch Relationships
				$relationships = $this->getRelationships($request,$organization['id']);
				// Delete Relationship
				if((isset($relationships))&&(!empty($relationships))){
					foreach($relationships as $id => $links){
						foreach($links as $organization){
							if(($organization['relationship'] == "users")&&($organization['link_to'] == $this->Auth->User['id'])){
								$relationship = $this->Auth->read('relationships',$id);
								if($relationship != null){
									$relationship = $relationship->All()[0];
									$this->Auth->delete('relationships',$relationship['id']);
									// Return
									$results = [
										"success" => $this->Language->Field["Record successfully unsubscribed"],
										"request" => $request,
										"data" => $data,
										"output" => [
											"relationship" => $relationship,
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
						}
					}
				} else {
					$results = [
						"error" => $this->Language->Field["Unable to complete the request"],
						"request" => $request,
						"data" => $data,
					];
				}
			} else {
				$results = [
					"error" => $this->Language->Field["Unable to complete the request"],
					"request" => $request,
					"data" => $data,
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

	public function get($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			if(!isset($data['key'])){ $data['key'] = 'id'; }
			// Init Return
			$return = false;
			// Fetch Organization
			$organization = $this->Auth->read($request,$data['id'],$data['key']);
			if($organization != null){
				$organization = $organization->all()[0];
				foreach($organization as $key => $value){
					if(!$this->Auth->valid('field',$key,1,$request)){
						$organization[$key] = null;
					}
				}
				// Fetch Assigned Organizations
				$organizations = $this->Auth->query('SELECT * FROM `organizations` WHERE `assigned_to` = ? OR `assigned_to` LIKE ? OR `assigned_to` LIKE ? OR `assigned_to` LIKE ?',
					$this->Auth->User['id'],
					$this->Auth->User['id'].';%',
					'%;'.$this->Auth->User['id'],
					'%;'.$this->Auth->User['id'].';%'
				)->fetchAll();
				if(($organizations != null)&&(isset($organization['organization']))){
					$organizations = $organizations->all();
					foreach($organizations as $uniqueOrganization){
						if($uniqueOrganization['id'] == $organization['organization']){ $return = true; }
					}
				}
				// Fetch Relationships
				$relationships = $this->getRelationships($request,$organization['id']);
				// Build Organization Array
				$organization = [
					'raw' => $organization,
					'dom' => $this->convertToDOM($organization),
				];
				// Init Details
				$details = [];
				// Fetch Details
				foreach($relationships as $relations){
					foreach($relations as $relation){
						if(($relation['relationship'] == 'users')&&($relation['link_to'] == $this->Auth->User['id'])){ $return = true; }
						if($this->Auth->valid('table',$relation['relationship'],1)){
							$fetch = $this->Auth->read($relation['relationship'],$relation['link_to']);
							if($fetch != null){
								$details[$relation['relationship']]['raw'][$relation['link_to']] = $fetch->all()[0];
								foreach($details[$relation['relationship']]['raw'][$relation['link_to']] as $key => $value){
									if(!$this->Auth->valid('field',$key,1,$relation['relationship'])){
										$details[$relation['relationship']]['raw'][$relation['link_to']][$key] = null;
									}
								}
								$details[$relation['relationship']]['dom'][$relation['link_to']] = $this->convertToDOM($details[$relation['relationship']]['raw'][$relation['link_to']]);
							}
						}
					}
				}
				// Fetch Details Statuses
				foreach($details as $table => $detail){
					if($table != 'statuses'){
						$statuses = $this->Auth->query('SELECT * FROM `statuses` WHERE `relationship` = ?',$table)->fetchAll();
						if($statuses != null){
							$statuses = $statuses->all();
							foreach($statuses as $status){
								$details['statuses']['raw'][$status['id']] = $status;
								$details['statuses']['dom'][$status['id']] = $this->convertToDOM($status);
							}
						}
					}
				}
				// Test Permissions
				if(($this->Auth->valid('plugin',$request,1))&&($this->Auth->valid('view','details',1,$request))){ $return = true; }
				// Return
				if($return){
					return [
						"success" => $this->Language->Field["This request was successfull"],
						"request" => $request,
						"data" => $data,
						"output" => [
							'this' => $organization,
							'relationships' => $relationships,
							'details' => $details,
						],
					];
				} else {
					return [
						"error" => $this->Language->Field["You are not allowed to access this record"],
						"request" => $request,
						"data" => $data,
					];
				}
			} else {
				return [
					"error" => $this->Language->Field["Unknown record"],
					"request" => $request,
					"data" => $data,
				];
			}
		}
	}

	public function comment($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			if(!isset($data['key'])){ $data['key'] = 'id'; }
			// Fetch Organization
			$organization = $this->Auth->read($request,$data['link_to'])->all()[0];
			if((isset($organization['organization']))&&($organization['organization'] != '')){
				// Fetch Linked Organization
				$linkedOrganization = $this->Auth->read('organizations',$organization['organization'])->all()[0];
				// Fetch Contacts
				$list = $this->Auth->query('SELECT * FROM `contacts` WHERE `relationship` = ? AND `link_to` = ?','organizations',$linkedOrganization['id'])->fetchAll()->all();
				foreach($list as $contact){ $contacts[$contact['id']] = $contact; }
			}
			// Fetch Category
			$category = $this->Auth->query('SELECT * FROM `categories` WHERE `name` = ? AND `relationship` = ?',$request,'subscriptions')->fetchAll()->all()[0];
			// Fetch Sub Categories
			$sub_category['all'] = $this->Auth->query('SELECT * FROM `sub_categories` WHERE `name` = ? AND `relationship` = ?','all','subscriptions')->fetchAll()->all()[0];
			$sub_category['comments'] = $this->Auth->query('SELECT * FROM `sub_categories` WHERE `name` = ? AND `relationship` = ?','comments','subscriptions')->fetchAll()->all()[0];
			// Fetch Subscriptions
			$list = $this->Auth->query('SELECT * FROM `subscriptions` WHERE `category` = ? AND (`sub_category` = ? OR `sub_category` = ?)',$category['id'],$sub_category['all']['id'],$sub_category['comments']['id'])->fetchAll()->all();
			foreach($list as $subscription){ $subscriptions['comments'][$subscription['relationship']][$subscription['link_to']] = $subscription; }
			// Fetch Relationships
			$relationships = $this->getRelationships($request,$organization['id']);
			// Init Messages
			$messages = [];
			// Create Comment
			$comment = $this->Auth->create('comments',$data);
			$comment = $this->Auth->read('comments',$comment)->all()[0];
			// Create Relationship
			$relationship = $this->Auth->create('relationships',[
				'relationship_1' => $request,
				'link_to_1' => $organization['id'],
				'relationship_2' => 'comments',
				'link_to_2' => $comment['id'],
			]);
			$relationship = $this->Auth->read('relationships',$relationship)->all()[0];
			if((isset($organization['organization']))&&($organization['organization'] != '')&&($request != 'organizations')){
				$relationship = $this->Auth->create('relationships',[
					'relationship_1' => 'organizations',
					'link_to_1' => $linkedOrganization['id'],
					'relationship_2' => 'comments',
					'link_to_2' => $comment['id'],
				]);
			}
			// Send Notifications
			if((isset($relationships))&&(!empty($relationships))){
				foreach($relationships as $id => $links){
					foreach($links as $relationship){
						// Fetch Contact Information
						unset($contact);
						if($relationship['relationship'] == "users"){ $contact = $this->Auth->read('users',$relationship['link_to'])->all()[0]; }
						elseif($relationship['relationship'] == "contacts"){ $contact = $contacts[$relationship['link_to']]; }
						if(isset($contact)){
							if(isset($subscriptions['comments'][$relationship['relationship']][$contact['id']])){
								// Send Internal Notifications
								if(($this->Auth->valid('plugin',$request,1))&&($this->Auth->valid('view','index',1,$request))){ $return = true; }
								if(isset($contact['username'])){
									parent::create('notifications',[
										'icon' => 'icon icon-comment mr-2',
										'subject' => 'You have receive a reply',
										'dissmissed' => 1,
										'user' => $contact['id'],
										'href' => '?p='.$request.'&v=details&id='.$organization[$data['key']],
									]);
								}
								// Send Mail Notifications
								if(isset($contact['email'])){
									$message = [
										'email' => $contact['email'],
										'message' => $comment['content'],
										'extra' => [
											'from' => $this->Auth->User['email'],
											'replyto' => $this->Settings['contacts'][$request],
											'subject' => "ALB Connect -"." ID:".$organization[$data['key']]." Organization:".$organization[$data['key']],
											'href' => "?p=".$request."&v=details&id=".$organization[$data['key']],
										],
									];
									$message['status'] = $this->Auth->Mail->send($message['email'],$message['message'],$message['extra']);
									$messages[$contact['email']] = $message;
								}
							}
						}
					}
				}
			}
			// Return
			return [
				"success" => $this->Language->Field["This request was successfull"],
				"request" => $request,
				"data" => $data,
				"output" => [
					'comment' => ['dom' => $this->convertToDOM($comment), 'raw' => $comment],
				],
			];
		}
	}

	public function note($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			if(!isset($data['key'])){ $data['key'] = 'id'; }
			if(!is_int($data['status'])){ $data['status'] = intval($data['status']); }
			// Fetch Organization
			$organization = $this->Auth->read($request,$data['link_to'])->all()[0];
			if((isset($organization['organization']))&&($organization['organization'] != '')){
				// Fetch Linked Organization
				$linkedOrganization = $this->Auth->read('organizations',$organization['organization'])->all()[0];
				// Fetch Contacts
				$list = $this->Auth->query('SELECT * FROM `contacts` WHERE `relationship` = ? AND `link_to` = ?','organizations',$linkedOrganization['id'])->fetchAll()->all();
				foreach($list as $contact){ $contacts[$contact['id']] = $contact; }
			}
			// Fetch Category
			$category = $this->Auth->query('SELECT * FROM `categories` WHERE `name` = ? AND `relationship` = ?',$request,'subscriptions')->fetchAll();
			if($category != null){
				$category = $category->all();
				if(count($category) > 0){
					$category = $category[0];
					// Fetch Sub Categories
					$sub_category['all'] = $this->Auth->query('SELECT * FROM `sub_categories` WHERE `name` = ? AND `relationship` = ?','all','subscriptions')->fetchAll()->all()[0];
					$sub_category['notes'] = $this->Auth->query('SELECT * FROM `sub_categories` WHERE `name` = ? AND `relationship` = ?','notes','subscriptions')->fetchAll()->all()[0];
				} else { $category = null; }
			}
			// Init Subscriptions
			$subscriptions = [];
			// Fetch Subscriptions
			if($category != null){
				$list = $this->Auth->query('SELECT * FROM `subscriptions` WHERE `category` = ? AND (`sub_category` = ? OR `sub_category` = ?)',$category['id'],$sub_category['all']['id'],$sub_category['notes']['id'])->fetchAll()->all();
				foreach($list as $subscription){ $subscriptions['notes'][$subscription['relationship']][$subscription['link_to']] = $subscription; }
				if((array_key_exists("status",$data))&&(array_key_exists("status",$organization))){
					$sub_category['status'] = $this->Auth->query('SELECT * FROM `sub_categories` WHERE `name` = ? AND `relationship` = ?','status','subscriptions')->fetchAll()->all()[0];
					// Fetch Subscriptions
					$list = $this->Auth->query('SELECT * FROM `subscriptions` WHERE `category` = ? AND (`sub_category` = ? OR `sub_category` = ?)',$category['id'],$sub_category['all']['id'],$sub_category['status']['id'])->fetchAll()->all();
					foreach($list as $subscription){ $subscriptions['status'][$subscription['relationship']][$subscription['link_to']] = $subscription; }
				}
			}
			// Fetch Relationships
			$relationships = $this->getRelationships($request,$organization['id']);
			// Init Messages
			$messages = [];
			// Update Status
			$status = null;
			if(((array_key_exists("status",$data))&&(array_key_exists("status",$organization)))&&($organization['status'] != $data['status'])){
				$organization['status'] = $data['status'];
				$this->Auth->update('organizations',$organization,$organization['id']);
				$organization = $this->Auth->read('organizations',$organization['id'])->all()[0];
				// Create Relationship
				foreach($this->Auth->read('statuses',$organization['status'],'order')->all() as $statuses){
					if($statuses['type'] == "organizations"){ $status = $statuses; }
				}
				$relationship = $this->Auth->create('relationships',[
					'relationship_1' => $request,
					'link_to_1' => $organization['id'],
					'relationship_2' => 'statuses',
					'link_to_2' => $status['id'],
				]);
				// Send Notifications
				if((isset($relationships))&&(!empty($relationships))){
					foreach($relationships as $id => $links){
						foreach($links as $relationship){
							// Fetch Contact Information
							unset($contact);
							if(($relationship['relationship'] == "users")||($relationship['relationship'] == "contacts")){
								$query = $this->Auth->read($relationship['relationship'],$relationship['link_to']);
								if($query != null){ $contact = $query->all()[0]; }
							}
							if(isset($contact)){
								if((isset($subscriptions['status']['users'][$contact['id']]))||(isset($subscriptions['status']['contacts'][$contact['id']]))){
									// Send Internal Notifications
									if(isset($contact['username'])){
										parent::create('notifications',[
											'icon' => 'fas fa-info mr-2',
											'subject' => $organization[$data['key']].' is now '.$status['name'],
											'dissmissed' => 1,
											'user' => $contact['id'],
											'href' => '?p=organizations&v=details&id='.$organization[$data['key']],
										]);
									}
									// Send Mail Notifications
									if(isset($contact['email'])){
										$message = [
											'email' => $contact['email'],
											'message' => 'Status set to '.$status['name'],
											'extra' => [
												'from' => $this->Auth->User['email'],
												'replyto' => $this->Settings['contacts'][$request],
												'subject' => "ALB Connect -"." ID:".$organization['id']." Organization:".$organization[$data['key']],
												'href' => "?p=organizations&v=details&id=".$organization[$data['key']],
											],
										];
										array_push($messages,$message);
										$this->Auth->Mail->send($message['email'],$message['message'],$message['extra']);
									}
								}
							}
						}
					}
				}
			}
			if($this->Auth->valid('custom',$request.'_notes',1)){
				// Create Note
				$note = $this->Auth->create('notes',$data);
				$note = $this->Auth->read('notes',$note)->all()[0];
				// Create Relationship
				$relationship = $this->Auth->create('relationships',[
					'relationship_1' => $request,
					'link_to_1' => $organization['id'],
					'relationship_2' => 'notes',
					'link_to_2' => $note['id'],
				]);
				$relationship = $this->Auth->read('relationships',$relationship)->all()[0];
				if((isset($organization['organization']))&&($organization['organization'] != '')&&($request != 'organizations')){
					$relationship = $this->Auth->create('relationships',[
						'relationship_1' => 'organizations',
						'link_to_1' => $linkedOrganization['id'],
						'relationship_2' => 'notes',
						'link_to_2' => $note['id'],
					]);
				}
				// Send Notifications
				if((isset($relationships))&&(!empty($relationships))){
					foreach($relationships as $id => $links){
						foreach($links as $relationship){
							// Fetch Contact Information
							unset($contact);
							if(($relationship['relationship'] == "users")||($relationship['relationship'] == "contacts")){
								$query = $this->Auth->read($relationship['relationship'],$relationship['link_to']);
								if($query != null){ $contact = $query->all()[0]; }
							}
							if(isset($contact)){
								if(isset($contact['username'])){
									$user = $this->Auth->getData($contact['username']);
									if((isset($user->Permissions['custom'][$request.'_notes']))&&($user->Permissions['custom'][$request.'_notes'] > 0)){
										if(isset($subscriptions['notes']['users'][$contact['id']])){
											// Send Internal Notifications
											if(isset($contact['username'])){
												parent::create('notifications',[
													'icon' => 'icon icon-note mr-2',
													'subject' => 'A note was added to '.$organization[$data['key']],
													'dissmissed' => 1,
													'user' => $contact['id'],
													'href' => '?p='.$request.'&v=details&id='.$organization[$data['key']],
												]);
											}
											// Send Mail Notifications
											if(isset($contact['email'])){
												$message = [
													'email' => $contact['email'],
													'message' => $note['content'],
													'extra' => [
														'from' => $this->Auth->User['email'],
														'replyto' => $this->Settings['contacts'][$request],
														'subject' => "ALB Connect -"." ID:".$organization['id']." Organization:".$organization[$data['key']],
														'href' => "?p=".$request."&v=details&id=".$organization[$data['key']],
													],
												];
												array_push($messages,$message);
												$this->Auth->Mail->send($message['email'],$message['message'],$message['extra']);
											}
										}
									}
								}
							}
						}
					}
				}
			}
			// Return
			return [
				"success" => $this->Language->Field["This request was successfull"],
				"request" => $request,
				"data" => $data,
				"output" => [
					'this' => ['dom' => $this->convertToDOM($organization), 'raw' => $organization],
					'organization' => ['dom' => $this->convertToDOM($organization), 'raw' => $organization],
					'note' => ['dom' => $this->convertToDOM($note), 'raw' => $note],
					'relationship' => ['dom' => $this->convertToDOM($relationship), 'raw' => $relationship],
					'relationships' => $relationships,
					'subscriptions' => $subscriptions,
					'messages' => $messages,
					'status' => $status,
				],
			];
		}
	}

}

class notificationsAPI extends CRUDAPI {}
class relationshipsAPI extends CRUDAPI {}

class optionsAPI extends APIextend {
	public function update($request = null, $data = null){
		if($data != null){
			if(!is_array($data)){ $data = json_decode($data, true); }
			if(isset($data['type'],$data['link_to'],$data['plugin'],$data['view'],$data['record'])){
				$options = $this->Auth->query(
					'SELECT * FROM options WHERE user = ? AND type = ? AND link_to = ? AND plugin = ? AND view = ? AND record = ?',
					$this->Auth->User['id'],
					$data['type'],
					$data['link_to'],
					$data['plugin'],
					$data['view'],
					$data['record']
				)->fetchAll()->all();
				if(count($options) > 0){
					foreach($options as $option){
						$this->Auth->delete($request,$option['id']);
					}
				}
			} else {
				if(count($data['records']) > 0){
					foreach($data['records'] as $record){
						$options = $this->Auth->query('SELECT * FROM options WHERE user = ? AND type = ? AND name = ?',[
							$this->Auth->User['id'],
							$record['type'],
							$record['name']
						])->fetchAll();
						if($options != null){
							$options = $options->all();
							foreach($options as $option){
								$this->Auth->delete($request,$option['id']);
							}
						}
					}
				}
			}
			if(count($data['records']) > 0){
				$results = [];
				$DOM = [];
				foreach($data['records'] as $option){
					$result = $this->Auth->create($request,$this->convertToDB($option));
					if((is_int($result))&&($result > 0)){
						$result = $this->Auth->read($request,$result)->all()[0];
						array_push($results,$result);
						array_push($DOM,$this->convertToDOM($result));
					}
				}
				if(count($data['records']) == count($results)){
					$results = [
						"success" => $this->Language->Field["Preferences successfully saved"],
						"request" => $request,
						"data" => $data,
						"output" => [
							'results' => $DOM,
							'raw' => $results,
						],
					];
				} else {
					$results = [
						"error" => $this->Language->Field["Unable to complete the request"],
						"request" => $request,
						"data" => $data,
						"output" => [
							'results' => $this->convertToDOM($results),
						],
					];
				}
			} else {
				$results = [
					"success" => $this->Language->Field["Preferences successfully saved"],
					"request" => $request,
					"data" => $data,
					"output" => [
						'results' => [],
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
