API.Plugins.permissions = {
	element:{
		table:{index:{}},
	},
	forms:{
		create:{0:"name",1:"type",2:"level",extra:{ 0:"table"}},
		update:{0:"name",1:"type",2:"level",3:"lock",extra:{ 0:"table"}},
	},
	options:{create:{skip:['role_id']},update:{skip:['role_id']}},
	init:function(){
		API.GUI.Sidebar.Nav.add('Permissions', 'development');
	},
	load:{
		index:function(){
			API.Builder.card($('#pagecontent'),{ title: 'Permissions', icon: 'permissions'}, function(card){
				API.request('permissions','read',{
					data:{options:{ link_to:'PermissionsIndex',plugin:'permissions',view:'index' }},
				},function(result) {
					var dataset = JSON.parse(result);
					if(dataset.success != undefined){
						for(const [key, value] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','dom','permissions',value.name],value); }
						for(const [key, value] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','permissions',value.name],value); }
						API.Builder.table(card.children('.card-body'), dataset.output.results, {
							headers:dataset.output.headers,
							id:'PermissionsIndex',
							modal:true,
							key:'id',
							import:{ key:'id', },
							clickable:{ enable:true, view:'details'},
							controls:{ toolbar:true},
						},function(response){
							API.Plugins.permissions.element.table.index = response.table;
						});
					}
				});
			});
		},
	},
};

API.Plugins.permissions.init();
