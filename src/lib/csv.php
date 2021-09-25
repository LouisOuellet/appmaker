<?php
class CSV{
  private $Database;
	private $Parameters;
	private $Auth;

  public function __construct(){
    // $this->Database = $Database;
		// $this->Auth = $Auth;
		if(isset($_SERVER["REDIRECT_URL"])){
			$this->Parameters = explode('/',trim($_SERVER["REDIRECT_URL"],'/'));
		}
		if((!empty($_POST))&&(isset($_POST['importCSV']))){
			$this->upload();
		}
  }

	public function upload(){
		$target_dir = dirname(__FILE__,3) . '/tmp/uploads/';
		$target_file = $target_dir.date("Ymdhms").'.csv';
		$FileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
		$Error = '';
		$settings['header'] = '';
		$settings['identify'] = '';
		if((isset($_POST["importCSV"]))&&(isset($_FILES["fileCSV"]))) {
			if(!file_exists($target_file)) {
				if(($FileType == "csv")||($FileType == "CSV")){
					if (move_uploaded_file($_FILES["fileCSV"]["tmp_name"], $target_file)) {
						$filelist=$this->split($target_file);
						if((isset($_POST["identify"]))&&(!empty($_POST["identify"]))){ $settings['identify'] = $_POST["identify"]; }
						$table = $this->Parameters[0];
						foreach($filelist as $file){
							if($file == $filelist[0]){
								if((isset($_POST["asHeaders"]))&&(!empty($_POST["asHeaders"]))){ $settings['header'] = 1; }
							} else {
								if((isset($_POST["asHeaders"]))&&(!empty($_POST["asHeaders"]))){ $settings['header'] = ''; }
							}
							$this->task($file,$table,$settings);
						}
				  } else {
				    $Error = "Error uploading your file.";
				  }
				} else {
					$Error = 'Wrong file type';
				}
			} else {
				$Error = 'File already exist';
			}
		}
		return $Error;
	}

	public function task($file,$table,$settings){
		$task=[
			'name' => 'Importing '.$table,
			'user' => $this->Auth->User['id'],
			'status' => '2',
			'url' => $table,
			'approval' => 'TRUE',
		];
    $task['task']='{
		  "importCSV":{
		    "file": "'.$file.'",
				"table": "'.$table.'",
				"settings":{
			    "header": "'.$settings['header'].'",
			    "identify": "'.$settings['identify'].'"
				}
		  }
		}';
		$this->Database->create($task, 'tasks');
	}

	public function split($file){
		$inputFile = $file;
		$outputFile = $file.'_';
		$splitSize = 500;
		$in = fopen($inputFile, 'r');
		$rowCount = 0;
		$fileCount = 1;
		$filelist = [];
		while (!feof($in)) {
	    if (($rowCount % $splitSize) == 0) {
        if ($rowCount > 0) {
          fclose($out);
        }
				$filename=$outputFile . $fileCount++ . '.csv';
        $out = fopen($filename, 'w');
				array_push($filelist, $filename);
	    }
	    $data = fgetcsv($in);
	    if ($data)
        fputcsv($out, $data);
	    $rowCount++;
		}
		fclose($out);
		unlink($file);
		return $filelist;
	}

	public function parser($file,$headers,$table,$settings = []){
		$content = file($file);
		$count = 0;
		foreach($content as $line){
			$count++;
			$skip = TRUE;
			unset($insert);
			if((isset($settings['header']))&&($settings['header'])&&($count == 1)){ $skip = FALSE; }
			if($skip){
				$array = explode(',',$line);
				foreach($headers as $key => $column){
					if(isset($array[$key])){
						$insert[$column] = str_replace('"','',str_replace("'","",$array[$key]));
						if(($column == 'Link_to')&&(!is_int($insert[$column]))){
							switch($insert['relationship']){
								case 'users':
									$linked = $this->Database->get($insert['relationship'], $column, 'username')->fetchArray()->all();
									break;
								default:
									$linked = $this->Database->get($insert['relationship'], $column, 'name')->fetchArray()->all();
									break;
							}
							$insert[$column] = $linked['id'];
						}
					}
				}
				$existing = 0;
				if(!isset($settings['identify'])){ $settings['identify'] = 'id'; }
				if((isset($settings['identify']))&&($settings['identify'] != "")){
					$identify = $this->Database->get($table, $insert[$settings['identify']], $settings['identify']);
				}
				if((isset($identify))&&($identify->numRows() > 0)){
					$existing = $identify->numRows();
				}
				unset($insert['id']);
				unset($insert['created']);
				unset($insert['modified']);
				unset($insert['owner']);
				unset($insert['updated_by']);
				if($existing == 1){
					$identified = $identify->fetchArray()->all();
					$this->Database->save($insert, $identified['id'], $table);
				} else {
					$this->Database->create($insert,$table);
				}
			}
		}
	}
}
