<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
	<!-- Tell the browser to be responsive to screen width -->
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php
	if(isset($_GET['p'])){ $p = $_GET['p']; } else { $p = $this->Parameters[0]; }
	if(isset($_GET['v'])){ $v = $_GET['v']; } else { $v = 'index'; }
	if(isset($_GET['id'])){ $id = $_GET['id']; } else { $id = ''; }
	$title = ucwords(str_replace('_',' ',$p));
	if($this->View != 'index'){ $title .= ' - '.ucwords($this->View); }
	if($this->ID != null){ $title .= ' - '.ucwords($this->ID); }
	?>
  <title><?= $title ?></title>
	<link rel="shortcut icon" href="./dist/img/favicon.ico" />
  <!-- Font Awesome -->
  <link rel="stylesheet" href="./vendor/fontawesome-free/css/all.min.css">
  <!-- Ionicons -->
  <link rel="stylesheet" href="./vendor/ionicons/ionicons.min.css">
  <!-- fullCalendar -->
  <link rel="stylesheet" href="./vendor/fullcalendar/main.min.css">
  <link rel="stylesheet" href="./vendor/fullcalendar-daygrid/main.min.css">
  <link rel="stylesheet" href="./vendor/fullcalendar-timegrid/main.min.css">
  <link rel="stylesheet" href="./vendor/fullcalendar-bootstrap/main.min.css">
  <!-- SweetAlert2 -->
  <link rel="stylesheet" href="./vendor/sweetalert2-theme-bootstrap-4/bootstrap-4.min.css">
  <!-- Toastr -->
  <link rel="stylesheet" href="./vendor/toastr/toastr.min.css">
  <!-- daterange picker -->
  <link rel="stylesheet" href="./vendor/daterangepicker/daterangepicker.css">
  <!-- iCheck for checkboxes and radio inputs -->
  <link rel="stylesheet" href="./vendor/icheck-bootstrap/icheck-bootstrap.min.css">
  <!-- Bootstrap Color Picker -->
  <link rel="stylesheet" href="./vendor/bootstrap-colorpicker/css/bootstrap-colorpicker.min.css">
  <!-- Tempusdominus Bbootstrap 4 -->
  <link rel="stylesheet" href="./vendor/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css">
  <!-- Select2 -->
  <link rel="stylesheet" href="./vendor/select2/css/select2.min.css">
  <link rel="stylesheet" href="./vendor/select2-bootstrap4-theme/select2-bootstrap4.min.css">
  <!-- Bootstrap4 Duallistbox -->
  <link rel="stylesheet" href="./vendor/bootstrap4-duallistbox/bootstrap-duallistbox.min.css">
  <!-- DataTables -->
  <link rel="stylesheet" href="./vendor/datatables-bs4/css/dataTables.bootstrap4.css">
  <link href="./vendor/datatables-buttons/buttons.dataTables.min.css" rel="stylesheet">
  <link href="./vendor/datatables-select/select.dataTables.min.css" rel="stylesheet">
  <link href="./vendor/datatables-responsive/responsive.bootstrap4.min.css" rel="stylesheet">
  <!-- Theme style -->
  <link rel="stylesheet" href="/dist/css/adminlte.min.css">
  <!-- summernote -->
  <link rel="stylesheet" href="./vendor/summernote/summernote-bs4.min.css">
  <!-- CodeMirror -->
  <link rel="stylesheet" href="./vendor/codemirror/codemirror.css">
  <link rel="stylesheet" href="./vendor/codemirror/theme/monokai.css">
  <!-- simplemde -->
  <link rel="stylesheet" href="./vendor/simplemde/dist/simplemde.min.css">
  <!-- simplemde -->
  <link rel="stylesheet" href="./vendor/jquery-ui/jquery-ui.min.css">
  <!-- Google Font: Source Sans Pro -->
  <link rel="stylesheet" href="./vendor/google-fonts/SourceSansPro.css">
  <!-- pace-progress -->
  <link rel="stylesheet" href="./vendor/pace-progress/themes/black/pace-theme-flat-top.css">
  <!-- extended CSS -->
  <link rel="stylesheet" title="default" href="/dist/css/default.css">
  <!-- overlayScrollbars -->
  <link rel="stylesheet" href="./vendor/overlayScrollbars/css/OverlayScrollbars.min.css">
	<!-- plugins CSS -->
	<?php $plugins = preg_grep('/^([^.])/', scandir(dirname(__FILE__,3).'/plugins/'));
	foreach($plugins as $plugin){
		if($plugin != 'empty' && file_exists(dirname(__FILE__,3).'/plugins/'.$plugin.'/dist/css/styles.css')){
			if((isset($this->Settings['plugins'][$plugin]['status']))&&($this->Settings['plugins'][$plugin]['status'])){ echo '<link rel="stylesheet" href="/plugins/'.$plugin.'/dist/css/styles.css">'; }
		}
	} ?>
  <!-- jQuery -->
  <script src="./vendor/jquery/jquery.min.js"></script>
  <!-- Popper JS -->
  <!-- <script src="./vendor/popper/popper.min.js"></script> -->
  <!-- TimeAgo JS -->
  <script src="./vendor/timeago/jquery.timeago.js"></script>
  <!-- Bootstrap 4 -->
  <script src="./vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <!-- jQuery UI -->
  <script src="./vendor/jquery-ui/jquery-ui.min.js"></script>
  <!-- bs-custom-file-input -->
  <script src="./vendor/bs-custom-file-input/bs-custom-file-input.min.js"></script>
  <!-- SweetAlert2 -->
  <script src="./vendor/sweetalert2/sweetalert2.min.js"></script>
  <!-- Toastr -->
  <script src="./vendor/toastr/toastr.min.js"></script>
  <!-- DataTables -->
  <script src="./vendor/datatables/jquery.dataTables.js"></script>
  <script src="./vendor/datatables-bs4/js/dataTables.bootstrap4.js"></script>
  <script src="./vendor/datatables-jquery/jquery.dataTables.min.js"></script>
  <script src="./vendor/datatables-bs4/dataTables.bootstrap4.min.js"></script>
  <script src="./vendor/datatables-responsive/dataTables.responsive.min.js"></script>
  <script src="./vendor/datatables-responsive/responsive.bootstrap4.min.js"></script>
  <script src="./vendor/datatables-buttons/dataTables.buttons.min.js"></script>
  <script src="./vendor/datatables-buttons/buttons.flash.min.js"></script>
  <script src="./vendor/datatables-jszip/jszip.min.js"></script>
  <script src="./vendor/datatables-pdfmake/pdfmake.min.js"></script>
  <script src="./vendor/datatables-pdfmake/vfs_fonts.js"></script>
  <script src="./vendor/datatables-buttons/buttons.html5.min.js"></script>
  <script src="./vendor/datatables-buttons/buttons.print.min.js"></script>
  <script src="./vendor/datatables-select/dataTables.select.min.js"></script>
  <!-- Select2 -->
  <script src="./vendor/select2/js/select2.full.min.js"></script>
  <!-- Bootstrap4 Duallistbox -->
  <script src="./vendor/bootstrap4-duallistbox/jquery.bootstrap-duallistbox.min.js"></script>
  <!-- InputMask -->
  <script src="./vendor/moment/moment.min.js"></script>
  <script src="./vendor/inputmask/min/jquery.inputmask.bundle.min.js"></script>
  <!-- date-range-picker -->
  <script src="./vendor/daterangepicker/daterangepicker.js"></script>
  <!-- bootstrap color picker -->
  <script src="./vendor/bootstrap-colorpicker/js/bootstrap-colorpicker.min.js"></script>
  <!-- Tempusdominus Bootstrap 4 -->
  <script src="./vendor/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js"></script>
  <!-- Bootstrap Switch -->
  <script src="./vendor/bootstrap-switch/js/bootstrap-switch.min.js"></script>
  <!-- jquery-validation -->
  <script src="./vendor/jquery-validation/jquery.validate.min.js"></script>
  <script src="./vendor/jquery-validation/additional-methods.min.js"></script>
  <!-- Summernote -->
  <script src="./vendor/summernote/summernote-bs4.min.js"></script>
  <!-- CodeMirror -->
  <script src="./vendor/codemirror/codemirror.js"></script>
  <script src="./vendor/codemirror/mode/css/css.js"></script>
  <script src="./vendor/codemirror/mode/xml/xml.js"></script>
  <script src="./vendor/codemirror/mode/htmlmixed/htmlmixed.js"></script>
  <!-- fullCalendar 2.2.5 -->
  <script src="./vendor/moment/moment.min.js"></script>
  <script src="./vendor/fullcalendar/main.min.js"></script>
  <script src="./vendor/fullcalendar-daygrid/main.min.js"></script>
  <script src="./vendor/fullcalendar-timegrid/main.min.js"></script>
  <script src="./vendor/fullcalendar-interaction/main.min.js"></script>
  <script src="./vendor/fullcalendar-bootstrap/main.min.js"></script>
  <!-- simplemde -->
  <script src="./vendor/simplemde/dist/simplemde.min.js"></script>
	<!-- FontAwesome -->
	<script src="./vendor/fontawesome-free/4f8426d3cf.js" crossorigin="anonymous"></script>
	<!-- HE -->
	<script src="./vendor/he-master/he.js" crossorigin="anonymous"></script>
	<!-- Pace-Settings -->
	<script>
		window.paceOptions = {
			// Only show the progress on regular and ajax-y page navigation,
			// not every request
			restartOnRequestAfter: 5,
			startOnPageLoad:false,

			ajax: {
				trackMethods: ['GET', 'POST', 'PUT', 'DELETE', 'REMOVE'],
				trackWebSockets: true,
				ignoreURLs: [/.*api.php.*/]
			}
		};
	</script>
  <!-- Pace-Progress -->
	<script src="./vendor/pace-progress/pace.min.js"></script>
