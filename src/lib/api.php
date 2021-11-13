<?php

// Import Librairies
require_once dirname(__FILE__,3) . '/src/lib/requirements.php';
require_once dirname(__FILE__,3) . '/src/lib/auth.php';
require_once dirname(__FILE__,3) . '/src/lib/lsp.php';
require_once dirname(__FILE__,3) . '/src/lib/csv.php';
require_once dirname(__FILE__,3) . '/src/lib/pdf.php';
require_once dirname(__FILE__,3) . '/src/lib/imap.php';
require_once dirname(__FILE__,3) . '/src/lib/language.php';
require_once dirname(__FILE__,3) . '/src/lib/exchange.php';
require_once dirname(__FILE__,3) . '/src/lib/smtp.php';
require_once dirname(__FILE__,3) . '/src/lib/extendapi.php';
require_once dirname(__FILE__,3) . '/src/lib/crudapi.php';
require_once dirname(__FILE__,3) . '/src/lib/validator.php';

class API{

  protected $Timezones; // Stores available timezones
  protected $Countries; // Stores available countries
  protected $States; // Stores available states
  protected $Plugins; // Stores available states
	public $Structure = []; // Stores the database structure
	public $Tables = []; // Stores the database structure
	public $Samples = []; // Stores the database structure
	public $Skeletons = []; // Stores the database structure
  protected $Validator;
	public $Settings; // Stores settings loaded from manifest.json and conf.json
  public $Auth; // This contains the Auth class & the Database class for MySQL queries
	protected $LSP; // This contains the LSP class
  protected $CSV; // This contains the CSV class
  protected $PDF; // This contains the PDF class
  public $Exchange; // This contains the EXCHANGE class
	public $Language; // This contains the Language class
	protected $PHPVersion; // The server php version
  public $Domain; // The domain extracted from $_SERVER['HTTP_HOST']
  public $Protocol; // The protocol extracted from $_SERVER['HTTPS']
	protected $Error = []; // Contains a list of errors and parameters for toast alerts

