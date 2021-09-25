<div data-plugin="organizations" data-id="">
	<span style="display:none;" data-plugin="organizations" data-key="id"></span>
	<span style="display:none;" data-plugin="organizations" data-key="created"></span>
	<span style="display:none;" data-plugin="organizations" data-key="modified"></span>
	<span style="display:none;" data-plugin="organizations" data-key="owner"></span>
	<span style="display:none;" data-plugin="organizations" data-key="updated_by"></span>
	<span style="display:none;" data-plugin="organizations" data-key="name"></span>
	<span style="display:none;" data-plugin="organizations" data-key="code"></span>
	<span style="display:none;" data-plugin="organizations" data-key="business_num"></span>
	<span style="display:none;" data-plugin="organizations" data-key="status"></span>
	<span style="display:none;" data-plugin="organizations" data-key="address"></span>
	<span style="display:none;" data-plugin="organizations" data-key="city"></span>
	<span style="display:none;" data-plugin="organizations" data-key="state"></span>
	<span style="display:none;" data-plugin="organizations" data-key="country"></span>
	<span style="display:none;" data-plugin="organizations" data-key="zipcode"></span>
	<span style="display:none;" data-plugin="organizations" data-key="email"></span>
	<span style="display:none;" data-plugin="organizations" data-key="fax"></span>
	<span style="display:none;" data-plugin="organizations" data-key="phone"></span>
	<span style="display:none;" data-plugin="organizations" data-key="toll_free"></span>
	<span style="display:none;" data-plugin="organizations" data-key="website"></span>
	<span style="display:none;" data-plugin="organizations" data-key="tags"></span>
	<span style="display:none;" data-plugin="organizations" data-key="assigned_to"></span>
	<div class="row">
		<div class="col-md-4">
			<div class="card" id="organizations_details">
	      <div class="card-header d-flex p-0">
	        <h3 class="card-title p-3">Organization Details</h3>
	      </div>
	      <div class="card-body p-0">
					<div class="row">
						<div class="col-12 p-4 text-center">
							<img class="profile-user-img img-fluid img-circle" style="height:150px;width:150px;" src="/dist/img/building.png">
						</div>
						<div class="col-12 pt-2 pl-2 pr-2 pb-0 m-0">
							<table class="table table-striped table-hover m-0">
								<thead style="display:none;">
									<tr>
										<th colspan="2">
											<div class="btn-group btn-block"></div>
										</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td data-edit="name"><b>Name</b></td>
										<td><span data-plugin="organizations" data-key="name"></span></td>
									</tr>
									<tr style="display:none;">
										<td data-edit="code"><b>Code</b></td>
										<td data-plugin="organizations" data-key="code"></td>
									</tr>
									<tr style="display:none;">
										<td data-edit="business_num"><b>Business#</b></td>
										<td data-plugin="organizations" data-key="business_num"></td>
									</tr>
									<tr style="display:none;">
										<td><b>Status</b></td>
										<td data-plugin="organizations" data-key="status"></td>
									</tr>
									<tr>
										<td data-edit="address"><b>Address</b></td>
										<td>
											<span data-plugin="organizations" data-key="address"></span>, <span data-plugin="organizations" data-key="city"></span> <span data-plugin="organizations" data-key="zipcode"></span>, <span data-plugin="organizations" data-key="state"></span> <span data-plugin="organizations" data-key="country"></span>
										</td>
									</tr>
									<tr style="display:none;">
										<td data-plugin="organizations" data-edit="phone"><b>Phones</b></td>
										<td>
											<div class="row">
												<div class="col-lg-4 col-md-6 p-1">
													<strong><i class="fas fa-phone mr-1"></i></strong><a href="" data-plugin="organizations" data-key="phone"></a>
												</div>
												<div class="col-lg-4 col-md-6 p-1">
													<strong><i class="fas fa-phone mr-1"></i></strong><a href="" data-plugin="organizations" data-key="toll_free"></a>
												</div>
												<div class="col-lg-4 col-md-6 p-1">
													<strong><i class="fas fa-fax mr-1"></i></strong><a href="" data-plugin="organizations" data-key="fax"></a>
												</div>
											</div>
										</td>
									</tr>
									<tr>
										<td data-edit="email"><b>Email</b></td>
										<td>
											<strong><i class="fas fa-envelope mr-1"></i></strong><a href="" data-plugin="organizations" data-key="email"></a>
										</td>
									</tr>
									<tr>
										<td data-edit="website"><b>Website</b></td>
										<td>
											<strong><i class="fas fa-globe mr-1"></i></strong><a href="" data-plugin="organizations" data-key="website"></a>
										</td>
									</tr>
									<tr style="display:none;">
										<td><b>Subsidiaries</b></td>
										<td data-plugin="organizations" data-key="subsidiaries"></td>
									</tr>
									<tr style="display:none;">
										<td><b>Services</b></td>
										<td data-plugin="organizations" data-key="services"></td>
									</tr>
									<tr style="display:none;">
										<td><b>Issues</b></td>
										<td data-plugin="organizations" data-key="issues"></td>
									</tr>
									<tr style="display:none;">
										<td><b>Tags</b></td>
										<td data-plugin="organizations" data-key="tags"></td>
									</tr>
									<tr>
										<td><b>Assigned to</b></td>
										<td data-plugin="organizations" data-key="assigned_to"></td>
									</tr>
									<tr>
										<td><b>Created</b></td>
										<td id="organizations_created"><time class="timeago"></time></td>
									</tr>
								</tbody>
							</table>
				    </div>
			    </div>
				</div>
	    </div>
		</div>
		<div class="col-md-8">
			<div class="card" id="organizations_main_card">
	      <div class="card-header d-flex p-0">
	        <ul class="nav nav-pills p-2" id="organizations_main_card_tabs">
	          <li class="nav-item"><a class="nav-link active" href="#organizations" data-toggle="tab"><i class="fas fa-history mr-1"></i>History</a></li>
	          <li class="nav-item" style="display:none;"><a class="nav-link" href="#organizations_comments" data-toggle="tab"><i class="fas fa-comment mr-1"></i>Comment</a></li>
	          <li class="nav-item" style="display:none;"><a class="nav-link" href="#organizations_notes" data-toggle="tab"><i class="fas fa-sticky-note mr-1"></i>Note</a></li>
	          <li class="nav-item" style="display:none;"><a class="nav-link" href="#organizations_addresses" data-toggle="tab"><i class="fas fa-map mr-1"></i>Addresses</a></li>
	          <li class="nav-item" style="display:none;"><a class="nav-link" href="#organizations_contacts" data-toggle="tab"><i class="fas fa-address-book mr-1"></i>Contacts</a></li>
	          <li class="nav-item" style="display:none;"><a class="nav-link" href="#organizations_employees" data-toggle="tab"><i class="fas fa-user-tie mr-1"></i>Employees</a></li>
						<li class="nav-item" style="display:none;"><a class="nav-link" href="#organizations_calls" data-toggle="tab"><i class="fas fa-phone-square mr-1"></i>Calls</a></li>
						<li class="nav-item" style="display:none;"><a class="nav-link" href="#organizations_callbacks" data-toggle="tab"><i class="fas fa-phone-square mr-1"></i>Callbacks</a></li>
	          <li class="nav-item" style="display:none;"><a class="nav-link" href="#organizations_appointments" data-toggle="tab"><i class="fas fa-calendar-day mr-1"></i>Appointments</a></li>
	          <li class="nav-item" style="display:none;"><a class="nav-link" href="#organizations_containers" data-toggle="tab"><i class="fas fa-boxes mr-1"></i>Containers</a></li>
	          <li class="nav-item" style="display:none;"><a class="nav-link" href="#organizations_subscriptions" data-toggle="tab"><i class="fas fa-list-alt mr-1"></i>Subscriptions</a></li>
	          <li class="nav-item" style="display:none;"><a class="nav-link" href="#organizations_settings" data-toggle="tab"><i class="fas fa-cog mr-1"></i>Settings</a></li>
	        </ul>
					<div class="btn-group ml-auto">
						<button type="button" data-action="subscribe" style="display:none;" class="btn"><i class="fas fa-bell"></i></button>
						<button type="button" data-action="unsubscribe" style="display:none;" class="btn"><i class="fas fa-bell-slash"></i></button>
					</div>
	      </div>
	      <div class="card-body p-0">
	        <div class="tab-content">
	          <div class="tab-pane p-3 active" id="organizations">
							<div class="timeline" id="organizations_timeline"></div>
						</div>
	          <div class="tab-pane p-0" id="organizations_comments">
							<div id="organizations_comments_textarea">
								<textarea title="Comment" name="comment" class="form-control" data-plugin="organizations" data-form="comments"></textarea>
							</div>
							<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
						    <form class="form-inline my-2 my-lg-0 ml-auto">
						      <button class="btn btn-primary my-2 my-sm-0" type="button" data-action="reply"><i class="fas fa-reply mr-1"></i>Reply</button>
						    </form>
							</nav>
	          </div>
	          <div class="tab-pane p-0" id="organizations_notes">
							<div id="organizations_notes_textarea">
								<textarea title="Note" name="note" class="form-control"></textarea>
							</div>
							<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
						    <form class="form-inline my-2 my-lg-0 ml-auto">
									<select class="form-control mr-sm-2" name="status" style="width: 150px;display:none;"></select>
						      <button class="btn btn-warning my-2 my-sm-0" type="button" data-action="reply"><i class="fas fa-reply mr-1"></i>Add Note</button>
						    </form>
							</nav>
	          </div>
						<div class="tab-pane" id="organizations_contacts">
							<div class="row p-3"></div>
						</div>
						<div class="tab-pane" id="organizations_employees">
							<div class="row p-3"></div>
						</div>
						<div class="tab-pane" id="organizations_calls">
							<div class="row p-3"></div>
							<div class="row px-2 py-0">
								<table class="table table-sm table-striped table-hover mb-0">
		              <thead>
		                <tr>
		                  <th data-header="schedule">Schedule</th>
		                  <th data-header="status">Status</th>
		                  <th data-header="phone" style="display:none;">Phone</th>
		                  <th data-header="contact">Contact</th>
		                  <th data-header="assigned_to">Assigned to</th>
		                  <th data-header="action" style="display:none;">Action</th>
		                </tr>
		              </thead>
		              <tbody></tbody>
		            </table>
			        </div>
						</div>
						<div class="tab-pane" id="organizations_callbacks">
							<div class="row p-3"></div>
							<div class="row px-2 py-0">
								<table class="table table-sm table-striped table-hover mb-0">
		              <thead>
		                <tr>
		                  <th data-header="schedule">Schedule</th>
		                  <th data-header="status">Status</th>
		                  <th data-header="phone" style="display:none;">Phone</th>
		                  <th data-header="contact">Contact</th>
		                  <th data-header="assigned_to">Assigned to</th>
		                  <th data-header="action" style="display:none;">Action</th>
		                </tr>
		              </thead>
		              <tbody></tbody>
		            </table>
			        </div>
						</div>
						<div class="tab-pane" id="organizations_settings">
							<div class="row p-3 smtp">
								<div class="col-12">
									<h4 class="display-4" style="font-size:28px;">SMTP Authentication</h4>
								</div>
							</div>
							<div class="row p-3 togglers">
								<div class="col-12">
									<h4 class="display-4" style="font-size:28px;">Controls</h4>
								</div>
							</div>
						</div>
	        </div>
	      </div>
	    </div>
		</div>
	</div>
</div>
