<?php

// Import Librairies
require_once dirname(__FILE__,3) . '/src/lib/history.php';
require_once dirname(__FILE__,3) . '/src/lib/language.php';
require_once dirname(__FILE__,3) . '/src/lib/smtp.php';
require_once dirname(__FILE__,3) . '/src/lib/ldap.php';
require_once dirname(__FILE__,3) . '/src/lib/pam.php';
require_once dirname(__FILE__,3) . '/src/lib/validator.php';

class Auth extends History{

  public $User; // Stores User Data
  public $Groups; // Stores Groups Data
  public $Roles; // Stores Roles Data
  public $Permissions; // Stores Permissions Data
  public $Options; // Stores Options Data
	protected $Settings; // Stores Settings Data
  protected $Language; // Contains the Language Class
	protected $PAM; // Contains the PAM Class
	protected $Validator; // Contains the Validator Class
	protected $LDAP; // Contains the LDAP Class
	public $Mail; // Contains the Mail Class
	public $Error = []; // Contains a list of errors and parameters for toast alerts

  public function __construct($Settings){
		$this->Settings = $Settings;
		if(isset($this->Settings['log_level'])){
			$this->Level = $this->Settings['log_level'];
		}

		// Setup SQL Database
		if((isset($this->Settings['sql']))&&(!empty($this->Settings['sql']))){
			parent::__construct($this->Settings['sql']['host'],$this->Settings['sql']['username'],$this->Settings['sql']['password'],$this->Settings['sql']['database']);
		}

		// Setup Language
		if(isset($_COOKIE['language'])){$this->Language = new Language($_COOKIE["language"]);}
		else {
			if((isset($this->Settings['language']))&&(!empty($this->Settings['language']))){$this->Language = new Language($this->Settings["language"]);}
			else {$this->Language = new Language();}
		}

		// Setup LDAP
		if((isset($this->Settings['ldap']))&&(!empty($this->Settings['ldap']))){
			$this->LDAP = new LDAP($Settings['ldap']['username'],$Settings['ldap']['password'],$Settings['ldap']['host'],$Settings['ldap']['port'],$Settings['ldap']['domain'],$Settings['ldap']['base'],$Settings['ldap']['branches']);
		}

		// Setup PAM
		$this->PAM = new PAM();

		// Setup Mail
		if((isset($this->Settings['smtp']))&&(!empty($this->Settings['smtp']))){
			$this->Mail = new MAIL(
				$this->Settings['smtp']['host'],
				$this->Settings['smtp']['port'],
				$this->Settings['smtp']['encryption'],
				$this->Settings['smtp']['username'],
				$this->Settings['smtp']['password'],
				$this->Settings['language']
			);
		}

		// Setup Validator
		$this->Validator = new Validator();

		// Initialize Login
		$this->init();
  }

	protected function init(){
    if(isset($this->Settings['sql'])&&(isset($_COOKIE[$this->Settings['id']])||isset($_POST['username'],$_POST['password']))){
  		if((isset($_COOKIE[$this->Settings['id']]))&&(!empty($_COOKIE[$this->Settings['id']]))) {
  			$user = $this->query('SELECT * FROM users WHERE username = ?',$_COOKIE[$this->Settings['id']]);
  			if($user->numRows()!=1){ $this->logout($_SESSION['token']); } else {
  				$_SESSION[$this->Settings['id']]=$_COOKIE[$this->Settings['id']];
  				$_SESSION['token']=$user->fetchArray()->all()['token'];
  			}
  		} else {
  			if ((!empty($_POST)) && (isset($_POST['username'],$_POST['password']))) {
  				$this->login($_POST['username'],$_POST['password']);
  			} else {
  				if((isset($_GET['forgot'],$_POST['username']))&&(empty($_GET['forgot']))){
  					$token=$this->setReset($_POST['username']);
  				}
  				if((isset($_GET['forgot'],$_POST['password'],$_POST['password2']))&&(!empty($_GET['forgot']))){
  					if($this->Validator->password($_POST['password'], $_POST['password2'])){
  						$this->savePWD($_POST['password'],$_POST['token']);
  					}
  				}
  			}
  		}
  		if($this->isLogin()){
  			$auth = $this->getData($_SESSION[$this->Settings['id']]);
  			$this->User = $auth->User;
  			$this->Groups = $auth->Groups;
  			$this->Roles = $auth->Roles;
  			$this->Permissions = $auth->Permissions;
  			$this->Options = $auth->Options;
  			$this->query('UPDATE users SET last_login = ? WHERE id = ?',date("Y-m-d H:i:s"),$this->User['id']);
  		}
    }
	}

