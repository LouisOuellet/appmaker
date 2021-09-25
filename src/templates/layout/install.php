<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title><?= $this->Settings['title']?> | <?= $this->Language->Field['Installation'] ?></title>
	<link rel="shortcut icon" href="/dist/img/favicon.ico" />
  <!-- Tell the browser to be responsive to screen width -->
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Font Awesome -->
  <link rel="stylesheet" href="/vendor/fontawesome-free/css/all.min.css">
  <!-- Ionicons -->
  <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
  <!-- daterange picker -->
  <link rel="stylesheet" href="/vendor/daterangepicker/daterangepicker.css">
  <!-- iCheck for checkboxes and radio inputs -->
  <link rel="stylesheet" href="/vendor/icheck-bootstrap/icheck-bootstrap.min.css">
  <!-- Bootstrap Color Picker -->
  <link rel="stylesheet" href="/vendor/bootstrap-colorpicker/css/bootstrap-colorpicker.min.css">
  <!-- Tempusdominus Bbootstrap 4 -->
  <link rel="stylesheet" href="/vendor/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css">
  <!-- Select2 -->
  <link rel="stylesheet" href="/vendor/select2/css/select2.min.css">
  <link rel="stylesheet" href="/vendor/select2-bootstrap4-theme/select2-bootstrap4.min.css">
  <!-- Bootstrap4 Duallistbox -->
  <link rel="stylesheet" href="/vendor/bootstrap4-duallistbox/bootstrap-duallistbox.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="/dist/css/adminlte.min.css">
  <!-- Google Font: Source Sans Pro -->
  <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet">
  <style>
      .login-box{
          width: 800px;
      }
      .invalid-feedback{
          margin-left: 25%;
      }
  </style>
