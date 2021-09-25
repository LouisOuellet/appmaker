<span data-plugin="appointments" data-key="id" style="display:none;"></span>
<span data-plugin="appointments" data-key="date" style="display:none;"></span>
<span data-plugin="appointments" data-key="time" style="display:none;"></span>
<span data-plugin="appointments" data-key="status" style="display:none;"></span>
<span data-plugin="appointments" data-key="contact" style="display:none;"></span>
<span data-plugin="appointments" data-key="client" style="display:none;"></span>
<span data-plugin="appointments" data-key="divisions" style="display:none;"></span>
<span data-plugin="appointments" data-key="issues" style="display:none;"></span>
<span data-plugin="appointments" data-key="assigned_to" style="display:none;"></span>
<div class="row p-0" id="AppointmentHeader"></div>
<div class="row">
	<div class="col-md-12">
		<div class="card">
			<div class="card-body">
				<div class="row">
					<div class="col-md-2 text-center">
						<img src="/dist/img/default.png" class="img-circle img-responsive profile-user-img" style="width:100px; margin-top:20px; margin-bottom:20px;">
					</div>
					<div class="col-md-10">
						<div class="row">
							<div class="col-md-12">
								<h3><span data-plugin="contacts" data-key="first_name"></span> <span data-plugin="contacts" data-key="last_name"></span></h3>
								<h5 data-plugin="contacts" data-key="job_title"></h5>
							</div>
						</div>
						<div class="row">
							<div class="col-md-4">
								<strong><i class="fas fa-phone mr-1" aria-hidden="true"></i>Phone #: </strong>
								<p class="text-muted"><a data-plugin="contacts" data-key="phone"></a></p>
							</div>
							<div class="col-md-4">
								<strong><i class="fas fa-phone mr-1" aria-hidden="true"></i>Office #: </strong>
								<p class="text-muted"><a data-plugin="contacts" data-key="office_num"></a></p>
							</div>
							<div class="col-md-4">
								<strong><i class="fas fa-mobile-alt mr-1" aria-hidden="true"></i>Mobile #: </strong>
								<p class="text-muted"><a data-plugin="contacts" data-key="mobile"></a></p>
							</div>
							<div class="col-md-4">
								<strong><i class="fas fa-phone mr-1" aria-hidden="true"></i>Other #: </strong>
								<p class="text-muted"><a data-plugin="contacts" data-key="other_num"></a></p>
							</div>
							<div class="col-md-4">
								<strong><i class="fas fa-envelope mr-1" aria-hidden="true"></i>Email: </strong>
								<p class="text-muted"><a data-plugin="contacts" data-key="email"></a></p>
							</div>
							<div class="col-md-4">
								<strong><i class="fas fa-building mr-1" aria-hidden="true"></i>Client: </strong>
								<p class="text-muted" data-plugin="contacts" data-key="link_to"></p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="row p-0">
	<div class="col-md-12" id="AppointmentNote"></div>
</div>
<div class="row p-0">
	<div class="col-md-12" id="AppointmentDivisions"></div>
</div>
<div class="row p-0">
	<div class="col-md-12" id="AppointmentIssues"></div>
</div>
<div class="row p-0" id="AppointmentControls"></div>
