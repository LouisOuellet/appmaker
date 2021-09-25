API.Plugins.tickets = {
	element:{
		table:{
			index:{},
		},
	},
	forms:{
		create:{
			0:"priority",
			description:{
				0:"title",
				1:"content",
			},
			extra:{
				0:"category",
				1:"sub_category",
			},
		},
		update:{
			0:"category",
			1:"sub_category",
		},
	},
	init:function(){
		API.GUI.Sidebar.Nav.add('Tickets', 'help');
	},
	load:{
		index:function(){
			API.Builder.card($('#pagecontent'),{ title: 'Tickets', icon: 'tickets'}, function(card){
				API.request('tickets','read',{
					data:{options:{ link_to:'TicketsIndex',plugin:'tickets',view:'index' }},
				},function(result) {
					var dataset = JSON.parse(result);
					if(dataset.success != undefined){
						for(const [key, value] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','dom','tickets',value.id],value); }
						for(const [key, value] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','tickets',value.id],value); }
						API.Builder.table(card.children('.card-body'), dataset.output.results, {
							headers:dataset.output.headers,
							id:'TicketsIndex',
							modal:true,
							key:'id',
							set:{
								status:1,
								priority:1,
								user:API.Contents.Auth.raw.User.id,
								email:API.Contents.Auth.raw.User.email,
								client:API.Contents.Auth.raw.User.client,
								phone:API.Contents.Auth.raw.User.phone,
							},
							clickable:{ enable:true, view:'details'},
							controls:{ toolbar:true},
							import:{ key:'id', },
						},function(response){
							API.Plugins.tickets.element.table.index = response.table;
						});
					}
				});
			});
		},
		details:function(){
			var url = new URL(window.location.href);
			var id = url.searchParams.get("id"), values = '', main = $('#ticket_main_card'), timeline = $('#tickets_timeline');
			if($('span[data-plugin="tickets"][data-key="id"]').parent('.modal-body').length > 0){
				var modal = $('span[data-plugin="tickets"][data-key="id"]').parent('.modal-body').parent().parent().parent();
				modal.find('.modal-header').find('.btn-group').find('[data-control="update"]').remove();
			}
			API.request(url.searchParams.get("p"),'get',{data:{id:id}},function(result){
				var dataset = JSON.parse(result);
				if(dataset.success != undefined){
					// GUI
					// Subscribe BTN
					// Hide Bell BTN
					if(API.Helper.isSet(dataset.output.details,['users','raw',API.Contents.Auth.User.id])){
						main.find('.card-header').find('button[data-action="unsubscribe"]').show();
					} else {
						main.find('.card-header').find('button[data-action="subscribe"]').show();
					}
					// Events
					main.find('.card-header').find('button[data-action="unsubscribe"]').click(function(){
						API.request(url.searchParams.get("p"),'unsubscribe',{data:{id:dataset.output.ticket.raw.id}},function(answer){
							var subscription = JSON.parse(answer);
							if(subscription.success != undefined){
								main.find('.card-header').find('button[data-action="unsubscribe"]').hide();
								main.find('.card-header').find('button[data-action="subscribe"]').show();
								$('#tickets_timeline').find('[data-type=user][data-id="'+API.Contents.Auth.User.id+'"]').remove();
							}
						});
					});
					main.find('.card-header').find('button[data-action="subscribe"]').click(function(){
						API.request(url.searchParams.get("p"),'subscribe',{data:{id:dataset.output.ticket.raw.id}},function(answer){
							var subscription = JSON.parse(answer);
							if(subscription.success != undefined){
								main.find('.card-header').find('button[data-action="subscribe"]').hide();
								main.find('.card-header').find('button[data-action="unsubscribe"]').show();
								var sub = {
									id:API.Contents.Auth.User.id,
									created:subscription.output.relationship.created,
									email:API.Contents.Auth.User.email,
								};
								API.Builder.Timeline.add.subscription($('#tickets_timeline'),sub,'user','lightblue');
							}
						});
					});
					// Edit Ticket
					if((API.Auth.validate('custom', 'tickets_edit', 3))&&(API.Auth.validate('plugin', 'tickets', 3))){
						main.find('.card-header').find('button[data-action="edit"]').show();
						// Events
						main.find('.card-header').find('button[data-action="edit"]').click(function(){
							$('#ticket_edit_textarea').html('');
							API.Builder.input($('#ticket_edit_textarea'), 'content', $('[data-plugin="tickets"][data-key="content"]').html());
							$('#ticket_main_card_tabs a[href="#ticket_edit"]').tab('show');
						});
						$('#ticket_edit').find('button[data-action="save"]').click(function(){
							dataset.output.ticket.dom.content = $('#ticket_edit_textarea').find('textarea').summernote('code');
							API.request('tickets','update',{data:{record:dataset.output.ticket.dom}});
							$('[data-plugin="tickets"][data-key="content"]').html($('#ticket_edit_textarea').find('textarea').summernote('code'));
							$('#ticket_main_card_tabs a[href="#ticket"]').tab('show');
						});
					}
					// Ticket
					API.GUI.insert(dataset.output.ticket.dom);
					$('#ticket_created').find('time').attr('datetime',$('[data-plugin="tickets"][data-key="created"]').first().text().replace(/ /g, "T"));
					$('#ticket_created').find('time').html($('[data-plugin="tickets"][data-key="created"]').first().text());
					$('#ticket_created').find('time').timeago();
					main.find('textarea').summernote({
						toolbar: [
							['font', ['fontname', 'fontsize']],
							['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
							['color', ['color']],
							['paragraph', ['style', 'ul', 'ol', 'paragraph', 'height']],
						],
						height: 250,
					});
					// Status
					for(const [statusOrder, statusInfo] of Object.entries(API.Contents.Statuses.tickets)){
						$('#ticket_notes select[name="status"]').append(new Option(API.Contents.Language[statusInfo.name], statusOrder));
					}
					$('#ticket_notes select[name="status"]').val(dataset.output.ticket.dom.status);
					$('td[data-plugin="tickets"][data-key="status"]').html('<span class="badge bg-'+API.Contents.Statuses.tickets[dataset.output.ticket.dom.status].color+'"><i class="'+API.Contents.Statuses.tickets[dataset.output.ticket.dom.status].icon+' mr-1" aria-hidden="true"></i>'+API.Contents.Language[API.Contents.Statuses.tickets[dataset.output.ticket.dom.status].name]+'</span>');
					// Priority
					for(const [priorityOrder, priorityInfo] of Object.entries(API.Contents.Priorities.tickets)){
						$('#ticket_notes select[name="priority"]').append(new Option(API.Contents.Language[priorityInfo.name], priorityOrder));
					}
					$('#ticket_notes select[name="priority"]').val(dataset.output.ticket.dom.priority);
					$('td[data-plugin="tickets"][data-key="priority"]').html('<span class="badge bg-'+API.Contents.Priorities.tickets[dataset.output.ticket.dom.priority].color+'"><i class="'+API.Contents.Priorities.tickets[dataset.output.ticket.dom.priority].icon+' mr-1" aria-hidden="true"></i>'+API.Contents.Language[API.Contents.Priorities.tickets[dataset.output.ticket.dom.priority].name]+'</span>');
					// Notes
					if(API.Auth.validate('custom', 'tickets_notes', 1)){
						$('#ticket_main_card_tabs .nav-item .nav-link[href="#ticket_notes"]').parent().show();
					} else {
						$('#ticket_main_card_tabs .nav-item .nav-link[href="#ticket_notes"]').parent().remove();
						$('#ticket_notes').remove();
					}
					// Creating Timeline
					// Ticket
					API.Builder.Timeline.add.card($('#tickets_timeline'),dataset.output.ticket.dom,'ticket-alt','success',function(item){
						item.find('.timeline-body').attr('data-plugin','tickets');
						item.find('.timeline-body').attr('data-key','content');
					});
					// Relationships
					for(const [rid, relations] of Object.entries(dataset.output.relationships)){
						for(const [uid, relation] of Object.entries(relations)){
							var detail = {};
							for(const [key, value] of Object.entries(dataset.output.details[relation.relationship].dom[relation.link_to])){ detail[key] = value; }
							detail.created = relation.created;
							switch(relation.relationship){
								case"status":
								case"statuses":
									API.Builder.Timeline.add.status($('#tickets_timeline'),detail);
									break;
								case"priority":
								case"priorities":
									API.Builder.Timeline.add.priority($('#tickets_timeline'),detail);
									break;
								case"users":
									detail.email = dataset.output.details[relation.relationship].dom[relation.link_to].email;
									API.Builder.Timeline.add.subscription($('#tickets_timeline'),detail,'user','lightblue');
									break;
								case"contacts":
									detail.email = dataset.output.details[relation.relationship].dom[relation.link_to].email;
									API.Builder.Timeline.add.subscription($('#tickets_timeline'),detail,'address-card');
									break;
								case"clients":
									API.Builder.Timeline.add.client($('#tickets_timeline'),detail);
									break;
								case"comments":
									API.Builder.Timeline.add.card($('#tickets_timeline'),detail,'comment','primary');
									break;
								case"notes":
									if((API.Helper.isSet(API.Contents.Auth.Permissions,['custom','tickets_notes']))&&(API.Contents.Auth.Permissions.custom.tickets_notes > 0)){
										API.Builder.Timeline.add.card($('#tickets_timeline'),detail,'sticky-note','warning',function(item){
											item.find('.timeline-footer').remove();
										});
									}
									break;
								default:
									API.Builder.Timeline.add.card($('#tickets_timeline'),detail);
									break;
							}
						}
					}
					// Events
					$('#ticket_comments').find('button[data-action="reply"]').click(function(){
						var comment = {
							by:API.Contents.Auth.User.id,
							content:$('#ticket_comments_textarea').find('textarea').summernote('code'),
							relationship:'tickets',
							link_to:dataset.output.ticket.dom.id,
						};
						$('#ticket_comments_textarea').find('textarea').val('');
						$('#ticket_comments_textarea').find('textarea').summernote('code','');
						$('#ticket_comments_textarea').find('textarea').summernote('destroy');
						$('#ticket_comments_textarea').find('textarea').summernote({
							toolbar: [
								['font', ['fontname', 'fontsize']],
								['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
								['color', ['color']],
								['paragraph', ['style', 'ul', 'ol', 'paragraph', 'height']],
							],
							height: 250,
						});
						API.request('tickets','comment',{data:comment},function(result){
							var dataset = JSON.parse(result);
							if(dataset.success != undefined){
								API.Builder.Timeline.add.card(dataset.output.comment.dom,'comment','primary');
							}
						});
						$('#ticket_main_card_tabs a[href="#ticket"]').tab('show');
					});
					$('#ticket_notes').find('button[data-action="reply"]').click(function(){
						var note = {
							by:API.Contents.Auth.User.id,
							content:$('#ticket_notes_textarea').find('textarea').summernote('code'),
							relationship:'tickets',
							link_to:dataset.output.ticket.dom.id,
							status:$('#ticket_notes select[name="status"]').val(),
							priority:$('#ticket_notes select[name="priority"]').val(),
						};
						$('#ticket_notes_textarea').find('textarea').val('');
						$('#ticket_notes_textarea').find('textarea').summernote('code','');
						$('#ticket_notes_textarea').find('textarea').summernote('destroy');
						$('#ticket_notes_textarea').find('textarea').summernote({
							toolbar: [
								['font', ['fontname', 'fontsize']],
								['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
								['color', ['color']],
								['paragraph', ['style', 'ul', 'ol', 'paragraph', 'height']],
							],
							height: 250,
						});
						if((note.content != "")&&(note.content != "<p><br></p>")&&(note.content != "<p></p>")&&(note.content != "<br>")){
							API.request('tickets','note',{data:note},function(result){
								var dataset = JSON.parse(result);
								if(dataset.success != undefined){
									if(dataset.output.status != null){
										var status = {};
										for(const [key, value] of Object.entries(dataset.output.status)){ status[key] = value; }
										status.created = dataset.output.ticket.raw.modified;
										API.Builder.Timeline.add.status(status);
										$('#ticket_notes select[name="status"]').val(status.order);
										$('td[data-plugin="tickets"][data-key="status"]').html('<span class="badge bg-'+API.Contents.Statuses.tickets[status.order].color+'"><i class="'+API.Contents.Statuses.tickets[status.order].icon+' mr-1" aria-hidden="true"></i>'+API.Contents.Language[API.Contents.Statuses.tickets[status.order].name]+'</span>');
									}
									if(dataset.output.priority != null){
										var priority = {};
										for(const [key, value] of Object.entries(dataset.output.priority)){ priority[key] = value; }
										priority.created = dataset.output.ticket.raw.modified;
										API.Builder.Timeline.add.priority(priority);
										$('#ticket_notes select[name="priority"]').val(priority.order);
										$('td[data-plugin="tickets"][data-key="priority"]').html('<span class="badge bg-'+API.Contents.Priorities.tickets[priority.order].color+'"><i class="'+API.Contents.Priorities.tickets[priority.order].icon+' mr-1" aria-hidden="true"></i>'+API.Contents.Language[API.Contents.Priorities.tickets[priority.order].name]+'</span>');
									}
									API.Builder.Timeline.add.card(dataset.output.note.dom,'sticky-note','warning',function(item){
										item.find('.timeline-footer').remove();
									});
								}
							});
							$('#ticket_main_card_tabs a[href="#ticket"]').tab('show');
						} else { alert('Note is empty'); }
					});
				}
			});
		},
	},
	extend:{},
}

API.Plugins.tickets.init();
