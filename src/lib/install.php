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

$conn = new mysqli($_POST['sql_host'],$_POST['sql_username'],$_POST['sql_password'],$_POST['sql_database']);
if (!$conn->connect_error){
	echo "SQL Database Connexion Successfull!<br>\n";
  error_reporting(-1);
  date_default_timezone_set($_POST['site_timezone']);

  //Switches
  $drop = "yes";
	require_once(dirname(__FILE__,3).'/src/lib/lsp.php');
	$LSP = new LSP('https://license.albcie.com/','ALB-Connect',$_POST['activation_license'],'$2y$10$3Vr0SJofCwk98pxm.Vzcdu/YEG5l5RCD0V0IJjwEfL5Z86sGOPKUO');
	if($LSP->Status){
		if(!file_exists(dirname(__FILE__,3).'/config/config.json')){
			echo "Application Activation Successfull!<br>\n";
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
			if(file_exists(dirname(__FILE__,3).'/config/structure.json')){
				$LSP->updateStructure(dirname(__FILE__,3).'/config/structure.json');
				echo "Database structure was created successfully<br>\n";
				echo "Creating default database records<br>\n";
				if(file_exists(dirname(__FILE__,3).'/config/skeleton.json')){
					$LSP->insertRecords(dirname(__FILE__,3).'/config/skeleton.json');
					echo "Database default records were created successfully<br>\n";
					if((isset($_POST['site_sample']))&&($_POST['site_sample'] == 'true')){
						echo "Creating database sample records<br>\n";
						if(file_exists(dirname(__FILE__,3).'/config/sample.json')){
							$LSP->insertRecords(dirname(__FILE__,3).'/config/sample.json');
							echo "Database sample records were created successfully<br>\n";
						} else {
							echo "Unable to import the database sample records<br>\n";
						}
					}
			    //NEED TO CREATE USER
					$Settings = [
						'page' => $_POST["site_page"],
						'id' => generateRandomString(64),
						'serverid' => password_hash(md5($_POST["serverid"]), PASSWORD_BCRYPT, ["cost" => 10]),
						'background_jobs' => $_POST["site_background_jobs"],
						'last_background_jobs' => date("Y-m-d H:i:s"),
						'timezone' => $_POST["site_timezone"],
						'sql' => [
							'username' => $_POST["sql_username"],
							'password' => $_POST["sql_password"],
							'host' => $_POST["sql_host"],
							'database' => $_POST["sql_database"],
						],
						'license' => $_POST["site_license"],
						'branch' => 'master',
					];
					$json = fopen(dirname(__FILE__,3).'/config/config.json', 'w');
					fwrite($json, json_encode($Settings));
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
