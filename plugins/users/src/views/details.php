<span style="display:none;" data-plugin="users" data-key="id"></span>
<span style="display:none;" data-plugin="users" data-key="first_name"></span>
<span style="display:none;" data-plugin="users" data-key="last_name"></span>
<span style="display:none;" data-plugin="users" data-key="middle_name"></span>
<div class="container-fluid">
  <div class="row">
    <div class="col-md-4">
      <!-- Profile Image -->
      <div class="card card-primary card-outline">
        <div class="card-body box-profile">
          <div class="text-center">
            <img class="profile-user-img img-fluid img-circle" src="/dist/img/default.png">
          </div>
          <h3 class="profile-username text-center" data-plugin="users" data-key="username"></h3>
          <p class="text-muted text-center" data-plugin="users" data-key="username"></p>
          <ul class="list-group list-group-unbordered mb-3">
            <li class="list-group-item">
              <b><i class="fas fa-info mr-1"></i>Type</b> <a class="float-right" data-plugin="users" data-key="type"></a>
            </li>
            <li class="list-group-item">
              <b><i class="fas fa-code-branch mr-1"></i>Location</b> <a class="float-right" data-plugin="users" data-key="location"></a>
            </li>
            <li class="list-group-item">
              <b><i class="far fa-calendar mr-1"></i>Created</b> <a class="float-right" data-plugin="users" data-key="created"></a>
            </li>
            <li class="list-group-item">
              <b><i class="far fa-calendar mr-1"></i>Modified</b> <a class="float-right" data-plugin="users" data-key="modified"></a>
            </li>
            <li class="list-group-item">
              <b><i class="fas fa-user mr-1"></i>Owner</b> <a class="float-right" data-plugin="users" data-key="owner"></a>
            </li>
            <li class="list-group-item">
              <b><i class="fas fa-user mr-1"></i>Updated by</b> <a class="float-right" data-plugin="users" data-key="updated_by"></a>
            </li>
          </ul>
        </div>
        <!-- /.card-body -->
      </div>
      <!-- /.card -->
    </div>
    <!-- /.col -->
    <div class="col-md-8">
      <div class="card" id="userTabs">
        <div class="card-header p-2">
          <ul class="nav nav-pills">
            <li class="nav-item"><a class="nav-link active" href="#userAbout" data-toggle="tab"><i class="fas fa-address-card mr-1"></i>About</a></li>
          </ul>
        </div><!-- /.card-header -->
        <div class="card-body p-0">
          <div class="tab-content">
						<div class="tab-pane m-4 active" id="userAbout">
							<div class="row" style="padding:4px;">
		            <label class="col-md-2 text-right">Name :</label>
		            <div class="col-md-10" data-plugin="users" data-key="name"></div>
		            <label class="col-md-2 text-right">Initials :</label>
		            <div class="col-md-10" data-plugin="users" data-key="initials"></div>
		            <label class="col-md-2 text-right">Job Title :</label>
		            <div class="col-md-10" data-plugin="users" data-key="job_title"></div>
		            <label class="col-md-2 text-right">Supervisor :</label>
		            <div class="col-md-10" data-plugin="users" data-key="supervisor"></div>
		            <label class="col-md-2 text-right">Client :</label>
		            <div class="col-md-10" data-plugin="users" data-key="client"></div>
		            <label class="col-md-2 text-right">Entity :</label>
		            <div class="col-md-10" data-plugin="users" data-key="entity"></div>
		            <label class="col-md-2 text-right">Email :</label>
		            <div class="col-md-10" data-plugin="users" data-key="email"></div>
		            <label class="col-md-2 text-right">Office :</label>
		            <div class="col-md-10" data-plugin="users" data-key="office"></div>
		            <label class="col-md-2 text-right">Phone :</label>
		            <div class="col-md-10" data-plugin="users" data-key="phone"></div>
		            <label class="col-md-2 text-right">Mobile :</label>
		            <div class="col-md-10" data-plugin="users" data-key="mobile"></div>
		            <label class="col-md-2 text-right">Since :</label>
		            <div class="col-md-10" data-plugin="users" data-key="started_working_on"></div>
		            <label class="col-md-2 text-right">Birthday :</label>
		            <div class="col-md-10" data-plugin="users" data-key="birthday"></div>
		            <label class="col-md-2 text-right">About :</label>
		            <div class="col-md-10" data-plugin="users" data-key="about"></div>
			        </div>
						</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
