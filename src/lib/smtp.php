<?php

// Import Librairies
require_once dirname(__FILE__,3) . '/vendor/PHPMailer/src/Exception.php';
require_once dirname(__FILE__,3) . '/vendor/PHPMailer/src/PHPMailer.php';
require_once dirname(__FILE__,3) . '/vendor/PHPMailer/src/SMTP.php';
require_once dirname(__FILE__,3) . '/src/lib/language.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

class MAIL{

	public $Mailer; // Contains the PHPMailer Class
  protected $Language; // Contains the Language Class
	protected $URL; // Contains the main URL
	protected $Brand; // Contains the brand name
	protected $Links = [
		"support" => "",
		"trademark" => "",
		"policy" => "",
		"logo" => "",
	]; // Contains the various links required

	public function __construct($host,$port,$encryption,$username,$password,$language = 'english'){
		// Setup Language
		$this->Language = new Language($language);

		// Setup URL
		if(isset($_SERVER['HTTP_HOST'])){
			$this->URL = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http")."://";
			$this->URL .= $_SERVER['HTTP_HOST'].'/';
		}

		// Setup PHPMailer
		$this->Mailer = new PHPMailer(true);
		$this->Mailer->isSMTP();
    $this->Mailer->Host = $host;
    $this->Mailer->SMTPAuth = true;
    $this->Mailer->Username = $username;
    $this->Mailer->Password = $password;
		if($encryption == 'SSL'){
			$this->Mailer->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
		}
		if($encryption == 'STARTTLS'){
			$this->Mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
		}
    $this->Mailer->Port = $port;
	}

	public function login($username,$password,$host,$port,$encryption = null){
		// Setup PHPMailer
		$mail = new PHPMailer(true);
		$mail->isSMTP();
		$mail->Host = $host;
		$mail->SMTPAuth = true;
		$mail->Username = $username;
		$mail->Password = $password;
		if($encryption == 'SSL'){ $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; }
		if($encryption == 'STARTTLS'){ $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; }
		$mail->Port = $port;
		if($mail->SmtpConnect()){return true;}else{return false;}
}