</head>
<body class="hold-transition login-page">
  <div class="login-page">
    <div class="login-box">
      <form id="SetupWizard" name="SetupWizard" method="post">
        <div id="accordion">
          <div class="collapse show" data-parent="#accordion" id="welcome">
            <div class="card card-primary card-outline">
              <div class="card-header">
                <h5 class="m-0"><?= $this->Language->Field['Welcome_into'] ?> <?= $this->Settings['title']?></h5>
              </div>
              <div class="card-body">
                <p class="card-text"><?= $this->Language->Field['since_first_run'] ?></p>
              </div>
              <div class="card-footer">
                <button type="button" data-target="#sql" data-toggle="collapse" aria-expanded="false" class="btn btn-primary float-right"><?= $this->Language->Field['Get_Started'] ?><i class="nav-icon fas fa-chevron-right ml-2"></i></button>
              </div>
            </div>
          </div>
          <div class="collapse" data-parent="#accordion" id="sql">
            <div class="card card-primary card-outline">
              <div class="card-header">
                <h5 class="m-0"><?= $this->Language->Field['SQL_Database'] ?></h5>
              </div>
              <div class="card-body">
                <p class="card-text">
                  <div class="form-group row">
                    <label for="sql_host" class="col-sm-2 col-form-label"><?= $this->Language->Field['Host'] ?></label>
                    <div class="col-sm-10 input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          <i class="fas fa-server"></i>
                        </span>
                      </div>
                      <input type="text" class="form-control" placeholder="<?= $this->Language->Field['Host'] ?>" id="sql_host" name="sql_host" value="<?php if(isset($_POST['sql_host'])){ echo $_POST['sql_host']; } ?>">
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="sql_database" class="col-sm-2 col-form-label"><?= $this->Language->Field['Database'] ?></label>
                    <div class="col-sm-10 input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          <i class="fas fa-database"></i>
                        </span>
                      </div>
                      <input type="text" class="form-control" placeholder="<?= $this->Language->Field['Database'] ?>" id="sql_database" name="sql_database" value="<?php if(isset($_POST['sql_database'])){ echo $_POST['sql_database']; } ?>">
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="sql_username" class="col-sm-2 col-form-label"><?= $this->Language->Field['Username'] ?></label>
                    <div class="col-sm-10 input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          <i class="fas fa-user"></i>
                        </span>
                      </div>
                      <input type="text" class="form-control" placeholder="<?= $this->Language->Field['Username'] ?>" id="sql_username" name="sql_username" value="<?php if(isset($_POST['sql_username'])){ echo $_POST['sql_username']; } ?>">
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="sql_password" class="col-sm-2 col-form-label"><?= $this->Language->Field['Password'] ?></label>
                    <div class="col-sm-10 input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          <i class="fas fa-user-lock"></i>
                        </span>
                      </div>
                      <input type="password" class="form-control" placeholder="<?= $this->Language->Field['Password'] ?>" id="sql_password" name="sql_password" value="<?php if(isset($_POST['sql_password'])){ echo $_POST['sql_password']; } ?>">
                    </div>
                  </div>
                </p>
              </div>
              <div class="card-footer">
                <button type="button" data-target="#welcome" data-toggle="collapse" aria-expanded="true" class="btn btn-default"><i class="nav-icon fas fa-chevron-left mr-2"></i><?= $this->Language->Field['Back'] ?></button>
                <button type="button" data-target="#site" data-toggle="collapse" aria-expanded="false"  class="btn btn-primary float-right"><?= $this->Language->Field['Next'] ?><i class="nav-icon fas fa-chevron-right ml-2"></i></button>
              </div>
            </div>
          </div>
          <div class="collapse" data-parent="#accordion" id="site">
            <div class="card card-primary card-outline">
              <div class="card-header">
                <h5 class="m-0"><?= $this->Language->Field['Site_Configuration'] ?></h5>
              </div>
              <div class="card-body">
                <p class="card-text">
                  <div class="form-group row">
                    <label for="site_license" class="col-sm-2 col-form-label"><?= $this->Language->Field['Key'] ?></label>
                    <div class="col-sm-10 input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          <i class="fas fa-key"></i>
                        </span>
                      </div>
                      <input type="text" class="form-control" placeholder="XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX" id="site_license" name="site_license" value="<?php if(isset($_POST['site_license'])){ echo $_POST['site_license']; } ?>">
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="site_page" class="col-sm-2 col-form-label"><?= $this->Language->Field['Landing_Page'] ?></label>
                    <div class="col-sm-10 input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          <i class="fas fa-columns"></i>
                        </span>
                      </div>
                      <select class="form-control select2bs4" name="site_page" id="site_page">
                        <?php $plugins = scandir(dirname(__FILE__,4).'/plugins/');
    										foreach($plugins as $plugin) {
    											if(("$plugin" != "..") and ("$plugin" != ".")){
    												$file = dirname(__FILE__,4).'/plugins/'.$plugin.'/src/views/index.php';
    												if(is_file($file)){ ?>
                              <option value="<?=$plugin?>"<?php if((isset($_POST['site_page']))&&($_POST['site_page']==$plugin)){echo" selected";}?>><?=ucwords(str_replace('_',' ',$plugin))?></option>
                        <?php }}} ?>
                      </select>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="site_background_jobs" class="col-sm-2 col-form-label"><?= $this->Language->Field['Sync_Mode'] ?></label>
                    <div class="col-sm-10 input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          <i class="fas fa-user-lock"></i>
                        </span>
                      </div>
                      <select class="form-control select2bs4" name="site_background_jobs" id="site_background_jobs">
                        <option value="cron"<?php if((isset($_POST['site_background_jobs']))&&($_POST['site_background_jobs']=='cron')){echo" selected";}?>><?= $this->Language->Field['Cron'] ?></option>
                        <option value="ajax"<?php if((isset($_POST['site_background_jobs']))&&($_POST['site_background_jobs']=='ajax')){echo" selected";}?>><?= $this->Language->Field['AJAX'] ?></option>
                        <option value="webcron"<?php if((isset($_POST['site_background_jobs']))&&($_POST['site_background_jobs']=='webcron')){echo" selected";}?>><?= $this->Language->Field['Web_Cron'] ?></option>
                      </select>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="site_timezone" class="col-sm-2 col-form-label"><?= $this->Language->Field['Timezone'] ?></label>
                    <div class="col-sm-10 input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          <i class="far fa-clock"></i>
                        </span>
                      </div>
                      <select class="form-control select2bs4" name="site_timezone" id="site_timezone">
                        <?php foreach($this->Timezones as $timezone) {?>
                          <option value="<?=$timezone?>"<?php if((isset($_POST['site_timezone']))&&($_POST['site_timezone']==$timezone)){echo" selected";}?>><?=$timezone?></option>
                        <?php } ?>
                      </select>
                    </div>
                  </div>
    							<div class="form-group row">
    								<label class="col-sm-2 col-form-label"><?= $this->Language->Field['Sample Data'] ?></label>
    								<div class="icheck-primary col-sm-10">
                      <input type="checkbox" id="site_sample" name="site_sample" value="enabled" style="position: static !important;">
    									<label for="site_sample"><?= $this->Language->Field['Include'] ?></label>
                    </div>
                  </div>
                </p>
              </div>
              <div class="card-footer">
                <button type="button" data-target="#sql" data-toggle="collapse" aria-expanded="false"  class="btn btn-default"><i class="nav-icon fas fa-chevron-left mr-2"></i><?= $this->Language->Field['Back'] ?></button>
                <button type="button" data-target="#license" data-toggle="collapse" aria-expanded="false"  class="btn btn-primary float-right"><?= $this->Language->Field['Next'] ?><i class="nav-icon fas fa-chevron-right ml-2"></i></button>
              </div>
            </div>
          </div>
          <div class="collapse" data-parent="#accordion" id="license">
            <div class="card card-primary card-outline">
              <div class="card-header">
                <h5 class="m-0"><?= $this->Language->Field['License'] ?></h5>
              </div>
              <div class="card-body" style="max-height:500px;overflow:scroll;">
                <p class="card-text">
                  <?php include("LICENSE.html") ?>
                  <div class="form-group mb-0">
                    <div class="icheck-primary">
                      <input type="checkbox" id="license_term_field" name="license_term" style="position: static !important;">
                      <label for="license_term_field"><?= $this->Language->Field['I_have_read_this_License'] ?></label>
                    </div>
                  </div>
                </p>
              </div>
              <div class="card-footer">
                <button type="button" data-target="#site" data-toggle="collapse" aria-expanded="false"  class="btn btn-default"><i class="nav-icon fas fa-chevron-left mr-2"></i><?= $this->Language->Field['Back'] ?></button>
                <button type="button" id="reviewBTN" data-target="#review" data-toggle="collapse" aria-expanded="false"  class="btn btn-primary float-right"><?= $this->Language->Field['Next'] ?><i class="nav-icon fas fa-chevron-right ml-2"></i></button>
              </div>
            </div>
          </div>
          <div class="collapse" data-parent="#accordion" id="review">
            <div class="card card-primary card-outline">
              <div class="card-header">
                <h5 class="m-0"><?= $this->Language->Field['Review_Configuration'] ?></h5>
              </div>
              <div class="card-body">
                <p class="card-text">
    							<div class="col-12">
    								<div class="card card-primary">
    				          <div class="card-header">
    				            <h5 class="m-0"><?= $this->Language->Field['SQL_Database'] ?></h5>
    				          </div>
    				          <div class="card-body">
    										<div class="row border-bottom pt-2">
    											<div class="col-4">Host</div>
    											<div class="col-8" id="DivSQL_host"></div>
    										</div>
    										<div class="row border-bottom pt-2">
    											<div class="col-4">Database</div>
    											<div class="col-8" id="DivSQL_database"></div>
    										</div>
    										<div class="row border-bottom pt-2">
    											<div class="col-4">Username</div>
    											<div class="col-8" id="DivSQL_username"></div>
    										</div>
    										<div class="row border-bottom pt-2">
    											<div class="col-4">Password</div>
    											<div class="col-8" id="DivSQL_password"></div>
    										</div>
    									</div>
    								</div>
    							</div>
    							<div class="col-12">
    								<div class="card card-primary">
    				          <div class="card-header">
    				            <h5 class="m-0"><?= $this->Language->Field['Site_Configuration'] ?></h5>
    				          </div>
    				          <div class="card-body">
    										<div class="row border-bottom pt-2">
    											<div class="col-4">License</div>
    											<div class="col-8" id="DivSite_license"></div>
    										</div>
    										<div class="row border-bottom pt-2">
    											<div class="col-4">Landing Page</div>
    											<div class="col-8" id="DivSite_landing"></div>
    										</div>
    										<div class="row border-bottom pt-2">
    											<div class="col-4">Sync Mode</div>
    											<div class="col-8" id="DivSite_sync"></div>
    										</div>
    										<div class="row border-bottom pt-2">
    											<div class="col-4">Timezone</div>
    											<div class="col-8" id="DivSite_timezone"></div>
    										</div>
    										<div class="row border-bottom pt-2">
    											<div class="col-4">Sample Data</div>
    											<div class="col-8" id="DivSite_sample"></div>
    										</div>
    										<div class="row border-bottom pt-2">
    											<div class="col-4">License Terms</div>
    											<div class="col-8" id="DivSite_terms"></div>
    										</div>
    									</div>
    								</div>
    							</div>
    						</p>
              </div>
              <div class="card-footer">
                <button type="button" data-target="#license" data-toggle="collapse" aria-expanded="false"  class="btn btn-default"><i class="nav-icon fas fa-chevron-left mr-2"></i><?= $this->Language->Field['Back'] ?></button>
                <button type="submit" name="StartInstall" class="btn btn-success float-right"><?= $this->Language->Field['Install'] ?><i class="nav-icon far fa-play-circle ml-2"></i></button>
              </div>
            </div>
          </div>
          <div class="collapse" data-parent="#accordion" id="log">
            <div class="card card-primary card-outline">
              <div class="card-header">
                <h5 class="m-0"><?= $this->Language->Field['Installation_Details'] ?></h5>
              </div>
              <div class="card-body" style="max-height:500px;overflow:scroll;">
                <p class="card-text" id="log_container"></p>
              </div>
              <div class="card-footer">
                <button type="button" data-target="#welcome" data-toggle="collapse" aria-expanded="false"  class="btn btn-default"><i class="nav-icon fas fa-chevron-left mr-2"></i><?= $this->Language->Field['Back'] ?></button>
                <a href="<?=$this->URL?>" class="btn btn-primary float-right">
                  <?= $this->Language->Field['Sign_In'] ?><i class="nav-icon fas fa-sign-in-alt ml-2"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