	public function error($error) {
    if ($this->show_errors) {
			$error = array(
				'type' => 'error',
				'title' => 'Database Error',
				'body' => json_encode($error, JSON_PRETTY_PRINT),
			);
			array_push($this->Error,$error);
    }
  }

  public function setModified($table, $id){
    $this->query('UPDATE `'.$table.'` SET modified = ?, updated_by = ? WHERE id = ?',date("Y-m-d H:i:s"),$this->User['id'],$id);
  }

	protected function saveTransaction($table, $action, $before, $after, $id, $status){
		$run = FALSE;
		switch($action){
			case"read":
				if($this->Level >= 4){ $run = TRUE; }
				break;
			case"create":
				if($this->Level >= 3){ $run = TRUE; }
				break;
			case"update":
				if($this->Level >= 2){ $run = TRUE; }
				break;
			case"delete":
				if($this->Level >= 1){ $run = TRUE; }
				break;
		}
		if($run){
			if((is_int($status))&&($status > 0)){ $status = 'Success'; } else { $status = 'Error'; }
			$query = [
				'before' => json_encode($before, JSON_PRETTY_PRINT),
				'after' => json_encode($after, JSON_PRETTY_PRINT),
				'owner' => $this->User['id'],
				'updated_by' => $this->User['id'],
				'action' => $action,
				'table' => $table,
				'of' => $id,
				'status' => $status,
				'ip' => $this->getClientIP(),
			];
			$results = $this->query('INSERT INTO `history` (created,modified) VALUES (?,?)', date("Y-m-d H:i:s"), date("Y-m-d H:i:s"));
			$id = $this->lastInsertID();
			$headers = $this->getHeaders('history');
	    foreach($query as $key => $val){
	      if((in_array($key,$headers))&&($key != 'id')){
	        $this->query('UPDATE `history` SET `'.$key.'` = ? WHERE `id` = ?',$val,$id);
	      }
	    }
		}
	}

	public function create($table,$fields){
		if(!isset($fields['owner'])){ $fields['owner'] = $this->User['id']; }
		if(!isset($fields['updated_by'])){ $fields['updated_by'] = $this->User['id']; }
		if($this->valid('table',$table,2)){
			if(isset($fields['job_title'])){
				$name = $fields['job_title'];
				$job_titles = $this->query('SELECT * FROM `job_titles` WHERE `name` = ?',$name)->numRows();
				if($job_titles <= 0){
					$job_title = $this->query('INSERT INTO `job_titles` (created,modified,owner,updated_by,name) VALUES (?,?,?,?,?)',
						date("Y-m-d H:i:s"),
						date("Y-m-d H:i:s"),
						$this->User['id'],
						$this->User['id'],
						$name
					);
				}
			}
			if(isset($fields['tags'])){
				foreach(explode(";",trim($fields['tags'],";")) as $name){
					$tags = $this->query('SELECT * FROM `tags` WHERE `name` = ?',$name)->numRows();
					if($tags <= 0){
						$tag = $this->query('INSERT INTO `tags` (created,modified,owner,updated_by,name) VALUES (?,?,?,?,?)',
							date("Y-m-d H:i:s"),
							date("Y-m-d H:i:s"),
							$this->User['id'],
							$this->User['id'],
							$name
						);
					}
				}
			}
			$results = parent::create($table,$fields);
			if(((!isset($results->error)||($results['error'] == '')))&&($results['insert_id'] > 0)){
				if($this->Level >= 3){
					$error = array(
						'type' => 'success',
						'title' => 'Create',
						'body' => 'Record was created successfully',
					);
					array_push($this->Error,$error);
				}
				return $results['insert_id'];
			} else {
				if($this->Level >= 3){
					$error = array(
						'type' => 'error',
						'title' => 'Created',
						'body' => 'An error occured while creating the record',
					);
					array_push($this->Error,$error);
				}
				return $results['error'];
			}
		}
	}

