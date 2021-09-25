API.Plugins.organizations = {
	element:{
		table:{
			index:{},
		},
	},
	forms:{
		create:{
			0:"name",
			contact:{
			  0:"first_name",
			  1:"middle_name",
			  2:"last_name",
			  3:"job_title",
			},
			company_information:{
				0:"address",
				1:"city",
				2:"zipcode",
				3:"state",
				4:"country",
				5:"phone",
				6:"toll_free",
				7:"fax",
				8:"email",
				9:"website",
			},
			extra:{
				0:"tags",
			},
		},
		update:{
			0:"name",
			1:"business_num",
			company_information:{
				0:"address",
				1:"city",
				2:"zipcode",
				3:"state",
				4:"country",
				5:"phone",
				6:"toll_free",
				7:"fax",
				8:"email",
				9:"website",
			},
		},
	},
	init:function(){
		API.GUI.Sidebar.Nav.add('Organizations', 'main_navigation');
	},
	load:{
		index:function(){
			API.Builder.card($('#pagecontent'),{ title: 'Organizations', icon: 'organizations'}, function(card){
				API.request('organizations','read',{
					data:{options:{ link_to:'OrganizationsIndex',plugin:'organizations',view:'index' }},
				},function(result) {
					var dataset = JSON.parse(result);
					if(dataset.success != undefined){
						for(var [key, value] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','dom','organizations',value.id],value); }
						for(var [key, value] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','organizations',value.id],value); }
						API.Builder.table(card.children('.card-body'), dataset.output.results, {
							headers:dataset.output.headers,
							id:'OrganizationsIndex',
							modal:true,
							key:'name',
							clickable:{ enable:true, view:'details'},
							set:{status:1,active:"true"},
							controls:{ toolbar:true},
							import:{ key:'name', },
							load:false,
						},function(response){
							API.Plugins.organizations.element.table.index = response.table;
						});
					}
				});
			});
		},
		details:function(){
			var container = $('div[data-plugin="organizations"][data-id]').last();
			var url = new URL(window.location.href);
			var id = url.searchParams.get("id"), values = '', main = container.find('#organizations_main_card'), timeline = container.find('#organizations_timeline'),details = container.find('#organizations_details').find('table');
			if(container.parent('.modal-body').length > 0){
				var thisModal = container.parent('.modal-body').parent().parent().parent();
			}
			API.request(url.searchParams.get("p"),'get',{data:{id:id,key:'name'}},function(result){
				var dataset = JSON.parse(result);
				if(dataset.success != undefined){
					container.attr('data-id',dataset.output.this.raw.id);
					// GUI
					// Subscribe BTN
					// Hide Bell BTN
					if(API.Helper.isSet(dataset.output.details,['users','raw',API.Contents.Auth.User.id])){
						main.find('.card-header').find('button[data-action="unsubscribe"]').show();
					} else { main.find('.card-header').find('button[data-action="subscribe"]').show(); }
					// Events
					main.find('.card-header').find('button[data-action="unsubscribe"]').click(function(){
						API.request(url.searchParams.get("p"),'unsubscribe',{data:{id:dataset.output.this.raw.id}},function(answer){
							var subscription = JSON.parse(answer);
							if(subscription.success != undefined){
								main.find('.card-header').find('button[data-action="unsubscribe"]').hide();
								main.find('.card-header').find('button[data-action="subscribe"]').show();
								container.find('#organizations_timeline').find('[data-type=user][data-id="'+API.Contents.Auth.User.id+'"]').remove();
							}
						});
					});
					main.find('.card-header').find('button[data-action="subscribe"]').click(function(){
						API.request(url.searchParams.get("p"),'subscribe',{data:{id:dataset.output.this.raw.id}},function(answer){
							var subscription = JSON.parse(answer);
							if(subscription.success != undefined){
								main.find('.card-header').find('button[data-action="subscribe"]').hide();
								main.find('.card-header').find('button[data-action="unsubscribe"]').show();
								var sub = {
									id:API.Contents.Auth.User.id,
									created:subscription.output.relationship.created,
									email:API.Contents.Auth.User.email,
								};
								API.Builder.Timeline.add.subscription(container.find('#organizations_timeline'),sub,'user','lightblue');
							}
						});
					});
					// Active Status
					if(dataset.output.this.raw.isActive != 'true'){
						container.find('#organizations_details').prepend('<div class="ribbon-wrapper ribbon-xl"><div class="ribbon bg-danger text-xl">Inactive</div></div>');
					}
					// Organization
					API.GUI.insert(dataset.output.this.dom);
					container.find('#organizations_created').find('time').attr('datetime',dataset.output.this.raw.created.replace(/ /g, "T"));
					container.find('#organizations_created').find('time').html(dataset.output.this.raw.created);
					container.find('#organizations_created').find('time').timeago();
					main.find('textarea').summernote({
						toolbar: [
							['font', ['fontname', 'fontsize']],
							['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
							['color', ['color']],
							['paragraph', ['style', 'ul', 'ol', 'paragraph', 'height']],
						],
						height: 250,
					});
					// Clear Organization
					if(API.Auth.validate('custom', 'organizations_clear', 1)){
						container.find('#organizations_details').find('table').find('thead').show();
						container.find('#organizations_details').find('table').find('thead').find('.btn-group').prepend('<button class="btn btn-danger" data-action="clear"><i class="fas fa-snowplow mr-1"></i>Clear</button>');
						container.find('#organizations_details').find('table').find('thead').find('button[data-action="clear"]').off().click(function(){
							API.request('organizations','clear',{ data:dataset.output.this.raw });
							if(typeof modal !== 'undefined'){ modal.modal('hide'); }
						});
					}
					// Settings
					if(API.Auth.validate('custom', 'organizations_settings', 1)){
						container.find('#organizations_main_card_tabs .nav-item .nav-link[href="#organizations_settings"]').parent().show();
						for(var [key, value] of Object.entries(dataset.output.this.raw)){
							if(key.startsWith("is")){
								var setHTML = '';
								setHTML += '<div class="col-md-6 col-sm-12 my-1">';
									setHTML += '<div class="input-group">';
										setHTML += '<div class="input-group-prepend"><span class="input-group-text"><i class="fas fa-toggle-off mr-1"></i>'+API.Contents.Language[key]+'</span></div>';
										setHTML += '<input type="text" class="form-control switch-spacer" disabled>';
										setHTML += '<div class="input-group-append">';
											setHTML += '<div class="input-group-text p-1">';
												if((value == "yes")||(value == "true")){
													setHTML += '<input type="checkbox" data-key="'+key+'" title="'+API.Contents.Language[key]+'" checked>';
												} else {
													setHTML += '<input type="checkbox" data-key="'+key+'" title="'+API.Contents.Language[key]+'">';
												}
											setHTML += '</div>';
										setHTML += '</div>';
									setHTML += '</div>';
								setHTML += '</div>';
								container.find('#organizations_settings').find('div.row.togglers').append(setHTML);
							}
						}
						container.find('#organizations_main_card_tabs .nav-item .nav-link[href="#organizations_settings"]').one("click",function(){
							container.find('#organizations_settings').find('div.row').find('input[type="checkbox"]').each(function(){
								var bootSwitch = $(this);
								if((dataset.output.this.raw[bootSwitch.attr('data-key')] == "true")||(dataset.output.this.raw[bootSwitch.attr('data-key')] == "yes")){
									var currentState = true;
								} else { var currentState = false; }
								bootSwitch.bootstrapSwitch({
									onSwitchChange:function(e,state){
										if(state){ dataset.output.this.raw[bootSwitch.attr('data-key')] = "true"; }
										else { dataset.output.this.raw[bootSwitch.attr('data-key')] = "false"; }
										API.request('organizations','update',{ data:dataset.output.this.raw });
									}
								});
								setTimeout(function(){ bootSwitch.bootstrapSwitch('state',currentState); }, 500);
							});
						});
						var checkSSL = '',checkSTARTTLS = '';
						if(dataset.output.this.raw.setSMTPencryption == 'SSL'){ checkSSL = 'selected="selected"'; }
						if(dataset.output.this.raw.setSMTPencryption == 'STARTTLS'){ checkSTARTTLS = 'selected="selected"'; }
						if(dataset.output.this.raw.setSMTPhost == null){ dataset.output.this.raw.setSMTPhost = ''; }
						if(dataset.output.this.raw.setDomain == null){ dataset.output.this.raw.setDomain = ''; }
						var setHTML = '';
						setHTML += '<div class="col-12 my-1">';
							setHTML += '<div class="input-group">';
								setHTML += '<div class="input-group-prepend">';
									setHTML += '<span class="input-group-text"><i class="fas fa-globe"></i></span>';
								setHTML += '</div>';
								setHTML += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Domain']+'" name="setDomain" value="'+dataset.output.this.raw.setDomain+'">';
							setHTML += '</div>';
						setHTML += '</div>';
						setHTML += '<div class="col-12 my-1">';
							setHTML += '<div class="input-group">';
								setHTML += '<div class="input-group-prepend">';
									setHTML += '<span class="input-group-text"><i class="fas fa-server"></i></span>';
								setHTML += '</div>';
								setHTML += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Host']+'" name="setSMTPhost" value="'+dataset.output.this.raw.setSMTPhost+'">';
								setHTML += '<div class="input-group-prepend">';
									setHTML += '<span class="input-group-text"><i class="fas fa-key"></i></span>';
								setHTML += '</div>';
								setHTML += '<select name="setSMTPencryption" class="form-control">';
									setHTML += '<option value="SSL" '+checkSSL+'>'+API.Contents.Language['SSL']+'</option>';
									setHTML += '<option value="STARTTLS" '+checkSTARTTLS+'>'+API.Contents.Language['STARTTLS']+'</option>';
								setHTML += '</select>';
								setHTML += '<div class="input-group-prepend">';
									setHTML += '<span class="input-group-text"><i class="fas fa-ethernet"></i></span>';
								setHTML += '</div>';
								setHTML += '<input type="number" class="form-control" placeholder="'+API.Contents.Language['Port']+'" name="setSMTPport" value="'+dataset.output.this.raw.setSMTPport+'">';
							setHTML += '</div>';
						setHTML += '</div>';
						setHTML += '<div class="col-12 my-1">';
							setHTML += '<button type="button" class="btn btn-block btn-success">';
								setHTML += '<i class="fas fa-save mr-1"></i>'+API.Contents.Language['Save'];
							setHTML += '</button>';
						setHTML += '</div>';
						container.find('#organizations_settings').find('div.row.smtp').append(setHTML);
						container.find('#organizations_settings').find('div.row.smtp button').off().click(function(){
							container.find('#organizations_settings').find('div.row.smtp :input').each(function(){
								var input = $(this), value = input.val(), name = input.attr('name');
								if(typeof name !== 'undefined'){
									dataset.output.this.raw[name] = value;
									dataset.output.this.dom[name] = value;
								}
							});
							API.request('organizations','update',{data:dataset.output.this.raw},function(result){
								var data = JSON.parse(result);
								if(typeof data.success !== 'undefined'){}
							});
						});
					} else {
						container.find('#organizations_main_card_tabs .nav-item .nav-link[href="#organizations_settings"]').parent().remove();
						container.find('#organizations_settings').remove();
					}
					// Calls
					if(API.Auth.validate('custom', 'organizations_calls', 1)){
						if(API.Auth.validate('custom', 'organizations_calls_phone', 1)){ container.find('th[data-header="phone"]').show(); }
						if(!API.Helper.isSet(API.Contents.Auth.Options,['application','showInlineCallsControls','value']) && API.Contents.Settings.customization.showInlineCallsControls.value){
							container.find('th[data-header="action"]').show();
						}
						if(API.Helper.isSet(API.Contents.Auth.Options,['application','showInlineCallsControls','value']) && API.Contents.Auth.Options.application.showInlineCallsControls.value){
							container.find('th[data-header="action"]').show();
						}
						container.find('#organizations_main_card_tabs .nav-item .nav-link[href="#organizations_calls"]').parent().show();
						container.find('#organizations_main_card_tabs .nav-item .nav-link[href="#organizations_callbacks"]').parent().show();
						container.find('#organizations_details').find('table').find('thead').show();
						container.find('#organizations_details').find('table').find('thead').find('.btn-group').prepend('<button class="btn btn-success" data-action="call"><i class="fas fa-phone mr-1"></i>Call</button>');
						container.find('#organizations_details').find('table').find('thead').find('button[data-action="call"]').off().click(function(){
							var now = new Date();
							var newCall = {
								date:now,
								time:now,
								status:3,
								assigned_to:API.Contents.Auth.User.id,
								relationship:'organizations',
								link_to:dataset.output.this.raw.id,
							};
							API.request('calls','create',{data:newCall},function(result){
								var data = JSON.parse(result);
								if(typeof data.success !== 'undefined'){
									API.Plugins.calls.Widgets.toast({dom:data.output.results,raw:data.output.raw},dataset.output.this,dataset.output.details.issues);
									API.Plugins.organizations.GUI.calls.add(container,{dom:data.output.results,raw:data.output.raw},dataset.output.this,dataset.output.details.issues, true);
								}
							});
						});
						if(API.Helper.isSet(dataset.output.details,['calls','dom'])){
							for(var [callKey, call] of Object.entries(dataset.output.details.calls.dom)){
								if(dataset.output.details.calls.raw[callKey].assigned_to == API.Contents.Auth.User.id || API.Auth.validate('custom', 'organizations_calls_all', 1)){
									API.Plugins.organizations.GUI.calls.add(container,{dom:call,raw:dataset.output.details.calls.raw[call.id]},dataset.output.this,dataset.output.details.issues);
								}
							}
						}
						var callHTML = '';
						callHTML += '<div class="col-md-12">';
							callHTML += '<div class="input-group">';
								callHTML += '<input type="text" id="organizations_calls_search" class="form-control">';
								callHTML += '<div class="input-group-append pointer" data-action="clear"><span class="input-group-text"><i class="fas fa-times"></i></span></div>';
								callHTML += '<div class="input-group-append"><span class="input-group-text"><i class="icon icon-search mr-1"></i>'+API.Contents.Language['Search']+'</span></div>';
							callHTML += '</div>';
						callHTML += '</div>';
						container.find('#organizations_calls').find('div.row').first().prepend(callHTML);
						container.find('#organizations_calls').find('div[data-action="clear"]').off().click(function(){
							$(this).parent().find('input').val('');
							container.find('#organizations_calls').find('[data-csv]').show();
						});
						container.find('#organizations_calls').find('input#organizations_calls_search').on('input',function(){
							if($(this).val() != ''){
								container.find('#organizations_calls').find('[data-csv]').hide();
								container.find('#organizations_calls').find('[data-csv*="'+$(this).val().toLowerCase()+'"]').each(function(){ $(this).show(); });
							} else { container.find('#organizations_calls').find('[data-csv]').show(); }
						});
						var callHTML = '';
						callHTML += '<div class="col-md-12">';
							callHTML += '<div class="input-group">';
								callHTML += '<div class="btn-group mr-3">';
									callHTML += '<button data-action="create" class="btn btn-default"><i class="fas fa-plus-circle"></i></button>';
								callHTML += '</div>';
								callHTML += '<input type="text" id="organizations_callbacks_search" class="form-control">';
								callHTML += '<div class="input-group-append pointer" data-action="clear"><span class="input-group-text"><i class="fas fa-times"></i></span></div>';
								callHTML += '<div class="input-group-append"><span class="input-group-text"><i class="icon icon-search mr-1"></i>'+API.Contents.Language['Search']+'</span></div>';
							callHTML += '</div>';
						callHTML += '</div>';
						container.find('#organizations_callbacks').find('div.row').first().prepend(callHTML);
						container.find('#organizations_callbacks').find('div[data-action="clear"]').off().click(function(){
							$(this).parent().find('input').val('');
							container.find('#organizations_callbacks').find('[data-csv]').show();
						});
						container.find('#organizations_callbacks').find('div.row').first().find('[data-action="create"]').click(function(){
							API.Builder.modal($('body'), {
								title:'Create a callback',
								icon:'callback',
								zindex:'top',
								css:{ dialog: "modal-lg", header: "bg-success", body: "p-3"},
							}, function(modal){
								modal.on('hide.bs.modal',function(){ modal.remove(); });
								var dialog = modal.find('.modal-dialog');
								var header = modal.find('.modal-header');
								var body = modal.find('.modal-body');
								var footer = modal.find('.modal-footer');
								header.find('button[data-control="hide"]').remove();
								header.find('button[data-control="update"]').remove();
								body.html('<div class="row"></div>');
								API.Builder.input(body.find('div.row'), 'date', null,{plugin:'organizations'}, function(input){
									input.wrap('<div class="col-md-6"></div>');
								});
								API.Builder.input(body.find('div.row'), 'time', null,{plugin:'organizations'}, function(input){
									input.wrap('<div class="col-md-6"></div>');
								});
								if(API.Helper.isSet(dataset.output.details,['users','dom'])){
									var contacts = {};
									for(var [id, contact] of Object.entries(dataset.output.details.users.dom)){
										if(contact.isContact){
											contacts[id] = '';
											if(contact.first_name != ''){ contacts[id] += contact.first_name}
											if(contact.middle_name != ''){ if(contacts[id] != ''){contacts[id] += ' ';} contacts[id] += contact.middle_name}
											if(contact.last_name != ''){ if(contacts[id] != ''){contacts[id] += ' ';} contacts[id] += contact.last_name}
											if(contact.job_title != ''){ if(contacts[id] != ''){contacts[id] += ' - ';} contacts[id] += contact.job_title}
											if(contact.email != ''){ if(contacts[id] != ''){contacts[id] += ' - ';} contacts[id] += contact.email}
										}
									}
									if(!jQuery.isEmptyObject(contacts)){
										API.Builder.input(body.find('div.row'), 'contact', null,{plugin:'organizations',list:{contacts:contacts}}, function(input){
											input.wrap('<div class="col-md-12 mt-3"></div>');
										});
									}
								}
								footer.append('<button class="btn btn-success" data-action="create"><i class="fas fa-phone-square mr-1"></i>Create</button>');
								footer.find('button[data-action="create"]').click(function(){
									var call = {
										date:body.find('input[data-key="date"]').val(),
										time:body.find('input.datetimepicker-input[data-key="time"]').val(),
										contact:body.find('select').select2('val'),
										status:1,
										assigned_to:API.Contents.Auth.User.id,
										relationship:'organizations',
										link_to:dataset.output.this.raw.id,
									};
									API.request('calls','create',{data:call},function(result){
										var data = JSON.parse(result);
										if(typeof data.success !== 'undefined'){
											API.Plugins.organizations.GUI.calls.add(container,{dom:data.output.results,raw:data.output.raw},dataset.output.this,dataset.output.details.issues,true);
										}
									});
									modal.modal('hide');
								});
								modal.modal('show');
							});
						});
						container.find('#organizations_callbacks').find('input#organizations_callbacks_search').on('input',function(){
							if($(this).val() != ''){
								container.find('#organizations_callbacks').find('[data-csv]').hide();
								container.find('#organizations_callbacks').find('[data-csv*="'+$(this).val().toLowerCase()+'"]').each(function(){ $(this).show(); });
							} else { container.find('#organizations_callbacks').find('[data-csv]').show(); }
						});
					} else {
						container.find('#organizations_main_card_tabs .nav-item .nav-link[href="#organizations_callbacks"]').parent().remove();
						container.find('#organizations_main_card_tabs .nav-item .nav-link[href="#organizations_calls"]').parent().remove();
						container.find('#organizations_callbacks').remove();
						container.find('#organizations_calls').remove();
					}
					// Contacts
					if(API.Auth.validate('custom', 'organizations_contacts', 1)){
						container.find('#organizations_main_card_tabs .nav-item .nav-link[href="#organizations_contacts"]').parent().show();
						var contactHTML = '';
						contactHTML += '<div class="col-sm-12 col-md-6">';
							contactHTML += '<div class="card pointer addContact">';
								contactHTML += '<div class="card-body py-4">';
									contactHTML += '<div class="text-center p-5">';
										contactHTML += '<i class="fas fa-plus-circle fa-10x mt-3 mb-2"></i>';
									contactHTML += '</div>';
								contactHTML += '</div>';
							contactHTML += '</div>';
						contactHTML += '</div>';
						container.find('#organizations_contacts').find('div.row').first().append(contactHTML);
						container.find('#organizations_contacts').find('div.row').first().find('.card.pointer.addContact').click(function(){
							var contact = {};
							for(var [key, value] of Object.entries(API.Contents.Settings.Structure.users)){ contact[key] = ''; }
							API.CRUD.create.show({ plugin:'contacts', keys:contact, set:{isActive:'true',isContact:'true',relationship:'organizations',link_to:dataset.output.this.raw.id} },function(created,contact){
								if(created){
									API.Helper.set(dataset.output.details,['users','raw',contact.raw.id],contact.raw);
									API.Helper.set(dataset.output.details,['users','dom',contact.dom.id],contact.dom);
									API.Plugins.organizations.GUI.contacts.add(container, dataset, contact, true);
								}
							});
						});
						var contactHTML = '';
						contactHTML += '<div class="col-md-12 mb-3">';
							contactHTML += '<div class="input-group">';
								contactHTML += '<input type="text" id="organizations_contacts_search" class="form-control">';
								contactHTML += '<div class="input-group-append pointer" data-action="clear"><span class="input-group-text"><i class="fas fa-times"></i></span></div>';
								contactHTML += '<div class="input-group-append"><span class="input-group-text"><i class="icon icon-search mr-1"></i>'+API.Contents.Language['Search']+'</span></div>';
							contactHTML += '</div>';
						contactHTML += '</div>';
						container.find('#organizations_contacts').find('div.row').first().prepend(contactHTML);
						container.find('#organizations_contacts').find('div[data-action="clear"]').off().click(function(){
							$(this).parent().find('input').val('');
							container.find('#organizations_contacts').find('[data-csv]').show();
						});
						container.find('#organizations_contacts').find('input#organizations_contacts_search').on('input',function(){
							if($(this).val() != ''){
								container.find('#organizations_contacts').find('[data-csv]').hide();
								container.find('#organizations_contacts').find('[data-csv*="'+$(this).val().toLowerCase()+'"]').each(function(){ $(this).show(); });
							} else { container.find('#organizations_contacts').find('[data-csv]').show(); }
						});
						API.Plugins.organizations.Events.contacts(container,container.find('#organizations_contacts'),dataset);
					} else {
						container.find('#organizations_main_card_tabs .nav-item .nav-link[href="#organizations_contacts"]').parent().remove();
						container.find('#organizations_contacts').remove();
					}
					// Employees
					if(API.Auth.validate('custom', 'organizations_employees', 1)){
						container.find('#organizations_main_card_tabs .nav-item .nav-link[href="#organizations_employees"]').parent().show();
						var contactHTML = '';
						contactHTML += '<div class="col-sm-12 col-md-6">';
							contactHTML += '<div class="card pointer addContact">';
								contactHTML += '<div class="card-body py-4">';
									contactHTML += '<div class="text-center p-5">';
										contactHTML += '<i class="fas fa-plus-circle fa-10x mt-3 mb-2"></i>';
									contactHTML += '</div>';
								contactHTML += '</div>';
							contactHTML += '</div>';
						contactHTML += '</div>';
						container.find('#organizations_employees').find('div.row').first().append(contactHTML);
						container.find('#organizations_employees').find('div.row').first().find('.card.pointer.addContact').click(function(){
							var contact = {};
							for(var [key, value] of Object.entries(API.Contents.Settings.Structure.users)){ contact[key] = ''; }
							API.CRUD.create.show({ plugin:'contacts', keys:contact, set:{isEmployee:'true',isContact:'true',isActive:'true',relationship:'organizations',link_to:dataset.output.this.raw.id} },function(created,contact){
								if(created){
									API.Helper.set(dataset.output.details,['users','raw',contact.raw.id],contact.raw);
									API.Helper.set(dataset.output.details,['users','dom',contact.dom.id],contact.dom);
									API.Plugins.organizations.GUI.contacts.add(container, dataset, {dom:contact.dom,raw:contact.raw}, true);
								}
							});
						});
						var contactHTML = '';
						contactHTML += '<div class="col-md-12 mb-3">';
							contactHTML += '<div class="input-group">';
								contactHTML += '<input type="text" id="organizations_employees_search" class="form-control">';
								contactHTML += '<div class="input-group-append pointer" data-action="clear"><span class="input-group-text"><i class="fas fa-times"></i></span></div>';
								contactHTML += '<div class="input-group-append"><span class="input-group-text"><i class="icon icon-search mr-1"></i>'+API.Contents.Language['Search']+'</span></div>';
							contactHTML += '</div>';
						contactHTML += '</div>';
						container.find('#organizations_employees').find('div.row').first().prepend(contactHTML);
						container.find('#organizations_employees').find('div[data-action="clear"]').off().click(function(){
							$(this).parent().find('input').val('');
							container.find('#organizations_employees').find('[data-csv]').show();
						});
						container.find('#organizations_employees').find('input#organizations_employees_search').on('input',function(){
							if($(this).val() != ''){
								container.find('#organizations_employees').find('[data-csv]').hide();
								container.find('#organizations_employees').find('[data-csv*="'+$(this).val().toLowerCase()+'"]').each(function(){ $(this).show(); });
							} else { container.find('#organizations_employees').find('[data-csv]').show(); }
						});
						API.Plugins.organizations.Events.contacts(container,container.find('#organizations_employees'),dataset);
					} else {
						container.find('#organizations_main_card_tabs .nav-item .nav-link[href="#organizations_employees"]').parent().remove();
						container.find('#organizations_employees').remove();
					}
					// Adding Contacts and Employees Cards
					if(API.Helper.isSet(dataset.output.details,['users','dom'])){
						for(var [contactKey, contact] of Object.entries(dataset.output.details.users.dom)){
							if(dataset.output.details.users.raw[contact.id].organization == dataset.output.this.raw.id){
								API.Plugins.organizations.GUI.contacts.add(container, dataset, {dom:contact,raw:dataset.output.details.users.raw[contact.id]});
							}
						}
					}
					// Subsidiaries
					if(API.Auth.validate('custom', 'organizations_organizations', 1)){
						container.find('td[data-plugin="organizations"][data-key="subsidiaries"]').parent('tr').show();
						if(API.Helper.isSet(dataset.output.details,['organizations'])){
							for(var [subsKey, subsDetails] of Object.entries(dataset.output.details.organizations.dom)){
								var subsHTML = '';
								subsHTML += '<div class="btn-group m-1" data-id="'+subsDetails.id+'">';
									subsHTML += '<button type="button" class="btn btn-xs btn-primary" data-id="'+subsDetails.id+'" data-action="details"><i class="fas fa-building mr-1"></i>'+subsDetails.name+'</button>';
									if(API.Auth.validate('custom', 'organizations_organizations', 4)){
										subsHTML += '<button type="button" class="btn btn-xs btn-danger" data-id="'+subsDetails.id+'" data-action="unlink"><i class="fas fa-unlink"></i></button>';
									}
								subsHTML += '</div>';
								container.find('td[data-plugin="organizations"][data-key="subsidiaries"]').append(subsHTML);
							}
							API.Plugins.organizations.Events.subsidiaries(container,dataset);
						}
						if(API.Auth.validate('custom', 'organizations_organizations', 2)){
							container.find('td[data-plugin="organizations"][data-key="subsidiaries"]').append('<button type="button" class="btn btn-xs btn-success mx-1" data-action="link"><i class="fas fa-link"></i></button>');
						} else {
							container.find('td[data-plugin="organizations"][data-key="subsidiaries"]').append('<button type="button" class="btn btn-xs btn-success mx-1" data-action="link" style="display:none;"><i class="fas fa-link"></i></button>');
						}
						container.find('td[data-plugin="organizations"][data-key="subsidiaries"]').find('button[data-action="link"]').click(function(){
							API.Builder.modal($('body'), {
								title:'Link a subsidiary',
								icon:'subsidiaries',
								zindex:'top',
								css:{ header: "bg-gray", body: "p-3"},
							}, function(modal){
								modal.on('hide.bs.modal',function(){ modal.remove(); });
								var dialog = modal.find('.modal-dialog');
								var header = modal.find('.modal-header');
								var body = modal.find('.modal-body');
								var footer = modal.find('.modal-footer');
								header.find('button[data-control="hide"]').remove();
								header.find('button[data-control="update"]').remove();
								API.Builder.input(body, 'organization', null,{plugin:'organizations'}, function(input){});
								footer.append('<button class="btn btn-secondary" data-action="link"><i class="fas fa-link mr-1"></i>Link</button>');
								footer.find('button[data-action="link"]').click(function(){
									if((typeof body.find('select').select2('val') !== "undefined")&&(body.find('select').select2('val') != '')){
										API.request('organizations','link',{data:{id:dataset.output.this.dom.id,relationship:{relationship:'organizations',link_to:body.find('select').select2('val')}}},function(result){
											var data = JSON.parse(result);
											if(data.success != undefined){
												API.Helper.set(API.Contents,['data','dom','organizations',data.output.dom.id],data.output.dom);
												API.Helper.set(API.Contents,['data','raw','organizations',data.output.raw.id],data.output.raw);
												API.Helper.set(dataset.output.details,['organizations','dom',data.output.dom.id],data.output.dom);
												API.Helper.set(dataset.output.details,['organizations','raw',data.output.raw.id],data.output.raw);
												var subsHTML = '';
												subsHTML += '<div class="btn-group m-1" data-id="'+data.output.dom.id+'">';
													subsHTML += '<button type="button" class="btn btn-xs btn-primary" data-id="'+data.output.dom.id+'" data-action="details"><i class="fas fa-building mr-1"></i>'+data.output.dom.name+'</button>';
													if(API.Auth.validate('custom', 'organizations_organizations', 4)){
														subsHTML += '<button type="button" class="btn btn-xs btn-danger" data-id="'+data.output.dom.id+'" data-action="unlink"><i class="fas fa-unlink"></i></button>';
													}
												subsHTML += '</div>';
												container.find('td[data-plugin="organizations"][data-key="subsidiaries"]').find('button[data-action="link"]').before(subsHTML);
												API.Plugins.organizations.Events.subsidiaries(container,dataset);
												var detail = {};
												for(var [key, value] of Object.entries(dataset.output.details.organizations.dom[data.output.dom.id])){ detail[key] = value; }
												detail.owner = data.output.timeline.owner; detail.created = data.output.timeline.created;
												API.Builder.Timeline.add.client(container.find('#organizations_timeline'),detail);
											}
										});
										modal.modal('hide');
									} else {
										body.find('.input-group').addClass('is-invalid');
										alert('No organization were selected!');
									}
								});
								modal.modal('show');
							});
						});
					} else { container.find('td[data-plugin="organizations"][data-key="subsidiaries"]').parent('tr').remove(); }
					// Issues
					if(API.Auth.validate('custom', 'organizations_issues', 1)){
						var issues = {};
						for(var [rid, relations] of Object.entries(dataset.output.relationships)){
							for(var [uid, relation] of Object.entries(relations)){
								if(relation.relationship == 'issues'){ issues[relation.link_to] = relation.statuses; }
							}
						}
						container.find('td[data-plugin="organizations"][data-key="issues"]').parent('tr').show();
						if(API.Helper.isSet(dataset.output.details,['issues'])){
							for(var [issueKey, issueDetails] of Object.entries(dataset.output.details.issues.dom)){
								if(issueDetails.name == null){ issueDetails.name = ''; }
								var issueHTML = '';
								issueHTML += '<div class="btn-group m-1" data-id="'+issueDetails.id+'">';
									issueHTML += '<button type="button" data-id="'+issueDetails.id+'" class="btn btn-xs bg-'+dataset.output.details.statuses.raw[issues[issueDetails.id]].color+'" data-action="details"><i class="fas fa-gavel mr-1"></i>'+issueDetails.id+' - '+issueDetails.name+' - '+API.Contents.Language[dataset.output.details.statuses.raw[issues[issueDetails.id]].name]+'</button>';
									if(API.Auth.validate('custom', 'organizations_issues', 4)){
										issueHTML += '<button type="button" data-id="'+issueDetails.id+'" class="btn btn-xs btn-danger" data-action="unlink"><i class="fas fa-unlink"></i></button>';
									}
								issueHTML += '</div>';
								container.find('td[data-plugin="organizations"][data-key="issues"]').append(issueHTML);
							}
							API.Plugins.organizations.Events.issues(container,dataset);
						}
						if(API.Auth.validate('custom', 'organizations_issues', 2)){
							container.find('td[data-plugin="organizations"][data-key="issues"]').append('<button type="button" class="btn btn-xs btn-success mx-1" data-action="link"><i class="fas fa-link"></i></button>');
						} else {
							container.find('td[data-plugin="organizations"][data-key="issues"]').append('<button type="button" class="btn btn-xs btn-success mx-1" data-action="link" style="display:none;"><i class="fas fa-link"></i></button>');
						}
						container.find('td[data-plugin="organizations"][data-key="issues"]').find('button[data-action="link"]').click(function(){
							API.Builder.modal($('body'), {
								title:'Link an issue',
								icon:'issues',
								zindex:'top',
								css:{ header: "bg-gray", body: "p-3"},
							}, function(modal){
								modal.on('hide.bs.modal',function(){ modal.remove(); });
								var dialog = modal.find('.modal-dialog');
								var header = modal.find('.modal-header');
								var body = modal.find('.modal-body');
								var footer = modal.find('.modal-footer');
								header.find('button[data-control="hide"]').remove();
								header.find('button[data-control="update"]').remove();
								API.Builder.input(body, 'issue', null,{plugin:'organizations'}, function(input){});
								footer.append('<button class="btn btn-secondary" data-action="link"><i class="fas fa-link mr-1"></i>Link</button>');
								footer.find('button[data-action="link"]').click(function(){
									API.request('organizations','link',{data:{id:dataset.output.this.dom.id,relationship:{relationship:'issues',link_to:body.find('select').select2('val')}}},function(result){
										var data = JSON.parse(result);
										if(data.success != undefined){
											API.Helper.set(API.Contents,['data','dom','issues',data.output.dom.id],data.output.dom);
											API.Helper.set(API.Contents,['data','raw','issues',data.output.raw.id],data.output.raw);
											API.Helper.set(dataset.output.details,['issues','dom',data.output.dom.id],data.output.dom);
											API.Helper.set(dataset.output.details,['issues','raw',data.output.raw.id],data.output.raw);
											if(data.output.dom.name == null){ data.output.dom.name = ''; }
											var issueHTML = '';
											issueHTML += '<div class="btn-group m-1" data-id="'+data.output.dom.id+'">';
												issueHTML += '<button type="button" class="btn btn-xs bg-'+dataset.output.details.statuses.raw[data.output.timeline.statuses].color+'" data-id="'+data.output.dom.id+'" data-action="details"><i class="fas fa-gavel mr-1"></i>'+data.output.dom.id+' - '+data.output.dom.name+' - '+API.Contents.Language[dataset.output.details.statuses.raw[data.output.timeline.statuses].name]+'</button>';
												if(API.Auth.validate('custom', 'organizations_issues', 4)){
													issueHTML += '<button type="button" class="btn btn-xs btn-danger" data-id="'+data.output.dom.id+'" data-action="unlink"><i class="fas fa-unlink"></i></button>';
												}
											issueHTML += '</div>';
											container.find('td[data-plugin="organizations"][data-key="issues"]').find('button[data-action="link"]').before(issueHTML);
											API.Plugins.organizations.Events.issues(container,dataset);
											var detail = {};
											for(var [key, value] of Object.entries(dataset.output.details.issues.dom[data.output.dom.id])){ detail[key] = value; }
											if(API.Helper.isSet(dataset.output.details.statuses.raw,[data.output.timeline.statuses,'order'])){
												detail.status = dataset.output.details.statuses.raw[data.output.timeline.statuses].order;
												detail.owner = data.output.timeline.owner; detail.created = data.output.timeline.created;
												API.Builder.Timeline.add.issue(container.find('#organizations_timeline'),detail);
											}
										}
									});
									modal.modal('hide');
								});
								modal.modal('show');
							});
						});
					} else { container.find('td[data-plugin="organizations"][data-key="issues"]').parent('tr').remove(); }
					// Services
					if(API.Auth.validate('custom', 'organizations_services', 1)){
						container.find('td[data-plugin="organizations"][data-key="services"]').parent('tr').show();
						if(API.Helper.isSet(dataset.output.details,['services'])){
							for(var [serviceKey, serviceDetails] of Object.entries(dataset.output.details.services.dom)){
								var serviceHTML = '';
								serviceHTML += '<div class="btn-group m-1" data-id="'+serviceDetails.id+'">';
									serviceHTML += '<button type="button" data-id="'+serviceDetails.id+'" data-action="details" class="btn btn-xs btn-primary"><i class="fas fa-hand-holding-usd mr-1"></i>'+serviceDetails.name+'</button>';
									if(API.Auth.validate('custom', 'organizations_services', 4)){
										serviceHTML += '<button type="button" data-id="'+serviceDetails.id+'" data-action="unlink" class="btn btn-xs btn-danger"><i class="fas fa-unlink"></i></button>';
									}
								serviceHTML += '</div>';
								container.find('td[data-plugin="organizations"][data-key="services"]').append(serviceHTML);
							}
							API.Plugins.organizations.Events.services(container,dataset);
						}
						if(API.Auth.validate('custom', 'organizations_services', 2)){
							container.find('td[data-plugin="organizations"][data-key="services"]').append('<button type="button" data-action="link" class="btn btn-xs btn-success mx-1"><i class="fas fa-link"></i></button>');
						} else {
							container.find('td[data-plugin="organizations"][data-key="services"]').append('<button type="button" data-action="link" class="btn btn-xs btn-success mx-1" style="display:none;"><i class="fas fa-link"></i></button>');
						}
						container.find('td[data-plugin="organizations"][data-key="services"]').find('button[data-action="link"]').click(function(){
							API.Builder.modal($('body'), {
								title:'Link a service',
								icon:'services',
								zindex:'top',
								css:{ header: "bg-gray", body: "p-3"},
							}, function(modal){
								modal.on('hide.bs.modal',function(){ modal.remove(); });
								var dialog = modal.find('.modal-dialog');
								var header = modal.find('.modal-header');
								var body = modal.find('.modal-body');
								var footer = modal.find('.modal-footer');
								header.find('button[data-control="hide"]').remove();
								header.find('button[data-control="update"]').remove();
								API.Builder.input(body, 'service', null,{plugin:'organizations'}, function(input){});
								footer.append('<button class="btn btn-secondary" data-action="link"><i class="fas fa-link mr-1"></i>Link</button>');
								footer.find('button[data-action="link"]').click(function(){
									API.request('organizations','link',{data:{id:dataset.output.this.dom.id,relationship:{relationship:'services',link_to:body.find('select').select2('val')}}},function(result){
										var data = JSON.parse(result);
										if(data.success != undefined){
											API.Helper.set(API.Contents,['data','dom','services',data.output.dom.id],data.output.dom);
											API.Helper.set(API.Contents,['data','raw','services',data.output.raw.id],data.output.raw);
											API.Helper.set(dataset.output.details,['services','dom',data.output.dom.id],data.output.dom);
											API.Helper.set(dataset.output.details,['services','raw',data.output.raw.id],data.output.raw);
											var subsHTML = '';
											subsHTML += '<div class="btn-group m-1" data-id="'+data.output.dom.id+'">';
												subsHTML += '<button type="button" class="btn btn-xs btn-primary" data-id="'+data.output.dom.id+'" data-action="details"><i class="fas fa-hand-holding-usd mr-1"></i>'+data.output.dom.name+'</button>';
												subsHTML += '<button type="button" class="btn btn-xs btn-danger" data-id="'+data.output.dom.id+'" data-action="unlink"><i class="fas fa-unlink"></i></button>';
											subsHTML += '</div>';
											container.find('td[data-plugin="organizations"][data-key="services"]').find('button[data-action="link"]').before(subsHTML);
											API.Plugins.organizations.Events.services(container,dataset);
											var detail = {};
											for(var [key, value] of Object.entries(dataset.output.details.services.dom[data.output.dom.id])){ detail[key] = value; }
											detail.owner = data.output.timeline.owner; detail.created = data.output.timeline.created;
											API.Builder.Timeline.add.service(container.find('#organizations_timeline'),detail);
										}
									});
									modal.modal('hide');
								});
								modal.modal('show');
							});
						});
					} else { container.find('td[data-plugin="organizations"][data-key="services"]').parent('tr').remove(); }
					// Tags
					if(API.Auth.validate('custom', 'organizations_tags', 1)){
						container.find('td[data-plugin="organizations"][data-key="tags"]').parent('tr').show();
						if(API.Helper.isSet(dataset.output.this.dom,['tags'])){
							container.find('td[data-plugin="organizations"][data-key="tags"]').html('');
							if(dataset.output.this.dom.tags != ''){
								for(var [tagKey, tagDetails] of Object.entries(API.Helper.trim(dataset.output.this.dom.tags,';').split(';'))){
									var tagHTML = '';
									tagHTML += '<div class="btn-group m-1" data-id="'+tagDetails+'">';
										tagHTML += '<button type="button" data-id="'+tagDetails+'" class="btn btn-xs btn-primary" data-action="details"><i class="fas fa-tag mr-1"></i>'+tagDetails+'</button>';
										if(API.Auth.validate('custom', 'organizations_tags', 4)){
											tagHTML += '<button type="button" data-id="'+tagDetails+'" class="btn btn-xs btn-danger" data-action="untag"><i class="fas fa-backspace"></i></button>';
										}
									tagHTML += '</div>';
									container.find('td[data-plugin="organizations"][data-key="tags"]').append(tagHTML);
								}
							}
						}
						if(API.Auth.validate('custom', 'organizations_tags', 2)){
							container.find('td[data-plugin="organizations"][data-key="tags"]').append('<button type="button" class="btn btn-xs btn-success mx-1" data-action="tag"><i class="fas fa-plus"></i></button>');
						} else {
							container.find('td[data-plugin="organizations"][data-key="tags"]').append('<button type="button" class="btn btn-xs btn-success mx-1" data-action="tag" style="display:none;"><i class="fas fa-plus"></i></button>');
						}
						API.Plugins.organizations.Events.tags(container,dataset);
						container.find('td[data-plugin="organizations"][data-key="tags"]').find('button[data-action="tag"]').click(function(){
							API.Builder.modal($('body'), {
								title:'Add a tag',
								icon:'tags',
								zindex:'top',
								css:{ header: "bg-gray", body: "p-3"},
							}, function(modal){
								modal.on('hide.bs.modal',function(){ modal.remove(); });
								var dialog = modal.find('.modal-dialog');
								var header = modal.find('.modal-header');
								var body = modal.find('.modal-body');
								var footer = modal.find('.modal-footer');
								header.find('button[data-control="hide"]').remove();
								header.find('button[data-control="update"]').remove();
								API.Builder.input(body, 'tags', dataset.output.this.dom.tags,{plugin:'organizations'}, function(input){});
								footer.append('<button class="btn btn-secondary" data-action="tag"><i class="fas fa-tag mr-1"></i>Tag</button>');
								footer.find('button[data-action="tag"]').click(function(){
									API.request('organizations','tag',{data:{id:dataset.output.this.dom.id,tags:body.find('select').select2('val')}},function(result){
										var data = JSON.parse(result);
										if(data.success != undefined){
											dataset.output.this.dom.tags = data.output.organization.dom.tags;
											dataset.output.this.raw.tags = data.output.organization.raw.tags;
											for(var [tagID, tag] of Object.entries(data.output.tags)){
												if(!API.Helper.isSet(API.Contents.data.dom.tags,[tag])){
													++tagID;++tagID;
													API.Helper.set(API.Contents.data.dom.tags,[tag],{
														id:tagID,
														created:data.output.organization.raw.modified,
														modified:data.output.organization.raw.modified,
														owner:data.output.organization.raw.updated_by,
														updated_by:data.output.organization.raw.updated_by,
														name:tag
													});
													API.Helper.set(API.Contents.data.raw.tags,[tag],{
														id:tagID,
														created:data.output.organization.raw.modified,
														modified:data.output.organization.raw.modified,
														owner:data.output.organization.raw.updated_by,
														updated_by:data.output.organization.raw.updated_by,
														name:tag
													});
												}
											}
											container.find('td[data-plugin="organizations"][data-key="tags"]').find('.btn-group[data-id]').remove();
											for(var [tagKey, tagDetails] of Object.entries(API.Helper.trim(dataset.output.this.dom.tags,';').split(';'))){
												var tagHTML = '';
												tagHTML += '<div class="btn-group m-1" data-id="'+tagDetails+'">';
													tagHTML += '<button type="button" data-id="'+tagDetails+'" class="btn btn-xs btn-primary" data-action="details"><i class="fas fa-tag mr-1"></i>'+tagDetails+'</button>';
													if(API.Auth.validate('custom', 'organizations_tags', 4)){
														tagHTML += '<button type="button" data-id="'+tagDetails+'" class="btn btn-xs btn-danger" data-action="untag"><i class="fas fa-backspace"></i></button>';
													}
												tagHTML += '</div>';
												container.find('td[data-plugin="organizations"][data-key="tags"]').find('button[data-action="tag"]').before(tagHTML);
											}
											API.Plugins.organizations.Events.tags(container,dataset);
										}
									});
									modal.modal('hide');
								});
								modal.modal('show');
							});
						});
					} else { container.find('td[data-plugin="organizations"][data-key="tags"]').parent('tr').remove(); }
					// Users
					if(API.Auth.validate('custom', 'organizations_users', 1)){
						container.find('td[data-plugin="organizations"][data-key="users"]').parent('tr').show();
						if(API.Helper.isSet(dataset.output.this.dom,['assigned_to'])){
							container.find('td[data-plugin="organizations"][data-key="assigned_to"]').html('');
							var assigned_to = {dom:{},raw:{}}, users = {};
							if(dataset.output.this.raw.assigned_to != null){
								assigned_to.raw = API.Helper.trim(dataset.output.this.raw.assigned_to,';').split(';');
								assigned_to.dom = API.Helper.trim(dataset.output.this.dom.assigned_to,';').split(';');
								for(var [key, id] of Object.entries(assigned_to.raw)){ users[id] = assigned_to.dom[key]; }
								for(var [userID, username] of Object.entries(users)){
									var userHTML = '';
									userHTML += '<div class="btn-group m-1" data-id="'+userID+'">';
										userHTML += '<button type="button" data-id="'+userID+'" class="btn btn-xs btn-primary" data-action="details"><i class="fas fa-user mr-1"></i>'+username+'</button>';
										if(API.Auth.validate('custom', 'organizations_users', 4)){
											userHTML += '<button type="button" data-id="'+userID+'" class="btn btn-xs btn-danger" data-action="unassign"><i class="fas fa-user-minus"></i></button>';
										}
									userHTML += '</div>';
									container.find('td[data-plugin="organizations"][data-key="assigned_to"]').append(userHTML);
								}
							}
						}
						if(API.Auth.validate('custom', 'organizations_users', 2)){
							container.find('td[data-plugin="organizations"][data-key="assigned_to"]').append('<button type="button" class="btn btn-xs btn-success mx-1" data-action="assign"><i class="fas fa-user-plus"></i></button>');
						} else {
							container.find('td[data-plugin="organizations"][data-key="assigned_to"]').append('<button type="button" class="btn btn-xs btn-success mx-1" data-action="assign" style="display:none;"><i class="fas fa-user-plus"></i></button>');
						}
						API.Plugins.organizations.Events.users(container,dataset);
						container.find('td[data-plugin="organizations"][data-key="assigned_to"]').find('button[data-action="assign"]').click(function(){
							API.Builder.modal($('body'), {
								title:'Assign a user',
								icon:'assign',
								zindex:'top',
								css:{ header: "bg-info", body: "p-3"},
							}, function(modal){
								modal.on('hide.bs.modal',function(){ modal.remove(); });
								var dialog = modal.find('.modal-dialog');
								var header = modal.find('.modal-header');
								var body = modal.find('.modal-body');
								var footer = modal.find('.modal-footer');
								header.find('button[data-control="hide"]').remove();
								header.find('button[data-control="update"]').remove();
								API.Builder.input(body, 'user', null,{plugin:'organizations'}, function(input){});
								footer.append('<button class="btn btn-info" data-action="assign"><i class="fas fa-user-plus mr-1"></i>Assign</button>');
								footer.find('button[data-action="assign"]').click(function(){
									API.request('organizations','assign',{data:{id:dataset.output.this.dom.id,user:body.find('select').select2('val')}},function(result){
										var data = JSON.parse(result);
										if(data.success != undefined){
											dataset.output.this.dom.assigned_to = data.output.organization.dom.assigned_to;
											dataset.output.this.raw.assigned_to = data.output.organization.raw.assigned_to;
											dataset.output.details.users.dom = data.output.users.dom;
											dataset.output.details.users.raw = data.output.users.raw;
											container.find('td[data-plugin="organizations"][data-key="assigned_to"]').find('.btn-group[data-id]').remove();
											var assigned_to = {dom:{},raw:{}}, users = {};
											assigned_to.raw = API.Helper.trim(data.output.organization.raw.assigned_to,';').split(';');
											assigned_to.dom = API.Helper.trim(data.output.organization.dom.assigned_to,';').split(';');
											for(var [key, id] of Object.entries(assigned_to.raw)){ users[id] = assigned_to.dom[key]; }
											for(var [userID, username] of Object.entries(users)){
												var userHTML = '';
												userHTML += '<div class="btn-group m-1" data-id="'+userID+'">';
													userHTML += '<button type="button" data-id="'+userID+'" class="btn btn-xs btn-primary" data-action="details"><i class="fas fa-user mr-1"></i>'+username+'</button>';
													if(API.Auth.validate('custom', 'organizations_users', 4)){
														userHTML += '<button type="button" data-id="'+userID+'" class="btn btn-xs btn-danger" data-action="unassign"><i class="fas fa-user-minus"></i></button>';
													}
												userHTML += '</div>';
												container.find('td[data-plugin="organizations"][data-key="assigned_to"]').find('button[data-action="assign"]').before(userHTML);
											}
											API.Plugins.organizations.Events.users(container,dataset);
										}
									});
									modal.modal('hide');
								});
								modal.modal('show');
							});
						});
					} else { container.find('td[data-plugin="organizations"][data-key="assigned_to"]').parent('tr').remove(); }
					// Code
					if(API.Auth.validate('custom', 'organizations_code', 1)){
						container.find('td[data-plugin="organizations"][data-key="code"]').parent('tr').show();
					} else { container.find('td[data-plugin="organizations"][data-key="code"]').parent('tr').remove(); }
					// Phone
					if(API.Auth.validate('custom', 'organizations_phone', 1)){
						container.find('td[data-plugin="organizations"][data-edit="phone"]').parent('tr').show();
					} else { container.find('td[data-plugin="organizations"][data-edit="phone"]').parent('tr').remove(); }
					// Business#
					if(API.Auth.validate('custom', 'organizations_business_num', 1)){
						container.find('td[data-plugin="organizations"][data-key="business_num"]').parent('tr').show();
					} else { container.find('td[data-plugin="organizations"][data-key="business_num"]').parent('tr').remove(); }
					// Comments
					if(!API.Auth.validate('custom', 'organizations_comments', 2)){
						container.find('#organizations_main_card_tabs .nav-item .nav-link[href="#organizations_comments"]').parent().remove();
						container.find('#organizations_comments').remove();
					} else { container.find('#organizations_main_card_tabs .nav-item .nav-link[href="#organizations_comments"]').parent().show(); }
					// Status
					if(API.Auth.validate('custom', 'organizations_status', 1)){
						container.find('#organizations_notes select[name="status"]').show();
						for(var [statusOrder, statusInfo] of Object.entries(API.Contents.Statuses.organizations)){
							container.find('#organizations_notes select[name="status"]').append(new Option(API.Contents.Language[statusInfo.name], statusOrder));
						}
						container.find('#organizations_notes select[name="status"]').val(dataset.output.this.dom.status);
					} else {
						container.find('#organizations_notes select[name="status"]').remove();
					}
					if(API.Helper.isSet(API.Contents.Statuses,[url.searchParams.get("p"),dataset.output.this.dom.status])){
						if(API.Auth.validate('custom', 'organizations_status', 1)){
							container.find('td[data-plugin="organizations"][data-key="status"]').parent('tr').show();
							container.find('td[data-plugin="organizations"][data-key="status"]').html('<span class="badge bg-'+API.Contents.Statuses.organizations[dataset.output.this.dom.status].color+'"><i class="'+API.Contents.Statuses.organizations[dataset.output.this.dom.status].icon+' mr-1" aria-hidden="true"></i>'+API.Contents.Language[API.Contents.Statuses.organizations[dataset.output.this.dom.status].name]+'</span>');
						} else { container.find('td[data-plugin="organizations"][data-key="status"]').parent('tr').remove(); }
					}
					// Notes
					if(!API.Auth.validate('custom', 'organizations_notes', 1)){
						container.find('#organizations_main_card_tabs .nav-item .nav-link[href="#organizations_notes"]').parent().remove();
						container.find('#organizations_notes').remove();
					} else { container.find('#organizations_main_card_tabs .nav-item .nav-link[href="#organizations_notes"]').parent().show(); }
					// Creating Timeline
					// Relationships
					for(var [rid, relations] of Object.entries(dataset.output.relationships)){
						for(var [uid, relation] of Object.entries(relations)){
							if(API.Helper.isSet(dataset.output.details,[relation.relationship,'dom',relation.link_to])){
								var detail = {};
								for(var [key, value] of Object.entries(dataset.output.details[relation.relationship].dom[relation.link_to])){ detail[key] = value; }
								detail.owner = relation.owner; detail.created = relation.created;
								switch(relation.relationship){
									case"status":
									case"statuses":
										if((API.Auth.validate('custom', 'organizations_status', 1))||(detail.owner == API.Contents.Auth.User.username)){
											API.Builder.Timeline.add.status(container.find('#organizations_timeline'),detail);
										}
										break;
									case"users":
										if(detail.isEmployee){
											if((API.Auth.validate('custom', 'organizations_employees', 1))||(detail.owner == API.Contents.Auth.User.username)){
												if((detail.isActive)||(detail.isActive == 'true')||(API.Auth.validate('custom', 'organizations_employees_isActive', 1))){
													detail.name = '';
													if((detail.first_name != '')&&(detail.first_name != null)){ if(detail.name != ''){detail.name += ' ';} detail.name += detail.first_name; }
													if((detail.middle_name != '')&&(detail.middle_name != null)){ if(detail.name != ''){detail.name += ' ';} detail.name += detail.middle_name; }
													if((detail.last_name != '')&&(detail.last_name != null)){ if(detail.name != ''){detail.name += ' ';} detail.name += detail.last_name; }
													API.Builder.Timeline.add.contact(container.find('#organizations_timeline'),detail,'address-card','secondary',function(item){
														item.find('i').first().addClass('pointer');
														item.find('i').first().off().click(function(){
															if((API.Auth.validate('custom', 'organizations_employees', 1))&&((item.attr('data-isEmployee'))||(item.attr('data-isEmployee') == 'true'))){
																container.find('#organizations_employees_search').val(item.attr('data-name'));
																container.find('ul.nav li.nav-item a[href*="employees"]').tab('show');
																container.find('#organizations_employees').find('[data-csv]').hide();
																container.find('#organizations_employees').find('[data-csv*="'+item.attr('data-name').toLowerCase()+'"]').each(function(){ $(this).show(); });
															}
														});
													});
												}
											}
										}
										else if(detail.isContact){
											if((API.Auth.validate('custom', 'organizations_contacts', 1))||(detail.owner == API.Contents.Auth.User.username)){
												if((detail.isActive)||(detail.isActive == 'true')||(API.Auth.validate('custom', 'organizations_contacts_isActive', 1))){
													detail.name = '';
													if((detail.first_name != '')&&(detail.first_name != null)){ if(detail.name != ''){detail.name += ' ';} detail.name += detail.first_name; }
													if((detail.middle_name != '')&&(detail.middle_name != null)){ if(detail.name != ''){detail.name += ' ';} detail.name += detail.middle_name; }
													if((detail.last_name != '')&&(detail.last_name != null)){ if(detail.name != ''){detail.name += ' ';} detail.name += detail.last_name; }
													API.Builder.Timeline.add.contact(container.find('#organizations_timeline'),detail,'address-card','secondary',function(item){
														item.find('i').first().addClass('pointer');
														item.find('i').first().off().click(function(){
															if(API.Auth.validate('custom', 'organizations_contacts', 1)){
																container.find('#organizations_contacts_search').val(item.attr('data-name'));
																container.find('ul.nav li.nav-item a[href*="contacts"]').tab('show');
																container.find('#organizations_contacts').find('[data-csv]').hide();
																container.find('#organizations_contacts').find('[data-csv*="'+item.attr('data-name').toLowerCase()+'"]').each(function(){ $(this).show(); });
															}
														});
													});
												}
											}
										}
										if((!detail.isEmployee)&&(!detail.isContact)&&(detail.isUser)){
											if((API.Auth.validate('custom', 'organizations_users', 1))||(detail.owner == API.Contents.Auth.User.username)){
												detail.name = '';
												if((detail.first_name != '')&&(detail.first_name != null)){ if(detail.name != ''){detail.name += ' ';} detail.name += detail.first_name; }
												if((detail.middle_name != '')&&(detail.middle_name != null)){ if(detail.name != ''){detail.name += ' ';} detail.name += detail.middle_name; }
												if((detail.last_name != '')&&(detail.last_name != null)){ if(detail.name != ''){detail.name += ' ';} detail.name += detail.last_name; }
												API.Builder.Timeline.add.user(container.find('#organizations_timeline'),detail,'user','lightblue');
											}
										}
										break;
									case"organizations":
										if((API.Auth.validate('custom', 'organizations_organizations', 1))||(detail.owner == API.Contents.Auth.User.username)){
											API.Builder.Timeline.add.client(container.find('#organizations_timeline'),detail,'building','secondary',function(item){
												item.find('i').first().addClass('pointer');
												item.find('i').first().off().click(function(){
													API.CRUD.read.show({ key:'name',keys:dataset.output.details.organizations.dom[item.attr('data-id')], href:"?p=organizations&v=details&id="+dataset.output.details.organizations.dom[item.attr('data-id')].name, modal:true });
												});
											});
										}
										break;
									case"services":
										if((API.Auth.validate('custom', 'organizations_services', 1))||(detail.owner == API.Contents.Auth.User.username)){
											API.Builder.Timeline.add.service(container.find('#organizations_timeline'),detail);
										}
										break;
									case"calls":
										if((API.Auth.validate('custom', 'organizations_calls_all', 1))||(detail.assigned_to == API.Contents.Auth.User.username)){
											if(API.Helper.isSet(dataset.output.details.statuses.raw,[relation.statuses,'order'])){
												detail.status = dataset.output.details.statuses.raw[relation.statuses].order;
												detail.organization = dataset.output.details.calls.raw[detail.id].organization;
												API.Builder.Timeline.add.call(container.find('#organizations_timeline'),detail,'phone-square','olive',function(item){
													item.find('i').first().addClass('pointer');
													item.find('i').first().off().click(function(){
														API.CRUD.read.show({ key:{id:item.attr('data-id')}, title:item.attr('data-phone'), href:"?p=calls&v=details&id="+item.attr('data-id'), modal:true });
													});
												});
											}
										}
										break;
									case"issues":
										if((API.Auth.validate('custom', 'organizations_issues', 1))||(detail.owner == API.Contents.Auth.User.username)){
											if(API.Helper.isSet(dataset.output.details.statuses.raw,[relation.statuses,'order'])){
												detail.status = dataset.output.details.statuses.raw[relation.statuses].order;
												API.Builder.Timeline.add.issue(container.find('#organizations_timeline'),detail);
											}
										}
										break;
									case"comments":
										if((API.Auth.validate('custom', 'organizations_comments', 1))||(detail.owner == API.Contents.Auth.User.username)){
											API.Builder.Timeline.add.card(container.find('#organizations_timeline'),detail,'comment','primary');
										}
										break;
									case"notes":
										if((API.Auth.validate('custom', 'organizations_notes', 1))||(detail.owner == API.Contents.Auth.User.username)){
											API.Builder.Timeline.add.card(container.find('#organizations_timeline'),detail,'sticky-note','warning',function(item){
												item.find('.timeline-footer').remove();
											});
										}
										break;
									default:
										API.Builder.Timeline.add.card(container.find('#organizations_timeline'),detail);
										break;
								}
							}
						}
					}
					// Radio Selector
					var timelineHTML = '';
					timelineHTML += '<div class="btn-group btn-group-toggle" data-toggle="buttons">';
						timelineHTML += '<label class="btn btn-primary pointer active" data-table="all">';
							timelineHTML += '<input type="radio" name="options" autocomplete="off" checked>All';
						timelineHTML += '</label>';
						for(var [table, content] of Object.entries(dataset.output.details)){
							switch(table){
								case"users":
									if(API.Auth.validate('custom', 'organizations_contacts', 1)){
										timelineHTML += '<label class="btn btn-primary pointer" data-table="contacts">';
											timelineHTML += '<input type="radio" name="options" autocomplete="off">'+API.Helper.ucfirst('contacts');
										timelineHTML += '</label>';
									}
									if(API.Auth.validate('custom', 'organizations_employees', 1)){
										timelineHTML += '<label class="btn btn-primary pointer" data-table="employees">';
											timelineHTML += '<input type="radio" name="options" autocomplete="off">'+API.Helper.ucfirst('employees');
										timelineHTML += '</label>';
									}
								default:
									if(API.Auth.validate('custom', 'organizations_'+table, 1)){
										timelineHTML += '<label class="btn btn-primary pointer" data-table="'+table+'">';
											timelineHTML += '<input type="radio" name="options" autocomplete="off">'+API.Helper.ucfirst(table);
										timelineHTML += '</label>';
									}
									break;
							}
						}
					timelineHTML += '</div>';
					container.find('#organizations_timeline').find('.time-label').first().html(timelineHTML);
					// Events
					// Timeline
					container.find('#organizations_timeline').find('.time-label').first().find('label').each(function(){
						switch($(this).attr('data-table')){
							case"notes":var icon = 'sticky-note';break;
							case"comments":var icon = 'comment';break;
							case"statuses":var icon = 'info';break;
							case"users":var icon = 'user';break;
							case"organizations":var icon = 'building';break;
							case"contacts":var icon = 'address-card';break;
							case"calls":var icon = 'phone-square';break;
							case"services":var icon = 'hand-holding-usd';break;
							case"issues":var icon = 'gavel';break;
							default:var icon = '';break;
						}
						if((icon != '')&&(typeof icon !== 'undefined')){
							$(this).click(function(){
								container.find('#organizations_timeline').find('[data-type]').hide();
								container.find('#organizations_timeline').find('[data-type="'+icon+'"]').show();
							});
						} else {
							$(this).click(function(){
								container.find('#organizations_timeline').find('[data-type]').show();
							});
						}
					});
					// Comments
					container.find('#organizations_comments').find('button[data-action="reply"]').click(function(){
						var comment = {
							from:API.Contents.Auth.User.id,
							type:'users',
							content:container.find('#organizations_comments_textarea').find('textarea').summernote('code'),
							relationship:'organizations',
							link_to:dataset.output.this.dom.id,
						};
						container.find('#organizations_comments_textarea').find('textarea').val('');
						container.find('#organizations_comments_textarea').find('textarea').summernote('code','');
						container.find('#organizations_comments_textarea').find('textarea').summernote('destroy');
						container.find('#organizations_comments_textarea').find('textarea').summernote({
							toolbar: [
								['font', ['fontname', 'fontsize']],
								['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
								['color', ['color']],
								['paragraph', ['style', 'ul', 'ol', 'paragraph', 'height']],
							],
							height: 250,
						});
						// Notes
						API.request('organizations','comment',{data:comment},function(result){
							var dataset = JSON.parse(result);
							if(dataset.success != undefined){
								API.Builder.Timeline.add.card(container.find('#organizations_timeline'),dataset.output.comment.dom,'comment','primary');
							}
						});
						container.find('#organizations_main_card_tabs a[href="#organizations"]').tab('show');
					});
					container.find('#organizations_notes').find('button[data-action="reply"]').click(function(){
						var note = {
							by:API.Contents.Auth.User.id,
							content:container.find('#organizations_notes_textarea').find('textarea').summernote('code'),
							relationship:'organizations',
							link_to:dataset.output.this.dom.id,
							status:container.find('#organizations_notes select[name="status"]').val(),
						};
						container.find('#organizations_notes_textarea').find('textarea').val('');
						container.find('#organizations_notes_textarea').find('textarea').summernote('code','');
						container.find('#organizations_notes_textarea').find('textarea').summernote('destroy');
						container.find('#organizations_notes_textarea').find('textarea').summernote({
							toolbar: [
								['font', ['fontname', 'fontsize']],
								['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
								['color', ['color']],
								['paragraph', ['style', 'ul', 'ol', 'paragraph', 'height']],
							],
							height: 250,
						});
						if((note.content != "")&&(note.content != "<p><br></p>")&&(note.content != "<p></p>")&&(note.content != "<br>")){
							API.request('organizations','note',{data:note},function(result){
								var dataset = JSON.parse(result);
								if(dataset.success != undefined){
									if(dataset.output.status != null){
										var status = {};
										for(var [key, value] of Object.entries(dataset.output.status)){ status[key] = value; }
										status.created = dataset.output.note.raw.created;
										API.Builder.Timeline.add.status(container.find('#organizations_timeline'),status);
										container.find('#organizations_notes select[name="status"]').val(status.order);
										container.find('td[data-plugin="organizations"][data-key="status"]').html('<span class="badge bg-'+API.Contents.Statuses.organizations[status.order].color+'"><i class="'+API.Contents.Statuses.organizations[status.order].icon+' mr-1" aria-hidden="true"></i>'+API.Contents.Language[API.Contents.Statuses.organizations[status.order].name]+'</span>');
									}
									API.Builder.Timeline.add.card(container.find('#organizations_timeline'),dataset.output.note.dom,'sticky-note','warning',function(item){
										item.find('.timeline-footer').remove();
									});
								}
							});
							container.find('#organizations_main_card_tabs a[href="#organizations"]').tab('show');
						} else { alert('Note is empty'); }
					});
				}
			});
		},
	},
	GUI:{
		contacts:{
			add:function(container, dataset, contact, open = false){
				var contactCSV = '';
				for(var [key, value] of Object.entries(contact.dom)){
					if(value == null){ value = '';contact.dom[key] = value; };
				  switch(key){
				    case"first_name":
				    case"middle_name":
				    case"last_name":
				    case"email":
						case"phone":
						case"mobile":
				    case"office_num":
						case"other_num":
				    case"about":
				    case"job_title": contactCSV += value.replace(',','').toLowerCase()+',';break;
				  }
				}
				contact.dom.name = '';
				if(contact.dom.first_name != ''){ if(contact.dom.name != ''){ contact.dom.name += ' '; } contact.dom.name += contact.dom.first_name; }
				if(contact.dom.middle_name != ''){ if(contact.dom.name != ''){ contact.dom.name += ' '; } contact.dom.name += contact.dom.middle_name; }
				if(contact.dom.last_name != ''){ if(contact.dom.name != ''){ contact.dom.name += ' '; } contact.dom.name += contact.dom.last_name; }
				contact.raw.name += contact.dom.name;
				contactCSV += contact.dom.name.replace(',','').toLowerCase()+',';
				var contactHTML = '';
				contactHTML += '<div class="col-sm-12 col-md-6 contactCard" data-csv="'+contactCSV+'" data-type="contact" data-id="'+contact.dom.id+'" data-organization="'+contact.raw.organization+'">';
				  contactHTML += '<div class="card">';
				    contactHTML += '<div class="card-header border-bottom-0">';
				      contactHTML += '<b class="mr-1">Title:</b>'+contact.dom.job_title;
				    contactHTML += '</div>';
				    contactHTML += '<div class="card-body pt-0">';
				      contactHTML += '<div class="row">';
				        contactHTML += '<div class="col-7">';
				          contactHTML += '<h2 class="lead"><b>'+contact.dom.name+'</b></h2>';
				          contactHTML += '<p class="text-sm"><b>About: </b> '+contact.dom.about+' </p>';
				          contactHTML += '<ul class="ml-4 mb-0 fa-ul">';
				            contactHTML += '<li class="small"><span class="fa-li"><i class="fas fa-lg fa-at"></i></span><b class="mr-1">Email:</b><a href="mailto:'+contact.dom.email+'">'+contact.dom.email+'</a></li>';
				            contactHTML += '<li class="small"><span class="fa-li"><i class="fas fa-lg fa-phone"></i></span><b class="mr-1">Phone #:</b><a href="tel:'+contact.dom.phone+'">'+contact.dom.phone+'</a></li>';
				            contactHTML += '<li class="small"><span class="fa-li"><i class="fas fa-lg fa-phone"></i></span><b class="mr-1">Office #:</b><a href="tel:'+contact.dom.office_num+'">'+contact.dom.office_num+'</a></li>';
				            contactHTML += '<li class="small"><span class="fa-li"><i class="fas fa-lg fa-mobile"></i></span><b class="mr-1">Mobile #:</b><a href="tel:'+contact.dom.mobile+'">'+contact.dom.mobile+'</a></li>';
				            contactHTML += '<li class="small"><span class="fa-li"><i class="fas fa-lg fa-phone"></i></span><b class="mr-1">Other #:</b><a href="tel:'+contact.dom.other_num+'">'+contact.dom.other_num+'</a></li>';
				          contactHTML += '</ul>';
				        contactHTML += '</div>';
				        contactHTML += '<div class="col-5 text-center">';
				          contactHTML += '<img src="/dist/img/default.png" alt="user-avatar" class="img-circle img-fluid">';
				        contactHTML += '</div>';
				      contactHTML += '</div>';
				    contactHTML += '</div>';
				    contactHTML += '<div class="card-footer">';
				      contactHTML += '<div class="text-right">';
				        contactHTML += '<div class="btn-group"></div>';
				      contactHTML += '</div>';
				    contactHTML += '</div>';
				  contactHTML += '</div>';
				contactHTML += '</div>';
				contact.dom.organization = contact.raw.organization;
				var contactInserted = false;
				if((contact.dom.isActive)||(contact.dom.isActive == "true")){
					if((API.Auth.validate('custom', 'organizations_contacts', 1))&&((contact.dom.isContact)||(contact.dom.isContact == "true"))){
				  	container.find('#organizations_contacts').find('div.row').first().find('div.addContact').parent().before(contactHTML);
						contactInserted = true;
						var contactElement = container.find('#organizations_contacts').find('div[data-id="'+contact.dom.id+'"]');
					}
					if((API.Auth.validate('custom', 'organizations_employees', 1))&&((contact.dom.isEmployee)||(contact.dom.isEmployee == "true"))){
				  	container.find('#organizations_employees').find('div.row').first().find('div.addContact').parent().before(contactHTML);
						employeeInserted = true;
						var contactElement = container.find('#organizations_contacts').find('div[data-id="'+contact.dom.id+'"]');
					}
					if(open){
						API.Builder.Timeline.add.contact(container.find('#organizations_timeline'),contact.dom,'address-card','secondary',function(item){
							item.find('i').first().addClass('pointer');
							item.find('i').first().off().click(function(){
								if((API.Auth.validate('custom', 'organizations_employees', 1))&&((item.attr('data-isEmployee'))||(item.attr('data-isEmployee') == 'true'))){
									container.find('#organizations_employees_search').val(item.attr('data-name'));
									container.find('ul.nav li.nav-item a[href*="employees"]').tab('show');
									container.find('#organizations_employees').find('[data-csv]').hide();
									container.find('#organizations_employees').find('[data-csv*="'+item.attr('data-name').toLowerCase()+'"]').each(function(){ $(this).show(); });
								}
								else if((API.Auth.validate('custom', 'organizations_contacts', 1))&&((item.attr('data-isContact'))||(item.attr('data-isContact') == 'true'))){
									container.find('#organizations_contacts_search').val(item.attr('data-name'));
									container.find('ul.nav li.nav-item a[href*="contacts"]').tab('show');
									container.find('#organizations_contacts').find('[data-csv]').hide();
									container.find('#organizations_contacts').find('[data-csv*="'+item.attr('data-name').toLowerCase()+'"]').each(function(){ $(this).show(); });
								}
							});
						});
					}
				} else {
					if((API.Auth.validate('custom', 'organizations_contacts_isActive', 1))&&((contact.dom.isContact)||(contact.dom.isContact == "true"))){
				    container.find('#organizations_contacts').find('div.row').first().find('div.addContact').parent().before(contactHTML);
						contactInserted = true;
						var contactElement = container.find('#organizations_contacts').find('div[data-id="'+contact.dom.id+'"]');
				    container.find('#organizations_contacts').find('[data-id="'+contact.dom.id+'"] .card').prepend('<div class="ribbon-wrapper ribbon-xl"><div class="ribbon bg-danger text-xl">Inactive</div></div>');
				    if(open){
							API.Builder.Timeline.add.contact(container.find('#organizations_timeline'),contact.dom,'address-card','secondary',function(item){
								item.find('i').first().addClass('pointer');
								item.find('i').first().off().click(function(){
									if((API.Auth.validate('custom', 'organizations_employees', 1))&&((item.attr('data-isEmployee'))||(item.attr('data-isEmployee') == 'true'))){
										container.find('#organizations_employees_search').val(item.attr('data-name'));
										container.find('ul.nav li.nav-item a[href*="employees"]').tab('show');
										container.find('#organizations_employees').find('[data-csv]').hide();
										container.find('#organizations_employees').find('[data-csv*="'+item.attr('data-name').toLowerCase()+'"]').each(function(){ $(this).show(); });
									}
									else if((API.Auth.validate('custom', 'organizations_contacts', 1))&&((item.attr('data-isContact'))||(item.attr('data-isContact') == 'true'))){
										container.find('#organizations_contacts_search').val(item.attr('data-name'));
										container.find('ul.nav li.nav-item a[href*="contacts"]').tab('show');
										container.find('#organizations_contacts').find('[data-csv]').hide();
										container.find('#organizations_contacts').find('[data-csv*="'+item.attr('data-name').toLowerCase()+'"]').each(function(){ $(this).show(); });
									}
								});
							});
						}
				  }
				  if((API.Auth.validate('custom', 'organizations_employees_isActive', 1))&&((contact.dom.isEmployee)||(contact.dom.isEmployee == "true"))){
				    container.find('#organizations_employees').find('div.row').first().find('div.addContact').parent().before(contactHTML);
						employeeInserted = true;
						var contactElement = container.find('#organizations_contacts').find('div[data-id="'+contact.dom.id+'"]');
				    container.find('#organizations_employees').find('[data-id="'+contact.dom.id+'"] .card').prepend('<div class="ribbon-wrapper ribbon-xl"><div class="ribbon bg-danger text-xl">Inactive</div></div>');
				    if(open){
							API.Builder.Timeline.add.contact(container.find('#organizations_timeline'),contact.dom,'address-card','secondary',function(item){
								item.find('i').first().addClass('pointer');
								item.find('i').first().off().click(function(){
									if((API.Auth.validate('custom', 'organizations_employees', 1))&&((item.attr('data-isEmployee'))||(item.attr('data-isEmployee') == 'true'))){
										container.find('#organizations_employees_search').val(item.attr('data-name'));
										container.find('ul.nav li.nav-item a[href*="employees"]').tab('show');
										container.find('#organizations_employees').find('[data-csv]').hide();
										container.find('#organizations_employees').find('[data-csv*="'+item.attr('data-name').toLowerCase()+'"]').each(function(){ $(this).show(); });
									}
									else if(API.Auth.validate('custom', 'organizations_contacts', 1)){
										container.find('#organizations_contacts_search').val(item.attr('data-name'));
										container.find('ul.nav li.nav-item a[href*="contacts"]').tab('show');
										container.find('#organizations_contacts').find('[data-csv]').hide();
										container.find('#organizations_contacts').find('[data-csv*="'+item.attr('data-name').toLowerCase()+'"]').each(function(){ $(this).show(); });
									}
								});
							});
						}
				  }
				}
				if(contactInserted){
					if(API.Auth.validate('custom', 'organizations_contacts', 1)){
						var contactHTML = '';
						if(API.Auth.validate('custom', 'organizations_contacts_btn_details', 1)){
							contactHTML += '<button class="btn btn-sm btn-primary" data-action="details"><i class="fas fa-eye mr-1"></i>Details</button>';
						}
						if(API.Auth.validate('custom', 'organizations_contacts_btn_call', 1)){
							contactHTML += '<button class="btn btn-sm btn-success" data-action="call"><i class="fas fa-phone mr-1"></i>Call</button>';
						}
						if(API.Auth.validate('custom', 'organizations_contacts_btn_subscriptions', 1)){
							contactHTML += '<button class="btn btn-sm bg-lightblue" data-action="subscriptions"><i class="fas fa-list-alt mr-1"></i>Subscriptions</button>';
						}
						if(API.Auth.validate('custom', 'organizations_contacts_btn_share', 1)){
							contactHTML += '<button class="btn btn-sm bg-navy" data-action="share"><i class="fas fa-share-alt mr-1"></i>Share</button>';
						}
						if((API.Auth.validate('custom', 'organizations_contacts_btn_edit', 1))&&((!contact.dom.isUser)&&(contact.dom.isUser != 'true'))){
							contactHTML += '<button class="btn btn-sm btn-warning" data-action="edit"><i class="fas fa-edit mr-1"></i>Edit</button>';
						}
						if((API.Auth.validate('custom', 'organizations_contacts_btn_delete', 1))&&((!contact.dom.isEmployee)&&(contact.dom.isEmployee != 'true'))){
							contactHTML += '<button class="btn btn-sm btn-danger" data-action="delete"><i class="fas fa-trash-alt"></i></button>';
						}
						if(contactHTML != ''){
							contactElement.find('.btn-group').append(contactHTML);
							API.Plugins.organizations.Events.contacts(container,container.find('#organizations_contacts'),dataset);
						}
					}
					if(API.Auth.validate('custom', 'organizations_employees', 1)){
						var contactHTML = '';
						if(API.Auth.validate('custom', 'organizations_employees_btn_details', 1)){
							contactHTML += '<button class="btn btn-sm btn-primary" data-action="details"><i class="fas fa-eye mr-1"></i>Details</button>';
						}
						if(API.Auth.validate('custom', 'organizations_employees_btn_call', 1)){
							contactHTML += '<button class="btn btn-sm btn-success" data-action="call"><i class="fas fa-phone mr-1"></i>Call</button>';
						}
						if(API.Auth.validate('custom', 'organizations_employees_btn_subscriptions', 1)){
							contactHTML += '<button class="btn btn-sm bg-lightblue" data-action="subscriptions"><i class="fas fa-list-alt mr-1"></i>Subscriptions</button>';
						}
						if(API.Auth.validate('custom', 'organizations_employees_btn_share', 1)){
							contactHTML += '<button class="btn btn-sm bg-navy" data-action="share"><i class="fas fa-share-alt mr-1"></i>Share</button>';
						}
						if(API.Auth.validate('custom', 'organizations_employees_btn_edit', 1)){
							contactHTML += '<button class="btn btn-sm btn-warning" data-action="edit"><i class="fas fa-edit mr-1"></i>Edit</button>';
						}
						if(API.Auth.validate('custom', 'organizations_employees_btn_delete', 1)){
							contactHTML += '<button class="btn btn-sm btn-danger" data-action="delete"><i class="fas fa-trash-alt"></i></button>';
						}
						if(contactHTML != ''){
							employeeElement.find('.btn-group').append(contactHTML);
							API.Plugins.organizations.Events.contacts(container,container.find('#organizations_employees'),dataset);
						}
					}
				}
			},
		},
		calls:{
			add:function(container,call, organization, issues = {dom:[],raw:[]}, open = false){
				var callCSV = '';
				for(var [key, value] of Object.entries(call.dom)){
					if(value == null){ value = '';call.dom[key] = value; };
					switch(key){
						case"date":
						case"time":
						case"contact":
						case"phone":
						case"organization":
						case"assigned_to": callCSV += value.replace(',','').toLowerCase()+',';break;
						case"status": callCSV += API.Contents.Statuses.calls[value].name.toLowerCase()+',';break;
					}
				}
				var callHTML = '';
				var schedule = '<span class="badge bg-primary mx-1"><i class="fas fa-calendar-check mr-1" aria-hidden="true"></i>'+call.dom.date+' at '+call.dom.time+'</span>';
				var status = '<span class="mr-1 badge bg-'+API.Contents.Statuses.calls[call.raw.status].color+'"><i class="'+API.Contents.Statuses.calls[call.raw.status].icon+' mr-1" aria-hidden="true"></i>'+API.Contents.Language[API.Contents.Statuses.calls[call.raw.status].name]+'</span>';
				if((call.dom.phone != '')&&(call.dom.phone != null)){
					var phone = '<span class="badge bg-success mx-1"><i class="fas fa-phone mr-1" aria-hidden="true"></i>'+call.dom.phone+'</span>';
				} else { var phone = ''; }
				if((call.dom.contact != '')&&(call.dom.contact != null)){
					var contact = '<span class="badge bg-secondary mx-1"><i class="fas fa-address-card mr-1" aria-hidden="true"></i>'+call.dom.contact+'</span>';
				} else { var contact = ''; }
				if((call.dom.assigned_to != '')&&(call.dom.assigned_to != null)){
					var user = '<span class="badge bg-primary mx-1"><i class="fas fa-user mr-1" aria-hidden="true"></i>'+call.dom.assigned_to+'</span>';
				} else { var user = ''; }
				callHTML += '<tr data-csv="'+callCSV+'" data-id="'+call.dom.id+'" data-phone="'+call.dom.phone+'" data-organization="'+call.raw.organization+'" data-type="calls">';
					callHTML += '<td class="pointer">'+schedule+'</td>';
					callHTML += '<td class="pointer">'+status+'</td>';
					if(API.Auth.validate('custom', 'organizations_calls_phone', 1)){ callHTML += '<td class="pointer">'+phone+'</td>'; } else { callHTML += '<td class="pointer" style="display:none;">'+phone+'</td>'; }
					callHTML += '<td class="pointer">'+contact+'</td>';
					callHTML += '<td class="pointer">'+user+'</td>';
					if(((API.Helper.isSet(API.Contents.Auth.Options,['application','showInlineCallsControls','value']))&&(API.Contents.Auth.Options.application.showInlineCallsControls.value))||((!API.Helper.isSet(API.Contents.Auth.Options,['application','showInlineCallsControls','value']))&&(API.Contents.Settings.customization.showInlineCallsControls.value))){
						callHTML += '<td data-showInlineCallsControls="">';
							callHTML += '<div class="btn-group btn-block m-0" style="display:none;">';
								callHTML += '<button class="btn btn-xs btn-success" data-action="start"><i class="fas fa-phone mr-1"></i>Start</button>';
								callHTML += '<button class="btn btn-xs btn-danger" data-action="cancel"><i class="fas fa-phone-slash mr-1"></i>Cancel</button>';
								callHTML += '<button class="btn btn-xs btn-primary" data-action="reschedule"><i class="fas fa-calendar-day mr-1"></i>Re-Schedule</button>';
							callHTML += '</div>';
							callHTML += '<div class="btn-group btn-block m-0" style="display:none;">';
								callHTML += '<button class="btn btn-xs btn-danger" data-action="end"><i class="fas fa-phone-slash mr-1"></i>End</button>';
							callHTML += '</div>';
						callHTML += '</td>';
					} else { callHTML += '<td style="display:none;" data-showInlineCallsControls=""></td>'; }
				callHTML += '</tr>';
				if(call.raw.status > 2){
					container.find('#organizations_calls').find('table').find('tbody').append(callHTML);
					container.find('[data-id][data-type="calls"]').find('td').off().click(function(){
						API.CRUD.read.show({ key:{id:$(this).parent().attr('data-id')}, title:$(this).parent().attr('data-phone'), href:"?p=calls&v=details&id="+$(this).parent().attr('data-id'), modal:true });
					});
					if(((API.Helper.isSet(API.Contents.Auth.Options,['application','showInlineCallsControls','value']))&&(API.Contents.Auth.Options.application.showInlineCallsControls.value))||((!API.Helper.isSet(API.Contents.Auth.Options,['application','showInlineCallsControls','value']))&&(API.Contents.Settings.customization.showInlineCallsControls.value))){
						container.find('[data-id][data-type="calls"]').find('td[data-showInlineCallsControls]').off();
						API.Plugins.organizations.Events.calls(container,container.find('[data-id="'+call.dom.id+'"][data-type="calls"]'),call,organization,issues);
						if(call.raw.status < 4){
							container.find('[data-id="'+call.dom.id+'"][data-type="calls"]').find('button[data-action="end"]').parent().show();
						}
					}
					if(open){
						if(((API.Helper.isSet(API.Contents.Auth.Options,['application','showCallWidget','value']))&&(!API.Contents.Auth.Options.application.showCallWidget.value))||((!API.Helper.isSet(API.Contents.Auth.Options,['application','showCallWidget','value']))&&(!API.Contents.Settings.customization.showCallWidget.value))){
							API.CRUD.read.show({ key:{id:call.dom.id}, title:call.dom.phone, href:"?p=calls&v=details&id="+call.dom.id, modal:true });
						}
					}
				} else {
					container.find('#organizations_callbacks').find('table').find('tbody').append(callHTML);
					container.find('[data-id][data-type="calls"]').find('td').off().click(function(){
						API.CRUD.read.show({ key:{id:$(this).parent().attr('data-id')}, title:$(this).parent().attr('data-phone'), href:"?p=calls&v=details&id="+$(this).parent().attr('data-id'), modal:true });
					});
					if(((API.Helper.isSet(API.Contents.Auth.Options,['application','showInlineCallsControls','value']))&&(API.Contents.Auth.Options.application.showInlineCallsControls.value))||((!API.Helper.isSet(API.Contents.Auth.Options,['application','showInlineCallsControls','value']))&&(API.Contents.Settings.customization.showInlineCallsControls.value))){
						container.find('[data-id][data-type="calls"]').find('td[data-showInlineCallsControls]').off();
						API.Plugins.organizations.Events.calls(container,container.find('[data-id="'+call.dom.id+'"][data-type="calls"]'),call,organization,issues);
						container.find('[data-id="'+call.dom.id+'"][data-type="calls"]').find('button[data-action="start"]').parent().show();
					}
				}
				if(open){
					call.dom.organization = call.raw.organization;
					API.Builder.Timeline.add.call(container.find('#organizations_timeline'),call.dom,'phone-square','olive',function(item){
						item.find('i').first().addClass('pointer');
						item.find('i').first().off().click(function(){
							API.CRUD.read.show({ key:{id:call.dom.id}, title:call.dom.phone, href:"?p=calls&v=details&id="+call.dom.id, modal:true });
						});
					});
				}
			},
		},
	},
	Events:{
		calls:function(container,tr,call,organization,issues={dom:[],raw:[]}, options = {}, callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			if(((API.Helper.isSet(API.Contents.Auth.Options,['application','showInlineCallsControls','value']))&&(API.Contents.Auth.Options.application.showInlineCallsControls.value))||((!API.Helper.isSet(API.Contents.Auth.Options,['application','showInlineCallsControls','value']))&&(API.Contents.Settings.customization.showInlineCallsControls.value))){
				tr.find('[data-showInlineCallsControls]').find('button').off().click(function(){
					var control = $(this), action = control.attr('data-action');
					switch(action){
						case"start":
							API.Plugins.calls.Events.start(call,organization,issues,function(data,objects){
								call.raw.status = data.call.raw.status;
								call.dom.status = data.call.dom.status;
								container.find('ul.nav li.nav-item a[href*="calls"]').tab('show');
								if(callback != null){ callback(data,objects); }
							});
							break;
						case"cancel":
							API.Plugins.calls.Events.cancel(call,organization,issues,function(data,objects){
								call.raw.status = data.call.raw.status;
								call.dom.status = data.call.dom.status;
								container.find('ul.nav li.nav-item a[href*="calls"]').tab('show');
								if(callback != null){ callback(data,objects); }
							});
							break;
						case"reschedule":
							API.Plugins.calls.Events.reschedule(call,organization,issues,function(data,objects){
								call.raw.status = data.call.raw.status;
								call.dom.status = data.call.dom.status;
								container.find('ul.nav li.nav-item a[href*="calls"]').tab('show');
								if(callback != null){ callback(data,objects); }
							});
							break;
						case"end":
							API.Plugins.calls.Events.end(call,organization,issues,function(data,objects){
								call.raw.status = data.call.raw.status;
								call.dom.status = data.call.dom.status;
								if(callback != null){ callback(data,objects); }
							});
							break;
					}
				});
			}
		},
		users:function(container, dataset){
			container.find('td[data-plugin="organizations"][data-key="assigned_to"]').find('.btn-group button[data-action]').each(function(){
				$(this).off().click(function(){
					switch($(this).attr('data-action')){
						case"details": API.CRUD.read.show({ key:'username',keys:dataset.output.details.users.dom[$(this).attr('data-id')], href:"?p=users&v=details&id="+dataset.output.details.users.dom[$(this).attr('data-id')].username, modal:true });break;
						case"unassign":
							API.request('organizations','unassign',{data:{id:dataset.output.this.dom.id,user:$(this).attr('data-id')}},function(result){
								var data = JSON.parse(result);
								if(data.success != undefined){
									dataset.output.this.dom.assigned_to = data.output.organization.dom.assigned_to;
									dataset.output.this.raw.assigned_to = data.output.organization.raw.assigned_to;
									container.find('#organizations_details').find('td[data-plugin="organizations"][data-key="assigned_to"]').find('.btn-group[data-id="'+data.output.user+'"]').remove();
								}
							});
							break;
					}
				});
			});
		},
		tags:function(container, dataset){
			container.find('td[data-plugin="organizations"][data-key="tags"]').find('.btn-group button[data-action]').each(function(){
				$(this).off().click(function(){
					switch($(this).attr('data-action')){
						case"untag":
							API.request('organizations','untag',{data:{id:dataset.output.this.dom.id,tag:$(this).attr('data-id')}},function(result){
								var data = JSON.parse(result);
								if(data.success != undefined){
									dataset.output.this.dom.tags = data.output.organization.dom.tags;
									dataset.output.this.raw.tags = data.output.organization.raw.tags;
									container.find('#organizations_details').find('td[data-plugin="organizations"][data-key="tags"]').find('.btn-group[data-id="'+data.output.tag+'"]').remove();
								}
							});
							break;
					}
				});
			});
		},
		services:function(container, dataset){
			container.find('td[data-plugin="organizations"][data-key="services"]').find('.btn-group button[data-action]').each(function(){
				$(this).off().click(function(){
					switch($(this).attr('data-action')){
						case"details": API.CRUD.read.show({ key:'name',keys:dataset.output.details.services.dom[$(this).attr('data-id')], href:"?p=services&v=details&id="+dataset.output.details.services.dom[$(this).attr('data-id')].id, modal:true });break;
						case"unlink":
							API.request('organizations','unlink',{data:{id:dataset.output.this.dom.id,relationship:{relationship:'services',link_to:$(this).attr('data-id')}}},function(result){
								var data = JSON.parse(result);
								if(data.success != undefined){
									container.find('#organizations_details').find('td[data-plugin="organizations"][data-key="services"]').find('.btn-group[data-id="'+data.output.id+'"]').remove();
									container.find('#organizations_timeline').find('[data-type="hand-holding-usd"][data-id="'+data.output.id+'"]').remove();
								}
							});
							break;
					}
				});
			});
		},
		issues:function(container, dataset){
			container.find('td[data-plugin="organizations"][data-key="issues"]').find('.btn-group button[data-action]').each(function(){
				$(this).off().click(function(){
					switch($(this).attr('data-action')){
						case"details": API.CRUD.read.show({ key:'name',keys:dataset.output.details.issues.dom[$(this).attr('data-id')], href:"?p=issues&v=details&id="+dataset.output.details.issues.dom[$(this).attr('data-id')].id, modal:true });break;
						case"unlink":
							API.request('organizations','unlink',{data:{id:dataset.output.this.dom.id,relationship:{relationship:'issues',link_to:$(this).attr('data-id')}}},function(result){
								var data = JSON.parse(result);
								if(data.success != undefined){
									container.find('#organizations_details').find('td[data-plugin="organizations"][data-key="issues"]').find('.btn-group[data-id="'+data.output.id+'"]').remove();
									container.find('#organizations_timeline').find('[data-type="gavel"][data-id="'+data.output.id+'"]').remove();
								}
							});
							break;
					}
				});
			});
		},
		subsidiaries:function(container, dataset){
			container.find('td[data-plugin="organizations"][data-key="subsidiaries"]').find('.btn-group button[data-action]').each(function(){
				$(this).off().click(function(){
					switch($(this).attr('data-action')){
						case"details": API.CRUD.read.show({ key:'name',keys:dataset.output.details.organizations.dom[$(this).attr('data-id')], href:"?p=organizations&v=details&id="+dataset.output.details.organizations.dom[$(this).attr('data-id')].name, modal:true });break;
						case"unlink":
							API.request('organizations','unlink',{data:{id:dataset.output.this.dom.id,relationship:{relationship:'organizations',link_to:$(this).attr('data-id')}}},function(result){
								var data = JSON.parse(result);
								if(data.success != undefined){
									container.find('#organizations_details').find('td[data-plugin="organizations"][data-key="subsidiaries"]').find('.btn-group[data-id="'+data.output.id+'"]').remove();
									container.find('#organizations_timeline').find('[data-type="building"][data-id="'+data.output.id+'"]').remove();
								}
							});
							break;
					}
				});
			});
		},
		contacts:function(container,contactsCTN,dataset){
			contactsCTN.find('[data-csv]').each(function(){
				var id = $(this).attr('data-id');
				var call = {};
				for(var [key, value] of Object.entries(API.Contents.Settings.Structure.calls)){ call[key] = ''; }
				$(this).find('button').off().click(function(){
					switch($(this).attr('data-action')){
						case"call":
							var now = new Date();
							var newCall = {
								date:now,
								time:now,
								contact:id,
								status:3,
								assigned_to:API.Contents.Auth.User.id,
								relationship:'organizations',
								link_to:dataset.output.this.raw.id,
							};
							API.request('calls','create',{data:newCall},function(result){
								var data = JSON.parse(result);
								if(typeof data.success !== 'undefined'){
									API.Plugins.calls.Widgets.toast({dom:data.output.results,raw:data.output.raw},dataset.output.this,dataset.output.details.issues);
									API.Plugins.organizations.GUI.calls.add(container,{dom:data.output.results,raw:data.output.raw},dataset.output.this,dataset.output.details.issues, true);
								}
							});
							break;
						case"edit":
						API.CRUD.update.show({ keys:dataset.output.details.users.raw[id], modal:true, plugin:'contacts' },function(contact){
							dataset.output.details.users.raw[contact.raw.id] = contact.raw;
							dataset.output.details.users.dom[contact.dom.id] = contact.dom;
							container.find('div[data-type="contact"][data-id="'+contact.raw.id+'"][data-organization="'+contact.raw.organization+'"]').remove();
							API.Plugins.organizations.GUI.contacts.add(container, dataset, {dom:contact.dom,raw:contact.raw}, true);
						});break;
						case"delete":API.CRUD.delete.show({ keys:dataset.output.details.users.raw[id],key:'name', modal:true, plugin:'contacts' },function(record){
							if((dataset.output.details.users.raw[id].isActive == 'true')&&(record.isActive != 'true')&&(API.Auth.validate('custom', contactsCTN.attr('id')+'_isActive', 1))){
								contactsCTN.find('[data-id="'+record.id+'"] .card').prepend('<div class="ribbon-wrapper ribbon-xl"><div class="ribbon bg-danger text-xl">Inactive</div></div>');
							} else {
								contactsCTN.find('[data-id="'+record.id+'"]').remove();
							}
						});break;
						case"details":
							API.Builder.modal($('body'), {
								title:'Details',
								icon:'details',
								zindex:'top',
								css:{ header: "bg-primary"},
							}, function(modal){
								modal.on('hide.bs.modal',function(){ modal.remove(); });
								var dialog = modal.find('.modal-dialog');
								var header = modal.find('.modal-header');
								var body = modal.find('.modal-body');
								var footer = modal.find('.modal-footer');
								header.find('button[data-control="hide"]').remove();
								header.find('button[data-control="update"]').remove();
								modal.modal('show');
							});
							break;
						case"share":
							API.Builder.modal($('body'), {
								title:'Share',
								icon:'share',
								zindex:'top',
								css:{ header: "bg-navy"},
							}, function(modal){
								modal.on('hide.bs.modal',function(){ modal.remove(); });
								var dialog = modal.find('.modal-dialog');
								var header = modal.find('.modal-header');
								var body = modal.find('.modal-body');
								var footer = modal.find('.modal-footer');
								header.find('button[data-control="hide"]').remove();
								header.find('button[data-control="update"]').remove();
								modal.modal('show');
							});
							break;
						case"subscriptions":
							API.Builder.modal($('body'), {
								title:'Subscriptions',
								icon:'subscriptions',
								zindex:'top',
								css:{ header: "bg-lightblue"},
							}, function(modal){
								modal.on('hide.bs.modal',function(){ modal.remove(); });
								var dialog = modal.find('.modal-dialog');
								var header = modal.find('.modal-header');
								var body = modal.find('.modal-body');
								var footer = modal.find('.modal-footer');
								header.find('button[data-control="hide"]').remove();
								header.find('button[data-control="update"]').remove();
								body.addClass('p-0');
								var tableHTML = '<div class="table-responsive"><table class="table dt-responsive table-hover table-bordered" style="width:100%"><thead class="thead-dark"></thead></table></div>';
								body.html(tableHTML);
								var table = body.find('table');
								var cols = [];
								cols.push({ name: "select", title: "", data: "select", width: "25px", defaultContent: '', targets: 0, orderable: false, className: 'select-checkbox'});
								cols.push({ name: "Category", title: "Category", data: "category", defaultContent: '', targets: 1 });
								cols.push({ name: "Sub Category", title: "Sub Category", data: "sub_category", defaultContent: '', targets: 2 });
								if(!API.Helper.isSet(dataset.output.details,['contacts','subscriptions','dom',id])){
									API.Helper.set(dataset.output.details,['contacts','subscriptions','dom',id],[]);
								}
								table.DataTable({
									data: dataset.output.details.users.subscriptions.dom[id],
									searching: true,
									paging: true,
									pageLength: 10,
									lengthChange: true,
									lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
									ordering: true,
									info: true,
									autoWidth: true,
									processing: true,
									scrolling: false,
									buttons: [
										{ extend: 'selectAll' },
										{ extend: 'selectNone' },
									],
									language: {
										buttons: {
											selectAll: API.Contents.Language["All"],
											selectNone: API.Contents.Language["None"],
										},
										info: ", Total _TOTAL_ entries",
									},
									dom: '<"dtbl-toolbar"Bf>rt<"dtbl-btoolbar"lip>',
									columnDefs: cols,
									select: {
										style: 'multi',
										selector: 'td:first-child'
									},
									order: [[ 1, "asc" ]]
								});
								modal.modal('show');
							});
							break;
					}
				});
			});
		},
	},
	extend:{},
}

API.Plugins.organizations.init();
