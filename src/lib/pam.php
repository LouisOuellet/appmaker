<?php

class PAM{

	public function login($usr,$pwd){
		if(pam_auth($usr,$pwd,$error)){
			return TRUE;
		} else {
			return $error;
		}
	}

	public function updatePassword($usr,$opwd,$npwd){
		if(pam_chpass($username,$opwd,$npwd,$error)){
			return TRUE;
		} else {
			return $error;
		}
	}
}
