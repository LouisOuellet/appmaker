<span data-plugin="clients" data-key="id" style="display:none;"></span>
<span data-plugin="clients" data-key="name" style="display:none;"></span>
<span data-plugin="clients" data-key="code" style="display:none;"></span>
<span data-plugin="clients" data-key="status" style="display:none;"></span>
<span data-plugin="clients" data-key="address" style="display:none;"></span>
<span data-plugin="clients" data-key="city" style="display:none;"></span>
<span data-plugin="clients" data-key="state" style="display:none;"></span>
<span data-plugin="clients" data-key="country" style="display:none;"></span>
<span data-plugin="clients" data-key="zipcode" style="display:none;"></span>
<span data-plugin="clients" data-key="email" style="display:none;"></span>
<span data-plugin="clients" data-key="fax" style="display:none;"></span>
<span data-plugin="clients" data-key="phone" style="display:none;"></span>
<span data-plugin="clients" data-key="toll_free" style="display:none;"></span>
<span data-plugin="clients" data-key="website" style="display:none;"></span>
<span data-plugin="clients" data-key="tags" style="display:none;"></span>
<span data-plugin="clients" data-key="issues" style="display:none;"></span>
<span data-plugin="clients" data-key="assigned_to" style="display:none;"></span>
<span data-plugin="clients" data-key="relationship" style="display:none;"></span>
<span data-plugin="clients" data-key="link_to" style="display:none;"></span>
<div class="row" id="clientsMain">
	<div class="col-md-3">
		<div class="card card-primary card-outline" id="clientsQuickinfo">
			<div class="card-body box-profile p-0">
				<div class="text-center pt-4">
					<img class="profile-user-img img-fluid img-circle" style="height:150px;width:150px;" src="/dist/img/building.png">
				</div>
				<h3 class="profile-username text-center" data-plugin="clients" data-key="name"></h3>
				<h4 class="profile-username text-center pb-2"><a data-plugin="clients" data-key="link_to" class="text-muted"></a></h4>
				<ul class="list-group list-group-flush">
					<li class="list-group-item">
						<b><i class="fas fa-barcode mr-1"></i><span data-language="Code">Code</span></b> <a class="float-right" data-plugin="clients" data-key="code"></a>
					</li>
				</ul>
				<ul class="list-group list-group-flush" id="clientStatuses"></ul>
			</div>
		</div>
		<div class="card card-secondary" id="clientsTags">
      <div class="card-header">
      	<h3 class="card-title"><span data-language="Tags">Tags</span></h3>
				<a class="text-light float-right"><i class="fas fa-plus"></i></a>
      </div>
      <div class="card-body" data-plugin="clients" data-key="tags"></div>
  	</div>
		<div class="card card-info card-outline" id="clientsUsers">
      <div class="card-header">
      	<h3 class="card-title"><span data-language="Assigned users">Assigned users</span></h3>
				<a class="text-info float-right"><i class="fas fa-plus"></i></a>
      </div>
      <div class="card-body" data-plugin="clients" data-key="assigned_to"></div>
  	</div>
		<div class="card card-primary" id="clientsDetails">
      <div class="card-header">
      <h3 class="card-title"><span data-language="Details">Details</span></h3>
      </div>
      <div class="card-body">
        <ul class="list-group list-group-unbordered mb-3">
          <li class="list-group-item">
            <b><span data-language="Created">Created</span>: </b><span data-plugin="clients" data-key="created"></span>
            <b> <span data-language="by">by</span> </b><span data-plugin="clients" data-key="owner"></span>
          </li>
          <li class="list-group-item">
            <b><span data-language="Modified">Modified</span>: </b><span data-plugin="clients" data-key="modified"></span>
            <b> <span data-language="by">by</span> </b><span data-plugin="clients" data-key="updated_by"></span>
          </li>
        </ul>
      </div>
    </div>
	</div>
	<div class="col-md-9">
		<div class="col-md-12 pb-3">
			<div class="btn-group btn-block" id="clientsTools"></div>
		</div>
		<div class="col-md-12">
			<div class="card card-secondary" id="clientsInformation">
        <div class="card-header">
					<h3 class="card-title"><span data-language="Information">Information</span></h3>
					<div class="btn-group dropleft float-right" id="clientsStatusControls">
						<div class="dropdown-menu"></div>
					</div>
        </div>
        <div class="card-body p-0">
					<div class="row p-4">
            <div class="col-md-4">
              <strong><i class="fas fa-building mr-1"></i><span data-language="Address">Address</span>: </strong>
              <p class="text-muted"><span data-plugin="clients" data-key="address"></span>, <span data-plugin="clients" data-key="city"></span> <span data-plugin="clients" data-key="zipcode"></span>, <span data-plugin="clients" data-key="state"></span> <span data-plugin="clients" data-key="country"></span></p>
            </div>
            <div class="col-md-4">
              <strong><i class="fas fa-phone mr-1"></i><span data-language="Phone #">Phone #</span>:</strong>
              <p class="text-muted"><a href="" data-plugin="clients" data-key="phone"></a></p>
            </div>
            <div class="col-md-4">
              <strong><i class="fas fa-phone mr-1"></i><span data-language="Toll Free #">Toll Free #</span>: </strong>
              <p class="text-muted"><a href="" data-plugin="clients" data-key="toll_free"></a></p>
            </div>
            <div class="col-md-4">
              <strong><i class="fas fa-fax mr-1"></i><span data-language="Fax">Fax</span>: </strong>
              <p class="text-muted" data-plugin="clients" data-key="fax"></p>
            </div>
            <div class="col-md-4">
              <strong><i class="fas fa-envelope mr-1"></i><span data-language="Email">Email</span>: </strong>
              <p class="text-muted"><a href="" data-plugin="clients" data-key="email"></a></p>
            </div>
            <div class="col-md-4">
              <strong><i class="fas fa-globe mr-1"></i><span data-language="Website">Website</span>: </strong>
              <p class="text-muted"><a href="" data-plugin="clients" data-key="website"></a></p>
            </div>
					</div>
				</div>
			</div>
		</div>
		<div class="col-md-12">
      <div class="card card-primary card-outline" id="clientsTabs">
        <div class="card-header p-2">
          <ul class="nav nav-pills"></ul>
        </div>
				<div class="card-body p-0">
					<div class="tab-content"></div>
				</div>
			</div>
		</div>
	</div>
</div>
