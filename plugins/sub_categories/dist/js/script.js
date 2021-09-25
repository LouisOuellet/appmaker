API.Plugins.sub_categories = {
	element:{
		table:{
			index:{},
		},
	},
	init:function(){
		API.GUI.Sidebar.Nav.add('Sub_categories', 'development');
	},
	load:{
		index:function(){
			API.Builder.card($('#pagecontent'),{ title: 'Sub_categories', icon: 'sub_categories'}, function(card){
				API.request('sub_categories','read',{
					data:{options:{ link_to:'Sub_categoriesIndex',plugin:'sub_categories',view:'index' }},
				},function(result) {
					var dataset = JSON.parse(result);
					if(dataset.success != undefined){
						for(const [key, value] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','dom','sub_categories',value.name],value); }
						for(const [key, value] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','sub_categories',value.name],value); }
						API.Builder.table(card.children('.card-body'), dataset.output.results, {
							headers:dataset.output.headers,
							id:'Sub_categoriesIndex',
							modal:true,
							key:'name',
							clickable:{ enable:true, view:'details'},
							controls:{ toolbar:true},
							import:{ key:'id', },
						},function(response){
							API.Plugins.sub_categories.element.table.index = response.table;
						});
					}
				});
			});
		},
		details:function(){
			var url = new URL(window.location.href);
			var id = url.searchParams.get("id"), values = '';
			setTimeout(function() {
				$("[data-plugin="+url.searchParams.get("p")+"][data-key]").each(function(){
					values += $(this).html();
				});
				if(values == ''){
					API.request('sub_categories','read',{data:{id:id,key:'name'}},function(result){
						var dataset = JSON.parse(result);
						if(dataset.success != undefined){
							API.GUI.insert(dataset.output.results);
						}
					});
				}
			}, 1000);
		},
	},
	extend:{},
}

API.Plugins.sub_categories.init();