  public function __construct(){

    // Increase PHP memory limit
    ini_set('memory_limit', '1024M');

		// Gathering Server Information
		$this->PHPVersion=substr(phpversion(),0,3);
		if(isset($_SERVER['HTTP_HOST'])){
			$this->Protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http")."://";
			$this->Domain = $_SERVER['HTTP_HOST'];
		}

    // Import Configurations
		if(is_file(dirname(__FILE__,3) . "/config/config.json")){
			$this->Settings = json_decode(file_get_contents(dirname(__FILE__,3) . '/config/config.json'),true);
      if(is_file(dirname(__FILE__,3) . '/tmp/install.log')){ unlink(dirname(__FILE__,3) . '/tmp/install.log'); }
      if(is_file(dirname(__FILE__,3) . '/tmp/resume.install')){ unlink(dirname(__FILE__,3) . '/tmp/resume.install'); }
		} else {
      $this->Settings=json_decode(file_get_contents(dirname(__FILE__,3) . '/dist/data/manifest.json'),true);
    }

    // Setup URL
		if(isset($_SERVER['HTTP_HOST']) && !isset($this->Settings['url'])){
			$this->Settings['url'] = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http")."://";
			$this->Settings['url'] .= $_SERVER['HTTP_HOST'].'/';
      if(file_exists(dirname(__FILE__,3).'/config/config.json')){ $this->SaveCfg($this->Settings); }
		}

		//Import Listings
    $this->Timezones = json_decode(file_get_contents(dirname(__FILE__,3) . '/dist/data/timezones.json'),true);
    $this->Countries = json_decode(file_get_contents(dirname(__FILE__,3) . '/dist/data/countries.json'),true);
    $this->States = json_decode(file_get_contents(dirname(__FILE__,3) . '/dist/data/states.json'),true);
    $this->Plugins = json_decode(file_get_contents(dirname(__FILE__,3) . '/dist/data/plugins.json'),true);

		// Setup Language
		if(isset($_COOKIE['language'])){ $this->Language = new Language($_COOKIE["language"]); }
		else { $this->Language = new Language($this->Settings["language"]); }

		// Verify Plugins
		foreach($this->Plugins as $plugin => $conf){
			// Extend Language
			if(isset($_COOKIE['language'])){
				if(isset($this->Settings['plugins'][$plugin]['status'])&&$this->Settings['plugins'][$plugin]['status']&&file_exists(dirname(__FILE__,3).'/plugins/'.$plugin.'/dist/languages/'.$_COOKIE['language'].'.json')){
					$this->Language->Field = array_replace_recursive($this->Language->Field,json_decode(file_get_contents(dirname(__FILE__,3).'/plugins/'.$plugin.'/dist/languages/'.$_COOKIE['language'].'.json'),true));
				}
			}
			else {
				if(isset($this->Settings['plugins'][$plugin]['status'])&&$this->Settings['plugins'][$plugin]['status']&&file_exists(dirname(__FILE__,3).'/plugins/'.$plugin.'/dist/languages/'.$this->Settings['language'].'.json')){
					$this->Language->Field = array_replace_recursive($this->Language->Field,json_decode(file_get_contents(dirname(__FILE__,3).'/plugins/'.$plugin.'/dist/languages/'.$this->Settings['language'].'.json'),true));
				}
			}
		}

		// Setup Instance
		if((isset($this->Settings['debug']))&&($this->Settings['debug'])){ error_reporting(-1); } else { error_reporting(0); }
		date_default_timezone_set($this->Settings['timezone']);

		// Initialise LSP
		if((isset($_POST['key']))&&(!isset($this->Settings['license']))){
			$this->SaveCfg(['license' => $_POST['key']],$this->Settings);
		}
		if((isset($this->Settings['lsp']['required']))&&($this->Settings['lsp']['required'])){
			if(isset($this->Settings['license'])){
				$this->LSP = new LSP($this->Settings['lsp']['host'],$this->Settings['repository']['name'],$this->Settings['license'],$this->Settings['lsp']['token']);
				if((isset($this->Settings['repository']['branch']))&&(!empty($this->Settings['repository']['branch']))){ $this->LSP->chgBranch($this->Settings['repository']['branch']); }
				if((isset($this->Settings['sql']))&&(!empty($this->Settings['sql']))){ $this->LSP->configdb($this->Settings['sql']['host'],$this->Settings['sql']['username'],$this->Settings['sql']['password'],$this->Settings['sql']['database']); }
			}
		} else {
			$this->LSP = new LSP();
			if((isset($this->Settings['repository']['branch']))&&(!empty($this->Settings['repository']['branch']))){ $this->LSP->chgBranch($this->Settings['repository']['branch']); }
			if((isset($this->Settings['sql']))&&(!empty($this->Settings['sql']))){ $this->LSP->configdb($this->Settings['sql']['host'],$this->Settings['sql']['username'],$this->Settings['sql']['password'],$this->Settings['sql']['database']); }
		}

		// Create Table Structure
    if(isset($this->Settings['sql'])){
      $this->Structure = $this->LSP->createStructure();
      foreach($this->Structure as $table => $columns){ array_push($this->Tables,$table); }
    } else {
      foreach(json_decode(file_get_contents(dirname(__FILE__,3) . '/dist/data/structure.json'),true) as $table => $columns){ array_push($this->Tables,$table); }
      foreach(json_decode(file_get_contents(dirname(__FILE__,3) . '/dist/data/skeleton.json'),true) as $table => $columns){ array_push($this->Skeletons,$table); }
      foreach(json_decode(file_get_contents(dirname(__FILE__,3) . '/dist/data/sample.json'),true) as $table => $columns){ array_push($this->Samples,$table); }
    }

		// Initialise Auth
		$this->Auth = new Auth($this->Settings);

    // Customize SMTP template
    if(isset($this->Settings['url'],$this->Settings['smtp'],$this->Settings['smtp']['username'],$this->Settings['smtp']['password'],$this->Settings['smtp']['host'],$this->Settings['smtp']['port'],$this->Settings['smtp']['encryption'])){
      $customization = [
        "logo" => $this->Settings['url']."dist/img/logo.png",
        "support" => $this->Settings['url']."?p=support",
        "trademark" => $this->Settings['url']."?p=trademark",
        "policy" => $this->Settings['url']."?p=policy"
      ];
      if(is_file(dirname(__FILE__,3).'/dist/img/custom-logo.png')){ $customization['logo'] = $this->Settings['url']."dist/img/custom-logo.png"; }
      $this->Auth->Mail->Customization($this->Settings['title'],$customization);
    }

		// Load APIs
		$this->loadFiles('api.php', 'api');

		// Initialise CSV
		$this->CSV = new CSV();

		// Initialise PDF
		$this->PDF = new PDF();

    // Initialise Validator
    $this->Validator = new Validator();

		// Initialise EXCHANGE
		// $this->Exchange = new EXCHANGE();
  }

