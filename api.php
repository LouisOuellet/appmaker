<?php
session_start();

// Import API
require_once dirname(__FILE__).'/src/lib/api.php';

if(!empty($_POST)){
	if(isset($_POST['request'])){
		$trigger = $_POST['request'];
		// Import API
		$file = dirname(__FILE__).'/plugins/'.$trigger.'/'.'api.php';
		if(is_file($file)){ require_once $file;$request = $trigger.'API'; }
		else { $request = 'API'; }

		// Start API
		if(class_exists($request)){ $API = new $request(); }
		else {
			$return = [
				"error" => $API->Language->Field["Unknown API"],
				"request" => $_POST,
				"api" => [
					"name" => $trigger,
					"class" => $request,
					"file" => $file,
				],
				"code" => 404,
			];
		}

		if(!isset($return)){
			// Maintenance Verification
			if((!isset($API->Settings['maintenance']))||(!$API->Settings['maintenance'])){

				// Login User
				if(isset($_POST['method'])){
					switch($_POST['method']){
						case "token":
							if(isset($_POST['token'])){ $API->Auth->loginToken($_POST['token']); }
							else {
								$return = [
									"error" => $API->Language->Field["No Token Received"],
									"request" => $_POST,
									"api" => [
										"name" => $trigger,
										"class" => $request,
										"file" => $file,
									],
									"code" => 403,
								];
							}
							break;
						case "auth":
							if(isset($_POST['username'],$_POST['password'])){ $API->Auth->login($_POST['username'],$_POST['password']); }
							else {
								$return = [
									"error" => $API->Language->Field["No Login Data Received"],
									"request" => $_POST,
									"api" => [
										"name" => $trigger,
										"class" => $request,
										"file" => $file,
									],
									"api" => $trigger,
									"code" => 403,
								];
							}
							break;
						case "session":
							// In this case, user is logged in during API initialization
							break;
					}
					if(!isset($return)){
						if($API->Auth->isLogin()){

							// Initialize Data
							if(isset($_POST['data'])){
								if($API->isJson($_POST['data'])){ $data = json_decode($decodedURI, true); }
								else { $data = json_decode(urldecode(base64_decode($_POST['data'])), true); }
							} else { $data = []; }

							// Handling API Request
							if(isset($_POST['type'])){
								$method = $_POST['type'];
								switch($method){
									case"initialize":
										if(method_exists($API,'initApp')){ $return = $API->initApp(); }
										else {
											$return = [
												"error" => $API->Language->Field["Unknown Request"],
												"request" => $_POST,
												"api" => [
													"name" => $trigger,
													"class" => $request,
													"file" => $file,
												],
												"code" => 404,
											];
										}
										break;
									case"getLanguage":
										if(method_exists($API,$method)){ $return = $API->getLanguage(); }
										else {
											$return = [
												"error" => $API->Language->Field["Unknown Request"],
												"request" => $_POST,
												"api" => [
													"name" => $trigger,
													"class" => $request,
													"file" => $file,
												],
												"code" => 404,
											];
										}
										break;
									case"send":
										if(property_exists($API,'Auth') && property_exists($API->Auth,'Mail') && method_exists($API->Auth->Mail,$method)){
											if(isset($data['extra'])){$API->Auth->Mail->send($data['email'],$data['message'],$data['extra']);}
											else{$API->Auth->Mail->send($data['email'],$data['message']);}
											$return = ["success" => $API->Language->Field["Message Sent"]];
										}
										else {
											$return = [
												"error" => $API->Language->Field["Unknown Request"],
												"request" => $_POST,
												"api" => [
													"name" => $trigger,
													"class" => $request,
													"file" => $file,
												],
												"code" => 404,
											];
										}
										break;
									default:
										if(method_exists($API,$method)){
											if($API->Auth->valid('api',$trigger,1)){
												$return = $API->$method($trigger, $data);
											} else {
												$return = [
													"error" => $API->Language->Field["Insuffisant Priviledges"],
													"request" => $_POST,
													"api" => [
														"name" => $trigger,
														"class" => $request,
														"file" => $file,
													],
													"code" => 403,
												];
											}
										}
										else {
											$return = [
												"error" => $API->Language->Field["Unknown Request"],
												"request" => $_POST,
												"api" => [
													"name" => $trigger,
													"class" => $request,
													"file" => $file,
												],
												"code" => 404,
											];
										}
										break;
								}
							} else {
								$return = [
									"error" => $API->Language->Field["Unknown Request"],
									"request" => $_POST,
									"api" => [
										"name" => $trigger,
										"class" => $request,
										"file" => $file,
									],
									"code" => 404,
								];
							}
						} else {
							$return = [
								"error" => $API->Language->Field["Unable to Login User"],
								"request" => $_POST,
								"api" => [
									"name" => $trigger,
									"class" => $request,
									"file" => $file,
								],
								"code" => 403,
							];
						}
					}
				} else {
					$return = [
						"error" => $API->Language->Field["Unknown Authentication Method"],
						"request" => $_POST,
						"api" => [
							"name" => $trigger,
							"class" => $request,
							"file" => $file,
						],
						"code" => 403,
					];
				}
			} else {
				$return = [
					"error" => $API->Language->Field["Server Under Maintenance"],
					"request" => $_POST,
					"api" => [
						"name" => $trigger,
						"class" => $request,
						"file" => $file,
					],
					"code" => 500,
				];
			}
		}
		// Encoded JSON Response
		echo base64_encode(urlencode(json_encode($return, JSON_PRETTY_PRINT)));
	}
}
