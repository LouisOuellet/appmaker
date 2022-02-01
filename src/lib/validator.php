<?php

class Validator{

	public function email($email){
		if(filter_var($email, FILTER_VALIDATE_EMAIL)){
			return TRUE;
		} else {
			$error = array(
				'type' => 'error',
				'title' => 'Invalid Email',
				'body' => 'The email address provided is invalid.',
			);
			return $error;
		}
	}

	public function checkPassword($pwd, $pwd2){
		$valid = TRUE;
		if($pwd != $pwd2){
			$valid = FALSE;
			$error = array(
				'type' => 'error',
				'title' => 'Invalid Password',
				'body' => 'Both passwords must be identical.',
			);
		}
		if(strlen($pwd) < 8){
			$valid = FALSE;
			$error = array(
				'type' => 'error',
				'title' => 'Invalid Password',
				'body' => 'The password provided is too short.',
			);
		}
		if(!preg_match("/\d/", $pwd)){
			$valid = FALSE;
			$error = array(
					'type' => 'error',
					'title' => 'Invalid Password',
					'body' => 'The password provided must include at least one number.',
			);
		}
		if(!preg_match("/[A-Z]/", $pwd)){
			$valid = FALSE;
			$error = array(
				'type' => 'error',
				'title' => 'Invalid Password',
				'body' => 'The password provided must include at least one capital letter.',
			);
		}
		if(!preg_match("/[a-z]/", $pwd)){
			$valid = FALSE;
			$error = array(
				'type' => 'error',
				'title' => 'Invalid Password',
				'body' => 'The password provided must include at least one small letter.',
			);
		}
		if(!preg_match("/\W/", $pwd)){
			$valid = FALSE;
			$error = array(
				'type' => 'error',
				'title' => 'Invalid Password',
				'body' => 'The password provided must include at least one special character.',
			);
		}
		if(preg_match("/\s/", $pwd)){
			$valid = FALSE;
			$error = array(
				'type' => 'error',
				'title' => 'Invalid Password',
				'body' => 'The password provided must not contain any white space.',
			);
		}
		if($valid){
			return TRUE;
		} else {
			return $error;
		}
	}
}
