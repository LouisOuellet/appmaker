<?php
class LSP {

	protected $cURL;
	protected $Token;
	protected $Fingerprint;
	protected $Server;
	protected $App;
	protected $License;
	protected $Hash;
	protected $IP;
	protected $connection;
	protected $query;
	protected $database;
  protected $query_closed = TRUE;
  protected $Branch = 'master';
	public $Status = FALSE;
	public $Update = FALSE;

	public function __construct($server = null,$app = null,$license = null,$hash = null){
		$this->Server = $server;
		$this->App = $app;
		$this->License = md5($license);
		$this->Hash = $hash;
		$this->IP = $this->get_client_ip();
		shell_exec("git fetch origin ".$this->Branch." 2>/dev/null");
		if(strpos(shell_exec("git status -sb 2>/dev/null"), 'behind') !== false){
			$this->Update = TRUE;
		}
		if((($server != null)&&($app != null)&&($license != null)&&($hash != null))&&(($server != "")&&($app != "")&&($license != "")&&($hash != ""))){
			$this->Fingerprint = md5($_SERVER['SERVER_NAME'].$_SERVER['SERVER_SOFTWARE'].$_SERVER['DOCUMENT_ROOT'].$_SERVER['SCRIPT_FILENAME'].$_SERVER['GATEWAY_INTERFACE'].$_SERVER['PATH']);
			$validation = $this->validate();
			if(!$this->Status){
				$activation = $this->activate();
			}
		} else {
			$this->Status = true;
		}
	}

	public function setBranch($branch = "master"){
		$this->Branch = $branch;
	}

