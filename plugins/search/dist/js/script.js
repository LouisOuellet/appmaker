API.Plugins.search = {
	element:{
		table:{
			index:{},
		},
		form:{
			search:{},
		},
		input:{
			search:{},
		},
		button:{
			search:{},
		},
	},
	init:function(){
		var isLanguageSet = setInterval(function(){
			if(API.Helper.isSet(API.Contents,['Language','Search'])){
				clearInterval(isLanguageSet);
				var html = '<form method="get" class="form-inline" style="height:56px; width:100%;">';
					html += '<div class="input-group" style="width:100%;border-radius: 0; height:100%;">';
						html += '<input class="form-control form-control-navbar" style="border-radius: 0;border-right: 0px; height:100%;box-shadow: inset 5px 0px 6px rgba(0,0,0,.16),inset 5px 0px 6px rgba(0,0,0,.23) !important;" type="search" name="query" placeholder="'+API.Contents.Language['Search']+'" aria-label="'+API.Contents.Language['Search']+'">';
						html += '<div class="input-group-append">';
							html += '<button type="button" class="btn btn-navbar pl-1 pr-3" style="border-radius: 0;box-shadow: inset -5px 0px 6px rgba(0,0,0,.16),inset -5px 0px 6px rgba(0,0,0,.23) !important;">';
								html += '<i class="fas fa-search"></i>';
							html += '</button>';
						html += '</div>';
					html += '</div>';
				html += '</form>';
				$('#DeskNav1').append(html);
				API.Plugins.search.element.form.search = $('#DeskNav1').find('form').last();
				API.Plugins.search.element.input.search = $('#DeskNav1').find('form').last().find('input');
				API.Plugins.search.element.button.search = $('#DeskNav1').find('form').last().find('button');
			}
		}, 100);
	},
	load:{
		index:function(){},
	},
}

API.Plugins.search.init();
