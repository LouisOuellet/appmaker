<?php

// Module INSTALLATION
//   sudo apt-get install -y php-auth-pam
//
//  The parameters are
//
//    username		- Username to check
//    password		- User supplied password
//    error		- Output parameter to put any error messages in
//    checkacctmgmt	- Call pam_acct_mgmt() to check account expiration and access hours (requires root access!)
//    servicename		- PAM service name to use (provided pam.force_servicename is not TRUE)
//    oldpassword		- Current password on account
//    newpassword		- Password to change to
//
// INSTALLATION
//
//   For pam_auth and pam_chpass to work, module must know about the PAM service to use.
//
//   By default, the PAM service is set to "php". It can be changed by adding the following
//   to your php.ini:
//
//   pam.servicename = "your-pam-service|php";
//
//   Service name can also be, optionally, passed as a parameter to pam_auth OR pam_chpass.
//
//   You can inform the module to ignore the service name passed as a parameter and use
//   pam.servicename only, by adding the following to your php.ini:
//
//   pam.force_servicename = 1;
//
//   Next, you'll need to create a pam service file for php. If you are on linux,
//   you'll need to create the file /etc/pam.d/php. You can copy another one to work
//   off of (/etc/pam.d/login is a good choice).
//
//   Some examples that should work:
//
//   on linux:
//
// # /etc/pam.d/php
// #
// # note: both an auth and account entry are required
//
// auth	sufficient	/lib/security/pam_pwdb.so shadow nodelay
// account	sufficient	/lib/security/pam_pwdb.so

// Import Librairies

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
