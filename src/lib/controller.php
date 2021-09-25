<?php

// Import Librairies
require_once dirname(__FILE__,3) . '/src/lib/api.php';

class Controller extends API{

  public $Plugin;
  public $View;
  public $ID;

  public function __construct($Plugin, $View, $ID){
		parent::__construct();
		$this->Plugin = $Plugin;
		$this->View = $View;
		$this->ID = $ID;
  }

	public function index(){
		$filters = [];
		$results = $this->Auth->query('SELECT * FROM `options` WHERE `type` = ? AND `table` = ? AND `user` = ?','filter',$this->Plugin,$this->Auth->User['id'])->fetchAll()->all();
		foreach($results as $result){
			$filter = [
				'name' => $result['name'],
				'type' => $result['relationship'],
				'value' => $result['value'],
			];
			array_push($filters,$filter);
		}
		return $this->Auth->read($this->Plugin)->filter($filters)->all();
	}

	public function view(){
		return $this->Auth->read($this->Plugin, $this->ID)->all();
	}
}
