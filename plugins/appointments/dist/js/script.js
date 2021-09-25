API.Plugins.appointments = {
	element:{
		table:{
			index:{},
			clients:{},
		},
	},
	forms:{
		create:{
			0:"date",
			1:"time",
			2:"assigned_to",
			extra:{
				0:"contact",
				1:"divisions",
				2:"issues",
			},
		},
		update:{
			0:"date",
			1:"time",
			2:"assigned_to",
			extra:{
				0:"contact",
				1:"divisions",
				2:"issues",
			},
		},
	},
	options:{
		create:{
			skip:['status'],
		},
		update:{
			skip:['status'],
		},
	},
	init:function(){
		API.GUI.Sidebar.Nav.add('Appointments', 'development');
	},
	load:{
		index:function(){
			API.Builder.card($('#pagecontent'),{ title: 'Appointments', icon: 'appointments'}, function(card){
				API.request('appointments','read',{
					data:{
						options:{
							link_to:'AppointmentsIndex',
							plugin:'appointments',
							view:'index',
						},
					},
				},function(result) {
					var dataset = JSON.parse(result);
					if(dataset.success != undefined){
						for(const [key, value] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','dom','appointments',value.id],value); }
						for(const [key, value] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','appointments',value.id],value); }
						API.Builder.table(card.children('.card-body'), dataset.output.results, {
							headers:dataset.output.headers,
							id:'AppointmentsIndex',
							modal:true,
							key:'id',
							clickable:{ enable:true, view:'details'},
							breadcrumb:{
								title:'client',
							},
							controls:{ toolbar:true},
							import:{ key:'id', },
						},function(response){
							API.Plugins.appointments.element.table.index = response.table;
						});
					}
				});
			});
		},
		details:function(){
			var url = new URL(window.location.href);
			var id = url.searchParams.get("id"), values = '';
			var GUI = {};
			if($('#AppointmentHeader').parent('.modal-body').length > 0){
				GUI.isModal = true;
				GUI.modal = $('#AppointmentHeader').parent('.modal-body').parent().parent().parent();
				GUI.header = GUI.modal.find('.modal-header');
				GUI.body = GUI.modal.find('.modal-body');
				GUI.footer = GUI.modal.find('.modal-footer');
				GUI.modal.on('hide.bs.modal',function(e){
					GUI.footer.find('div.btn-group').remove();
				});
			} else {
				GUI.isModal = false;
				GUI.header = $('#AppointmentHeader');
				GUI.body = $('#AppointmentHeader').parent();
				GUI.footer = $('#AppointmentControls');
				GUI.footer.addClass('p-2');
			}
			if(!API.Helper.isSet(API.Contents,['data','raw','appointments',id])){
				API.request('appointments','read',{data:{id:id,key:'id'}},function(result){
					var dataset = JSON.parse(result);
					if(dataset.success != undefined){
						API.Helper.set(API.Contents,['data','dom','appointments',dataset.output.results.id],dataset.output.results);
						API.Helper.set(API.Contents,['data','raw','appointments',dataset.output.raw.id],dataset.output.raw);
						var appointment = dataset.output.raw;
					}
				});
			}
			var checkExist = setInterval(function() {
				if(API.Helper.isSet(API.Contents,['data','raw','appointments',id])){
					clearInterval(checkExist);
					var appointment = {};
					appointment.raw = API.Contents.data.raw.appointments[id];
					appointment.dom = API.Contents.data.dom.appointments[id];
					$('span[data-plugin="appointments"][data-key]').each(function(){
						values += $(this).text();
					});
					if(values == ''){ API.GUI.insert(appointment.raw); }
					// Fetch Extra Info
					// Client
					var client = {};
					if(!API.Helper.isSet(API.Contents,['data','raw','clients',appointment.raw.client])){
						API.request('clients','read',{data:{id:appointment.raw.client,key:'id'},toast:false,pace:false},function(result){
							var dataset = JSON.parse(result);
							if(dataset.success != undefined){
								API.Helper.set(API.Contents,['data','dom','clients',dataset.output.results.name],dataset.output.results);
								API.Helper.set(API.Contents,['data','raw','clients',dataset.output.raw.id],dataset.output.raw);
								client.raw = dataset.output.raw;
								client.dom = dataset.output.results;
								API.GUI.insert(client.dom,{plugin:"clients"});
							}
						});
					} else {
						client.raw = API.Contents.data.raw.clients[appointment.raw.client];
						client.dom = API.Contents.data.dom.clients[appointment.dom.client];
						API.GUI.insert(client.dom,{plugin:"clients"});
					}
					// Contact
					if(!API.Helper.isSet(API.Contents,['data','raw','contacts',appointment.raw.contact])){
						API.request('contacts','read',{data:{id:appointment.raw.contact,key:'id'},toast:false,pace:false},function(result){
							var dataset = JSON.parse(result);
							if(dataset.success != undefined){
								API.Helper.set(API.Contents,['data','dom','contacts',dataset.output.results.id],dataset.output.results);
								API.Helper.set(API.Contents,['data','raw','contacts',dataset.output.raw.id],dataset.output.raw);
								var contact = {};
								contact.raw = dataset.output.raw;
								contact.dom = dataset.output.results;
								API.GUI.insert(contact.dom,{plugin:"contacts"});
							}
						});
					} else {
						var contact = {};
						contact.raw = API.Contents.data.raw.contacts[appointment.raw.contact];
						contact.dom = API.Contents.data.dom.contacts[appointment.raw.contact];
						API.GUI.insert(contact.dom,{plugin:"contacts"});
					}
					// User
					if(!API.Helper.isSet(API.Contents,['data','raw','users',appointment.raw.assigned_to])){
						API.request('users','read',{data:{id:appointment.raw.assigned_to,key:'id'},toast:false,pace:false},function(result){
							var dataset = JSON.parse(result);
							if(dataset.success != undefined){
								API.Helper.set(API.Contents,['data','dom','users',dataset.output.results.username],dataset.output.results);
								API.Helper.set(API.Contents,['data','raw','users',dataset.output.raw.id],dataset.output.raw);
								var user = {};
								user.raw = dataset.output.raw;
								user.dom = dataset.output.results;
								API.GUI.insert(user.dom,{plugin:"users"});
							}
						});
					} else {
						var user = {};
						user.raw = API.Contents.data.raw.users[appointment.raw.assigned_to];
						user.dom = API.Contents.data.dom.users[appointment.dom.assigned_to];
						API.GUI.insert(user.dom,{plugin:"users"});
					}
					// Note
					GUI.isNoteReady = false;
					var note = {};
					note.raw = {};
					note.dom = {};
					API.request('notes','read',{
						data:{filters:[
							{ relationship:'equal', name:'relationship', value:'appointments'},
							{ relationship:'equal', name:'link_to', value:appointment.raw.id},
						]},
						toast:false,
						pace:false,
						report:true,
					},function(result){
						var dataset = JSON.parse(result);
						if(dataset.success != undefined){
							if(API.Helper.isSet(dataset,['output','results',0,'id'])){
								API.Helper.set(API.Contents,['data','dom','notes',dataset.output.results[0].id],dataset.output.results[0]);
								API.Helper.set(API.Contents,['data','raw','notes',dataset.output.raw[0].id],dataset.output.raw[0]);
								note.raw = dataset.output.raw[0];
								note.dom = dataset.output.results[0];
							}
							GUI.isNoteReady = true;
						}
					});
					// Divisions
					var divisions = {};
					divisions.raw = {};
					divisions.dom = {};
					if(appointment.raw.divisions != ''){
						for(const [akey, division] of Object.entries(appointment.raw.divisions.split(';'))){
							if(!API.Helper.isSet(API.Contents,['data','raw','divisions',division])){
								API.request('divisions','read',{toast:false,pace:false},function(result){
									var dataset = JSON.parse(result);
									if(dataset.success != undefined){
										for(const [key, value] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','dom','divisions',value.name],value); }
										for(const [key, value] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','divisions',value.id],value); }
										divisions.raw[division] = API.Contents.data.raw.divisions[division];
										divisions.dom[divisions.raw[division].name] = API.Contents.data.dom.divisions[divisions.raw[division].name];
									}
								});
							} else {
								divisions.raw[division] = API.Contents.data.raw.divisions[division];
								divisions.dom[divisions.raw[division].name] = API.Contents.data.dom.divisions[divisions.raw[division].name];
							}
						}
					}
					// Issues
					var issues = {};
					issues.raw = {};
					issues.dom = {};
					if(appointment.raw.issues != ''){
						for(const [akey, issue] of Object.entries(appointment.raw.issues.split(';'))){
							if(!API.Helper.isSet(API.Contents,['data','raw','issues',issue])){
								API.request('issues','read',{toast:false,pace:false},function(result){
									var dataset = JSON.parse(result);
									if(dataset.success != undefined){
										for(const [key, value] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','issues',value.id],value); }
										for(const [key, value] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','dom','issues',value.id],value); }
										issues.raw[issue] = API.Contents.data.raw.issues[issue];
										issues.dom[issue] = API.Contents.data.dom.issues[issue];
									}
								});
							} else {
								issues.raw[issue] = API.Contents.data.raw.issues[issue];
								issues.dom[issue] = API.Contents.data.dom.issues[issue];
							}
						}
					}
					// Statuses
					GUI.isStatusesReady = false;
					var statuses = {};
					statuses.raw = {};
					statuses.dom = {};
					API.request('status','read',{
						data:{filters:[
							{ relationship:'equal', name:'relationship', value:'clients'},
							{ relationship:'equal', name:'link_to', value:appointment.raw.client},
						]},
						toast:false,
						pace:false,
					},function(result){
						var dataset = JSON.parse(result);
						if(dataset.success != undefined){
							for(const [key, value] of Object.entries(dataset.output.raw)){
								API.Helper.set(API.Contents,['data','raw','status',value.id],value);
								API.Helper.set(statuses.raw,[value.type,value.record],value);
							}
							for(const [key, value] of Object.entries(dataset.output.results)){
								API.Helper.set(API.Contents,['data','dom','status',value.id],value);
								API.Helper.set(statuses.dom,[value.type,value.record],value);
							}
							var checkExistStatus = setInterval(function(){
								if((Object.keys(statuses.dom.divisions).length + Object.keys(statuses.dom.issues).length) == Object.keys(dataset.output.results).length){
									clearInterval(checkExistStatus);
									GUI.isStatusesReady = true;
								}
							}, 100);
						}
					});
					// GUI Header
					if(GUI.isModal){
						GUI.headerControls = GUI.header.find('.modal-title');
						GUI.headerControlsCSS = 'btn-xs';
						GUI.headerControls.html('<i class="icon icon-appointments mr-2"></i>');
						GUI.headerControls.append('<div class="btn-group btn-flat text-light border"></div>');
						GUI.headerControls = GUI.headerControls.find('.btn-group');
					} else {
						GUI.headerControls = $('#AppointmentHeader');
						GUI.headerControlsCSS = '';
						GUI.headerControls.addClass('p-2 mb-3');
						GUI.headerControls.append('<div class="btn-group btn-block text-light"></div>');
						GUI.headerControls = GUI.headerControls.find('.btn-group');
					}
					// GUI Schedule
					GUI.headerControls.append('<a class="btn btn-secondary '+GUI.headerControlsCSS+'" id="AppointmentSchedule"><i class="icon icon-schedule mr-1"></i>'+appointment.raw.date+' at '+appointment.raw.time+'</a>');
					// GUI Status
					GUI.txtColor = API.Contents.Statuses.appointments[appointment.raw.status].color == "warning" ? 'text-dark' : 'text-light'
					GUI.headerControls.append('<a class="btn btn-'+API.Contents.Statuses.appointments[appointment.raw.status].color+' '+GUI.txtColor+' '+GUI.headerControlsCSS+'" id="AppointmentStatus"><i class="'+API.Contents.Statuses.appointments[appointment.raw.status].icon+' mr-1"></i>'+API.Contents.Language[API.Contents.Statuses.appointments[appointment.raw.status].name]+'</a>');
					// GUI Assigned To
					if(appointment.raw.assigned_to != ''){
						var checkExistUser = setInterval(function() {
							if(API.Helper.isSet(API.Contents,['data','raw','users',appointment.raw.assigned_to])){
								var user = API.Contents.data.raw.users[appointment.raw.assigned_to];
								clearInterval(checkExistUser);
								GUI.headerControls.append('<a class="btn btn-info '+GUI.headerControlsCSS+'" id="AppointmentUser"><i class="icon icon-user mr-1"></i>'+user.username+'</a>');
							}
						}, 100);
					} else {
						GUI.headerControls.append('<a class="btn btn-info '+GUI.headerControlsCSS+'" id="AppointmentUser"><i class="icon icon-assign mr-1"></i>'+API.Contents.Language['Assign']+'</a>');
					}
					// GUI Notes
					API.Builder.card($('#AppointmentNote'),{title:'Notes',icon:'notes',css:'card-secondary'}, function(card){
						card.find('.card-body').addClass('p-0');
						API.Builder.input(card.find('.card-body'), 'content', '',function(input){
							var checkExistNote = setInterval(function() {
								if(GUI.isNoteReady){
									clearInterval(checkExistNote);
									if(API.Helper.isSet(note,['raw','content'])){
										input.find('.form-control').attr('data-note-id',note.raw.id);
										input.find('.form-control').summernote('code',note.raw.content);
									}
								}
							}, 100);
						});
					});
					// GUI Divisions
					if(appointment.raw.divisions != ''){
						var checkExistDivisions = setInterval(function() {
							if((typeof divisions.dom !== 'undefined')&&(!jQuery.isEmptyObject(divisions.dom))&&(Object.keys(divisions.dom).length == appointment.raw.divisions.split(';').length)&&(GUI.isStatusesReady)){
								clearInterval(checkExistDivisions);
								$('#AppointmentDivisions').html('');
								API.Builder.card($('#AppointmentDivisions'),{title:'Divisions',icon:'divisions',css:'card-primary card-outline'}, function(card){
									card.find('.card-body').addClass('p-0');
									card.find('.card-body').append('<div class="row py-0 px-2"></div>');
									var tableDivisions = card.find('.card-body').find('.row');
									tableDivisions.append('<div class="col-4 bg-dark text-light p-2">'+API.Contents.Language['Division']+'</div>');
									tableDivisions.append('<div class="col-8 bg-dark text-light p-2">'+API.Contents.Language['Status']+'</div>');
									for(const [key, value] of Object.entries(divisions.dom)){
										tableDivisions.append('<div class="col-4 p-2">'+key+'</div>');
										tableDivisions.append('<div class="col-8 text-right p-2"></div>');
										if(API.Helper.isSet(statuses.raw,['divisions',value.id])){
											API.Builder.input(tableDivisions.find('.col-8').last(), 'status', statuses.raw.divisions[value.id].status_id,{plugin:'divisions'},function(input){
												input.find('select').attr('data-division',value.id);
												input.find('select').attr('data-status',statuses.raw.divisions[value.id].id);
											});
										} else { API.Builder.input(tableDivisions.find('.col-8').last(), 'status', '',{plugin:'divisions'},function(input){
											input.find('select').attr('data-division',value.id);
										}); }
									}
								});
							}
						}, 100);
					}
					// GUI Issues
					if(appointment.raw.issues != ''){
						var checkExistIssues = setInterval(function() {
							if((typeof issues.dom !== 'undefined')&&(!jQuery.isEmptyObject(issues.dom))&&(Object.keys(issues.dom).length == appointment.raw.issues.split(';').length)&&(GUI.isStatusesReady)){
								clearInterval(checkExistIssues);
								$('#AppointmentIssues').html('');
								API.Builder.card($('#AppointmentIssues'),{title:'Issues',icon:'issues',css:'card-info card-outline'}, function(card){
									card.find('.card-body').addClass('p-0');
									card.find('.card-body').append('<div class="row py-0 px-2"></div>');
									var tableIssues = card.find('.card-body').find('.row');
									tableIssues.append('<div class="col-4 bg-dark text-light p-2">'+API.Contents.Language['Issue']+'</div>');
									tableIssues.append('<div class="col-8 bg-dark text-light p-2">'+API.Contents.Language['Status']+'</div>');
									for(const [key, value] of Object.entries(issues.dom)){
										tableIssues.append('<div class="col-4 p-2">'+key+' - '+value.name+'</div>');
										tableIssues.append('<div class="col-8 text-right p-2"></div>');
										if(API.Helper.isSet(statuses.raw,['issues',value.id])){
											API.Builder.input(tableIssues.find('.col-8').last(), 'status', statuses.raw.issues[value.id].status_id,{plugin:'issues'},function(input){
												input.find('select').attr('data-issue',value.id);
												input.find('select').attr('data-status',statuses.raw.issues[value.id].id);
											});
										} else {
											API.Builder.input(tableIssues.find('.col-8').last(), 'status', '',{plugin:'issues'},function(input){
												input.find('select').attr('data-issue',value.id);
											});
										}
									}
								});
							}
						}, 100);
					}
					// GUI Controls
					API.Plugins.appointments.GUI.controls.generate(appointment, GUI);
				}
			}, 100);
		},
	},
	GUI:{
		controls:{
			generate:function(appointment, GUI){
				// GUI Controls
				GUI.footer.find('div.btn-group').remove();
				if(GUI.isModal){ GUI.footer.append('<div class="btn-group text-light"></div>');
				} else { GUI.footer.append('<div class="btn-group btn-block text-light"></div>'); }
				var controls = GUI.footer.find('div.btn-group');
				if(appointment.raw.status < 3){
					controls.append('<a class="btn btn-success" data-action="start"><i class="icon icon-appointment mr-2"></i>'+API.Contents.Language['Start']+'</a>');
					controls.append('<a class="btn btn-danger" data-action="cancel"><i class="icon icon-appointment-end mr-2"></i>'+API.Contents.Language['Cancel']+'</a>');
				} else if(appointment.raw.status < 4) {
					controls.append('<a class="btn btn-danger" data-action="end"><i class="icon icon-appointment-end mr-2"></i>'+API.Contents.Language['End']+'</a>');
				}
				if(appointment.raw.status < 4){
					controls.append('<a class="btn btn-primary" data-action="reschedule"><i class="icon icon-schedule mr-2"></i>'+API.Contents.Language['Re-Schedule']+'</a>');
				}
				API.Plugins.appointments.GUI.controls.events(appointment, GUI);
			},
			events:function(appointment, GUI){
				var checkReady = setInterval(function() {
					if((GUI.isNoteReady)&&(GUI.isStatusesReady)){
						clearInterval(checkReady);
						// Fetch DOM
						// Note
						var note = {};
						note.element = $('#AppointmentNote').find('textarea').first();
						note.id = note.element.attr('data-note-id');
						note.content = note.element.summernote('code');
						// Statuses
						var status = {};
						status.divisions = {};
						$('#AppointmentDivisions').find('select').each(function(){
							var division = {};
							division.id = $(this).attr('data-division');
							division.status = $(this).select2('data')[0].id;
							status.divisions[division.id] = division.status;
						});
						status.issues = {};
						$('#AppointmentIssues').find('select').each(function(){
							var issue = {};
							issue.id = $(this).attr('data-issue');
							issue.status = $(this).select2('data')[0].id;
							status.issues[issue.id] = issue.status;
						});
						// GUI Controls's Events
						var controls = GUI.footer.find('div.btn-group');
						controls.find('a').each(function(){
							$(this).off();
							switch($(this).attr('data-action')){
								case"start":
									$(this).click(function(){
										var ready = false;
										// Update DB
										if(API.Helper.isSet(API.Contents,['data','raw','notes',note.id])){
											if(note.element.summernote('code') != note.content){
												API.Helper.set(API.Contents,['data','raw','notes',note.id],note.element.summernote('code'));
												API.request('notes','update',{
													data:{
														id:note.id,
														content:note.element.summernote('code'),
													},
													pace:false,
													toast:false,
												},function(){ ready = true; });
											} else { ready = true; }
										} else if((note.content.replace(/(<([^>]+)>)/gi, "") != '')||(note.element.summernote('code').replace(/(<([^>]+)>)/gi, "") != '')) {
											API.request('notes','create',{
												data:{
													by:API.Contents.Auth.User.id,
													content:note.element.summernote('code'),
													relationship:'appointments',
													link_to:appointment.raw.id,
												},
												pace:false,
												toast:false,
											},function(result){
												var dataset = JSON.parse(result);
												if(dataset.success != undefined){
													API.Helper.set(API.Contents,['data','dom','notes',dataset.output.results.id],dataset.output.results);
													API.Helper.set(API.Contents,['data','raw','notes',dataset.output.raw.id],dataset.output.raw);
													note.element.attr('data-note-id',dataset.output.raw.id);
												}
												ready = true;
											});
										} else { ready = true; }
										// Update Controls
										var checkUpdate = setInterval(function() {
											if(ready){
												clearInterval(checkUpdate);
												// Update DOM
												$('#AppointmentStatus').removeClass('btn-'+API.Contents.Statuses.appointments[appointment.raw.status].color+' '+GUI.txtColor);
												appointment.raw.status = 3;appointment.dom.status = 3;
												GUI.txtColor = API.Contents.Statuses.appointments[appointment.raw.status].color == "warning" ? 'text-dark' : 'text-light'
												$('#AppointmentStatus').addClass('btn-'+API.Contents.Statuses.appointments[appointment.raw.status].color+' '+GUI.txtColor);
												$('#AppointmentStatus').html('<i class="'+API.Contents.Statuses.appointments[appointment.raw.status].icon+' mr-1"></i>'+API.Contents.Language[API.Contents.Statuses.appointments[appointment.raw.status].name]);
												API.Plugins.appointments.GUI.controls.generate(appointment, GUI);
												API.request('appointments','update',{data:{id:appointment.raw.id, status:appointment.raw.status}});
											}
										}, 100);
									});
									break;
								case"cancel":
									$(this).click(function(){
										var ready = false;
										// Update DB
										if(API.Helper.isSet(API.Contents,['data','raw','notes',note.id])){
											if(note.element.summernote('code') != note.content){
												API.Helper.set(API.Contents,['data','raw','notes',note.id],note.element.summernote('code'));
												API.request('notes','update',{
													data:{
														id:note.id,
														content:note.element.summernote('code'),
													},
													pace:false,
													toast:false,
												},function(){ ready = true; });
											} else { ready = true; }
										} else if((note.content.replace(/(<([^>]+)>)/gi, "") != '')||(note.element.summernote('code').replace(/(<([^>]+)>)/gi, "") != '')) {
											API.request('notes','create',{
												data:{
													by:API.Contents.Auth.User.id,
													content:note.element.summernote('code'),
													relationship:'appointments',
													link_to:appointment.raw.id,
												},
												pace:false,
												toast:false,
											},function(result){
												var dataset = JSON.parse(result);
												if(dataset.success != undefined){
													API.Helper.set(API.Contents,['data','dom','notes',dataset.output.results.id],dataset.output.results);
													API.Helper.set(API.Contents,['data','raw','notes',dataset.output.raw.id],dataset.output.raw);
													note.element.attr('data-note-id',dataset.output.raw.id);
												}
												ready = true;
											});
										} else { ready = true; }
										// Update Controls
										var checkUpdate = setInterval(function() {
											if(ready){
												clearInterval(checkUpdate);
												if(note.element.summernote('code').replace(/(<([^>]+)>)/gi, "") != note.content.replace(/(<([^>]+)>)/gi, "")){
													// Update DOM
													$('#AppointmentStatus').removeClass('btn-'+API.Contents.Statuses.appointments[appointment.raw.status].color+' '+GUI.txtColor);
													appointment.raw.status = 6;appointment.dom.status = 6;
													GUI.txtColor = API.Contents.Statuses.appointments[appointment.raw.status].color == "warning" ? 'text-dark' : 'text-light'
													$('#AppointmentStatus').addClass('btn-'+API.Contents.Statuses.appointments[appointment.raw.status].color+' '+GUI.txtColor);
													$('#AppointmentStatus').html('<i class="'+API.Contents.Statuses.appointments[appointment.raw.status].icon+' mr-1"></i>'+API.Contents.Language[API.Contents.Statuses.appointments[appointment.raw.status].name]);
													API.Plugins.appointments.GUI.controls.generate(appointment, GUI);
													API.request('appointments','update',{data:{id:appointment.raw.id, status:appointment.raw.status}});
												} else { alert(API.Contents.Language['Please document your reason for canceling the appointment']); }
											}
										}, 100);
									});
									break;
								case"end":
									$(this).click(function(){
										var ready = false;
										var save = false;
										// Fetch info
										var statuses = [];
										// Divisions
										$('#AppointmentDivisions').find('select').each(function(){
											var division = {};
											division.id = $(this).attr('data-division');
											division.status = $(this).attr('data-status');
											division.status_id = $(this).select2('data')[0].id;
											var record = {
												status_id:division.status_id,
												type:'divisions',
												record:division.id,
												relationship:'clients',
												link_to:appointment.raw.client,
											}
											if((status.divisions[division.id] != division.status_id)||(division.status != undefined)){
												if(division.status != undefined){ record.id = division.status; }
												statuses.push(record);
												save = true;
											}
										});
										// Issues
										$('#AppointmentIssues').find('select').each(function(){
											var issue = {};
											issue.id = $(this).attr('data-issue');
											issue.status = $(this).attr('data-status');
											issue.status_id = $(this).select2('data')[0].id;
											var record = {
												status_id:issue.status_id,
												type:'issues',
												record:issue.id,
												relationship:'clients',
												link_to:appointment.raw.client,
											}
											if((status.issues[issue.id] != issue.status_id)||(issue.status != undefined)){
												if(issue.status != undefined){ record.id = issue.status; }
												statuses.push(record);
												save = true;
											}
										});
										// Update DB Note
										if(API.Helper.isSet(API.Contents,['data','raw','notes',note.id])){
											if(note.element.summernote('code') != note.content){
												API.Helper.set(API.Contents,['data','raw','notes',note.id],note.element.summernote('code'));
												API.request('notes','update',{
													data:{
														id:note.id,
														content:note.element.summernote('code'),
													},
													pace:false,
													toast:false,
												},function(){ ready = true; });
											} else { ready = true; }
										} else if((note.content.replace(/(<([^>]+)>)/gi, "") != '')||(note.element.summernote('code').replace(/(<([^>]+)>)/gi, "") != '')) {
											API.request('notes','create',{
												data:{
													by:API.Contents.Auth.User.id,
													content:note.element.summernote('code'),
													relationship:'appointments',
													link_to:appointment.raw.id,
												},
												pace:false,
												toast:false,
											},function(result){
												var dataset = JSON.parse(result);
												if(dataset.success != undefined){
													API.Helper.set(API.Contents,['data','dom','notes',dataset.output.results.id],dataset.output.results);
													API.Helper.set(API.Contents,['data','raw','notes',dataset.output.raw.id],dataset.output.raw);
													note.element.attr('data-note-id',dataset.output.raw.id);
												}
												ready = true;
											});
										} else { ready = true; }
										// Update Controls
										var checkUpdate = setInterval(function() {
											if(ready){
												clearInterval(checkUpdate);
												if(note.element.summernote('code').replace(/(<([^>]+)>)/gi, "") != note.content.replace(/(<([^>]+)>)/gi, "")){
													// Saving Statuses
													if((appointment.raw.status > 2)&&(save)){
														for(const [key, value] of Object.entries(statuses)){
															if(typeof value.id != "undefined"){ API.request('status','update',{data:value,toast:false,pace:false}); } else { API.request('status','create',{data:value,toast:false,pace:false}); }
														}
													}
													// Update DOM
													$('#AppointmentStatus').removeClass('btn-'+API.Contents.Statuses.appointments[appointment.raw.status].color+' '+GUI.txtColor);
													appointment.raw.status = 5;appointment.dom.status = 5;
													GUI.txtColor = API.Contents.Statuses.appointments[appointment.raw.status].color == "warning" ? 'text-dark' : 'text-light'
													$('#AppointmentStatus').addClass('btn-'+API.Contents.Statuses.appointments[appointment.raw.status].color+' '+GUI.txtColor);
													$('#AppointmentStatus').html('<i class="'+API.Contents.Statuses.appointments[appointment.raw.status].icon+' mr-1"></i>'+API.Contents.Language[API.Contents.Statuses.appointments[appointment.raw.status].name]);
													API.Plugins.appointments.GUI.controls.generate(appointment, GUI);
													API.request('appointments','update',{data:{id:appointment.raw.id, status:appointment.raw.status}});
												} else { alert(API.Contents.Language['Please document the appointment']); }
											}
										}, 100);
									});
									break;
								case"reschedule":
									$(this).click(function(){
										var ready = false;
										var save = false;
										// Fetch info
										var statuses = [];
										// Divisions
										$('#AppointmentDivisions').find('select').each(function(){
											var division = {};
											division.id = $(this).attr('data-division');
											division.status = $(this).attr('data-status');
											division.status_id = $(this).select2('data')[0].id;
											var record = {
												status_id:division.status_id,
												type:'divisions',
												record:division.id,
												relationship:'clients',
												link_to:appointment.raw.client,
											}
											if((status.divisions[division.id] != division.status_id)||(division.status != undefined)){
												if(division.status != undefined){ record.id = division.status; }
												statuses.push(record);
												save = true;
											}
										});
										// Issues
										$('#AppointmentIssues').find('select').each(function(){
											var issue = {};
											issue.id = $(this).attr('data-issue');
											issue.status = $(this).attr('data-status');
											issue.status_id = $(this).select2('data')[0].id;
											var record = {
												status_id:issue.status_id,
												type:'issues',
												record:issue.id,
												relationship:'clients',
												link_to:appointment.raw.client,
											}
											if((status.issues[issue.id] != issue.status_id)||(issue.status != undefined)){
												if(issue.status != undefined){ record.id = issue.status; }
												statuses.push(record);
												save = true;
											}
										});
										// Create Form
										API.Builder.modal($('body'), {
											title:'Re-Schedule',
											icon:'schedule',
											zindex:'top',
											css:{ header: "bg-primary"},
										}, function(modal){
											modal.on('hide.bs.modal',function(){ modal.remove(); API.Plugins.appointments.GUI.controls.generate(appointment, GUI); });
											modal.find('.modal-header').find('.btn-group').find('[data-control="hide"]').remove();
											modal.find('.modal-header').find('.btn-group').find('[data-control="update"]').remove();
											var body = modal.find('.modal-body');
											var footer = modal.find('.modal-footer');
											body.addClass('p-0')
											body.append('<div class="row px-2"></div>');
											API.Builder.input(body.find('div.row'), 'date', $('[data-plugin="appointments"][data-key="date"]').text(),function(input){
												input.find('input').attr('data-reschedule',appointment.raw.id);
												input.wrap('<div class="col-md-6 p-2"></div>');
											});
											API.Builder.input(body.find('div.row'), 'time', $('[data-plugin="appointments"][data-key="time"]').text(),function(input){
												input.find('input').attr('data-reschedule',appointment.raw.id);
												input.wrap('<div class="col-md-6 p-2"></div>');
											});
											API.Builder.input(body.find('div.row'), 'assigned_to', $('[data-plugin="appointments"][data-key="assigned_to"]').text(),function(input){
												input.find('select').attr('data-reschedule',appointment.raw.id);
												input.wrap('<div class="col-md-12 p-2"></div>');
											});
											footer.append('<div class="btn-group"><a class="btn btn-primary text-light"><i class="icon icon-schedule mr-1"></i>'+API.Contents.Language['Re-Schedule']+'</a></div>');
											footer.find('a').click(function(){
												// Update DB
												if(API.Helper.isSet(API.Contents,['data','raw','notes',note.id])){
													if(note.element.summernote('code') != note.content){
														API.Helper.set(API.Contents,['data','raw','notes',note.id],note.element.summernote('code'));
														API.request('notes','update',{
															data:{
																id:note.id,
																content:note.element.summernote('code'),
															},
															pace:false,
															toast:false,
														},function(){ ready = true; });
													} else { ready = true; }
												} else if((note.content.replace(/(<([^>]+)>)/gi, "") != '')||(note.element.summernote('code').replace(/(<([^>]+)>)/gi, "") != '')) {
													API.request('notes','create',{
														data:{
															by:API.Contents.Auth.User.id,
															content:note.element.summernote('code'),
															relationship:'appointments',
															link_to:appointment.raw.id,
														},
														pace:false,
														toast:false,
													},function(result){
														var dataset = JSON.parse(result);
														if(dataset.success != undefined){
															API.Helper.set(API.Contents,['data','dom','notes',dataset.output.results.id],dataset.output.results);
															API.Helper.set(API.Contents,['data','raw','notes',dataset.output.raw.id],dataset.output.raw);
															note.element.attr('data-note-id',dataset.output.raw.id);
														}
														ready = true;
													});
												} else { ready = true; }
												// Update Controls
												var checkUpdate = setInterval(function() {
													if(ready){
														clearInterval(checkUpdate);
														if(note.element.summernote('code').replace(/(<([^>]+)>)/gi, "") != note.content.replace(/(<([^>]+)>)/gi, "")){
															// Saving Statuses
															if((appointment.raw.status > 2)&&(save)){
                                for(const [key, value] of Object.entries(statuses)){
                                  if(typeof value.id != "undefined"){ API.request('status','update',{data:value,toast:false,pace:false}); } else { API.request('status','create',{data:value,toast:false,pace:false}); }
                                }
                              }
															// Create new appointment
															var followup = {};
															followup.date = $('[data-reschedule][data-key="date"]').val();
															followup.time = $('[data-reschedule][data-key="time"]').val();
															followup.assigned_to = $('[data-reschedule][data-key="assigned_to"]').select2('data')[0].id;
															if((followup.date != 'undefined')&&(followup.time != 'undefined')&&(followup.assigned_to != 'undefined')){
																if(API.Helper.isFuture(followup.date+' '+followup.time)){
																	API.request('appointments','create',{
																		data:{
																			date:followup.date,
																			time:followup.time,
																			status:1,
																			contact:appointment.raw.contact,
																			client:appointment.raw.client,
																			divisions:appointment.raw.divisions,
																			issues:appointment.raw.issues,
																			assigned_to:followup.assigned_to,
																		},
																		pace:false,
																		toast:false,
																	},function(result){
																		var dataset = JSON.parse(result);
																		if(dataset.success != undefined){
																			API.Helper.set(API.Contents,['data','dom','appointments',dataset.output.results.id],dataset.output.results);
																			API.Helper.set(API.Contents,['data','raw','appointments',dataset.output.raw.id],dataset.output.raw);
																		}
																	});
																	// Update DOM
																	$('#AppointmentStatus').removeClass('btn-'+API.Contents.Statuses.appointments[appointment.raw.status].color+' '+GUI.txtColor);
																	if(appointment.raw.status < 3){ appointment.raw.status = 4;appointment.dom.status = 4; } else { appointment.raw.status = 5;appointment.dom.status = 5; }
																	GUI.txtColor = API.Contents.Statuses.appointments[appointment.raw.status].color == "warning" ? 'text-dark' : 'text-light'
																	$('#AppointmentStatus').addClass('btn-'+API.Contents.Statuses.appointments[appointment.raw.status].color+' '+GUI.txtColor);
																	$('#AppointmentStatus').html('<i class="'+API.Contents.Statuses.appointments[appointment.raw.status].icon+' mr-1"></i>'+API.Contents.Language[API.Contents.Statuses.appointments[appointment.raw.status].name]);
																	API.request('appointments','update',{data:{id:appointment.raw.id, status:appointment.raw.status}});
																	modal.modal('hide');
																} else { alert(API.Contents.Language['The new appointment must be set in the future']); }
															} else { alert(API.Contents.Language['You have to set the date, time and user assigned to re-schedule']); }
														} else { alert(API.Contents.Language['Please document your reason for re-scheduling the appointment']); }
													}
												}, 100);
											});
											modal.modal('show');
										});
									});
									break;
							}
						});
					}
				}, 100);
			},
		},
	},
	extend:{
		clients:{
			init:function(){
				var url = new URL(window.location.href);
				if((typeof url.searchParams.get("v") !== "undefined")&&(url.searchParams.get("v") == 'details')){
					var checkExist = setInterval(function(){
						if(($('[data-plugin="clients"][data-key="id"]').html() != '')&&($('#clientsTabs').find('.tab-content').length > 0)){
							clearInterval(checkExist);
							var id = $('span[data-plugin="clients"][data-key="id"]').text();
							var name = $('span[data-plugin="clients"][data-key="name"]').text();
							if($('#clientsTools').find('[data-language="Start an Appointment"]').length <= 0){
								$('#clientsTools').prepend('<button type="button" class="btn btn-success"><i class="icon icon-appointment mr-1"></i><span data-language="Start an Appointment">'+API.Contents.Language['Start an Appointment']+'</span></button>');
								$('#clientsTools').find('button').first().click(function(){
									var now = new Date();
									API.CRUD.create.show({
										plugin:'appointments',
										table:API.Plugins.appointments.element.table.clients,
										hide:{
											id:'',
											created:'',
											modified:'',
											owner:'',
											updated_by:'',
											date:'',
											time:'',
											status:'',
											client:'',
											assigned_to:'',
										},
										set:{
											date:now.getFullYear()+'-'+now.getMonth()+'-'+now.getDate(),
											time:now.getHours()+':'+now.getMinutes()+':'+now.getSeconds(),
											status:3,
											client:name,
											assigned_to:API.Contents.Auth.User.id,
										},
									},function(submit, appointment){
										if(submit){ API.CRUD.read.show({ href:'?p=appointments&v=details&id='+appointment.id, title:appointment.id, keys:appointment, modal:true, element:API.Plugins.clients.element.modal.read }); }
									});
								});
							}
							API.request('appointments','read',{
								data:{filters:[
									{ relationship:'equal', name:'client', value:id},
								]},
								toast:false,
								pace:false,
							},function(result){
								var dataset = JSON.parse(result);
								if(typeof dataset.success !== 'undefined'){
									var readyNotes = false;
									var notes = [];
									for(const [key, value] of Object.entries(dataset.output.results)){
										API.Helper.set(API.Contents,['data','dom','appointments',value.id],value);
										API.request('notes','read',{
											data:{filters:[{relationship:'equal', name:'relationship', value:'appointments'},{relationship:'equal', name:'link_to', value:value.id}]},
											toast:false,
											pace:false,
										},function(result){
											var data = JSON.parse(result);
											if(typeof data.success !== 'undefined'){ notes.push(data.output.results[0]); }
											if(key == Object.keys(dataset.output.results)[Object.keys(dataset.output.results).length-1]){ readyNotes = true; }
										});
									}
									for(const [key, value] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','appointments',value.id],value); }
									API.Plugins.clients.Tabs.add('appointments', function(tab){
										API.Builder.table(tab, dataset.output.results, {
											headers:dataset.output.headers,
											id:'ClientsAppointments',
											modal:true,
											key:'id',
											set:{
												client:name,
												status:1,
												assigned_to:API.Contents.Auth.User.id,
											},
											plugin:'appointments',
											clickable:{
												enable:true,
												plugin:'appointments',
												view:'details',
											},
											predifined:{
												relationship:'%plugin%',
												link_to:'%id%',
											},
											breadcrumb:{
												title:'client',
											},
											import:{ key:'id', },
											controls:{
												toolbar:true,
											},
											modalWidth:'modal-lg',
										},function(table){ API.Plugins.appointments.element.table.clients = table.table; });
									});
									var checkNotes = setInterval(function(){
										if(readyNotes){
											clearInterval(checkNotes);
											if((!jQuery.isEmptyObject(API.Plugins.notes.element.table.clients))&&(notes.length > 0)){
												for(const [key, note] of Object.entries(notes)){
													if(typeof note !== "undefined"){
														API.Plugins.notes.element.table.clients.DataTable().row.add(note).draw(false)
													}
												}
											}
										}
									}, 100);
								}
							});
						}
					}, 100);
				}
			},
		},
	},
}

API.Plugins.appointments.init();
