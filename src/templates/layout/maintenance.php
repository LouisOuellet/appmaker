<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title><?= $this->Settings['title']?> | <?= $this->Language->Field['Maintenance'] ?></title>
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
          width: 500px;
      }
      .invalid-feedback{
          margin-left: 25%;
      }
  </style>
</head>
<body class="hold-transition ">
  <div class="login-page">
    <div class="login-box">
      <div class="collapse show">
        <div class="card card-danger card-outline">
          <div class="card-header"></div>
          <div class="card-body">
            <h1 style="text-align:center;"><i class="fas fa-3x fa-exclamation-triangle"></i></h1>
            <h1 style="text-align:center;"><?= $this->Language->Field['Maintenance_Mode'] ?></h1>
            <p style="text-align:center;"><?= $this->Language->Field['This'] ?> <?= $this->Settings['title']?> <?= $this->Language->Field['instance_is_in_maintenance_mode'] ?></p>
            <p style="text-align:center;"><?= $this->Language->Field['Contact_your_system_administrator'] ?></p>
          </div>
          <div class="card-footer bg-danger"></div>
        </div>
      </div>
    </div>
  </div>

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
</body>
</html>
