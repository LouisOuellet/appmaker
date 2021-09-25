<?php
class ticketsAPI extends CRUDAPI {

	public function read($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			$this->Auth->setLimit(0);
			return parent::read($request, $data);
		}
	}

	public function subscribe($request = null, $data = null){
		if($data != null){
			if(!is_array($data)){ $data = json_decode($data, true); }
			// Fetch Container
			$ticket = $this->Auth->read('tickets',$data['id']);
			if($ticket != null){
				$ticket = $ticket->all()[0];
				$relationship = $this->Auth->create('relationships',[
					'relationship_1' => 'tickets',
					'link_to_1' => $ticket['id'],
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
			$ticket = $this->Auth->read('tickets',$data['id']);
			if($ticket != null){
				$ticket = $ticket->all()[0];
				// Init Relationships
				$relationships = [];
				// Fetch Relationships
				$relations = $this->Auth->query('SELECT * FROM `relationships` WHERE (`relationship_1` = ? AND `link_to_1` = ?) OR (`relationship_2` = ? AND `link_to_2` = ?) OR (`relationship_3` = ? AND `link_to_3` = ?)',[
					$request,
					$ticket['id'],
					$request,
					$ticket['id'],
					$request,
					$ticket['id'],
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

	public function delete($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			// Fetch Ticket
			$ticket = $this->Auth->read('tickets',$data['id']);
			if($ticket != null){
				$ticket = $this->Auth->read('tickets',$data['id'])->all()[0];
				// Init Relationships
				$relationships = [];
				// Fetch Relationships
				$relations = $this->Auth->query('SELECT * FROM `relationships` WHERE (`relationship_1` = ? AND `link_to_1` = ?) OR (`relationship_2` = ? AND `link_to_2` = ?) OR (`relationship_3` = ? AND `link_to_3` = ?)',[
					$request,
					$ticket['id'],
					$request,
					$ticket['id'],
					$request,
					$ticket['id'],
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

	public function create($request = null, $data = null){
		// Create Ticket
		$ticket = parent::create($request, $data);
		$ticket = $ticket['output']['raw'];
		// Create Status
		foreach($this->Auth->read('statuses',$ticket['status'],'order')->all() as $statuses){
			if($statuses['type'] == "tickets"){ $status = $statuses; }
		}
		$relationship = $this->Auth->create('relationships',[
			'relationship_1' => 'tickets',
			'link_to_1' => $ticket['id'],
			'relationship_2' => 'statuses',
			'link_to_2' => $status['id'],
		]);
		// Create Priority
		foreach($this->Auth->read('priorities',$ticket['priority'],'order')->all() as $priorities){
			if($priorities['type'] == "tickets"){ $priority = $priorities; }
		}
		$relationship = $this->Auth->create('relationships',[
			'relationship_1' => 'tickets',
			'link_to_1' => $ticket['id'],
			'relationship_2' => 'priorities',
			'link_to_2' => $priority['id'],
		]);
		return [
			"success" => $this->Language->Field["Record successfully created"],
			"request" => $request,
			"data" => $data,
			"output" => [
				'results' => $this->convertToDOM($ticket),
				'raw' => $ticket,
			],
		];
	}

	public function get($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			// Fetch Ticket
			$ticket = $this->Auth->read('tickets',$data['id'])->all()[0];
			// Init Relationships
			$relationships = [];
			// Fetch Relationships
			$relations = $this->Auth->query('SELECT * FROM `relationships` WHERE (`relationship_1` = ? AND `link_to_1` = ?) OR (`relationship_2` = ? AND `link_to_2` = ?) OR (`relationship_3` = ? AND `link_to_3` = ?)',[
				$request,
				$ticket['id'],
				$request,
				$ticket['id'],
				$request,
				$ticket['id'],
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
					$details[$relation['relationship']]['raw'][$relation['link_to']] = $this->Auth->read($relation['relationship'],$relation['link_to'])->all()[0];
					$details[$relation['relationship']]['dom'][$relation['link_to']] = $this->convertToDOM($details[$relation['relationship']]['raw'][$relation['link_to']]);
				}
			}
			// Return
			return [
				"success" => $this->Language->Field["This request was successfull"],
				"request" => $request,
				"data" => $data,
				"output" => [
					'ticket' => ['dom' => $this->convertToDOM($ticket), 'raw' => $ticket],
					'relationships' => $relationships,
					'details' => $details,
				],
			];
		}
	}

	public function comment($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			// Fetch Ticket
			$ticket = $this->Auth->read('tickets',$data['link_to'])->all()[0];
			// Create Comment
			$comment = $this->Auth->create('comments',$data);
			$comment = $this->Auth->read('comments',$comment)->all()[0];
			// Create Relationship
			$relationship = $this->Auth->create('relationships',[
				'relationship_1' => 'tickets',
				'link_to_1' => $ticket['id'],
				'relationship_2' => 'comments',
				'link_to_2' => $comment['id'],
			]);
			$relationship = $this->Auth->read('relationships',$relationship)->all()[0];
			// Return
			return [
				"success" => $this->Language->Field["This request was successfull"],
				"request" => $request,
				"data" => $data,
				"output" => [
					'ticket' => ['dom' => $this->convertToDOM($ticket), 'raw' => $ticket],
					'comment' => ['dom' => $this->convertToDOM($comment), 'raw' => $comment],
					'relationship' => ['dom' => $this->convertToDOM($relationship), 'raw' => $relationship],
				],
			];
		}
	}

	public function note($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			// Fetch Record
			$ticket = $this->Auth->read('tickets',$data['link_to'])->all()[0];
			// Update Status
			$status = null;
			if($ticket['status'] != $data['status']){
				$ticket['status'] = $data['status'];
				$this->Auth->update('tickets',$ticket,$ticket['id']);
				$ticket = $this->Auth->read('tickets',$ticket['id'])->all()[0];
				// Create Relationship
				foreach($this->Auth->read('statuses',$ticket['status'],'order')->all() as $statuses){
					if($statuses['type'] == "tickets"){ $status = $statuses; }
				}
				$relationship = $this->Auth->create('relationships',[
					'relationship_1' => 'tickets',
					'link_to_1' => $ticket['id'],
					'relationship_2' => 'statuses',
					'link_to_2' => $status['id'],
				]);
			}
			// Update Priority
			$priority = null;
			if($ticket['priority'] != $data['priority']){
				$ticket['priority'] = $data['priority'];
				$this->Auth->update('tickets',$ticket,$ticket['id']);
				$ticket = $this->Auth->read('tickets',$ticket['id'])->all()[0];
				// Create Relationship
				foreach($this->Auth->read('priorities',$ticket['priority'],'order')->all() as $priorities){
					if($priorities['type'] == "tickets"){ $priority = $priorities; }
				}
				$relationship = $this->Auth->create('relationships',[
					'relationship_1' => 'tickets',
					'link_to_1' => $ticket['id'],
					'relationship_2' => 'priorities',
					'link_to_2' => $priority['id'],
				]);
			}
			// Create Note
			$note = $this->Auth->create('notes',$data);
			$note = $this->Auth->read('notes',$note)->all()[0];
			// Create Relationship
			$relationship = $this->Auth->create('relationships',[
				'relationship_1' => 'tickets',
				'link_to_1' => $ticket['id'],
				'relationship_2' => 'notes',
				'link_to_2' => $note['id'],
			]);
			$relationship = $this->Auth->read('relationships',$relationship)->all()[0];
			// Return
			return [
				"success" => $this->Language->Field["This request was successfull"],
				"request" => $request,
				"data" => $data,
				"output" => [
					'ticket' => ['dom' => $this->convertToDOM($ticket), 'raw' => $ticket],
					'note' => ['dom' => $this->convertToDOM($note), 'raw' => $note],
					'relationship' => ['dom' => $this->convertToDOM($relationship), 'raw' => $relationship],
					'status' => $status,
					'priority' => $priority,
				],
			];
		}
	}

	public function update($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			if(isset($data['record'])){
				return parent::update($request, $data['record'], $data['record']['id']);
			}
		}
	}

	public function automaton($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			if(strpos($data['record']['title'], 'Ticket#') !== false){
				foreach(explode(" ", $data['record']['title']) as $tag){if(strpos($tag, 'Ticket#') !== false){ $data['record']['id'] = $tag; }}
				if(isset($data['record']['id'])){
					$data['record']['id'] = substr($data['record']['id'], strpos($data['record']['id'], "Ticket#") + 7);
					// Lookup Ticket
					$ticket = $this->Auth->read('tickets',$data['record']['id']);
					if($ticket != null){
						// Fetch Ticket
						$ticket = $ticket->all()[0];
						// Lookup User
						$user = $this->Auth->read('users',$data['record']['email'],'email');
						if($user != null){
							// Fetch User
							$user = $user->all()[0];
							// Init Messages
							$messages = [];
							// Init Relationships
							$relationships = [];
							// Fetch Relationships
							$relations = $this->Auth->query('SELECT * FROM `relationships` WHERE (`relationship_1` = ? AND `link_to_1` = ?) OR (`relationship_2` = ? AND `link_to_2` = ?) OR (`relationship_3` = ? AND `link_to_3` = ?)',[
								$request,
								$ticket['id'],
								$request,
								$ticket['id'],
								$request,
								$ticket['id'],
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
								'relationship' => 'tickets',
								'link_to' => $ticket['id'],
							];
							$comment = $this->Auth->create('comments', $comment);
							$comment = $this->Auth->read('comments', $comment)->all()[0];
							$relationship = $this->Auth->create('relationships',[
								'relationship_1' => 'tickets',
								'link_to_1' => $ticket['id'],
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
										if((isset($contact['email']))&&($contact['email'] != $user['email'])){
											// Send Internal Notifications
											if(isset($contact['username'])){
												parent::create('notifications',[
													'icon' => 'icon icon-comment mr-2',
													'subject' => 'You have receive a reply',
													'dissmissed' => 1,
													'user' => $contact['id'],
													'href' => '?p=tickets&v=details&id='.$ticket['id'],
												]);
											}
											// Send Mail Notifications
											$message = [
												'email' => $contact['email'],
												'message' => $comment['content'],
												'extra' => [
													'from' => $user['email'],
													'replyto' => $this->Settings['contacts']['tickets'],
													'subject' => "ALB Connect -"." ID:".$ticket['id']." BoL:".$ticket['bill_of_lading']." Ticket:".$ticket['id'],
												],
											];
											array_push($messages,$message);
											$this->Auth->Mail->send($message['email'],$message['message'],$message['extra']);
										}
									}
								}
							}
							return [ "success" => "Comment from ".$data['record']['email']." added to ".$ticket['id'] ];
						} else { return [ "error" => "User not found" ]; }
					} else { return [ "error" => "Record not Found" ]; }
				} else { return [ "error" => "Unable to retreive ID" ]; }
			} else {
				// Lookup User
				$entity = $this->Auth->read('users',$data['record']['email'],'email');
				if($entity != null){
					// Fetch User
					$entity = $entity->all()[0];
				} else {
					// Lookup Contact
					$entity = $this->Auth->read('contacts',$data['record']['email'],'email');
					if($entity != null){
						// Fetch Contact
						$entity = $entity->all()[0];
					}
				}
				if($entity != null){
					// Setup Entity in Record
					if(isset($entity['username'])){
						$data['record']['user'] = $entity['id'];
						$data['record']['client'] = $entity['client'];
						$data['record']['phone'] = $entity['phone'];
					} else {
						unset($data['record']['user']);
						$data['record']['client'] = $entity['link_to'];
						$data['record']['phone'] = $entity['phone'];
					}
					// Init Subscriptions
					$subscriptions = [];
					// Init Subscribed
					$subscribed = [ 'users' => [], 'contacts' => [], 'clients' => []];
					// Init Sub-Categories
					$sub_category = [];
					// Init Messages
					$messages = [];
					// Init Notifications
					$notifications = [];
					// Init Contacts
					$contacts = [];
					// Init Users
					$users = [];
					// Init Relationships
					$relationships = [];
					// Fetch Category
					$category = $this->Auth->query('SELECT * FROM `categories` WHERE `name` = ? AND `relationship` = ?','Tickets','subscriptions')->fetchAll()->all()[0];
					// Fetch Sub Categories
					$sub_categories = $this->Auth->query('SELECT * FROM `sub_categories` WHERE `relationship` = ?','subscriptions')->fetchAll()->all();
					foreach($sub_categories as $subs){
						$sub_category[$subs['name']] = $subs;
						// Fetch Subscriptions
						$list = $this->Auth->query('SELECT * FROM `subscriptions` WHERE `category` = ? AND `sub_category` = ?',$category['id'],$subs['id'])->fetchAll()->all();
						foreach($list as $subscription){ $subscriptions[$subs['name']][$subscription['relationship']][$subscription['link_to']] = $subscription; }
					}
					// Fetch Client
					$client = $this->Auth->read('clients',$data['record']['client']);
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
						// Create Ticket
						$data['record']['status'] = 1;
						$data['record']['priority'] = 1;
						$ticketID = $this->Auth->create($request, $data['record']);
						// Fetch Ticket
						$ticket = $this->Auth->read('tickets',$ticketID)->all()[0];
						// Create Priority Relationship
						foreach($this->Auth->read('priorities',$ticket['priority'],'order')->all() as $priorities){
							if($priorities['type'] == "tickets"){ $priority = $priorities; }
						}
						$relationship = $this->Auth->create('relationships',[
							'relationship_1' => 'tickets',
							'link_to_1' => $ticket['id'],
							'relationship_2' => 'priorities',
							'link_to_2' => $priority['id'],
						]);
						// Create Status Relationship
						foreach($this->Auth->read('statuses',$ticket['status'],'order')->all() as $statuses){
							if($statuses['type'] == "tickets"){ $status = $statuses; }
						}
						$relationship = $this->Auth->create('relationships',[
							'relationship_1' => 'tickets',
							'link_to_1' => $ticket['id'],
							'relationship_2' => 'statuses',
							'link_to_2' => $status['id'],
						]);
						// Create Entity Relationships
						if(isset($entity['username'])){
							// Create User Relationship
							$relationship = $this->Auth->create('relationships',[
								'relationship_1' => 'tickets',
								'link_to_1' => $ticket['id'],
								'relationship_2' => 'users',
								'link_to_2' => $entity['id'],
							]);
							array_push($subscribed['users'], $entity['id']);
						} else {
							// Create Contact Relationship
							$relationship = $this->Auth->create('relationships',[
								'relationship_1' => 'tickets',
								'link_to_1' => $ticket['id'],
								'relationship_2' => 'contacts',
								'link_to_2' => $entity['id'],
							]);
							array_push($subscribed['contacts'], $entity['id']);
						}
						// Create Client Relationship
						$relationship = $this->Auth->create('relationships',[
							'relationship_1' => 'tickets',
							'link_to_1' => $ticket['id'],
							'relationship_2' => 'clients',
							'link_to_2' => $client['id'],
						]);
						array_push($subscribed['clients'], $client['id']);
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
														'relationship_1' => 'tickets',
														'link_to_1' => $ticket['id'],
														'relationship_2' => $subscription['relationship'],
														'link_to_2' => $subscription['link_to'],
													]);
												}
												break;
											case"users":
												if(isset($users[$subscription['link_to']])){
													$this->Auth->create('relationships',[
														'relationship_1' => 'tickets',
														'link_to_1' => $ticket['id'],
														'relationship_2' => $subscription['relationship'],
														'link_to_2' => $subscription['link_to'],
													]);
												}
												break;
											default:
												$this->Auth->create('relationships',[
													'relationship_1' => 'tickets',
													'link_to_1' => $ticket['id'],
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
							$ticket['id'],
							$request,
							$ticket['id'],
							$request,
							$ticket['id'],
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
										if((isset($subscriptions['New']['users'][$contact['id']]))||(isset($subscriptions['New']['contacts'][$contact['id']]))||($ticket['email'] == $contact['email'])){
											// Send Internal Notifications
											if(isset($contact['username'])){
												if(!isset($messages[$contact['email']])){
													$notification = parent::create('notifications',[
														'icon' => 'icon icon-ticket mr-2',
														'subject' => 'You have a new ticket',
														'dissmissed' => 1,
														'user' => $contact['id'],
														'href' => '?p=tickets&v=details&id='.$ticket['id'],
													]);
													$notifications[$contact['username']] = $notification;
												}
											}
											// Send Mail Notifications
											if(isset($contact['email'])){
												if(!isset($messages[$contact['email']])){
													$message = [
														'email' => $contact['email'],
														'message' => "<p><h1>A new ticket has been created.</h1></p><hr><br>\n".$ticket['content']."<br>\n<hr><p><h4>Please reply to this email to post on your ticket.</h4></p>",
														'extra' => [
															'from' => $entity['email'],
															'replyto' => $this->Settings['contacts']['tickets'],
															'subject' => "ALB Connect - New Ticket#".$ticket['id'],
															'href' => '?p=tickets&v=details&id='.$ticket['id'],
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
						// Return
						return [
							"success" => $this->Language->Field["Record successfully created"],
							"request" => $request,
							"data" => $data,
							"output" => [
								'results' => $this->convertToDOM($ticket),
								'raw' => $ticket,
								'relationships' => $relationships,
								'subscriptions' => $subscriptions,
								'messages' => $messages,
								'notifications' => $notifications,
								'contacts' => $contacts,
								'users' => $users,
							],
						];
					} else { return [ "error" => "Client not Found" ]; }
				} else { return [ "error" => "User/Contact not Found" ]; }
			}
		} else { return [ "error" => "No data provided" ]; }
	}
}
