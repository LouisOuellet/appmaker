<?php
class organizationsAPI extends CRUDAPI {

	public function update($request = null, $data = null){
		return parent::update("organizations", $data);
	}

	public function clear($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			$this->Auth->setLimit(0);
			$organization = $this->Auth->read($request, $data['id']);
			if($organization != null){
				$organization = $organization->all()[0];
				$organizationRelationships = $this->getRelationships($request, $data['id']);
				foreach($organizationRelationships as $relationshipID => $relationships){
					foreach($relationships as $relationship){
						switch($relationship['relationship']){
							case"issues":
							case"services":
							case"users":
							case"organizations":
							case"statuses":
								$this->Auth->delete('relationships',['id'=>$relationshipID]);
								break;
							case"contacts":
							case"calls":
							case"notes":
							case"comments":
								parent::delete($relationship['relationship'],['id'=>$relationship['link_to']]);
								break;
						}
					}
				}
				// Return
				return [
					"success" => $this->Language->Field["Record successfully cleared"],
					"request" => $request,
					"data" => $data,
					"output" => [
						'organization' => [
							'raw' => $organization,
							'dom' => $this->convertToDOM($organization),
						],
					],
				];
			} else {
				// Return
				return [
					"error" => $this->Language->Field["Unable to complete the request"],
					"request" => $request,
					"data" => $data,
				];
			}
		}
	}

	public function get($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			$this->Auth->setLimit(0);
			// Load Organization
			$get = parent::get($request, $data);
			// Load Contacts
			if(isset($get['success'],$get['output']['details']['contacts']['raw'])){
				foreach($get['output']['details']['contacts']['raw'] as $contact){
					$get['output']['details']['contacts']['subscriptions']['raw'][$contact['id']] = [];
					$get['output']['details']['contacts']['subscriptions']['dom'][$contact['id']] = [];
					$subscriptions = $this->Auth->query('SELECT * FROM `subscriptions` WHERE `relationship` = ? AND `link_to` = ?','contacts',$contact['id'])->fetchAll();
					if($subscriptions != null){
						$subscriptions = $subscriptions->all();
						foreach ($subscriptions as $subscription) {
							array_push($get['output']['details']['contacts']['subscriptions']['raw'][$contact['id']],$subscription);
							array_push($get['output']['details']['contacts']['subscriptions']['dom'][$contact['id']],$this->convertToDOM($subscription));
						}
					}
				}
			}
			// Load Users
			if(isset($get['success'],$get['output']['organization']['raw']['assigned_to'])){
				if(!isset($get['output']['details']['users'])){ $get['output']['details']['users'] = ['dom' => [],'raw' => []]; }
				foreach(explode(";",trim($get['output']['organization']['raw']['assigned_to'],";")) as $userID){
					if(!isset($get['output']['details']['users']['raw'][$userID])){
						$get['output']['details']['users']['raw'][$userID] = $this->Auth->read('users',$userID)->all()[0];
						$get['output']['details']['users']['dom'][$userID] = $this->convertToDOM($get['output']['details']['users']['raw'][$userID]);
					}
				}
			}
			// Load Statuses
			foreach(['issues','organizations','calls','containers'] as $statusType){
				foreach($this->Auth->read('statuses',$statusType,'type')->all() as $status){
					if(!isset($get['output']['details']['statuses']['raw'][$status['id']])){
						$get['output']['details']['statuses']['raw'][$status['id']] = $status;
						$get['output']['details']['statuses']['dom'][$status['id']] = $this->convertToDOM($get['output']['details']['statuses']['raw'][$status['id']]);
					}
				}
			}
			return $get;
		}
	}

	public function read($request = null, $data = null){
		if(($data != null)||($data == null)){
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
			if($this->Auth->valid('custom','organizations_isActive',1)){
				$db = $this->Auth->query('SELECT * FROM `organizations`')->fetchAll();
			} else {
				$db = $this->Auth->query('SELECT * FROM `organizations` WHERE `isActive` = ?','true')->fetchAll();
			}
			$raw = [];
			$results = [];
			if($db != null){
				if((isset($filters))&&(!empty($filters))){ $db = $db->filter($filters); }
				$raw = $db->all();
			}
			foreach($raw as $row => $result){
				$results[$row] = $this->convertToDOM($result);
			}
			$raw = array_values($raw);
			$result = array_values($results);
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

	public function assign($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			$organization = $this->Auth->read('organizations',$data['id']);
			if($organization != null){
				$organization = $organization->all()[0];
				$currentUsers = explode(";",trim($organization['assigned_to'],";"));
				if(!in_array($data['user'],$currentUsers)){ array_push($currentUsers,$data['user']); }
				// Set new tags
				$organization['assigned_to'] = implode(";",$currentUsers);
				// Save Entity
				$saved = $this->Auth->update('organizations',$organization,$data['id']);
				// Fetch User Data
				$users = ['raw' => [],'dom' => []];
				foreach($currentUsers as $userID){
					$users['raw'][$userID] = $this->Auth->read('users',$userID)->all()[0];
					$users['dom'][$userID] = $this->convertToDOM($users['raw'][$userID]);
				}
				// Return
				return [
					"success" => $this->Language->Field["Record successfully updated"],
					"request" => $request,
					"data" => $data,
					"output" => [
						'organization' => [
							'raw' => $organization,
							'dom' => $this->convertToDOM($organization),
						],
						'users' => $users,
					],
				];
			} else {
				// Return
				return [
					"error" => $this->Language->Field["Unable to complete the request"],
					"request" => $request,
					"data" => $data,
				];
			}
		}
	}

	public function unassign($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			$organization = $this->Auth->read('organizations',$data['id']);
			if($organization != null){
				$organization = $organization->all()[0];
				$currentUsers = explode(";",trim($organization['assigned_to'],";"));
				// Remove Tag
				foreach($currentUsers as $key => $user){
					if($user == $data['user']){ unset($currentUsers[$key]); }
				}
				$organization['assigned_to'] = implode(";",$currentUsers);
				// Save Entity
				$saved = $this->Auth->update('organizations',$organization,$data['id']);
				// Return
				return [
					"success" => $this->Language->Field["Record successfully updated"],
					"request" => $request,
					"data" => $data,
					"output" => [
						'organization' => [
							'raw' => $organization,
							'dom' => $this->convertToDOM($organization),
						],
						'user' => $data['user'],
					],
				];
			} else {
				// Return
				return [
					"error" => $this->Language->Field["Unable to complete the request"],
					"request" => $request,
					"data" => $data,
				];
			}
		}
	}

	public function tag($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			$organization = $this->Auth->read('organizations',$data['id']);
			if($organization != null){
				$organization = $organization->all()[0];
				// Set new tags
				$organization['tags'] = implode(";",$data['tags']);
				// Save Entity
				$saved = $this->Auth->update('organizations',$organization,$data['id']);
				// Test for new Tags
				foreach($data['tags'] as $uniqueTag){
					$tag = $this->Auth->query('SELECT * FROM `tags` WHERE `name` = ?',$uniqueTag)->fetchAll();
					if($tag != null){
						$tag = $tag->all();
						if(count($tag) < 1){
							$this->Auth->create('tags',['name' => $uniqueTag]);
						}
					}
				}
				// Return
				return [
					"success" => $this->Language->Field["Record successfully updated"],
					"request" => $request,
					"data" => $data,
					"output" => [
						'organization' => [
							'raw' => $organization,
							'dom' => $this->convertToDOM($organization),
						],
						'tags' => $data['tags'],
					],
				];
			} else {
				// Return
				return [
					"error" => $this->Language->Field["Unable to complete the request"],
					"request" => $request,
					"data" => $data,
				];
			}
		}
	}

	public function untag($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			$organization = $this->Auth->read('organizations',$data['id']);
			if($organization != null){
				$organization = $organization->all()[0];
				$currentTags = explode(";",trim($organization['tags'],";"));
				// Remove Tag
				foreach($currentTags as $key => $tag){
					if($tag == $data['tag']){ unset($currentTags[$key]); }
				}
				$organization['tags'] = implode(";",$currentTags);
				// Save Entity
				$saved = $this->Auth->update('organizations',$organization,$data['id']);
				// Return
				return [
					"success" => $this->Language->Field["Record successfully updated"],
					"request" => $request,
					"data" => $data,
					"output" => [
						'organization' => [
							'raw' => $organization,
							'dom' => $this->convertToDOM($organization),
						],
						'tag' => $data['tag'],
					],
				];
			} else {
				// Return
				return [
					"error" => $this->Language->Field["Unable to complete the request"],
					"request" => $request,
					"data" => $data,
				];
			}
		}
	}

	public function unlink($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			// Return
			$return = [
				"error" => $this->Language->Field["Unable to complete the request"],
				"request" => $request,
				"data" => $data,
				"output" => [
					'relationship' => $data['relationship']['relationship'],
					'id' => $data['relationship']['link_to'],
				],
			];
			$relationships = $this->getRelationships($request,$data['id']);
			foreach($relationships as $id => $relationship){
				foreach($relationship as $relation){
					if(($relation['relationship'] == $data['relationship']['relationship'])&&($relation['link_to'] == $data['relationship']['link_to'])){
						$this->Auth->delete('relationships',$id);
						// Return
						$return = [
							"success" => $this->Language->Field["Record successfully updated"],
							"request" => $request,
							"data" => $data,
							"output" => [
								'relationship' => $data['relationship']['relationship'],
								'id' => $data['relationship']['link_to'],
							],
						];
					}
				}
			}
			return $return;
		}
	}

	public function link($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			// Return
			$return = [
				"error" => $this->Language->Field["Unable to complete the request"],
				"request" => $request,
				"data" => $data,
				"output" => [
					'relationship' => $data['relationship']['relationship'],
					'id' => $data['relationship']['link_to'],
				],
			];
			$found = true;
			$relationships = $this->getRelationships($request,$data['id']);
			foreach($relationships as $id => $relationship){
				foreach($relationship as $relation){
					if(($relation['relationship'] == $data['relationship']['relationship'])&&($relation['link_to'] == $data['relationship']['link_to'])){
						$found = false;
					}
				}
			}
			if($found){
				$new = [
					'relationship_1' => $request,
					'link_to_1' => $data['id'],
					'relationship_2' => $data['relationship']['relationship'],
					'link_to_2' => $data['relationship']['link_to'],
				];
				$status = $this->Auth->query('SELECT * FROM `statuses` WHERE `type` = ? AND `order` = ?',$data['relationship']['relationship'],1)->fetchAll();
				if($status != null){
					$status = $status->all();
					if(!empty($status)){
						$new['relationship_3'] = 'statuses';
						$new['link_to_3'] = $status[0]['id'];
					}
				}
				$id = $this->Auth->create('relationships',$new);
				$relation = $this->Auth->read($data['relationship']['relationship'],$data['relationship']['link_to']);
				if($relation != null){
					$relation = $relation->all()[0];
					$rel = $this->Auth->read('relationships',$id);
					if($rel != null){
						$rel = $rel->all()[0];
						$rel = $this->convertToDOM($rel);
						// Return
						$return = [
							"success" => $this->Language->Field["Record successfully updated"],
							"request" => $request,
							"data" => $data,
							"output" => [
								'relationship' => $data['relationship']['relationship'],
								'id' => $data['relationship']['link_to'],
								'dom' => $this->convertToDOM($relation),
								'raw' => $relation,
								'timeline' => [
									'relationship' => $data['relationship']['relationship'],
									'link_to' => $data['relationship']['link_to'],
									'created' => $rel['created'],
									'owner' => $rel['owner'],
								],
							],
						];
						if(isset($new['relationship_3'],$new['link_to_3'])){ $return['output']['timeline'][$new['relationship_3']] = $new['link_to_3']; }
					}
				}
			}
			return $return;
		}
	}

	public function create($request = null, $data = null){
		if($data != null){
			if(!is_array($data)){ $data = json_decode($data, true); }
			if(!isset($data['key'])){ $data['key'] = 'id'; }
			if(isset($data['organization'])){ $data['name'] = $data['organization']; }
			if(isset($data['client'])){ $data['name'] = $data['client']; }
			if(isset($data['lead'])){ $data['name'] = $data['lead']; }
			if(isset($data['name'])){ $create = true; }
			// Lookup for an existing Entity
			if(isset($data['name']) && is_numeric($data['name'])){
				$organization = $this->Auth->read('organizations',$data['name']);
				if($organization != null){
					$organization = $organization->all()[0];
					$create = false;
				}
			}
			if($create){
				// Create Entity
				$result = $this->Auth->create('organizations',$this->convertToDB($data));
				// Fetch Entity
				$organization = $this->Auth->read('organizations',$result)->all()[0];
				// Init Subscriptions
				$subscriptions = [];
				// Init Subscribed
				$subscribed = [];
				// Init Sub-Categories
				$sub_category = [];
				// Init Messages
				$messages = [];
				// Init Users
				$users = [];
				// Fetch Category
				$issues = $this->Auth->query('SELECT * FROM `issues` WHERE `isDefault` = ?','true')->fetchAll();
				if($issues != null){ $issues = $issues->all(); } else { $issues = []; }
				// Fetch Category
				$category = $this->Auth->query('SELECT * FROM `categories` WHERE `name` = ? AND `relationship` = ?','organizations','subscriptions')->fetchAll()->all()[0];
				// Fetch Sub Categories
				$sub_categories = $this->Auth->query('SELECT * FROM `sub_categories` WHERE `relationship` = ?','subscriptions')->fetchAll()->all();
				foreach($sub_categories as $subs){
					$sub_category[$subs['name']] = $subs;
					// Fetch Subscriptions
					$list = $this->Auth->query('SELECT * FROM `subscriptions` WHERE `category` = ? AND `sub_category` = ?',$category['id'],$subs['id'])->fetchAll();
					if($list != null){
						$list = $list->all();
					} else { $list = []; }
					foreach($list as $subscription){ $subscriptions[$subs['name']][$subscription['relationship']][$subscription['link_to']] = $subscription; }
				}
				// Adding Issues
				foreach($this->Auth->read('statuses','1','order')->all() as $statuses){
					if($statuses['type'] == 'issues'){ $status = $statuses; }
				}
				foreach($issues as $issue){
					$this->Auth->create('relationships',[
						'relationship_1' => 'organizations',
						'link_to_1' => $organization['id'],
						'relationship_2' => 'issues',
						'link_to_2' => $issue['id'],
						'relationship_3' => 'statuses',
						'link_to_3' => $status['id'],
					]);
				}
				// Create Status
				if(isset($data['status'])){
					foreach($this->Auth->read('statuses',$data['status'],'order')->all() as $statuses){
						if($statuses['type'] == 'organizations'){ $status = $statuses; }
					}
					$this->Auth->create('relationships',[
						'relationship_1' => 'organizations',
						'link_to_1' => $organization['id'],
						'relationship_2' => 'statuses',
						'link_to_2' => $status['id'],
					]);
				}
				// Create Subscriptions
				foreach($subscriptions as $subscriptionType){
					foreach($subscriptionType as $type => $subscriptionArray){
						foreach($subscriptionArray as $subscription){
							if(!isset($subscribed[$subscription['relationship']])){ $subscribed[$subscription['relationship']] = []; }
							if(!in_array($subscription['link_to'], $subscribed[$subscription['relationship']])){
								array_push($subscribed[$subscription['relationship']], $subscription['link_to']);
								switch($subscription['relationship']){
									case"users":
										if(isset($users[$subscription['link_to']])){
											$this->Auth->create('relationships',[
												'relationship_1' => 'organizations',
												'link_to_1' => $organization['id'],
												'relationship_2' => $subscription['relationship'],
												'link_to_2' => $subscription['link_to'],
											]);
										}
										break;
									default:
										$this->Auth->create('relationships',[
											'relationship_1' => 'organizations',
											'link_to_1' => $organization['id'],
											'relationship_2' => $subscription['relationship'],
											'link_to_2' => $subscription['link_to'],
										]);
										break;
								}
							}
						}
					}
				}
				// Create Contact
				if(isset($data['first_name']) && !empty($data['first_name']) && $data['first_name'] != null){
					$contact = [
						'first_name' => $data['first_name'],
						'middle_name' => $data['middle_name'],
						'last_name' => $data['last_name'],
						'job_title' => $data['job_title'],
						'email' => $data['email'],
						'phone' => $data['phone'],
						'relationship' => 'organizations',
						'link_to' => $result,
					];
					$contactsAPI = new contactsAPI();
					$contactsAPI->create('contacts',$contact);
				}
				// Fetch Linked Entity
				if((isset($organization['organization']))&&($organization['organization'] != '')){
					$linkedEntity = $this->Auth->read('organizations',$organization['organization']);
					if($linkedEntity != null){
						$linkedEntity = $linkedEntity->all()[0];
						// Fetch Users
						if($linkedEntity['assigned_to'] != ''){
							foreach(explode(";",organizations['assigned_to']) as $userID){
								$user = $this->Auth->read('users',$userID);
								if($user != null){
									$user = $user->all()[0];
									$users[$user['id']] = $user;
								}
							}
						}
						// Create Linked Entity
						if('organizations' != 'organizations'){
							$this->Auth->create('relationships',[
								'relationship_1' => 'organizations',
								'link_to_1' => $organization['id'],
								'relationship_2' => 'organizations',
								'link_to_2' => $linkedEntity['id'],
							]);
						}
					}
				}
				// Fetch Relationships
				$relationships = $this->getRelationships('organizations',$organization['id']);
				// Send Notifications
				if((isset($relationships))&&(!empty($relationships))){
					foreach($relationships as $id => $links){
						foreach($links as $relationship){
							// Fetch Contact Information
							unset($contact);
							if($relationship['relationship'] == "users"){ $contact = $this->Auth->read('users',$relationship['link_to'])->all()[0]; }
							if(isset($contact)){
								if(isset($subscriptions['new']['users'][$contact['id']])){
									// Send Internal Notifications
									if(isset($contact['username'])){
										parent::create('notifications',[
											'icon' => 'icon icon-organization mr-2',
											'subject' => 'You have a new organization',
											'dissmissed' => 1,
											'user' => $contact['id'],
											'href' => '?p='.'organizations'.'&v=details&id='.$organization[$data['key']],
										]);
									}
									// Send Mail Notifications
									if(isset($contact['email'])){
										$message = [
											'email' => $contact['email'],
											'message' => 'A new organization has been added.',
											'extra' => [
												'from' => $this->Auth->User['email'],
												'replyto' => $this->Settings['contacts']['organizations'],
												'subject' => "ALB Connect -"." ID:".$organization['id']." Entity:".$organization[$data['key']],
												'href' => '?p='.'organizations'.'&v=details&id='.$organization[$data['key']],
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
			}
			if((isset($data['client']))||(isset($data['lead']))){
				// Init Entity
				$result = $organization['id'];
				if(isset($data['client'])){ $organization['isClient'] = 'true';$organization['isActive'] = 'true'; }
				if(isset($data['lead'])){ $organization['isLead'] = 'true';$organization['isActive'] = 'true'; }
				// Update Entity
				$this->Auth->update('organizations',$organization,$organization['id']);
			}
			// Return
			$results = [
				"success" => $this->Language->Field["Record successfully created"],
				"request" => $request,
				"data" => $data,
				"output" => [
					'results' => $this->convertToDOM($organization),
					'raw' => $organization,
				],
			];
		} else {
			if(isset($data['name'])){
				$results = [
					"error" => $this->Language->Field["Unable to complete the request"],
					"request" => $request,
					"data" => $data,
				];
			} else {
				$results = [
					"error" => $this->Language->Field["Unable to complete the request"].", no name provided.",
					"request" => $request,
					"data" => $data,
				];
			}
		}
		return $results;
	}
}
