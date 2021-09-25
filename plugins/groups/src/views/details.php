<div class="container-fluid" id="groupsContainer" data-id="" data-plugin="groups">
  <div class="row">
    <div class="col-md-3">
      <div class="card card-primary card-outline">
        <div class="card-body box-profile">
          <div class="text-center">
            <i class="fas fa-users fa-7x"></i>
          </div>
          <h3 class="profile-username text-center" data-plugin="groups" data-key="name"></h3>
          <ul class="list-group list-group-unbordered mb-3">
            <li class="list-group-item">
              <b><i class="far fa-calendar mr-1"></i>Created</b><a class="float-right" data-plugin="groups" data-key="created"></a>
            </li>
            <li class="list-group-item">
              <b><i class="far fa-calendar mr-1"></i>Modified</b><a class="float-right" data-plugin="groups" data-key="modified"></a>
            </li>
            <li class="list-group-item">
              <b><i class="far fa-user mr-1"></i>Owner</b><a class="float-right" data-plugin="groups" data-key="owner"></a>
            </li>
            <li class="list-group-item">
              <b><i class="far fa-user mr-1"></i>Updated By</b><a class="float-right" data-plugin="groups" data-key="updated_by"></a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="col-md-9">
      <div class="card card-primary">
        <div class="card-header">
					<h3 class="card-title"><i class="icon icon-users mr-1"></i>Members</h3>
        </div>
        <div class="card-body p-0" data-list="members"></div>
      </div>
    </div>
  </div>
</div>