  public function getLanguage(){
    return [ "Lists" => [ "Language" => $this->Language->Field ] ];
  }

	public function initApp(){
		$Settings['LandingPage'] = $this->Settings['page'];
		$Settings['customization'] = $this->Settings['customization'];
		$Settings['Structure'] = $this->Structure;
    if(isset($this->Settings['debug'])){ $Settings['Debug'] = $this->Settings['debug']; }
		else { $Settings['Debug'] = false; }
    $Settings['plugins'] = $this->Settings['plugins'];
    $Settings['repository'] = $this->Settings['repository'];
		$request['Settings'] = $Settings;
		$Lists['Countries'] = $this->Countries;
		$Lists['States'] = $this->States;
    $Lists['Plugins'] = $this->Plugins;
		$Lists['Tables'] = [];
		foreach($Settings['Structure'] as $table => $cols){ array_push($Lists['Tables'],$table); }
		$Lists['Timezones'] = $this->Timezones;
		$Lists['Language'] = $this->Language->Field;
		$Lists['Jobs'] = [];
		$jobs = $this->Auth->read('job_titles');
		if($jobs != NULL){
			foreach($jobs->all() as $job){
				array_push($Lists['Jobs'],$job['name']);
			}
		}
		$Lists['Tags'] = [];
		$tags = $this->Auth->read('tags');
		if($tags != NULL){
			foreach($tags->all() as $tag){
				array_push($Lists['Tags'],$tag['name']);
			}
		}
		$statuses = $this->Auth->read('statuses');
		if($statuses != NULL){
			foreach($statuses->all() as $status){
				$Lists['Statuses'][$status['relationship']][$status['order']] = [
					'name' => $status['name'],
					'icon' => $status['icon'],
					'color' => $status['color'],
				];
			}
		}
		$priorities = $this->Auth->read('priorities');
		if($priorities != NULL){
			foreach($priorities->all() as $priority){
				$Lists['Priorities'][$priority['relationship']][$priority['order']] = [
					'name' => $priority['name'],
					'icon' => $priority['icon'],
					'color' => $priority['color'],
				];
			}
		}
		$request['Lists'] = $Lists;
		$Auth['User']=$this->Auth->User;
		$Auth['Groups']=$this->Auth->Groups;
		$Auth['Roles']=$this->Auth->Roles;
		$Auth['Permissions']=$this->Auth->Permissions;
		$Auth['Options']=$this->Auth->Options;
		$Auth['dom']['User']=$this->Auth->User;
    $raw = $this->Auth->read('users',$this->Auth->User['id']);
    if($raw != null && !is_bool($raw)){
      $Auth['raw']['User'] = $raw->all()[0];
    } else { $Auth['raw']['User']=$this->Auth->User; }
		$request['Auth'] = $Auth;
		return $request;
	}

  public function loadFiles($lookup, $type = 'plugin', $dept = 3){
		$root = dirname(__FILE__,$dept);
    $directories = array_slice(scandir($root . '/plugins/'), 2);
    foreach($directories as $directory) {
			$file = $root . "/plugins/".$directory."/".$lookup;
			if($directory != "empty" && is_file($file)){
				if($this->Auth->valid($type,$directory,1)){
					if((isset($this->Settings['plugins'][$directory]['status']))&&$this->Settings['plugins'][$directory]['status']){ require_once($file); }
				}
			}
    }
  }

