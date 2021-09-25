API.Plugins.my_containers = {
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
			1:"code",
			contact_information:{
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
			1:"code",
			contact_information:{
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
	},
	options:{
		create:{
			skip:['status','assigned_to','issues','link_to','relationship'],
		},
		update:{
			skip:['status','assigned_to','issues','link_to','relationship'],
		},
	},
	init:function(){
		API.GUI.Sidebar.Nav.add('my_containers', 'main_navigation');
	},
	load:{
		index:function(){
			API.Builder.card($('#pagecontent'),{ title: 'my_containers', icon: 'my_containers'}, function(card){
				API.request('my_containers','read',{
					data:{client:API.Contents.Auth.User.client},
				},function(result) {
					var dataset = JSON.parse(result);
					if(dataset.success != undefined){
						for(const [key, value] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','dom','containers',value.id],value); }
						for(const [key, value] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','containers',value.id],value); }
						API.Builder.table(card.children('.card-body'), dataset.output.results, {
							headers:dataset.output.headers,
							id:'my_containersIndex',
							modal:true,
							key:'container_num',
							plugin:"containers",
							import:{ key:'container_num', },
							clickable:{ enable:true, plugin:'containers', view:'details'},
							controls:{ toolbar:true}
						},function(response){
							API.Plugins.my_containers.element.table.index = response.table;
						});
					}
				});
			});
		},
	},
}

API.Plugins.my_containers.init();