	public function sendReset($email,$token){
		$this->Mailer->setFrom($this->Mailer->Username, 'ALB Connect');
		$this->Mailer->addAddress($email);
		$this->Mailer->isHTML(true);
		$this->Mailer->Subject = 'ALB Connect | Reset your password';
    $this->Mailer->Body    = '
		<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
			<head>
			<!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
			<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
			<meta content="width=device-width" name="viewport"/>
			<!--[if !mso]><!-->
			<meta content="IE=edge" http-equiv="X-UA-Compatible"/>
			<!--<![endif]-->
			<title></title>
			<!--[if !mso]><!-->
			<link href="https://fonts.googleapis.com/css?family=Abril+Fatface" rel="stylesheet" type="text/css"/>
			<link href="https://fonts.googleapis.com/css?family=Droid+Serif" rel="stylesheet" type="text/css"/>
			<!--<![endif]-->
			<style type="text/css">
					body {
						margin: 0;
						padding: 0;
					}
					table,
					td,
					tr {
						vertical-align: top;
						border-collapse: collapse;
					}
					* {
						line-height: inherit;
					}
					a[x-apple-data-detectors=true] {
						color: inherit !important;
						text-decoration: none !important;
					}
				</style>
			<style id="media-query" type="text/css">
					@media (max-width: 620px) {
						.block-grid,
						.col {
							min-width: 320px !important;
							max-width: 100% !important;
							display: block !important;
						}
						.block-grid {
							width: 100% !important;
						}
						.col {
							width: 100% !important;
						}
						.col>div {
							margin: 0 auto;
						}
						img.fullwidth,
						img.fullwidthOnMobile {
							max-width: 100% !important;
						}
						.no-stack .col {
							min-width: 0 !important;
							display: table-cell !important;
						}
						.no-stack.two-up .col {
							width: 50% !important;
						}
						.no-stack .col.num4 {
							width: 33% !important;
						}
						.no-stack .col.num8 {
							width: 66% !important;
						}
						.no-stack .col.num4 {
							width: 33% !important;
						}
						.no-stack .col.num3 {
							width: 25% !important;
						}
						.no-stack .col.num6 {
							width: 50% !important;
						}
						.no-stack .col.num9 {
							width: 75% !important;
						}
						.video-block {
							max-width: none !important;
						}
						.mobile_hide {
							min-height: 0px;
							max-height: 0px;
							max-width: 0px;
							display: none;
							overflow: hidden;
							font-size: 0px;
						}
						.desktop_hide {
							display: block !important;
							max-height: none !important;
						}
					}
				</style>
			</head>
		<body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #ededed;">
		<!--[if IE]><div class="ie-browser"><![endif]-->
		<table bgcolor="#ededed" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ededed; width: 100%;" valign="top" width="100%">
		<tbody>
		<tr style="vertical-align: top;" valign="top">
		<td style="word-break: break-word; vertical-align: top;" valign="top">
		<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#ededed"><![endif]-->
		<div style="background-color:transparent;">
		<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
		<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
		<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
		<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:transparent;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:15px; padding-bottom:0px;"><![endif]-->
		<div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top; width: 600px;">
		<div style="width:100% !important;">
		<!--[if (!mso)&(!IE)]><!-->
		<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:15px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
		<!--<![endif]-->
		<div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">
		<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" border="0" class="center autowidth" src="'.$this->URL.'dist/img/top_background.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 600px; display: block;" width="600"/>
		<!--[if mso]></td></tr></table><![endif]-->
		</div>
		<!--[if (!mso)&(!IE)]><!-->
		</div>
		<!--<![endif]-->
		</div>
		</div>
		<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
		<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
		</div>
		</div>
		</div>
		<div style="background-color:transparent;">
		<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
		<div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
		<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
		<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:#ffffff;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
		<div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top; width: 600px;">
		<div style="width:100% !important;">
		<!--[if (!mso)&(!IE)]><!-->
		<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
		<!--<![endif]-->
		<div align="center" class="img-container center fixedwidth" style="padding-right: 5px;padding-left: 5px;">
		<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 5px;padding-left: 5px;" align="center"><![endif]-->
		<div style="font-size:1px;line-height:5px"> </div><img align="center" border="0" class="center fixedwidth" src="'.$this->URL.'dist/img/logo-alb-blue.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 200px; display: block;" width="120"/>
		<div style="font-size:1px;line-height:5px"> </div>
		<!--[if mso]></td></tr></table><![endif]-->
		</div>
		<!--[if (!mso)&(!IE)]><!-->
		</div>
		<!--<![endif]-->
		</div>
		</div>
		<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
		<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
		</div>
		</div>
		</div>
		<div style="background-color:transparent;">
		<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
		<div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
		<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
		<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:#ffffff;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 5px; padding-left: 5px; padding-top:45px; padding-bottom:25px;"><![endif]-->
		<div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top; width: 600px;">
		<div style="width:100% !important;">
		<!--[if (!mso)&(!IE)]><!-->
		<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:45px; padding-bottom:25px; padding-right: 5px; padding-left: 5px;">
		<!--<![endif]-->
		<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 30px; padding-left: 30px; padding-top: 5px; padding-bottom: 5px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
		<div style="color:#2d2d2d;font-family:Ubuntu, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:5px;padding-right:30px;padding-bottom:5px;padding-left:30px;">
		<div style="line-height: 1.2; font-size: 12px; color: #2d2d2d; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px;">
		<p style="font-size: 18px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;"><span style="font-size: 18px;"><strong>'.$this->Language->Field['Resetting your password'].'<br/></strong></span></p>
		</div>
		</div>
		<!--[if mso]></td></tr></table><![endif]-->
		<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 30px; padding-left: 30px; padding-top: 5px; padding-bottom: 5px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
		<div style="color:#6c6c6c;font-family:Ubuntu, Tahoma, Verdana, Segoe, sans-serif;line-height:1.5;padding-top:5px;padding-right:30px;padding-bottom:5px;padding-left:30px;">
		<div style="line-height: 1.5; font-size: 12px; color: #6c6c6c; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 18px;">
		<p style="font-size: 12px; line-height: 1.5; word-break: break-word; text-align: center; mso-line-height-alt: 18px; margin: 0;"><span style="font-size: 12px;">'.$this->Language->Field['* If you did not request this email, please forward it to your network administrator.'].'<br/></span></p>
		</div>
		</div>
		<!--[if mso]></td></tr></table><![endif]-->
		<div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
		<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="'.$this->URL.'?forgot='.$token.'" style="height:31.5pt; width:180.75pt; v-text-anchor:middle;" arcsize="0%" stroke="false" fillcolor="#007bff"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Tahoma, Verdana, sans-serif; font-size:16px"><![endif]--><a href="'.$this->URL.'?forgot='.$token.'" style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #ffffff; background-color: #007bff; border-radius: 0px; -webkit-border-radius: 0px; -moz-border-radius: 0px; width: auto; width: auto; border-top: 1px solid #007bff; border-right: 1px solid #007bff; border-bottom: 1px solid #007bff; border-left: 1px solid #007bff; padding-top: 5px; padding-bottom: 5px; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;" target="_blank"><span style="padding-left:50px;padding-right:50px;font-size:16px;display:inline-block;">
		<span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;">'.$this->Language->Field['Reset'].'</span></span></a>
		<!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
		</div>
		<!--[if (!mso)&(!IE)]><!-->
		</div>
		<!--<![endif]-->
		</div>
		</div>
		<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
		<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
		</div>
		</div>
		</div>
		<div style="background-color:transparent;">
		<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
		<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
		<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
		<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:transparent;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:15px;"><![endif]-->
		<div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top; width: 600px;">
		<div style="width:100% !important;">
		<!--[if (!mso)&(!IE)]><!-->
		<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:15px; padding-right: 0px; padding-left: 0px;">
		<!--<![endif]-->
		<div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">
		<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" border="0" class="center autowidth" src="'.$this->URL.'dist/img/bottom_background.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 600px; display: block;" width="600"/>
		<!--[if mso]></td></tr></table><![endif]-->
		</div>
		<!--[if (!mso)&(!IE)]><!-->
		</div>
		<!--<![endif]-->
		</div>
		</div>
		<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
		<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
		</div>
		</div>
		</div>
		<div style="background-color:transparent;">
		<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
		<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
		<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
		<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:transparent;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
		<div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top; width: 600px;">
		<div style="width:100% !important;">
		<!--[if (!mso)&(!IE)]><!-->
		<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
		<!--<![endif]-->
		<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
		<tbody>
		<tr style="vertical-align: top;" valign="top">
		<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;" valign="top">
		<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="20" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 20px; width: 100%;" valign="top" width="100%">
		<tbody>
		<tr style="vertical-align: top;" valign="top">
		<td height="20" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
		</tr>
		</tbody>
		</table>
		</td>
		</tr>
		</tbody>
		</table>
		<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
		<div style="color:#7b7b7b;font-family:Ubuntu, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
		<div style="line-height: 1.2; font-size: 12px; color: #7b7b7b; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px;">
		<p style="font-size: 12px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 14px; margin: 0;"><span style="font-size: 12px;">&#169; '.date('Y').' ALB Connect. All Rights Reserved.</span></p>
		</div>
		</div>
		<!--[if mso]></td></tr></table><![endif]-->
		<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
		<tbody>
		<tr style="vertical-align: top;" valign="top">
		<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;" valign="top">
		<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="20" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 20px; width: 100%;" valign="top" width="100%">
		<tbody>
		<tr style="vertical-align: top;" valign="top">
		<td height="20" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
		</tr>
		</tbody>
		</table>
		</td>
		</tr>
		</tbody>
		</table>
		<!--[if (!mso)&(!IE)]><!-->
		</div>
		<!--<![endif]-->
		</div>
		</div>
		<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
		<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
		</div>
		</div>
		</div>
		<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
		</td>
		</tr>
		</tbody>
		</table>
		<!--[if (IE)]></div><![endif]-->
		</body>
		</html>
		';
		return $this->Mailer->send();
	}

