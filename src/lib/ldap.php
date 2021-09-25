<?php

// Import Librairies
require_once dirname(__FILE__,3) . '/vendor/Net/SSH2.php';
require_once dirname(__FILE__,3) . '/vendor/Crypt/RSA.php';

class LDAP{

  private $host;
  private $port;
  private $username;
  private $password;
  private $dn;
  private $base;
  private $connection;
  private $branches;
  private $SSH;

  public function __construct($ldap_user,$ldap_pass,$ldap_host,$ldap_port,$ldap_dn,$ldap_base,$ldap_branches){
    $this->dn = $ldap_dn;
    $this->base = $ldap_base;
    $this->branches = $ldap_branches;
    if($ldap_host != ''){
      $this->Start($ldap_user, $ldap_pass, $ldap_host, $ldap_port);
    }
		$this->SSH = new Net_SSH2($ldap_host);
		if((!empty($ldap_user))&&(!empty($ldap_pass))){
			$this->SSH->login($ldap_user,$ldap_pass);
		}
  }

	public function updatePassword($usr,$pwd){
		$this->SSH->exec("Net user ".$usr." ".$pwd." /domain");
	}

	public function login($user,$password){
    ldap_set_option($this->connection, LDAP_OPT_PROTOCOL_VERSION, 3);
    ldap_set_option($this->connection, LDAP_OPT_REFERRALS, 0);
    $bind = @ldap_bind($this->connection, $this->dn."\\".$user, $password);
    if($bind){
      return TRUE;
    }
  }

  public function getGroups($user) {
    ldap_bind($this->connection,$this->username,$this->password);
    $results = ldap_search($this->connection,$this->base,"(samaccountname=$user)",array("memberof","primarygroupid"));
    $entries = ldap_get_entries($this->connection, $results);
    if($entries['count'] == 0) return false;
    $output = $entries[0]['memberof'];
    $token = $entries[0]['primarygroupid'][0];
    array_shift($output);
    $results2 = ldap_search($this->connection,$this->base,"(objectcategory=group)",array("distinguishedname","primarygrouptoken"));
    $entries2 = ldap_get_entries($this->connection, $results2);
    array_shift($entries2);
    foreach($entries2 as $e) {
      if($e['primarygrouptoken'][0] == $token) {
        $output[] = $e['distinguishedname'][0];
        break;
      }
    }
    $groups = array();
    foreach($output as $group) {
      $formatgroup = explode(',', $group);
      $formatgroup = reset($formatgroup);
      $formatgroup = substr($formatgroup, 3);
      array_push($groups, $formatgroup);
    }
    return $groups;
  }

  public function Start($username,$password,$host,$port=389) {
    $this->host = $host;
    $this->port = $port;
    $this->username = $username;
    $this->password = $password;

    if(isset($this->connection)) die('Error, LDAP connection already established');
    $this->connection = ldap_connect($host,$port) or die('Error connecting to LDAP');
    ldap_set_option($this->connection,LDAP_OPT_PROTOCOL_VERSION,3);
    @ldap_bind($this->connection,$username,$password) or die('Error binding to LDAP: '.ldap_error($this->connection));

    return true;
  }

  public function End() {
    if(!isset($this->connection)) die('Error, no LDAP connection established');
    ldap_unbind($this->connection);
  }

  public function getAttributes($user_dn,$keep=false) {
    if(!isset($this->connection)) die('Error, no LDAP connection established');
    if(empty($user_dn)) die('Error, no LDAP user specified');
    ldap_control_paged_result($this->connection,1);
    $results = (($keep) ? ldap_search($this->connection,$user_dn,'cn=*',$keep) : ldap_search($this->connection,$user_dn,'cn=*'))
    or die('Error searching LDAP: '.ldap_error($this->connection));
    $attributes = ldap_get_entries($this->connection,$results);
    if(isset($attributes[0])) return $attributes[0];
    else return array();
  }

  public function getMembers($object_dn,$object_class='g') {
    if(!isset($this->connection)) die('Error, no LDAP connection established');
    if(empty($object_dn)) die('Error, no LDAP object specified');
    if($object_class == 'g') {
      $output = array();
      $range_size = 1500;
      $range_start = 0;
      $range_end = $range_size - 1;
      $range_stop = false;
      do {
        $results = ldap_search($this->connection,$object_dn,'cn=*',array("member;range=$range_start-$range_end")) or die('Error searching LDAP: '.ldap_error($this->connection));
        $members = ldap_get_entries($this->connection,$results);
        $member_base = false;
        if(isset($members[0]["member;range=$range_start-*"])) {
          $range_stop = true;
          $member_base = $members[0]["member;range=$range_start-*"];
        } elseif(isset($members[0]["member;range=$range_start-$range_end"]))
          $member_base = $members[0]["member;range=$range_start-$range_end"];
        if($member_base && isset($member_base["count"]) && $member_base["count"] != 0) {
          array_shift($member_base);
          $output = array_merge($output,$member_base);
        } else $range_stop = true;
        if(!$range_stop) {
          $range_start = $range_end + 1;
          $range_end = $range_end + $range_size;
        }
      } while($range_stop == false);
    } elseif($object_class == 'c' || $object_class == "o") {
      $pagesize = 1000;
      $counter = "";
      do {
        ldap_control_paged_result($this->connection,$pagesize,true,$counter);
        $results = ldap_search($this->connection,$object_dn,'objectClass=user',array('sn')) or die('Error searching LDAP: '.ldap_error($this->connection));
        $members = ldap_get_entries($this->connection, $results);
        array_shift($members);
        foreach($members as $e) $output[] = $e["dn"];
        ldap_control_paged_result_response($this->connection,$results,$counter);
      } while($counter !== null && $counter != "");
    } else die("Invalid mydap_member object_class, must be c, g, or o");
    sort($output);
    return $output;
  }

  private function getFlags($flag) {
    $flags    = array();
    $flaglist = array(
               1 => 'SCRIPT',
               2 => 'ACCOUNTDISABLE',
               8 => 'HOMEDIR_REQUIRED',
              16 => 'LOCKOUT',
              32 => 'PASSWD_NOTREQD',
              64 => 'PASSWD_CANT_CHANGE',
             128 => 'ENCRYPTED_TEXT_PWD_ALLOWED',
             256 => 'TEMP_DUPLICATE_ACCOUNT',
             512 => 'NORMAL_ACCOUNT',
            2048 => 'INTERDOMAIN_TRUST_ACCOUNT',
            4096 => 'WORKSTATION_TRUST_ACCOUNT',
            8192 => 'SERVER_TRUST_ACCOUNT',
           65536 => 'DONT_EXPIRE_PASSWORD',
          131072 => 'MNS_LOGON_ACCOUNT',
          262144 => 'SMARTCARD_REQUIRED',
          524288 => 'TRUSTED_FOR_DELEGATION',
         1048576 => 'NOT_DELEGATED',
         2097152 => 'USE_DES_KEY_ONLY',
         4194304 => 'DONT_REQ_PREAUTH',
         8388608 => 'PASSWORD_EXPIRED',
        16777216 => 'TRUSTED_TO_AUTH_FOR_DELEGATION',
        67108864 => 'PARTIAL_SECRETS_ACCOUNT'
    );
    for ($i=0; $i<=26; $i++){
      if ($flag & (1 << $i)){
        array_push($flags, 1 << $i);
      }
    }
    foreach($flags as $k=>&$v) {
      $v = $v . ' '  . $flaglist[$v];
    }
    return $flags;
  }
}
