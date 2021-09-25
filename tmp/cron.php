<?php

require_once dirname(__FILE__,3).'/plugins/organizations/api.php';

$API = new organizationsAPI();

$filename = dirname(__FILE__,3).'/tmp/contacts.csv';
$data = [];

// open the file
$f = fopen($filename, 'r');

if ($f === false) { die('Cannot open the file ' . $filename); }

// read each line in CSV file at a time
while (($row = fgetcsv($f)) !== false) {
	$data[] = $row;
}

// close the file
fclose($f);

foreach($data as $row){
  if(!in_array($row[0],['ALBCIE','ALBC0426','ALBL0426','ALBG0426']))
  $organization = $API->Auth->query('SELECT * FROM `organizations` WHERE `itmr4_code` LIKE ?',$row[0])->fetchAll()->all();
  if(empty($organization)){ $organization = $API->Auth->query('SELECT * FROM `organizations` WHERE `code` LIKE ?',$row[0])->fetchAll()->all(); }
  if(!empty($organization)){
    if(!isset($organization['id'])){ $organization = $organization[0]; }
    if(isset($organization['id'])){
      if(isset($row[2]) && $row[2] != '' && $organization['fax'] != '' && $organization['fax'] != null){ $organization['fax'] = $row[2]; }
      if(isset($row[4]) && $row[4] != '' && $organization['phone'] != '' && $organization['phone'] != null){ $organization['phone'] = $row[4]; }
      if(isset($row[3])){
        foreach(explode(",",$row[3]) as $email){
          $email = strtolower($email);
          $update = true;
          $domains = ['albcustoms.com','albcie.com','alblogistique.com','albgroupe.com','albass.com','albglobal.com','videotron.ca','gmail.com','aol.com','outlook.com'];
          foreach($domains as $domain){ if(strpos($email, $domain) !== false){ $update = false; } }
          if($update && $email != '' && $organization['email'] != '' && $organization['email'] != null){
            $organization['email'] = $email;
            $update = true;
            $domains = ['videotron.ca','gmail.com','aol.com','outlook.com','live.ca','hotmail.com','atlascargo.com','groupestch.com','descartes.com','lymanworldwide.com'];
            foreach($domains as $domain){ if(strpos($email, $domain) !== false){ $update = false; } }
            if($update){ $meta = explode('@', $email);$organization['setDomain'] = end($meta); }
          }
        }
      }
      $organization["modified"] = date("Y-m-d H:i:s");
      $organization["updated_by"] = $API->Auth->User['id'];
      $query = $API->Auth->query('UPDATE `organizations` SET
        `modified` = ?,
        `updated_by` = ?,
        `fax` = ?,
        `phone` = ?,
        `email` = ?,
        `setDomain` = ?
      WHERE `id` = ?',[
        $organization["modified"],
        $organization["updated_by"],
        $organization["fax"],
        $organization["phone"],
        $organization["email"],
        $organization["setDomain"],
        $organization["id"]
      ]);
      set_time_limit(20);
      $dump = $query->dump();
    }
  }
}
