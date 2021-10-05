<div id="wrapper" class="login-page <?php if($darkmode){ echo "dark-mode"; } ?>">
	<div class="login-box" style="width:450px;">
	  <div class="login-logo" style="color:#495057;">
	    <img src="/dist/img/logo.png" style="width:100px;">
	    <b class="p-2" style="vertical-align: -10px;"><?= $this->Settings['title']?></b>
	  </div>
	  <!-- /.login-logo -->
	  <div class="card">
	    <div class="card-body login-card-body">
				<?php if(!isset($_GET['forgot'])){ ?>
		      <p class="login-box-msg"><?= $this->Language->Field['Sign_in_to_start_your_session'] ?></p>

		      <form method="post">
		        <div class="input-group mb-3">
		          <input type="text" class="form-control" name="username" placeholder="<?= $this->Language->Field['Username or Email'] ?>">
		          <div class="input-group-append">
		            <div class="input-group-text">
		              <span class="fas fa-user"></span>
		            </div>
		          </div>
		        </div>
		        <div class="input-group mb-3">
		          <input type="password" class="form-control" name="password" placeholder="<?= $this->Language->Field['Password'] ?>">
		          <div class="input-group-append">
		            <div class="input-group-text">
		              <span class="fas fa-lock"></span>
		            </div>
		          </div>
		        </div>
		        <div class="row">
		          <div class="col-8">
		            <div class="icheck-primary">
		              <input type="checkbox" id="remember" name="remember">
		              <label for="remember">
		                <?= $this->Language->Field['Remember_Me'] ?>
		              </label>
		            </div>
		          </div>
		          <!-- /.col -->
		          <div class="col-4">
		            <button type="submit" name="<?= $this->Settings['id']?>" class="btn btn-primary btn-block">
		                <i class="fas fa-sign-in-alt mr-1"></i>
		                <?= $this->Language->Field['Sign_In'] ?>
		            </button>
		          </div>
		          <!-- /.col -->
		        </div>
		      </form>

		      <?php if($this->Settings['forgot']){?>
		      <p class="mb-1">
		        <a href="<?=$this->Domain?>?forgot"><?= $this->Language->Field['I_forgot_my_password'] ?></a>
		      </p>
		      <?php } ?>
		      <?php if($this->Settings['registration']){?>
		          <p class="mb-0">
		            <a href="<?=$this->Settings['registration']?>" class="text-center"><?= $this->Language->Field['Register_a_new_membership'] ?></a>
		          </p>
		      <?php } ?>
				<?php } else { ?>
					<?php if(empty($_GET['forgot'])){ ?>
						<?php if(!isset($_POST['username'])){ ?>
							<p class="login-box-msg">Forgot your password?</p>
				      <form method="post">
				        <div class="input-group mb-3">
				          <input type="text" class="form-control" name="username" placeholder="<?= $this->Language->Field['Username'] ?>">
				          <div class="input-group-append">
				            <div class="input-group-text">
				              <span class="fas fa-user"></span>
				            </div>
				          </div>
				        </div>
				        <div class="row">
				          <div class="col-12">
				            <button type="submit" name="<?= $this->Settings['id']?>" class="btn btn-primary btn-block">
				                <i class="fas fa-undo-alt mr-1"></i>
				                Reset
				            </button>
				          </div>
				          <!-- /.col -->
				        </div>
				      </form>
						<?php } else { ?>
							<p class="login-box-msg p-0">An email was sent to your inbox.</p>
						<?php } ?>
					<?php } else { ?>
						<?php if($this->Auth->PWDReset){ ?>
							<p class="login-box-msg">Your password was successfully updated</p>
			        <div class="row">
			          <div class="col-12">
			            <a href="<?=$this->Domain?>" class="btn btn-primary btn-block">
										<i class="fas fa-sign-in-alt mr-1"></i>
										<?= $this->Language->Field['Sign_In'] ?>
			            </a>
			          </div>
			          <!-- /.col -->
			        </div>
						<?php } else { ?>
							<p class="login-box-msg">Enter your new password</p>
				      <form method="post">
				        <div class="input-group mb-3">
				          <input type="password" class="form-control" name="password" placeholder="<?= $this->Language->Field['Password'] ?>">
				          <div class="input-group-append">
				            <div class="input-group-text">
				              <span class="fas fa-lock"></span>
				            </div>
				          </div>
				        </div>
								<div class="input-group mb-3">
				          <input type="password" class="form-control" name="password2" placeholder="<?= $this->Language->Field['Confirm_Password'] ?>">
				          <div class="input-group-append">
				            <div class="input-group-text">
				              <span class="fas fa-lock"></span>
				            </div>
				          </div>
				        </div>
								<input type="hidden" style="display:none;" name="token" value="<?=$_GET['forgot']?>">
				        <div class="row">
				          <div class="col-12">
				            <button type="submit" name="<?= $this->Settings['id']?>" class="btn btn-primary btn-block">
				                <i class="fas fa-exchange-alt mr-1"></i>
				                Change
				            </button>
				          </div>
				          <!-- /.col -->
				        </div>
				      </form>
						<?php } ?>
					<?php } ?>
				<?php } ?>
	    </div>
	    <!-- /.login-card-body -->
	  </div>
	</div>
	<!-- /.login-box -->
</div>
