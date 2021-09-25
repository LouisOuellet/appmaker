API.Plugins.members = {
	forms:{
		create:{0:"name",extra:{ 0:"table"}},
		update:{0:"name",extra:{ 0:"table"}},
	},
	options:{create:{skip:['role_id']},update:{skip:['role_id']}},
};
API.Plugins.roles = {
	element:{
		table:{index:{},permissions:{},members:{}},
	},
	init:function(){
		API.GUI.Sidebar.Nav.add('Roles', 'administration');
	},
	load:{
		index:function(){
			API.Builder.card($('#pagecontent'),{ title: 'Roles', icon: 'roles'}, function(card){
				API.request('roles','read',{
					data:{options:{ link_to:'RolesIndex',plugin:'roles',view:'index' }},
				},function(result) {
					var dataset = JSON.parse(result);
					if(dataset.success != undefined){
						for(const [key, value] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','dom','roles',value.name],value); }
						for(const [key, value] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','roles',value.name],value); }
						API.Builder.table(card.children('.card-body'), dataset.output.results, {
							headers:dataset.output.headers,
							id:'RolesIndex',
							modal:true,
							key:'name',
							import:{ key:'name', },
							clickable:{ enable:true, view:'details'},
							controls:{ toolbar:true},
						},function(response){
							API.Plugins.roles.element.table.index = response.table;
						});
					}
				});
			});
		},
		details:function(){ API.Plugins.roles.GUI.Tabs.init(); },
	},
	GUI:{
		Tabs:{
			init:function(){
				const url = new URL(window.location.href);
				var id = url.searchParams.get("id");
				API.request('roles','fetch',{data:{id:id}},function(result){
					if(result.charAt(0) == '{'){
						var dataset = JSON.parse(result);
						var role = {
							dom:dataset.output.dom.role,
							raw:dataset.output.raw.role,
						}
						var permissions = [];
						for(var [key, permission] of Object.entries(dataset.output.dom.permissions)){
							permissions.push({
								id:permission.id,
								created:permission.created,
								modified:permission.modified,
								owner:permission.owner,
								created_by:permission.created_by,
								name:permission.name,
								type:permission.type,
								plugin:permission.plugin,
								table:permission.table,
								isLocked:permission.isLocked,
								role_id:permission.role_id,
							});
						}
						console.log(permissions);
						API.Plugins.roles.GUI.Tabs.add('permissions',function(content, tab){
							API.Builder.table(content, permissions, {
								id:'PermissionsIndex',
								modal:true,
								key:'name',
								plugin:'permissions',
								headers:['name','plugin','table','type','level','isLocked'],
								clickable:{ plugin:'permissions' },
								set:{ role_id:dataset.output.raw.role.id,lock:false },
								import:{ key:'name', },
								buttons:[
									{name: "Edit", text: "", color: "warning" },
									{name: "Delete", text: "", color: "danger" },
								],
								controls:{
									toolbar:false,
									label:false,
									disable:['create','hide','filter','selectAll','selectNone','assign','unassign','delete','import'],
									add:[
										{
											menu:'file',
											text:'<i class="icon icon-permission mr-1"></i>'+API.Contents.Language['Add'],
											name:'add',
											action:function(){
												API.Builder.modal($('body'), {
													title:'Add',
													icon:'permission',
													zindex:'top',
													css:{ header: "bg-success"},
												}, function(modal){
													var html = '';
													modal.on('hide.bs.modal',function(){ modal.remove(); });
													modal.find('.modal-header').find('.btn-group').find('[data-control="hide"]').remove();
													modal.find('.modal-header').find('.btn-group').find('[data-control="update"]').remove();
													var body = modal.find('.modal-body');
													var footer = modal.find('.modal-footer');
													body.addClass('p-0');
													html += '<div class="row px-2">';
														html += '<div class="col-12 p-2">';
															html += '<div class="input-group">';
																html += '<div class="input-group-prepend"><span class="input-group-text"><i class="icon icon-type mr-1"></i>'+API.Contents.Language['Type']+'</span></div>';
																html += '<select data-key="type" title="type" class="form-control select2bs4 select2-hidden-accessible" name="type">';
																	html += '<option></option>';
																	html += '<option value="api">API</option>';
																	html += '<option value="button">Button</option>';
																	html += '<option value="custom">Custom</option>';
																	html += '<option value="field">Field</option>';
																	html += '<option value="nav-item">NAV-Item</option>';
																	html += '<option value="nav-header">NAV-Header</option>';
																	html += '<option value="plugin">Plugin</option>';
																	html += '<option value="view">View</option>';
																	html += '<option value="smtp">SMTP</option>';
																	html += '<option value="table">Table</option>';
																	html += '<option value="widget">Widget</option>';
																html += '</select>';
															html += '</div>';
														html += '</div>';
														html += '<div class="col-12 p-2">';
															html += '<div class="input-group">';
																html += '<div class="input-group-prepend"><span class="input-group-text"><i class="icon icon-plugin mr-1"></i>'+API.Contents.Language['Plugin']+'</span></div>';
																html += '<select data-key="plugin" title="plugin" class="form-control select2bs4 select2-hidden-accessible" name="plugin">';
																for(const [key, value] of Object.entries(API.Contents.Plugins)){ if(value){ html += '<option value="'+key+'">'+API.Helper.ucfirst(API.Helper.clean(key))+'</option>'; } }
																html += '</select>';
															html += '</div>';
														html += '</div>';
														html += '<div class="col-12 p-2">';
															html += '<div class="input-group">';
																html += '<div class="input-group-prepend"><span class="input-group-text"><i class="icon icon-table mr-1"></i>'+API.Contents.Language['Table']+'</span></div>';
																html += '<select data-key="table" title="table" class="form-control select2bs4 select2-hidden-accessible" name="table">';
																html += '<option value=""></option>';
																for(const [key, value] of Object.entries(API.Contents.Tables)){ html += '<option value="'+value+'">'+API.Helper.ucfirst(value)+'</option>'; }
																html += '</select>';
															html += '</div>';
														html += '</div>';
														html += '<div class="col-12 p-2">';
															html += '<div class="input-group">';
																html += '<div class="input-group-prepend"><span class="input-group-text"><i class="icon icon-field mr-1"></i>'+API.Contents.Language['Field']+'</span></div>';
																html += '<select data-key="field" title="field" class="form-control select2bs4 select2-hidden-accessible" name="field">';
																html += '</select>';
															html += '</div>';
														html += '</div>';
														html += '<div class="col-12 p-2">';
															html += '<div class="input-group">';
																html += '<div class="input-group-prepend"><span class="input-group-text"><i class="icon icon-view mr-1"></i>'+API.Contents.Language['View']+'</span></div>';
																html += '<select data-key="view" title="view" class="form-control select2bs4 select2-hidden-accessible" name="view">';
																html += '</select>';
															html += '</div>';
														html += '</div>';
														html += '<div class="col-12 p-2">';
															html += '<div class="input-group">';
																html += '<div class="input-group-prepend"><span class="input-group-text"><i class="icon icon-name mr-1"></i>'+API.Contents.Language['Name']+'</span></div>';
												      	html += '<input type="text" class="form-control" data-key="name" name="name" placeholder="'+API.Contents.Language['Name']+'" title="name">';
															html += '</div>';
														html += '</div>';
														html += '<div class="col-12 p-2">';
															html += '<div class="input-group">';
																html += '<div class="input-group-prepend"><span class="input-group-text"><i class="icon icon-level mr-1"></i>'+API.Contents.Language['Level']+'</span></div>';
																html += '<select data-key="level" title="level" class="form-control select2bs4 select2-hidden-accessible" name="level">';
																	html += '<option value="0">None</option>';
																	html += '<option value="1">Read</option>';
																	html += '<option value="2">Create</option>';
																	html += '<option value="3">Edit</option>';
																	html += '<option value="4">Delete</option>';
																html += '</select>';
															html += '</div>';
														html += '</div>';
													html += '</div>';
													body.html(html);
													html = '';
													var field = {};
													body.find('select').each(function(){
														field[$(this).attr('data-key')]=$(this).parent('.input-group').parent('.col-12');
														if($(this).attr('data-key') != 'type'){ field[$(this).attr('data-key')].hide(); }
													});
													body.find('input').each(function(){
														field[$(this).attr('data-key')]=$(this).parent('.input-group').parent('.col-12');
														if($(this).attr('data-key') != 'type'){ field[$(this).attr('data-key')].hide(); }
													});
													body.find('select').select2({ theme: 'bootstrap4' });
													body.find('select[data-key="type"]').on('select2:select',function(type){
														if(type.currentTarget.value != ''){
															switch(type.currentTarget.value){
																case"api":
																case"widget":
																case"plugin":
																case"nav-item":
																	for(const [key, value] of Object.entries(field)){ if(key != 'type'){ value.hide(); }}
																	field.plugin.show();
																	field.level.show();
																	break;
																case"field":
																	for(const [key, value] of Object.entries(field)){ if(key != 'type'){ value.hide(); }}
																	field.table.show();
																	field.table.find('select').on('select2:select',function(table){
																		if(table.currentTarget.value != ''){
																			html = '';
																			for(const [key, value] of Object.entries(API.Contents.Settings.Structure[table.currentTarget.value])){ html += '<option value="'+key+'">'+API.Helper.ucfirst(API.Helper.clean(key))+'</option>'; }
																			field.field.find('select').html(html);
																			html = '';
																			field.field.find('select').select2({ theme: 'bootstrap4' });
																			field.field.show();
																			field.level.show();
																		} else {
																			field.field.hide();
																			field.level.hide();
																		}
																	});
																	break;
																case"view":
																	for(const [key, value] of Object.entries(field)){ if(key != 'type'){ value.hide(); }}
																	field.plugin.show();
																	field.plugin.find('select').on('select2:select',function(plugin){
																		if(plugin.currentTarget.value != ''){
																			html = '';
																			for(const [key, value] of Object.entries(API.Contents.Views[plugin.currentTarget.value])){ html += '<option value="'+value+'">'+API.Helper.ucfirst(API.Helper.clean(value))+'</option>'; }
																			field.view.find('select').html(html);
																			html = '';
																			field.view.find('select').select2({ theme: 'bootstrap4' });
																			field.view.show();
																			field.level.show();
																		} else {
																			field.view.hide();
																			field.level.hide();
																		}
																	});
																	break;
																case"table":
																	for(const [key, value] of Object.entries(field)){ if(key != 'type'){ value.hide(); }}
																	field.table.show();
																	field.level.show();
																	break;
																case"nav-header":
																case"button":
																case"custom":
																case"smtp":
																	for(const [key, value] of Object.entries(field)){ if(key != 'type'){ value.hide(); }}
																	field.name.show();
																	field.level.show();
																	break;
																default:
																	for(const [key, value] of Object.entries(field)){ if(key != 'type'){ value.hide(); }}
																	break;
															}
														} else {
															for(const [key, value] of Object.entries(field)){ if(key != 'type'){ value.hide(); }}
														}
													});
													footer.append('<a class="btn btn-success text-light"><i class="icon icon-permission mr-1"></i>Add</a>');
													footer.find('a').click(function(){
														var values = {
															type:field.type.find('select').select2('data')[0].id,
															level:field.level.find('select').select2('data')[0].id,
															role_id:role.raw.id,
														}
														switch(values.type){
															case"api":
															case"plugin":
															case"widget":
															case"nav-item":
																values.name = field.plugin.find('select').select2('data')[0].id;
																break;
															case"table":
																values.name = field.table.find('select').select2('data')[0].id;
																break;
															case"custom":
															case"button":
															case"smtp":
															case"nav-header":
																values.name = field.name.find('input').val();
																break;
															case"field":
																values.table = field.table.find('select').select2('data')[0].id;
																values.name = field.field.find('select').select2('data')[0].id;
																break;
															case"view":
																values.plugin = field.plugin.find('select').select2('data')[0].id;
																values.name = field.view.find('select').select2('data')[0].id;
																break;
														}
														API.request('permissions','create',{data:values,report:false},function(result){
															var permission = JSON.parse(result);
															if(permission.success != undefined){
																API.Plugins.roles.element.table.permissions.DataTable().row.add(permission.output.results).draw(false).node().id = permission.output.results.id;
																API.Plugins.roles.Event.Permissions();
															}
														});
														modal.modal('hide');
													});
													modal.modal('show');
												});
											},
										},
									],
								},
							},function(table){
								API.Plugins.roles.element.table.permissions = table.table;
								API.Plugins.roles.element.table.permissions.DataTable().on('draw.dt',function(){
									API.Plugins.roles.Event.Permissions();
								});
								API.Plugins.roles.Event.Permissions();
							});
						});
						var members = [];
						for(const [key, value] of Object.entries(dataset.output.dom.members)){
							if(typeof value.username !== "undefined"){ members.push({type:'user',name:value.username,id:value.id,key:key}); }
							else { members.push({type:'group',name:value.name,id:value.id,key:key}); }
						}
						API.Plugins.roles.GUI.Tabs.add('members',function(content, tab){
							API.Builder.table(content, members, {
								id:'MembersIndex',
								modal:true,
								key:'name',
								plugin:'members',
								headers:['name','type','id'],
								import:{ key:'name', },
								buttons:[
									{name:"Unlink",text: "Remove",color: "danger"},
								],
								hide:['id'],
								controls:{
									toolbar:false,
									label:false,
									disable:['create','hide','filter','selectAll','selectNone','assign','unassign','delete','import'],
									add:[
										{menu:'file',name:'add',text:'<i class="icon icon-assign mr-1"></i>'+API.Contents.Language['Add'],action:function(){
											API.Builder.modal($('body'), {
												title:'Add',
												icon:'assign',
												zindex:'top',
												css:{ header: "bg-success"},
											}, function(modal){
												var html = '';
												modal.on('hide.bs.modal',function(){ modal.remove(); });
												modal.find('.modal-header').find('.btn-group').find('[data-control="hide"]').remove();
												modal.find('.modal-header').find('.btn-group').find('[data-control="update"]').remove();
												var body = modal.find('.modal-body');
												var footer = modal.find('.modal-footer');
												body.addClass('p-0');
												html += '<ul class="nav nav-success nav-flat nav-pills nav-justified p-0 m-0">';
													html += '<li class="nav-item"><a class="nav-link active" href="#add_groups_tab" data-toggle="tab">Groups</a></li>';
													html += '<li class="nav-item"><a class="nav-link" href="#add_users_tab" data-toggle="tab">Users</a></li>';
												html += '</ul>';
												html += '<div class="tab-content p-2">';
													html += '<div class="tab-pane active" id="add_groups_tab"></div>';
													html += '<div class="tab-pane" id="add_users_tab"></div>';
												html += '</div>';
												body.html(html);
												API.Builder.input(body.find('#add_groups_tab'), 'group', null,function(input){});
												API.Builder.input(body.find('#add_users_tab'), 'user', null,function(input){});
												footer.append('<a class="btn btn-success text-light"><i class="icon icon-assign mr-1"></i>Add</a>');
												footer.find('a').click(function(){
													var relationship = {
														relationship_2:'roles',
														link_to_2:role.raw.id,
													}
													switch(body.find('.active').attr('href')){
														case"#add_groups_tab":
															relationship.relationship_1 = "groups";
															relationship.link_to_1 = body.find('select[data-key="group"]').select2('data')[0].id;
															break;
														case"#add_users_tab":
															relationship.relationship_1 = "users";
															relationship.link_to_1 = body.find('select[data-key="user"]').select2('data')[0].id;
															break;
													}
													API.request('relationships','create',{data:relationship},function(result){
														var member = JSON.parse(result);
														if(member.success != undefined){
															API.Plugins.roles.element.table.members.DataTable().row.add({name:member.output.results.link_to_1,type:member.output.results.relationship_1,id:member.output.results.id}).draw(false).node().id = member.output.results.id;
															API.Plugins.roles.Event.Members();
														}
													});
													modal.modal('hide');
												});
												modal.modal('show');
											});
										}},
									],
								},
							},function(table){
								API.Plugins.roles.element.table.members = table.table;
								API.Plugins.roles.element.table.members.DataTable().on('draw.dt',function(){
									API.Plugins.roles.Event.Members();
								});
								API.Plugins.roles.Event.Members();
							});
						});
					}
				});
			},
			add:function(name, options = {}, callback = null){
				if(options instanceof Function){ callback = options; options = {}; }
				var tabs = $('#rolesTabs').find('.card-header').find('ul').first();
				var contents = $('#rolesTabs').find('.card-body').find('div.tab-content').first();
				tabs.append('<li class="nav-item"><a class="nav-link" data-toggle="pill" role="tab" id="rolesTabs-'+name.toLowerCase()+'" href="#rolesTabsContent-'+name.toLowerCase()+'" aria-controls="rolesTabsContent-'+name.toLowerCase()+'">'+API.Helper.ucfirst(name)+'</a></li>');
				tabs.find('a.nav-link').removeClass('active');
				tabs.find('a.nav-link').first().addClass('active');
				contents.append('<div class="tab-pane fade" id="rolesTabsContent-'+name.toLowerCase()+'" role="tabpanel" aria-labelledby="rolesTabs-'+name.toLowerCase()+'"></div>');
				contents.find('div.tab-pane').removeClass('show active');
				contents.find('div.tab-pane').first().addClass('show active');
				if(callback != null){ callback(contents.find('div.tab-pane').last(), tabs.find('li.nav-item').last()); }
			},
		}
	},
	Event:{
		Members:function(){
			API.Plugins.roles.element.table.members.find('button').each(function(){
				var control = $(this).attr('data-control');
				var table = API.Plugins.roles.element.table.members;
				var row = table.DataTable().row($(this).parents('tr'));
				var rowdata = row.data();
				$(this).off();
				$(this).click(function(){
					API.Builder.modal($('body'), {
						title:'Unlink',
						icon:'unlink',
						zindex:'top',
						css:{ header: "bg-danger"},
					}, function(modal){
						modal.on('hide.bs.modal',function(){ modal.remove(); });
						modal.find('.modal-header').find('.btn-group').find('[data-control="hide"]').remove();
						modal.find('.modal-header').find('.btn-group').find('[data-control="update"]').remove();
						var body = modal.find('.modal-body');
						var footer = modal.find('.modal-footer');
						body.html('Are you sure you want to remove this member from the role?');
						footer.append('<a class="btn btn-danger text-light"><i class="icon icon-unlink mr-1"></i>Remove</a>');
						footer.find('a').click(function(){
							API.request('relationships','delete',{data:rowdata},function(result){
								var member = JSON.parse(result);
								if(member.success != undefined){ table.DataTable().row($('#'+rowdata.id)).remove().draw(false); }
							});
							modal.modal('hide');
						});
						modal.modal('show');
					});
				});
			});
		},
		Permissions:function(){
			API.Plugins.roles.element.table.permissions.find('button').each(function(){
				var control = $(this).attr('data-control');
				var table = API.Plugins.roles.element.table.permissions;
				var row = table.DataTable().row($(this).parents('tr'));
				var rowdata = row.data();
				$(this).off();
				switch(control){
					case"Edit":
						$(this).off().click(function(){
							API.Builder.modal($('body'), {
								title:'Edit',
								icon:'edit',
								zindex:'top',
								css:{ header: "bg-warning"},
							}, function(modal){
								var html = '';
								modal.on('hide.bs.modal',function(){ modal.remove(); });
								modal.find('.modal-header').find('.btn-group').find('[data-control="hide"]').remove();
								modal.find('.modal-header').find('.btn-group').find('[data-control="update"]').remove();
								var body = modal.find('.modal-body');
								var footer = modal.find('.modal-footer');
								body.addClass('p-0');
								html += '<div class="row px-2">';
									html += '<div class="col-12 p-2">';
										html += '<div class="input-group">';
											html += '<div class="input-group-prepend"><span class="input-group-text"><i class="icon icon-level mr-1"></i>'+API.Contents.Language['Level']+'</span></div>';
											html += '<select data-key="level" title="level" class="form-control select2bs4 select2-hidden-accessible" name="level">';
												html += '<option value="0">None</option>';
												html += '<option value="1">Read</option>';
												html += '<option value="2">Create</option>';
												html += '<option value="3">Edit</option>';
												html += '<option value="4">Delete</option>';
											html += '</select>';
										html += '</div>';
									html += '</div>';
									html += '<div class="col-12 p-2">';
										html += '<div class="input-group">';
											html += '<div class="input-group-prepend"><span class="input-group-text"><i class="icon icon-locked mr-1"></i>Locked</span></div>';
											html += '<input type="text" class="form-control switch-spacer" disabled>';
											html += '<div class="input-group-append">';
												html += '<div class="input-group-text p-1">';
													html += '<input type="checkbox" data-key="isLocked" name="isLocked" title="Locked">';
												html += '</div>';
											html += '</div>';
										html += '</div>';
									html += '</div>';
								html += '</div>';
								body.html(html);
								html = '';
								body.find('select').val(rowdata.level);
								body.find('select').select2({ theme: 'bootstrap4' });
								var lock = body.find('input[type="checkbox"][data-key="isLocked"]');
								modal.on("shown.bs.modal",function(){
									if((rowdata.isLocked == "true")||(rowdata.isLocked == true)){ lock.bootstrapSwitch('state', true); }
									else { lock.bootstrapSwitch('state', false); }
								});
								footer.append('<a class="btn btn-warning"><i class="icon icon-edit mr-1"></i>Edit</a>');
								footer.find('a').click(function(){
									var values = rowdata;
									values.level = body.find('select').select2('data')[0].id;
									values.isLocked = lock.bootstrapSwitch('state');
									API.request('permissions','update',{data:values,report:true},function(result){
										var dataset = JSON.parse(result);
										if(dataset.success != undefined){
											row.data(dataset.output.results).draw(false);
											API.Plugins.roles.Event.Permissions();
										}
									});
									modal.modal('hide');
								});
								modal.modal('show');
							});
						});
						break;
					case"Delete":
						if((rowdata.isLocked == "true")||(rowdata.isLocked == true)){ $(this).remove(); }
						else {
							$(this).off().click(function(){
								API.Builder.modal($('body'), {
									title:'Delete',
									icon:'delete',
									zindex:'top',
									css:{ header: "bg-danger"},
								}, function(modal){
									var html = '';
									modal.on('hide.bs.modal',function(){ modal.remove(); });
									modal.find('.modal-header').find('.btn-group').find('[data-control="hide"]').remove();
									modal.find('.modal-header').find('.btn-group').find('[data-control="update"]').remove();
									var body = modal.find('.modal-body');
									var footer = modal.find('.modal-footer');
									body.html(API.Contents.Language['Are you sure you want to remove this permission?']);
									footer.append('<a class="btn btn-danger text-light"><i class="icon icon-delete mr-1"></i>Delete</a>');
									footer.find('a').click(function(){
										API.request('permissions','delete',{data:rowdata,report:false},function(result){
											var dataset = JSON.parse(result);
											if(dataset.success != undefined){
												row.remove().draw(false);
												API.Plugins.roles.Event.Permissions();
											}
										});
										modal.modal('hide');
									});
									modal.modal('show');
								});
							});
						}
						break;
				}
			});
		},
	},
}

API.Plugins.roles.init();