<!-- overlayScrollbars -->
<script src="./vendor/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>
  <!-- AdminLTE App -->
  <script src="./dist/js/adminlte.min.js"></script>
  <!-- extended CSS -->
  <script src="./dist/js/framework.js"></script>
	<script>window.fetch = undefined;</script>
  <script src="./vendor/whatwg-fetch/fetch.umd.js"></script>
</head>
<?php
  $logopng = "logo.png";
	$pace = "dark";
	$nav = "warning";
	$navmode = "light";
	$logobg = "dark";
	$sidenav = "primary";
	$sidenavmode = "light";
	$darkmode = false;
	if(isset($this->Settings['customization']['pace']['value'])){ $pace = $this->Settings['customization']['pace']['value']; }
	if(isset($this->Settings['customization']['nav']['value'])){ $nav = $this->Settings['customization']['nav']['value']; }
	if(isset($this->Settings['customization']['navmode']['value'])){ $navmode = $this->Settings['customization']['navmode']['value']; }
	if(isset($this->Settings['customization']['logobg']['value'])){ $logobg = $this->Settings['customization']['logobg']['value']; }
	if(isset($this->Settings['customization']['sidenav']['value'])){ $sidenav = $this->Settings['customization']['sidenav']['value']; }
	if(isset($this->Settings['customization']['sidenavmode']['value'])){ $sidenavmode = $this->Settings['customization']['sidenavmode']['value']; }
	if(isset($this->Settings['customization']['darkmode']['value'])){ $darkmode = $this->Settings['customization']['darkmode']['value']; }
	if(isset($this->Auth->Options['application']['pace']['value'])){ $pace = $this->Auth->Options['application']['pace']['value']; }
	if(isset($this->Auth->Options['application']['nav']['value'])){ $nav = $this->Auth->Options['application']['nav']['value']; }
	if(isset($this->Auth->Options['application']['navmode']['value'])){ $navmode = $this->Auth->Options['application']['navmode']['value']; }
	if(isset($this->Auth->Options['application']['logobg']['value'])){ $logobg = $this->Auth->Options['application']['logobg']['value']; }
	if(isset($this->Auth->Options['application']['sidenav']['value'])){ $sidenav = $this->Auth->Options['application']['sidenav']['value']; }
	if(isset($this->Auth->Options['application']['sidenavmode']['value'])){ $sidenavmode = $this->Auth->Options['application']['sidenavmode']['value']; }
	if(isset($this->Auth->Options['application']['darkmode']['value'])){ $darkmode = $this->Auth->Options['application']['darkmode']['value']; }
	if(is_file(dirname(__FILE__,3).'/dist/img/custom-logo.png')){ $logopng = "custom-logo.png"; }
