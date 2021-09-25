<!-- Site wrapper -->
<div class="wrapper">
  <!-- Navbar -->
  <nav class="main-header navbar navbar-expand navbar-<?=$navmode?> p-0 navbar-<?=$nav?> elevation-2">
    <!-- Left navbar links -->
    <ul id="navbar-left" class="navbar-nav pt-2 pb-2">
      <li class="nav-item">
        <a href="#" class="nav-link" data-widget="pushmenu"><i class="fas fa-bars"></i></a>
      </li>
    </ul>
		<div class="collapse navbar-collapse" id="DeskNav1">
			<ul class="navbar-nav d-inline-flex flex-row pt-2 pb-2"></ul>
		</div>
    <!-- Right navbar links -->
    <ul id="navbar-right" class="navbar-nav d-inline-flex flex-row pt-2 pb-2 ml-auto" style="align-items: flex-start;">
			<li class="nav-item" style="display:none;">
				<a class="nav-link" data-widget="control-sidebar" data-slide="true" href="#">
					<i class="fas fa-ellipsis-v"></i>
				</a>
			</li>
			<li class="nav-item navbar-toggler border-0" style="border-radius:0px; cursor:pointer; font-size: 1em;" data-toggle="collapse" data-target="#DeskNav1,#DeskNav2">
				<i class="fas fa-bars pt-2"></i>
			</li>
    </ul>
  </nav>
  <!-- /.navbar -->
  <!-- Main Sidebar Container -->
  <aside class="main-sidebar elevation-4 sidebar-<?=$sidenavmode?>-<?=$sidenav?>" id="DIVlogo">
    <!-- Brand Logo -->
    <a href="<?= $this->URL ?>" class="brand-link elevation-4 navbar-<?=$logobg?> bg-<?=$logobg?>">
      <img src="/dist/img/logo-white.png"
           alt="<?= $this->Settings['title'] ?> Logo"
           class="brand-image"
           style="opacity: .8;margin-left:5px;">
      <span class="brand-text font-weight-light text-light"><?= $this->Settings['title'] ?></span>
    </a>
    <!-- Sidebar -->
		<!-- Sidebar Widgets -->
		<div class="sidebarWidget"></div>
    <div class="sidebar">
      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar nav-flat nav-child-indent flex-column" data-widget="treeview" role="menu" data-accordion="false"></ul>
      </nav>
      <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
  </aside>
  <!-- Content Wrapper. Contains page content -->
	<div class="content-wrapper">
		<section class="content-header">
			<div class="container-fluid">
				<div class="row mb-2" id="page-title">
					<div class="col-sm-6">
						<h1><?= ucfirst(str_replace("_"," ",str_replace("."," ",$p))) ?></h1>
					</div>
					<?php
						$href = "?p=$p";
						if(($v != '')&&($v != 'index')){ $href .= "&v=$v"; }
						if($id != ''){ $crumbTitle = $id; $href .= "&id=$id"; } else { $crumbTitle = ucfirst($p); }
					?>
					<div class="col-sm-6"><ol id="crumbs" class="breadcrumb float-sm-right"><li class="breadcrumb-item"><a href="<?= $href ?>"><i class="icon icon-<?= $p ?> mr-1"></i><?= ucfirst(str_replace("_"," ",str_replace("."," ",$crumbTitle))) ?></a></li></ol></div>
				</div>
			</div>
		</section>
		<section class="content p-3" id="ContentFrame">
			<?php
				$file = "/plugins/$p/src/views/$v.php";
				if(file_exists(dirname(__FILE__,4).$file)){
					if(($this->Auth->valid('plugin',$p,1))&&($this->Auth->valid('view',$v,1,$p))){
						require dirname(__FILE__,4).$file;
					} else {
						require dirname(__FILE__,4).'/src/views/403.php';
					}
				} else {
					require dirname(__FILE__,4).'/src/views/404.php';
				}
			?>
		</section>
	</div>
  <!-- /.content-wrapper -->
  <!-- Control Sidebar -->
  <aside class="control-sidebar control-sidebar-dark">
		<ul class="nav nav-tabs" role="tablist"></ul>
		<div class="tab-content"></div>
  </aside>
  <!-- /.control-sidebar -->
  <footer class="main-footer">
    <div class="float-right d-none d-sm-block">
      <b><?= $this->Language->Field['Version'] ?></b> <?= $this->Settings['version'] ?>
    </div>
    <strong><?= $this->Language->Field['Copyright']." &copy; 2019-".date("Y")." " ?><a href="http://albcie.com">ALB Compagnie International</a></strong> <?= $this->Language->Field['All_rights_reserved'] ?>. <a href="<?= $this->URL ?>">End-user license agreement</a>
  </footer>
</div>
<script>
	$(function(){ API.Plugins.init(); });
</script>
