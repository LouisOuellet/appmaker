<?php

// Import Librairies
require_once dirname(__FILE__,3) . '/src/lib/lsp.php';

class Installer {

  protected $Manifest = [];
  protected $Settings = [];
  protected $Plugins = [];
  protected $Structure = [];
  protected $Skeletons = [];
  protected $Samples = [];
  protected $LSP;
  protected $Database;
  protected $Connection;
	protected $Query;
	protected $Log;
  protected $QueryClosed = TRUE;

  public function __construct(){

    // Increase PHP memory limit
    ini_set('max_execution_time','2400');
    ini_set('memory_limit','2048M');

    // Import Data
    $this->Manifest = json_decode(file_get_contents(dirname(__FILE__,3) . '/dist/data/manifest.json'),true);
    $this->Plugins = json_decode(file_get_contents(dirname(__FILE__,3) . '/dist/data/plugins.json'),true);

    // Init Installer
    if(file_exists(dirname(__FILE__,3).'/dist/data/structure.json')){ $this->Structure = json_decode(file_get_contents(dirname(__FILE__,3) . '/dist/data/structure.json'),true); }
    if(file_exists(dirname(__FILE__,3).'/dist/data/skeleton.json')){ $this->Skeletons = json_decode(file_get_contents(dirname(__FILE__,3) . '/dist/data/skeleton.json'),true); }
    if(file_exists(dirname(__FILE__,3).'/dist/data/sample.json')){ $this->Samples = json_decode(file_get_contents(dirname(__FILE__,3) . '/dist/data/sample.json'),true); }
    $resume = (5+count($this->Structure)+count($this->Skeletons)+count($this->Manifest['plugins'])+1);
    if((isset($_POST['site_sample']))&&($_POST['site_sample'] == 'true')){ $resume = $resume + count($this->Samples); }
    if(is_file(dirname(__FILE__,3) . '/tmp/resume.install')){ unlink(dirname(__FILE__,3) . '/tmp/resume.install'); }
    file_put_contents(dirname(__FILE__,3) . '/tmp/resume.install', $resume.PHP_EOL , FILE_APPEND | LOCK_EX);

    // Init Log
    $this->Log = dirname(__FILE__,3) . '/tmp/install.log';
    if(is_file($this->Log)){ unlink($this->Log); }
    $this->log("====================================================");
    $this->log("  Installation Log ".date("Y-m-d H:i:s")."");
    $this->log("====================================================");
    $this->log("\n");

    // Set SQL Config
    $this->Settings['sql']['host'] = $_POST['sql_host'];
    $this->Settings['sql']['database'] = $_POST['sql_database'];
    $this->Settings['sql']['username'] = $_POST['sql_username'];
    $this->Settings['sql']['password'] = $_POST['sql_password'];

    // Test SQL
    if($this->configDB()){
      $this->log("SQL Database Connexion Successfull!");

      // Prepare Settings
      $this->Settings = $this->Manifest;
      $this->Settings['id'] = $this->generateRandomString(64);
      $this->Settings['serverid'] = password_hash(md5($_SERVER['DOCUMENT_ROOT'].$_SERVER['SCRIPT_FILENAME'].$_SERVER['PATH']), PASSWORD_BCRYPT, ['cost' => 10]);
      $this->Settings['title'] = $_POST["site_name"];
      $this->Settings['page'] = $_POST["site_page"];
      $this->Settings['license'] = $_POST["activation_license"];
      $this->Settings['timezone'] = $_POST['site_timezone'];
      $this->Settings['background_jobs'] = $_POST["site_background_jobs"];
      $this->Settings['last_background_jobs'] = date("Y-m-d H:i:s");
      $this->Settings['sql']['host'] = $_POST['sql_host'];
      $this->Settings['sql']['database'] = $_POST['sql_database'];
      $this->Settings['sql']['username'] = $_POST['sql_username'];
      $this->Settings['sql']['password'] = $_POST['sql_password'];

      // Set Timezone
      date_default_timezone_set($this->Settings['timezone']);

      // Set LSP
      if(isset($this->Manifest['lsp']['required'],$this->Settings['license'])&&$this->Manifest['lsp']['required']){
        $this->LSP = new LSP($this->Manifest['lsp']['host'],$this->Manifest['lsp']['application'],$this->Settings['license'],$this->Manifest['lsp']['token']);
      } else { $this->LSP = new LSP(); }
    	if($this->LSP->Status){
        // Connect LSP SQL
        $this->LSP->configdb($this->Settings['sql']['host'],$this->Settings['sql']['username'],$this->Settings['sql']['password'],$this->Settings['sql']['database']);
        if(isset($this->Manifest['lsp']['required'])&&$this->Manifest['lsp']['required']){ $this->log("Application Activation Successfull!"); }

        // Is Application Already Installed?
        if(!file_exists(dirname(__FILE__,3).'/config/config.json')){

          // Removing Existing Tables
          $this->log("Removing existing tables from the database");
  		    $query = 'SET foreign_key_checks = 1';
  		    if ($this->Connection->query($query) === TRUE){
  		      if($result = $this->Connection->query("SHOW TABLES")){
  		        while($row = $result->fetch_array(MYSQLI_NUM)){
  		          $query = 'DROP TABLE IF EXISTS `'.$row[0].'`';
  		          if ($this->Connection->query($query) === TRUE){ $this->log("Table ".$row[0]." was successfully dropped "); }
                else { $this->log("Error while removing table ".$row[0]." "); }
  		        }
  		      }
            $this->log("Database has been cleared");
  		    } else { $this->log("Error while removing tables".""); }
  		    $query = 'SET foreign_key_checks = 1';
  		    if ($this->Connection->query($query) !== TRUE){ $this->log("Error while removing tables".""); }

          // Enable LSP Logging
          $this->LSP->setLog($this->Log);

          // Creating Database Structure
    			if(file_exists(dirname(__FILE__,3).'/dist/data/structure.json')){
    				$this->LSP->updateStructure(dirname(__FILE__,3).'/dist/data/structure.json');
    				$this->log("Database structure was added successfully");

            // Importing Default Records
            if(file_exists(dirname(__FILE__,3).'/dist/data/skeleton.json')){
    					$this->LSP->insertRecords(dirname(__FILE__,3).'/dist/data/skeleton.json');
    					$this->log("Database default records were created successfully");

              // Importing Sample Records
              if((isset($_POST['site_sample']))&&($_POST['site_sample'] == 'true')){
    						if(file_exists(dirname(__FILE__,3).'/dist/data/sample.json')){
    							$this->LSP->insertRecords(dirname(__FILE__,3).'/dist/data/sample.json');
    							$this->log("Database sample records were created successfully");
    						} else { $this->log("Unable to import the database sample records"); }
    					}

              // Disable LSP Logging
              $this->LSP->setLog(null);

              // Installing Plugins
              foreach($this->Manifest['plugins'] as $plugin => $conf){
                if(!is_dir(dirname(__FILE__,3)."/plugins/".$plugin)){
                  // Install Files
                  $this->log("Installing Plugin [".$plugin."]");
                  shell_exec("git clone --branch ".$this->Settings['repository']['branch']." ".$this->Plugins[$plugin]['repository']['host']['git'].$this->Plugins[$plugin]['repository']['name'].".git"." ".dirname(__FILE__,3)."/tmp/".$this->Plugins[$plugin]['repository']['name']);
                  mkdir(dirname(__FILE__,3)."/plugins/".$plugin);
                  shell_exec("rsync -aP ".dirname(__FILE__,3)."/tmp/".$this->Plugins[$plugin]['repository']['name']."/* ".dirname(__FILE__,3)."/plugins/".$plugin."/.");
                  shell_exec("rm -rf ".dirname(__FILE__,3)."/tmp/".$this->Plugins[$plugin]['repository']['name']);

          				// Updating Database
                  if(is_file(dirname(__FILE__,3)."/plugins/".$plugin.'/dist/data/structure.json')){
                    $this->LSP->updateStructure(dirname(__FILE__,3)."/plugins/".$plugin.'/dist/data/structure.json');
                    $this->log("Database structure was updated with Plugin [".$plugin."]");
                  }
          				if(is_file(dirname(__FILE__,3)."/plugins/".$plugin.'/dist/data/skeleton.json')){
                    $this->log("Database default records were created successfully for [".$plugin."]");
                    $this->LSP->insertRecords(dirname(__FILE__,3)."/plugins/".$plugin.'/dist/data/skeleton.json');
                  }
          				if(is_file(dirname(__FILE__,3)."/plugins/".$plugin.'/dist/data/sample.json')){
                    if((isset($_POST['site_sample']))&&($_POST['site_sample'] == 'true')){
                      $this->log("Database sample records were created successfully for [".$plugin."]");
                      $this->LSP->insertRecords(dirname(__FILE__,3)."/plugins/".$plugin.'/dist/data/sample.json');
                    }
                  }

                  // Set Plugin Settings
                  $this->Settings['plugins'][$plugin] = json_decode(file_get_contents(dirname(__FILE__,3)."/plugins/".$plugin.'/dist/data/manifest.json'),true);
                  if(!isset($this->Settings['plugins'][$plugin]['status'])){$this->Settings['plugins'][$plugin]['status'] = $conf['status'];}
                  $this->log("Plugin [".$plugin."] has been installed");
                } else { $this->log("Plugin [".$plugin."] is already installed"); }
              }

              // Saving Settings
              $json = fopen(dirname(__FILE__,3).'/config/config.json', 'w');
    					fwrite($json, json_encode($this->Settings, JSON_PRETTY_PRINT));
    					fclose($json);

              // Done
    			    $this->log("Installation has completed successfully at ".date("Y-m-d H:i:s")."!");
            } else { $this->log("Unable to import the database default records"); }
          } else { $this->log("Unable to import the database structure"); }
        } else { $this->log("Application is already installed"); }
      } else { $this->log("Unable to activate the application, verify you license key"); }
    } else { $this->log("Unable to connect to SQL Server"); }
    ini_restore('max_execution_time');
  }

