API.Plugins.debug = {
	init:function(){
		var html = '', color = '', icon = '', txt = '';
		API.GUI.ControlSidebar.add('User', 'fas fa-redo-alt fa-spin');
		API.GUI.ControlSidebar.add('Groups', 'fas fa-redo-alt fa-spin');
		API.GUI.ControlSidebar.add('Roles', 'fas fa-redo-alt fa-spin');
		API.GUI.ControlSidebar.add('Permissions', 'fas fa-redo-alt fa-spin');
		var checkExist = setInterval(function() {
			if((API.Contents.Auth != undefined)&&(API.Contents.Auth.User != undefined)){
				clearInterval(checkExist);
				html = '<div class="row bg-lightblue mb-2" style="border-radius: 4px;">';
				html += '<div class="col-md-12 pt-2">';
				html += '<h5>USER DATA</h5>';
				html += '</div></div><div class="row">';
				$.each(API.Contents.Auth.User,function(index, value){
					html += '<div class="col-md-3">';
					html += '<b>'+index+': </b></div>';
					html += '<div class="col-md-9">'+value+'</div>';
				});
				html += '</div>';
				$('#ctrsdbr-user-tab i').attr('class','fas fa-user');
				$('#ctrsdbr-user-tab-content').html(html);
			}
			if((API.Contents.Auth != undefined)&&(API.Contents.Auth.Groups != undefined)){
				html = '<div class="row bg-lightblue mb-2" style="border-radius: 4px;">';
				html += '<div class="col-md-12 pt-2">';
				html += '<h5>GROUPS DATA</h5>';
				html += '</div></div><div class="row">';
				$.each(API.Contents.Auth.Groups,function(index, value){
					html += '<div class="col-md-3">';
					html += '<b>'+index+': </b></div>';
					html += '<div class="col-md-9">'+value+'</div>';
				});
				html += '</div>';
				$('#ctrsdbr-groups-tab i').attr('class','fas fa-users');
				$('#ctrsdbr-groups-tab-content').html(html);
			}
			if((API.Contents.Auth != undefined)&&(API.Contents.Auth.Roles != undefined)){
				html = '<div class="row bg-lightblue mb-2" style="border-radius: 4px;">';
				html += '<div class="col-md-12 pt-2">';
				html += '<h5>ROLES DATA</h5>';
				html += '</div></div><div class="row">';
				$.each(API.Contents.Auth.Roles,function(index, value){
					html += '<div class="col-md-3">';
					html += '<b>'+index+': </b></div>';
					html += '<div class="col-md-9">'+value+'</div>';
				});
				html += '</div>';
				$('#ctrsdbr-roles-tab i').attr('class','fas fa-shield-alt');
				$('#ctrsdbr-roles-tab-content').html(html);
			}
			if((API.Contents.Auth != undefined)&&(API.Contents.Auth.Permissions != undefined)){
				html = '<div class="row bg-lightblue mb-2" style="border-radius: 4px;">';
				html += '<div class="col-md-12 pt-2">';
				html += '<h5>PERMISSIONS DATA</h5>';
				html += '</div></div><div class="accordion m-0 p-0" id="ctrsdbr-permissions-tab-content-accordion">';
				$.each(API.Contents.Auth.Permissions,function(index, value){
					html += '<div class="card m-0 card-dark">';
						html += '<div class="card-header p-0 pointer" id="trsdbr-permissions-tab-content-hdr-'+index+'" data-toggle="collapse" data-target="#trsdbr-permissions-tab-content-collapse-'+index+'">';
		          html += '<h2 class="mb-0">';
		          	html += '<button type="button" class="btn btn-link text-white">'+index+'</button>';
		          html += '</h2>';
		        html += '</div>';
		        html += '<div id="trsdbr-permissions-tab-content-collapse-'+index+'" class="collapse" aria-labelledby="trsdbr-permissions-tab-content-hdr-'+index+'" data-parent="#ctrsdbr-permissions-tab-content-accordion">';
		          html += '<div class="card-body bg-dark">';
								html += '<div class="row">';
								$.each(value,function(key, val){
									html += '<div class="col-md-6">';
									html += '<b>'+key+': </b></div>';
									switch(val){
										case 1:
											color = 'primary';
											icon = 'fas fa-eye';
											txt = 'read';
											break;
										case 2:
											color = 'success';
											icon = 'fas fa-plus-circle';
											txt = 'create';
											break;
										case 3:
											color = 'warning';
											icon = 'fas fa-edit';
											txt = 'edit';
											break;
										case 4:
											color = 'danger';
											icon = 'fas fa-trash-alt';
											txt = 'delete';
											break;
										default:
											color = 'danger';
											icon = 'fas fa-ban';
											txt = 'none';
											break;
									}
									html += '<div class="col-md-6"><span class="badge bg-'+color+'"><i class="'+icon+' mr-1"></i>'+txt+'</span></div>';
								});
								html += '</div>';
		          html += '</div>';
	          html += '</div>';
        	html += '</div>';
				});
				html += '</div>';
				$('#ctrsdbr-permissions-tab i').attr('class','fas fa-user-shield');
				$('#ctrsdbr-permissions-tab-content').html(html);
			}
		}, 100);
	}
}

API.Plugins.debug.init();