	public function read($table, $id = null, $field = 'id'){
		if($this->valid('table',$table,1)){
			$results = parent::read($table,$id,$field);
			if($results->all() !== FALSE){
				if($this->Level >= 4){
					$error = array(
						'type' => 'success',
						'title' => 'Read',
						'body' => 'Record was fetched successfully',
					);
					array_push($this->Error,$error);
				}
				if(count($results->all()) > 0){
					foreach($results->all() as $key => $result){
						foreach($result as $col => $value){
							if(!$this->valid('field',$col,1,$table)){
								$results->all()[$key][$col] = '';
							}
						}
					}
					return $results;
				}
			} else {
				if($this->Level >= 4){
					$error = array(
						'type' => 'error',
						'title' => 'Read',
						'body' => 'An error occured during data retreival',
					);
					array_push($this->Error,$error);
				}
			}
		}
	}

	public function update($table, $fields, $id, $field = 'id'){
		if($this->valid('table',$table,3)){
			if(!isset($fields['owner'])){ $fields['owner'] = $this->User['id']; }
			if(!isset($fields['updated_by'])){ $fields['updated_by'] = $this->User['id']; }
			if(isset($fields['job_title'])){
				$name = $fields['job_title'];
				$job_titles = $this->query('SELECT * FROM `job_titles` WHERE `name` = ?',$name)->numRows();
				if($job_titles <= 0){
					$job_title = $this->query('INSERT INTO `job_titles` (created,modified,owner,updated_by,name) VALUES (?,?,?,?,?)',
						date("Y-m-d H:i:s"),
						date("Y-m-d H:i:s"),
						$this->User['id'],
						$this->User['id'],
						$name
					);
				}
			}
			if(isset($fields['tags'])){
				foreach(explode(";",trim($fields['tags'],";")) as $name){
					$tags = $this->query('SELECT * FROM `tags` WHERE `name` = ?',$name)->numRows();
					if($tags <= 0){
						$tag = $this->query('INSERT INTO `tags` (created,modified,owner,updated_by,name) VALUES (?,?,?,?,?)',
							date("Y-m-d H:i:s"),
							date("Y-m-d H:i:s"),
							$this->User['id'],
							$this->User['id'],
							$name
						);
					}
				}
			}
			if($results = parent::update($table,$fields,$id,$field) !== FALSE){
				if($this->Level >= 2){
					$error = array(
						'type' => 'success',
						'title' => 'Update',
						'body' => 'Record was updated successfully',
					);
					array_push($this->Error,$error);
				}
				if($this->Status){
					$before = $this->read($table,$id,$field)->all();
					$this->saveTransaction($table, 'save', $before, $fields,$id,'success');
				}
				return $results;
			} else {
				if($this->Level >= 2){
					$error = array(
						'type' => 'error',
						'title' => 'Update',
						'body' => 'An error occured while updating the record',
					);
					array_push($this->Error,$error);
				}
			}
		}
	}

	public function delete($table,$id,$field = 'id'){
		if($this->valid('table',$table,4)){
			if($this->Status){
				$before = $this->read($table,$id,$field)->all();
				$this->saveTransaction($table, 'read', $before, [],$id,count($before));
			} else {
				$before = [];
			}
			$results = Database::delete($table,$id,$field);
			if($results > 0){
				if($this->Level >= 1){
					$error = array(
						'type' => 'success',
						'title' => 'Delete',
						'body' => 'Record was deleted successfully',
					);
					array_push($this->Error,$error);
					$this->saveTransaction($table, 'delete', $before, [], $id, $results);
				}
				return $results;
			} else {
				if($this->Level >= 1){
					$error = array(
						'type' => 'error',
						'title' => 'Delete',
						'body' => 'An error occured while deleting the record',
					);
					array_push($this->Error,$error);
					$this->saveTransaction($table, 'delete', $before, [], $id, $results);
				}
			}
		}
	}

	public function isBlacklisted($ip){
		$count = $this->query('SELECT * FROM blacklist WHERE ip = ?', $ip)->numRows();
		if($count >= 1){
			return TRUE;
		}
	}

