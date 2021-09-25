API.Plugins.containers = {
	element:{
		table:{
			index:{},
		},
	},
	forms:{
		create:{
			0:"container_num",
			1:"container_size",
			2:"client",
		},
		update:{
			0:"container_num",
			1:"container_size",
			2:"client",
		},
	},
	init:function(){
		API.GUI.Sidebar.Nav.add('Containers', 'main_navigation');
	},
	load:{
		index:function(){
			API.Builder.card($('#pagecontent'),{ title: 'Containers', icon: 'containers'}, function(card){
				API.request('containers','read',{
					data:{options:{ link_to:'ContainersIndex',plugin:'containers',view:'index' }},
				},function(result) {
					var dataset = JSON.parse(result);
					if(dataset.success != undefined){
						for(const [key, value] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','dom','containers',value.id],value); }
						for(const [key, value] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','containers',value.id],value); }
						API.Builder.table(card.children('.card-body'), dataset.output.results, {
							headers:dataset.output.headers,
							id:'ContainersIndex',
							modal:true,
							key:'container_num',
							clickable:{ enable:true, view:'details'},
							set:{status:1,active:"true"},
							controls:{ toolbar:true},
							import:{ key:'id', },
						},function(response){
							API.Plugins.containers.element.table.index = response.table;
						});
					}
				});
			});
		},
		details:function(){
			var url = new URL(window.location.href);
			var id = url.searchParams.get("id"), values = '', main = $('#containers_main_card'), timeline = $('#containers_timeline'),details = $('#container_details').find('table');
			if($('span[data-plugin="containers"][data-key="id"]').parent('.modal-body').length > 0){
				var modal = $('span[data-plugin="containers"][data-key="id"]').parent('.modal-body').parent().parent().parent();
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
						API.request(url.searchParams.get("p"),'unsubscribe',{data:{id:dataset.output.container.raw.id}},function(answer){
							var subscription = JSON.parse(answer);
							if(subscription.success != undefined){
								main.find('.card-header').find('button[data-action="unsubscribe"]').hide();
								main.find('.card-header').find('button[data-action="subscribe"]').show();
								$('#containers_timeline').find('[data-type=user][data-id="'+API.Contents.Auth.User.id+'"]').remove();
							}
						});
					});
					main.find('.card-header').find('button[data-action="subscribe"]').click(function(){
						API.request(url.searchParams.get("p"),'subscribe',{data:{id:dataset.output.container.raw.id}},function(answer){
							var subscription = JSON.parse(answer);
							if(subscription.success != undefined){
								main.find('.card-header').find('button[data-action="subscribe"]').hide();
								main.find('.card-header').find('button[data-action="unsubscribe"]').show();
								var sub = {
									id:API.Contents.Auth.User.id,
									created:subscription.output.relationship.created,
									email:API.Contents.Auth.User.email,
								};
								API.Builder.Timeline.add.subscription($('#containers_timeline'),sub,'user','lightblue');
							}
						});
					});
					// Container
					API.GUI.insert(dataset.output.container.dom);
					$('#containers_created').find('time').attr('datetime',$('[data-plugin="containers"][data-key="created"]').first().text().replace(/ /g, "T"));
					$('#containers_created').find('time').html($('[data-plugin="containers"][data-key="created"]').first().text());
					$('#containers_created').find('time').timeago();
					main.find('textarea').summernote({
						toolbar: [
							['font', ['fontname', 'fontsize']],
							['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
							['color', ['color']],
							['paragraph', ['style', 'ul', 'ol', 'paragraph', 'height']],
						],
						height: 250,
					});
					// Charges
					if(API.Auth.validate('custom', 'containers_charges', 1)){
						details.find('[data-plugin="containers"][data-key="charge_to_shipper"]').parents('tr').show();
						details.find('[data-plugin="containers"][data-key="charge_to_other"]').parents('tr').show();
					} else {
						details.find('[data-plugin="containers"][data-key="charge_to_shipper"]').parents('tr').remove();
						details.find('[data-plugin="containers"][data-key="charge_to_other"]').parents('tr').remove();
					}
					// Comments
					$('#containers_main_card_tabs .nav-item .nav-link[href="#containers_comments"]').parent().show();
					// Status
					for(const [statusOrder, statusInfo] of Object.entries(API.Contents.Statuses.containers)){
						$('#containers_notes select[name="status"]').append(new Option(API.Contents.Language[statusInfo.name], statusOrder));
					}
					$('#containers_notes select[name="status"]').val(dataset.output.container.dom.status);
					$('td[data-plugin="containers"][data-key="status"]').html('<span class="badge bg-'+API.Contents.Statuses.containers[dataset.output.container.dom.status].color+'"><i class="'+API.Contents.Statuses.containers[dataset.output.container.dom.status].icon+' mr-1" aria-hidden="true"></i>'+API.Contents.Language[API.Contents.Statuses.containers[dataset.output.container.dom.status].name]+'</span>');
					// Notes
					if((!API.Helper.isSet(API.Contents.Auth.Permissions,['custom','containers_notes']))||(API.Contents.Auth.Permissions.custom.containers_notes < 1)){
						$('#containers_main_card_tabs .nav-item .nav-link[href="#containers_notes"]').parent().remove();
						$('#containers_notes').remove();
					} else { $('#containers_main_card_tabs .nav-item .nav-link[href="#containers_notes"]').parent().show(); }
					// Editable Container
					if((API.Helper.isSet(API.Contents.Auth.Permissions,['plugin','containers']))&&(API.Contents.Auth.Permissions.plugin.containers > 2)){
						if((API.Helper.isSet(API.Contents.Auth.Permissions,['custom','editable_container']))&&(API.Contents.Auth.Permissions.custom.editable_container > 0)){
							for(const [key, value] of Object.entries(dataset.output.container.raw)){
								switch(key){
									case"charge_to_other":
									case"charge_to_shipper": if(!API.Auth.validate('custom', 'containers_charges', 1)){ break; }
									case"port":
									case"carrier":
									case"location":
									case"carrier":
									case"ETD":
									case"ETA_port":
									case"returned":
									case"pick_up_num":
									case"detention_date":
									case"bill_of_lading":
									case"vessel":
									case"storage_date":
									case"custom_clearance":
									case"last_free_day":
									case"delivery_appointment":
									case"sub_location":
										var item = details.find('[data-plugin="containers"][data-key="'+key+'"]');
										item.parents('tr').find('td').first().prepend('<button class="btn btn-sm" type="button"><i class="fas fa-edit"></i></button>');
										item.parents('tr').find('td').first().find('button').click(function(){
											var ctn = details.find('[data-plugin="containers"][data-key="'+key+'"]');
											ctn.html('');
											API.Builder.input(ctn, key, value, function(input){
												input.find('select').val(null).trigger('change');
												input.find('select').val(dataset.output.container.raw[key]).trigger('change');
												input.find('.input-group-prepend').remove();
												input.append('<div class="input-group-append"><button class="btn btn-success" type="button"><i class="fas fa-save"></i></button></div>');
												input.find('button').click(function(){
													var newValue = {id:dataset.output.container.dom.id};
													if(input.find('select').length > 0){ newValue[key] = input.find('select').select2('data')[0].element.value; }
													else { newValue[key] = input.find('input').val(); }
													API.request('containers','update',{data:newValue},function(result){
														if(result.charAt(0) == '{'){
															var newdataset = JSON.parse(result);
															if(typeof dataset.success !== 'undefined'){
																newValue[key] = newdataset.output.results[key];
																API.GUI.insert(newValue);
															} else {
																newValue[key] = dataset.output.container.dom[key];
																API.GUI.insert(newValue);
															}
														}
													});
												});
											});
										});
										break;
									default: break;
								}
							}
						}
					}
					// Creating Timeline
					// Relationships
					for(const [rid, relations] of Object.entries(dataset.output.relationships)){
						for(const [uid, relation] of Object.entries(relations)){
							if(API.Helper.isSet(dataset.output.details,[relation.relationship,'dom',relation.link_to])){
								var detail = {};
								for(const [key, value] of Object.entries(dataset.output.details[relation.relationship].dom[relation.link_to])){ detail[key] = value; }
								detail.created = relation.created;
								switch(relation.relationship){
									case"status":
									case"statuses":
										API.Builder.Timeline.add.status($('#containers_timeline'),detail);
										break;
									case"priority":
									case"priorities":
										API.Builder.Timeline.add.priority($('#containers_timeline'),detail);
										break;
									case"contacts":
										detail.email = dataset.output.details[relation.relationship].dom[relation.link_to].email;
										API.Builder.Timeline.add.subscription($('#containers_timeline'),detail,'address-card');
										break;
									case"users":
										detail.email = dataset.output.details[relation.relationship].dom[relation.link_to].email;
										API.Builder.Timeline.add.subscription($('#containers_timeline'),detail,'user','lightblue');
										break;
									case"clients":
										API.Builder.Timeline.add.client($('#containers_timeline'),detail);
										break;
									case"comments":
										API.Builder.Timeline.add.card($('#containers_timeline'),detail,'comment','primary');
										break;
									case"notes":
										if((API.Helper.isSet(API.Contents.Auth.Permissions,['custom','containers_notes']))&&(API.Contents.Auth.Permissions.custom.containers_notes > 0)){
											API.Builder.Timeline.add.card($('#containers_timeline'),detail,'sticky-note','warning',function(item){
												item.find('.timeline-footer').remove();
											});
										}
										break;
									default:
										API.Builder.Timeline.add.card($('#containers_timeline'),detail);
										break;
								}
							}
						}
					}
					// Events
					$('#containers_comments').find('button[data-action="reply"]').click(function(){
						var comment = {
							from:API.Contents.Auth.User.id,
							type:'users',
							content:$('#containers_comments_textarea').find('textarea').summernote('code'),
							relationship:'containers',
							link_to:dataset.output.container.dom.id,
						};
						$('#containers_comments_textarea').find('textarea').val('');
						$('#containers_comments_textarea').find('textarea').summernote('code','');
						$('#containers_comments_textarea').find('textarea').summernote('destroy');
						$('#containers_comments_textarea').find('textarea').summernote({
							toolbar: [
								['font', ['fontname', 'fontsize']],
								['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
								['color', ['color']],
								['paragraph', ['style', 'ul', 'ol', 'paragraph', 'height']],
							],
							height: 250,
						});
						API.request('containers','comment',{data:comment},function(result){
							var dataset = JSON.parse(result);
							if(dataset.success != undefined){
								API.Builder.Timeline.add.card($('#containers_timeline'),dataset.output.comment.dom,'comment','primary');
							}
						});
						$('#containers_main_card_tabs a[href="#containers"]').tab('show');
					});
					$('#containers_notes').find('button[data-action="reply"]').click(function(){
						var note = {
							by:API.Contents.Auth.User.id,
							content:$('#containers_notes_textarea').find('textarea').summernote('code'),
							relationship:'containers',
							link_to:dataset.output.container.dom.id,
							status:$('#containers_notes select[name="status"]').val(),
						};
						$('#containers_notes_textarea').find('textarea').val('');
						$('#containers_notes_textarea').find('textarea').summernote('code','');
						$('#containers_notes_textarea').find('textarea').summernote('destroy');
						$('#containers_notes_textarea').find('textarea').summernote({
							toolbar: [
								['font', ['fontname', 'fontsize']],
								['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
								['color', ['color']],
								['paragraph', ['style', 'ul', 'ol', 'paragraph', 'height']],
							],
							height: 250,
						});
						if((note.content != "")&&(note.content != "<p><br></p>")&&(note.content != "<p></p>")&&(note.content != "<br>")){
							API.request('containers','note',{data:note},function(result){
								var dataset = JSON.parse(result);
								if(dataset.success != undefined){
									if(dataset.output.status != null){
										var status = {};
										for(const [key, value] of Object.entries(dataset.output.status)){ status[key] = value; }
										status.created = dataset.output.container.raw.modified;
										API.Builder.Timeline.add.status(status);
										$('#containers_notes select[name="status"]').val(status.order);
										$('td[data-plugin="containers"][data-key="status"]').html('<span class="badge bg-'+API.Contents.Statuses.containers[status.order].color+'"><i class="'+API.Contents.Statuses.containers[status.order].icon+' mr-1" aria-hidden="true"></i>'+API.Contents.Language[API.Contents.Statuses.containers[status.order].name]+'</span>');
									}
									API.Builder.Timeline.add.card(dataset.output.note.dom,'sticky-note','warning',function(item){
										item.find('.timeline-footer').remove();
									});
								}
							});
							$('#containers_main_card_tabs a[href="#containers"]').tab('show');
						} else { alert('Note is empty'); }
					});
				}
			});
		},
	},
	extend:{},
}

API.Plugins.containers.init();