	public function send($email, $message, $extra = []){
		$this->Mailer->ClearAllRecipients();
		if(isset($extra['subject'])){ $this->Mailer->Subject = $extra['subject']; }
		else { $this->Mailer->Subject = 'ALB Connect'; }
		if(isset($extra['from'])){ $this->Mailer->setFrom($extra['from']); }
		else { $this->Mailer->setFrom($this->Mailer->Username, 'ALB Connect'); }
		if(isset($extra['replyto'])){ $this->Mailer->addReplyTo($extra['replyto']); }
		$this->Mailer->addAddress($email);
		$this->Mailer->isHTML(true);
		if(isset($extra['subject'])){ $this->Mailer->Subject = $extra['subject']; }
		else { $this->Mailer->Subject = 'ALB Connect'; }
		$acceptReplies = false;
		if(isset($extra['acceptReplies']) && ($extra['acceptReplies'] == false || $extra['acceptReplies'] == 'false')){$acceptReplies = true;}
		$this->Mailer->Body = '';
		$this->Mailer->Body .= '
		<meta http-equiv="Content-Type" content="text/html">
		<meta name="viewport" content="width=device-width">
		<style type="text/css">
			a { text-decoration: none; color: #0088CC; }
			a:hover { text-decoration: underline }
			body {
				font-size: 18px;
				width: 100% !important;
				background-color: white;
				margin: 0;
				padding: 0;
				font-family:\'Helvetica Neue\',\'Arial\',\'Helvetica\',\'Verdana\',sans-serif;
				color: #333333;
				line-height: 26px;
			}
			.arrow-right:after {
				content: "";
				background: url("'.$this->URL.'dist/img/arrow-right_1x.png") no-repeat;
				background-position: -2px 2px;
				background-size: 24px;
				display: inline-block;
				width: 24px;
				height: 30px;
				position: absolute;
			}
			.arrow-left:after {
				content: "";
				background: url("'.$this->URL.'dist/img/arrow-left_1x.png") no-repeat;
				background-position: -2px 2px;
				background-size: 24px;
				display: inline-block;
				width: 24px;
				height: 30px;
				position: absolute;
			}
		</style>
		<meta name="format-detection" content="telephone=no">
		<table style="border-collapse: collapse;" width="100%" height="100%" cellspacing="0" cellpadding="0" border="0" align="center">
			<tbody>
				<tr><td class="top-padding" style="line-height:120px;" width="100%">&nbsp;</td></tr>
				<tr>
					<td valign="top">
						<table style="border-collapse: collapse;" width="100%" cellspacing="0" cellpadding="0" border="0">
							<tbody>
								<tr style="width:100%!important;" align="center">
									<td>
										<table style="border-collapse: collapse;" width="692" cellspacing="0" cellpadding="0" border="0" align="center">
											<tbody>
												<tr width="100%" border="0" cellspacing="0" cellpadding="0">
													<td style="padding:0px 0px 0px 0px;" align="center">
														<span class="logo">
															<img src="'.$this->URL.'dist/img/logo-mail.png" alt="" moz-do-not-send="true" width="auto" height="auto" style="max-width: 250px;" border="0">
														</span>
													</td>
												</tr>';
												if(isset($extra['title'])){
													$this->Mailer->Body .= '
														<tr>
															<td style="padding:0px 0px 0px 0px;" valign="top" align="center">
																<table style="border-collapse: collapse;" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
																	<tbody>
																		<tr align="center">
																			<td class="heading" style="font-family:\'Helvetica Neue\',\'Arial\',\'Helvetica\',\'Verdana\',sans-serif; font-size:52px; line-height:56px; font-weight: 200;padding:40px 0px 64px 0px; margin:0; border: 0; display:block; text-align:center;" width="90%" align="center">'.$extra['title'].'</td>
																		</tr>
																	</tbody>
																</table>
															</td>
														</tr>';
													}
		$this->Mailer->Body .= '
											</tbody>
										</table>
										<table style="border-collapse: collapse;" width="692px" cellspacing="0" cellpadding="0" border="0" align="center">
											<tbody>
												<tr>
													<td style="color:#333333; padding:0px 0px 64px 0px; margin:0px;" class="emailcontent" width="692px">
														<table style="border-collapse: collapse;" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
															<tbody>
																<tr>
																	<td>
																		<table style="border-collapse: collapse;" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
																			<tbody>
																				<tr>
																					<td style="padding:7px 0 19px; margin:0; font-family:\'Helvetica Neue\',\'Arial\',\'Helvetica\',\'Verdana\',sans-serif; color: #333333;font-size:18px; line-height: 26px; width:692px; text-align:justify">
																						'.$message.'
																					</td>
																				</tr>
																			</tbody>
																		</table>';
																		if(isset($extra['href'])){
																			$this->Mailer->Body .= '
																				<table style="border-collapse: collapse;" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
																					<tbody>
																						<tr>
																							<td style="padding:7px 0 19px; margin:0; font-family:\'Helvetica Neue\',\'Arial\',\'Helvetica\',\'Verdana\',sans-serif; color: #333333;font-size:18px; line-height: 26px; width:692px">
																								Case ID: 101413965073<br>
																								<a href="'.$extra['href'].'" style="color:#0088cc" class="aapl-link arrow-right" moz-do-not-send="true">Open this case</a>
																							</td>
																						</tr>
																					</tbody>
																				</table>';
																		}
		$this->Mailer->Body .= '
																		<table style="border-collapse: collapse;" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
																			<tbody>
																				<tr>
																					<td style="padding:7px 0 19px; margin:0; font-family:\'Helvetica Neue\',\'Arial\',\'Helvetica\',\'Verdana\',sans-serif; color: #333333;font-size:18px; line-height: 26px; width:692px">
																						Sincerely,<br>
																						ALB Team
																					</td>
																				</tr>
																			</tbody>
																		</table>
																	</td>
																</tr>
															</tbody>
														</table>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>';
							// $this->Mailer->Body .= '
							// 	<tr style="width:100%!important; height:auto;" align="center">
							// 		<td class="emailcontent" style="padding-bottom:64px;">
							// 			<table class="responsive" style="border-collapse: collapse;" width="692px" cellspacing="0" cellpadding="0" border="0" align="center">
							// 				<tbody>
							// 					<tr class="promos">
							// 						<td class="promo-container" bgcolor="#FAFAFA">
							// 							<table class="promo" style="width:336px;" cellspacing="0" cellpadding="0" border="0">
							// 								<tbody>
							// 									<tr>
							// 										<td class="promo-padding" style="padding:40px 20px 40px 20px" valign="top" bgcolor="#FAFAFA" align="center">
							// 											<table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
							// 												<tbody>
							// 													<tr>
							// 														<td class="promo1" style="padding-bottom:15px;" align="center">
							// 															<a href="'.$this->URL.'?p=support" style="display:block;color:#434343;text-decoration:none" moz-do-not-send="true">
							// 																<img src="'.$this->URL.'dist/img/globe-1x.png" alt="" moz-do-not-send="true" height="60" border="0">
							// 															</a>
							// 														</td>
							// 													</tr>
							// 													<tr>
							// 														<td style="color:#333333;font-size:28px; line-height:32px; padding-bottom:18px" align="center">
							// 															<a href="'.$this->URL.'?p=support" style="display:block;color:#434343;font-weight:200;text-decoration:none" moz-do-not-send="true">
							// 																Get help online
							// 															</a>
							// 														</td>
							// 													</tr>
							// 													<tr>
							// 														<td style="color:#333333;font-size:16px; line-height:24px" align="center">
							// 															<a href="'.$this->URL.'?p=support" style="display:block;color:#434343;text-decoration:none" moz-do-not-send="true">
							// 																Visit Apple Support to learn more about your product, download software updates, and much more.
							// 															</a>
							// 														</td>
							// 													</tr>
							// 												</tbody>
							// 											</table>
							// 										</td>
							// 									</tr>
							// 								</tbody>
							// 							</table>
							// 						</td>
							// 						<td class="promo-spacer" style="width:20px" width="20px"><br></td>
							// 						<td class="promo-container" bgcolor="#FAFAFA">
							// 							<table class="promo" style="width:336px;" cellspacing="0" cellpadding="0" border="0">
							// 								<tbody>
							// 									<tr>
							// 										<td class="promo-padding" style="padding:40px 20px 40px 20px" valign="top" bgcolor="#FAFAFA" align="center">
							// 											<table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
							// 												<tbody>
							// 													<tr>
							// 														<td class="promo2" style="padding-bottom:15px;" align="center">
							// 															<a href="'.$this->URL.'?p=chat" style="display:block;color:#434343;text-decoration:none" moz-do-not-send="true">
							// 																<img src="'.$this->URL.'dist/img/chat-1x.png" alt="" moz-do-not-send="true" height="60" border="0">
							// 															</a>
							// 														</td>
							// 													</tr>
							// 													<tr>
							// 														<td style="color:#333333;font-size:28px; line-height:32px; padding-bottom:18px" align="center">
							// 															<a href="'.$this->URL.'?p=chat" style="display:block;color:#434343;font-weight:200;text-decoration:none" moz-do-not-send="true">Join the conversation</a>
							// 														</td>
							// 													</tr>
							// 													<tr>
							// 														<td style="color:#333333;font-size:16px; line-height:24px" align="center">
							// 															<a href="'.$this->URL.'?p=chat" style="display:block;color:#434343;text-decoration:none" moz-do-not-send="true">Find and share solutions with Apple users around the world.</a>
							// 														</td>
							// 													</tr>
							// 												</tbody>
							// 											</table>
							// 										</td>
							// 									</tr>
							// 								</tbody>
							// 							</table>
							// 						</td>
							// 					</tr>
							// 				</tbody>
							// 			</table>
							// 		</td>
							// 	</tr>';
							$this->Mailer->Body .= '
								<tr style="width:100%!important; background-color:#343A40;" align="center">
									<td class="footer" style="padding-top: 64px; padding-bottom: 64px">
										<table style="border-collapse: collapse;" width="692" cellspacing="0" cellpadding="0" border="0" align="center">
											<tbody>
												<tr width="100%" border="0" cellspacing="0" cellpadding="0">
													<td style="font-family:\'Helvetica Neue\',\'Arial\',\'Helvetica\',\'Verdana\',sans-serif;color:#999999; text-align:center; font-size:12px; line-height:16px; padding:4px;" align="center">
														TM and copyright &copy; '.date('Y').'
													</td>
												</tr>
												<tr width="100%" border="0" cellspacing="0" cellpadding="0">
													<td style="font-family:\'Helvetica Neue\',\'Arial\',\'Helvetica\',\'Verdana\',sans-serif;text-align:center; font-size:12px; line-height:16px; color:#999999" align="center">
														<a style="color:#ffffff;margin-right:4px;" href="'.$this->URL.'?p=legal" moz-do-not-send="true">All Rights Reserved</a>|
														<a style="margin-left:4px;margin-right:4px;color:#ffffff;" href="'.$this->URL.'?p=privacy-policy" moz-do-not-send="true">Privacy Policy</a>|
														<a style="margin-left:4px;color:#ffffff;" href="'.$this->URL.'?p=support" moz-do-not-send="true">Support</a>
													</td>
												</tr>';
												if($acceptReplies){
													$this->Mailer->Body .= '
														<tr width="100%" border="0" cellspacing="0" cellpadding="0">
															<td style="font-family:\'Helvetica Neue\',\'Arial\',\'Helvetica\',\'Verdana\',sans-serif;color:#999999; text-align:center; font-size:12px; line-height:16px; padding:4px;padding-top:32px; " align="center">
																This message was sent to you from an email address that does not accept incoming messages.<br>
																Any replies to this message will not be read. If you have questions, please visit <a href="'.$this->URL.'?p=contact" style="color: #ffffff" moz-do-not-send="true">'.$this->URL.'?p=contact</a>.
															</td>
														</tr>';
													}
		$this->Mailer->Body .= '
											</tbody>
										</table>
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</tbody>
		</table>
		';
		return $this->Mailer->send();
	}
}
