<?php
function generateRandomString($length = 10) {
  $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  $charactersLength = strlen($characters);
  $randomString = '';
  for ($i = 0; $i < $length; $i++) {
      $randomString .= $characters[rand(0, $charactersLength - 1)];
  }
  return $randomString;
}
error_reporting(0);
$conn = new mysqli($_POST['sql_host'],$_POST['sql_username'],$_POST['sql_password'],$_POST['sql_database']);
error_reporting(-1);
$settings=json_decode(file_get_contents(dirname(__FILE__,3) . '/dist/data/manifest.json'),true);
$plugins = json_decode(file_get_contents(dirname(__FILE__,3) . '/dist/data/plugins.json'),true);
if (!$conn->connect_error){
	echo "SQL Database Connexion Successfull!<br>\n";
  error_reporting(-1);
  date_default_timezone_set($_POST['site_timezone']);
  $settings['sql']['host'] = $_POST['sql_host'];
  $settings['sql']['database'] = $_POST['sql_database'];
  $settings['sql']['username'] = $_POST['sql_username'];
  $settings['sql']['password'] = $_POST['sql_password'];

  //Switches
  $drop = "yes";
	require_once(dirname(__FILE__,3).'/src/lib/lsp.php');
  if(isset($settings['lsp']['required'])&&$settings['lsp']['required']){
    $LSP = new LSP('https://license.albcie.com/','ALB-Connect',$_POST['activation_license'],'$2y$10$3Vr0SJofCwk98pxm.Vzcdu/YEG5l5RCD0V0IJjwEfL5Z86sGOPKUO');
  } else { $LSP = new LSP(); }
	if($LSP->Status){
		if(!file_exists(dirname(__FILE__,3).'/config/config.json')){
      if(isset($settings['lsp']['required'])&&$settings['lsp']['required']){
        echo "Application Activation Successfull!<br>\n";
      }
		  //We remove all existing tables
		  if($drop == "yes"){
				echo "Removing existing tables from the database<br>\n";
		    $query = 'SET foreign_key_checks = 1';
		    if ($conn->query($query) === TRUE){
		      if ($result = $conn->query("SHOW TABLES")){
		        while($row = $result->fetch_array(MYSQLI_NUM)){
		          $query = 'DROP TABLE IF EXISTS '.$row[0];
		          if ($conn->query($query) === TRUE){
		            echo "Table ".$row[0]." was successfully dropped <br>\n";
		          } else {
		            echo "Error while removing table ".$row[0]." <br>\n";
		          }
		        }
		      }
		    } else {
		      echo "Error while removing tables"."<br>\n";
		    }
		    $query = 'SET foreign_key_checks = 1';
		    if ($conn->query($query) !== TRUE){ echo "Error while removing tables"."<br>\n"; }
		  }
			$LSP->configdb($_POST['sql_host'],$_POST['sql_username'],$_POST['sql_password'],$_POST['sql_database']);
			echo "Creating database structure<br>\n";
			if(file_exists(dirname(__FILE__,3).'/dist/data/structure.json')){
				$LSP->updateStructure(dirname(__FILE__,3).'/dist/data/structure.json');
				echo "Database structure was created successfully<br>\n";
				echo "Creating default database records<br>\n";
				if(file_exists(dirname(__FILE__,3).'/dist/data/skeleton.json')){
					$LSP->insertRecords(dirname(__FILE__,3).'/dist/data/skeleton.json');
					echo "Database default records were created successfully<br>\n";
					if((isset($_POST['site_sample']))&&($_POST['site_sample'] == 'true')){
						echo "Creating database sample records<br>\n";
						if(file_exists(dirname(__FILE__,3).'/dist/data/sample.json')){
							$LSP->insertRecords(dirname(__FILE__,3).'/dist/data/sample.json');
							echo "Database sample records were created successfully<br>\n";
						} else {
							echo "Unable to import the database sample records<br>\n";
						}
					}
          $settings['title'] = $_POST["site_name"];
          $settings['page'] = $_POST["site_page"];
          $settings['id'] = generateRandomString(64);
          $settings['serverid'] = password_hash(md5($_POST["serverid"]), PASSWORD_BCRYPT, ["cost" => 10]);
          $settings['background_jobs'] = $_POST["site_background_jobs"];
          $settings['last_background_jobs'] = date("Y-m-d H:i:s");
          $settings['timezone'] = $_POST["site_timezone"];
          $settings['license'] = $_POST["activation_license"];
          echo "Installing plugins<br>\n";
          foreach($settings['plugins'] as $plugin => $conf){
            if(!is_dir(dirname(__FILE__,3)."/plugins/".$plugin)){
              echo "Installing ".$plugin."<br>\n";
              shell_exec("git clone --branch ".$settings['repository']['branch']." ".$plugins[$plugin]['repository']['host']['git'].$plugins[$plugin]['repository']['name'].".git"." ".dirname(__FILE__,3)."/tmp/".$plugins[$plugin]['repository']['name']);
              mkdir(dirname(__FILE__,3)."/plugins/".$plugin);
              shell_exec("rsync -aP ".dirname(__FILE__,3)."/tmp/".$plugins[$plugin]['repository']['name']."/* ".dirname(__FILE__,3)."/plugins/".$plugin."/.");
              shell_exec("rm -rf ".dirname(__FILE__,3)."/tmp/".$plugins[$plugin]['repository']['name']);
      				// We start updating our database
              if(is_file(dirname(__FILE__,3)."/plugins/".$plugin.'/dist/data/structure.json')){ $this->LSP->updateStructure(dirname(__FILE__,3)."/plugins/".$plugin.'/dist/data/structure.json'); }
      				if(is_file(dirname(__FILE__,3)."/plugins/".$plugin.'/dist/data/skeleton.json')){ $this->LSP->insertRecords(dirname(__FILE__,3)."/plugins/".$plugin.'/dist/data/skeleton.json'); }
      				if(is_file(dirname(__FILE__,3)."/plugins/".$plugin.'/dist/data/sample.json')){ if((isset($args['sample']))&&($args['sample'])){ $this->LSP->insertRecords(dirname(__FILE__,3)."/plugins/".$plugin.'/dist/data/sample.json'); } }
              $settings['plugins'][$plugin] = json_decode(file_get_contents(dirname(__FILE__,3)."/plugins/".$plugin.'/dist/data/manifest.json'),true);
              if(!isset($settings['plugins'][$plugin]['status'])){$settings['plugins'][$plugin]['status'] = $conf['status'];}
              echo $plugin." has been installed<br>\n";
            } else { echo $plugin." is already installed<br>\n"; }
          }
          $servertoken = md5($_SERVER['DOCUMENT_ROOT'].$_SERVER['SCRIPT_FILENAME'].$_SERVER['PATH']);
          $settings['serverid'] = password_hash($servertoken, PASSWORD_BCRYPT, ['cost' => 10]);
					$json = fopen(dirname(__FILE__,3).'/config/config.json', 'w');
					fwrite($json, json_encode($settings, JSON_PRETTY_PRINT));
					fclose($json);
			    echo "Installation has completed successfully at ".date("Y-m-d H:i:s")."!<br>\n";
				} else {
					echo "Unable to import the database default records<br>\n";
				}
			} else {
				echo "Unable to import the database structure<br>\n";
			}
		} else {
			echo "Application is already installed<br>\n";
		}
	} else {
	  echo "Unable to activate the application, verify you license key<br>\n";
	}
	$conn->close();
} else {
  echo "Unable to connect to SQL Server<br>\n";
}
error_reporting(0);
$conn->close();
error_reporting(-1);
?>
