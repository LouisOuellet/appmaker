API.Plugins.dev = {
	element:{
		Controls:{},
		Accordion:{},
	},
	init:function(){
		var html = '', color = '', icon = '', txt = '';
		API.GUI.ControlSidebar.add('Dev', 'fas fa-redo-alt fa-spin');
		var checkExist = setInterval(function() {
			if(API.Contents.Auth != undefined){
				clearInterval(checkExist);
				html = '<div class="row bg-lightblue mb-2" style="border-radius: 4px;">';
				html += '<div class="col-md-12 pt-2">';
				html += '<h5>DEV CONTROLS</h5>';
				html += '</div></div><div class="row" id="DEV_Controls"></div>';
				html += '<div class="accordion m-0 p-0" id="DEV_Accordion"></div>';
				$('#ctrsdbr-dev-tab i').attr('class','fas fa-code');
				$('#ctrsdbr-dev-tab-content').html(html);
				API.Plugins.dev.element.Controls = $('#DEV_Controls');
				API.Plugins.dev.element.Accordion = $('#DEV_Accordion');
				API.Plugins.dev.addAccordion('send',function(body){
					html = '<div id="SendControls" class="row pb-2">';
						html += '<div class="btn-group btn-block col-12">';
							html += '<button data-title="" data-href="" type="button" class="btn btn-success">Send</button>';
							html += '<button data-title="Lorem Ipsum" data-href="" type="button" class="btn btn-success">Send with Title</button>';
							html += '<button data-title="" data-href="'+window.location.href+'" type="button" class="btn btn-success">Send with Link</button>';
							html += '<button data-title="Lorem Ipsum" data-href="'+window.location.href+'" type="button" class="btn btn-success">Send with All</button>';
						html += '</div>';
					html += '</div>';
					body.append(html);
					body.find('#SendControls').find('button').off().click(function(){
						var data = {
							email:API.Contents.Settings.Contacts.reporting,
							message:'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.',
							extra:{},
						}
						if($(this).attr('data-title') != ''){ data.extra.title = $(this).attr('data-title');data.extra.acceptReplies = false; }
						if($(this).attr('data-href') != ''){ data.extra.href = $(this).attr('data-href'); }
						API.request('smtp','send',{data:data});
					});
				});
				API.Plugins.dev.addAccordion('task',function(body){
					html = '<div id="TaskControls" class="row pb-2">';
						html += '<div class="btn-group btn-block col-12">';
							html += '<button type="button" class="btn btn-info">Add Task</button>';
						html += '</div>';
					html += '</div>';
					html += '<div id="TaskList" class="row"></div>';
					body.append(html);
					body.find('#TaskControls').find('button').click(function(){
						API.Plugins.dev.addTask(10);
					});
				});
				API.Plugins.dev.addAccordion('notification',function(body){
					html = '<div id="NotificationControls" class="row pb-2">';
						html += '<div class="btn-group btn-block col-12">';
							html += '<button type="button" class="btn btn-info">Add Notification</button>';
						html += '</div>';
					html += '</div>';
					html += '<div id="NotificationList" class="row"></div>';
					body.append(html);
					body.find('#NotificationControls').find('button').click(function(){
						API.Plugins.dev.addNotification();
					});
				});
				API.Plugins.dev.addAccordion('permission',function(body){
					html = '<div id="PermissionsControls" class="row pb-2">';
						html += '<div class="btn-group btn-block col-12">';
							html += '<button type="button" class="btn btn-info">Fix Permissions</button>';
						html += '</div>';
					html += '</div>';
					body.append(html);
					body.find('#PermissionsControls').find('button').click(function(){
						API.request('permissions','fix');
					});
				});
				API.Plugins.dev.addAccordion('LSP',function(body){
					html = '<div id="SampleControls" class="row pb-2">';
						html += '<div class="btn-group btn-block col-12">';
							html += '<button type="button" data-type="structure" class="btn btn-warning">Load Structure</button>';
							html += '<button type="button" data-type="skeleton" class="btn btn-primary">Load Skeleton</button>';
							html += '<button type="button" data-type="sample" class="btn btn-info">Load Sample</button>';
						html += '</div>';
					html += '</div>';
					body.append(html);
					body.find('#SampleControls').find('button').click(function(){
						API.request('lsp','load',{data:{type:$(this).attr('data-type')}});
					});
				});
			}
		}, 100);
	},
	addAccordion:function(name, callback = null){
		var html = '<div class="card m-0 card-dark">';
			html += '<div class="card-header p-0 pointer" id="DEV_HDR_'+name+'" data-toggle="collapse" data-target="#DEV_'+name+'">';
				html += '<h2 class="mb-0">';
					html += '<button type="button" class="btn btn-link text-white">'+API.Helper.ucfirst(name)+'</button>';
				html += '</h2>';
			html += '</div>';
			html += '<div id="DEV_'+name+'" class="collapse" aria-labelledby="DEV_HDR_'+name+'" data-parent="#DEV_Accordion">';
				html += '<div class="card-body bg-dark">';
				html += '</div>';
			html += '</div>';
		html += '</div>';
		API.Plugins.dev.element.Accordion.append(html);
		if(callback != null){ callback($('#DEV_'+name).find('.card-body')); }
	},
	addTask:function(max, callback = null){
		API.GUI.Navbar.Task.add({value:0, max:max},function(opts,task,divider){
			console.log({opts:opts, task:task, divider:divider});
			var id = task.attr('data-task'), html = '';
			html += '<div class="btn-group btn-block col-12">';
				html += '<a class="btn btn-secondary">'+opts.title+'</a>';
				html += '<button type="button" data-task="'+id+'" class="btn btn-warning">Increment</button>';
				html += '<button type="button" data-task="'+id+'" class="btn btn-primary">Auto</button>';
			html += '</div>';
			$('#TaskList').append(html);
			var btns = $('#TaskList').find('.btn-group').last().find('button');
			btns.first().click(function(){
				console.log(this);
				var id = $(this).attr('data-task');
				console.log('Increment: '+id);
				var task = API.GUI.Navbar.Task.element.list.find('[data-task="'+id+'"]').last();
				var progress = task.find('.progress-bar');
				var value = progress.attr('aria-valuenow');
				var max = progress.attr('aria-valuemax');
				if(value < max){ ++value; }
				API.GUI.Navbar.Task.update(id, value);
				console.log('Increment Done');
			});
			btns.last().click(function(){
				console.log(this);
				var id = $(this).attr('data-task');
				console.log('Auto: '+id);
				var task = API.GUI.Navbar.Task.element.list.find('[data-task="'+id+'"]').last();
				var progress = task.find('.progress-bar');
				var value = progress.attr('aria-valuenow');
				var max = progress.attr('aria-valuemax');
				var checkExist = setInterval(function() {
					++value;
					console.log('Value: '+value);
					API.GUI.Navbar.Task.update(id,value);
					if(value >= max){ console.log('Auto Done');clearInterval(checkExist); }
				}, 3000);
			});
			if(callback != null){ callback(opts,task,divider); }
		});
	},
	addNotification:function(callback = null){
		API.GUI.Navbar.Notification.add(function(opts,notif,notification,divider){
			console.log({opts:opts, notification:notification, divider:divider});
			var id = notif.id, html = '';
			html += '<div class="btn-group btn-block col-12">';
				html += '<button type="button" data-notification="'+id+'" class="btn btn-secondary">'+notif.subject+'</button>';
			html += '</div>';
			$('#NotificationList').append(html);
			var btns = $('#NotificationList').find('.btn-group').last().find('button');
			btns.last().click(function(){
				console.log(this);
				var id = $(this).attr('data-notification');
				console.log('Dismiss: '+id);
				API.GUI.Navbar.Notification.dismiss(id);
				console.log(notification);
			});
			if(callback != null){ callback(opts,notification,divider); }
		});
	},
}

API.Plugins.dev.init();