  private function configDB() {
    if(isset($this->Settings['sql']['host'],$this->Settings['sql']['database'],$this->Settings['sql']['username'],$this->Settings['sql']['password'])){
      error_reporting(0);
      $this->Connection = new mysqli($this->Settings['sql']['host'], $this->Settings['sql']['username'], $this->Settings['sql']['password'], $this->Settings['sql']['database']);
      error_reporting(-1);
  		if($this->Connection->connect_error){
  			return false;
  		} else {
        $this->Database = $this->Settings['sql']['database'];
        if(isset($this->Settings['sql']['charset'])){ $this->Connection->set_charset($this->Settings['sql']['charset']); } else { $this->Connection->set_charset('utf8'); }
        return true;
      }
    }
	}

  private function log($txt){
    return file_put_contents($this->Log, $txt.PHP_EOL , FILE_APPEND | LOCK_EX);
  }

  private function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
  }

	private function query($query) {
    if (!$this->QueryClosed) {
      $this->Query->close();
    }
		if ($this->Query = $this->Connection->prepare($query)) {
      if (func_num_args() > 1) {
        $x = func_get_args();
        $args = array_slice($x, 1);
				$types = '';
        $args_ref = array();
        foreach ($args as $k => &$arg) {
					if (is_array($args[$k])) {
						foreach ($args[$k] as $j => &$a) {
							$types .= $this->_gettype($args[$k][$j]);
							$args_ref[] = &$a;
						}
					} else {
          	$types .= $this->_gettype($args[$k]);
            $args_ref[] = &$arg;
					}
        }
				array_unshift($args_ref, $types);
        call_user_func_array(array($this->Query, 'bind_param'), $args_ref);
      }
      $this->Query->execute();
     	if ($this->Query->errno) {
				$this->error('Unable to process MySQL query (check your params) - ' . $this->Query->error);
     	}
      $this->QueryClosed = FALSE;
    } else {
      echo $this->error('Unable to prepare MySQL statement (check your syntax) - ' . $this->Connection->error);
  	}
		return $this;
  }

  private function fetchAll($callback = null) {
    $params = array();
    $row = array();
    $meta = $this->Query->result_metadata();
    while ($field = $meta->fetch_field()) {
      $params[] = &$row[$field->name];
    }
    call_user_func_array(array($this->Query, 'bind_result'), $params);
    $result = array();
    while ($this->Query->fetch()) {
      $r = array();
      foreach ($row as $key => $val) {
        $r[$key] = $val;
      }
      if ($callback != null && is_callable($callback)) {
        $value = call_user_func($callback, $r);
        if ($value == 'break') break;
      } else {
        $result[] = $r;
      }
    }
    $this->Query->close();
    $this->QueryClosed = TRUE;
		return $result;
	}

	private function error($error) { echo $error; }

	private function close() {
		return $this->Connection->close();
	}

	private function _gettype($var) {
    if (is_string($var)) return 's';
    if (is_float($var)) return 'd';
    if (is_int($var)) return 'i';
    return 'b';
	}

  private function lastInsertID() {
  	return $this->Connection->insert_id;
  }

	private function numRows() {
		$this->Query->store_result();
		return $this->Query->num_rows;
	}

  private function getTables($database){
    $tables = $this->Query('SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ?', $database)->fetchAll();
    $results = [];
    foreach($tables as $table){
			if(!in_array($table['TABLE_NAME'],$results)){
      	array_push($results,$table['TABLE_NAME']);
			}
    }
    return $results;
  }

	private function getHeaders($table){
    $headers = $this->Query('SELECT * FROM information_schema.COLUMNS WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ?', $table,$this->Database)->fetchAll();
    $results = [];
    foreach($headers as $header){
      array_push($results,$header['COLUMN_NAME']);
    }
    return $results;
  }

  private function create($fields, $table, $new = FALSE){
		if($new){
			$this->Query('INSERT INTO '.$table.' (created,modified) VALUES (?,?)', date("Y-m-d H:i:s"), date("Y-m-d H:i:s"));
			$fields['id'] = $this->lastInsertID();
		} else {
			$this->Query('INSERT INTO '.$table.' (id,created,modified) VALUES (?,?,?)', $fields['id'],date("Y-m-d H:i:s"), date("Y-m-d H:i:s"));
		}
		$headers = $this->getHeaders($table);
    foreach($fields as $key => $val){
      if((in_array($key,$headers))&&($key != 'id')){
        $this->Query('UPDATE '.$table.' SET `'.$key.'` = ? WHERE id = ?',$val,$fields['id']);
				set_time_limit(20);
      }
    }
    return $fields['id'];
  }

  private function save($fields, $table){
		$id = $fields['id'];
		$headers = $this->getHeaders($table);
		foreach($fields as $key => $val){
			if((in_array($key,$headers))&&($key != 'id')){
				$this->Query('UPDATE '.$table.' SET `'.$key.'` = ? WHERE id = ?',$val,$id);
				set_time_limit(20);
			}
		}
		$this->Query('UPDATE '.$table.' SET `modified` = ? WHERE id = ?',date("Y-m-d H:i:s"),$id);
  }

	private function updateStructure($json){
		if($this->Status){
			$structures = json_decode(file_get_contents($json),true);
			foreach($this->Query('SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ?',$this->Database)->fetchAll() as $fields){
				$db[$fields['TABLE_NAME']][$fields['COLUMN_NAME']]['order'] = $fields['ORDINAL_POSITION'];
				$db[$fields['TABLE_NAME']][$fields['COLUMN_NAME']]['type'] = $fields['COLUMN_TYPE'];
				$db[$fields['TABLE_NAME']][$fields['ORDINAL_POSITION']] = $fields['COLUMN_NAME'];
			}
			foreach($structures as $table_name => $table){
				if(isset($db[$table_name])){
					foreach($table as $column_name => $column){
						if(!is_int($column_name)){
							if(isset($db[$table_name][$column_name])){
								if($db[$table_name][$column_name]['type'] != $structures[$table_name][$column_name]['type']){
									$this->Query('ALTER TABLE `'.$table_name.'` MODIFY `'.$column_name.'` '.$structures[$table_name][$column_name]['type']);
								}
								if($db[$table_name][$column_name]['order'] != $structures[$table_name][$column_name]['order']){
									$this->Query('ALTER TABLE `'.$table_name.'` MODIFY COLUMN `'.$column_name.'` '.$structures[$table_name][$column_name]['type'].' AFTER `'.$structures[$table_name][$structures[$table_name][$column_name]['order']-1].'`');
								}
							} else {
								$this->Query('ALTER TABLE `'.$table_name.'` ADD `'.$column_name.'` '.$structures[$table_name][$column_name]['type'].' AFTER `'.$structures[$table_name][$structures[$table_name][$column_name]['order']-1].'`');
							}
							set_time_limit(20);
						}
					}
				} else {
					$this->Query('CREATE TABLE `'.$table_name.'` (id INT NOT NULL AUTO_INCREMENT,PRIMARY KEY (id))');
					$this->Query('ALTER TABLE `'.$table_name.'` auto_increment = 100000');
					$this->Query('ALTER TABLE `'.$table_name.'` row_format=dynamic');
					set_time_limit(20);
					foreach($structures[$table_name] as $col_order => $col){
						if((is_int($col_order))&&($col) != 'id'){
							$this->Query('ALTER TABLE `'.$table_name.'` ADD `'.$col.'` '.$structures[$table_name][$col]['type']);
							set_time_limit(20);
						}
					}
				}
			}
		}
	}

	private function insertRecords($file, $asNew = FALSE){
		if($this->Status){
			$tables=json_decode(file_get_contents($file),true);
			foreach($tables as $table => $records){
				if(!$asNew){
					foreach($records as $record){
						$find = $this->Query('SELECT * FROM `'.$table.'` WHERE id = ?', $record['id']);
						if($find->numRows() < 1){
							$id = $this->create($record, $table);
							if($id != $record['id']){ $this->Query('UPDATE `'.$table.'` SET id = ? WHERE id = ?', $record['id'], $id); }
						} else {
							if(isset($record['modified'])){
								$found = $find->fetchAll()[0];
								$current = new DateTime($found['modified']);
								$new = new DateTime($record['modified']);
								if($new > $current){ $this->save($record, $table); }
							} else {
								$this->save($record, $table);
							}
						}
					}
					$lastID = $this->Query('SELECT * FROM `'.$table.'` ORDER BY id DESC LIMIT 1')->fetchAll();
					if((empty($lastID))||($lastID[0]['id'] < 100000)){
						$this->Query('ALTER TABLE `'.$table.'` auto_increment = 100000');
						$this->Query('ALTER TABLE `'.$table.'` row_format=dynamic');
					} elseif($lastID[0]['id'] > 100000) {
						$newID = $lastID[0]['id']+1;
						$this->Query('ALTER TABLE `'.$table.'` auto_increment = '.$newID);
						$this->Query('ALTER TABLE `'.$table.'` row_format=dynamic');
					}
				} else {
					$lastID = $this->Query('SELECT * FROM `'.$table.'` ORDER BY id DESC LIMIT 1')->fetchAll();
					if((empty($lastID))||($lastID[0]['id'] < 100000)){
						$this->Query('ALTER TABLE `'.$table.'` auto_increment = 100000');
						$this->Query('ALTER TABLE `'.$table.'` row_format=dynamic');
					} elseif($lastID[0]['id'] > 100000) {
						$newID = $lastID[0]['id']+1;
						$this->Query('ALTER TABLE `'.$table.'` auto_increment = '.$newID);
						$this->Query('ALTER TABLE `'.$table.'` row_format=dynamic');
					}
					foreach($records as $record){ $this->create($record, $table, $asNew); }
				}
			}
		}
	}
}

new Installer;
