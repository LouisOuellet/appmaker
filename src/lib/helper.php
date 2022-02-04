<?php

// Import Librairies
require_once dirname(__FILE__,3) . '/src/lib/url.php';

class Helper{

	protected $Settings; // Stores settings loaded from manifest.json and conf.json
  protected $Auth; // This contains the Auth class & the Database class for MySQL queries
  protected $URL; // This contains the Auth class & the Database class for MySQL queries

  public function __construct($Auth){
    $this->Auth = $Auth;
    $this->Settings = $this->Auth->Settings;
    $this->URL = new URLparser();
  }
}
