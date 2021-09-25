API.Plugins.sales_genie = {
	extend:{
		clients:{
			init:function(){
				var url = new URL(window.location.href);
				if((typeof url.searchParams.get("v") !== "undefined")&&(url.searchParams.get("v") == 'details')){
					$('#clientsTools').prepend('<button type="button" class="btn btn-info"><i class="fas fa-upload mr-1"></i><span data-language="Import SalesGenie Data">'+API.Contents.Language['Import SalesGenie Data']+'</span></button>');
					$('#clientsTools').find('button').first().click(function(){
						console.log('Import SalesGenie')
					});
					API.Builder.card($('#clientsInformation').find('.card-body'),{ title: 'sales_genie', icon: 'sales_genie', css:'card-info collapsed-card'}, function(card){
						card.addClass('m-0');
						card.attr('data-card-widget',"collapse");
						card.find('.card-header').addClass('pointer');
						card.find('.card-tools').append('<button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-plus"></i></button>');
						card.find('.card-body').html('some content');
					});
				}
			},
		},
	},
}