<!-- /.login-box -->

<!-- jQuery -->
<script src="/vendor/jquery/jquery.min.js"></script>
<!-- Bootstrap 4 -->
<script src="/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<!-- Select2 -->
<script src="/vendor/select2/js/select2.full.min.js"></script>
<!-- Bootstrap4 Duallistbox -->
<script src="/vendor/bootstrap4-duallistbox/jquery.bootstrap-duallistbox.min.js"></script>
<!-- InputMask -->
<script src="/vendor/moment/moment.min.js"></script>
<script src="/vendor/inputmask/min/jquery.inputmask.bundle.min.js"></script>
<!-- date-range-picker -->
<script src="/vendor/daterangepicker/daterangepicker.js"></script>
<!-- bootstrap color picker -->
<script src="/vendor/bootstrap-colorpicker/js/bootstrap-colorpicker.min.js"></script>
<!-- Tempusdominus Bootstrap 4 -->
<script src="/vendor/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js"></script>
<!-- Bootstrap Switch -->
<script src="/vendor/bootstrap-switch/js/bootstrap-switch.min.js"></script>
<!-- jquery-validation -->
<script src="/vendor/jquery-validation/jquery.validate.min.js"></script>
<script src="/vendor/jquery-validation/additional-methods.min.js"></script>
<!-- AdminLTE App -->
<script src="/dist/js/adminlte.min.js"></script>
<script>
	$("#reviewBTN").click(function(){
		$('#DivSQL_host').html($(document.getElementById("sql_host")).val());
		$('#DivSQL_database').html($(document.getElementById("sql_database")).val());
		$('#DivSQL_username').html($(document.getElementById("sql_username")).val());
		$('#DivSQL_password').html($(document.getElementById("sql_password")).val());
		$('#DivSite_license').html($(document.getElementById("site_license")).val());
		$('#DivSite_landing').html($(document.getElementById("site_page")).find('option:selected').text());
		$('#DivSite_sync').html($(document.getElementById("site_background_jobs")).find('option:selected').text());
		$('#DivSite_timezone').html($(document.getElementById("site_timezone")).find('option:selected').text());
		$('#DivSite_sample').html($(document.getElementById("site_sample")).checked);
		$('#DivSite_terms').html($(document.getElementById("license_term_field")).checked);
	});