  protected function getTimeDiff($datetime1,$datetime2){
    $datetime1 = new DateTime($datetime1);
    $datetime2 = new DateTime($datetime2);
    $interval = date_diff($datetime1, $datetime2);
    $difference = "";
    if($interval->format('%Y') > 0){
      $difference = $interval->format('%Y')." years";
    }elseif($interval->format('%m') > 0){
      $difference = $interval->format('%m')." months";
    }elseif($interval->format('%d') > 0){
      $difference = $interval->format('%d')." days";
    }elseif($interval->format('%H') > 0){
      $difference = $interval->format('%H')." hours";
    }elseif($interval->format('%i') > 0){
      $difference = $interval->format('%i')." minutes";
    }elseif($interval->format('%s') > 0){
      $difference = $interval->format('%s')." secondes";
    }
    return $difference;
  }

  public function isJson($string) {
     json_decode($string);
     return json_last_error() === JSON_ERROR_NONE;
  }

  protected function SaveCfg($configs){
		$settings = $this->Settings;
		foreach($configs as $key => $value){ $settings[$key] = $value; }
		$json = fopen(dirname(__FILE__,3).'/config/config.json', 'w');
		fwrite($json, json_encode($settings, JSON_PRETTY_PRINT));
		fclose($json);
		return $settings;
	}

  protected function SaveAppCfg($configs){
    $settings=json_decode(file_get_contents(dirname(__FILE__,3) . '/dist/data/manifest.json'),true);
		foreach($configs as $key => $value){ $settings[$key] = $value; }
		$json = fopen(dirname(__FILE__,3).'/dist/data/manifest.json', 'w');
		fwrite($json, json_encode($settings, JSON_PRETTY_PRINT));
		fclose($json);
		return $settings;
	}

  protected function lastRUN($date){
		$configs=['last_background_jobs' => $date,];
		$this->SaveCfg($configs,$this->Settings);
  }

  public function __version($args = null){
    echo "Version: ".$this->Settings['version']."\n";
    echo "Build: ".$this->Settings['build']."\n";
  }

  public function __maintenance($arg = []){
    if($this->LSP->Status){
      if((is_array($arg))&&(isset($arg[0]))){ $args=json_decode($arg[0],true); } else { $args=[]; }
	    if(isset($args['maintenance'])){
        $this->SaveCfg(['maintenance' => $args['maintenance']]);
	    } elseif(isset($this->Settings['maintenance'])){
        if($this->Settings['maintenance']){ $this->SaveCfg(['maintenance' => false]); echo "Maintenance mode deactivated\n"; }
        else{ $this->SaveCfg(['maintenance' => true]); echo "Maintenance mode activated\n"; }
      } else {
	      $this->SaveCfg(['maintenance' => true]);
	    }
		} else {
			echo "Application not activated\n";
		}
  }

  public function __debug($arg = []){
    if($this->LSP->Status){
      if((is_array($arg))&&(isset($arg[0]))){ $args=json_decode($arg[0],true); } else { $args=[]; }
	    if(isset($args['debug'])){
        $this->SaveCfg(['debug' => $args['debug']]);
	    } elseif(isset($this->Settings['debug'])){
        if($this->Settings['debug']){ $this->SaveCfg(['debug' => false]); echo "Debug mode deactivated\n"; }
        else{ $this->SaveCfg(['debug' => true]); echo "Debug mode activated\n"; }
      } else {
	      $this->SaveCfg(['debug' => true]);
	    }
		} else {
			echo "Application not activated\n";
		}
  }

	public function __cron(){
		//We Login as System
		$this->Auth->login('System',$this->Settings["id"]);
		//We Confirm Login was Successfull
		if($this->Auth->islogin()){
			//We execute the cron
			if ($this->Settings['background_jobs'] == "cron"){
		    //Loading Cron Scripts from Plugins
		    $plugins = preg_grep('/^([^.])/', scandir(dirname(__FILE__,3).'/plugins/'));
		    foreach($plugins as $plugin) {
          $file = dirname(__FILE__,3) . '/plugins/'.$plugin."/cron.php";
          if(is_file($file)){
            if(isset($API->Settings['debug']) && $API->Settings['debug']){ echo "Executing ".$plugin." CRON\n"; }
            include_once($file);
          }
		    }
			}
			$this->lastRUN(date("Y-m-d H:i:s"));
		}
	}

