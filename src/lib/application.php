<?php

// Import Librairies
require_once dirname(__FILE__,3) . '/src/lib/api.php';
require_once dirname(__FILE__,3) . '/src/lib/helper.php';
require_once dirname(__FILE__,3) . '/src/lib/builder.php';
require_once dirname(__FILE__,3) . '/src/lib/parsedown.php';

class Application extends API{

  protected $URL; // Stores the root URL
	protected $ActiveURL; // Stores the current URL
  protected $Parameters; // Stores all the URL Parameters
	public $Data = []; // Stores the data retreived from the controller
	protected $Plugin; // Stores the active controller name
	protected $View = 'index'; // Stores the active view
	protected $ID = null; // Stores the active record
	protected $Parsedown; // This contains the Parsedown class
	public $Builder; // This contains all the Builder

  public function __construct(){

		// Initialise API
    parent::__construct();

		// Initialise Application Data
    $this->URL = $this->Protocol.$this->Domain.'/';
		$this->ActiveURL = $this->Protocol.$this->Domain.$_SERVER["REQUEST_URI"];
    if(!isset($_SERVER["REDIRECT_URL"])){
			if(isset($this->Settings['page'])){ $this->Parameters[0] = $this->Settings['page']; }
			if(isset($this->Auth->Options['application']['landingPage']['value'])){ $this->Parameters[0] = $this->Auth->Options['application']['landingPage']['value']; }
    } else {
      $this->Parameters = explode('/',trim($_SERVER["REDIRECT_URL"],'/'));
    }
    $this->Plugin = $this->Parameters[0];
    if(isset($this->Parameters[1])){ $this->View = $this->Parameters[1]; }
    if(isset($this->Parameters[2])){ $this->ID = $this->Parameters[2]; }

		// Initialise Classes
    $this->Parsedown = new Parsedown();
    $this->Builder = new Builder();
  }

	public function start(){
		$this->LSP->Status = TRUE;
		if((isset($_GET['logout']))&&(!empty($_GET['logout']))){ $this->Auth->logout($_GET['logout']); }
		require_once dirname(__FILE__,3) . '/src/templates/template.php';
	}

  public function isCurrent($thiscontroller, $thisview = 'index', $thisid = null){
    if(($this->Plugin == $thiscontroller)&&(($this->View == $thisview)||
		(($this->View == null)&&($thisview == 'index')))&&((($thisid!=null)&&($this->ID == $thisid))||
		($thisid==null))){ return 'TRUE'; }
  }

  private function Validate(){
    // $servertoken = md5($_SERVER['SERVER_SOFTWARE'].$_SERVER['DOCUMENT_ROOT'].$_SERVER['SCRIPT_FILENAME'].$_SERVER['GATEWAY_INTERFACE'].$_SERVER['PATH']);
		// var_dump(password_hash($servertoken, PASSWORD_BCRYPT, ['cost' => 10]));
    // if((isset($this->Settings['serverid']))&&(password_verify($servertoken, $this->Settings['serverid']))){ return 'TRUE'; }
    if(isset($this->Settings['serverid'])){ return 'TRUE'; }
  }

  public function setToken(){
    $servertoken = md5($_SERVER['SERVER_SOFTWARE'].$_SERVER['DOCUMENT_ROOT'].$_SERVER['SCRIPT_FILENAME'].$_SERVER['GATEWAY_INTERFACE'].$_SERVER['PATH']);
    return password_hash($servertoken, PASSWORD_BCRYPT, ['cost' => 10]);
  }
}