?>
<body class="hold-transition sidebar-mini layout-navbar-fixed layout-fixed pace-<?=$pace?> <?php if($darkmode){ echo "dark-mode"; } ?>">
	<?php
  if($this->Validate()){
		if((isset($this->Settings['license']))&&((isset($this->LSP->Status))&&($this->LSP->Status))){
			if(!$this->Auth->isBlacklisted($this->Auth->getClientIP())){
				if((!isset($this->Settings['maintenance']))||(!$this->Settings['maintenance'])){
					if($this->Auth->isLogin()){
						// Compile Auth Errors
						$this->Error = array_merge($this->Error,$this->Auth->Error);
						//json_encode($this->Error, JSON_PRETTY_PRINT);
						require_once dirname(__FILE__,2) . '/templates/layout/default.php';
            foreach($this->Settings['plugins'] as $plugin => $conf){
          		if(file_exists(dirname(__FILE__,3).'/plugins/'.$plugin.'/dist/js/script.js')){
          			if((isset($conf['status']))&&($conf['status'])){ echo '<script src="./plugins/'.$plugin.'/dist/js/script.js"></script>'; }
          		}
          	}
					} else {
						require_once dirname(__FILE__,2) . '/templates/layout/signin.php';
					}
				} else {
					require_once dirname(__FILE__,2) . '/templates/layout/maintenance.php';
				}
			} else {
				require_once dirname(__FILE__,2) . '/templates/layout/blacklist.php';
			}
		} else {
			require_once dirname(__FILE__,2) . '/templates/layout/activation.php';
		}
	} else {
		require_once dirname(__FILE__,2) . '/templates/layout/install.php';
	} ?>
</body>
</html>
