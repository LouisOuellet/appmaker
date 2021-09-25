<span style="display:none;" data-plugin="tickets" data-key="id"></span>
<span style="display:none;" data-plugin="tickets" data-key="created"></span>
<span style="display:none;" data-plugin="tickets" data-key="modified"></span>
<span style="display:none;" data-plugin="tickets" data-key="owner"></span>
<span style="display:none;" data-plugin="tickets" data-key="updated_by"></span>
<span style="display:none;" data-plugin="tickets" data-key="status"></span>
<span style="display:none;" data-plugin="tickets" data-key="priority"></span>
<span style="display:none;" data-plugin="tickets" data-key="content"></span>
<span style="display:none;" data-plugin="tickets" data-key="time_taken"></span>
<div class="row">
	<div class="col-md-8">
		<div class="card" id="ticket_main_card">
      <div class="card-header d-flex p-0">
        <ul class="nav nav-pills p-2" id="ticket_main_card_tabs">
          <li class="nav-item"><a class="nav-link active" href="#ticket" data-toggle="tab">Ticket</a></li>
          <li class="nav-item"><a class="nav-link" href="#ticket_comments" data-toggle="tab">Comments</a></li>
          <li class="nav-item" style="display:none;"><a class="nav-link" href="#ticket_notes" data-toggle="tab">Notes</a></li>
          <li class="nav-item" style="display:none;"><a class="nav-link" href="#ticket_edit" data-toggle="tab">Edit</a></li>
        </ul>
				<div class="btn-group ml-auto">
					<button type="button" data-action="edit" style="display:none;" class="btn"><i class="icon icon-edit"></i></button>
					<button type="button" data-action="subscribe" style="display:none;" class="btn"><i class="fas fa-bell"></i></button>
					<button type="button" data-action="unsubscribe" style="display:none;" class="btn"><i class="fas fa-bell-slash"></i></button>
				</div>
      </div>
      <div class="card-body p-0">
        <div class="tab-content">
          <div class="tab-pane p-3 active" id="ticket">
						<div class="timeline" id="tickets_timeline"></div>
					</div>
          <div class="tab-pane" id="ticket_edit">
						<div id="ticket_edit_textarea"></div>
						<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
					    <form class="form-inline my-2 my-lg-0 ml-auto">
					      <button class="btn btn-success my-2 my-sm-0" type="button" data-action="save"><i class="fas fa-check mr-1"></i>Save</button>
					    </form>
						</nav>
					</div>
          <div class="tab-pane p-0" id="ticket_comments">
						<div id="ticket_comments_textarea">
							<textarea title="Comment" name="comment" class="form-control"></textarea>
						</div>
						<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
					    <form class="form-inline my-2 my-lg-0 ml-auto">
					      <button class="btn btn-primary my-2 my-sm-0" type="button" data-action="reply"><i class="fas fa-reply mr-1"></i>Reply</button>
					    </form>
						</nav>
          </div>
          <div class="tab-pane p-0" id="ticket_notes">
						<div id="ticket_notes_textarea">
							<textarea title="Note" name="note" class="form-control"></textarea>
						</div>
						<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
					    <form class="form-inline my-2 my-lg-0 ml-auto">
								<select class="form-control mr-sm-2" name="status"></select>
								<select class="form-control mr-sm-2" name="priority"></select>
					      <button class="btn btn-primary my-2 my-sm-0" type="button" data-action="reply"><i class="fas fa-reply mr-1"></i>Reply</button>
					    </form>
						</nav>
          </div>
        </div>
      </div>
    </div>
	</div>
	<div class="col-md-4">
		<div class="card">
      <div class="card-header d-flex p-0">
        <h3 class="card-title p-3">Ticket Details</h3>
      </div>
			<div class="card-body pt-2 pl-2 pr-2 pb-0 m-0">
				<table class="table table-striped table-hover m-0">
					<tbody>
						<tr>
							<td><b>Status</b></td>
							<td data-plugin="tickets" data-key="status"></td>
						</tr>
						<tr>
							<td><b>Priority</b></td>
							<td data-plugin="tickets" data-key="priority"></td>
						</tr>
						<tr>
							<td><b>Subject</b></td>
							<td data-plugin="tickets" data-key="title"></td>
						</tr>
						<tr>
							<td><b>Created</b></td>
							<td id="ticket_created"><time class="timeago"></time></td>
						</tr>
						<tr>
							<td><b>Email Address</b></td>
							<td><a data-plugin="tickets" data-key="email"></a></td>
						</tr>
						<tr>
							<td><b>Client</b></td>
							<td><a data-plugin="tickets" data-key="client"></a></td>
						</tr>
						<tr>
							<td><b>Assets</b></td>
							<td data-plugin="tickets" data-key="assets"></td>
						</tr>
						<tr>
							<td><b>Project</b></td>
							<td><a data-plugin="tickets" data-key="project"></a></td>
						</tr>
						<tr>
							<td><b>User</b></td>
							<td><a data-plugin="tickets" data-key="user"></a></td>
						</tr>
						<tr>
							<td><b>Phone</b></td>
							<td data-plugin="tickets" data-key="phone"></td>
						</tr>

						<tr>
							<td><b>Assigned To</b></td>
							<td data-plugin="tickets" data-key="assigned_to"></td>
						</tr>
					</tbody>
				</table>
			</div>
    </div>
	</div>
</div>
