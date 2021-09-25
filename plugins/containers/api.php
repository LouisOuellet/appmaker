<?php
class containersAPI extends CRUDAPI {
	public function read($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			$this->Auth->setLimit(0);
			$data['filters'] = [['relationship' => 'equal', 'name' => 'active', 'value' => 'true']];
			return parent::read($request, $data);
		}
	}

	public function delete($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			// Fetch Container
			$container = $this->Auth->read('containers',$data['id']);
			if($container != null){
				$container = $this->Auth->read('containers',$data['id'])->all()[0];
				// Init Relationships
				$relationships = [];
				// Fetch Relationships
				$relations = $this->Auth->query('SELECT * FROM `relationships` WHERE (`relationship_1` = ? AND `link_to_1` = ?) OR (`relationship_2` = ? AND `link_to_2` = ?) OR (`relationship_3` = ? AND `link_to_3` = ?)',[
					$request,
					$container['id'],
					$request,
					$container['id'],
					$request,
					$container['id'],
				])->fetchAll();
				// Creating Relationships Array
				if($relations != null){
					$relations = $relations->all();
					foreach($relations as $relation){
						$relationships[$relation['id']] = [];
						if(($relation['relationship_1'] != '')&&($relation['relationship_1'] != null)&&($relation['relationship_1'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_1'],'link_to' => $relation['link_to_1'],'created' => $relation['created']]); }
						if(($relation['relationship_2'] != '')&&($relation['relationship_2'] != null)&&($relation['relationship_2'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_2'],'link_to' => $relation['link_to_2'],'created' => $relation['created']]); }
						if(($relation['relationship_3'] != '')&&($relation['relationship_3'] != null)&&($relation['relationship_3'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_3'],'link_to' => $relation['link_to_3'],'created' => $relation['created']]); }
					}
				}
				// Delete Relationships
				if((isset($relationships))&&(!empty($relationships))){
					foreach($relationships as $id => $entities){
						$this->Auth->delete('relationships',$id);
					}
				}
				return parent::delete($request, $data);
			}
		}
	}

	public function subscribe($request = null, $data = null){
		if($data != null){
			if(!is_array($data)){ $data = json_decode($data, true); }
			// Fetch Container
			$container = $this->Auth->read('containers',$data['id']);
			if($container != null){
				$container = $container->all()[0];
				$relationship = $this->Auth->create('relationships',[
					'relationship_1' => 'containers',
					'link_to_1' => $container['id'],
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
			// Fetch Container
			$container = $this->Auth->read('containers',$data['id']);
			if($container != null){
				$container = $container->all()[0];
				// Init Relationships
				$relationships = [];
				// Fetch Relationships
				$relations = $this->Auth->query('SELECT * FROM `relationships` WHERE (`relationship_1` = ? AND `link_to_1` = ?) OR (`relationship_2` = ? AND `link_to_2` = ?) OR (`relationship_3` = ? AND `link_to_3` = ?)',[
					$request,
					$container['id'],
					$request,
					$container['id'],
					$request,
					$container['id'],
				])->fetchAll();
				// Creating Relationships Array
				if($relations != null){
					$relations = $relations->all();
					foreach($relations as $relation){
						$relationships[$relation['id']] = [];
						if(($relation['relationship_1'] != '')&&($relation['relationship_1'] != null)&&($relation['relationship_1'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_1'],'link_to' => $relation['link_to_1'],'created' => $relation['created']]); }
						if(($relation['relationship_2'] != '')&&($relation['relationship_2'] != null)&&($relation['relationship_2'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_2'],'link_to' => $relation['link_to_2'],'created' => $relation['created']]); }
						if(($relation['relationship_3'] != '')&&($relation['relationship_3'] != null)&&($relation['relationship_3'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_3'],'link_to' => $relation['link_to_3'],'created' => $relation['created']]); }
					}
				}
				// Delete Relationship
				if((isset($relationships))&&(!empty($relationships))){
					foreach($relationships as $id => $entities){
						foreach($entities as $entity){
							if(($entity['relationship'] == "users")&&($entity['link_to'] == $this->Auth->User['id'])){
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

	public function create($request = null, $data = null){
		if($data != null){
			if(!is_array($data)){ $data = json_decode($data, true); }
			// Create Container
			$result = $this->Auth->create($request,$this->convertToDB($data));
			// Fetch Container
			$container = $this->Auth->read('containers',$result)->all()[0];
			// Init Subscriptions
			$subscriptions = [];
			// Init Subscribed
			$subscribed = [];
			// Init Sub-Categories
			$sub_category = [];
			// Init Messages
			$messages = [];
			// Init Contacts
			$contacts = [];
			// Init Users
			$users = [];
			// Init Relationships
			$relationships = [];
			// Fetch Category
			$category = $this->Auth->query('SELECT * FROM `categories` WHERE `name` = ? AND `relationship` = ?','Containers','subscriptions')->fetchAll()->all()[0];
			// Fetch Sub Categories
			$sub_categories = $this->Auth->query('SELECT * FROM `sub_categories` WHERE `relationship` = ?','subscriptions')->fetchAll()->all();
			foreach($sub_categories as $subs){
				$sub_category[$subs['name']] = $subs;
				// Fetch Subscriptions
				$list = $this->Auth->query('SELECT * FROM `subscriptions` WHERE `category` = ? AND `sub_category` = ?',$category['id'],$subs['id'])->fetchAll()->all();
				foreach($list as $subscription){ $subscriptions[$subs['name']][$subscription['relationship']][$subscription['link_to']] = $subscription; }
			}
			// Fetch Client
			$client = $this->Auth->read('clients',$container['client']);
			if($client != null){
				$client = $client->all()[0];
				// Fetch Contacts
				$list = $this->Auth->query('SELECT * FROM `contacts` WHERE `relationship` = ? AND `link_to` = ?','clients',$client['id'])->fetchAll()->all();
				foreach($list as $contact){ $contacts[$contact['id']] = $contact; }
				// Fetch Users
				if($client['assigned_to'] != ''){
					foreach(explode(";",$client['assigned_to']) as $userID){
						$user = $this->Auth->read('users',$userID);
						if($user != null){
							$user = $user->all()[0];
							$users[$user['id']] = $user;
						}
					}
				}
				// Create Relationships
				// Create Status
				foreach($this->Auth->read('statuses',$data['status'],'order')->all() as $statuses){
					if($statuses['type'] == "containers"){ $status = $statuses; }
				}
				$this->Auth->create('relationships',[
					'relationship_1' => 'containers',
					'link_to_1' => $container['id'],
					'relationship_2' => 'statuses',
					'link_to_2' => $status['id'],
				]);
				// Create Client
				$this->Auth->create('relationships',[
					'relationship_1' => 'containers',
					'link_to_1' => $container['id'],
					'relationship_2' => 'clients',
					'link_to_2' => $client['id'],
				]);
				// Create Subscriptions
				foreach($subscriptions as $subscriptionType){
					foreach($subscriptionType as $type => $subscriptionArray){
						foreach($subscriptionArray as $subscription){
							if(!isset($subscribed[$subscription['relationship']])){ $subscribed[$subscription['relationship']] = []; }
							if(!in_array($subscription['link_to'], $subscribed[$subscription['relationship']])){
								array_push($subscribed[$subscription['relationship']], $subscription['link_to']);
								switch($subscription['relationship']){
									case"contacts":
										if(isset($contacts[$subscription['link_to']])){
											$this->Auth->create('relationships',[
												'relationship_1' => 'containers',
												'link_to_1' => $container['id'],
												'relationship_2' => $subscription['relationship'],
												'link_to_2' => $subscription['link_to'],
											]);
										}
										break;
									case"users":
										if(isset($users[$subscription['link_to']])){
											$this->Auth->create('relationships',[
												'relationship_1' => 'containers',
												'link_to_1' => $container['id'],
												'relationship_2' => $subscription['relationship'],
												'link_to_2' => $subscription['link_to'],
											]);
										}
										break;
									default:
										$this->Auth->create('relationships',[
											'relationship_1' => 'containers',
											'link_to_1' => $container['id'],
											'relationship_2' => $subscription['relationship'],
											'link_to_2' => $subscription['link_to'],
										]);
										break;
								}
							}
						}
					}
				}
				// Init Relationships
				$relationships = [];
				// Fetch Relationships
				$relations = $this->Auth->query('SELECT * FROM `relationships` WHERE (`relationship_1` = ? AND `link_to_1` = ?) OR (`relationship_2` = ? AND `link_to_2` = ?) OR (`relationship_3` = ? AND `link_to_3` = ?)',[
					$request,
					$container['id'],
					$request,
					$container['id'],
					$request,
					$container['id'],
				])->fetchAll();
				// Creating Relationships Array
				if($relations != null){
					$relations = $relations->all();
					foreach($relations as $relation){
						$relationships[$relation['id']] = [];
						if(($relation['relationship_1'] != '')&&($relation['relationship_1'] != null)&&($relation['relationship_1'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_1'],'link_to' => $relation['link_to_1'],'created' => $relation['created']]); }
						if(($relation['relationship_2'] != '')&&($relation['relationship_2'] != null)&&($relation['relationship_2'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_2'],'link_to' => $relation['link_to_2'],'created' => $relation['created']]); }
						if(($relation['relationship_3'] != '')&&($relation['relationship_3'] != null)&&($relation['relationship_3'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_3'],'link_to' => $relation['link_to_3'],'created' => $relation['created']]); }
					}
				}
				// Send Notifications
				if((isset($relationships))&&(!empty($relationships))){
					foreach($relationships as $id => $entities){
						foreach($entities as $relationship){
							// Fetch Contact Information
							unset($contact);
							if($relationship['relationship'] == "users"){ $contact = $this->Auth->read('users',$relationship['link_to'])->all()[0]; }
							elseif(($relationship['relationship'] == "contacts")&&(isset($contacts[$relationship['link_to']]))){ $contact = $contacts[$relationship['link_to']]; }
							elseif($relationship['relationship'] == "subscriptions"){
								$subscription = $subscriptions[$relationship['link_to']];
								if($relationship['relationship'] == "users"){ $contact = $this->Auth->read('users',$subscription['link_to'])->all()[0]; }
								elseif($relationship['relationship'] == "contacts"){ $contact = $contacts[$subscription['link_to']]; }
							}
							if(isset($contact)){
								if(isset($subscriptions['New']['users'][$contact['id']])){
									// Send Internal Notifications
									if(isset($contact['username'])){
										parent::create('notifications',[
											'icon' => 'icon icon-container mr-2',
											'subject' => 'You have a new container',
											'dissmissed' => 1,
											'user' => $contact['id'],
											'href' => '?p=containers&v=details&id='.$container['container_num'],
										]);
									}
									// Send Mail Notifications
									if(isset($contact['email'])){
										$message = [
											'email' => $contact['email'],
											'message' => 'A new container has been added.',
											'extra' => [
												'from' => $this->Auth->User['email'],
												'replyto' => $this->Settings['contacts']['containers'],
												'subject' => "ALB Connect -"." ID:".$container['id']." BoL:".$container['bill_of_lading']." Container:".$container['container_num'],
												'href' => "?p=containers&v=details&id=".$container['container_num'],
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
				$results = [
					"success" => $this->Language->Field["Record successfully created"],
					"request" => $request,
					"data" => $data,
					"output" => [
						'results' => $this->convertToDOM($container),
						'raw' => $container,
						'relationships' => $relationships,
						'subscriptions' => $subscriptions,
						'messages' => $messages,
						'contacts' => $contacts,
						'users' => $users,
					],
				];
			} else {
				$results = [
					"error" => $this->Language->Field["Client not found"],
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

	public function get($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			// Init Return
			$return = false;
			// Fetch Container
			$container = $this->Auth->read('containers',$data['id'],'container_num')->filter([['relationship' => 'equal', 'name' => 'active', 'value' => 'true']])->all()[0];
			// Fetch Assigned Clients
			$clients = $this->Auth->query('SELECT * FROM `clients` WHERE `assigned_to` = ? OR `assigned_to` LIKE ? OR `assigned_to` LIKE ?',$this->Auth->User['id'],$this->Auth->User['id'].';%','%;'.$this->Auth->User['id'].';%')->fetchAll();
			if($clients != null){
				$clients = $clients->all();
				foreach($clients as $client){
					if($client['id'] == $container['client']){ $return = true; }
				}
			}
			// Init Relationships
			$relationships = [];
			// Fetch Relationships
			$relations = $this->Auth->query('SELECT * FROM `relationships` WHERE (`relationship_1` = ? AND `link_to_1` = ?) OR (`relationship_2` = ? AND `link_to_2` = ?) OR (`relationship_3` = ? AND `link_to_3` = ?)',[
				$request,
				$container['id'],
				$request,
				$container['id'],
				$request,
				$container['id'],
			])->fetchAll();
			// Creating Relationships Array
			if($relations != null){
				$relations = $relations->all();
				foreach($relations as $relation){
					$relationships[$relation['id']] = [];
					if(($relation['relationship_1'] != '')&&($relation['relationship_1'] != null)&&($relation['relationship_1'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_1'],'link_to' => $relation['link_to_1'],'created' => $relation['created']]); }
					if(($relation['relationship_2'] != '')&&($relation['relationship_2'] != null)&&($relation['relationship_2'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_2'],'link_to' => $relation['link_to_2'],'created' => $relation['created']]); }
					if(($relation['relationship_3'] != '')&&($relation['relationship_3'] != null)&&($relation['relationship_3'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_3'],'link_to' => $relation['link_to_3'],'created' => $relation['created']]); }
				}
			}
			// Init Details
			$details = [];
			// Fetch Details
			foreach($relationships as $relations){
				foreach($relations as $relation){
					if(($relation['relationship'] == 'users')&&($relation['link_to'] == $this->Auth->User['id'])){ $return = true; }
					if($this->Auth->valid('table',$relation['relationship'],1)){
						$details[$relation['relationship']]['raw'][$relation['link_to']] = $this->Auth->read($relation['relationship'],$relation['link_to'])->all()[0];
						$details[$relation['relationship']]['dom'][$relation['link_to']] = $this->convertToDOM($details[$relation['relationship']]['raw'][$relation['link_to']]);
					}
				}
			}
			// Test Permissions
			if(($this->Auth->valid('plugin','containers',1))&&($this->Auth->valid('view','index',1,'containers'))){ $return = true; }
			// Return
			if($return){
				return [
					"success" => $this->Language->Field["This request was successfull"],
					"request" => $request,
					"data" => $data,
					"output" => [
						'container' => ['dom' => $this->convertToDOM($container), 'raw' => $container],
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
		}
	}

	public function comment($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			// Fetch Container
			$container = $this->Auth->read('containers',$data['link_to'])->all()[0];
			// Fetch Client
			$client = $this->Auth->read('clients',$container['client'])->all()[0];
			// Fetch Contacts
			$list = $this->Auth->query('SELECT * FROM `contacts` WHERE `relationship` = ? AND `link_to` = ?','clients',$client['id'])->fetchAll()->all();
			foreach($list as $contact){ $contacts[$contact['id']] = $contact; }
			// Fetch Category
			$category = $this->Auth->query('SELECT * FROM `categories` WHERE `name` = ? AND `relationship` = ?','Containers','subscriptions')->fetchAll()->all()[0];
			// Fetch Sub Categories
			$sub_category['All'] = $this->Auth->query('SELECT * FROM `sub_categories` WHERE `name` = ? AND `relationship` = ?','All','subscriptions')->fetchAll()->all()[0];
			$sub_category['Comments'] = $this->Auth->query('SELECT * FROM `sub_categories` WHERE `name` = ? AND `relationship` = ?','Comments','subscriptions')->fetchAll()->all()[0];
			// Fetch Subscriptions
			$list = $this->Auth->query('SELECT * FROM `subscriptions` WHERE `category` = ? AND (`sub_category` = ? OR `sub_category` = ?)',$category['id'],$sub_category['All']['id'],$sub_category['Comments']['id'])->fetchAll()->all();
			foreach($list as $subscription){ $subscriptions['Comments'][$subscription['relationship']][$subscription['link_to']] = $subscription; }
			// Init Messages
			$messages = [];
			// Init Relationships
			$relationships = [];
			// Fetch Relationships
			$relations = $this->Auth->query('SELECT * FROM `relationships` WHERE (`relationship_1` = ? AND `link_to_1` = ?) OR (`relationship_2` = ? AND `link_to_2` = ?) OR (`relationship_3` = ? AND `link_to_3` = ?)',[
				$request,
				$container['id'],
				$request,
				$container['id'],
				$request,
				$container['id'],
			])->fetchAll();
			// Creating Relationships Array
			if($relations != null){
				$relations = $relations->all();
				foreach($relations as $relation){
					$relationships[$relation['id']] = [];
					if(($relation['relationship_1'] != '')&&($relation['relationship_1'] != null)&&($relation['relationship_1'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_1'],'link_to' => $relation['link_to_1'],'created' => $relation['created']]); }
					if(($relation['relationship_2'] != '')&&($relation['relationship_2'] != null)&&($relation['relationship_2'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_2'],'link_to' => $relation['link_to_2'],'created' => $relation['created']]); }
					if(($relation['relationship_3'] != '')&&($relation['relationship_3'] != null)&&($relation['relationship_3'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_3'],'link_to' => $relation['link_to_3'],'created' => $relation['created']]); }
				}
			}
			// Create Comment
			$comment = $this->Auth->create('comments',$data);
			$comment = $this->Auth->read('comments',$comment)->all()[0];
			// Create Relationship
			$relationship = $this->Auth->create('relationships',[
				'relationship_1' => 'containers',
				'link_to_1' => $container['id'],
				'relationship_2' => 'comments',
				'link_to_2' => $comment['id'],
			]);
			$relationship = $this->Auth->read('relationships',$relationship)->all()[0];
			$relationship = $this->Auth->create('relationships',[
				'relationship_1' => 'clients',
				'link_to_1' => $client['id'],
				'relationship_2' => 'comments',
				'link_to_2' => $comment['id'],
			]);
			// Send Notifications
			if((isset($relationships))&&(!empty($relationships))){
				foreach($relationships as $id => $entities){
					foreach($entities as $relationship){
						// Fetch Contact Information
						unset($contact);
						if($relationship['relationship'] == "users"){ $contact = $this->Auth->read('users',$relationship['link_to'])->all()[0]; }
						elseif($relationship['relationship'] == "contacts"){ $contact = $contacts[$relationship['link_to']]; }
						elseif($relationship['relationship'] == "subscriptions"){
							$subscription = $subscriptions[$relationship['link_to']];
							if($relationship['relationship'] == "users"){ $contact = $this->Auth->read('users',$subscription['link_to'])->all()[0]; }
							elseif($relationship['relationship'] == "contacts"){ $contact = $contacts[$subscription['link_to']]; }
						}
						if(isset($contact)){
							if(isset($subscriptions['Comments'][$relationship['relationship']][$contact['id']])){
								// Send Internal Notifications
								if(isset($contact['username'])){
									parent::create('notifications',[
										'icon' => 'icon icon-comment mr-2',
										'subject' => 'You have receive a reply',
										'dissmissed' => 1,
										'user' => $contact['id'],
										'href' => '?p=containers&v=details&id='.$container['container_num'],
									]);
								}
								// Send Mail Notifications
								if(isset($contact['email'])){
									$message = [
										'email' => $contact['email'],
										'message' => $comment['content'],
										'extra' => [
											'from' => $this->Auth->User['email'],
											'replyto' => $this->Settings['contacts']['containers'],
											'subject' => "ALB Connect -"." ID:".$container['id']." BoL:".$container['bill_of_lading']." Container:".$container['container_num'],
											'href' => "?p=containers&v=details&id=".$container['container_num'],
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
			// Fetch Container
			$container = $this->Auth->read('containers',$data['link_to'])->all()[0];
			// Fetch Client
			$client = $this->Auth->read('clients',$container['client'])->all()[0];
			// Fetch Contacts
			$list = $this->Auth->query('SELECT * FROM `contacts` WHERE `relationship` = ? AND `link_to` = ?','clients',$client['id'])->fetchAll()->all();
			foreach($list as $contact){ $contacts[$contact['id']] = $contact; }
			// Fetch Category
			$category = $this->Auth->query('SELECT * FROM `categories` WHERE `name` = ? AND `relationship` = ?','Containers','subscriptions')->fetchAll()->all()[0];
			// Fetch Sub Categories
			$sub_category['All'] = $this->Auth->query('SELECT * FROM `sub_categories` WHERE `name` = ? AND `relationship` = ?','All','subscriptions')->fetchAll()->all()[0];
			$sub_category['Notes'] = $this->Auth->query('SELECT * FROM `sub_categories` WHERE `name` = ? AND `relationship` = ?','Notes','subscriptions')->fetchAll()->all()[0];
			$sub_category['Status'] = $this->Auth->query('SELECT * FROM `sub_categories` WHERE `name` = ? AND `relationship` = ?','Status','subscriptions')->fetchAll()->all()[0];
			// Fetch Subscriptions
			$list = $this->Auth->query('SELECT * FROM `subscriptions` WHERE `category` = ? AND (`sub_category` = ? OR `sub_category` = ?)',$category['id'],$sub_category['All']['id'],$sub_category['Notes']['id'])->fetchAll()->all();
			foreach($list as $subscription){ $subscriptions['Notes'][$subscription['relationship']][$subscription['link_to']] = $subscription; }
			// Fetch Subscriptions
			$list = $this->Auth->query('SELECT * FROM `subscriptions` WHERE `category` = ? AND (`sub_category` = ? OR `sub_category` = ?)',$category['id'],$sub_category['All']['id'],$sub_category['Status']['id'])->fetchAll()->all();
			foreach($list as $subscription){ $subscriptions['Status'][$subscription['relationship']][$subscription['link_to']] = $subscription; }
			// Init Messages
			$messages = [];
			// Init Relationships
			$relationships = [];
			// Fetch Relationships
			$relations = $this->Auth->query('SELECT * FROM `relationships` WHERE (`relationship_1` = ? AND `link_to_1` = ?) OR (`relationship_2` = ? AND `link_to_2` = ?) OR (`relationship_3` = ? AND `link_to_3` = ?)',[
				$request,
				$container['id'],
				$request,
				$container['id'],
				$request,
				$container['id'],
			])->fetchAll();
			// Creating Relationships Array
			if($relations != null){
				$relations = $relations->all();
				foreach($relations as $relation){
					$relationships[$relation['id']] = [];
					if(($relation['relationship_1'] != '')&&($relation['relationship_1'] != null)&&($relation['relationship_1'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_1'],'link_to' => $relation['link_to_1'],'created' => $relation['created']]); }
					if(($relation['relationship_2'] != '')&&($relation['relationship_2'] != null)&&($relation['relationship_2'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_2'],'link_to' => $relation['link_to_2'],'created' => $relation['created']]); }
					if(($relation['relationship_3'] != '')&&($relation['relationship_3'] != null)&&($relation['relationship_3'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_3'],'link_to' => $relation['link_to_3'],'created' => $relation['created']]); }
				}
			}
			// Update Status
			$status = null;
			if($container['status'] != $data['status']){
				$container['status'] = $data['status'];
				$this->Auth->update('containers',$container,$container['id']);
				$container = $this->Auth->read('containers',$container['id'])->all()[0];
				// Create Relationship
				foreach($this->Auth->read('statuses',$container['status'],'order')->all() as $statuses){
					if($statuses['type'] == "containers"){ $status = $statuses; }
				}
				$relationship = $this->Auth->create('relationships',[
					'relationship_1' => 'containers',
					'link_to_1' => $container['id'],
					'relationship_2' => 'statuses',
					'link_to_2' => $status['id'],
				]);
				// Send Notifications
				if((isset($relationships))&&(!empty($relationships))){
					foreach($relationships as $id => $entities){
						foreach($entities as $relationship){
							// Fetch Contact Information
							unset($contact);
							if($relationship['relationship'] == "users"){ $contact = $this->Auth->read('users',$relationship['link_to'])->all()[0]; }
							elseif($relationship['relationship'] == "contacts"){ $contact = $contacts[$relationship['link_to']]; }
							elseif($relationship['relationship'] == "subscriptions"){
								$subscription = $subscriptions[$relationship['link_to']];
								if($relationship['relationship'] == "users"){ $contact = $this->Auth->read('users',$subscription['link_to'])->all()[0]; }
								elseif($relationship['relationship'] == "contacts"){ $contact = $contacts[$subscription['link_to']]; }
							}
							if(isset($contact)){
								if((isset($subscriptions['Status']['users'][$contact['id']]))||(isset($subscriptions['Status']['contacts'][$contact['id']]))){
									// Send Internal Notifications
									if(isset($contact['username'])){
										parent::create('notifications',[
											'icon' => 'fas fa-info mr-2',
											'subject' => $container['container_num'].' is now '.$status['name'],
											'dissmissed' => 1,
											'user' => $contact['id'],
											'href' => '?p=containers&v=details&id='.$container['container_num'],
										]);
									}
									// Send Mail Notifications
									if(isset($contact['email'])){
										$message = [
											'email' => $contact['email'],
											'message' => 'Status set to '.$status['name'],
											'extra' => [
												'from' => $this->Auth->User['email'],
												'replyto' => $this->Settings['contacts']['containers'],
												'subject' => "ALB Connect -"." ID:".$container['id']." BoL:".$container['bill_of_lading']." Container:".$container['container_num'],
												'href' => "?p=containers&v=details&id=".$container['container_num'],
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
			if($this->Auth->valid('custom','containers_notes',1)){
				// Create Note
				$note = $this->Auth->create('notes',$data);
				$note = $this->Auth->read('notes',$note)->all()[0];
				// Create Relationship
				$relationship = $this->Auth->create('relationships',[
					'relationship_1' => 'containers',
					'link_to_1' => $container['id'],
					'relationship_2' => 'notes',
					'link_to_2' => $note['id'],
				]);
				$relationship = $this->Auth->read('relationships',$relationship)->all()[0];
				$relationship = $this->Auth->create('relationships',[
					'relationship_1' => 'clients',
					'link_to_1' => $client['id'],
					'relationship_2' => 'notes',
					'link_to_2' => $note['id'],
				]);
				// Send Notifications
				if((isset($relationships))&&(!empty($relationships))){
					foreach($relationships as $id => $entities){
						foreach($entities as $relationship){
							// Fetch Contact Information
							unset($contact);
							if($relationship['relationship'] == "users"){ $contact = $this->Auth->read('users',$relationship['link_to'])->all()[0]; }
							elseif($relationship['relationship'] == "contacts"){ $contact = $contacts[$relationship['link_to']]; }
							elseif($relationship['relationship'] == "subscriptions"){
								$subscription = $subscriptions[$relationship['link_to']];
								if($relationship['relationship'] == "users"){ $contact = $this->Auth->read('users',$subscription['link_to'])->all()[0]; }
								elseif($relationship['relationship'] == "contacts"){ $contact = $contacts[$subscription['link_to']]; }
							}
							if(isset($contact)){
								if(isset($contact['username'])){
									$user = $this->Auth->getData($contact['username']);
									if((isset($user->Permissions['custom']['containers_notes']))&&($user->Permissions['custom']['containers_notes'] > 0)){
										if(isset($subscriptions['Notes']['users'][$contact['id']])){
											// Send Internal Notifications
											if(isset($contact['username'])){
												parent::create('notifications',[
													'icon' => 'icon icon-note mr-2',
													'subject' => 'A note was added to '.$container['container_num'],
													'dissmissed' => 1,
													'user' => $contact['id'],
													'href' => '?p=containers&v=details&id='.$container['container_num'],
												]);
											}
											// Send Mail Notifications
											if(isset($contact['email'])){
												$message = [
													'email' => $contact['email'],
													'message' => $note['content'],
													'extra' => [
														'from' => $this->Auth->User['email'],
														'replyto' => $this->Settings['contacts']['containers'],
														'subject' => "ALB Connect -"." ID:".$container['id']." BoL:".$container['bill_of_lading']." Container:".$container['container_num'],
														'href' => "?p=containers&v=details&id=".$container['container_num'],
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
					'container' => ['dom' => $this->convertToDOM($container), 'raw' => $container],
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

	public function automaton($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			if(strpos($data['record']['subject'], 'ID:') !== false){
				foreach(explode(" ", $data['record']['subject']) as $tag){if(strpos($tag, 'ID:') !== false){ $data['record']['id'] = $tag; }}
				if(isset($data['record']['id'])){
					$data['record']['id'] = substr($data['record']['id'], strpos($data['record']['id'], "ID:") + 3);
					// Lookup Container
					$container = $this->Auth->read('containers',$data['record']['id']);
					if($container != null){
						// Fetch Container
						$container = $container->all()[0];
						// Lookup User
						$user = $this->Auth->read('users',$data['record']['email'],'email');
						if($user != null){
							// Fetch User
							$user = $user->all()[0];
							// Fetch Client
							$client = $this->Auth->read('clients',$container['client'])->all()[0];
							// Fetch Contacts
							$list = $this->Auth->query('SELECT * FROM `contacts` WHERE `relationship` = ? AND `link_to` = ?','clients',$client['id'])->fetchAll()->all();
							foreach($list as $contact){ $contacts[$contact['id']] = $contact; }
							// Init Messages
							$messages = [];
							// Init Relationships
							$relationships = [];
							// Fetch Relationships
							$relations = $this->Auth->query('SELECT * FROM `relationships` WHERE (`relationship_1` = ? AND `link_to_1` = ?) OR (`relationship_2` = ? AND `link_to_2` = ?) OR (`relationship_3` = ? AND `link_to_3` = ?)',[
								$request,
								$container['id'],
								$request,
								$container['id'],
								$request,
								$container['id'],
							])->fetchAll();
							// Creating Relationships Array
							if($relations != null){
								$relations = $relations->all();
								foreach($relations as $relation){
									$relationships[$relation['id']] = [];
									if(($relation['relationship_1'] != '')&&($relation['relationship_1'] != null)&&($relation['relationship_1'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_1'],'link_to' => $relation['link_to_1'],'created' => $relation['created']]); }
									if(($relation['relationship_2'] != '')&&($relation['relationship_2'] != null)&&($relation['relationship_2'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_2'],'link_to' => $relation['link_to_2'],'created' => $relation['created']]); }
									if(($relation['relationship_3'] != '')&&($relation['relationship_3'] != null)&&($relation['relationship_3'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_3'],'link_to' => $relation['link_to_3'],'created' => $relation['created']]); }
								}
							}
							// Create Comment
							$comment = [
								'from' => $user['id'],
								'type' => 'users',
								'content' => $data['record']['content'],
								'relationship' => 'containers',
								'link_to' => $container['id'],
							];
							$comment = $this->Auth->create('comments', $comment);
							$comment = $this->Auth->read('comments', $comment)->all()[0];
							$relationship = $this->Auth->create('relationships',[
								'relationship_1' => 'containers',
								'link_to_1' => $container['id'],
								'relationship_2' => 'comments',
								'link_to_2' => $comment['id'],
							]);
							// Send Notifications
							if((isset($relationships))&&(!empty($relationships))){
								foreach($relationships as $id => $entities){
									foreach($entities as $relationship){
										// Fetch Contact Information
										unset($contact);
										if($relationship['relationship'] == "users"){ $contact = $this->Auth->read('users',$relationship['link_to'])->all()[0]; }
										elseif($relationship['relationship'] == "contacts"){ $contact = $contacts[$relationship['link_to']]; }
										elseif($relationship['relationship'] == "subscriptions"){
											$subscription = $subscriptions[$relationship['link_to']];
											if($relationship['relationship'] == "users"){ $contact = $this->Auth->read('users',$subscription['link_to'])->all()[0]; }
											elseif($relationship['relationship'] == "contacts"){ $contact = $contacts[$subscription['link_to']]; }
										}
										if((isset($contact['email']))&&($contact['email'] != $user['email'])){
											// Send Internal Notifications
											if(isset($contact['username'])){
												parent::create('notifications',[
													'icon' => 'icon icon-comment mr-2',
													'subject' => 'You have receive a reply',
													'dissmissed' => 1,
													'user' => $contact['id'],
													'href' => '?p=containers&v=details&id='.$container['container_num'],
												]);
											}
											// Send Mail Notifications
											$message = [
												'email' => $contact['email'],
												'message' => $comment['content'],
												'extra' => [
													'from' => $user['email'],
													'replyto' => $this->Settings['contacts']['containers'],
													'subject' => "ALB Connect -"." ID:".$container['id']." BoL:".$container['bill_of_lading']." Container:".$container['container_num'],
													'href' => '?p=containers&v=details&id='.$container['container_num'],
												],
											];
											$message['status'] = $this->Auth->Mail->send($message['email'],$message['message'],$message['extra']);
											$messages[$contact['email']] = $message;
										}
									}
								}
							}
							return [
								"success" => "Comment from ".$data['record']['email']." added to ".$container['container_num'],
								"request" => $request,
								"data" => $data,
								"output" => [
									'results' => $this->convertToDOM($container),
									'raw' => $container,
									'relationships' => $relationships,
									'messages' => $messages,
									'contacts' => $contacts,
								],
							];
						} else {
							// Lookup Contact
							$contact = $this->Auth->read('contacts',$data['record']['email'],'email');
							if($contact != null){
								// Fetch Contact
								$contact = $contact->all()[0];
								// Fetch Client
								$client = $this->Auth->read('clients',$container['client'])->all()[0];
								// Fetch Contacts
								$list = $this->Auth->query('SELECT * FROM `contacts` WHERE `relationship` = ? AND `link_to` = ?','clients',$client['id'])->fetchAll()->all();
								foreach($list as $to){ $contacts[$to['id']] = $to; }
								// Init Messages
								$messages = [];
								// Init Relationships
								$relationships = [];
								// Fetch Relationships
								$relations = $this->Auth->query('SELECT * FROM `relationships` WHERE (`relationship_1` = ? AND `link_to_1` = ?) OR (`relationship_2` = ? AND `link_to_2` = ?) OR (`relationship_3` = ? AND `link_to_3` = ?)',[
									$request,
									$container['id'],
									$request,
									$container['id'],
									$request,
									$container['id'],
								])->fetchAll();
								// Creating Relationships Array
								if($relations != null){
									$relations = $relations->all();
									foreach($relations as $relation){
										$relationships[$relation['id']] = [];
										if(($relation['relationship_1'] != '')&&($relation['relationship_1'] != null)&&($relation['relationship_1'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_1'],'link_to' => $relation['link_to_1'],'created' => $relation['created']]); }
										if(($relation['relationship_2'] != '')&&($relation['relationship_2'] != null)&&($relation['relationship_2'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_2'],'link_to' => $relation['link_to_2'],'created' => $relation['created']]); }
										if(($relation['relationship_3'] != '')&&($relation['relationship_3'] != null)&&($relation['relationship_3'] != $request)){ array_push($relationships[$relation['id']],['relationship' => $relation['relationship_3'],'link_to' => $relation['link_to_3'],'created' => $relation['created']]); }
									}
								}
								// Create Comment
								$comment = [
									'from' => $contact['id'],
									'type' => 'contacts',
									'content' => $data['record']['content'],
									'relationship' => 'containers',
									'link_to' => $container['id'],
								];
								$comment = $this->Auth->create('comments', $comment);
								$comment = $this->Auth->read('comments', $comment)->all()[0];
								$relationship = $this->Auth->create('relationships',[
									'relationship_1' => 'containers',
									'link_to_1' => $container['id'],
									'relationship_2' => 'comments',
									'link_to_2' => $comment['id'],
								]);
								// Send Notifications
								if((isset($relationships))&&(!empty($relationships))){
									foreach($relationships as $id => $entities){
										foreach($entities as $relationship){
											// Fetch Contact Information
											unset($to);
											if($relationship['relationship'] == "users"){ $to = $this->Auth->read('users',$relationship['link_to'])->all()[0]; }
											elseif($relationship['relationship'] == "contacts"){ $to = $contacts[$relationship['link_to']]; }
											elseif($relationship['relationship'] == "subscriptions"){
												$subscription = $subscriptions[$relationship['link_to']];
												if($relationship['relationship'] == "users"){ $to = $this->Auth->read('users',$subscription['link_to'])->all()[0]; }
												elseif($relationship['relationship'] == "contacts"){ $to = $contacts[$subscription['link_to']]; }
											}
											if((isset($to['email']))&&($to['email'] != $contact['email'])){
												// Send Internal Notifications
												if(isset($to['username'])){
													parent::create('notifications',[
														'icon' => 'icon icon-comment mr-2',
														'subject' => 'You have receive a reply',
														'dissmissed' => 1,
														'user' => $to['id'],
														'href' => '?p=containers&v=details&id='.$container['container_num'],
													]);
												}
												// Send Mail Notifications
												$message = [
													'email' => $to['email'],
													'message' => $comment['content'],
													'extra' => [
														'from' => $contact['email'],
														'replyto' => $this->Settings['contacts']['containers'],
														'subject' => "ALB Connect -"." ID:".$container['id']." BoL:".$container['bill_of_lading']." Container:".$container['container_num'],
														'href' => '?p=containers&v=details&id='.$container['container_num'],
													],
												];
												$message['status'] = $this->Auth->Mail->send($message['email'],$message['message'],$message['extra']);
												$messages[$contact['email']] = $message;
											}
										}
									}
								}
								return [
									"success" => "Comment from ".$data['record']['email']." added to ".$container['container_num'],
									"request" => $request,
									"data" => $data,
									"output" => [
										'results' => $this->convertToDOM($container),
										'raw' => $container,
										'relationships' => $relationships,
										'messages' => $messages,
										'contacts' => $contacts,
									],
								];
							} else { return [ "error" => "User/Contact not found" ]; }
						}
					} else { return [ "error" => "Record not Found" ]; }
				} else { return [ "error" => "Unable to retreive ID" ]; }
			} else { return [ "error" => "Unable to fetch ID from Subject" ]; }
		} else { return [ "error" => "No data provided" ]; }
	}
}