	public function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) { $randomString .= $characters[rand(0, $charactersLength - 1)]; }
    return $randomString;
	}

	private function get_client_ip() {
	  $ipaddress = '';
	  if(getenv('HTTP_CLIENT_IP')){
	    $ipaddress = getenv('HTTP_CLIENT_IP');
	  } elseif(getenv('HTTP_X_FORWARDED_FOR')){
	    $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
	  } elseif(getenv('HTTP_X_FORWARDED')){
	    $ipaddress = getenv('HTTP_X_FORWARDED');
	  } elseif(getenv('HTTP_FORWARDED_FOR')){
	    $ipaddress = getenv('HTTP_FORWARDED_FOR');
	  } elseif(getenv('HTTP_FORWARDED')){
	    $ipaddress = getenv('HTTP_FORWARDED');
	  } elseif(getenv('REMOTE_ADDR')){
	    $ipaddress = getenv('REMOTE_ADDR');
	  } else {
	    $ipaddress = 'UNKNOWN';
		}
	  return $ipaddress;
	}

	public function validate(){
		if(!$this->Status){
			$this->cURL = curl_init();
			curl_setopt($this->cURL, CURLOPT_URL, $this->Server.'api.php');
			curl_setopt($this->cURL, CURLOPT_POST, 1);
			curl_setopt($this->cURL, CURLOPT_POSTFIELDS, "app=".$this->App."&license=".$this->License."&fingerprint=".$this->Fingerprint."&ip=".$this->IP."&request=validate");
			curl_setopt($this->cURL, CURLOPT_RETURNTRANSFER, 1);
			$return = curl_exec($this->cURL);
			$answer = json_decode($return);
			if(isset($answer['token'])){
				$this->Token = $answer['token'];
				curl_close($this->cURL);
				if(($this->Token.$this->Hash != '')&&(password_verify($this->Token, $this->Hash))){
					$this->Status = TRUE;
				}
			} else { return $return; }
		}
	}

	public function activate(){
		if(!$this->Status){
			$this->cURL = curl_init();
			curl_setopt($this->cURL, CURLOPT_URL, $this->Server.'api.php');
			curl_setopt($this->cURL, CURLOPT_POST, 1);
			curl_setopt($this->cURL, CURLOPT_POSTFIELDS, "app=".$this->App."&license=".$this->License."&fingerprint=".$this->Fingerprint."&ip=".$this->IP."&request=activate");
			curl_setopt($this->cURL, CURLOPT_RETURNTRANSFER, 1);
			$return = curl_exec($this->cURL);
			$answer = json_decode($return);
			if(isset($answer['token'])){
				$this->Token = $answer['token'];
				curl_close($this->cURL);
				if(($this->Token.$this->Hash != '')&&(password_verify($this->Token, $this->Hash))){
					$this->Status = TRUE;
				}
			} else { return $return; }
		}
	}

	public function configdb($dbhost = 'localhost', $dbuser = 'root', $dbpass = '', $dbname = '', $charset = 'utf8') {
		$this->connection = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
		if ($this->connection->connect_error) {
			$this->error('Failed to connect to MySQL - ' . $this->connection->connect_error);
		}
		$this->connection->set_charset($charset);
		$this->database = $dbname;
	}

	private function query($query) {
    if (!$this->query_closed) {
      $this->query->close();
    }
		if ($this->query = $this->connection->prepare($query)) {
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
        call_user_func_array(array($this->query, 'bind_param'), $args_ref);
      }
      $this->query->execute();
     	if ($this->query->errno) {
				$this->error('Unable to process MySQL query (check your params) - ' . $this->query->error);
     	}
      $this->query_closed = FALSE;
    } else {
      echo $this->error($query.': Unable to prepare MySQL statement (check your syntax) - ' . $this->connection->error);
  	}
		return $this;
  }

  private function fetchAll($callback = null) {
    $params = array();
    $row = array();
    $meta = $this->query->result_metadata();
    while ($field = $meta->fetch_field()) {
      $params[] = &$row[$field->name];
    }
    call_user_func_array(array($this->query, 'bind_result'), $params);
    $result = array();
    while ($this->query->fetch()) {
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
    $this->query->close();
    $this->query_closed = TRUE;
		return $result;
	}

	public function error($error) { return json_encode($error, JSON_PRETTY_PRINT); }

	private function close() {
		return $this->connection->close();
	}

	private function _gettype($var) {
    if (is_string($var)) return 's';
    if (is_float($var)) return 'd';
    if (is_int($var)) return 'i';
    return 'b';
	}

  private function lastInsertID() {
  	return $this->connection->insert_id;
  }

	private function numRows() {
		$this->query->store_result();
		return $this->query->num_rows;
	}

  private function getTables($database){
    $tables = $this->query('SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ?', $database)->fetchAll();
    $results = [];
    foreach($tables as $table){
			if(!in_array($table['TABLE_NAME'],$results)){
      	array_push($results,$table['TABLE_NAME']);
			}
    }
    return $results;
  }

	private function getHeaders($table){
    $headers = $this->query('SELECT * FROM information_schema.COLUMNS WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ?', $table,$this->database)->fetchAll();
    $results = [];
    foreach($headers as $header){
      array_push($results,$header['COLUMN_NAME']);
    }
    return $results;
  }

  private function create($fields, $table, $new = FALSE){
		if($new){
			$this->query('INSERT INTO '.$table.' (created,modified) VALUES (?,?)', date("Y-m-d H:i:s"), date("Y-m-d H:i:s"));
			$fields['id'] = $this->lastInsertID();
		} else {
			$this->query('INSERT INTO '.$table.' (id,created,modified) VALUES (?,?,?)', $fields['id'],date("Y-m-d H:i:s"), date("Y-m-d H:i:s"));
		}
		$headers = $this->getHeaders($table);
    foreach($fields as $key => $val){
      if((in_array($key,$headers))&&($key != 'id')){
        $this->query('UPDATE '.$table.' SET `'.$key.'` = ? WHERE id = ?',$val,$fields['id']);
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
				$this->query('UPDATE '.$table.' SET `'.$key.'` = ? WHERE id = ?',$val,$id);
				set_time_limit(20);
			}
		}
		$this->query('UPDATE '.$table.' SET `modified` = ? WHERE id = ?',date("Y-m-d H:i:s"),$id);
  }

	public function chgBranch($branch = 'master'){
		if($this->Status){
			$this->Branch = $branch;
			shell_exec("git fetch origin ".$this->Branch." 2>/dev/null");
			if(strpos(shell_exec("git status -sb 2>/dev/null"), 'behind') !== false){
				$this->Update = TRUE;
			}
		}
	}

	public function updateFiles(){
		if($this->Status){
			if($this->Update){
				shell_exec("git stash 2>/dev/null");
				shell_exec("git reset --hard origin/".$this->Branch." 2>/dev/null");
				shell_exec("git pull origin ".$this->Branch." 2>/dev/null");
			}
		}
	}

	public function createStructure($file = null, $tables = null){
		foreach($this->query('SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ?',$this->database)->fetchAll() as $fields){
			if($tables != null){
				if((is_array($tables))&&(in_array($fields['TABLE_NAME'],$tables))){
					$structures[$fields['TABLE_NAME']][$fields['COLUMN_NAME']]['order'] = $fields['ORDINAL_POSITION'];
					$structures[$fields['TABLE_NAME']][$fields['COLUMN_NAME']]['type'] = $fields['COLUMN_TYPE'];
					if($file != null){$structures[$fields['TABLE_NAME']][$fields['ORDINAL_POSITION']] = $fields['COLUMN_NAME'];}
				}
			} else {
				$structures[$fields['TABLE_NAME']][$fields['COLUMN_NAME']]['order'] = $fields['ORDINAL_POSITION'];
				$structures[$fields['TABLE_NAME']][$fields['COLUMN_NAME']]['type'] = $fields['COLUMN_TYPE'];
				if($file != null){$structures[$fields['TABLE_NAME']][$fields['ORDINAL_POSITION']] = $fields['COLUMN_NAME'];}
			}
		}
		if(isset($structures)){
			if($file != null){
				if((is_writable($file))||(!is_file($file))){
					$json = fopen($file, 'w');
					fwrite($json, json_encode($structures, JSON_PRETTY_PRINT));
					fclose($json);
					return ["success" => $file." successfully created","structures" => $structures];
				} else { return ["error" => "Unable to write in ".$file,"structures" => $structures]; }
			} else {
				return $structures;
			}
		} else { return ["error" => "No table found"]; }
	}

	public function updateStructure($json){
		if($this->Status){
			$structures = json_decode(file_get_contents($json),true);
			foreach($this->query('SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ?',$this->database)->fetchAll() as $fields){
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
									$this->query('ALTER TABLE `'.$table_name.'` MODIFY `'.$column_name.'` '.$structures[$table_name][$column_name]['type']);
								}
								if($db[$table_name][$column_name]['order'] != $structures[$table_name][$column_name]['order']){
									$this->query('ALTER TABLE `'.$table_name.'` MODIFY COLUMN `'.$column_name.'` '.$structures[$table_name][$column_name]['type'].' AFTER `'.$structures[$table_name][$structures[$table_name][$column_name]['order']-1].'`');
								}
							} else {
								$this->query('ALTER TABLE `'.$table_name.'` ADD `'.$column_name.'` '.$structures[$table_name][$column_name]['type'].' AFTER `'.$structures[$table_name][$structures[$table_name][$column_name]['order']-1].'`');
							}
							set_time_limit(20);
						}
					}
				} else {
					$this->query('CREATE TABLE `'.$table_name.'` (id INT NOT NULL AUTO_INCREMENT,PRIMARY KEY (id))');
					$this->query('ALTER TABLE `'.$table_name.'` auto_increment = 100000');
					$this->query('ALTER TABLE `'.$table_name.'` row_format=dynamic');
					set_time_limit(20);
					foreach($structures[$table_name] as $col_order => $col){
						if((is_int($col_order))&&($col) != 'id'){
							$this->query('ALTER TABLE `'.$table_name.'` ADD `'.$col.'` '.$structures[$table_name][$col]['type']);
							set_time_limit(20);
						}
					}
				}
			}
		}
	}

	public function createRecords($file, $options = []){
		if($this->Status){
			$SQLoptions = '';
			$SQLargs = [];
			if(!isset($options['tables'])){ $tables = $this->getTables($this->database); } else { $tables = $options['tables']; }
			if((isset($options['maxID']))||(isset($options['minID']))){
				if($SQLoptions == ''){ $SQLoptions .= ' WHERE'; }
				if(isset($options['maxID'])){ $SQLoptions .= ' id <= ?'; array_push($SQLargs,$options['maxID']); }
				if(isset($options['minID'])){ $SQLoptions .= ' id >= ?'; array_push($SQLargs,$options['minID']); }
			}
			foreach($tables as $table){
				if(!empty($SQLargs)){ $results = $this->query('SELECT * FROM `'.$table.'`'.$SQLoptions,$SQLargs); }
				else { $results = $this->query('SELECT * FROM `'.$table.'`'); }
				if($results != null){ $records[$table] = $results->fetchAll(); }
			}
			if(isset($records)){
				if(($file != null)&&((is_writable($file))||(!is_file($file)))){
					$json = fopen($file, 'w');
					fwrite($json, json_encode($records, JSON_PRETTY_PRINT));
					fclose($json);
					return ["success" => $file." successfully created","records" => $records];
				} else { return ["error" => "Unable to write in ".$file,"records" => $records]; }
			} else { return ["error" => "No records found"]; }
		}
	}

	public function insertRecords($file, $asNew = FALSE){
		if($this->Status){
			$tables=json_decode(file_get_contents($file),true);
			foreach($tables as $table => $records){
				if(!$asNew){
					foreach($records as $record){
						$find = $this->query('SELECT * FROM `'.$table.'` WHERE id = ?', $record['id']);
						if($find->numRows() < 1){
							$id = $this->create($record, $table);
							if($id != $record['id']){ $this->query('UPDATE `'.$table.'` SET id = ? WHERE id = ?', $record['id'], $id); }
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
					$lastID = $this->query('SELECT * FROM `'.$table.'` ORDER BY id DESC LIMIT 1')->fetchAll();
					if((empty($lastID))||($lastID[0]['id'] < 100000)){
						$this->query('ALTER TABLE `'.$table.'` auto_increment = 100000');
						$this->query('ALTER TABLE `'.$table.'` row_format=dynamic');
					} elseif($lastID[0]['id'] > 100000) {
						$newID = $lastID[0]['id']+1;
						$this->query('ALTER TABLE `'.$table.'` auto_increment = '.$newID);
						$this->query('ALTER TABLE `'.$table.'` row_format=dynamic');
					}
				} else {
					$lastID = $this->query('SELECT * FROM `'.$table.'` ORDER BY id DESC LIMIT 1')->fetchAll();
					if((empty($lastID))||($lastID[0]['id'] < 100000)){
						$this->query('ALTER TABLE `'.$table.'` auto_increment = 100000');
						$this->query('ALTER TABLE `'.$table.'` row_format=dynamic');
					} elseif($lastID[0]['id'] > 100000) {
						$newID = $lastID[0]['id']+1;
						$this->query('ALTER TABLE `'.$table.'` auto_increment = '.$newID);
						$this->query('ALTER TABLE `'.$table.'` row_format=dynamic');
					}
					foreach($records as $record){ $this->create($record, $table, $asNew); }
				}
			}
		}
	}
}