	public function __importCSV($arg){
		if((isset($this->Settings['license']))&&($this->LSP->Status)){
			if(isset($arg[0])){
				$task = $this->Database->query('SELECT * FROM tasks WHERE id = ?',$arg[0])->fetchArray();
				if(!empty($task)){
					$actions=json_decode($task['task'],true);
					if(isset($actions['importCSV']['file'])){
						if(file_exists($actions['importCSV']['file'])) {
							//We Login as System
							$this->Auth->login('System',$this->Settings["id"]);
							//We start importing
							$headers = $this->Database->getHeadersNames($actions['importCSV']['table']);
							$this->CSV->parser($actions['importCSV']['file'],$headers,$actions['importCSV']['table'],$actions['importCSV']['settings']);
							$task['status']=4;
							$this->Database->save($task, $task['id'], 'tasks');
							unlink($actions['importCSV']['file']);
						} else {
							echo "Referenced file could not be found : ".$actions['importCSV']['file']."\n";
							$task['status']=5;
							$this->Database->save($task, $task['id'], 'tasks');
						}
					} else {
						echo "This is not an importing task\n";
						$task['status']=5;
						$this->Database->save($task, $task['id'], 'tasks');
					}
				} else {
					echo "Task is empty\n";
				}
			} else {
				echo "No task provided\n";
			}
		} else {
			echo "Application not activated\n";
		}
	}

