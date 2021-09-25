API.Plugins.lsp = {
	init:function(){
		API.GUI.Sidebar.Nav.add('LSP', 'administration');
	},
	load:{
		index:function(){
			API.Builder.card($('#pagecontent'),{ title: 'LSP', icon: 'lsp'}, function(card){});
		},
	},
}

API.Plugins.lsp.init();
