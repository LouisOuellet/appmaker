API.Plugins.callbacks = {
	element:{
		table:{
			index:{},
			clients:{
				callbacks:{},
			},
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
		API.GUI.Sidebar.Nav.add('Callbacks', 'main_navigation');
	},
	load:{
		index:function(){
			API.Builder.card($('#pagecontent'),{ title: 'Callbacks', icon: 'callbacks'}, function(card){
				API.request('calls','read',{
					data:{
						options:{
							link_to:'CallbacksIndex',
							plugin:'callbacks',
							view:'index',
						},
						filters:[
							{ relationship:'lower', name:'smaller', value:3},
						],
					},
				},function(result) {
					var dataset = JSON.parse(result);
					if(dataset.success != undefined){
						for(const [key, value] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','dom','callbacks',value.id],value); }
						for(const [key, value] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','callbacks',value.id],value); }
						API.Builder.table(card.children('.card-body'), dataset.output.results, {
							headers:dataset.output.headers,
							id:'CallbacksIndex',
							modal:true,
							key:'id',
							breadcrumb:{
								title:'client',
							},
							controls:{ toolbar:true},
							plugin:"calls",
							import:{ key:'id', },
							clickable:{ enable:true, plugin:'calls', view:'details'},
						},function(response){
							API.Plugins.callbacks.element.table.index = response.table;
						});
					}
				});
			});
		},
	},
	extend:{
		clients:{
			init:function(){
				var url = new URL(window.location.href);
				if((typeof url.searchParams.get("v") !== "undefined")&&(url.searchParams.get("v") == 'details')){
					var checkExist = setInterval(function(){
						if(($('[data-plugin="clients"][data-key="id"]').text() != '')&&($('#clientsTabs').find('.tab-content').length > 0)){
							clearInterval(checkExist);
							var id = $('span[data-plugin="clients"][data-key="id"]').text();
							var name = $('span[data-plugin="clients"][data-key="name"]').text();
							API.request('calls','read',{
								data:{filters:[
									{ relationship:'equal', name:'client', value:id},
									{ relationship:'smaller', name:'status', value:3},
								]},
								toast:false,
								pace:false,
							},function(result){
								var dataset = JSON.parse(result), callbacks = [];
								if(typeof dataset.success !== 'undefined'){
									for(const [key, value] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','dom','callbacks',value.id],value); }
									for(const [key, value] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','callbacks',value.id],value); }
									API.Plugins.clients.Tabs.add('callbacks', function(tab){
										API.Builder.table(tab, dataset.output.results, {
											headers:dataset.output.headers,
											id:'ClientsCallbacks',
											modal:true,
											key:'id',
											set:{
												client:name,
												status:1,
												assigned_to:API.Contents.Auth.User.id,
											},
											plugin:'calls',
											clickable:{
												enable:true,
												plugin:'calls',
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
										},function(table){
											API.Plugins.callbacks.element.table.clients.callbacks = table.table;
										});
									});
								}
							});
						}
					}, 100);
				}
			},
		},
	},
}

API.Plugins.callbacks.init();