	public function logout($token){
		if((isset($_SESSION[$this->Settings['id']]))&&($_SESSION['token'] == $token)){
			unset($_SESSION[$this->Settings['id']]);
			unset($_SESSION['token']);
			if(isset($_COOKIE[$this->Settings['id']])){
				unset($_COOKIE[$this->Settings['id']]);
				setcookie($this->Settings['id'], null, -1, '/');
			}
			session_destroy();
			return TRUE;
		} else {
			return FALSE;
		}
	}

	public function isLogin(){
		if((session_status() == PHP_SESSION_ACTIVE)&&(isset($_SESSION[$this->Settings['id']],$_SESSION['token']))) {
			$user = $this->query('SELECT * FROM users WHERE username = ?',$_SESSION[$this->Settings['id']]);
			if($user->numRows() !=1){
				$this->logout($_SESSION['token']);
			} else {
				$user = $user->fetchArray()->all();
				if($_SESSION['token'] == $user['token']){
					if((isset($_GET['logout']))&&($_GET['logout']!='')){
						if(!$this->logout($_GET['logout'])){
							return TRUE;
						}
					} else {
						return TRUE;
					}
				} else {
					if(!$this->logout($_SESSION['token'])){
						return TRUE;
					}
				}
			}
		}
	}

	public function loginToken($token){
		$user = $this->query('SELECT * FROM users WHERE api_token = ?',$token);
		if($user->numRows() == 1){
			$user=$user->fetchArray()->all();
			$serverID = $this->Settings['id'];
			$_SESSION[$serverID]=$user['username'];
			$_SESSION['token']=bin2hex(openssl_random_pseudo_bytes(24));
			$this->query('UPDATE users SET token = ? WHERE id = ?',$_SESSION['token'],$user['id']);
			$error = array(
				'type' => 'success',
				'title' => 'Authentication Successfull',
				'body' => 'User authentication completed successfully',
			);
			array_push($this->Error,$error);
		}
	}

