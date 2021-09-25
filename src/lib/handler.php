<?php

// Reestablish the session
if(session_status() == PHP_SESSION_NONE){ session_start(); }

// Import Librairies
require_once dirname(__FILE__,3) . '/src/lib/builder.php';
require_once dirname(__FILE__,3) . '/src/lib/controller.php';

// Retrieve Location
if((!empty($_POST))&&(isset($_POST))){
	$Plugin = $_POST['controller'];
	$View = $_POST['view'];
	$ID = $_POST['id'];
} else {
	$Plugin = $this->Plugin;
	$View = $this->View;
	$ID = $this->ID;
}

// Create Handler
if(isset($this)){
	$Handler = $this;
} else {
	$Handler = (object) null;
	$Handler->Builder = new Builder;
	$Handler->Builder->loadFiles('src/helpers/helper.php');
	$object = $Plugin.'Helper';
	$Handler->Helper = (object) null;
	$Handler->Helper->$Plugin = new $object();
	$object = $Plugin.'Controller';
	require_once dirname(__FILE__,3).'/plugins/'.$Plugin.'/src/controllers/controller.php';
	if(class_exists($object)){
		$Handler->Controller = new $object($Plugin,$View,$ID);
		if(method_exists($Handler->Controller,$View)){
			$Handler->Data = $Handler->Controller->$View($ID);
		}
	}
}
?>
<!-- Content Header (Page header) -->
<section class="content-header">
	<div class="container-fluid">
		<div class="row mb-2">
			<div class="col-sm-6">
				<h1>
					<?php $name = $Plugin ?>
					<?php $view = $View ?>
					<?= ucwords($Handler->Builder->Language->Field[$name]) ?>
					<small class="text-gray" style="padding-left:4px;"><?= ucwords($Handler->Builder->Language->Field[$view]) ?></small>
				</h1>
			</div>
			<div class="col-sm-6" id='breadcrumbs'>
				<ol class="breadcrumb float-sm-right">
					<?php
					$l1 = "";
					$l2 = "";
					$l3 = "";
					$l4 = "";
					if($Plugin != $Handler->Builder->Settings['page']){
						$l1 = $Handler->Builder->Settings['page'];
						$l2 = $Plugin;
						$l3 = $View;
						if($ID != null){ $l4 = $ID; }
					} else { $l1 = $Handler->Builder->Settings['page']; }
					if($l1 != ""){ ?>
						<li class="breadcrumb-item">
							<?php if($l2 != ""){ ?><a href="<?= $Handler->Builder->Protocol.$Handler->Builder->Domain ?>"><?php } ?>
								<?= ucwords($Handler->Builder->Language->Field[$l1]) ?>
							<?php if($l2 != ""){ ?></a><?php } ?>
						</li>
					<?php } ?>
					<?php if($l2 != ""){ ?>
						<li class="breadcrumb-item">
							<?php if($l2 != ""){ ?><a href="/<?= $l2 ?>"><?php } ?>
								<?= ucwords($Handler->Builder->Language->Field[$l2]) ?>
							<?php if($l2 != ""){ ?></a><?php } ?>
						</li>
					<?php } ?>
					<?php if($l3 != ""){ ?>
						<li class="breadcrumb-item">
							<?php if($l4 != ""){ ?><a href="/<?= $l2 ?>/<?= $l3 ?>/<?= $l4 ?>"><?php } ?>
								<?= ucwords($Handler->Builder->Language->Field[$l3]) ?>
							<?php if($l4 != ""){ ?></a><?php } ?>
						</li>
					<?php } ?>
					<?php if($l4 != ""){ ?>
						<li class="breadcrumb-item">
							<?= ucwords($l4)?>
						</li>
					<?php } ?>
				</ol>
			</div>
		</div>
	</div><!-- /.container-fluid -->
</section>
<!-- Main content -->
<section class="content" id="ctnContainer">
	<?php
	$viewfile = dirname(__FILE__,3) . "/plugins/".$Plugin."/src/views/".$View.".php";
	if(is_file($viewfile)){
		if($Handler->Builder->Auth->valid('plugin',$Plugin,1)){
			require_once($viewfile);
		} else {
			require_once(dirname(__FILE__,3) . '/src/views/403.php');
		}
	} else {
		require_once(dirname(__FILE__,3) . '/src/views/404.php');
	}
	?>
	<?php //$Handler->Builder->loadFiles('src/templates/modals/modal.php'); ?>
</section>
<!-- /.content -->
