<span style="display:none;" data-plugin="containers" data-key="id"></span>
<span style="display:none;" data-plugin="containers" data-key="created"></span>
<span style="display:none;" data-plugin="containers" data-key="modified"></span>
<span style="display:none;" data-plugin="containers" data-key="owner"></span>
<span style="display:none;" data-plugin="containers" data-key="updated_by"></span>
<span style="display:none;" data-plugin="containers" data-key="pick_up_num"></span>
<span style="display:none;" data-plugin="containers" data-key="bill_of_lading"></span>
<span style="display:none;" data-plugin="containers" data-key="carrier"></span>
<span style="display:none;" data-plugin="containers" data-key="vessel"></span>
<span style="display:none;" data-plugin="containers" data-key="etd"></span>
<span style="display:none;" data-plugin="containers" data-key="eta_port"></span>
<span style="display:none;" data-plugin="containers" data-key="port"></span>
<span style="display:none;" data-plugin="containers" data-key="sub_location"></span>
<span style="display:none;" data-plugin="containers" data-key="custom_clearance"></span>
<span style="display:none;" data-plugin="containers" data-key="storage_date"></span>
<span style="display:none;" data-plugin="containers" data-key="last_free_day"></span>
<span style="display:none;" data-plugin="containers" data-key="delivery_appointment"></span>
<span style="display:none;" data-plugin="containers" data-key="charge_to_shipper"></span>
<span style="display:none;" data-plugin="containers" data-key="charge_to_other"></span>
<div class="row">
	<div class="col-md-8">
		<div class="card" id="containers_main_card">
      <div class="card-header d-flex p-0">
        <ul class="nav nav-pills p-2" id="containers_main_card_tabs">
          <li class="nav-item"><a class="nav-link active" href="#containers" data-toggle="tab">History</a></li>
          <li class="nav-item" style="display:none;"><a class="nav-link" href="#containers_comments" data-toggle="tab">Comments</a></li>
          <li class="nav-item" style="display:none;"><a class="nav-link" href="#containers_notes" data-toggle="tab">Notes</a></li>
        </ul>
				<div class="btn-group ml-auto">
					<button type="button" data-action="subscribe" style="display:none;" class="btn"><i class="fas fa-bell"></i></button>
					<button type="button" data-action="unsubscribe" style="display:none;" class="btn"><i class="fas fa-bell-slash"></i></button>
				</div>
      </div>
      <div class="card-body p-0">
        <div class="tab-content">
          <div class="tab-pane p-3 active" id="containers">
						<div class="timeline" id="containers_timeline"></div>
					</div>
          <div class="tab-pane p-0" id="containers_comments">
						<div id="containers_comments_textarea">
							<textarea title="Comment" name="comment" class="form-control" data-plugin="containers" data-form="comments"></textarea>
						</div>
						<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
					    <form class="form-inline my-2 my-lg-0 ml-auto">
					      <button class="btn btn-primary my-2 my-sm-0" type="button" data-action="reply"><i class="fas fa-reply mr-1"></i>Reply</button>
					    </form>
						</nav>
          </div>
          <div class="tab-pane p-0" id="containers_notes">
						<div id="containers_notes_textarea">
							<textarea title="Note" name="note" class="form-control"></textarea>
						</div>
						<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
					    <form class="form-inline my-2 my-lg-0 ml-auto">
								<select class="form-control mr-sm-2" name="status"></select>
					      <button class="btn btn-primary my-2 my-sm-0" type="button" data-action="reply"><i class="fas fa-reply mr-1"></i>Reply</button>
					    </form>
						</nav>
          </div>
        </div>
      </div>
    </div>
	</div>
	<div class="col-md-4">
		<div class="card" id="container_details">
      <div class="card-header d-flex p-0">
        <h3 class="card-title p-3">Container Details</h3>
      </div>
      <div class="card-body p-0">
				<div class="row">
					<div class="col-12 p-4 text-center">
						<img class="profile-user-img img-fluid img-circle" style="height:150px;width:150px;" src="/dist/img/container.png">
					</div>
					<div class="col-12 pt-2 pl-2 pr-2 pb-0 m-0">
						<table class="table table-striped table-hover m-0">
							<tbody>
								<tr>
									<td><b>Container</b></td>
									<td><span data-plugin="containers" data-key="container_num"></span>[<span data-plugin="containers" data-key="container_size"></span>]</td>
								</tr>
								<tr>
									<td><b>Status</b></td>
									<td data-plugin="containers" data-key="status"></td>
								</tr>
								<tr>
									<td><b>Created</b></td>
									<td id="containers_created"><time class="timeago"></time></td>
								</tr>
								<tr>
									<td><b>Client</b></td>
									<td data-plugin="containers" data-key="client"></td>
								</tr>
								<tr>
									<td><b>Location</b></td>
									<td data-plugin="containers" data-key="location"></td>
								</tr>
								<tr>
									<td><b>Pick Up #</b></td>
									<td data-plugin="containers" data-key="pick_up_num"></td>
								</tr>
								<tr>
									<td><b>Bill of Lading</b></td>
									<td data-plugin="containers" data-key="bill_of_lading"></td>
								</tr>
								<tr>
									<td><b>Carrier</b></td>
									<td data-plugin="containers" data-key="carrier"></td>
								</tr>
								<tr>
									<td><b>Vessel</b></td>
									<td data-plugin="containers" data-key="vessel"></td>
								</tr>
								<tr>
									<td><b>port</b></td>
									<td data-plugin="containers" data-key="port"></td>
								</tr>
								<tr>
									<td><b>Sub Location</b></td>
									<td data-plugin="containers" data-key="sub_location"></td>
								</tr>
								<tr>
									<td><b>ETD</b></td>
									<td data-plugin="containers" data-key="ETD"></td>
								</tr>
								<tr>
									<td><b>ETA Port</b></td>
									<td data-plugin="containers" data-key="ETA_port"></td>
								</tr>
								<tr>
									<td><b>Custom Clearance</b></td>
									<td data-plugin="containers" data-key="custom_clearance"></td>
								</tr>
								<tr>
									<td><b>Storage Date</b></td>
									<td data-plugin="containers" data-key="storage_date"></td>
								</tr>
								<tr>
									<td><b>Last Free Day</b></td>
									<td data-plugin="containers" data-key="last_free_day"></td>
								</tr>
								<tr>
									<td><b>Delivery appointment</b></td>
									<td data-plugin="containers" data-key="delivery_appointment"></td>
								</tr>
								<tr>
									<td><b>Detention Date</b></td>
									<td data-plugin="containers" data-key="detention_date"></td>
								</tr>
								<tr>
									<td><b>Returned Date</b></td>
									<td data-plugin="containers" data-key="returned"></td>
								</tr>
								<tr style="display:none;">
									<td><b>Charge to Shipper</b></td>
									<td data-plugin="containers" data-key="charge_to_shipper"></td>
								</tr>
								<tr style="display:none;">
									<td><b>Charge to Other</b></td>
									<td data-plugin="containers" data-key="charge_to_other"></td>
								</tr>
							</tbody>
						</table>
			    </div>
		    </div>
			</div>
    </div>
	</div>
</div>
