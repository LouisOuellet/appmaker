<div data-plugin="dispatch" data-id="">
	<span style="display:none;" data-plugin="dispatch" data-key="id"></span>
	<span style="display:none;" data-plugin="dispatch" data-key="created"></span>
	<span style="display:none;" data-plugin="dispatch" data-key="modified"></span>
	<span style="display:none;" data-plugin="dispatch" data-key="owner"></span>
	<span style="display:none;" data-plugin="dispatch" data-key="updated_by"></span>
	<div class="row">
		<div class="col-md-4">
			<div class="card" id="dispatch_details">
	      <div class="card-header d-flex p-0">
	        <h3 class="card-title p-3">Conversation Details</h3>
	      </div>
	      <div class="card-body p-0">
					<div class="row">
						<div class="col-12 p-4 text-center">
							<img class="profile-user-img img-fluid img-circle" style="height:150px;width:150px;" src="/dist/img/building.png">
						</div>
						<div class="col-12 pt-2 pl-2 pr-2 pb-0 m-0">
							<table class="table table-striped table-hover m-0">
								<thead>
									<tr>
										<th colspan="2" class="p-3">
											<div class="btn-group btn-block">
                        <button type="submit" class="btn btn-success">Create Shipment</button>
                      </div>
										</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td colspan="2" class="p-0">
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <span class="input-group-text"><i class="fas fa-building mr-1"></i>Client</span>
                        </div>
                        <select name="client" class="form-control select2bs4">
                          <option value="KIMPEX3326">Kimpex</option>
                          <option value="THIB4000">Thibert</option>
                        </select>
                        <div class="input-group-append">
                          <button type="button" class="btn btn-success"><i class="fas fa-save"></i></button>
                        </div>
                      </div>
                    </td>
                  </tr>
									<tr>
										<td><b>Contacts</b></td>
										<td>
                      <div class="btn-group m-1" data-id="container@msc.com">
                        <button type="button" class="btn btn-xs btn-primary" data-action="details">
                          <i class="fas fa-address-card mr-1"></i>container@msc.com
                        </button>
                        <button type="button" class="btn btn-xs btn-info" data-action="send">
                          <i class="fas fa-paper-plane"></i>
                        </button>
                        <button type="button" class="btn btn-xs btn-danger" data-action="remove">
                          <i class="fas fa-backspace"></i>
                        </button>
                      </div>
                    </td>
									</tr>
									<tr>
										<td><b>Created</b></td>
										<td id="dispatch_created"><time class="timeago"></time></td>
									</tr>
									<tr>
										<td><b>Files</b></td>
										<td>
                      <div class="btn-group m-1" data-id="1">
                        <button type="button" class="btn btn-xs btn-primary" data-action="details">
                          <i class="fas fa-file mr-1"></i>Arrival Noticec.pdf
                        </button>
                        <button type="button" class="btn btn-xs btn-warning" data-action="download">
                          <i class="fas fa-file-download"></i>
                        </button>
                        <button type="button" class="btn btn-xs btn-danger" data-action="delete">
                          <i class="fas fa-trash-alt"></i>
                        </button>
                      </div>
                      <div class="btn-group m-1" data-id="2">
                        <button type="button" class="btn btn-xs btn-primary" data-action="details">
                          <i class="fas fa-file mr-1"></i>Manifest.pdf
                        </button>
                        <button type="button" class="btn btn-xs btn-warning" data-action="download">
                          <i class="fas fa-file-download"></i>
                        </button>
                        <button type="button" class="btn btn-xs btn-danger" data-action="delete">
                          <i class="fas fa-trash-alt"></i>
                        </button>
                      </div>
                      <div class="btn-group m-1" data-id="3">
                        <button type="button" class="btn btn-xs btn-primary" data-action="details">
                          <i class="fas fa-file mr-1"></i>Bill of Lading.pdf
                        </button>
                        <button type="button" class="btn btn-xs btn-warning" data-action="download">
                          <i class="fas fa-file-download"></i>
                        </button>
                        <button type="button" class="btn btn-xs btn-danger" data-action="delete">
                          <i class="fas fa-trash-alt"></i>
                        </button>
                      </div>
                      <div class="btn-group m-1" data-id="4">
                        <button type="button" class="btn btn-xs btn-primary" data-action="details">
                          <i class="fas fa-file mr-1"></i>Packing List.pdf
                        </button>
                        <button type="button" class="btn btn-xs btn-warning" data-action="download">
                          <i class="fas fa-file-download"></i>
                        </button>
                        <button type="button" class="btn btn-xs btn-danger" data-action="delete">
                          <i class="fas fa-trash-alt"></i>
                        </button>
                      </div>
                      <div class="btn-group m-1" data-id="5">
                        <button type="button" class="btn btn-xs btn-primary" data-action="details">
                          <i class="fas fa-file mr-1"></i>Invoice.pdf
                        </button>
                        <button type="button" class="btn btn-xs btn-warning" data-action="download">
                          <i class="fas fa-file-download"></i>
                        </button>
                        <button type="button" class="btn btn-xs btn-danger" data-action="delete">
                          <i class="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
									</tr>
									<tr>
										<td><b>References</b></td>
										<td>
                      <div class="btn-group m-1" data-id="00987543" data-type="ref">
                        <button type="button" class="btn btn-xs btn-primary" data-action="details">
                          <i class="fas fa-tag mr-1"></i>REF:00987543
                        </button>
                        <button type="button" class="btn btn-xs btn-danger" data-action="untag">
                          <i class="fas fa-backspace"></i>
                        </button>
                      </div>
                      <div class="btn-group m-1" data-id="10013000876943" data-type="tr">
                        <button type="button" class="btn btn-xs btn-primary" data-action="details">
                          <i class="fas fa-tag mr-1"></i>TR:10013000876943
                        </button>
                        <button type="button" class="btn btn-xs btn-danger" data-action="untag">
                          <i class="fas fa-backspace"></i>
                        </button>
                      </div>
                      <div class="btn-group m-1" data-id="9013xys2340165823" data-type="ccn">
                        <button type="button" class="btn btn-xs btn-primary" data-action="details">
                          <i class="fas fa-tag mr-1"></i>CCN:9013xys2340165823
                        </button>
                        <button type="button" class="btn btn-xs btn-danger" data-action="untag">
                          <i class="fas fa-backspace"></i>
                        </button>
                      </div>
                    </td>
									</tr>
									<tr>
										<td colspan="2" class="p-0">
                      <div class="vertical-input-group">
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-sitemap mr-1"></i>Type</span>
                          </div>
                          <select name="type" class="form-control select2bs4">
                            <option value="ccn">Cargo Control Number</option>
                            <option value="cn">Container</option>
                            <option value="po">Purchase Order</option>
                            <option value="inv">Invoice</option>
                            <option value="tr">Transaction</option>
                            <option value="ref">Client Reference</option>
                            <option value="nbr">Shipment Number</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-tags mr-1"></i>Reference(s)</span>
                          </div>
                          <select name="reference" multiple="" class="form-control select2bs4"></select>
                        </div>
                        <div class="input-group">
                          <button type="button" class="btn btn-success btn-block"><i class="fas fa-plus"></i></button>
                        </div>
                      </div>
                    </td>
									</tr>
								</tbody>
							</table>
				    </div>
			    </div>
				</div>
	    </div>
		</div>
		<div class="col-md-8">
			<div class="card" id="dispatch_main_card">
	      <div class="card-header d-flex p-0">
	        <ul class="nav nav-pills p-2" id="dispatch_main_card_tabs">
	          <li class="nav-item"><a class="nav-link active" href="#dispatch_message" data-toggle="tab"><i class="fas fa-envelope-open-text mr-1"></i>Message</a></li>
	          <li class="nav-item"><a class="nav-link" href="#dispatch_history" data-toggle="tab"><i class="fas fa-history mr-1"></i>History</a></li>
	          <li class="nav-item"><a class="nav-link" href="#dispatch_comments" data-toggle="tab"><i class="fas fa-comment mr-1"></i>Comment</a></li>
	          <li class="nav-item"><a class="nav-link" href="#dispatch_notes" data-toggle="tab"><i class="fas fa-sticky-note mr-1"></i>Note</a></li>
	        </ul>
					<div class="btn-group ml-auto">
						<button type="button" data-action="subscribe" class="btn"><i class="fas fa-bell"></i></button>
						<button type="button" data-action="unsubscribe" style="display:none;" class="btn"><i class="fas fa-bell-slash"></i></button>
					</div>
	      </div>
	      <div class="card-body p-0">
	        <div class="tab-content">
	          <div class="tab-pane p-0 active" id="dispatch_message">
              <table class="table table-sm table-hover m-0">
                <tr>
                  <th class="bg-info" style="width:90px;">Contacts</th>
                  <td data-contacts="" class="p-1">
                    <button type="button" class="btn btn-xs btn-primary" data-contact="container@msc.com">
                      <i class="fas fa-address-card mr-1"></i>container@msc.com
                    </button>
                    <button type="button" class="btn btn-xs btn-primary" data-contact="containerinfo@rthibert.com">
                      <i class="fas fa-address-card mr-1"></i>containerinfo@rthibert.com
                    </button>
                  </td>
                </tr>
                <tr>
                  <th class="bg-secondary">Subject</th>
                  <td data-subject="" class="p-1 pl-3">My message subject</td>
                </tr>
                <tr>
                  <th class="bg-warning">Attachments</th>
                  <td data-attachments="" class="p-1">
                    <div class="btn-group" data-id="5">
                      <button type="button" class="btn btn-xs btn-primary" data-action="details">
                        <i class="fas fa-file mr-1"></i>Invoice.pdf
                      </button>
                      <button type="button" class="btn btn-xs btn-warning" data-action="download">
                        <i class="fas fa-file-download"></i>
                      </button>
                    </div>
                    <div class="btn-group" data-id="6">
                      <button type="button" class="btn btn-xs btn-primary" data-action="details">
                        <i class="fas fa-file mr-1"></i>Packing List.pdf
                      </button>
                      <button type="button" class="btn btn-xs btn-warning" data-action="download">
                        <i class="fas fa-file-download"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" data-body="">
                    <div>
                      <ul>
                        <li>open mail</li>
                        <li>fetch all related mail</li>
                        <li>fetch all files</li>
                        <li>add references from related mail</li>
                        <li>add references to new files</li>
                        <ul>
                          <li>Except for INV, PO and Client REF</li>
                        </ul>
                        <li>Open new files</li>
                        <ul>
                          <li>add references</li>
                          <li>if reference is not PO,INV,Client REF add to all files</li>
                          <li>add all file references to mail</li>
                        </ul>
                        <li>Once all files are retrieved, create a shipment</li>
                        <ul>
                          <li>Link all reference to new shipment</li>
                          <li>Link all files to new shipment</li>
                          <li>Link all mails to new shipment</li>
                          <li>Status of conversation changed to processing</li>
                        </ul>
                        <li>If shipment is being worked on a new request is required, the all related communications stays with the shipment.</li>
                        <li>Once shipment is transmitted, add transaction number reference and change status to transmitted.</li>
                        <li>Shipments listing should show shipment with status of Processing and Reject</li>
                        <li>A view all permission can be added for some users.</li>
                      </ul>
                      <ul>
                        <li>Link email based on mid, reply-to and reference ID.</li>
                        <li>if a message is referenced, link it.</li>
                        <li>if a shipment is linked to one of the reference email, attach the mail to the shipment.</li>
                        <li>if no shipment are found, create a new dispatch entry.</li>
                      </ul>
                      <ul>
                        <li>Dispatch Index (All new mail request with no shipment attached)</li>
                        <li>Dispatch Details (Details of the mail conversation)</li>
                        <li>Shipment Index (All shipments with a status of "Processing" or "Rejected")</li>
                        <li>Shipment Details (Details of the shipment)</li>
                        <li>Shipment Request (All new request with a shipment attached)</li>
                      </ul>
											Add View with only conversation with attachments
                    </div>
                  </td>
                </tr>
              </table>
						</div>
	          <div class="tab-pane p-3" id="dispatch_history">
							<div class="timeline" id="dispatch_timeline"></div>
						</div>
	          <div class="tab-pane p-0" id="dispatch_comments">
							<div id="dispatch_comments_textarea">
								<textarea title="Comment" name="comment" class="form-control" data-plugin="dispatch" data-form="comments"></textarea>
							</div>
							<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
						    <form class="form-inline my-2 my-lg-0 ml-auto">
						      <button class="btn btn-primary my-2 my-sm-0" type="button" data-action="reply"><i class="fas fa-reply mr-1"></i>Reply</button>
						    </form>
							</nav>
	          </div>
	          <div class="tab-pane p-0" id="dispatch_notes">
							<div id="dispatch_notes_textarea">
								<textarea title="Note" name="note" class="form-control"></textarea>
							</div>
							<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
						    <form class="form-inline my-2 my-lg-0 ml-auto">
									<select class="form-control mr-sm-2" name="status" style="display:none;"></select>
						      <button class="btn btn-warning my-2 my-sm-0" type="button" data-action="reply"><i class="fas fa-reply mr-1"></i>Add Note</button>
						    </form>
							</nav>
	          </div>
	        </div>
	      </div>
	    </div>
		</div>
	</div>
</div>
<script>
  $(function(){
    $('#dispatch_details textarea').summernote({
      toolbar: [
        ['font', ['fontname', 'fontsize']],
        ['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
        ['color', ['color']],
        ['paragraph', ['style', 'ul', 'ol', 'paragraph', 'height']],
      ],
      height: 250,
    });
    $('#dispatch_details select').each(function(){
      switch($(this).attr('name')){
        case"reference":
          $(this).select2({
            theme: 'bootstrap4',
            tags: true,
            createTag: function (params) {
              return {
                id: params.term,
                text: params.term,
                newOption: true
              }
            },
            templateResult: function (data) {
              var $result = $("<span></span>");
              $result.text(data.text);
              if (data.newOption) {
                $result.append(" <em>(new)</em>");
              }
              return $result;
            }
          });
          $(this).on("select2:select", function (evt) {
            var element = evt.params.data.element;
            var $element = $(element);

            $element.detach();
            $(this).append($element);
            $(this).trigger("change");
          });
          break;
        default: $(this).select2({ theme: 'bootstrap4' });break;
      }
    });
  });
</script>
