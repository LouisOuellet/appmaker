<?php

require_once dirname(__FILE__,3).'/plugins/automatons/api.php';

// $API = new automatonsAPI();
//
// $cron = $API->mail_to_api('automatons',[
// 	'imap' => [
// 		'host' => $this->Settings['imap']['tickets']['host'],
// 		'port' => $this->Settings['imap']['tickets']['port'],
// 		'encryption' => $this->Settings['imap']['tickets']['encryption'],
// 		'username' => $this->Settings['imap']['tickets']['username'],
// 		'password' => $this->Settings['imap']['tickets']['password'],
// 	],
// 	'headers' => [
// 		'subject' => 'title',
// 		'body' => 'content',
// 		'from' => 'email',
// 	],
// 	'request' => 'tickets',
// 	'method' => 'token',
// 	'token' => $this->Settings['API']['token'],
// 	'type' => 'automaton',
// ]);
// 
// if((isset($this->Settings['debug']))&&($this->Settings['debug'])){ echo json_encode($cron, JSON_PRETTY_PRINT); }