  public function __enable($arg = []){
		if($this->LSP->Status){
      if((is_array($arg))&&(isset($arg['plugin'])&&$arg['plugin'])){ $args = $arg; }
			elseif((is_array($arg))&&(isset($arg[0]))){ $args=json_decode($arg[0],true); }
      else { $args=[]; }
      if(!empty($args)&&isset($args['plugin'])&&isset($this->Settings['plugins'][$args['plugin']])){
        $this->Settings['plugins'][$args['plugin']]['status'] = true;
        $this->SaveCfg(['plugins' => $this->Settings['plugins']]);
        if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo "Plugin [".$args['plugin']."] has been enabled\n";}
      }
    }
  }

  public function __disable($arg = []){
		if($this->LSP->Status){
      if((is_array($arg))&&(isset($arg['plugin'])&&$arg['plugin'])){ $args = $arg; }
			elseif((is_array($arg))&&(isset($arg[0]))){ $args=json_decode($arg[0],true); }
      else { $args=[]; }
      if(!empty($args)&&isset($args['plugin'])&&isset($this->Settings['plugins'][$args['plugin']])){
        $this->Settings['plugins'][$args['plugin']]['status'] = true;
        $this->SaveCfg(['plugins' => $this->Settings['plugins']]);
        if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo "Plugin [".$args['plugin']."] has been disabled\n";}
      }
    }
  }

  public function __install($arg = []){
		if($this->LSP->Status){
      if((is_array($arg))&&(isset($arg['plugin'])&&$arg['plugin'])){ $args = $arg; }
			elseif((is_array($arg))&&(isset($arg[0]))){ $args=json_decode($arg[0],true); }
      else { $args=[]; }
      if(!empty($args)&&isset($args['plugin'])&&isset($this->Plugins[$args['plugin']])){
        if((!is_dir(dirname(__FILE__,3)."/plugins/".$args['plugin']))||(isset($args['force'])&&$args['force'])){
          if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo "Installing [".$args['plugin']."]\n";}
          // Update the local files
          shell_exec("git clone --branch ".$this->Settings['repository']['branch']." ".$this->Plugins[$args['plugin']]['repository']['host']['git'].$this->Plugins[$args['plugin']]['repository']['name'].".git"." ".dirname(__FILE__,3)."/tmp/".$this->Plugins[$args['plugin']]['repository']['name']." &> /dev/null");
          mkdir(dirname(__FILE__,3)."/plugins/".$args['plugin']);
          shell_exec("rsync -aP ".dirname(__FILE__,3)."/tmp/".$this->Plugins[$args['plugin']]['repository']['name']."/* ".dirname(__FILE__,3)."/plugins/".$args['plugin']."/.");
          shell_exec("rm -rf ".dirname(__FILE__,3)."/tmp/".$this->Plugins[$args['plugin']]['repository']['name']);
  				// Updating our database
          if(is_file(dirname(__FILE__,3)."/plugins/".$args['plugin'].'/dist/data/structure.json')){ $this->LSP->updateStructure(dirname(__FILE__,3)."/plugins/".$args['plugin'].'/dist/data/structure.json'); }
  				if(is_file(dirname(__FILE__,3)."/plugins/".$args['plugin'].'/dist/data/skeleton.json')){ $this->LSP->insertRecords(dirname(__FILE__,3)."/plugins/".$args['plugin'].'/dist/data/skeleton.json'); }
  				if(is_file(dirname(__FILE__,3)."/plugins/".$args['plugin'].'/dist/data/sample.json')){ if((isset($args['sample']))&&($args['sample'])){ $this->LSP->insertRecords(dirname(__FILE__,3)."/plugins/".$args['plugin'].'/dist/data/sample.json'); } }
          // Update Settings
          if(is_file(dirname(__FILE__,3)."/plugins/".$args['plugin'].'/dist/data/manifest.json')){ $manifest = json_decode(file_get_contents(dirname(__FILE__,3)."/plugins/".$args['plugin'].'/dist/data/manifest.json'),true); }
          if(isset($this->Settings['plugins'][$args['plugin']]['settings'])){ $conf = $this->Settings['plugins'][$args['plugin']]['settings']; }
          if(isset($manifest)){ $this->Settings['plugins'][$args['plugin']] = $manifest; }
          if(!isset($this->Settings['plugins'][$args['plugin']]['status'])){ $this->Settings['plugins'][$args['plugin']]['status'] = false; }
          $this->SaveCfg(['plugins' => $this->Settings['plugins']]);
          if(isset($conf)){ $this->Settings['plugins'][$args['plugin']]['settings'] = $conf; }
          if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo "Plugin [".$args['plugin']."][".$manifest['build']."] has been installed\n";} elseif(isset($args['silent'])&&$args['silent']) { return true; }
        } else { if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo $args['plugin']." is already installed\n";} elseif(isset($args['silent'])&&$args['silent']) { return false; } }
      } else {
        if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo "Available plugins:\n";}
        foreach($this->Plugins as $name => $plugin){
          if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo " - ".$name."\n";}
        }
        if(isset($args['silent'])&&$args['silent']) { return false; }
      }
    }
  }

  public function __uninstall($arg = []){
		if($this->LSP->Status){
      if((is_array($arg))&&(isset($arg['plugin'])&&$arg['plugin'])){ $args = $arg; }
      elseif((is_array($arg))&&(isset($arg[0]))){ $args=json_decode($arg[0],true); }
      else { $args=[]; }
      if(!empty($args)&&isset($args['plugin'])&&isset($this->Plugins[$args['plugin']])){
        if(is_dir(dirname(__FILE__,3)."/plugins/".$args['plugin'])){
          if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo "Uninstalling [".$args['plugin']."]\n";}
          shell_exec("rm -rf ".dirname(__FILE__,3)."/plugins/".$args['plugin']);
          if(isset($this->Settings['plugins'][$args['plugin']]['settings'])){ $conf = $this->Settings['plugins'][$args['plugin']]['settings']; }
          $build = $this->Settings['plugins'][$args['plugin']]['build'];
          unset($this->Settings['plugins'][$args['plugin']]);
          if(isset($conf)){ $this->Settings['plugins'][$args['plugin']]['settings'] = $conf; }
          $this->SaveCfg(['plugins' => $this->Settings['plugins']]);
          if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo "Plugin [".$args['plugin']."][".$build."] has been uninstalled\n";} elseif(isset($args['silent'])&&$args['silent']) { return true; }
        } else { if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo $args['plugin']." is not installed\n";} elseif(isset($args['silent'])&&$args['silent']) { return false; } }
      } else {
        if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo "Specify a plugin:\n";}
        foreach($this->Plugins as $name => $plugin){
          if(is_dir(dirname(__FILE__,3)."/plugins/".$name)){ if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo " - ".$name."\n";} }
        }
        if(isset($args['silent'])&&$args['silent']) { return false; }
      }
    }
  }

  public function __publish($arg = []){
		if($this->LSP->Status){
			if((is_array($arg))&&(isset($arg[0]))){ $args=json_decode($arg[0],true); } else { $args=[]; }
      if(empty($args)){
        $settings=json_decode(file_get_contents(dirname(__FILE__,3) . '/dist/data/manifest.json'),true);
        $settings['repository']['branch'] = str_replace("\n",'',shell_exec("git rev-parse --abbrev-ref HEAD"));
        $settings['build'] = $settings['build']+1;
        $settings['version'] = date("y.m").'-'.$settings['repository']['branch'];
        $this->SaveAppCfg($settings);
        $this->Settings['build'] = $settings['build'];
        $this->Settings['version'] = $settings['version'];
        $this->Settings['repository']['branch'] = $settings['repository']['branch'];
        shell_exec("git add . && git commit -m '".$settings['version'].'-'.$settings['build']."' && git push origin ".$settings['repository']['branch']);
        echo "\n";
        $this->__version();
        echo "\n";
        echo "Published on ".$this->Settings['repository']['host']['git'].$this->Settings['repository']['name'].".git\n";
      }
    }
  }

  public function __update($arg = []){
		if($this->LSP->Status){
      if((is_array($arg))&&(isset($arg['silent']) && $arg['silent'])){ $args = $arg; }
      elseif((is_array($arg))&&(isset($arg[0]))){ $args=json_decode($arg[0],true); }
      else { $args=[]; }
      $curl = curl_init();
      curl_setopt($curl, CURLOPT_URL, $this->Settings['repository']['host']['raw'].$this->Settings['repository']['name'].'/'.$this->Settings['repository']['branch'].$this->Settings['repository']['manifest']);
      curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
      $manifest = json_decode(curl_exec($curl), true);
      curl_close($curl);
			if(($this->Settings['build'] < $manifest['build'])||((isset($args['force']))&&($args['force']))){
				// We configure our database access
				$this->LSP->configdb($this->Settings['sql']['host'], $this->Settings['sql']['username'], $this->Settings['sql']['password'], $this->Settings['sql']['database']);
        // Putting Server in maintenance mode
        if(file_exists(dirname(__FILE__,3).'/config/config.json') && isset($this->Settings['serverid'])){
          if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo "Enabling Maintenance\n";}
          $this->Settings['maintenance'] = true;
          $this->SaveCfg($this->Settings);
          if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo "Logging off everyone\n";}
          $this->Auth->query('UPDATE `users` SET `token` = ?',null);
        }
				// We backup the database using a JSON file.
        if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo "Creating backup of build [".$this->Settings['build']."]\n";}
        if(isset($this->Settings['sql'])){
  				$timestamp = new Datetime();
          if(!is_dir(dirname(__FILE__,3).'/tmp')){mkdir(dirname(__FILE__,3).'/tmp');}
  				$this->LSP->createStructure(dirname(__FILE__,3).'/tmp/lsp-structure-backup-'.$timestamp->format('U').'.json');
  				$this->LSP->createRecords(dirname(__FILE__,3).'/tmp/lsp-data-backup-'.$timestamp->format('U').'.json');
        } else {
          if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo "No database found\n";}
        }
				// We update the local files
        if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo "Updating local files\n";}
        shell_exec("git clone --branch ".$this->Settings['repository']['branch']." ".$this->Settings['repository']['host']['git'].$this->Settings['repository']['name'].".git"." ".dirname(__FILE__,3)."/tmp/".$this->Settings['repository']['name']." &> /dev/null");
        shell_exec("rsync -aP --exclude='.git/' --exclude='.gitignore' ".dirname(__FILE__,3)."/tmp/".$this->Settings['repository']['name']."/* ".dirname(__FILE__,3)."/.");
        shell_exec("rsync -aP --exclude='.git/' --exclude='.gitignore' ".dirname(__FILE__,3)."/tmp/".$this->Settings['repository']['name']."/.??* ".dirname(__FILE__,3)."/.");
        shell_exec("rm -rf ".dirname(__FILE__,3)."/tmp/".$this->Settings['repository']['name']);
        // Update Manifest Data
        $manifest = json_decode(file_get_contents(dirname(__FILE__,3).'/dist/data/manifest.json'),true);
        if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo "Local files updated to build [".$manifest['build']."]\n";}
				// We start updating our database
        if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo "Upgrading database\n";}
        if(isset($this->Settings['sql'])){
          if(is_file(dirname(__FILE__,3).'/dist/data/structure.json')){ $this->LSP->updateStructure(dirname(__FILE__,3).'/dist/data/structure.json'); }
  				if(is_file(dirname(__FILE__,3).'/dist/data/skeleton.json')){ $this->LSP->insertRecords(dirname(__FILE__,3).'/dist/data/skeleton.json'); }
  				if(is_file(dirname(__FILE__,3).'/dist/data/sample.json')){ if((isset($args['sample']))&&($args['sample'])){ $this->LSP->insertRecords(dirname(__FILE__,3).'/dist/data/sample.json'); } }
        }
        // Saving new configurations
        if(file_exists(dirname(__FILE__,3).'/config/config.json') && isset($this->Settings['serverid'])){
          if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo "Saving new configurations\n";}
          $this->Settings['build'] = $manifest['build'];
          $this->Settings['version'] = $manifest['version'];
          $this->Settings['maintenance'] = false;
          $this->Settings['serverid'] = password_hash(md5($_SERVER['DOCUMENT_ROOT'].$_SERVER['SCRIPT_FILENAME'].$_SERVER['PATH']), PASSWORD_BCRYPT, ['cost' => 10]);
          $this->SaveCfg($this->Settings);
        } else {
          if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo "Application is not installed\n";}
        }
        if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo "Application updated successfully\n";}
				if(isset($args['silent'])&&$args['silent']) { return ["success" => $this->Language->Field["Application updated successfully"]]; }
			} else {
        if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo "No updates available\n";}
				if(isset($args['silent'])&&$args['silent']) { return ["error" => $this->Language->Field["No updates available"]]; }
			}
		} else {
      if(!isset($args['silent'])||(isset($args['silent'])&&!$args['silent'])){echo "Application not activated\n";}
			if(isset($args['silent'])&&$args['silent']) { return ["error" => $this->Language->Field["Application not activated"]]; }
		}
  }

  public function __api($array = null){
		if($array != null){
			if(is_array($array)){
				foreach($array as $json){
					if(!is_array($json)){ $POST = json_decode($json, true); }
					if(isset($POST['request'])){
						if((isset($POST['method'],$POST['token']))&&($POST['method'] == "token")){
							$this->Auth->loginToken($POST['token']);
							if($this->Auth->isLogin()){
								$file = dirname(__FILE__,3).'/plugins/'.$POST['request'].'/api.php';
								if(is_file($file)){
									if((isset($this->Settings['plugins'][$POST['request']]))&&$this->Settings['plugins'][$POST['request']]){
										require_once $file;
										if(class_exists($POST['request'].'API')){
											$request = $POST['request'].'API';
											$request = new $request();
											if((isset($POST['type']))&&(method_exists($request,$POST['type']))){
												$return = $POST['type'];
												if(isset($POST['data'])){ $return = $request->$return($POST['request'], $POST['data']); }
												else { $return = $request->$return($POST['request']); }
												if(!is_bool($return)){ $return = json_encode($return, JSON_PRETTY_PRINT); }
												return $return;
											} else { return [ "error" => $this->Language->Field["unknown request type"], "request" => $POST ]; }
										} else { return [ "error" => $this->Language->Field["unknown request"], "request" => $POST ]; }
									} else { return [ "error" => $this->Language->Field["plugin not enabled"], "request" => $POST ]; }
								} else { return [ "error" => $this->Language->Field["unknown api"], "request" => $POST, "file" => $file ]; }
							} else { return [ "error" => $this->Language->Field["invalid token"], "request" => $POST ]; }
						} else { return [ "error" => $this->Language->Field["empty token"], "request" => $POST ]; }
				} else { return [ "error" => $this->Language->Field["empty request"], "request" => $POST ]; }
				}
			} else { return [ "error" => $this->Language->Field["no argument"], "request" => $POST ]; }
		} else { return [ "error" => $this->Language->Field["no request"], "request" => $POST ]; }
  }
}
