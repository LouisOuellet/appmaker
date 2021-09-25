<?php

class Database{

  protected $connection;
	protected $query;
  protected $show_errors = TRUE;
  protected $query_closed = TRUE;
	public $query_count = 0;
	protected $Limit = 500;
	protected $Database;
	protected $results;

	public function __construct($dbhost = 'localhost', $dbuser = 'root', $dbpass = '', $dbname = '', $charset = 'utf8') {
		$this->connection = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
		$this->Database = $dbname;
		if ($this->connection->connect_error) {
			$this->error('Failed to connect to MySQL - ' . $this->connection->connect_error);
		}
		$this->connection->set_charset($charset);
	}

	public function setLimit($set = 500){
		$this->Limit = $set;
	}

  public function query($query) {
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
			$this->query_count++;
    } else {
      $this->error('Unable to prepare MySQL statement (check your syntax) - ' . $this->connection->error);
  	}
		return $this;
  }

  public function fetchAll($callback = null) {
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
		$this->results = $result;
		return $this;
	}

  public function fetchArray() {
    $params = array();
    $row = array();
    $meta = $this->query->result_metadata();
    while ($field = $meta->fetch_field()) {
      $params[] = &$row[$field->name];
    }
    call_user_func_array(array($this->query, 'bind_result'), $params);
    $result = array();
		while ($this->query->fetch()) {
			foreach ($row as $key => $val) {
				$result[$key] = $val;
			}
		}
    $this->query->close();
    $this->query_closed = TRUE;
		$this->results = $result;
		return $this;
	}

	public function fetchObject(){
    $result = $this->query->get_result()->fetch_object();
    $this->query->close();
    $this->query_closed = TRUE;
		$this->results = $result;
		return $this;
  }

	public function close() {
		return $this->connection->close();
	}

  public function numRows() {
		$this->query->store_result();
		return $this->query->num_rows;
	}

	public function affectedRows() {
		return $this->query->affected_rows;
	}

  public function lastInsertID() {
  	return $this->connection->insert_id;
  }

	public function error($error) {
    if ($this->show_errors) {
      exit($error);
    }
  }

	protected function _gettype($var) {
    if (is_string($var)) return 's';
    if (is_float($var)) return 'd';
    if (is_int($var)) return 'i';
    return 'b';
	}

	public function dump(){
		return [
			'affected_rows' => $this->connection->affected_rows,
			'client_info' => $this->connection->client_info,
			'client_version' => $this->connection->client_version,
			'connect_errno' => $this->connection->connect_errno,
			'connect_error' => $this->connection->connect_error,
			'errno' => $this->connection->errno,
			'error' => $this->connection->error,
			'field_count' => $this->connection->field_count,
			'host_info' => $this->connection->host_info,
			'info' => $this->connection->info,
			'insert_id' => $this->connection->insert_id,
			'server_info' => $this->connection->server_info,
			'server_version' => $this->connection->server_version,
			'sqlstate' => $this->connection->sqlstate,
			'protocol_version' => $this->connection->protocol_version,
			'thread_id' => $this->connection->thread_id,
			'warning_count' => $this->connection->warning_count,
		];
	}

	public function all(){
		return $this->results;
	}

	public function filter($filters){
		foreach($filters as $filter){
			if(is_array(current($this->results))){
				foreach($this->results as $key => $result){
					foreach($result as $field => $value){
						if($field == $filter['name']){
							switch($filter['relationship']){
								case"equal":
									if($result[$filter['name']] != $filter['value']){
										unset($this->results[$key]);
										break 2;
									}
									break;
								case"greater":
									if($result[$filter['name']] <= $filter['value']){
										unset($this->results[$key]);
										break 2;
									}
									break;
								case"smaller":
									if($result[$filter['name']] >= $filter['value']){
										unset($this->results[$key]);
										break 2;
									}
									break;
								case"like":
									if(strpos($result[$filter['name']], $filter['value']) === false){
										unset($this->results[$key]);
										break 2;
									}
									break;
								case"unlike":
									if(strpos($result[$filter['name']], $filter['value']) !== false){
										unset($this->results[$key]);
										break 2;
									}
									break;
								case"in":
									$array = explode(";",$result[$filter['name']]);
									if(!in_array($filter['value'],$array)){
										unset($this->results[$key]);
										break 2;
									}
									break;
								case"out":
									$array = explode(";",$result[$filter['name']]);
									if(in_array($filter['value'],$array)){
										unset($this->results[$key]);
										break 2;
									}
									break;
							}
							break;
						}
					}
				}
			}
		}
		return $this;
	}

  public function getHeaders($table, $restrict = false){
    $headers = $this->query('SELECT * FROM information_schema.COLUMNS WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ?', $table,$this->Database)->fetchAll()->all();
    $results = [];
    foreach($headers as $header){
      if($restrict && strpos($header['COLUMN_NAME'], 'is') !== 0 && strpos($header['COLUMN_NAME'], 'set') !== 0 && strpos($header['COLUMN_NAME'], 'has') !== 0){
        array_push($results,$header['COLUMN_NAME']);
      } elseif(!$restrict){array_push($results,$header['COLUMN_NAME']);}
    }
    return $results;
  }

  public function setModified($table, $id){
    $this->query('UPDATE `'.$table.'` SET
      modified = ?
      WHERE
      id = ?',
      date("Y-m-d H:i:s"),
      $id
    );
  }

  public function create($table,$fields){
    $this->query('INSERT INTO `'.$table.'` (created) VALUES (?)', date("Y-m-d H:i:s"));
		$results = $this->dump();
		if($results['affected_rows'] > 0){
	    $id = $results['insert_id'];
	    $this->update($table, $fields, $id);
		}
    return $results;
  }

  public function read($table, $id = null, $field = 'id'){
		$limit = '';
		if($this->Limit > 0){ $limit = ' LIMIT '.$this->Limit; }
    if($id != null){
      $results = $this->query('SELECT * FROM `'.$table.'` WHERE `'.$field.'` = ? '.' ORDER BY `id` DESC'.$limit,$id)->fetchAll();
    } else {
      $results = $this->query('SELECT * FROM `'.$table.'` ORDER BY `id` DESC'.$limit)->fetchAll();
    }
    return $results;
  }

  public function update($table, $fields, $id, $field = 'id'){
    $headers = $this->getHeaders($table);
    foreach($fields as $key => $val){
      if((in_array($key,$headers))&&($key != 'id')){
        $this->query('UPDATE `'.$table.'` SET `'.$key.'` = ? WHERE `'.$field.'` = ?',$val,$id);
      }
    }
    $this->setModified($table,$id);
		return $this->affectedRows();
  }

  public function delete($table,$id,$field = 'id'){
		$query=$this->query('SELECT * FROM `'.$table.'` WHERE `'.$field.'` = ?',$id);
		$count = $query->numRows();
    if($count > 0){
      $results = $this->query('DELETE FROM `'.$table.'` WHERE `'.$field.'` = ?',$id);
			return $count;
    }
  }
}
