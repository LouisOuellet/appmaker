<?php
class Language{
  public $Field;
  public $Current;
	public $List = [];
	protected $Directory;

  public function __construct($language = "english", $directory = NULL){
		if($directory != NULL){ $this->Directory = $directory; } else { $this->Directory = dirname(__FILE__,3).'/dist/languages/'; }
		$this->list();
		$this->Field = $this->read($language);
    $this->Current = $language;
  }

	protected function list(){
		$languages = scandir($this->Directory);
		unset($languages[0]);
		unset($languages[1]);
		foreach($languages as $language){
			array_push($this->List, str_replace(".php","",$language));
		}
	}

	protected function create($name,$data){
		$file = $this->Directory.$name.".json";
		$json = fopen($this->Directory.$name.'.json', 'w');
		fwrite($json, json_encode($data, JSON_PRETTY_PRINT));
		fclose($json);
	}

	protected function read($name){
		$file = $this->Directory.$name.".json";
		if(is_file($file)){
			return json_decode(file_get_contents($file),true);
		}
	}

	protected function update($name,$data){
		$file = $this->Directory.$name.".json";
		if(is_file($file)){
			unset($file);
		}
		$json = fopen($file, 'w');
		fwrite($json, json_encode($data, JSON_PRETTY_PRINT));
		fclose($json);
	}

	protected function delete($name){
		$file = $this->Directory.$name.".json";
		if(is_file($file)){
			unset($file);
		}
	}
}
