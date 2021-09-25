<?php
session_start();

// Import API
require_once dirname(__FILE__) . '/src/lib/api.php';

// Start API
$API = new API();

// Load Plugin's API
$API->loadFiles('api.php', 'api', 3);

// List of Commands to Run
$cmds = [];

if((defined('STDIN'))&&(!empty($argv[1]))){
  foreach($argv as $key => $cmd){
    if(($cmd != "cli.php")&&(strpos($cmd,'--') === 0)&&(!array_key_exists($cmd,$cmds))){
      $cmds[$cmd] = [];
      $count = $key+1;
      if(isset($argv[$count])){ $arg = $argv[$count]; }
			else { $arg = ''; }
      while(strpos($arg,'--') === FALSE){
        if($count<count($argv)){
          array_push($cmds[$cmd],$argv[$count]);
          $count++;
          if(isset($argv[$count])){ $arg = $argv[$count]; }
        } else { break; }
      }
    }
  }
} else { echo "{'error': 'No Argument Supplied'}"; exit; }
foreach($cmds as $key => $args){
  $method = str_replace('-','_',$key);
  if(method_exists($API,$method)){
    $response = $API->$method($args);
		if(($response != null)&&($response != "null")){ echo json_encode($response, JSON_PRETTY_PRINT); }
  } else { echo "{'error': 'Unknow Function'}"; exit; }
}
