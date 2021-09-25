<?php
class messagesAPI extends CRUDAPI {

	public function read($request = null, $data = null){
		if(($data != null)||($data == null)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			$messages = $this->Auth->query('SELECT * FROM `messages` WHERE `isAttached` = ?',
				'false'
			)->fetchAll();
			if($messages != null){
				$messages = $messages->all();
				// Init Result
				$result = [];
				foreach($messages as $key => $lead){ $result[$key] = $this->convertToDOM($lead); }
				$headers = $this->Auth->getHeaders('messages',true);
				foreach($headers as $key => $header){
					if(!$this->Auth->valid('field',$header,1,'messages')){
						foreach($messages as $row => $values){
							unset($messages[$row][$header]);
							unset($result[$row][$header]);
						}
						unset($headers[$key]);
					}
				}
				$results = [
					"success" => $this->Language->Field["This request was successfull"],
					"request" => $request,
					"data" => $data,
					"output" => [
						'headers' => $headers,
						'raw' => $messages,
						'dom' => $result,
					],
				];
			} else {
				$results = [
					"error" => $this->Language->Field["Unable to complete the request"],
					"request" => $request,
					"data" => $data,
					"output" => [
						"messages" => $messages,
					],
				];
			}
		} else {
			$results = [
				"error" => $this->Language->Field["Unable to complete the request"],
				"request" => $request,
				"data" => $data,
			];
		}
		return $results;
	}

  public function getMail($host,$port,$encryption = "SSL",$username,$password){
    // Init IMAP
    $IMAP = new PHPIMAP($host,$port,$encryption,$username,$password);
    // Check Connection Status
    if($IMAP->isConnected()){
      // Retrieve INBOX
      $inbox = $IMAP->get();
      // Output ids and subject of all messages retrieved
      foreach($inbox->messages as $msg){
        $message = [
          "account" => "patch@albcustoms.com",
          "folder" => "INBOX",
          "mid" => trim($msg->Header->message_id,' '),
          "uid" => $msg->UID,
          "reply_to_id" => "",
          "reference_id" => "",
          "sender" => $msg->Sender,
          "from" => $msg->From,
          "to" => "",
          "cc" => "",
          "bcc" => "",
          "meta" => json_encode($msg->Subject->Meta, JSON_PRETTY_PRINT),
          "subject_original" => $msg->Subject->Full,
          "subject_stripped" => $msg->Subject->PLAIN,
          "body_original" => $msg->Body->Content,
          "body_unquoted" => $msg->Body->Unquoted,
          "attachments" => "",
        ];
        if(isset($msg->Header->in_reply_to)){ $message["reply_to_id"] = $msg->Header->in_reply_to; }
        if(isset($msg->Header->references)){
          foreach(explode(' ',$msg->Header->references) as $reference){
            $message["reference_id"] .= trim($reference,',').";";
          }
          $message["reference_id"] = trim($message["reference_id"],';');
        }
        foreach($msg->To as $to){
          $message["to"] .= $to.";";
        }
        $message["to"] = trim($message["to"],';');
        foreach($msg->CC as $cc){
          $message["cc"] .= $cc.";";
        }
        $message["cc"] = trim($message["cc"],';');
        foreach($msg->BCC as $bcc){
          $message["bcc"] .= $bcc.";";
        }
        $message["bcc"] = trim($message["bcc"],';');
        foreach($msg->Attachments->Files as $file){
          $file["created"] = date("Y-m-d H:i:s");
          $file["modified"] = date("Y-m-d H:i:s");
          $file["owner"] = $this->Auth->User['id'];
          $file["updated_by"] = $this->Auth->User['id'];
          $file["isAttachment"] = "true";
          $file["file"] = $file["attachment"];
          $file["size"] = $file["bytes"];
          $file["encoding"] = $file["encoding"];
          $file["meta"] = "";
          $file["type"] = "unknown";
          if(isset($file["name"])){
            $filename = explode('.',$file["name"]);
            $file["type"] = end($filename);
          } else { $file["name"] = null; }
          if(isset($file["filename"])){
            $filename = explode('.',$file["filename"]);
            $file["type"] = end($filename);
          } else { $file["filename"] = null; }
          $fileID = $this->saveFile($file);
          if($fileID != null || $fileID != ''){ $message["attachments"] .= $fileID.";"; }
        }
        $message["attachments"] = trim($message["attachments"],';');
        $message["created"] = date("Y-m-d H:i:s");
        $message["modified"] = date("Y-m-d H:i:s");
        $message["owner"] = $this->Auth->User['id'];
        $message["updated_by"] = $this->Auth->User['id'];
        $this->saveMail($message);
        $IMAP->delete($message['uid']);
      }
    }
  }