</script>
<script>
  $(function () {
    //Initialize Select2 Elements
    $('.select2').select2()

    //Initialize Select2 Elements
    $('.select2bs4').select2({
      theme: 'bootstrap4'
    })

    //Date picker
    $('.datepicker').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1950,
        locale: {
            "format": "YYYY-MM-DD",
        },
    })

    //Datetime picker
    $('.datetimepicker').daterangepicker({
        autoApply: true,
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1950,
        timePicker: true,
        timePickerIncrement: 5,
        locale: {
            "format": "YYYY-MM-DD hh:mm",
        },
    })

  })
</script>
<script>
    $('.disableAutoFill').disableAutoFill();
</script>
<script type="text/javascript">
$(document).ready(function () {
  $.validator.addMethod("pwcheck", function(value) {
    return /^[A-Za-z0-9\d=!\-+@._*]*$/.test(value) // consists of only these
      && /[a-z]/.test(value) // has a lowercase letter
      && /[A-Z]/.test(value) // has a uppercase letter
      && /\d/.test(value) // has a digit
	  });
  $('#SetupWizard').validate({
    ignore: [],
    rules: {
      sql_host: {
        required: true,
      },
      sql_database: {
        required: true,
      },
      sql_username: {
        required: true,
      },
      sql_password: {
        required: true,
      },
      license_term: {
        required: true,
      },
      site_license: {
        required: true,
      },
      site_page: {
        required: true,
      },
      site_background_jobs: {
        required: true,
      },
      site_timezone: {
        required: true,
      },
    },
    errorElement: 'span',
    errorPlacement: function (error, element) {
      error.addClass('invalid-feedback');
      element.closest('.form-group').append(error);
    },
    highlight: function (element, errorClass, validClass) {
      $(element).addClass('is-invalid');
    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).removeClass('is-invalid');
    },
    submitHandler: function() {
        $('#log').collapse('show');
        var sql_host = document.getElementById("sql_host").value;
        var sql_database = document.getElementById("sql_database").value;
        var sql_username = document.getElementById("sql_username").value;
        var sql_password = document.getElementById("sql_password").value;
        var site_license = document.getElementById("site_license").value;
        var site_sample = document.getElementById("site_sample").checked;
        var site_page = document.getElementById("site_page").value;
        var site_background_jobs = document.getElementById("site_background_jobs").value;
        var site_timezone = document.getElementById("site_timezone").value;
        var serverid = "<?php echo $_SERVER['SERVER_SOFTWARE'].$_SERVER['DOCUMENT_ROOT'].$_SERVER['SCRIPT_FILENAME'].$_SERVER['GATEWAY_INTERFACE'].$_SERVER['PATH']; ?>"
        // Returns successful data submission message when the entered information is stored in database.
        var dataString = {
            sql_host: sql_host,
            sql_database: sql_database,
            sql_username: sql_username,
            sql_password: sql_password,
            site_license: site_license,
            site_sample: site_sample,
            site_page: site_page,
            site_background_jobs: site_background_jobs,
            site_timezone: site_timezone,
            serverid: serverid,
        }
        // AJAX code to submit form.
        $.ajax({
            type: "POST",
            url: "/src/lib/install.php",
            data: dataString,
            cache: false,
            success: function(response) {
                $('#log_container').html("<?= $this->Language->Field['Output'] ?> :<br />" + response);
            },
        });
    },
  });
});
</script>
</body>
</html>
