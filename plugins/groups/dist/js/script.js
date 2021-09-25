API.Plugins.groups = {
	element:{
		table:{
			index:{},
			members:{},
		},
	},
	forms:{
		create:{
			0:"name",
		},
		update:{
			0:"name",
		},
	},
	options:{
		create:{
			skip:['type'],
			skip:['location'],
		},
		update:{
			skip:['type'],
			skip:['location'],
		},
	},
	init:function(){
		API.GUI.Sidebar.Nav.add('Groups', 'administration');
	},
	load:{
		index:function(){
			API.Builder.card($('#pagecontent'),{ title: 'Groups', icon: 'groups'}, function(card){
				API.request('groups','read',{
					data:{options:{ link_to:'GroupsIndex',plugin:'groups',view:'index' }},
				},function(result){
					var dataset = JSON.parse(result);
					if(dataset.success != undefined){
						for(const [key, value] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','dom','groups',value.name],value); }
						for(const [key, value] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','groups',value.id],value); }
						API.Builder.table(card.children('.card-body'), dataset.output.results, {
							headers:dataset.output.headers,
							id:'GroupsIndex',
							modal:true,
							key:'name',
							set:{
								type:"MySQL",
							},
							import:{ key:'name', },
							clickable:{ enable:true, view:'details'},
							controls:{ toolbar:true},
						},function(response){
							API.Plugins.groups.element.table.index = response.table;
							response.table.find('button[data-control="Edit"]').each(function(){
								var btn = $(this);
								var data = response.datatable.row($(this).parents('tr')).data();
								if(data.type != "MySQL"){ btn.remove(); }
							});
							response.table.find('button[data-control="Delete"]').each(function(){
								var btn = $(this);
								var data = response.datatable.row($(this).parents('tr')).data();
								if(data.type != "MySQL"){ btn.remove(); }
							});
						});
					}
				});
			});
		},
		details:function(){
			// Init Details
			var url = new URL(window.location.href);
			var id = url.searchParams.get("id");
			var container = $('div[data-plugin="groups"][data-id]').last();
			var membersCTN = container.find('div[data-list="members"]');
			if(container.parent('.modal-body').length > 0){
				var thisModal = container.parent('.modal-body').parent().parent().parent();
			}
			// Fetch Information
			API.request(url.searchParams.get("p"),'get',{data:{id:id,key:'name'}},function(result){
				var dataset = JSON.parse(result);
				if(dataset.success != undefined){
					container.attr('data-id',dataset.output.organization.raw.id);
					API.GUI.insert(dataset.output.organization.dom);
					var users = [];
					if(!API.Helper.isSet(dataset.output.details,['users','dom'])){ dataset.output.details.users = {dom:[],raw:[]}; }
					for(var [id, user] of Object.entries(dataset.output.details.users.dom)){ users.push(user); }
					API.Builder.table(membersCTN, users, {
						headers:['username'],
						id:'groupsMembersTable',
						modal:true,
						key:'username',
						plugin:'users',
						clickable:{
							enable:true,
							plugin:'users',
							view:'details',
						},
						predifined:{
							relationship:'%plugin%',
							link_to:'%id%',
						},
						buttons:[
							{
								name:"Unlink",
								text: "Remove",
								color: "danger",
							},
						],
						controls:{
							toolbar:false,
							label:false,
							disable:['create','hide','filter','selectAll','selectNone','assign','unassign','delete','import'],
							add:[
								{
									menu:'file',
									text:'<i class="icon icon-assign mr-1"></i>'+API.Contents.Language['Add'],
									name:'add',
									action:function(){
										API.Builder.modal($('body'), {
											title:'Add',
											icon:'assign',
											zindex:'top',
											css:{ header: "bg-success"},
										}, function(modal){
											modal.on('hide.bs.modal',function(){ modal.remove(); });
											modal.find('.modal-header').find('.btn-group').find('[data-control="hide"]').remove();
											modal.find('.modal-header').find('.btn-group').find('[data-control="update"]').remove();
											var body = modal.find('.modal-body');
											var footer = modal.find('.modal-footer');
											API.Builder.input(body, 'user', null,function(input){});
											footer.append('<a class="btn btn-success text-light"><i class="icon icon-assign mr-1"></i>Add</a>');
											footer.find('a').click(function(){
												group = {};
												for(var [key, value] of Object.entries(dataset.output.organization.raw)){ group[key] = value; }
												group.relationship = {relationship:'users',link_to:body.find("select").select2("val")}
												API.request(url.searchParams.get("p"),'link',{data:group,},function(result){
													var data = JSON.parse(result);
													if(data.success != undefined){
														API.Plugins.groups.element.table.members.DataTable().row.add({username:data.output.dom.username}).draw(false).node().id = data.output.dom;
														API.Plugins.groups.Events.unlink(membersCTN,dataset.output.organization.raw);
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
						API.Plugins.groups.Events.unlink(membersCTN, dataset.output.organization.raw);
					});
				}
			});
		},
	},
	Events:{
		unlink:function(membersCTN, group){
			// Init Details
			var url = new URL(window.location.href);
			var table = membersCTN.find('table');
			membersCTN.find('tr').each(function(){
				var tr = $(this);
				var btn = tr.find('button[data-control="Unlink"]');
				if(btn.length > 0){
					var user = table.DataTable().row(tr).data();
					btn.off().click(function(){
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
							body.html('Are you sure you want to remove this user from the group?');
							footer.append('<a class="btn btn-danger text-light"><i class="icon icon-unlink mr-1"></i>Remove</a>');
							footer.find('a').click(function(){
								group.relationship = {relationship:'users',link_to:user.id};
								console.log({group:group,user:user});
								API.request(url.searchParams.get("p"),'unlink',{data:group},function(result){
									var data = JSON.parse(result);
									if(data.success != undefined){ table.DataTable().row(tr).remove().draw(false); }
								});
								modal.modal('hide');
							});
							modal.modal('show');
						});
					});
				}
			});
		},
	},
}

API.Plugins.groups.init();