  protected function saveFile($file, $from = 'louis@albcie.com'){
    if(!isset($this->Settings['plugins']['messages']['files']['blacklist'])||(isset($this->Settings['plugins']['messages']['files']['blacklist']) && is_array($this->Settings['plugins']['messages']['files']['blacklist']) && !in_array($file['type'], $this->Settings['plugins']['messages']['files']['blacklist']))){
      $query = $this->Auth->query('INSERT INTO `files` (
        `created`,
        `modified`,
        `owner`,
        `updated_by`,
        `name`,
        `filename`,
        `file`,
        `type`,
        `size`,
        `encoding`,
        `meta`,
        `isAttachment`
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
        $file["created"],
        $file["modified"],
        $file["owner"],
        $file["updated_by"],
        $file["name"],
        $file["filename"],
        $file["file"],
        $file["type"],
        $file["size"],
        $file["encoding"],
        $file["meta"],
        $file["isAttachment"]
      );
      set_time_limit(20);
      return $query->dump()['insert_id'];
    } elseif(isset($this->Settings['plugins']['messages']['files']['auto-reply'],$this->Settings['plugins']['messages']['files']['blacklist']) && $this->Settings['plugins']['messages']['files']['auto-reply']) {
			$message = "Hi, <br>\n
									an attachment you sent was not authorized.<br>\n
									<ul><li>".$file["filename"]."</li></ul><br>\n
									Unauthorized file type:<br>\n
									<ul>
									";
			foreach($this->Settings['plugins']['messages']['files']['blacklist'] as $type){
				$message .= "<li>".strtoupper($type)."</li>";
			}
			$message .= "</ul><br>\n";
			$this->Auth->Mail->send($from, $message, [
				"subject" => "UNAUTHORIZED FILE TYPE",
				"acceptReplies" => false,
			]);
		}
  }

  protected function saveMail($mail){
    $query = $this->Auth->query('INSERT INTO `messages` (
      `created`,
      `modified`,
      `owner`,
      `updated_by`,
      `account`,
      `folder`,
      `mid`,
      `uid`,
      `reply_to_id`,
      `reference_id`,
      `sender`,
      `from`,
      `to`,
      `cc`,
      `bcc`,
      `meta`,
      `subject_original`,
      `subject_stripped`,
      `body_original`,
      `body_unquoted`,
      `attachments`
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      $mail["created"],
      $mail["modified"],
      $mail["owner"],
      $mail["updated_by"],
      $mail["account"],
      $mail["folder"],
      str_replace(['>','<'],['',''],$mail["mid"]),
      str_replace(['>','<'],['',''],$mail["uid"]),
      str_replace(['>','<'],['',''],$mail["reply_to_id"]),
      str_replace(['>','<'],['',''],$mail["reference_id"]),
      strtolower($mail["sender"]),
      strtolower($mail["from"]),
      strtolower($mail["to"]),
      strtolower($mail["cc"]),
      strtolower($mail["bcc"]),
      $mail["meta"],
      $mail["subject_original"],
      $mail["subject_stripped"],
      $mail["body_original"],
      $mail["body_unquoted"],
      $mail["attachments"]
    );
    set_time_limit(20);
    return $query->dump()['insert_id'];
  }
}
