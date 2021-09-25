API.Plugins.users = {
	element:{
		modal:{
			read:{},
		},
		table:{
			index:{},
		},
	},
	forms:{
		create:{
			0:"username",
			1:"password",
			contact:{
				0:"first_name",
				1:"last_name",
				2:"middle_name",
				3:"client",
				4:"job_title",
				5:"phone",
				6:"mobile",
				7:"office",
				8:"email",
			},
			extra:{
				0:"picture",
				1:"supervisor",
				2:"started_working_on",
				3:"birthday",
				4:"about",
			},
		},
		update:{
			0:"username",
			1:"password",
			contact:{
				0:"first_name",
				1:"last_name",
				2:"middle_name",
				3:"client",
				4:"job_title",
				5:"phone",
				6:"mobile",
				7:"office",
				8:"email",
			},
			extra:{
				0:"about",
				1:"picture",
				2:"supervisor",
				3:"started_working_on",
				4:"birthday",
			},
		},
	},
	options:{
		create:{
			skip:['token','reset_token','location','type','last_login','status','link_to','relationship'],
		},
		update:{
			skip:['token','reset_token','location','type','last_login','status','link_to','relationship'],
		},
	},
	init:function(){
		API.GUI.Sidebar.Nav.add('Users', 'administration');
	},
	load:{
		index:function(){
			API.Builder.card($('#pagecontent'),{ title: 'Users', icon: 'users'}, function(card){
				API.request('users','read',{
					data:{options:{ link_to:'UsersIndex',plugin:'users',view:'index' }},
				},function(result) {
					var dataset = JSON.parse(result);
					if(dataset.success != undefined){
						for(const [key, value] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','dom','users',value.username],value); }
						for(const [key, value] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','users',value.id],value); }
						API.Builder.table(card.children('.card-body'), dataset.output.results, {
							headers:dataset.output.headers,
							id:'UsersIndex',
							modal:true,
							key:'username',
							set:{
								'status':1,
								'type':'MySQL',
							},
							import:{ key:'username', },
							clickable:{ enable:true, view:'details'},
							controls:{ toolbar:true},
						},function(response){
							API.Plugins.users.element.table.index = response.table;
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
			var checkExist = setInterval(function(){
				if($('#userTabs').find('.tab-content').length > 0){
					clearInterval(checkExist);
					var url = new URL(window.location.href);
					var id = url.searchParams.get("id"), values = '';
					// Loading Content
					setTimeout(function() {
						$("[data-plugin="+url.searchParams.get("p")+"][data-key]").each(function(){
							values += $(this).html();
						});
						if(values == ''){
							API.request('users','read',{data:{id:id,key:'username'}},function(result){
								var dataset = JSON.parse(result);
								if(dataset.success != undefined){
									API.GUI.insert(dataset.output.results);
									API.Helper.set(API.Contents,['data','dom','users',dataset.output.results.username],dataset.output.results);
									API.Helper.set(API.Contents,['data','raw','users',dataset.output.raw.id],dataset.output.raw);
								}
							});
						} else {}
					}, 1000);
					// Read
					if(jQuery.isEmptyObject(API.Plugins.users.element.modal.read)){
						API.Builder.modal($('body'), {
							title:'Read',
							icon:'read',
							css:{ dialog:"modal-full", header: "bg-primary", body: "p-4"}
						}, function(modal){
							modal.find('.modal-header').find('.btn-group').find('[data-control="hide"]').remove();
							API.Plugins.users.element.modal.read = modal;
						});
					}
				}
			}, 100);
		},
	},
}

API.Plugins.users.init();
