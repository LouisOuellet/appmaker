<?php
session_start();

// Import API
require_once dirname(__FILE__) . '/src/lib/api.php';

// Start API
$API = new API();

// Load Plugin's API
$API->loadFiles('api.php', 'api', 3);

if(!empty($_POST)){
	if(isset($_POST['data'])){
		if($API->isJson($_POST['data'])){
			$decodedJSON = json_decode($decodedURI, true);
		} else {
			$decodedBase64 = base64_decode($_POST['data']);
			$decodedURI = urldecode($decodedBase64);
			$decodedJSON = json_decode($decodedURI, true);
		}
	} else {
		$decodedJSON = [];
	}
	if(isset($_POST['method'])){
		switch($_POST['method']){
			case "token":
				if(isset($_POST['token'])){
					$API->Auth->loginToken($_POST['token']);
				} else {
					echo "No Token Received";
				}
				break;
			case "auth":
				if(isset($_POST['username'],$_POST['password'])){
					$API->Auth->login($_POST['username'],$_POST['password']);
				} else {
					echo "No Login Data Received";
				}
				break;
			case "session":
				// if(!empty($_SESSION)){ var_dump($_SESSION[$API->Settings['id']]); }
				break;
		}
	} else {
		$return = [
			"error" => $API->Language->Field["unknown authentication method"],
			"request" => $_POST,
		];
	}
	if($API->Auth->isLogin()){
		if((!isset($API->Settings['maintenance']))||(!$API->Settings['maintenance'])){
			if((isset($_POST['request'],$_POST['type']))&&($_POST['request'] == 'api')&&($_POST['type'] == 'initialize')){
				$return = $API->initApp();
			} elseif((isset($_POST['request'],$_POST['type']))&&($_POST['request'] == 'api')&&($_POST['type'] == 'getLanguage')){
				$return = $API->getLanguage();
			} elseif((isset($_POST['request'],$_POST['type']))&&($_POST['request'] == 'smtp')&&($_POST['type'] == 'send')){
				if(isset($decodedJSON['extra'])){$API->Auth->Mail->send($decodedJSON['email'],$decodedJSON['message'],$decodedJSON['extra']);}
				else{$API->Auth->Mail->send($decodedJSON['email'],$decodedJSON['message']);}
				$return = [
					"success" => $API->Language->Field["Message sent"],
					"request" => $_POST,
				];
			} else {
				if((isset($_POST['request']))&&(class_exists($_POST['request'].'API'))){
					$request = $_POST['request'].'API';
					$request = new $request();
					if((isset($_POST['type']))&&(method_exists($request,$_POST['type']))){
						$return = $_POST['type'];
						if(isset($decodedJSON)){ $return = $request->$return($_POST['request'], $decodedJSON); }
						else { $return = $request->$return($_POST['request'], null); }
					} else {
						$return = [
							"error" => $API->Language->Field["unknown request type"],
							"request" => $_POST,
						];
					}
				} else {
					if((isset($_POST['request']))&&(!$API->Auth->valid('api',$_POST['request'],1))){
						$return = [
							"error" => $API->Language->Field["Insuffisant priviledges"],
							"request" => $_POST,
						];
					} else {
						$return = [
							"error" => $API->Language->Field["unknown request"],
							"request" => $_POST,
						];
					}
				}
			}
		} else {
			$return = [
				"error" => $API->Language->Field["Server under maintenance"],
				"request" => $_POST,
				"code" => 500,
			];
		}
	} else {
		$return = [
			"error" => $API->Language->Field["no login info"],
			"request" => $_POST,
			"code" => 403,
		];
	}
} else {
	$return = [
		"error" => $API->Language->Field["no request received"],
		"request" => $_POST,
		"code" => 404,
	];
}
if(!isset($return) || $return == "null" || $return == null || $return == ""){
	$return = [
		"error" => $API->Language->Field["nothing returned"],
		"request" => $_POST,
	];
}
echo base64_encode(urlencode(json_encode($return, JSON_PRETTY_PRINT)));
?>
