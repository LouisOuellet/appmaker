<?php

require_once dirname(__FILE__,3).'/plugins/automatons/api.php';

// $API = new automatonsAPI();
//
// $cron = $API->mail_to_api('automatons',[
// 	'imap' => [
// 		'host' => $this->Settings['imap']['containers']['host'],
// 		'port' => $this->Settings['imap']['containers']['port'],
// 		'encryption' => $this->Settings['imap']['containers']['encryption'],
// 		'username' => $this->Settings['imap']['containers']['username'],
// 		'password' => $this->Settings['imap']['containers']['password'],
// 	],
// 	'headers' => [
// 		'subject' => 'subject',
// 		'body' => 'content',
// 		'from' => 'email',
// 	],
// 	'request' => 'containers',
// 	'method' => 'token',
// 	'token' => $this->Settings['API']['token'],
// 	'type' => 'automaton',
// ]);
// 
// if((isset($this->Settings['debug']))&&($this->Settings['debug'])){ echo json_encode($cron, JSON_PRETTY_PRINT); }
