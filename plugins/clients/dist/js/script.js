API.Plugins.clients = {
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
				1:"assigned_to",
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
		API.GUI.Sidebar.Nav.add('Clients', 'main_navigation');
	},
	load:{
		index:function(){
			API.Builder.card($('#pagecontent'),{ title: 'Clients', icon: 'clients'}, function(card){
				API.request('clients','read',{data:{}},function(result) {
					var dataset = JSON.parse(result);
					if(dataset.success != undefined){
						for(const [key, value] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','dom','clients',value.name],value); }
						for(const [key, value] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','clients',value.name],value); }
						API.Builder.table(card.children('.card-body'), dataset.output.results, {
							headers:dataset.output.headers,
							id:'ClientsIndex',
							modal:true,
							key:'name',
							plugin:"organizations",
							import:{ key:'name', },
							clickable:{ enable:true, plugin:'organizations', view:'details'},
							controls:{
								toolbar:true,
								disable:['create'],
								add:[
									{
										menu:'file',
										text:'<i class="icon icon-create mr-1"></i>'+API.Contents.Language['Create'],
										name:'create',
										action:function(){
											API.CRUD.create.show({plugin:'clients',table:API.Plugins.clients.element.table.index},function(status,row){});
										},
									},
								],
							}
						},function(response){
							API.Plugins.clients.element.table.index = response.table;
						});
					}
				});
			});
		},
	},
	extend:{},
}

API.Plugins.clients.init();