	public function login($username,$password){
		if(isset($_POST['remember'])){ $remember = TRUE; } else { $remember = null; }
		$ready = false;
		$user = $this->query('SELECT * FROM users WHERE username = ?',$username);
		if($user->numRows() == 1){ $user=$user->fetchArray()->all();$ready = true; }
		else {
			$user = $this->query('SELECT * FROM users WHERE email = ?',$username);
			if($user->numRows() == 1){ $user=$user->fetchArray()->all();$ready = true; }
		}
		if($ready){
			$try=FALSE;
			if(($user['isUser'] == 'true')&&($user['isActive'] == 'true')){
				switch($user['type']){
					case "MySQL":
						if(password_verify($password, $user['password'])){ $try=TRUE; }
						break;
					case "LDAP":
						if($this->LDAP->login($user['username'],$password)){ $try=TRUE; }
						break;
					case "PAM":
						if($this->PAM->login($user['username'],$password)){ $try=TRUE; }
						break;
					case "SMTP":
						$organization = $this->query('SELECT * FROM organizations WHERE setDomain = ?',preg_replace( '/^(.*?)\@/', "", $user['email'] ));
						if($organization->numRows() == 1){
							$organization=$organization->fetchArray()->all();
							if($this->Mail->login($user['email'],$password,$organization['setSMTPhost'],$organization['setSMTPport'],$organization['setSMTPencryption'])){ $try=TRUE; }
						}
						break;
					case "Local":
						if($password == $this->Settings['id']){ $try=TRUE; }
						break;
					default:
						$error = array(
							'type' => 'error',
							'title' => 'Authentication Error',
							'body' => 'This authentication method is not available',
						);
						array_push($this->Error,$error);
						break;
				}
				$serverID = $this->Settings['id'];
				if(($try)&&(!isset($_SESSION[$serverID]))){
					$_SESSION[$serverID]=$user['username'];
					$_SESSION['token']=bin2hex(openssl_random_pseudo_bytes(24));
					$this->query('UPDATE users SET token = ? WHERE id = ?',$_SESSION['token'],$user['id']);
					if(($remember)&&(!isset($_COOKIE[$serverID]))){
						if(in_array($_SERVER['HTTP_HOST'], ['localhost','127.0.0.1','::1'])){
							setcookie($serverID, $user['username'], time() + (86400 * 30), "/", false);
						} else {
							setcookie($serverID, $user['username'], time() + (86400 * 30), "/");
						}
						$_COOKIE[$serverID] = $user['username'];
					}
					$error = array(
						'type' => 'success',
						'title' => 'Authentication Successfull',
						'body' => 'User authentication completed successfully',
					);
					array_push($this->Error,$error);
				} else {
					$error = array(
						'type' => 'error',
						'title' => 'Authentication Error',
						'body' => 'Wrong Password',
					);
					array_push($this->Error,$error);
				}
			} else {
				$error = array(
					'type' => 'error',
					'title' => 'Authentication Error',
					'body' => 'Your user has been disabled',
				);
				array_push($this->Error,$error);
			}
		} else {
			if(filter_var($username, FILTER_VALIDATE_EMAIL)) {
				$organization = $this->query('SELECT * FROM organizations WHERE setDomain = ?',preg_replace( '/^(.*?)\@/', "", $username ));
				if($organization->numRows() == 1){
					$organization=$organization->fetchArray()->all();
					if($this->Mail->login($username,$password,$organization['setSMTPhost'],$organization['setSMTPport'],$organization['setSMTPencryption'])){
						// Success now Create a new user
						$this->query('INSERT INTO `users` (
							created,
							modified,
							owner,
							updated_by,
							email,
							username,
							organization,
							type,
							isUser,
							isActive,
							isEmployee,
							isContact
						) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
							date("Y-m-d H:i:s"),
							date("Y-m-d H:i:s"),
							1,
							1,
							$username,
							$username,
							$organization['id'],
							'SMTP',
							'true',
							'true',
							'true',
							'true'
						);
						$user = $this->query('SELECT * FROM users WHERE username = ?',$username)->fetchArray()->all();
						$this->query('INSERT INTO `relationships` (
							created,
							modified,
							owner,
							updated_by,
							relationship_1,
							link_to_1,
							relationship_2,
							link_to_2
						) VALUES (?,?,?,?,?,?,?,?)',
							date("Y-m-d H:i:s"),
							date("Y-m-d H:i:s"),
							1,
							1,
							'organizations',
							$organization['id'],
							'users',
							$user['id']
						);
						$this->query('INSERT INTO `relationships` (
							created,
							modified,
							owner,
							updated_by,
							relationship_1,
							link_to_1,
							relationship_2,
							link_to_2
						) VALUES (?,?,?,?,?,?,?,?)',
							date("Y-m-d H:i:s"),
							date("Y-m-d H:i:s"),
							1,
							1,
							'groups',
							3,
							'users',
							$user['id']
						);
						$serverID = $this->Settings['id'];
						if(isset($_SESSION[$serverID])){unset($_SESSION[$serverID]);}
						if(!isset($_SESSION[$serverID])){
							$_SESSION[$serverID]=$user['username'];
							$_SESSION['token']=bin2hex(openssl_random_pseudo_bytes(24));
							$this->query('UPDATE users SET token = ? WHERE id = ?',$_SESSION['token'],$user['id']);
							if(($remember)&&(!isset($_COOKIE[$serverID]))){
								if(in_array($_SERVER['HTTP_HOST'], ['localhost','127.0.0.1','::1'])){
									setcookie($serverID, $user['username'], time() + (86400 * 30), "/", false);
								} else {
									setcookie($serverID, $user['username'], time() + (86400 * 30), "/");
								}
								$_COOKIE[$serverID] = $user['username'];
							}
							$error = array(
								'type' => 'success',
								'title' => 'Authentication Successfull',
								'body' => 'User authentication completed successfully',
							);
							array_push($this->Error,$error);
						}
					} else {
						$error = array(
							'type' => 'error',
							'title' => 'Authentication Error',
							'body' => 'Wrong Username',
						);
						array_push($this->Error,$error);
					}
				} else {
					$error = array(
						'type' => 'error',
						'title' => 'Authentication Error',
						'body' => 'Wrong Username',
					);
					array_push($this->Error,$error);
				}
	    } else {
				$error = array(
					'type' => 'error',
					'title' => 'Authentication Error',
					'body' => 'Wrong Username',
				);
				array_push($this->Error,$error);
	    }
		}
	}

	public function setReset($user){
		$user = $this->query('SELECT * FROM users WHERE username = ?',$user);
		if($user->numRows() == 1){
			$user = $user->fetchArray()->all();
			$token=bin2hex(openssl_random_pseudo_bytes(24));
			$this->query('UPDATE users SET reset_token = ? WHERE id = ?',$token,$user['id']);
			$this->Mail->sendReset($user['email'],$token);
		}
	}

	public function savePWD($pwd,$token){
		$user = $this->query('SELECT * FROM users WHERE reset_token = ?',$token);
		if($user->numRows() == 1){
			$user = $user->fetchArray()->all();
			switch($user['type']){
				case "MySQL":
					$this->query('UPDATE users SET password = ? WHERE id = ?',password_hash($pwd, PASSWORD_BCRYPT, array("cost" => 10)),$user['id']);
					break;
				case "LDAP":
					$this->LDAP->updatePassword($user['username'],$pwd);
					break;
				case "PAM":
					$this->PAM->updatePassword($user['username'],$pwd);
					break;
				default:
					$error = array(
						'type' => 'error',
						'title' => 'Authentication Error',
						'body' => 'This authentication method is not available',
					);
					array_push($this->Error,$error);
					break;
			}
			$this->query('UPDATE users SET reset_token = ? WHERE id = ?','',$user['id']);
		}
	}

	public function getData($user){
		$auth = new stdClass();
		$auth->Error = [];
		$auth->Groups = [];
		$auth->Roles = [];
		$auth->Permissions = [];
		$auth->Options = [];
		$auth->User = $this->query('SELECT * FROM users WHERE username = ?',$user)->fetchArray()->all();
		if(!empty($auth->User)){
			if(($auth->User['owner'] != '')&&($auth->User['owner'] != null)){ $auth->User['owner'] = $this->query('SELECT * FROM `users` WHERE id = ?',$auth->User['owner'])->fetchArray()->all()['username']; }
			if(($auth->User['updated_by'] != '')&&($auth->User['updated_by'] != null)){ $auth->User['updated_by'] = $this->query('SELECT * FROM `users` WHERE id = ?',$auth->User['updated_by'])->fetchArray()->all()['username']; }
			if(($auth->User['supervisor'] != '')&&($auth->User['supervisor'] != null)){ $auth->User['supervisor'] = $this->query('SELECT * FROM `users` WHERE id = ?',$auth->User['supervisor'])->fetchArray()->all()['username']; }
			if(($auth->User['organization'] != '')&&($auth->User['organization'] != null)){
				$organization = $this->query('SELECT * FROM `organizations` WHERE `id` = ?',$auth->User['organization'])->fetchAll()->all();
				if(!empty($organization)){ $auth->User['organization'] = $organization[0]['name']; }
			}
			$auth->User['name'] = '';
			if(($auth->User['first_name'] != '')&&($auth->User['first_name'] != null)){ if($auth->User['name'] != ''){ $auth->User['name'] .= ' '; };$auth->User['name'] .= $auth->User['first_name']; }
			if(($auth->User['middle_name'] != '')&&($auth->User['middle_name'] != null)){ if($auth->User['name'] != ''){ $auth->User['name'] .= ' '; };$auth->User['name'] .= $auth->User['middle_name']; }
			if(($auth->User['last_name'] != '')&&($auth->User['last_name'] != null)){ if($auth->User['name'] != ''){ $auth->User['name'] .= ' '; };$auth->User['name'] .= $auth->User['last_name']; }
			$options = $this->query('SELECT * FROM `options` WHERE `user` = ?',$auth->User['id'])->fetchAll();
			if($options != NULL){
				$options = $options->all();
				foreach($options as $option){
					switch($option['type']){
						case"application":
							switch($option['value']){
								case "true": $option['value']=true;break;
								case "false": $option['value']=false;break;
								default: break;
							}
							$auth->Options[$option['type']][$option['name']] = ["value" => $option['value'], "type" => $option['record']];
							break;
						case"filter":
							$auth->Options[$option['type']][$option['plugin']][$option['view']][$option['record']][$option['link_to']][$option['name']] = [ "value" => $option['value'], "relationship" => $option['relationship']];
							break;
						default:
							$auth->Options[$option['type']][$option['plugin']][$option['view']][$option['record']][$option['relationship']][$option['link_to']][$option['name']] = $option['value'];
							break;
					}
				}
			}
			$groups = $this->query('SELECT * FROM `relationships` WHERE ((`relationship_1` = ? AND `link_to_1` = ?) AND ((`relationship_2` = ?) OR (`relationship_3` = ?))) OR ((`relationship_2` = ? AND `link_to_2` = ?) AND ((`relationship_1` = ?) OR (`relationship_3` = ?))) OR ((`relationship_3` = ? AND `link_to_3` = ?) AND ((`relationship_1` = ?) OR (`relationship_2` = ?)))',[
				'users',
				$auth->User['id'],
				'groups',
				'groups',
				'users',
				$auth->User['id'],
				'groups',
				'groups',
				'users',
				$auth->User['id'],
				'groups',
				'groups',
			])->fetchAll()->all();
			foreach ($groups as $group) {
				if($group['relationship_1'] == 'groups'){ $groupID = $group['link_to_1']; }
				if($group['relationship_2'] == 'groups'){ $groupID = $group['link_to_2']; }
				if($group['relationship_3'] == 'groups'){ $groupID = $group['link_to_3']; }
				array_push($auth->Groups,$this->query('SELECT * FROM groups WHERE id = ?', $groupID)->fetchArray()->all()['name']);
				$roles = $this->query('SELECT * FROM `relationships` WHERE ((`relationship_1` = ? AND `link_to_1` = ?) AND ((`relationship_2` = ?) OR (`relationship_3` = ?))) OR ((`relationship_2` = ? AND `link_to_2` = ?) AND ((`relationship_1` = ?) OR (`relationship_3` = ?))) OR ((`relationship_3` = ? AND `link_to_3` = ?) AND ((`relationship_1` = ?) OR (`relationship_2` = ?)))',[
					'groups',
					$groupID,
					'roles',
					'roles',
					'groups',
					$groupID,
					'roles',
					'roles',
					'groups',
					$groupID,
					'roles',
					'roles',
				])->fetchAll()->all();
				if($roles){
					foreach ($roles as $role){
						if($role['relationship_1'] == 'roles'){ $roleID = $role['link_to_1']; }
						if($role['relationship_2'] == 'roles'){ $roleID = $role['link_to_2']; }
						if($role['relationship_3'] == 'roles'){ $roleID = $role['link_to_3']; }
						array_push($auth->Roles,$this->query('SELECT * FROM roles WHERE id = ?', $roleID)->fetchArray()->all()['name']);
						$permissions = $this->query('SELECT * FROM permissions WHERE role_id = ?', $roleID)->fetchAll()->all();
						if(empty($auth->Permissions)){
							foreach ($permissions as $permission){
								switch($permission['type']){
									case"field":
										$auth->Permissions[$permission['type']][$permission['table']][$permission['name']] = $permission['level'];
										break;
									case"view":
										$auth->Permissions[$permission['type']][$permission['plugin']][$permission['name']] = $permission['level'];
										break;
									default:
										$auth->Permissions[$permission['type']][$permission['name']] = $permission['level'];
										break;
								}
							}
						} else {
							foreach ($permissions as $permission){
								switch($permission['type']){
									case"field":
										if(isset($auth->Permissions[$permission['type']][$permission['table']][$permission['name']])){
											if($auth->Permissions[$permission['type']][$permission['table']][$permission['name']] < $permission['level']){
												$auth->Permissions[$permission['type']][$permission['table']][$permission['name']] = $permission['level'];
											}
										} else {
											$auth->Permissions[$permission['type']][$permission['table']][$permission['name']] = $permission['level'];
										}
										break;
									case"view":
										if(isset($auth->Permissions[$permission['type']][$permission['plugin']][$permission['name']])){
											if($auth->Permissions[$permission['type']][$permission['plugin']][$permission['name']] < $permission['level']){
												$auth->Permissions[$permission['type']][$permission['plugin']][$permission['name']] = $permission['level'];
											}
										} else {
											$auth->Permissions[$permission['type']][$permission['plugin']][$permission['name']] = $permission['level'];
										}
										break;
									default:
										if(isset($auth->Permissions[$permission['type']][$permission['name']])){
											if($auth->Permissions[$permission['type']][$permission['name']] < $permission['level']){
												$auth->Permissions[$permission['type']][$permission['name']] = $permission['level'];
											}
										} else {
											$auth->Permissions[$permission['type']][$permission['name']] = $permission['level'];
										}
										break;
								}
							}
						}
					}
				}
			}
			$roles = $this->query('SELECT * FROM `relationships` WHERE ((`relationship_1` = ? AND `link_to_1` = ?) AND ((`relationship_2` = ?) OR (`relationship_3` = ?))) OR ((`relationship_2` = ? AND `link_to_2` = ?) AND ((`relationship_1` = ?) OR (`relationship_3` = ?))) OR ((`relationship_3` = ? AND `link_to_3` = ?) AND ((`relationship_1` = ?) OR (`relationship_2` = ?)))',[
				'users',
				$auth->User['id'],
				'roles',
				'roles',
				'users',
				$auth->User['id'],
				'roles',
				'roles',
				'users',
				$auth->User['id'],
				'roles',
				'roles',
			])->fetchAll()->all();
			if($roles){
				foreach ($roles as $role){
					if($role['relationship_1'] == 'roles'){ $roleID = $role['link_to_1']; }
					if($role['relationship_2'] == 'roles'){ $roleID = $role['link_to_2']; }
					if($role['relationship_3'] == 'roles'){ $roleID = $role['link_to_3']; }
					array_push($auth->Roles,$this->query('SELECT * FROM roles WHERE id = ?', $roleID)->fetchArray()->all()['name']);
					$permissions = $this->query('SELECT * FROM permissions WHERE role_id = ?', $roleID)->fetchAll()->all();
					if(empty($auth->Permissions)){
						foreach ($permissions as $permission){
							$auth->Permissions[$permission['type']][$permission['name']] = $permission['level'];
						}
					} else {
						foreach ($permissions as $permission){
							if(isset($auth->Permissions[$permission['type']][$permission['name']])){
								if($auth->Permissions[$permission['type']][$permission['name']] < $permission['level']){
									$auth->Permissions[$permission['type']][$permission['name']] = $permission['level'];
								}
							} else {
								$auth->Permissions[$permission['type']][$permission['name']] = $permission['level'];
							}
						}
					}
				}
			}
			if(empty($auth->Roles)){
				$error = array(
					'type' => 'error',
					'title' => 'Security',
					'body' => 'We could not find any roles associated with your profile',
				);
				array_push($auth->Error,$error);
			}
			if(empty($auth->Permissions)){
				$error = array(
					'type' => 'error',
					'title' => 'Security',
					'body' => 'We could not find any permissions associated with your profile',
				);
				array_push($auth->Error,$error);
			}
		} else {
			$error = array(
				'type' => 'error',
				'title' => 'Unknown record',
				'body' => 'We could not find this record',
			);
			array_push($auth->Error,$error);
		}
		return $auth;
	}

	public function valid($type,$name,$level,$table = NULL){
		switch($type){
			case"view":
				if((isset($this->Permissions[$type][$table][$name]))&&($this->Permissions[$type][$table][$name] >= $level)){ return TRUE; } else {
					if($this->Settings['debug']){
						$error = array(
							'type' => 'error',
							'title' => 'Insufisant Permissions',
							'body' => 'Require permission ['.$type.']['.$table.']['.$name.'] at least level '.$level,
						);
						array_push($this->Error,$error);
					}
				}
				break;
			case"field":
				if((!isset($this->Permissions[$type][$table][$name]))||((isset($this->Permissions[$type][$table][$name]))&&($this->Permissions[$type][$table][$name] >= $level))){ return TRUE; } else {
					if($this->Settings['debug']){
						$error = array(
							'type' => 'error',
							'title' => 'Insufisant Permissions',
							'body' => 'Require permission ['.$type.']['.$table.']['.$name.'] at least level '.$level,
						);
						array_push($this->Error,$error);
					}
				}
				break;
			default:
				if((isset($this->Permissions[$type][$name]))&&($this->Permissions[$type][$name] >= $level)){ return TRUE; } else {
					if($this->Settings['debug']){
						$error = array(
							'type' => 'error',
							'title' => 'Insufisant Permissions',
							'body' => 'Require permission ['.$type.']['.$name.'] at least level '.$level,
						);
						array_push($this->Error,$error);
					}
				}
				break;
		}
	}
}
