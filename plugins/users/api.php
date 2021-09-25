<?php
class usersAPI extends CRUDAPI {
	public function create($request = null, $data = null){
		if($data != null){
			if(!is_array($data)){ $data = json_decode($data, true); }
			if((isset($data['password'],$data['password2']))&&($data['password'] == $data['password2'])){
				unset($data['password2']);
				// Validate password strength
				$uppercase = preg_match('@[A-Z]@', $data['password']);
				$lowercase = preg_match('@[a-z]@', $data['password']);
				$number    = preg_match('@[0-9]@', $data['password']);
				$specialChars = preg_match('@[^\w]@', $data['password']);
				if(!$uppercase || !$lowercase || !$number || !$specialChars || strlen($data['password']) > 8) {
					$data['password'] = password_hash($data['password'], PASSWORD_BCRYPT, array("cost" => 10));
					return parent::create($request, $data);
				} else {
					return [
						"error" => $this->Language->Field["Password should be at least 8 characters in length and should include at least one upper case letter, one number, and one special character"],
						"request" => $request,
						"data" => $data,
					];
				}
			} else {
				return [
					"error" => $this->Language->Field["Invalid password"],
					"request" => $request,
					"data" => $data,
				];
			}
		}
	}
	public function update($request = null, $data = null){
		if($data != null){
			if(!is_array($data)){ $data = json_decode($data, true); }
			if((isset($data['password'],$data['password2']))&&($data['password'] == $data['password2'])&&($data['password'] != '')){
				unset($data['password2']);
				// Validate password strength
				$uppercase = preg_match('@[A-Z]@', $data['password']);
				$lowercase = preg_match('@[a-z]@', $data['password']);
				$number    = preg_match('@[0-9]@', $data['password']);
				$specialChars = preg_match('@[^\w]@', $data['password']);
				if(!$uppercase || !$lowercase || !$number || !$specialChars || strlen($data['password']) > 8) {
					$data['password'] = password_hash($data['password'], PASSWORD_BCRYPT, array("cost" => 10));
					return parent::update($request, $data);
				} else {
					return [
						"error" => $this->Language->Field["Password should be at least 8 characters in length and should include at least one upper case letter, one number, and one special character"],
						"request" => $request,
						"data" => $data,
					];
				}
			} else {
				unset($data['password']);
				unset($data['password2']);
				return parent::update($request, $data);
			}
		}
	}
}
