<?php
class FTP{

  private $username;
  private $password;
  private $host;
  private $conn;
  private $login;
  private $nlist;
  private $updates;

  public function __construct($username,$password,$host){
    $this->username = $username;
    $this->password = $password;
    $this->host = $host;
    $this->connect();
    $this->nlist = array_values(array_diff(ftp_nlist($this->conn, "."), [".", ".."]));
    $this->close();
    $this->updates = [];
    foreach($this->nlist as $version){
      if(isset($new)){ array_push($this->updates, str_replace('.zip','',$version)); }
      if(str_replace('.zip','',$version) == $this->site["version"]){ $new = ''; }
    }
  }

  public function download($version){
    $this->connect();
    if (ftp_get($this->conn, 'tmp/'.$version.'.zip', $version.'.zip', FTP_BINARY)) {
      echo "Successfully written to ".'tmp/'.$version.'.zip'."\n";
    } else {
      echo "There was a problem\n";
    }
    $this->close();
  }

  public function updates(){
    return $this->updates;
  }

  public function close(){
    // Disabling error reporting due to https://bugs.php.net/bug.php?id=77151
    error_reporting(0);
    ftp_close($this->conn);
    // Re-enabling error reporting
    error_reporting(-1);
  }

  public function connect(){
    $this->conn = ftp_ssl_connect($this->host);
    $this->login = ftp_login($this->conn, $this->username, $this->password);
    ftp_pasv($this->conn, true);
  }
}
