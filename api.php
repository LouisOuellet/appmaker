<?php
session_start();

// Import Librairies
require_once dirname(__FILE__).'/src/lib/api.php';
require_once dirname(__FILE__).'/src/lib/url.php';

$URL = new URLparser();

if(!empty($_POST)){
	// Decoding
	// var_dump($_POST);
	foreach($_POST as $key => $value){ $_POST[$key] = $URL->decode($value); }
	// var_dump($_POST);
	// Parse
	foreach($_POST as $key => $value){ $_POST[$key] = $URL->parse($value); }
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
							if(isset($_POST['data'])){ $data = $_POST['data']; } else { $data = []; }

							// Handling API Request
							if(isset($_POST['type'])){
								$method = $_POST['type'];
								switch($method){
									case"initialize":
										if(method_exists($API,'initApp')){ $return = $API->initApp(); }
										else {
											$return = [
												"error" => $API->Language->Field["Unknown Request"],
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
					"api" => [
						"name" => $trigger,
						"class" => $request,
						"file" => $file,
					],
					"code" => 500,
				];
			}
		}
		// Encode and Print
		$return['request'] = $_POST;
		$encoding = $URL->encode($return);
		// echo "\n[Return]\n";
		// var_dump($return);
		// echo "\n[Encoding]\n";
		// var_dump($encoding);
		// echo "\n[Decoding]\n";
		// var_dump($URL->decode($encoding));
		// echo "\n[Decoding Extended]\n";
		// $string = $encoding;
		// echo "\n[Trim]\n";
		// $string = trim($string);
		// var_dump($string);
		// echo "\n[url if]\n";
		// var_dump(($URL->is_url_encoded($string)));
		// echo "\n[url decode]\n";
		// $string = urldecode($string);
		// var_dump($string);
		// echo "\n[base64 if]\n";
		// var_dump(($URL->is_base64_encoded($string)));
		// echo "\n[base64 decode]\n";
		// $string = base64_decode($string);
		// var_dump($string);
		echo $encoding;
	}
}
