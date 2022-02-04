// DatePicker in modal fix
var enforceModalFocusFn = $.fn.modal.Constructor.prototype._enforceFocus;
$.fn.modal.Constructor.prototype._enforceFocus = function() {};

Dropzone.autoDiscover = false;

var Engine = {
	initiated:false,
	loggedin:false,
	debug:true,
	database:sessionStorage,
	cache:localStorage,
	init:function(){
		Engine.NEWrequest('api','initialize',{toast: false,pace: false}).then(function(dataset){
			Engine.debug = dataset.debug;
			Engine.Storage.set('language',dataset.language);
			Engine.Storage.set('plugins',dataset.plugins);
			Engine.Storage.set('countries',dataset.countries);
			Engine.Storage.set('states',dataset.states);
			Engine.Storage.set('timezones',dataset.timezones);
			Engine.Storage.set('settings',dataset.settings);
			Engine.Storage.set('auth',dataset.auth);
			Engine.Storage.set('structure',dataset.structure);
			Engine.Storage.set('tags',dataset.tags);
			Engine.Storage.set('jobs',dataset.jobs);
			Engine.Storage.set('statuses',dataset.statuses);
			Engine.Storage.set('priorities',dataset.priorities);
			if(Engine.Storage.get('auth',['user','id']) !== undefined){ Engine.loggedin = true; } else { document.title = Engine.Storage.get('language',['fields','Sign In']); }
			// Compatibility
			Engine.Helper.set(Engine.Contents,['Auth','User'],Engine.Storage.get('auth','user'));
			Engine.Helper.set(Engine.Contents,['Auth','Groups'],Engine.Storage.get('auth','groups'));
			Engine.Helper.set(Engine.Contents,['Auth','Roles'],Engine.Storage.get('auth','roles'));
			Engine.Helper.set(Engine.Contents,['Auth','Options'],Engine.Storage.get('auth','options'));
			Engine.Helper.set(Engine.Contents,['Auth','Permissions'],Engine.Storage.get('auth','permissions'));
			Engine.Helper.set(Engine.Contents,['Settings'],Engine.Storage.get('settings'));
			Engine.Helper.set(Engine.Contents,['Settings','LandingPage'],Engine.Storage.get('settings','page'));
			Engine.Helper.set(Engine.Contents,['Settings','Structure'],Engine.Storage.get('structure'));
			Engine.Helper.set(Engine.Contents,['Language'],Engine.Storage.get('language','fields'));
			Engine.Helper.set(Engine.Contents,['Countries'],Engine.Storage.get('countries'));
			Engine.Helper.set(Engine.Contents,['States'],Engine.Storage.get('states'));
			Engine.Helper.set(Engine.Contents,['Plugins'],Engine.Storage.get('plugins'));
			Engine.Helper.set(Engine.Contents,['Timezones'],Engine.Storage.get('timezones'));
			Engine.Helper.set(Engine.Contents,['Jobs'],Engine.Storage.get('jobs'));
			Engine.Helper.set(Engine.Contents,['Tags'],Engine.Storage.get('tags'));
			Engine.Helper.set(Engine.Contents,['Statuses'],Engine.Storage.get('statuses'));
			Engine.Helper.set(Engine.Contents,['Priorities'],Engine.Storage.get('priorities'));
			Engine.Contents.data = {dom:{},raw:{}};
			// End Compatibility
			Engine.initiated = true;
			Engine.GUI.init();
		});
	},
	Storage:{
		get:function(object,keyPath = null){
			if(keyPath == null){
				if(Engine.Helper.isSet(Engine.database,[object])){ return Engine.Helper.decode(Engine.database[object]); } else { return {}; }
			} else {
				if(typeof keyPath === 'string'){ keyPath = [keyPath]; }
				if(Engine.Helper.isSet(Engine.database,[object])){
					var obj = Engine.Helper.decode(Engine.database[object]);
					lastKeyIndex = keyPath.length-1;
					for(var i = 0; i < lastKeyIndex; ++ i){
						key = keyPath[i];
						if(!(key in obj)){obj[key] = {};}
						obj = obj[key];
					}
					return obj[keyPath[lastKeyIndex]];
				} else { return {}; }
			}
		},
		set:function(object,keyPath,value = null){
			if(value == null){
				if(Engine.Helper.isJson(keyPath)){ keyPath = JSON.parse(keyPath); }
				Engine.Helper.set(Engine.database,[object],Engine.Helper.encode(keyPath));
			} else {
				if(typeof keyPath === 'string'){ keyPath = [keyPath]; }
				if(Engine.Helper.isJson(value)){ value = JSON.parse(value); }
				if(Engine.Helper.isSet(Engine.database,[object])){ var obj = Engine.Helper.decode(Engine.database[object]); } else { var obj = {}; }
				lastKeyIndex = keyPath.length-1;
				for(var i = 0; i < lastKeyIndex; ++ i){
					key = keyPath[i];
					if(!(key in obj)){obj[key] = {};}
					obj = obj[key];
				}
				obj[keyPath[lastKeyIndex]] = value;
				Engine.Helper.set(Engine.database,[object],Engine.Helper.encode(obj));
			}
		},
	},
	NEWrequest:function(api, method, options = {},callback = null){
		if(options instanceof Function){ callback = options; options = {}; }
		var defaults = {
			toast: true,
			pace: true,
			report: false,
			data: null,
		};
		for(var [key, option] of Object.entries(options)){ if(Engine.Helper.isSet(defaults,[key])){ defaults[key] = option; } }
		if(Engine.debug){ defaults.toast = true;defaults.pace = true;defaults.report = true; }
		return new Promise(function(resolve, reject) {
			var xhr = new XMLHttpRequest();
			var params = {
				method:'session',
				request:api,
				type:method,
			};
			if(defaults.data != null){ params.data = defaults.data; }
			params = Engine.Helper.formatURL(params);
			if(Engine.debug){ console.log(api,method,params,defaults); }
			xhr.open('POST', 'api.php', true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.onerror = reject;
			xhr.onload = function(){
				if(Engine.debug){ console.log(this.status+' : '); }
				if(this.status == 200){
					if(this.responseText !== ''){
						var decoded = Engine.Helper.decode(this.responseText);
						if(decoded){
							if(defaults.toast){
								Engine.Toast.error(decoded);
								Engine.Toast.warning(decoded);
								Engine.Toast.success(decoded);
							}
							if(Engine.Helper.isSet(decoded,['output'])){ resolve(decoded.output); }
							if(callback != null){
								delete decoded.output;
								callback(decoded);
							}
						} else {
							if(defaults.report && defaults.toast){ Engine.Toast.report(this.responseText); }
						}
					} else {
						if(defaults.report && defaults.toast){ Engine.Toast.report(this.responseText); }
					}
				} else {
					if(defaults.report && defaults.toast){ Engine.Toast.report(this.responseText); }
				}
			}
			if(defaults.pace){ Pace.restart(); }
			xhr.send(params);
		});
	},
	request:function(request, type, options = {},callback = null){
		console.log(request, type, options);
		if(options instanceof Function){ callback = options; options = {}; }
		if(typeof options.data === 'undefined'){ options.data = null; }
		if(typeof options.toast === 'undefined'){ options.toast = true; }
		if(typeof options.pace === 'undefined'){ options.pace = true; }
		if(typeof options.report === 'undefined'){ options.report = false; }
		if(typeof options.required === 'undefined'){ options.required = false; }
		if(Engine.debug){ options.toast = true;options.report = true; }
		if(Engine.debug){ console.log(request,type,options.required,options.data); }
		if(!options.required){
			var checkAPI = setInterval(function() {
				if(Engine.initiated){
					clearInterval(checkAPI);
					var xhr = new XMLHttpRequest();
					var params = Engine.Helper.formatURL({
						method:'session',
						request:request,
						type:type,
						data:options.data,
					});
					console.log(params);
					xhr.open('POST', 'api.php', true);
					xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
					xhr.onload = function(){
						if(this.status == 200 && this.responseText !== ''){
							var response = Engine.Helper.decode(this.responseText);
							if(response){
								if(Engine.debug){ console.log(response); }
								if((typeof response.error !== 'undefined')&&(options.toast)){
									Engine.Toast.show.fire({
										type: 'error',
										text: response.error
									});
								}
								if((typeof response.success !== 'undefined')&&(options.toast)){
									Engine.Toast.show.fire({
										type: 'success',
										text: response.success
									});
								}
								if(callback instanceof Function){ callback(JSON.stringify(response)); }
							} else {
								if(options.report){
									if(options.toast){ console.log(this.status+' : ');Engine.Toast.report(this.responseText); }
								}
							}
						} else {
							if(this.status != 200 && options.report){
								if(options.toast){ console.log(this.status+' : ');Engine.Toast.report(this.responseText); }
							}
						}
					}
					if(options.pace){ Pace.restart(); }
					xhr.send(params);
				}
			}, 100);
		} else {
			return new Promise(function(resolve, reject) {
				var xhr = new XMLHttpRequest();
				var params = Engine.Helper.formatURL({
					method:'session',
					request:request,
					type:type,
					data:options.data,
				});
				console.log(params);
				xhr.open('POST', 'api.php', true);
				xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				xhr.onerror = reject;
				xhr.onload = function(){
					if(this.status == 200 && this.responseText !== ''){
						var response = Engine.Helper.decode(this.responseText);
						if(response){
							if(Engine.debug){ console.log(response); }
							if((typeof response.error !== 'undefined')&&(options.toast)){
								Engine.Toast.show.fire({
									type: 'error',
									text: response.error
								});
							}
							if((typeof response.success !== 'undefined')&&(options.toast)){
								Engine.Toast.show.fire({
									type: 'success',
									text: response.success
								});
							}
							if(callback instanceof Function){ resolve(JSON.stringify(response)); }
						} else {
							if(options.report){
								if(options.toast){ console.log(this.status+' : ');Engine.Toast.report(this.responseText); }
							}
						}
					} else {
						if(this.status != 200 && options.report){
							if(options.toast){ console.log(this.status+' : ');Engine.Toast.report(this.responseText); }
						}
					}
				}
				if(options.pace){ Pace.restart(); }
				xhr.send(params);
			});
		}
	},
	Toast:{
		set:{
			toast: true,
			position: 'top',
			showConfirmButton: false,
			timer: 2000,
		},
		show:Swal.mixin({
			toast: true,
			position: 'top',
			showConfirmButton: false,
			timer: 2000,
		}),
		success:function(dataset){
			if(Engine.Helper.isSet(dataset,['success'])){
				Engine.Toast.show.fire({
					type: 'success',
					text: dataset.success
				});
				if(Engine.debug){ console.log(dataset); }
			}
		},
		warning:function(dataset){
			if(Engine.Helper.isSet(dataset,['warning'])){
				Engine.Toast.show.fire({
					type: 'warning',
					text: dataset.warning
				});
				if(Engine.debug){ console.log(dataset); }
			}
		},
		error:function(dataset){
			if(Engine.Helper.isSet(dataset,['error'])){
				Engine.Toast.show.fire({
					type: 'error',
					text: dataset.error
				});
				if(Engine.debug){ console.log(dataset); }
			}
		},
		report:function(dataset){
			if(Engine.debug){
				var text = 'An error occured in the execution of this API request. See the console(F12) for more details.';
				if(typeof Engine.Contents.Language !== 'undefined' && typeof Engine.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'] !== 'undefined'){
					text = Engine.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'];
				} else { text = 'An error occured in the execution of this API request. See the console(F12) for more details.'; }
				Engine.Toast.show.fire({
					type: 'error',
					text: text,
					showConfirmButton: true,
					timer: 0
				});
				console.log(dataset);
			}
		},
	},
	Contents:{},
	Auth:{
		validate:function(type, name, level, table =''){
			switch(type){
				case"field":
					if((Engine.Helper.isSet(Engine,['Contents','Auth','Permissions',type,table,name]))||(Engine.Contents.Auth.Permissions[type][table][name] >= level)){
						return true;
					} else {
						return false;
					}
					break;
				case"view":
					if((Engine.Helper.isSet(Engine,['Contents','Auth','Permissions',type,table,name]))&&(Engine.Contents.Auth.Permissions[type][table][name] >= level)){
						return true;
					} else {
						return false;
					}
					break;
				default:
					if((Engine.Helper.isSet(Engine,['Contents','Auth','Permissions',type,name]))&&(Engine.Contents.Auth.Permissions[type][name] >= level)){
						return true;
					} else {
						return false;
					}
					break;
			}
		},
	},
	Plugins:{
		init:function(){
			var url = new URL(window.location.href);
			origin = {plugin:url.searchParams.get("p"), view:url.searchParams.get("v")};
			var checkExist = setInterval(function(){
				if((Engine.initiated)&&(Engine.Helper.isSet(Engine,['Contents','Settings','LandingPage']))){
					clearInterval(checkExist);
					if(origin.plugin == null){
						if((Engine.Helper.isSet(Engine,['Contents','Auth','Options','application','landingPage','value']))&&(Engine.Contents.Auth.Options.application.landingPage.value != null)&&(Engine.Contents.Auth.Options.application.landingPage.value != '')){
							origin.plugin = Engine.Contents.Auth.Options.application.landingPage.value;
						} else { origin.plugin = Engine.Contents.Settings.LandingPage; }
					}
					if(origin.view == null){ origin.view = 'index'; }
					if((Engine.Helper.isSet(Engine.Plugins,[origin.plugin,'load',origin.view]))&&(Engine.Plugins[origin.plugin].load[origin.view] instanceof Function)){
						Engine.Plugins[origin.plugin].load[origin.view]();
					}
					for(var [key, init] of Object.entries(Engine.Plugins)){
						if((key != 'init')&&(Engine.Helper.isSet(init,['extend',origin.plugin,'init']))&&(init.extend[origin.plugin].init instanceof Function)) {
							init.extend[origin.plugin].init();
						}
					}
				}
			}, 100);
		},
	},
	GUI:{
		init:function(){
			var checkExist = setInterval(function() {
				if((Engine.initiated)&&($('.breadcrumb-item').length)){
					clearInterval(checkExist);
					$('a[href^="?p="]').off().click(function(action){
						action.preventDefault();
						Engine.GUI.load($('#ContentFrame'),action.currentTarget.attributes.href.value);
						Engine.GUI.Breadcrumbs.add(action.currentTarget.textContent, action.currentTarget.attributes.href.value);
					});
				}
			}, 100);
			Engine.GUI.Navbar.init();
		},
		load:function(element, href, options = null, callback = null){
			var windowLocation = new URL(window.location.href);
			var url = new URL(windowLocation.origin+href);
			if((options != null)&&(options instanceof Function)){ callback = options; options = {}; }
			title = Engine.Helper.ucfirst(Engine.Helper.clean(url.searchParams.get("p")));
			document.title = title;
			window.history.pushState({page: 1},title, url.origin+href);
			$('a[href^="?p"]').removeClass('active');
			$('a[href^="'+href+'"]').addClass('active');
			if(element.prop("tagName") == "SECTION"){ $('#page-title h1').html(title); }
			if(url.searchParams.get("v") == undefined){
				var view = './plugins/'+url.searchParams.get("p")+'/src/views/index.php';
				var fview = 'index';
			} else {
				var view = './plugins/'+url.searchParams.get("p")+'/src/views/'+url.searchParams.get("v")+'.php';
				var fview = url.searchParams.get("v");
			}
			if((Engine.Auth.validate('plugin', url.searchParams.get("p"), 1))&&(Engine.Auth.validate('view', fview, 1, url.searchParams.get("p")))){
				$.ajax({
			    url: view,
			    type: 'HEAD',
			    error: function(){ element.load('./src/views/404.php'); },
			    success: function(){
						element.first().html('');
		        element.first().load(view,null,function(response,status){
							if(status == 'success'){
								// if((options != null)&&(typeof options.keys !== 'undefined')){ Engine.GUI.insert(options.keys); }
								Engine.Plugins.init();
								if(callback != null){ callback(element); }
							} else { element.load('./src/views/500.php'); }
						});
			    }
				});
			} else { element.load('./src/views/403.php'); }
		},
		insert:function(data, options = null, callback = null){
			var url = new URL(window.location.href);
			if((options != null)&&(options instanceof Function)){ callback = options; options = {}; }
			if(options == null){ options = {}; }
			if(typeof options.plugin !== 'undefined'){ plugin = options.plugin; } else { plugin = url.searchParams.get("p"); }
			for (var [key, value] of Object.entries(data)) {
				switch(key){
					case'tags':
						if(value != null){
							var tags = value.replace(/; /g, ";").split(';');
							$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').html('');
							for(var [index, tag] of Object.entries(tags)){
								var html = '';
								if(index > 0){ $('[data-plugin="'+plugin+'"][data-key="'+key+'"]').append('<span style="display:none;">;</span>'); }
								if(tag != ''){
									html += '<div class="btn-group m-1 text-light">';
										html += '<a class="btn btn-xs btn-primary"><i class="icon icon-tag mr-1"></i>'+tag+'</a>'
										html += '<a class="btn btn-xs btn-danger"><i class="icon icon-untag"></i></a>'
									html += '</div>';
									$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').append(html);
								}
							}
						}
						break;
					case'assigned_to':
						if(value != null){
							var users = value.replace(/; /g, ";").split(';');
							$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').html('');
							for (var [index, user] of Object.entries(users)) {
								var html = '';
								if(index > 0){ $('[data-plugin="'+plugin+'"][data-key="'+key+'"]').append('<span style="display:none;">;</span>'); }
								if(user != ''){
									html += '<div class="btn-group m-1 text-light">';
										html += '<a class="btn btn-xs btn-primary"><i class="icon icon-user mr-1"></i>'+user+'</a>'
										html += '<a class="btn btn-xs btn-danger"><i class="icon icon-unassign"></i></a>'
									html += '</div>';
									$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').append(html);
								}
							}
						}
						break;
					case'website':
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').html(value);
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').attr('href',value);
						break;
					case'email':
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').html(value);
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').attr('href','mailto:'+value);
						break;
					case'phone':
					case'mobile':
					case'toll_free':
					case'office_num':
					case'other_num':
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').html(value);
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').attr('href','tel:'+value);
						break;
					case'client':
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').html(value);
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').attr('href','?p=organizations&v=details&id='+value);
						break;
					case'user':
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').html(value);
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').attr('href','?p=users&v=details&id='+value);
						break;
					case'project':
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').html(value);
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').attr('href','?p=projects&v=details&id='+value);
						break;
					case'link_to':
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').html(value);
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').attr('href','?p='+data.relationship+'&v=details&id='+value);
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').click(function(action){
							action.preventDefault();
							if(Engine.Helper.isSet(Engine,['Contents',data.relationship,value])){
								Engine.GUI.Breadcrumbs.add(value, '?p='+data.relationship+'&v=details&id='+value, { keys:Engine.Contents.data[data.relationship][value] });
								Engine.CRUD.read.show({ keys:Engine.Contents.data[data.relationship][value], title:value, href:'?p='+data.relationship+'&v=details&id='+value, modal:true });
							} else {
								Engine.GUI.Breadcrumbs.add(value, '?p='+data.relationship+'&v=details&id='+value);
								Engine.CRUD.read.show({ href:'?p='+data.relationship+'&v=details&id='+value, title:value, modal:true });
							}
						});
						break;
					default:
						$('[data-plugin="'+plugin+'"][data-key="'+key+'"]').html(value);
						break;
				}
			}
			if(callback != null){ callback(data); }
		},
		Navbar:{
			element:{},
			init:function(){
				var checkExist = setInterval(function() {
					if((Engine.initiated)&&($('nav').length > 0)){
						clearInterval(checkExist);
						Engine.GUI.Navbar.element.left = $('#navbar-left');
						Engine.GUI.Navbar.element.right = $('#navbar-right');
					}
				}, 100);
			},
			Notification:{
				count:0,
				element:{
					list:{},
					badge:{},
					dismiss:{},
				},
				init:function(){
					var checkExist = setInterval(function() {
						if((Engine.initiated)&&(typeof Engine.GUI.Navbar.element.left !== "undefined")&&(typeof Engine.GUI.Navbar.element.right !== "undefined")){
							clearInterval(checkExist);
							if(Engine.loggedin){
								var html = '';
								html += '<li class="nav-item dropdown">';
								  html += '<a class="nav-link" data-toggle="dropdown" data-display="static">';
								    html += '<i class="fas fa-bell"></i>';
										html += '<span class="badge badge-danger navbar-badge">'+Engine.GUI.Navbar.Notification.count+'</span>';
								  html += '</a>';
									html += '<div class="dropdown-menu dropdown-menu-mobile dropdown-menu-notification scrollable-menu">';
										html += '<span class="dropdown-item dropdown-header">'+Engine.GUI.Navbar.Notification.count+' '+Engine.Contents.Language['Notifications']+'</span>';
										html += '<div class="dropdown-divider"></div>';
										html += '<a class="dropdown-item dropdown-header">'+Engine.Contents.Language['Dismiss All']+'</a>';
									html += '</div>';
								html += '</li>';
								Engine.GUI.Navbar.element.right.prepend(html);
								Engine.GUI.Navbar.Notification.element.list = Engine.GUI.Navbar.element.right.find('.dropdown-menu').first();
								Engine.GUI.Navbar.Notification.element.badge = Engine.GUI.Navbar.element.right.find('.badge').first();
								Engine.GUI.Navbar.Notification.element.dismiss = Engine.GUI.Navbar.Notification.element.list.find('.dropdown-header').last();
								Engine.GUI.Navbar.Notification.element.dismiss.click(function(){
									Engine.GUI.Navbar.Notification.dismissAll();
								});
								Engine.GUI.Navbar.Notification.fetch();
							}
						}
					}, 100);
					var checkNotifs = setInterval(function() {
						if(Engine.initiated&&Engine.loggedin){Engine.GUI.Navbar.Notification.fetch();}
					}, 10000);
				},
				fetch:function(){
					Engine.request('notifications','read',{
						data:{filters:[
							{ relationship:'equal', name:'user', value:Engine.Contents.Auth.User.id},
							{ relationship:'equal', name:'dissmissed', value:1},
						]},
						toast:false,
						report:true,
						pace:false,
					},function(result){
						var dataset = JSON.parse(result), html = '', etoast = false;
						if(typeof dataset.success !== 'undefined'){
							for(var [key, value] of Object.entries(dataset.output.dom)){
								if($('[data-notification="'+value.id+'"]').length == 0){
									value.create = false;
									etoast = true;
									Engine.GUI.Navbar.Notification.add(value);
								}
							}
							if(etoast){ Engine.Toast.show.fire({ type: 'info', text: Engine.Contents.Language['You have new notifications'] }); }
						}
						if(typeof dataset.error !== 'undefined' && typeof dataset.code !== 'undefined' && (dataset.code == 403 || dataset.code == 500)){ location.reload(); }
					});
				},
				add:function(options = {}, callback = null){
					if(options instanceof Function){ callback = options; options = {}; }
					var url = new URL(window.location.href);
					if(typeof options.href !== 'undefined'){ var url = new URL(url.origin+options.href); }
					options.href = '';
					if((typeof url.searchParams.get("p") !== 'undefined')&&(url.searchParams.get("p") != null)){ options.href += '?p='+url.searchParams.get("p"); } else {
						options.href += '?p='+Engine.Contents.Settings.LandingPage;
					}
					if((typeof url.searchParams.get("v") !== 'undefined')&&(url.searchParams.get("v") != null)){
						options.href += '\&v='+url.searchParams.get("v");
						if((typeof url.searchParams.get("id") !== 'undefined')&&(url.searchParams.get("id") != null)){
							options.href += '\&id='+url.searchParams.get("id");
						}
					}
					if(typeof options.subject === 'undefined'){ options.subject = 'Notification '+(Engine.GUI.Navbar.Notification.count + 1); }
					if(typeof options.dissmissed === 'undefined'){ options.dissmissed = 1; }
					if(typeof options.user === 'undefined'){ options.user = Engine.Contents.Auth.User.id; }
					if(typeof options.icon === 'undefined'){ options.icon = 'icon icon-'+url.searchParams.get("p")+' mr-2'; } else {
						if(options.icon.substring(0, 2) == 'fa'){ options.icon = options.icon+' mr-2'; } else {
							options.icon = 'icon icon-'+options.icon+' mr-2';
						}
					}
					if(typeof options.create === 'undefined'){ options.create = true; }
					var maxit = 25, start = 0;
					var checkExist = setInterval(function() {
						++start;
						if((typeof Engine.GUI.Navbar.Notification.element.list !== "undefined")&&(typeof Engine.GUI.Navbar.Notification.element.badge !== "undefined")){
							clearInterval(checkExist);
							if(options.create){
								Engine.request('notifications','create',{
									data:options,
									toast:false,
									pace:false,
								},function(result){
									var dataset = JSON.parse(result), html = '';
									if(typeof dataset.success !== 'undefined'){
										var nurl = new URL(url.origin+dataset.output.dom.href);
										++Engine.GUI.Navbar.Notification.count;
										Engine.GUI.Navbar.Notification.element.badge.html(Engine.GUI.Navbar.Notification.count);
										Engine.GUI.Navbar.Notification.element.list.find('.dropdown-header').first().remove();
										html += '<div data-notification="'+dataset.output.dom.id+'" class="dropdown-divider"></div>';
										html += '<a data-notification="'+dataset.output.dom.id+'" href="'+dataset.output.dom.href+'" class="dropdown-item">';
											html += '<i class="'+dataset.output.dom.icon+'"></i>'+dataset.output.dom.subject;
											html += '<span class="float-right text-muted text-sm"><time class="timeago" datetime="'+dataset.output.dom.created.replace(/ /g, "T")+'">'+dataset.output.dom.created+'</time></span>';
										html += '</a>';
										Engine.GUI.Navbar.Notification.element.list.prepend(html);
										Engine.GUI.Navbar.Notification.element.list.prepend('<span class="dropdown-item dropdown-header">'+Engine.GUI.Navbar.Notification.count+' '+Engine.Contents.Language['Notifications']+'</span>');
										$('[data-notification="'+dataset.output.dom.id+'"]').find('time').timeago();
										var element = $('[data-notification="'+dataset.output.dom.id+'"]').last();
										element.click(function(action){
											action.preventDefault();
											var id = $(this).attr('data-notification');
											var burl = new URL(url.origin+action.currentTarget.attributes.href.value);
											var textContent = '';
											if((typeof burl.searchParams.get("p") !== 'undefined')&&(burl.searchParams.get("p") != null)){ textContent = Engine.Contents.Language[Engine.Helper.ucfirst(burl.searchParams.get("p"))]; }
											if((typeof burl.searchParams.get("id") !== 'undefined')&&(burl.searchParams.get("id") != null)){ textContent = burl.searchParams.get("id"); }
											Engine.GUI.Breadcrumbs.add(textContent, action.currentTarget.attributes.href.value);
											Engine.GUI.load($('#ContentFrame'),action.currentTarget.attributes.href.value);
											Engine.GUI.Navbar.Notification.dismiss(id);
											Engine.GUI.Navbar.Notification.element.list.find('a').removeClass('active');
										});
										if(callback != undefined){ callback(options, dataset.output.dom, element, $('[data-notification="'+dataset.output.dom.id+'"]').first()); }
									}
								});
							} else {
								var nurl = new URL(url.origin+options.href), html = '';
								++Engine.GUI.Navbar.Notification.count;
								Engine.GUI.Navbar.Notification.element.badge.html(Engine.GUI.Navbar.Notification.count);
								Engine.GUI.Navbar.Notification.element.list.find('.dropdown-header').first().remove();
								html += '<div data-notification="'+options.id+'" class="dropdown-divider"></div>';
								html += '<a data-notification="'+options.id+'" href="'+options.href+'" class="dropdown-item">';
									html += '<i class="'+options.icon+'"></i>'+options.subject;
									html += '<span class="float-right text-muted text-sm"><time class="timeago" datetime="'+options.created.replace(/ /g, "T")+'">'+options.created+'</time></span>';
								html += '</a>';
								Engine.GUI.Navbar.Notification.element.list.prepend(html);
								Engine.GUI.Navbar.Notification.element.list.prepend('<span class="dropdown-item dropdown-header">'+Engine.GUI.Navbar.Notification.count+' '+Engine.Contents.Language['Notifications']+'</span>');
								$('[data-notification="'+options.id+'"]').find('time').timeago();
								var element = $('[data-notification="'+options.id+'"]').last();
								element.click(function(action){
									action.preventDefault();
									var id = $(this).attr('data-notification');
									var burl = new URL(url.origin+action.currentTarget.attributes.href.value);
									var textContent = '';
									if((typeof burl.searchParams.get("p") !== 'undefined')&&(burl.searchParams.get("p") != null)){ textContent = Engine.Contents.Language[Engine.Helper.ucfirst(burl.searchParams.get("p"))]; }
									if((typeof burl.searchParams.get("id") !== 'undefined')&&(burl.searchParams.get("id") != null)){ textContent = burl.searchParams.get("id"); }
									Engine.GUI.Breadcrumbs.add(textContent, action.currentTarget.attributes.href.value);
									Engine.GUI.load($('#ContentFrame'),action.currentTarget.attributes.href.value);
									Engine.GUI.Navbar.Notification.dismiss(id);
									Engine.GUI.Navbar.Notification.element.list.find('a').removeClass('active');
								});
								if(callback != undefined){ callback(options, options, element, $('[data-notification="'+options.id+'"]').first()); }
							}
						}
						if(start == maxit){ clearInterval(checkExist); }
					}, 100);
				},
				dismiss:function(id, callback = null){
					var notification = Engine.GUI.Navbar.Notification.element.list.find('[data-notification="'+id+'"]').last();
					var notif = {};
					notif.id = id;
					notif.dissmissed = 2;
					Engine.request('notifications','update',{
						data:notif,
						toast: false,
						pace: false,
					},function(result){
						var dataset = JSON.parse(result), html = '';
						if(typeof dataset.success !== 'undefined'){
							notification.addClass('text-muted');
							notification.css("background-color", "#f8f9fa");
							setTimeout(function() {
								--Engine.GUI.Navbar.Notification.count;
								Engine.GUI.Navbar.Notification.element.list.find('.dropdown-header').first().remove();
								Engine.GUI.Navbar.Notification.element.badge.html(Engine.GUI.Navbar.Notification.count);
								Engine.GUI.Navbar.Notification.element.list.prepend('<span class="dropdown-item dropdown-header">'+Engine.GUI.Navbar.Notification.count+' '+Engine.Contents.Language['Notifications']+'</span>');
								Engine.GUI.Navbar.Notification.element.list.find('[data-notification="'+dataset.output.dom.id+'"]').remove();
							}, 5000);
							if(callback != undefined){ callback(notification); }
						}
					});
				},
				dismissAll:function(){
					Engine.GUI.Navbar.Notification.element.list.find('a[data-notification]').each(function(){
						Engine.GUI.Navbar.Notification.dismiss($(this).attr('data-notification'));
					});
					Engine.GUI.Navbar.Notification.count = Engine.GUI.Navbar.Notification.element.list.find('a[data-notification]').length;
				},
			},
		},
		Sidebar:{
			Widget:{
				add:function(html, options = null, callback = null){
					if(options instanceof Function){ callback = options; options = null; }
					$('.sidebarWidget').prepend(html);
					var widgetHeight = $('.sidebarWidget').children().first().outerHeight();
					var brandHeight = $('.main-sidebar a.brand-link').outerHeight();
					$('body').append('<div id="vsize" style="display:none;height:calc(100vh - '+brandHeight+'px)"></div>');
					var sidebarHeight = $('.sidebar').height();
					var vsizeHeight = $('#vsize').height();
					$('#vsize').remove();
					$('.sidebar').css('height','calc(100vh - '+((vsizeHeight - sidebarHeight) + brandHeight + widgetHeight)+'px)');
					if(callback != null){ callback($('.sidebarWidget').children().first()); }
				},
			},
			Header:{
				count:0,
				add:function(txt, color = 'gray', callback = null){
					if(color instanceof Function){ callback = color; color = 'gray'; }
					var checkExist = setInterval(function() {
						if((Engine.Helper.isSet(Engine,['Contents','Auth','Permissions']))&&(typeof Engine.Contents.Language !== 'undefined')){
							clearInterval(checkExist);
							if((Engine.Auth.validate('nav-header', txt.toLowerCase(), 1))&&($('#sidenav-'+txt.toLowerCase()).length == 0)){
								++Engine.GUI.Sidebar.Header.count;
								$('.sidebar nav .nav-sidebar').append('<li data-order="'+(Engine.GUI.Sidebar.Header.count * 1000)+'" data-header="'+txt.toLowerCase()+'" id="sidenav-'+txt.toLowerCase()+'" class="nav-header bg-'+color+'" style="padding:8px;">'+Engine.Contents.Language[txt].toUpperCase()+'</li>');
								if((callback != null)&&(callback instanceof Function)){ callback($('.sidebar nav .nav-sidebar').find('li#sidenav-'+txt.toLowerCase())); }
							}
						}
					}, 100);
				},
			},
			Nav:{
				count:0,
				add:function(txt, location = 'main_navigation', icon = null){
					var lwr_txt = txt.toLowerCase(), link;
					var url = new URL(window.location.href);
					if(icon == null){ icon = 'icon icon-'+lwr_txt; }
					var checkExist = setInterval(function() {
						if((Engine.Helper.isSet(Engine,['Contents','Auth','Permissions']))&&(typeof Engine.Contents.Language !== 'undefined')){
							if(Engine.Auth.validate('nav-header', location, 1)){
								if($('#sidenav-'+location).length){
									clearInterval(checkExist);
									if(Engine.Auth.validate('nav-item', lwr_txt, 1)){
										++Engine.GUI.Sidebar.Nav.count;
										$('#sidenav-'+location).after('<li data-order="'+($('#sidenav-'+location).attr('data-order') + Engine.GUI.Sidebar.Nav.count)+'" data-header="'+location.toLowerCase()+'" class="nav-item"><a href="?p='+lwr_txt+'" class="nav-link"><i class="nav-icon '+icon+' mr-1"></i><p>'+Engine.Contents.Language[Engine.Helper.ucfirst(Engine.Helper.clean(txt))]+'</p></a></li>');
										$('.nav-item a[href^="?p='+lwr_txt+'"]').off("click");
										$('.nav-item a[href^="?p='+lwr_txt+'"]').click(function(action){
											action.preventDefault();
											Engine.GUI.load($('#ContentFrame'),action.currentTarget.attributes.href.value);
											Engine.GUI.Breadcrumbs.add(action.currentTarget.textContent, action.currentTarget.attributes.href.value);
										});
										if(url.searchParams.get("p") != undefined){
											$('a[href^="?p='+url.searchParams.get("p")+'"]').addClass('active');
										}
										var headers = $('.sidebar nav ul li.nav-header');
										headers.each(function(){
											var header = $(this), name = header.attr('data-header');
											var items = $('.sidebar nav ul').children('li.nav-item[data-header="'+name+'"]').detach().get();
											items.sort(function(a, b){
										    return $(a).data("order") - $(b).data("order");
										  });
											header.after(items);
										});
									}
								}
							} else { clearInterval(checkExist); }
						}
					}, 100);
				},
			},
		},
		ControlSidebar:{
			add:function(txt, icon = 'fas fa-cogs'){
				var html = '<li class="nav-item col">', lwr_txt = txt.toLowerCase(), nav = $('.control-sidebar ul'), tabs = $('.control-sidebar div');
				if($('[data-widget="control-sidebar"]').parent().is(":hidden")){
					$('[data-widget="control-sidebar"]').parent().show();
				}
				html += '<a class="nav-link" id="ctrsdbr-'+lwr_txt+'-tab" data-toggle="pill" href="#ctrsdbr-'+lwr_txt+'-tab-content" role="tab" aria-controls="ctrsdbr-'+lwr_txt+'-tab-content" aria-selected="true">';
				html += '<i class="'+icon+'"></i></a></li>';
				nav.append(html);
				html = '<div class="tab-pane fade" id="ctrsdbr-'+lwr_txt+'-tab-content" role="tabpanel" aria-labelledby="ctrsdbr-'+lwr_txt+'-tab"></div></div>';
				tabs.append(html);
			},
		},
		Breadcrumbs:{
			max:5,
			set:function(max){
				Engine.GUI.Breadcrumbs.max = max;
				if($('.breadcrumb li').length > max){
					var count = 0;
					$('.breadcrumb li').each(function(){
						++count;
						if(count > max){
							$(this).remove();
						}
					});
				}
			},
			add:function(title, href = null, options = null){
				if(href == null){ href = '?p='+title.toLowerCase(); }
				var windowLocation = new URL(window.location.href);
				var url = new URL(windowLocation.origin+href);
				var maxit = 25, start = 0;
				var checkExist = setInterval(function() {
					++start;
					if((Engine.Helper.isSet(Engine,['Contents','Auth','Permissions']))&&(typeof Engine.Contents.Language !== 'undefined')){
						clearInterval(checkExist);
						if($('.breadcrumb li').length >= Engine.GUI.Breadcrumbs.max){ $('.breadcrumb li:last-child').remove(); }
						if(url.searchParams.get("id") != undefined){ var crumbtitle = Engine.Helper.ucfirst(Engine.Helper.clean(url.searchParams.get("id"))); } else { var crumbtitle = Engine.Contents.Language[Engine.Helper.ucfirst(Engine.Helper.clean(title))]; }
						if((options != null)&&(Engine.Helper.isSet(options,['breadcrumb','title']))){ crumbtitle = options.breadcrumb.title }
						if((options != null)&&(typeof options.keys !== 'undefined')){
							$('#crumbs').prepend('<li class="breadcrumb-item"><a href="'+href+'"><i class="icon icon-'+url.searchParams.get("p")+' mr-1"></i>'+crumbtitle+'</a></li>');
						} else {
							$('#crumbs').prepend('<li class="breadcrumb-item"><a href="'+href+'"><i class="icon icon-'+url.searchParams.get("p")+' mr-1"></i>'+crumbtitle+'</a></li>');
						}
						$('.breadcrumb li:first-child a[href^="?p="]').click(function(action){
							action.preventDefault();
							if($(this).attr('data-keys') != undefined){
								var keys = JSON.parse($(this).attr('data-keys'));
								Engine.GUI.Breadcrumbs.add(action.currentTarget.textContent, action.currentTarget.attributes.href.value, { keys:keys });
								Engine.GUI.load($('#ContentFrame'),action.currentTarget.attributes.href.value, { keys:keys });
							} else {
								Engine.GUI.Breadcrumbs.add(action.currentTarget.textContent, action.currentTarget.attributes.href.value);
								Engine.GUI.load($('#ContentFrame'),action.currentTarget.attributes.href.value);
							}
						});
					}
					if(start == maxit){ clearInterval(checkExist); }
				}, 100);
			},
		},
		Layouts:{
			counts:{
				index: 0,
				details: 0,
				tabs: 0,
			},
			index:function(container,dataset,options = {},callback = null){
				Engine.GUI.Layouts.counts.index++;
				if(options instanceof Function){ callback = options; options = {}; }
				Engine.Builder.table(container, dataset.output.dom, {
					headers:dataset.output.headers,
					id:'OrganizationsIndex',
					modal:true,
					key:'name',
					clickable:{ enable:true, view:'details'},
					set:{status:1,isActive:"true"},
					controls:{ toolbar:true},
					import:{ key:'name', },
					load:false,
				});
			},
			details:{
				build:function(dataset,container,options = {},callback = null){
					Engine.GUI.Layouts.counts.details++;
					if(options instanceof Function){ callback = options; options = {}; }
					var html = '';
					var defaults = {
						title: "Details",
						image: "/dist/img/logo.png",
					};
					if(Engine.Helper.isSet(options,['title'])){ defaults.title = options.title; }
					if(Engine.Helper.isSet(options,['image'])){ defaults.image = options.image; }
					html += '<div class="row" id="details_'+Engine.GUI.Layouts.counts.details+'">';
						html += '<div class="col-md-4">';
							html += '<div class="card" id="details_record_'+Engine.GUI.Layouts.counts.details+'">';
					      html += '<div class="card-header d-flex p-0">';
					        html += '<h3 class="card-title p-3">'+defaults.title+'</h3>';
					      html += '</div>';
					      html += '<div class="card-body p-0">';
									html += '<div class="row">';
										html += '<div class="col-12 p-4 text-center">';
											html += '<img class="profile-user-img img-fluid img-circle" style="height:150px;width:150px;" src="'+defaults.image+'">';
										html += '</div>';
										html += '<div class="col-12 pt-2 pl-2 pr-2 pb-0 m-0">';
											html += '<table class="table table-striped table-hover m-0">';
												html += '<thead class="m-0 p-0" style="border-spacing: 0px; line-height: 0px;">';
													html += '<tr>';
														html += '<th colspan="2" class="p-0">';
															html += '<div class="btn-group btn-block" id="details_record_controls_'+Engine.GUI.Layouts.counts.details+'"></div>';
														html += '</th>';
													html += '</tr>';
												html += '</thead>';
												html += '<tbody></tbody>';
											html += '</table>';
								    html += '</div>';
							    html += '</div>';
								html += '</div>';
					    html += '</div>';
						html += '</div>';
						html += '<div class="col-md-8">';
							html += '<div class="card" id="details_main_'+Engine.GUI.Layouts.counts.details+'">';
					      html += '<div class="card-header d-flex p-0">';
					        html += '<ul class="nav nav-pills p-2" id="details_main_tabs_'+Engine.GUI.Layouts.counts.details+'"></ul>';
									html += '<div id="details_main_controls_'+Engine.GUI.Layouts.counts.details+'" class="btn-layouts-details-controls btn-group ml-auto"></div>';
					      html += '</div>';
					      html += '<div class="card-body p-0">';
					        html += '<div class="tab-content" id="details_main_tabs_content_'+Engine.GUI.Layouts.counts.details+'"></div>';
					      html += '</div>';
					    html += '</div>';
						html += '</div>';
					html += '</div>';
					container.html(html);
					if(callback != null){ callback(dataset, {
						id: Engine.GUI.Layouts.counts.details,
						details: container.find('#details_record_'+Engine.GUI.Layouts.counts.details),
						controls: container.find('#details_record_controls_'+Engine.GUI.Layouts.counts.details),
						main: container.find('#details_main_'+Engine.GUI.Layouts.counts.details),
						buttons: container.find('#details_main_controls_'+Engine.GUI.Layouts.counts.details),
						tabs: container.find('#details_main_tabs_'+Engine.GUI.Layouts.counts.details),
						content: container.find('#details_main_tabs_content_'+Engine.GUI.Layouts.counts.details),
					}); }
				},
				data:function(dataset,layout,options = {},callback = null){
					var url = new URL(window.location.href);
					if(options instanceof Function){ callback = options; options = {}; }
					var html = '';
					var defaults = {
						field: "name",
						plugin: url.searchParams.get("p"),
						td: "",
					};
					if(Engine.Helper.isSet(options,['field'])){ defaults.field = options.field; }
					if(Engine.Helper.isSet(options,['plugin'])){ defaults.plugin = options.plugin; }
					if(Engine.Helper.isSet(options,['td'])){ defaults.td = options.td; }
					else {
						defaults.td = '<td data-plugin="'+defaults.plugin+'" data-key="'+defaults.field+'">';
							if(Engine.Helper.isSet(dataset,['this','dom',defaults.field])){ defaults.td += dataset.this.dom[defaults.field]; }
						defaults.td += '</td>';
					}
					html +='<tr>';
						html +='<td data-edit="'+defaults.field+'"><b>'+Engine.Helper.ucfirst(Engine.Contents.Language[defaults.field])+'</b></td>';
						html +=defaults.td;
					html +='</tr>';
					layout.details.find('tbody').append(html);
					var tr = layout.details.find('tbody tr').last();
					layout.details[defaults.field] = tr;
					if(callback != null){ callback(dataset,layout,tr); }
				},
				control:function(dataset,layout,options = {},callback = null){
					if(options instanceof Function){ callback = options; options = {}; }
					var html = '';
					var defaults = {
						color: "primary",
						icon: "fas fa-cog",
						text: "",
					};
					if(Engine.Helper.isSet(options,['color'])){ defaults.color = options.color; }
					if(Engine.Helper.isSet(options,['icon'])){ defaults.icon = options.icon; }
					if(Engine.Helper.isSet(options,['text'])){ defaults.text = options.text; }
					html += '<button class="btn btn-flat btn-'+defaults.color+'">';
					if(defaults.text != ''){ html += '<i class="'+defaults.icon+' mr-1"></i>'+defaults.text; }
					else { html += '<i class="'+defaults.icon+'"></i>'; }
					html += '</button>';
					layout.controls.append(html);
					var button = layout.controls.find('button').last();
					if(callback != null){ callback(dataset,layout,button); }
				},
				button:function(dataset,layout,options = {},callback = null){
					if(options instanceof Function){ callback = options; options = {}; }
					var defaults = {icon: "fas fa-cog"};
					if(Engine.Helper.isSet(options,['icon'])){ defaults.icon = options.icon; }
					layout.buttons.append('<button class="btn"><i class="'+defaults.icon+'"></i></button>');
					var button = layout.buttons.find('button').last();
					if(callback != null){ callback(dataset,layout,button); }
				},
				tab:function(dataset,layout,options = {},callback = null){
					Engine.GUI.Layouts.counts.tabs++;
					if(options instanceof Function){ callback = options; options = {}; }
					var html = '';
					var defaults = {
						icon: "fas fa-cog",
						text: "",
					};
					if(Engine.Helper.isSet(options,['icon'])){ defaults.icon = options.icon; }
					if(Engine.Helper.isSet(options,['text'])){ defaults.text = options.text; }
					html += '<li class="nav-item"><a class="nav-link" href="#tab_'+Engine.GUI.Layouts.counts.tabs+'" data-toggle="tab">';
					if(defaults.text != ''){ html += '<i class="'+defaults.icon+' mr-1"></i>'+defaults.text; }
					else { html += '<i class="'+defaults.icon+'"></i>'; }
					html += '</a></li>';
					layout.tabs.append(html);
					layout.content.append('<div class="tab-pane" id="tab_'+Engine.GUI.Layouts.counts.tabs+'"></div>');
					var tab = layout.tabs.find('li').last();
					var content = layout.content.find('div.tab-pane').last();
					if(layout.tabs.find('li').length <= 1){ tab.find('a').addClass('active'); }
					if(layout.content.find('div.tab-pane').length <= 1){ content.addClass('active'); }
					if(callback != null){ callback(dataset,layout,tab,content); }
				},
			},
		},
	},
	Helper:{
		isJson:function(json) {
			if(typeof json === 'string'){
				try { JSON.parse(json); } catch (e) { return false; }
		    return true;
			} else { return false; }
		},
		parse:function(json){
			if(typeof json === 'string'){
				try { JSON.parse(json); } catch (e) { return json; }
		    return JSON.parse(json);
			} else { return json; }
		},
		encode:function(decoded){
			try { encodeURIComponent(btoa(JSON.stringify(Engine.Helper.parse(decoded)))); } catch (error) { console.log(decoded);return false; }
			return encodeURIComponent(btoa(JSON.stringify(Engine.Helper.parse(decoded))));
		},
		decode:function(encoded){
			try { Engine.Helper.parse(atob(decodeURIComponent(encoded))); } catch (error) { console.log(encoded);return false; }
			return Engine.Helper.parse(atob(decodeURIComponent(encoded)));
		},
		formatURL:function(params){
			return Object.keys(params).map(function(key){ return key+"="+Engine.Helper.encode(params[key]) }).join("&");
		},
		copyToClipboard:function(text){
		  var aux = document.createElement("input");
		  aux.setAttribute("value", text);
		  document.body.appendChild(aux);
		  aux.select();
		  document.execCommand("copy");
		  document.body.removeChild(aux);
			Engine.Toast.show.fire({
				type: 'success',
				text: Engine.Contents.Language['Copied to clipboard!']
			});
		},
		toCSV:function(array,options = {}){
			var url = new URL(window.location.href);
			var defaults = {plugin:url.searchParams.get("p")};
			for(var [key, option] of Object.entries(options)){ if(Engine.Helper.isSet(defaults,[key])){ defaults[key] = option; } }
			var csv = '';
			for(var [key, value] of Object.entries(array)){
				if(value == null){ value = '';};
				if(key == 'status'){ value = Engine.Contents.Statuses[defaults.plugin][value].name; }
				value = String(value).toLowerCase();
				if(value != ''){
					if(csv != ''){ csv += ','; }
					csv += value;
				}
			}
			return csv;
		},
		toString:function(date){
			var day = String(date.getDate()).padStart(2, '0');
			var month = String(date.getMonth() + 1).padStart(2, '0');
			var year = date.getFullYear();
			var hours = String(date.getHours()).padStart(2, '0');
			var minutes = String(date.getMinutes()).padStart(2, '0');
			var secondes = String(date.getSeconds()).padStart(2, '0');
			return year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+secondes;
		},
		html2text:function(html){
			var text = $('<div>').html(html);
			return text.text();
		},
		htmlentities:function(obj){
			for(var key in obj){
	      if(typeof obj[key] == "object" && obj[key] !== null){ Engine.Helper.htmlentities(obj[key]); }
	      else { if(typeof obj[key] == "string" && obj[key] !== null){ obj[key] = he.encode(obj[key],{ 'useNamedReferences': true }); } }
	    }
			return obj;
		},
		ucfirst:function(s){ if (typeof s !== 'string') return s; return s.charAt(0).toUpperCase() + s.slice(1); },
		clean:function(s){ if (typeof s !== 'string') return s; return s.replace(/_/g, " ").replace(/\./g, " "); },
		isOdd:function(num) { return num % 2;},
		trim:function(string,character){
			while(string.charAt(0) == character){
			  string = string.substring(1);
			}
			while(string.slice(-1) == character){
			  string = string.slice(0,-1);
			}
			return string;
		},
		isInt:function(num){
			if((num+"").match(/^\d+$/)){ return true; } else { return false; }
		},
		padNumber:function(num, targetLength){
		  return num.toString().length < targetLength ? num.toString().padStart(targetLength, 0) : num;
		},
		padString:function(string, targetLength, character){
		  return string.toString().length < targetLength ? string.toString().padStart(targetLength, character) : string;
		},
		set:function(obj, keyPath, value) {
			lastKeyIndex = keyPath.length-1;
			for(var i = 0; i < lastKeyIndex; ++ i){
				key = keyPath[i];
				if(!(key in obj)){obj[key] = {};}
				obj = obj[key];
			}
			obj[keyPath[lastKeyIndex]] = value;
		},
		isSet:function(obj, keyPath) {
			var v = true;
			lastKeyIndex = keyPath.length;
			for(var i = 0; i < lastKeyIndex; ++ i){
				key = keyPath[i];
				if(typeof obj[key] === 'undefined'){ v = false; break; }
				obj = obj[key];
			}
			return v;
		},
		addZero:function(i){
		  if (i < 10) { i = "0" + i; }
		  return i;
		},
		now:function(type = 'UTF8'){
			var currentDate = new Date();
			switch(type){
				case'ISO_8601':
					var datetime = currentDate.getFullYear() + "-"
		        + (currentDate.getMonth()+1)  + "-"
		        + currentDate.getDate() + "T"
		        + Engine.Helper.addZero(currentDate.getHours()) + ":"
		        + Engine.Helper.addZero(currentDate.getMinutes()) + ":"
		        + Engine.Helper.addZero(currentDate.getSeconds());
					break;
				default:
					var datetime = currentDate.getFullYear() + "-"
		        + (currentDate.getMonth()+1)  + "-"
		        + currentDate.getDate() + " "
		        + Engine.Helper.addZero(currentDate.getHours()) + ":"
		        + Engine.Helper.addZero(currentDate.getMinutes()) + ":"
		        + Engine.Helper.addZero(currentDate.getSeconds());
					break;
			}
			return datetime;
		},
		getUrlVars:function() {
	    var vars = {};
	    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
	        vars[key] = value;
	    });
	    return vars;
		},
		getFileSize:function(bytes, si=false, dp=1) {
		  const thresh = si ? 1000 : 1024;
		  if (Math.abs(bytes) < thresh) { return bytes + ' B'; }
		  const units = si
		    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
		    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
		  let u = -1;
		  const r = 10**dp;
		  do { bytes /= thresh; ++u; }
			while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
		  return bytes.toFixed(dp) + ' ' + units[u];
		},
		isFuture:function(date){
			var futureDate = new Date(date);
			var currentDate = new Date();
			if(futureDate > currentDate){ return true; } else { return false; }
		},
		download:function(url, filename = null){
			if(Engine.debug){ console.log('Downloading '+url); }
		  fetch(url).then(resp => resp.blob()).then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
				if(filename != null){ a.download = filename; }
				else { a.download = url.substring(url.lastIndexOf('/')+1); }
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
	    }).catch(() => Engine.Toast.report('Unable to download the file at '+url));
		},
	},
	Builder:{
		counts: {
			card: 0,
			modal: 0,
			form: 0,
			input: 0,
		},
		card: function(element, options = null, callback = null){
			if(options != null){
				if(options instanceof Function){
					callback = options;
					options = { title:'', icon:'unknown', css:'card-primary card-outline' }
				} else {
					if(typeof options.title === 'undefined'){ options.title = ''; }
					if(typeof options.css === 'undefined'){ options.css = 'card-primary card-outline'; }
					if(typeof options.icon === 'undefined'){ options.icon = options.title.toLowerCase().replace(/ /g, ""); }
				}
			} else {
				options = { title:'', icon:'unknown', css:'card-primary card-outline' }
			}
			var maxit = 25, start = 0;
			var checkExist = setInterval(function() {
				++start;
				if((Engine.Helper.isSet(Engine,['Contents','Auth','User']))&&(typeof Engine.Contents.Language !== 'undefined')){
					clearInterval(checkExist);
					// Insert card in DOM
					var html = '', title = options.title, icon = options.icon, css = options.css;
					if(typeof Engine.Contents.Language[title] === 'undefined'){ console.log(title); }
					title = Engine.Contents.Language[Engine.Helper.ucfirst(Engine.Helper.clean(title))];
					if(typeof options.extra !== 'undefined'){ html += '<div class="card '+css+'" data-extra="'+options.extra+'">'; }
					else { html += '<div class="card '+css+'">'; }
					html += '<div class="card-header "><h3 class="card-title"><i class="icon icon-'+icon+' mr-1"></i>'+title+'</h3><div class="card-tools"></div></div><div class="card-body"></div></div>';
					element.append(html);
					var card = element.find('.card').last();
					++Engine.Builder.counts.card;
					card.attr('id','card_'+Engine.Builder.counts.card);
					if(callback != null){ callback(card); }
				}
				if(start == maxit){ clearInterval(checkExist); }
			}, 100);
		},
		Timeline:{
			render:function(dataset,layout,options = {},callback = null){
				if(options instanceof Function){ callback = options; options = {}; }
				var defaults = {prefix:"_"};
				for(var [key, option] of Object.entries(options)){ if(Engine.Helper.isSet(defaults,[key])){ defaults[key] = option; } }
				for(var [rid, relations] of Object.entries(dataset.relationships)){
					for(var [uid, relation] of Object.entries(relations)){
						if(Engine.Helper.isSet(Engine.Plugins,[relation.relationship]) && (Engine.Auth.validate('custom', defaults.prefix+relation.relationship, 1) || relation.owner == Engine.Contents.Auth.User.username) && Engine.Helper.isSet(dataset,['relations',relation.relationship,relation.link_to])){
							var details = {};
							for(var [key, value] of Object.entries(dataset.relations[relation.relationship][relation.link_to])){ details[key] = value; }
							if(typeof relation.statuses !== 'undefined'){ details.status = dataset.details.statuses.dom[relation.statuses].order; }
							details.created = relation.created;
							details.owner = relation.owner;
							if(!Engine.Helper.isSet(details,['isActive'])||(Engine.Helper.isSet(details,['isActive']) && details.isActive)||(Engine.Helper.isSet(details,['isActive']) && !details.isActive && (Engine.Auth.validate('custom', 'conversations_'+relation.relationship+'_isActive', 1)||Engine.Auth.validate('custom', relation.relationship+'_isActive', 1)))){
								switch(relation.relationship){
									case"users":
										Engine.Builder.Timeline.add.subscription(layout.timeline,details,'bell','lightblue',function(item){
											if((Engine.Auth.validate('plugin','users',1))&&(Engine.Auth.validate('view','details',1,'users'))){
												item.find('i').first().addClass('pointer');
												item.find('i').first().off().click(function(){
													Engine.CRUD.read.show({ key:'username',keys:dataset.details.users.dom[item.attr('data-id')], href:"?p=users&v=details&id="+dataset.details.users.dom[item.attr('data-id')].username, modal:true });
												});
											}
										});
										break;
									default:
										if(Engine.Helper.isSet(Engine,['Plugins',relation.relationship,'Timeline','object'])){
											if(relation.relationship == 'statuses' || layout.timeline.find('div[data-plugin="'+relation.relationship+'"][data-id="'+details.id+'"]').length <= 0){
												Engine.Plugins[relation.relationship].Timeline.object(details,layout);
											}
										}
										break;
								}
							}
						}
					}
				}
			},
			add:{
				filter:function(layout,trigger,text){
					if(Engine.Helper.isSet(layout,['timeline']) && layout.timeline.find('.time-label').first().find('div.btn-group').find('button[data-trigger="'+trigger+'"]').length <= 0){
						layout.timeline.find('.time-label').first().find('div.btn-group').append('<button class="btn btn-secondary" data-trigger="'+trigger+'">'+Engine.Contents.Language[text]+'</button>');
						layout.timeline.find('.time-label').first().find('div.btn-group button').off().click(function(){
							var filters = layout.timeline.find('.time-label').first().find('div.btn-group');
							var all = filters.find('button').first();
							var filter = $(this);
							if(filter.attr('data-trigger') != 'all'){
								if(all.hasClass("btn-primary")){ all.removeClass('btn-primary').addClass('btn-secondary'); }
								if(filter.hasClass("btn-secondary")){ filter.removeClass('btn-secondary').addClass('btn-primary'); }
								else { filter.removeClass('btn-primary').addClass('btn-secondary'); }
								layout.timeline.find('[data-plugin]').hide();
								layout.timeline.find('.time-label').first().find('div.btn-group button.btn-primary').each(function(){
									layout.timeline.find('[data-plugin="'+$(this).attr('data-trigger')+'"]').show();
								});
							} else {
								filters.find('button').removeClass('btn-primary').addClass('btn-secondary');
								all.removeClass('btn-secondary').addClass('btn-primary');
								layout.timeline.find('[data-plugin]').show();
							}
						});
					}
				},
				date:function(timeline, date, color = 'primary'){
					var url = new URL(window.location.href);
					var id = url.searchParams.get("id"), html = '';
					var dateItem = new Date(date);
					var today = new Date();
					var tomorrow = new Date();
					today.setHours(0,0,0,0);
					tomorrow.setDate(tomorrow.getDate() + 1);
					tomorrow.setHours(0,0,0,0);
					var dateUS = dateItem.toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, '-').replace(/,/g, '');
					if(timeline.find('div.time-label[data-date="'+tomorrow.getTime()+'"]').length < 1){
						html += '<div class="time-label" data-date="'+tomorrow.getTime()+'">';
							html += '<span class="bg-'+color+'">Now</span>';
						html += '</div>';
						timeline.find('div.time-label[data-date="'+tomorrow.getTime()+'"]').remove();
						timeline.append(html);
					}
					if(timeline.find('div.time-label[data-dateUS="'+dateUS+'"]').length < 1){
						html += '<div class="time-label" data-dateus="'+dateUS+'" data-date="'+dateItem.setHours(0,0,0,0)+'">';
							html += '<span class="bg-'+color+'">'+dateUS+'</span>';
						html += '</div>';
						timeline.append(html);
					}
					while(timeline.find('div.time-label[data-date="'+tomorrow.getTime()+'"]').length > 1){
					  timeline.find('div.time-label[data-date="'+tomorrow.getTime()+'"]').last().remove();
					}
				},
				card:function(timeline, item, icon = 'history', color = 'primary', callback = null){
					var url = new URL(window.location.href);
					var id = url.searchParams.get("id"), html = '';
					var dateItem = new Date(item.created);
					var dateUS = dateItem.toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, '-').replace(/,/g, '');
					Engine.Builder.Timeline.add.date(timeline,item.created);
					var checkExist = setInterval(function() {
						if(timeline.find('div.time-label[data-dateus="'+dateUS+'"]').length > 0){
							clearInterval(checkExist);
							if(typeof item.id !== 'undefined'){
								var html = '';
								if(typeof item.from !== 'undefined') { var user = item.from; }
								else if(typeof item.user !== 'undefined') { var user = item.user; }
								else if(typeof item.owner !== 'undefined') { var user = item.owner; }
								else { var user = ''; }
								if((typeof item.subject !== 'undefined')&&(item.subject != null)&&(item.subject != "")) { var subject = item.subject; }
								else if((typeof item.title !== 'undefined')&&(item.title != null)&&(item.title != "")) { var subject = item.title; }
								else { var subject = ''; }
								html += '<div data-type="'+icon+'" data-id="'+item.id+'" data-date="'+dateItem.getTime()+'">';
									html += '<i class="fas fa-'+icon+' bg-'+color+'"></i>';
									html += '<div class="timeline-item">';
										html += '<span class="time bg-'+color+'"><i class="fas fa-clock mr-2"></i><time class="timeago" datetime="'+item.created.replace(/ /g, "T")+'">'+item.created+'</time></span>';
										html += '<h3 class="timeline-header bg-'+color+'"><a class="mr-2">'+user+'</a>'+subject+'</h3>';
										html += '<div class="timeline-body">'+item.content+'</div>';
										html += '<div class="timeline-footer bg-dark">';
											html += '<a class="btn my-2"></a>';
											html += '<button type="button" class="btn btn-primary btn-sm float-right"><i class="fas fa-reply mr-1"></i>Reply</button>';
										html += '</div>';
									html += '</div>';
								html += '</div>';
								timeline.find('div.time-label[data-dateus="'+dateUS+'"]').after(html);
								var element = timeline.find('[data-type="'+icon+'"][data-id="'+item.id+'"]');
								element.find('time').timeago();
								element.find('.timeline-footer').find('button').click(function(){
									var content = "\n\n"+'<br><br><blockquote>'+element.find('.timeline-body').html()+'</blockquote>';
									$('[data-plugin="'+url.searchParams.get("p")+'"][data-form="comments"]').first().summernote('code', '');
									$('[data-plugin="'+url.searchParams.get("p")+'"][data-form="comments"]').first().summernote('code', content);
									$('ul.nav li.nav-item a[href*="comments"]').tab('show');
								});
								var items = timeline.children('div').detach().get();
								items.sort(function(a, b){
							    return new Date($(b).data("date")) - new Date($(a).data("date"));
							  });
								timeline.append(items);
								if(callback != null){ callback(element); }
							}
						}
					}, 100);
				},
				message:function(timeline, item, icon = 'envelope-open-text', color = 'info', callback = null){
					var url = new URL(window.location.href);
					var id = url.searchParams.get("id"), html = '';
					var dateItem = new Date(item.created);
					var dateUS = dateItem.toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, '-').replace(/,/g, '');
					Engine.Builder.Timeline.add.date(timeline,item.created);
					var checkExist = setInterval(function() {
						if(timeline.find('div.time-label[data-dateus="'+dateUS+'"]').length > 0){
							clearInterval(checkExist);
							if(typeof item.id !== 'undefined'){
								var html = '';
								html += '<div data-type="'+icon+'" data-id="'+item.id+'" data-date="'+dateItem.getTime()+'">';
									html += '<i class="fas fa-'+icon+' bg-'+color+'"></i>';
									html += '<div class="timeline-item">';
										html += '<span class="time bg-'+color+'"><i class="fas fa-clock mr-2"></i><time class="timeago" datetime="'+item.created.replace(/ /g, "T")+'">'+item.created+'</time></span>';
										html += '<h3 class="timeline-header bg-'+color+'"><a class="mr-2">'+item.from+'</a><br>'+item.subject_stripped+'</h3>';
										html += '<h3 class="timeline-header bg-white p-0">';
											html += '<div class="btn-group btn-block">';
												html += '<button type="button" class="btn btn-flat btn-xs btn-primary" data-toggle="collapse" href="#message-contacts-'+item.id+'">';
													html += '<i class="fas fa-address-card mr-1"></i>View Contacts';
												html += '</button>';
												html += '<button type="button" class="btn btn-flat btn-xs btn-warning" data-toggle="collapse" href="#message-files-'+item.id+'">';
													html += '<i class="fas fa-file mr-1"></i>View Files';
												html += '</button>';
											html += '</div>';
										html += '</h3>';
										html += '<h3 class="timeline-header bg-white p-0 collapse" id="message-contacts-'+item.id+'">';
											for(var [index, contact] of Object.entries(item.contacts)){
												html += '<button type="button" class="btn btn-xs btn-primary m-1" data-contact="'+contact+'"><i class="fas fa-address-card mr-1"></i>'+contact+'</button>';
											}
										html += '</h3>';
										html += '<h3 class="timeline-header bg-white p-0 collapse" id="message-files-'+item.id+'">';
											for(var [index, file] of Object.entries(item.files)){
												html += '<div class="btn-group m-1" data-id="'+file.id+'">';
		                      html += '<button type="button" class="btn btn-xs btn-primary" data-action="details">';
		                        html += '<i class="fas fa-file mr-1"></i>'+file.name;
		                      html += '</button>';
		                      html += '<button type="button" class="btn btn-xs btn-warning" data-action="download">';
		                        html += '<i class="fas fa-file-download mr-1"></i>'+Engine.Helper.getFileSize(file.size,true,2);
		                      html += '</button>';
		                    html += '</div>';
											}
										html += '</h3>';
										html += '<div class="timeline-body">'+item.body_unquoted+'</div>';
									html += '</div>';
								html += '</div>';
								timeline.find('div.time-label[data-dateus="'+dateUS+'"]').after(html);
								var element = timeline.find('[data-type="'+icon+'"][data-id="'+item.id+'"]');
								var html = '';
								html += '<div class="timeline-footer bg-dark">';
									html += '<a class="btn my-2"></a>';
									html += '<button type="button" class="btn btn-primary btn-sm float-right"><i class="fas fa-reply mr-1"></i>Reply</button>';
								html += '</div>';
								element.find('.timeline-item').append(html);
								element.find('time').timeago();
								element.find('.timeline-footer').find('button').click(function(){
									var content = "\n\n"+'<br><br><blockquote>'+element.find('.timeline-body').html()+'</blockquote>';
									$('[data-plugin="'+url.searchParams.get("p")+'"][data-form="comments"]').first().summernote('code', '');
									$('[data-plugin="'+url.searchParams.get("p")+'"][data-form="comments"]').first().summernote('code', content);
									$('ul.nav li.nav-item a[href*="comments"]').tab('show');
								});
								var items = timeline.children('div').detach().get();
								items.sort(function(a, b){
							    return new Date($(b).data("date")) - new Date($(a).data("date"));
							  });
								timeline.append(items);
								if(callback != null){ callback(element); }
							}
						}
					}, 100);
				},
				call:function(timeline, item, icon = 'phone-square', color = 'olive', callback = null){
					var url = new URL(window.location.href);
					var id = url.searchParams.get("id"), html = '';
					var dateItem = new Date(item.created);
					var dateUS = dateItem.toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, '-').replace(/,/g, '');
					Engine.Builder.Timeline.add.date(timeline,item.created);
					var checkExist = setInterval(function() {
						if(timeline.find('div.time-label[data-dateus="'+dateUS+'"]').length > 0){
							clearInterval(checkExist);
							if(typeof item.id !== 'undefined'){
								var html = '';
								status = '<span class="mr-1 badge bg-'+Engine.Contents.Statuses.calls[item.status].color+'"><i class="'+Engine.Contents.Statuses.calls[item.status].icon+' mr-1" aria-hidden="true"></i>'+Engine.Contents.Language[Engine.Contents.Statuses.calls[item.status].name]+'</span>';
								if((item.phone != null)&&(item.phone != '')){
									phone = '<span class="badge bg-success mx-1"><i class="fas fa-phone mr-1" aria-hidden="true"></i>'+item.phone+'</span>';
								} else { phone = ''; }
								if((item.contact != null)&&(item.contact != '')){
									contact = '<span class="badge bg-secondary mx-1"><i class="fas fa-address-card mr-1" aria-hidden="true"></i>'+item.contact+'</span>';
								} else { contact = ''; }
								schedule = '<span class="badge bg-primary mx-1"><i class="fas fa-calendar-check mr-1" aria-hidden="true"></i>'+item.date+' at '+item.time+'</span>';
								html += '<div data-type="'+icon+'" data-id="'+item.id+'" data-phone="'+item.phone+'" data-organization="'+item.organization+'" data-date="'+dateItem.getTime()+'">';
									html += '<i class="fas fa-'+icon+' bg-'+color+'"></i>';
									html += '<div class="timeline-item">';
										html += '<span class="time"><i class="fas fa-clock mr-2"></i><time class="timeago" datetime="'+item.created.replace(/ /g, "T")+'">'+item.created+'</time></span>';
										if(Engine.Auth.validate('custom', 'timeline_calls_phone', 1)){
											switch(item.status){
												case 1: html += '<h3 class="timeline-header">'+status+'Call to'+contact+phone+'schedule for'+schedule+'</h3>';break;
												case 2: html += '<h3 class="timeline-header">'+status+'Call to'+contact+phone+'schedule for'+schedule+'</h3>';break;
												default: html += '<h3 class="timeline-header">'+status+'Call to'+contact+phone+'</h3>';break;
											}
										} else {
											switch(item.status){
												case 1: html += '<h3 class="timeline-header">'+status+'Call schedule for'+schedule+'</h3>';break;
												case 2: html += '<h3 class="timeline-header">'+status+'Call schedule for'+schedule+'</h3>';break;
												default: html += '<h3 class="timeline-header">'+status+'Call</h3>';break;
											}
										}
									html += '</div>';
								html += '</div>';
								timeline.find('div.time-label[data-dateus="'+dateUS+'"]').after(html);
								var element = timeline.find('[data-type="'+icon+'"][data-id="'+item.id+'"]');
								element.find('time').timeago();
								var items = timeline.children('div').detach().get();
								items.sort(function(a, b){
							    return new Date($(b).data("date")) - new Date($(a).data("date"));
							  });
								timeline.append(items);
								if(callback != null){ callback(element); }
							}
						}
					}, 100);
				},
				status:function(timeline, item, icon = 'info', color = 'info', callback = null){
					var url = new URL(window.location.href);
					var id = url.searchParams.get("id"), plugin = url.searchParams.get("p"),html = '';
					var dateItem = new Date(item.created);
					var dateUS = dateItem.toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, '-').replace(/,/g, '');
					if(timeline.length > 0){
						plugin = timeline.attr('data-plugin');
						Engine.Builder.Timeline.add.date(timeline,item.created);
						var checkExist = setInterval(function() {
							if(timeline.find('div.time-label[data-dateus="'+dateUS+'"]').length > 0){
								clearInterval(checkExist);
								if(typeof item.id !== 'undefined'){
									var html = '';
									if(typeof item.order !== 'undefined') { var status = item.order; }
									else if(typeof item.status_id !== 'undefined') { var status = item.status_id; }
									else if(typeof item.status !== 'undefined') { var status = item.status; }
									else { var status = 1; }
									status = '<span class="badge bg-'+Engine.Contents.Statuses[plugin][status].color+'"><i class="'+Engine.Contents.Statuses[plugin][status].icon+' mr-1" aria-hidden="true"></i>'+Engine.Contents.Language[Engine.Contents.Statuses[plugin][status].name]+'</span>';
									html += '<div data-type="'+icon+'" data-id="'+item.id+'" data-date="'+dateItem.getTime()+'">';
										html += '<i class="fas fa-'+icon+' bg-'+color+'"></i>';
										html += '<div class="timeline-item">';
											html += '<span class="time"><i class="fas fa-clock mr-2"></i><time class="timeago" datetime="'+item.created.replace(/ /g, "T")+'">'+item.created+'</time></span>';
											html += '<h3 class="timeline-header">Status set to '+status+'</h3>';
										html += '</div>';
									html += '</div>';
									timeline.find('div.time-label[data-dateus="'+dateUS+'"]').after(html);
									var element = timeline.find('[data-type="'+icon+'"][data-id="'+item.id+'"]');
									element.find('time').timeago();
									var items = timeline.children('div').detach().get();
									items.sort(function(a, b){
								    return new Date($(b).data("date")) - new Date($(a).data("date"));
								  });
									timeline.append(items);
									if(callback != null){ callback(element); }
								}
							}
						}, 100);
					}
				},
				priority:function(timeline, item, icon = 'exclamation', color = 'orange', callback = null){
					var url = new URL(window.location.href);
					var id = url.searchParams.get("id"), html = '';
					var dateItem = new Date(item.created);
					var dateUS = dateItem.toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, '-').replace(/,/g, '');
					Engine.Builder.Timeline.add.date(timeline,item.created);
					var checkExist = setInterval(function() {
						if(timeline.find('div.time-label[data-dateus="'+dateUS+'"]').length > 0){
							clearInterval(checkExist);
							if(typeof item.id !== 'undefined'){
								var html = '';
								if(typeof item.order !== 'undefined') { var priority = item.order; }
								else if(typeof item.priority !== 'undefined') { var priority = item.priority; }
								else { var priority = 1; }
								priority = '<span class="badge bg-'+Engine.Contents.Priorities[url.searchParams.get("p")][priority].color+'"><i class="'+Engine.Contents.Priorities[url.searchParams.get("p")][priority].icon+' mr-1" aria-hidden="true"></i>'+Engine.Contents.Language[Engine.Contents.Priorities[url.searchParams.get("p")][priority].name]+'</span>';
								html += '<div data-type="'+icon+'" data-id="'+item.id+'" data-date="'+dateItem.getTime()+'">';
									html += '<i class="fas fa-'+icon+' bg-'+color+'"></i>';
									html += '<div class="timeline-item">';
										html += '<span class="time"><i class="fas fa-clock mr-2"></i><time class="timeago" datetime="'+item.created.replace(/ /g, "T")+'">'+item.created+'</time></span>';
										html += '<h3 class="timeline-header">Priority set to '+priority+'</h3>';
									html += '</div>';
								html += '</div>';
								timeline.find('div.time-label[data-dateus="'+dateUS+'"]').after(html);
								var element = timeline.find('[data-type="'+icon+'"][data-id="'+item.id+'"]');
								element.find('time').timeago();
								var items = timeline.children('div').detach().get();
								items.sort(function(a, b){
							    return new Date($(b).data("date")) - new Date($(a).data("date"));
							  });
								timeline.append(items);
								if(callback != null){ callback(element); }
							}
						}
					}, 100);
				},
				service:function(timeline, item, icon = 'hand-holding-usd', color = 'success', callback = null){
					var url = new URL(window.location.href);
					var id = url.searchParams.get("id"), html = '';
					var dateItem = new Date(item.created);
					var dateUS = dateItem.toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, '-').replace(/,/g, '');
					Engine.Builder.Timeline.add.date(timeline,item.created);
					var checkExist = setInterval(function() {
						if(timeline.find('div.time-label[data-dateus="'+dateUS+'"]').length > 0){
							clearInterval(checkExist);
							if(typeof item.id !== 'undefined'){
								var html = '';
								html += '<div data-type="'+icon+'" data-id="'+item.id+'" data-date="'+dateItem.getTime()+'">';
									html += '<i class="fas fa-'+icon+' bg-'+color+'"></i>';
									html += '<div class="timeline-item">';
										html += '<span class="time"><i class="fas fa-clock mr-2"></i><time class="timeago" datetime="'+item.created.replace(/ /g, "T")+'">'+item.created+'</time></span>';
										html += '<h3 class="timeline-header">Signed for '+item.name+'</h3>';
									html += '</div>';
								html += '</div>';
								timeline.find('div.time-label[data-dateus="'+dateUS+'"]').after(html);
								var element = timeline.find('[data-type="'+icon+'"][data-id="'+item.id+'"]');
								element.find('time').timeago();
								var items = timeline.children('div').detach().get();
								items.sort(function(a, b){
							    return new Date($(b).data("date")) - new Date($(a).data("date"));
							  });
								timeline.append(items);
								if(callback != null){ callback(element); }
							}
						}
					}, 100);
				},
				issue:function(timeline, item, icon = 'gavel', color = 'indigo', callback = null){
					var url = new URL(window.location.href);
					var id = url.searchParams.get("id"), html = '';
					var dateItem = new Date(item.created);
					var dateUS = dateItem.toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, '-').replace(/,/g, '');
					Engine.Builder.Timeline.add.date(timeline,item.created);
					var checkExist = setInterval(function() {
						if(timeline.find('div.time-label[data-dateus="'+dateUS+'"]').length > 0){
							clearInterval(checkExist);
							if(typeof item.id !== 'undefined'){
								var html = '';
								if(!Engine.Helper.isSet(Engine.Contents.Language,[Engine.Contents.Statuses.issues[item.status].name])){ console.log(Engine.Contents.Statuses.issues[item.status].name); }
								status = '<span class="mx-1 badge bg-'+Engine.Contents.Statuses.issues[item.status].color+'"><i class="'+Engine.Contents.Statuses.issues[item.status].icon+' mr-1" aria-hidden="true"></i>'+Engine.Contents.Language[Engine.Contents.Statuses.issues[item.status].name]+'</span>';
								html += '<div data-type="'+icon+'" data-id="'+item.id+'" data-date="'+dateItem.getTime()+'">';
									html += '<i class="fas fa-'+icon+' bg-'+color+'"></i>';
									html += '<div class="timeline-item">';
										html += '<span class="time"><i class="fas fa-clock mr-2"></i><time class="timeago" datetime="'+item.created.replace(/ /g, "T")+'">'+item.created+'</time></span>';
										html += '<h3 class="timeline-header">Issue '+item.id+' - '+item.name+' was'+status+'</h3>';
									html += '</div>';
								html += '</div>';
								timeline.find('div.time-label[data-dateus="'+dateUS+'"]').after(html);
								var element = timeline.find('[data-type="'+icon+'"][data-id="'+item.id+'"]');
								element.find('time').timeago();
								var items = timeline.children('div').detach().get();
								items.sort(function(a, b){
							    return new Date($(b).data("date")) - new Date($(a).data("date"));
							  });
								timeline.append(items);
								if(callback != null){ callback(element); }
							}
						}
					}, 100);
				},
				subscription:function(timeline, item, icon = 'bell', color = 'secondary', callback = null){
					var url = new URL(window.location.href);
					var id = url.searchParams.get("id"), html = '';
					var dateItem = new Date(item.created);
					var dateUS = dateItem.toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, '-').replace(/,/g, '');
					Engine.Builder.Timeline.add.date(timeline,item.created);
					var checkExist = setInterval(function() {
						if(timeline.find('div.time-label[data-dateus="'+dateUS+'"]').length > 0){
							clearInterval(checkExist);
							if(typeof item.id !== 'undefined'){
								var html = '';
								html += '<div data-type="'+icon+'" data-id="'+item.id+'" data-date="'+dateItem.getTime()+'">';
									html += '<i class="fas fa-'+icon+' bg-'+color+'"></i>';
									html += '<div class="timeline-item">';
										html += '<span class="time"><i class="fas fa-clock mr-2"></i><time class="timeago" datetime="'+item.created.replace(/ /g, "T")+'">'+item.created+'</time></span>';
										if(item.id == Engine.Contents.Auth.User.id){ html += '<h3 class="timeline-header">'+Engine.Contents.Language['You are subscribed']+'</h3>'; }
										else { html += '<h3 class="timeline-header">'+item.email+Engine.Contents.Language[' was subscribed']+'</h3>'; }
									html += '</div>';
								html += '</div>';
								timeline.find('div.time-label[data-dateus="'+dateUS+'"]').after(html);
								var element = timeline.find('[data-type="'+icon+'"][data-id="'+item.id+'"]');
								element.find('time').timeago();
								var items = timeline.children('div').detach().get();
								items.sort(function(a, b){
							    return new Date($(b).data("date")) - new Date($(a).data("date"));
							  });
								timeline.append(items);
								if(callback != null){ callback(element); }
							}
						}
					}, 100);
				},
				organization:function(timeline, item, icon = 'building', color = 'secondary', callback = null){
					Engine.Builder.Timeline.add.client(timeline, item, icon, color, callback = null);
				},
				client:function(timeline, item, icon = 'building', color = 'secondary', callback = null){
					var url = new URL(window.location.href);
					var id = url.searchParams.get("id"), html = '';
					var dateItem = new Date(item.created);
					var dateUS = dateItem.toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, '-').replace(/,/g, '');
					Engine.Builder.Timeline.add.date(timeline,item.created);
					var checkExist = setInterval(function() {
						if(timeline.find('div.time-label[data-dateus="'+dateUS+'"]').length > 0){
							clearInterval(checkExist);
							if(typeof item.id !== 'undefined'){
								var html = '';
								html += '<div data-type="'+icon+'" data-id="'+item.id+'" data-date="'+dateItem.getTime()+'">';
									html += '<i class="fas fa-'+icon+' bg-'+color+'"></i>';
									html += '<div class="timeline-item">';
										html += '<span class="time"><i class="fas fa-clock mr-2"></i><time class="timeago" datetime="'+item.created.replace(/ /g, "T")+'">'+item.created+'</time></span>';
										html += '<h3 class="timeline-header">'+item.name+' was linked</h3>';
									html += '</div>';
								html += '</div>';
								timeline.find('div.time-label[data-dateus="'+dateUS+'"]').after(html);
								var element = timeline.find('[data-type="'+icon+'"][data-id="'+item.id+'"]');
								element.find('time').timeago();
								var items = timeline.children('div').detach().get();
								items.sort(function(a, b){
							    return new Date($(b).data("date")) - new Date($(a).data("date"));
							  });
								timeline.append(items);
								if(callback != null){ callback(element); }
							}
						}
					}, 100);
				},
				// contact:function(timeline, item, icon = 'address-card', color = 'secondary', callback = null){
				// 	var url = new URL(window.location.href);
				// 	var id = url.searchParams.get("id"), html = '';
				// 	var dateItem = new Date(item.created);
				// 	var dateUS = dateItem.toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, '-').replace(/,/g, '');
				// 	Engine.Builder.Timeline.add.date(timeline,item.created);
				// 	var checkExist = setInterval(function() {
				// 		if(timeline.find('div.time-label[data-dateus="'+dateUS+'"]').length > 0){
				// 			clearInterval(checkExist);
				// 			if(typeof item.id !== 'undefined'){
				// 				var html = '';
				// 				html += '<div data-type="'+icon+'" data-id="'+item.id+'" data-organization="'+item.organization+'" data-isEmployee="'+item.isEmployee+'" data-isContact="'+item.isContact+'" data-name="'+item.name+'" data-date="'+dateItem.getTime()+'">';
				// 					html += '<i class="fas fa-'+icon+' bg-'+color+'"></i>';
				// 					html += '<div class="timeline-item">';
				// 						html += '<span class="time"><i class="fas fa-clock mr-2"></i><time class="timeago" datetime="'+item.created.replace(/ /g, "T")+'">'+item.created+'</time></span>';
				// 						html += '<h3 class="timeline-header">'+item.name+' was created</h3>';
				// 					html += '</div>';
				// 				html += '</div>';
				// 				timeline.find('div.time-label[data-dateus="'+dateUS+'"]').after(html);
				// 				var element = timeline.find('[data-type="'+icon+'"][data-id="'+item.id+'"]');
				// 				element.find('time').timeago();
				// 				var items = timeline.children('div').detach().get();
				// 				items.sort(function(a, b){
				// 			    return new Date($(b).data("date")) - new Date($(a).data("date"));
				// 			  });
				// 				timeline.append(items);
				// 				if(callback != null){ callback(element); }
				// 			}
				// 		}
				// 	}, 100);
				// },
				user:function(timeline, item, icon = 'user', color = 'lightblue', callback = null){
					var url = new URL(window.location.href);
					var id = url.searchParams.get("id"), html = '';
					var dateItem = new Date(item.created);
					var dateUS = dateItem.toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, '-').replace(/,/g, '');
					Engine.Builder.Timeline.add.date(timeline,item.created);
					var checkExist = setInterval(function() {
						if(timeline.find('div.time-label[data-dateus="'+dateUS+'"]').length > 0){
							clearInterval(checkExist);
							if(typeof item.id !== 'undefined'){
								var html = '';
								html += '<div data-type="'+icon+'" data-id="'+item.id+'" data-date="'+dateItem.getTime()+'">';
									html += '<i class="fas fa-'+icon+' bg-'+color+'"></i>';
									html += '<div class="timeline-item">';
										html += '<span class="time"><i class="fas fa-clock mr-2"></i><time class="timeago" datetime="'+item.created.replace(/ /g, "T")+'">'+item.created+'</time></span>';
										html += '<h3 class="timeline-header">'+item.username+' was assigned</h3>';
									html += '</div>';
								html += '</div>';
								timeline.find('div.time-label[data-dateus="'+dateUS+'"]').after(html);
								var element = timeline.find('[data-type="'+icon+'"][data-id="'+item.id+'"]');
								element.find('time').timeago();
								var items = timeline.children('div').detach().get();
								items.sort(function(a, b){
							    return new Date($(b).data("date")) - new Date($(a).data("date"));
							  });
								timeline.append(items);
								if(callback != null){ callback(element); }
							}
						}
					}, 100);
				},
			},
		},
		table: function(element, data, options = {}, callback = null){
			var origin = new URL(window.location.href);
			var url = new URL(window.location.href);
			if(options instanceof Function){ callback = options; options = {}; }
			if(typeof options.key === 'undefined'){ options.key = 'id'; }
			if(typeof options.set === 'undefined'){ options.set = {}; }
			if(typeof options.href === 'undefined'){ options.href = url.href; }
			else { url = new URL(url.origin+options.href); }
			if(typeof options.plugin === 'undefined'){ options.plugin = url.searchParams.get("p"); }
			if(typeof options.clickable === 'undefined'){ options.clickable = {}; }
			if(typeof options.clickable.enable === 'undefined'){ options.clickable.enable = false; }
			if(typeof options.clickable.plugin === 'undefined'){ options.clickable.plugin = options.plugin; }
			if(typeof options.clickable.view === 'undefined'){ options.clickable.view = 'details'; }
			if(typeof options.clickable.key === 'undefined'){ options.clickable.key = options.key; }
			if(typeof options.css === 'undefined'){ options.css = {}; }
			if(typeof options.css.table === 'undefined'){ options.css.table = 'table-hover table-bordered'; }
			if(typeof options.css.thead === 'undefined'){ options.css.thead = 'thead-dark'; }
			if(typeof options.buttons === 'undefined'){ options.buttons = []; }
			if(options.buttons.length == 0){
				if(Engine.Auth.validate('plugin', options.plugin, 1)){ options.buttons.push({name: "Details", text: "Details", color: "primary" }); }
				if(Engine.Auth.validate('plugin', options.plugin, 3)){ options.buttons.push({name: "Edit", text: "", color: "warning" }); }
				if(Engine.Auth.validate('plugin', options.plugin, 4)){ options.buttons.push({name: "Delete", text: "", color: "danger" }); }
			}
			if(typeof options.controls === 'undefined'){ options.controls = {}; }
			if(typeof options.controls.label === 'undefined'){ options.controls.label = true; }
			if(typeof options.controls.disable === 'undefined'){ options.controls.disable = []; }
			if(typeof options.controls.add === 'undefined'){ options.controls.add = []; }
			var checkExist = setInterval(function() {
				if((Engine.Helper.isSet(Engine,['Contents','Auth','User']))&&(typeof Engine.Contents.Language !== 'undefined')){
					clearInterval(checkExist);

					// Insert table in DOM
					var html = '<div class="table-responsive"><table class="table '+options.css.table+'" style="width:100%"><thead class="'+options.css.thead+'"></thead></table></div>';
					element.addClass('p-0');
					element.html(html);

					// Generating Controls
					var btns = '<div class="btn-group">', color = '', icon = '', text = '', btnctn = 0;
					if(typeof options.buttons !== 'undefined'){
						for(var [index, btn] of Object.entries(options.buttons)){
							if(typeof btn.color !== 'undefined'){ color = btn.color; } else { color = 'default'; }
							if(typeof btn.icon !== 'undefined'){ icon = btn.icon.toLowerCase(); } else { icon = btn.name.toLowerCase(); }
							if(typeof btn.text !== 'undefined'){ text = btn.text; } else { text = Engine.Contents.Language[btn.name]; }
							if(text == ''){
								btns += '<button type="button" data-control="'+btn.name+'" class="btn btn-'+color+' btn-sm"><i class="icon icon-'+icon+'"></i>'+text+'</button>';
							} else {
								btns += '<button type="button" data-control="'+btn.name+'" class="btn btn-'+color+' btn-sm"><i class="icon icon-'+icon+' mr-1"></i>'+text+'</button>';
							}
							if((typeof btn.callback !== 'undefined')&&(btn.callback != null)){ btn.callback(); }
							++btnctn;
						}
					}
					btns += '</div>';

					// Generating Columns
					var cols = [], w = 78, colsct = 0, canAssign = false, canLock = false;
					cols.push({ name: "select", title: "", data: "select", width: "25px", defaultContent: '', targets: colsct, orderable: false, className: 'select-checkbox'});
					if(typeof options.headers !== 'undefined'){
						for(var [key, value] of Object.entries(options.headers)){
							if(value.toLowerCase() == 'assigned_to'){ canAssign = true; }
							if(value.toLowerCase() == 'isLocked'){ canLock = true; }
							++colsct;
							cols.push({ name: value.toLowerCase(), title: Engine.Contents.Language[Engine.Helper.ucfirst(Engine.Helper.clean(value))], data: value.toLowerCase(), defaultContent: '', targets: colsct });
							if(typeof Engine.Contents.Language[Engine.Helper.ucfirst(Engine.Helper.clean(value))] === 'undefined'){ console.log(Engine.Helper.ucfirst(Engine.Helper.clean(value))); }
						}
					} else {
						for (var [key, value] of Object.entries(data[0])) {
							if(key == 'assigned_to'){ canAssign = true; }
							if(key == 'isLocked'){ canLock = true; }
							++colsct;
							cols.push({ name: key, title: Engine.Contents.Language[Engine.Helper.ucfirst(Engine.Helper.clean(key))], data: key, defaultContent: '', targets: colsct });
							if(typeof Engine.Contents.Language[Engine.Helper.ucfirst(Engine.Helper.clean(key))] === 'undefined'){ console.log(Engine.Helper.ucfirst(Engine.Helper.clean(key))); }
						}
					}
					++colsct;
					w = (34 * btnctn) + w;
					if(options.buttons.length !== 0){ cols.push({ name: "action", title: "Action", data: "action", width: w+"px", defaultContent: btns, targets: colsct }); }

					// Rendering specialized columns
					for (var [key, value] of Object.entries(cols)) {
						switch(value.name){
							case"state":
								cols[key].render = function(data, type, row, meta){
									return Engine.Contents.States[data];
								};
								break;
							case"country":
								cols[key].render = function(data, type, row, meta){
									return Engine.Contents.Countries[data];
								};
								break;
							case"files":
							case"messages":
								cols[key].render = function(data, type, row, meta){
									return data.split(';').length;
								};
								break;
							case"assigned_to":
								cols[key].render = function(data, type, row, meta){
									var html = '';
									if((data != null)&&(data != '')){
										var users = data.replace(/; /g, ";").split(';');
										for (var [index, user] of Object.entries(users)) {
											if(user != ''){
											  if(index > 0){ html += '<span style="display:none;">;</span>'; }
											  html += '<span class="badge badge-primary m-1"><i class="fas fa-user mr-1"></i>'+user+'</span>';
											}
										}
										return html;
									} else { return data; }
								};
								break;
							case"organizations":
								cols[key].render = function(data, type, row, meta){
									var html = '';
									if((data != null)&&(data != '')){
										var organizations = data.replace(/; /g, ";").split(';');
										for (var [index, organization] of Object.entries(organizations)) {
											if(organization != ''){
											  if(index > 0){ html += '<span style="display:none;">;</span>'; }
											  html += '<span class="badge badge-primary m-1"><i class="fas fa-building mr-1"></i>'+organization+'</span>';
											}
										}
										return html;
									} else { return data; }
								};
								break;
							case"contacts":
								cols[key].render = function(data, type, row, meta){
									var html = '';
									if((data != null)&&(data != '')){
										var contacts = data.replace(/; /g, ";").split(';');
										for (var [index, contact] of Object.entries(contacts)) {
											if(contact != ''){
											  if(index > 0){ html += '<span style="display:none;">;</span>'; }
											  html += '<span class="badge badge-primary m-1"><i class="fas fa-address-card mr-1"></i>'+contact+'</span>';
											}
										}
										return html;
									} else { return data; }
								};
								break;
							case"meta":
								cols[key].render = function(data, type, row, meta){
									var html = '';
									if((data != null)&&(data != '')){
										for (var [index, reference] of Object.entries(data)) {
											if(reference != ''){
											  if(index > 0){ html += '<span style="display:none;">;</span>'; }
											  html += '<span class="badge badge-primary m-1"><i class="fas fa-tag mr-1"></i>'+reference+'</span>';
											}
										}
										return html;
									} else { return data; }
								};
								break;
							case"divisions":
								cols[key].render = function(data, type, row, meta){
									var html = '';
									if((data != null)&&(data != '')){
										var divisions = data.replace(/; /g, ";").split(';');
										for (var [index, division] of Object.entries(divisions)) {
											if(division != ''){
											  if(index > 0){ html += '<span style="display:none;">;</span>'; }
											  html += '<span class="badge badge-primary m-1"><i class="icon icon-divisions mr-1"></i>'+division+'</span>';
											}
										}
										return html;
									} else { return data; }
								};
								break;
							case"issues":
								cols[key].render = function(data, type, row, meta){
									var html = '';
									if((data != null)&&(data != '')){
										var issues = data.replace(/; /g, ";").split(';');
										for (var [index, issue] of Object.entries(issues)) {
											if(issue != ''){
											  if(index > 0){ html += '<span style="display:none;">;</span>'; }
											  html += '<span class="badge badge-primary m-1"><i class="icon icon-issues mr-1"></i>'+issue+'</span>';
											}
										}
										return html;
									} else { return data; }
								};
								break;
							case"tags":
								cols[key].render = function(data, type, row, meta){
									var html = '';
									if((data != null)&&(data != '')){
										var tags = data.replace(/; /g, ";").split(';');
										for (var [index, tag] of Object.entries(tags)) {
											if(tag != ''){
											  if(index > 0){ html += '<span style="display:none;">;</span>'; }
											  html += '<span class="badge badge-primary m-1"><i class="fas fa-tag mr-1"></i>'+tag+'</span>';
											}
										}
										return html;
									} else { return data; }
								};
								break;
							case"level":
								cols[key].render = function(data, type, row, meta){
									if((data != '')&&(typeof Engine.Contents.Statuses[options.clickable.plugin][data] !== 'undefined')){
										var html = '<span class="badge bg-'+Engine.Contents.Statuses[options.clickable.plugin][data].color+'">';
											html += '<i class="'+Engine.Contents.Statuses[options.clickable.plugin][data].icon+' mr-1"></i>';
											html += Engine.Contents.Language[Engine.Contents.Statuses[options.clickable.plugin][data].name];
										html += '</span>';
										return html;
									} else {
										return data;
									}
								};
								break;
							case"status":
								cols[key].render = function(data, type, row, meta){
									if((data != '')&&(Engine.Helper.isSet(Engine.Contents.Statuses,[options.clickable.plugin,data]))){
										if(Engine.Contents.Language[Engine.Contents.Statuses[options.clickable.plugin][data].name] == undefined){ console.log(Engine.Contents.Statuses[options.clickable.plugin][data].name); }
										var html = '<h4><span class="badge bg-'+Engine.Contents.Statuses[options.clickable.plugin][data].color+'">';
											html += '<i class="'+Engine.Contents.Statuses[options.clickable.plugin][data].icon+' mr-1"></i>';
											html += Engine.Contents.Language[Engine.Contents.Statuses[options.clickable.plugin][data].name];
										html += '</span></h4>';
										return html;
									} else {
										return data;
									}
								};
								break;
							case"priority":
								cols[key].render = function(data, type, row, meta){
									if((data != '')&&(Engine.Helper.isSet(Engine,['Contents','Priorities',options.clickable.plugin,data]))){
										var html = '<h4><span class="badge bg-'+Engine.Contents.Priorities[options.clickable.plugin][data].color+'">';
											html += '<i class="'+Engine.Contents.Priorities[options.clickable.plugin][data].icon+' mr-1"></i>';
											html += Engine.Contents.Language[Engine.Contents.Priorities[options.clickable.plugin][data].name];
										html += '</span></h4>';
										return html;
									} else {
										return data;
									}
								};
								break;
							case"isSigned":
							case"issigned":
								cols[key].render = function(data, type, row, meta){
									if((row.isSigned == "Active")||(row.isSigned == "active")){
										return '<h4><span class="badge bg-success"><i class="fas fa-check mr-1"></i>'+Engine.Helper.ucfirst(row.isSigned)+'</span></h4>';
									} else {
										row.isSigned = "inactive";
										return '<h4><span class="badge bg-danger"><i class="fas fa-ban mr-1"></i>'+Engine.Helper.ucfirst(row.isSigned)+'</span></h4>';
									}
								};
								break;
							case"isLocked":
							case"islocked":
							case"isDefault":
							case"isdefault":
								cols[key].render = function(data, type, row, meta){
									if((row[value.name])||(row[value.name] == "true")){
										return '<h4><span class="badge bg-success"><i class="fas fa-check mr-1"></i>'+Engine.Helper.ucfirst(row[value.name])+'</span></h4>';
									} else {
										row[value.name] = "false";
										return '<h4><span class="badge bg-danger"><i class="fas fa-ban mr-1"></i>'+Engine.Helper.ucfirst(row[value.name])+'</span></h4>';
									}
								};
								break;
							case"website":
								cols[key].render = function(data, type, row, meta){
									if(data != null){ return '<a href="'+data+'">'+data+'</a>'; }
									else { return ""; }
								};
								break;
							case"email":
								cols[key].render = function(data, type, row, meta){
									if(data != null){ return '<a href="mailto:'+data+'">'+data+'</a>'; }
									else { return ""; }
								};
								break;
							case"content":
								cols[key].render = function(data, type, row, meta){
									return data.replace(/<html>/,'').replace(/<\/html>/,'').replace(/<body>/,'').replace(/<\/body>/,'');
								};
								break;
							case"mobile":
							case"toll_free":
							case"office_num":
							case"other_num":
							case"phone":
								cols[key].render = function(data, type, row, meta){
									if(data != null && data != ''){ return '<a href="tel:'+data+'" class="btn btn-sm btn-success"><i class="fas fa-phone mr-1"></i>'+data+'</a>'; }
									else { return ""; }
								};
								break;
							default:
								break;
						}
					}

					// Initialize Datatable
					var table = element.children("div .table-responsive").children("table");
					var ctrlTxt = '', inputs = {}, hide = {}, href = '';
					if(typeof options.plugin !== 'undefined'){ var plugin = options.plugin;
					} else {
						if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = Engine.Contents.SettingsLandingPage; }
					}
					if(typeof options.view !== 'undefined'){ var view = options.view;
					} else {
						if(url.searchParams.get("v") != undefined){ var view = url.searchParams.get("v"); } else { var view = 'index'; }
					}
					if(url.searchParams.get("id") != undefined){ var record = url.searchParams.get("id"); } else { var record = 'any'; }
					var dt = table.DataTable({
						data: data,
						createdRow: function(row,data,dataIndex){
							if((typeof options.clickable !== 'undefined')&&(typeof options.clickable.enable !== 'undefined')&&(options.clickable.enable)){
								$(row).children(':not(:last-child)').addClass('pointer');
								$(row).children(':not(:first-child):not(:last-child)').click(function(){
									href = '?p='+options.clickable.plugin;
									if(typeof options.clickable.view !== 'undefined'){ href += '&v='+options.clickable.view; }
									var breadcrumbOpts = { keys:data };
									if((options != null)&&(Engine.Helper.isSet(options,['breadcrumb','title']))){ Engine.Helper.set(breadcrumbOpts,['breadcrumb','title'],data[options.breadcrumb.title]); }
									if(typeof options.clickable.key !== 'undefined'){
										href += '&id='+data[options.clickable.key];
										Engine.GUI.Breadcrumbs.add(data[options.clickable.key], href, breadcrumbOpts);
									} else {
										href += '&id='+data.id;
										Engine.GUI.Breadcrumbs.add(data.id, href, breadcrumbOpts);
									}
									tableOptions = {
										table:element,
										keys:data,
										key:options.key,
										href:href,
									};
									if(typeof options.load !== 'undefined'){ tableOptions.load = options.load; }
									if(typeof options.modal !== 'undefined'){ tableOptions.modal = options.modal; }
									if(typeof options.modalWidth !== 'undefined'){ tableOptions.modalWidth = options.modalWidth; }
									Engine.CRUD.read.show(tableOptions);
								});
							}
			      },
						fnDrawCallback:function(){
							table.find('input[type="checkbox"]').each(function(){
								var state = $(this).val();
								if((state == "true")||(state)){ $(this).bootstrapSwitch('state',true); } else { $(this).bootstrapSwitch('state',false); }
								$(this).bootstrapSwitch('disabled',true);
							});
						},
						searching: true,
						paging: true,
						pageLength: 10,
						lengthChange: true,
						lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
						ordering: true,
						info: true,
						autoWidth: true,
						processing: true,
						scrolling: false,
						buttons:[],
						rowId: 'id',
						dom: '<"dtbl-toolbar"Bf>rt<"dtbl-btoolbar"lip>',
						language: {
			        buttons: {
			          selectAll: Engine.Contents.Language["All"],
			          selectNone: Engine.Contents.Language["None"],
				      },
							info: ", Total _TOTAL_ entries",
					  },
						columnDefs: cols,
						select: {
							style: 'multi',
							selector: 'td:first-child'
						},
						order: [[ 1, "asc" ]]
					});
					if(typeof options.id !== 'undefined'){ var dtid = options.id; } else { var dtid = table.attr('id'); }
					var ohref = { plugin:origin.searchParams.get("p"), view:origin.searchParams.get("v"), id:dtid};
					if(ohref.plugin == null){ ohref.plugin = Engine.Contents.SettingsLandingPage; }
					if(ohref.view == null){ ohref.view = 'index'; }
					if(Engine.Helper.isSet(Engine,['Contents','Auth','Options','hide',ohref.plugin,ohref.view,'any','table',ohref.id])){
						hide = Engine.Contents.Auth.Options.hide[ohref.plugin][ohref.view].any.table[ohref.id];
					}
					if(cols.length > 0){
						var rec = { id:url.searchParams.get("id"),plugin:url.searchParams.get("p"),view:url.searchParams.get("v"), };
						if($('[data-plugin="'+rec.plugin+'"][data-key="id"]').length > 0){
							rec.id = $('[data-plugin="'+rec.plugin+'"][data-key="id"]').text();
						}
						for (var [key, value] of Object.entries(cols)){
							if((value.name != 'select')&&(value.name != 'action')){
								if((typeof options.predifined !== 'undefined')&&(!jQuery.isEmptyObject(options.predifined))&&(typeof options.predifined[value.name] !== 'undefined')){
									inputs[value.name] = options.predifined[value.name].replace(/%id%/g, rec.id).replace(/%plugin%/g, rec.plugin).replace(/%view%/g, rec.view);
								} else {
									inputs[value.name] = "";
								}
							}
						}
					}
					// Setting Visible Columns
					for (var [key, value] of Object.entries(hide)){
						dt.column(key+':name').visible(false);
					}
					// Creating Buttons
					var buttons = [];
					if((typeof options.controls.toolbar !== 'undefined')&&(options.controls.toolbar)){
						buttons = [];
						if((Engine.Auth.validate('button', 'hide', 1))&&(!options.controls.disable.includes('hide'))){ buttons.push({ text: '<i class="icon icon-hide mr-1"></i>'+Engine.Contents.Language['Hide'], action: function(){ Engine.CRUD.hide.show(table, { keys:inputs, id:dtid }); } }); }
						if((Engine.Auth.validate('button', 'filter', 1))&&(!options.controls.disable.includes('filter'))){ buttons.push({ text: '<i class="icon icon-filter mr-1"></i>'+Engine.Contents.Language['Filter'], action: function(){ Engine.CRUD.filter.show(table, { keys:inputs, id:dtid }); } }); }
						if((typeof options.controls.add !== 'undefined')&&(options.controls.add.length > 0)){
							for(var [key, value] of Object.entries(options.controls.add)){
								if((Engine.Auth.validate('button', value.name, 1))&&(typeof value.menu !== 'undefined')&&(value.menu == 'view')){ buttons.push({ text: value.text, action: value.action, table:table }); }
							}
						}
						dt.button().add(0,{
							extend: 'collection',
							text: Engine.Contents.Language['View'],
							autoClose: true,
							buttons:buttons,
						});
						buttons = [];
						if((Engine.Auth.validate('button', 'selectAll', 1))&&(!options.controls.disable.includes('selectAll'))){ buttons.push({ text: '<i class="icon icon-all mr-1"></i>'+Engine.Contents.Language['Select All'], extend: 'selectAll' }); }
						if((Engine.Auth.validate('button', 'selectNone', 1))&&(!options.controls.disable.includes('selectNone'))){ buttons.push({ text: '<i class="icon icon-none mr-1"></i>'+Engine.Contents.Language['Select None'], extend: 'selectNone' }); }
						if(typeof options.canAssign !== 'undefined'){ canAssign = options.canAssign; }
						if(canAssign){
							if((Engine.Auth.validate('plugin', options.plugin, 3))&&(Engine.Auth.validate('button', 'assign', 1))&&(!options.controls.disable.includes('assign'))){ buttons.push({ text: '<i class="icon icon-assign mr-1"></i>'+Engine.Contents.Language['Assign'], action: function(){ Engine.CRUD.assign.show(table,{plugin:options.plugin}); } }); }
							if((Engine.Auth.validate('plugin', options.plugin, 3))&&(Engine.Auth.validate('button', 'unassign', 1))&&(!options.controls.disable.includes('unassign'))){ buttons.push({ text: '<i class="icon icon-unassign mr-1"></i>'+Engine.Contents.Language['Unassign'], action: function(){ Engine.CRUD.unassign.show(table,{plugin:options.plugin}); } }); }
						}
						if(typeof options.canLock !== 'undefined'){ canLock = options.canLock; }
						if(canLock){
							if((Engine.Auth.validate('plugin', options.plugin, 3))&&(Engine.Auth.validate('button', 'lock', 1))&&(!options.controls.disable.includes('lock'))){ buttons.push({ text: '<i class="icon icon-lock mr-1"></i>'+Engine.Contents.Language['Lock'], action: function(){ Engine.CRUD.lock.show(table,{plugin:options.plugin}); } }); }
							if((Engine.Auth.validate('plugin', options.plugin, 3))&&(Engine.Auth.validate('button', 'unlock', 1))&&(!options.controls.disable.includes('unlock'))){ buttons.push({ text: '<i class="icon icon-unlock mr-1"></i>'+Engine.Contents.Language['Unlock'], action: function(){ Engine.CRUD.unlock.show(table,{plugin:options.plugin}); } }); }
						}
						if((Engine.Auth.validate('plugin', options.plugin, 4))&&(Engine.Auth.validate('button', 'delete', 1))&&(!options.controls.disable.includes('delete'))){ buttons.push({ text: '<i class="icon icon-delete mr-1"></i>'+Engine.Contents.Language['Delete'], action: function(){ Engine.CRUD.deleteAll.show(table,{plugin:options.plugin}); } }); }
						if((typeof options.controls.add !== 'undefined')&&(options.controls.add.length > 0)){
							for(var [key, value] of Object.entries(options.controls.add)){
								if((Engine.Auth.validate('button', value.name, 1))&&(typeof value.menu !== 'undefined')&&(value.menu == 'edit')){ buttons.push({ text: value.text, action: value.action, table:table }); }
							}
						}
						dt.button().add(0,{
							extend: 'collection',
							text: Engine.Contents.Language['Edit'],
							autoClose: true,
							buttons:buttons,
						});
						buttons = [];
						if((Engine.Auth.validate('plugin', options.plugin, 2))&&(Engine.Auth.validate('button', 'create', 1))&&(!options.controls.disable.includes('create'))){ buttons.push({ text: '<i class="icon icon-create mr-1"></i>'+Engine.Contents.Language['Create'], action: function(){ Engine.CRUD.create.show({ plugin:options.plugin, table:table, keys:inputs, key:options.key, set:options.set }); } }); }
						if((typeof options.controls.add !== 'undefined')&&(options.controls.add.length > 0)){
							for(var [key, value] of Object.entries(options.controls.add)){
								if((Engine.Auth.validate('button', value.name, 1))&&(typeof value.menu !== 'undefined')&&(value.menu == 'file')){ buttons.push({ text: value.text, action: value.action, table:table }); }
							}
						}
						dt.button().add(0,{
							extend: 'collection',
							text: Engine.Contents.Language['File'],
							autoClose: true,
							buttons:buttons,
						});
					} else {
						if((Engine.Auth.validate('plugin', options.plugin, 3))&&(Engine.Auth.validate('button', 'assign', 1))&&(!options.controls.disable.includes('assign'))){
							if((typeof options.controls.label !== 'undefined')&&(options.controls.label)){
								ctrlTxt = '<i class="icon icon-assign mr-1"></i>'+Engine.Contents.Language['Assign'];
							} else { ctrlTxt = '<i class="icon icon-assign"></i>'; }
							dt.button().add(0,{ text: ctrlTxt, action: function(){ Engine.CRUD.assign.show(table,{plugin:options.plugin}); } });
						}
						if((Engine.Auth.validate('plugin', options.plugin, 3))&&(Engine.Auth.validate('button', 'unassign', 1))&&(!options.controls.disable.includes('unassign'))){
							if((typeof options.controls.label !== 'undefined')&&(options.controls.label)){
								ctrlTxt = '<i class="icon icon-unassign mr-1"></i>'+Engine.Contents.Language['Unassign'];
							} else { ctrlTxt = '<i class="icon icon-unassign"></i>'; }
							dt.button().add(0,{ text: ctrlTxt, action: function(){ Engine.CRUD.unassign.show(table,{plugin:options.plugin}); } });
						}
						if((Engine.Auth.validate('plugin', options.plugin, 4))&&(Engine.Auth.validate('button', 'delete', 1))&&(!options.controls.disable.includes('delete'))){
							if((typeof options.controls.label !== 'undefined')&&(options.controls.label)){
								ctrlTxt = '<i class="icon icon-delete mr-1"></i>'+Engine.Contents.Language['Delete'];
							} else { ctrlTxt = '<i class="icon icon-delete"></i>'; }
							dt.button().add(0,{ text: ctrlTxt, action: function(){ Engine.CRUD.deleteAll.show(table,{plugin:options.plugin}); } });
						}
						if((Engine.Auth.validate('button', 'selectNone', 1))&&(!options.controls.disable.includes('selectNone'))){
							if((typeof options.controls.label !== 'undefined')&&(options.controls.label)){
								ctrlTxt = '<i class="icon icon-none mr-1"></i>'+Engine.Contents.Language['None'];
							} else { ctrlTxt = '<i class="icon icon-none"></i>'; }
							dt.button().add(0,{ text: ctrlTxt, extend: 'selectNone' });
						}
						if((Engine.Auth.validate('button', 'selectAll', 1))&&(!options.controls.disable.includes('selectAll'))){
							if((typeof options.controls.label !== 'undefined')&&(options.controls.label)){
								ctrlTxt = '<i class="icon icon-all mr-1"></i>'+Engine.Contents.Language['All'];
							} else { ctrlTxt = '<i class="icon icon-all"></i>'; }
							dt.button().add(0,{ text: ctrlTxt, extend: 'selectAll' });
						}
						if((Engine.Auth.validate('button', 'filter', 1))&&(!options.controls.disable.includes('filter'))){
							if((typeof options.controls.label !== 'undefined')&&(options.controls.label)){
								ctrlTxt = '<i class="icon icon-filter mr-1"></i>'+Engine.Contents.Language['Filter'];
							} else { ctrlTxt = '<i class="icon icon-filter"></i>'; }
							dt.button().add(0,{ text: ctrlTxt, action: function(){ Engine.CRUD.filter.show(table, { keys:inputs, id:dtid }); } });
						}
						if((Engine.Auth.validate('button', 'hide', 1))&&(!options.controls.disable.includes('hide'))){
							if((typeof options.controls.label !== 'undefined')&&(options.controls.label)){
								ctrlTxt = '<i class="icon icon-hide mr-1"></i>'+Engine.Contents.Language['Hide'];
							} else { ctrlTxt = '<i class="icon icon-hide"></i>'; }
							dt.button().add(0,{ text: ctrlTxt, action: function(){ Engine.CRUD.hide.show(table, { keys:inputs, id:dtid }); } });
						}
						if((Engine.Auth.validate('plugin', options.plugin, 2))&&(Engine.Auth.validate('button', 'create', 1))&&(!options.controls.disable.includes('create'))){
							if((typeof options.controls.label !== 'undefined')&&(options.controls.label)){
								ctrlTxt = '<i class="icon icon-create mr-1"></i>'+Engine.Contents.Language['Create'];
							} else { ctrlTxt = '<i class="icon icon-create"></i>'; }
							dt.button().add(0,{ text: ctrlTxt, action: function(){ Engine.CRUD.create.show({ plugin:options.plugin, table:table, keys:inputs, key:options.key, set:options.set }); } });
						}
						if((typeof options.controls.add !== 'undefined')&&(options.controls.add.length > 0)){
							for(var [key, value] of Object.entries(options.controls.add)){
								if(Engine.Auth.validate('button', value.name, 1)){ dt.button().add(0,{ text: value.text, action: value.action, table:table }); }
							}
						}
					}
					// Row Controls
					table.find('button').each(function(){
						var control = $(this).attr('data-control');
						var rowdata = dt.row($(this).parents('tr')).data();
						$(this).click(function(){
							var lcontrol = control.toLowerCase();
							href = '?p='+plugin;
							href += '&v='+lcontrol;
							if(typeof options.key !== 'undefined'){
								href += '&id='+rowdata[options.key];
								thref = rowdata[options.key];
							} else {
								href += '&id='+rowdata.id;
								thref = rowdata.id;
							}
							switch(control){
								case"Details":
									Engine.GUI.Breadcrumbs.add(thref, href, { key:options.key, keys:rowdata });
									tableOptions = {
										table:element,
										keys:data,
										key:options.key,
										href:href,
									};
									if(typeof options.load !== 'undefined'){ tableOptions.load = options.load; }
									if(typeof options.modal !== 'undefined'){ tableOptions.modal = options.modal; }
									if(typeof options.modalWidth !== 'undefined'){ tableOptions.modalWidth = options.modalWidth; }
									Engine.CRUD.read.show(tableOptions);
									break;
								case"Edit":
									Engine.CRUD.update.show({ table:table, row:$(this).parents('tr'), keys:rowdata, key:options.key, modal:options.modal, plugin:options.plugin });
									break;
								case"Delete":
									Engine.CRUD.delete.show({ table:table, row:$(this).parents('tr'), keys:rowdata, key:options.key, modal:options.modal, plugin:options.plugin });
									break;
								default:
									for(var [key, value] of Object.entries(options.buttons)){
										if((value.name == control)&&(typeof value.callback !== 'undefined')){ value.callback(table, rowdata) }
									}
									break;
							}
						});
					});
					if(callback != null){ callback({ table: table, datatable: dt }); }
				}
			}, 100);
		},
		dropzone: function(element,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var previewTemplate = '';
      previewTemplate += '<div class="row mt-2">';
        previewTemplate += '<div class="col-auto">';
            previewTemplate += '<span class="preview"><img src="data:," alt="" data-dz-thumbnail /></span>';
        previewTemplate += '</div>';
				previewTemplate += '<div class="col">';
					previewTemplate += '<div class="row">';
		        previewTemplate += '<div class="col-12">';
		            previewTemplate += '<p class="mb-0">';
		              previewTemplate += '<span class="lead mr-2" data-dz-name></span>(<span data-dz-size></span>)';
		            previewTemplate += '</p>';
		            previewTemplate += '<strong class="error text-danger" data-dz-errormessage></strong>';
		        previewTemplate += '</div>';
		        previewTemplate += '<div class="col-12">';
		            previewTemplate += '<div class="progress progress-striped active w-100" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">';
		              previewTemplate += '<div class="progress-bar progress-bar-success" style="width:0%;" data-dz-uploadprogress></div>';
		            previewTemplate += '</div>';
		        previewTemplate += '</div>';
		        previewTemplate += '<div class="col-12 d-flex align-items-right">';
		          previewTemplate += '<div class="btn-group ml-auto mt-1">';
		            previewTemplate += '<button class="btn btn-sm btn-primary start">';
		              previewTemplate += '<i class="fas fa-upload mr-1"></i>'+Engine.Contents.Language['Upload'];
		            previewTemplate += '</button>';
		            previewTemplate += '<button data-dz-remove class="btn btn-sm btn-warning cancel">';
		              previewTemplate += '<i class="fas fa-times-circle mr-1"></i>'+Engine.Contents.Language['Cancel'];
		            previewTemplate += '</button>';
		            previewTemplate += '<button data-dz-remove class="btn btn-sm btn-danger delete">';
									previewTemplate += '<i class="fas fa-trash mr-1"></i>'+Engine.Contents.Language['Delete'];
		            previewTemplate += '</button>';
		          previewTemplate += '</div>';
		        previewTemplate += '</div>';
					previewTemplate += '</div>';
				previewTemplate += '</div>';
      previewTemplate += '</div>';
			var defaults = {
				url: "api.php",
		    thumbnailWidth: 80,
		    thumbnailHeight: 80,
		    parallelUploads: 20,
				maxFilesize: 0,
		    previewTemplate: previewTemplate,
				acceptedFiles: null,
		    autoQueue: false,
		    previewsContainer: ".dropzone-previews",
		    clickable: ".fileinput-button",
			};
			for(var [key, value] of Object.entries(options)){ if(Engine.Helper.isSet(defaults,[key])){ defaults[key] = value; } }
			var html = '';
			html += '<div class="aDropZone">';
				html += '<div class="row">';
	        html += '<div class="col-lg-6">';
	          html += '<div class="btn-group w-100">';
							html += '<button class="btn btn-app btn-success col fileinput-button"><i class="fas fa-plus mr-1"></i>'+Engine.Contents.Language['Add']+'</button>';
	            html += '<button type="submit" class="btn btn-app btn-primary col start"><i class="fas fa-upload mr-1"></i>'+Engine.Contents.Language['Upload']+'</button>';
	            html += '<button type="reset" class="btn btn-app btn-warning col cancel"><i class="fas fa-times-circle mr-1"></i>'+Engine.Contents.Language['Cancel']+'</button>';
	          html += '</div>';
	        html += '</div>';
	        html += '<div class="col-lg-6 d-flex align-items-center">';
	          html += '<div class="fileupload-process w-100">';
	            html += '<div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">';
	              html += '<div class="progress-bar progress-bar-success" style="width:0%;" data-dz-uploadprogress></div>';
	            html += '</div>';
	          html += '</div>';
	        html += '</div>';
	      html += '</div>';
	      html += '<div class="table table-striped files dropzone-previews"></div>';
			html += '</div>';
			element.append(html);
			var zone = element.find('div.aDropZone').first();
			var actions = element.find('div.row').first();
			var fileinput = actions.find('span.fileinput-button').first();
			var previews = element.find('div.table.files.dropzone-previews').first();
			var progressTotal = actions.find('div.progress.progress-striped').first();
			var progressTotalBar = progressTotal.find('div.progress-bar').first();

			// Create Dropzone
			zone.dropzone(defaults);

		  zone[0].dropzone.on("addedfile", function(file) {
		    // Hookup the start button
		    file.previewElement.querySelector(".start").onclick = function() { zone[0].dropzone.enqueueFile(file) }
				// Callback
				if(callback != null){ callback('addedfile',zone[0].dropzone,file); }
		  })

		  // Update the total progress bar
		  zone[0].dropzone.on("totaluploadprogress", function(progress) {
		    progressTotalBar.css('width',progress + "%")
				// Callback
				if(callback != null){ callback('totaluploadprogress',zone[0].dropzone,progress); }
		  })

		  zone[0].dropzone.on("sending", function(file) {
		    // Reset the total progress bar when upload starts
				progressTotalBar.css('width',0 + "%")
		    // And disable the start button
		    file.previewElement.querySelector(".start").setAttribute("disabled", "disabled");
				// Callback
				if(callback != null){ callback('sending',zone[0].dropzone,file); }
		  })

		  // Hide the total progress bar when nothing's uploading anymore
		  zone[0].dropzone.on("queuecomplete", function(progress) {
				// Callback
				if(callback != null){ callback('queuecomplete',zone[0].dropzone,progress); }
		  })

		  // Setup the buttons for all transfers
			actions.find('.start').off().click(function(){
				zone[0].dropzone.enqueueFiles(zone[0].dropzone.getFilesWithStatus(Dropzone.ADDED));
				// Callback
				if(callback != null){ callback('start',zone[0].dropzone,null); }
			});
			actions.find('.cancel').off().click(function(){
				// Remove Files
				zone[0].dropzone.removeAllFiles(true);
				// Callback
				if(callback != null){ callback('cancel',zone[0].dropzone,null); }
			});
		},
		modal: function(element, options = null, callback = null){
			if(options != null){
				if(options instanceof Function){
					callback = options;
					options = { title:'', icon:'unknown', css:{ modal: '', dialog: '', header: '', body: '' } }
				} else {
					if(typeof options.title === 'undefined'){ options.title = ''; }
					if(typeof options.icon === 'undefined'){ options.icon = options.title.toLowerCase().replace(/ /g, ""); }
					if(typeof options.css === 'undefined'){ options.css = { modal: '', dialog: '', header: '' }; }
					if(typeof options.css.modal === 'undefined'){ options.css.modal = ''; }
					if(typeof options.css.dialog === 'undefined'){ options.css.modal = ''; }
					if(typeof options.css.header === 'undefined'){ options.css.modal = ''; }
					if(typeof options.css.body === 'undefined'){ options.css.body = ''; }
				}
			} else {
				options = { title:'', icon:'unknown', css:{ modal: '', dialog: '', header: '', body: '' } }
			}
			var maxit = 25, start = 0;
			var checkExist = setInterval(function() {
				++start;
				if((Engine.Helper.isSet(Engine,['Contents','Auth','User']))&&(typeof Engine.Contents.Language !== 'undefined')){
					clearInterval(checkExist);
					// Insert modal in DOM
					var html = '';
					++Engine.Builder.counts.modal;
					html += '<div id="modal_'+Engine.Builder.counts.modal+'" class="modal fade '+options.css.modal+'" tabindex="-1" aria-modal="true" role="dialog" aria-hidden="true"	>';
						html += '<div class="modal-dialog '+options.css.dialog+'">';
			        html += '<div class="modal-content">';
								html += '<div class="modal-header '+options.css.header+'">';
			            html += '<h4 class="modal-title"><i class="icon icon-'+options.icon+' mr-1"></i>'+Engine.Contents.Language[options.title]+'</h4>';
									if(typeof Engine.Contents.Language[options.title] === 'undefined'){ console.log(options.title); }
									html += '<div class="btn-group" style="font-size:16px;">';
										html += '<button type="button" data-control="hide" class="close">';
											html += '<i class="fas fa-eye mt-1"></i>';
										html += '</button>';
										html += '<button type="button" data-control="update" class="close">';
											html += '<i class="icon icon-edit"></i>';
										html += '</button>';
				            html += '<button type="button" class="close" data-dismiss="modal">';
				              html += '<i class="far fa-window-close mt-1"></i>';
				            html += '</button>';
				          html += '</div>';
								html += '</div>';
			          html += '<div class="modal-body '+options.css.body+'"></div>';
			          html += '<div class="modal-footer justify-content-between">';
			            html += '<button type="button" class="btn btn-default" data-dismiss="modal"><i class="icon icon-cancel mr-1"></i>'+Engine.Contents.Language['Cancel']+'</button>';
			          html += '</div>';
			        html += '</div>';
			      html += '</div>';
			    html += '</div>';
					if((typeof options.zindex !== 'undefined')&&(options.zindex == "top")){
						element.append(html);
						var modal = element.find('#modal_'+Engine.Builder.counts.modal);
					} else if((typeof options.after !== 'undefined')&&(typeof options.after.after !== 'undefined')) {
						console.log(options.after);
						options.after.after(html);
						var modal = options.after.parent().find('#modal_'+Engine.Builder.counts.modal);
					} else if((typeof options.before !== 'undefined')&&(typeof options.before.before !== 'undefined')) {
						console.log(options.before);
						options.before.before(html);
						var modal = options.after.parent().find('#modal_'+Engine.Builder.counts.modal);
					} else {
						element.prepend(html);
						var modal = element.find('#modal_'+Engine.Builder.counts.modal);
					}
					modal.find('.modal-header').find('button[data-control]').each(function(){
						$(this).click(function(){
							switch($(this).attr('data-control')){
								case"hide":
									var form = modal.parent();
									var formid = form.attr('id');
									var keys = {}, key = '';
									form.find('[data-form]').each(function(){
										key = $(this).attr('data-key');
										keys[key] = "";
									});
									Engine.CRUD.hide.show(form, { keys:keys, id:formid });
									break;
								case"update":
									var keys = {}, key = '', plugin = null;
									modal.find('[data-plugin][data-key]').each(function(){
										if(plugin == null){ plugin = $(this).attr('data-plugin'); }
										if($(this).attr('data-plugin') == plugin){ key = $(this).attr('data-key'); keys[key] = $(this).text(); }
									});
									Engine.CRUD.update.show({ container:element, keys:keys });
									break;
							}
						});
					});
					modal.on('hidden', function() { $.fn.modal.Constructor.prototype._enforceFocus = enforceModalFocusFn; });
					if(callback != null){ callback(modal); }
				}
				if(start == maxit){ clearInterval(checkExist); }
			}, 100);
		},
		form: function(element, data, callback = null){
			var maxit = 25, start = 0;
			var checkExist = setInterval(function() {
				++start;
				if((Engine.Helper.isSet(Engine,['Contents','Auth','User']))&&(typeof Engine.Contents.Language !== 'undefined')){
					clearInterval(checkExist);
					// Insert modal in DOM
					++Engine.Builder.counts.form;
					element.wrap('<form id="form_'+Engine.Builder.counts.form+'"></form>');
					form = element.parent();
					var formCTN = {};
					switch(element.attr('class').split(' ')[0]){
						case"modal":
							formCTN = element.find('.modal-body');
							break;
						case"card":
							formCTN = element.find('.card-body');
							break;
						default:
							formCTN = element;
							break;
					}
					formCTN.addClass('row py-0 px-2');
					for (var [key, value] of Object.entries(data)) {
						Engine.Builder.input(formCTN, key, value,{plugin:options.plugin}, function(input){
							input.find('input').attr('data-form',form.attr('id'));
							input.find('select').attr('data-form',form.attr('id'));
							input.wrap('<div class="col-6 p-2"></div>');
						});
					}
					if(callback != null){ callback(form); }
				}
				if(start == maxit){ clearInterval(checkExist); }
			}, 100);
		},
		input: function(element, index, value = '', options = null, callback = null){
			if(value == null){ value = ''; }
			var url = new URL(window.location.href);
			if((options != null)&&(options instanceof Function)){ callback = options; options = {}; }
			if(options == null){ options = {}; }
			if(typeof options.plugin !== 'undefined'){ plugin = options.plugin; } else { plugin = url.searchParams.get("p"); }
			if(typeof options.view !== 'undefined'){ view = options.view; } else { view = url.searchParams.get("v"); }
			if(typeof options.icon !== 'undefined'){ icon = options.icon; } else { icon = 'icon icon-'+index; }
			if((view == '')||(view == null)){ view = 'index'; }
			++Engine.Builder.counts.input;
			var title = Engine.Helper.ucfirst(Engine.Helper.clean(index));
			if(typeof Engine.Contents.Language[title] === 'undefined'){ console.log(title); }
			title = Engine.Contents.Language[title];
			var inputForm = '', inputReady = false, cancelReady = true, input = {};
			if(typeof options.type !== 'undefined'){
				switch(options.type){
					case "textarea":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div style="width:100%">';
			        	inputForm += '<textarea data-key="'+index+'" title="'+title+'" name="'+index+'" class="form-control" placeholder="'+title+'">'+value+'</textarea>';
			      	inputForm += '</div>';
						inputForm += '</div>';
						inputReady = true;
						break;
					case "select":
						if(Engine.Helper.isSet(options,['list',index])){
							inputForm += '<div class="input-group" data-key="'+index+'">';
								inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
								inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(options.list[index])){
									if(val == value){ inputForm += '<option value="'+val+'" selected="selected">'+Engine.Helper.ucfirst(Engine.Helper.clean(val))+'</option>'; } else { inputForm += '<option value="'+val+'">'+Engine.Helper.ucfirst(Engine.Helper.clean(val))+'</option>'; }
								};
								inputForm += '</select>';
							inputForm += '</div>';
							inputReady = true;
						} else { cancelReady = false;inputReady = true; }
						break;
					case "select-multiple":
						if(Engine.Helper.isSet(options,['list',index])){
							inputForm += '<div class="input-group" data-key="'+index+'">';
								inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
								inputForm += '<select data-key="'+index+'" multiple="" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(options.list[index])){
									if(val == value){ inputForm += '<option value="'+val+'" selected="selected">'+Engine.Helper.ucfirst(Engine.Helper.clean(val))+'</option>'; } else { inputForm += '<option value="'+val+'">'+Engine.Helper.ucfirst(Engine.Helper.clean(val))+'</option>'; }
								};
								inputForm += '</select>';
							inputForm += '</div>';
							inputReady = true;
						} else { cancelReady = false;inputReady = true; }
						break;
					case "number":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
			      	inputForm += '<input type="number" class="form-control" data-key="'+index+'" name="'+index+'" value="'+parseInt(value)+'" placeholder="'+title+'" title="'+title+'">';
						inputForm += '</div>';
						inputReady = true;
						break;
					case "password":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
			      	inputForm += '<input type="password" class="form-control" data-key="'+index+'" name="'+index+'" value="'+value+'" placeholder="'+title+'" title="'+title+'">';
						inputForm += '</div>';
						inputReady = true;
						break;
					case "switch":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							inputForm += '<input type="text" class="form-control switch-spacer" disabled>';
							inputForm += '<div class="input-group-append">';
								inputForm += '<div class="input-group-text p-1">';
									if((value == "true")||(value == true)){
										inputForm += '<input type="checkbox" data-key="'+index+'" name="'+index+'" title="'+title+'" checked>';
									} else {
										inputForm += '<input type="checkbox" data-key="'+index+'" name="'+index+'" title="'+title+'">';
									}
								inputForm += '</div>';
							inputForm += '</div>';
						inputForm += '</div>';
						inputReady = true;
						break;
					default:
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
			      	inputForm += '<input type="text" class="form-control" data-key="'+index+'" name="'+index+'" value="'+value+'" placeholder="'+title+'" title="'+title+'">';
						inputForm += '</div>';
						inputReady = true;
						break;
				}
			} else {
				switch(index){
					case "about":
					case "content":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div style="width:100%">';
			        	inputForm += '<textarea data-key="'+index+'" title="'+title+'" name="'+index+'" class="form-control" placeholder="'+title+'">'+value+'</textarea>';
			      	inputForm += '</div>';
						inputForm += '</div>';
						inputReady = true;
						break;
					case "country":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
							$.each(Engine.Contents.Countries, function(key, val){
								if(key == value){ inputForm += '<option value="'+key+'" selected="selected">'+key+' - '+val+'</option>'; } else { inputForm += '<option value="'+key+'">'+key+' - '+val+'</option>'; }
							});
							inputForm += '</select>';
						inputForm += '</div>';
						inputReady = true;
						break;
					case "status":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
							$.each(Engine.Contents.Statuses[plugin], function(key, val){
								if(key == value){ inputForm += '<option value="'+key+'" selected="selected">'+Engine.Contents.Statuses[plugin][key].name+'</option>'; } else { inputForm += '<option value="'+key+'">'+Engine.Contents.Statuses[plugin][key].name+'</option>'; }
							});
							inputForm += '</select>';
						inputForm += '</div>';
						inputReady = true;
						break;
					case "priority":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
							$.each(Engine.Contents.Priorities[plugin], function(key, val){
								if(key == value){ inputForm += '<option value="'+key+'" selected="selected">'+Engine.Contents.Priorities[plugin][key].name+'</option>'; } else { inputForm += '<option value="'+key+'">'+Engine.Contents.Priorities[plugin][key].name+'</option>'; }
							});
							inputForm += '</select>';
						inputForm += '</div>';
						inputReady = true;
						break;
					case "state":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
							$.each(Engine.Contents.States, function(key, val){
								if(key == value){ inputForm += '<option value="'+key+'" selected="selected">'+key+' - '+val+'</option>'; } else { inputForm += '<option value="'+key+'">'+key+' - '+val+'</option>'; }
							});
							inputForm += '</select>';
						inputForm += '</div>';
						inputReady = true;
						break;
					case "supervisor":
					case "assigned_to":
					case "user":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							if(Engine.Helper.isSet(Engine,['Contents','data','dom','users'])){
								inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(Engine.Contents.data.dom.users)){
									if(val.username == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.username+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.username+'</option>'; }
								};
								inputForm += '</select>';
								inputForm += '</div>';
								inputReady = true;
							} else {
								Engine.request('users','read',function(result){
									var dataset = JSON.parse(result);
									for(var [key, val] of Object.entries(dataset.output.dom)){ Engine.Helper.set(Engine.Contents,['data','dom','users',val.username],val); }
									for(var [key, val] of Object.entries(dataset.output.raw)){ Engine.Helper.set(Engine.Contents,['data','raw','users',val.id],val); }
									inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
									for(var [key, val] of Object.entries(Engine.Contents.data.dom.users)){
										if(val.id == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.username+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.username+'</option>'; }
									};
									inputForm += '</select>';
									inputForm += '</div>';
									inputReady = true;
								});
							}
						break;
					case "organizations":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							if(Engine.Helper.isSet(Engine,['Contents','data','dom','organizations'])){
								inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(Engine.Contents.data.dom.organizations)){
									if(val.name == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.name+'</option>'; }
								};
								inputForm += '</select>';
								inputForm += '</div>';
								inputReady = true;
							} else {
								Engine.request('organizations','read',function(result){
									var dataset = JSON.parse(result);
									for(var [key, val] of Object.entries(dataset.output.dom)){ Engine.Helper.set(Engine.Contents,['data','dom','organizations',val.id],val); }
									for(var [key, val] of Object.entries(dataset.output.raw)){ Engine.Helper.set(Engine.Contents,['data','raw','organizations',val.id],val); }
									inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
									for(var [key, val] of Object.entries(Engine.Contents.data.dom.organizations)){
										if(val.id == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.name+'</option>'; }
									};
									inputForm += '</select>';
									inputForm += '</div>';
									inputReady = true;
								});
							}
						break;
					case "group":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							if(Engine.Helper.isSet(Engine,['Contents','data','dom','groups'])){
								inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(Engine.Contents.data.dom.groups)){
									if(val.name == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.name+'</option>'; }
								};
								inputForm += '</select>';
								inputForm += '</div>';
								inputReady = true;
							} else {
								Engine.request('groups','read',function(result){
									var dataset = JSON.parse(result);
									for(var [key, val] of Object.entries(dataset.output.dom)){ Engine.Helper.set(Engine.Contents,['data','dom','groups',val.name],val); }
									for(var [key, val] of Object.entries(dataset.output.raw)){ Engine.Helper.set(Engine.Contents,['data','raw','groups',val.id],val); }
									inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
									for(var [key, val] of Object.entries(Engine.Contents.data.dom.groups)){
										if(val.id == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.name+'</option>'; }
									};
									inputForm += '</select>';
									inputForm += '</div>';
									inputReady = true;
								});
							}
						break;
					case "lead":
					case "client":
					case "organization":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							if(Engine.Helper.isSet(Engine,['Contents','data','form',plugin,view,index])){
								inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(Engine.Contents.data.form[plugin][view][index])){
									if(key == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.name+'</option>'; }
								};
								inputForm += '</select>';
								inputForm += '</div>';
								inputReady = true;
							} else {
								Engine.request('organizations','read',function(result){
									var dataset = JSON.parse(result);
									for(var [key, val] of Object.entries(dataset.output.dom)){ Engine.Helper.set(Engine.Contents,['data','form',plugin,view,index,val.name],val); }
									for(var [key, val] of Object.entries(dataset.output.raw)){ Engine.Helper.set(Engine.Contents,['data','form',plugin,view,index,val.name],val); }
									if(!Engine.Helper.isSet(Engine.Contents,['data','dom',plugin])){ Engine.Helper.set(Engine.Contents,['data','dom',plugin],{}); }
									if(!Engine.Helper.isSet(Engine.Contents,['data','raw',plugin])){ Engine.Helper.set(Engine.Contents,['data','raw',plugin],{}); }
									inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
									for(var [key, val] of Object.entries(Engine.Contents.data.form[plugin][view][index])){
										if(key == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.name+'</option>'; }
									};
									inputForm += '</select>';
									inputForm += '</div>';
									inputReady = true;
								});
							}
						break;
					case "contact":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							if(Engine.Helper.isSet(options,['list','contacts'])){
								inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(options.list.contacts)){
									if(key == value){ inputForm += '<option value="'+key+'" selected="selected">'+val+'</option>'; } else { inputForm += '<option value="'+key+'">'+val+'</option>'; }
								};
								inputForm += '</select>';
								inputForm += '</div>';
								inputReady = true;
							} else {
								if(typeof Engine.Contents.data.dom.contacts !== 'undefined'){
									inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
									for(var [key, val] of Object.entries(Engine.Contents.data.dom.contacts)){
										if(key == value){ inputForm += '<option value="'+val.id+'" data-client="'+val.link_to+'" selected="selected">'+val.first_name+' '+val.last_name+'</option>'; } else { inputForm += '<option value="'+val.id+'" data-client="'+val.link_to+'">'+val.first_name+' '+val.last_name+'</option>'; }
									};
									inputForm += '</select>';
									inputForm += '</div>';
									inputReady = true;
								} else {
									Engine.request('contacts','read',function(result){
										var dataset = JSON.parse(result);
										for(var [key, val] of Object.entries(dataset.output.dom)){ Engine.Helper.set(Engine.Contents,['data','dom','clients',val.id],val); }
										for(var [key, val] of Object.entries(dataset.output.raw)){ Engine.Helper.set(Engine.Contents,['data','raw','clients',val.id],val); }
										inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
										for(var [key, val] of Object.entries(Engine.Contents.data.dom.contacts)){
											if(key == value){ inputForm += '<option value="'+val.id+'" data-client="'+val.link_to+'" selected="selected">'+val.first_name+' '+val.last_name+'</option>'; } else { inputForm += '<option value="'+val.id+'" data-client="'+val.link_to+'">'+val.first_name+' '+val.last_name+'</option>'; }
										};
										inputForm += '</select>';
										inputForm += '</div>';
										inputReady = true;
									});
								}
							}
						break;
					case "port":
						inputForm += '<div class="input-group" data-key="'+index+'">';
						inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
						Engine.request('ports','read',function(result){
							var dataset = JSON.parse(result);
							inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
							for(var [key, val] of Object.entries(dataset.output.raw)){
								if(key == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.code+' - '+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.code+' - '+val.name+'</option>'; }
							}
							inputForm += '</select>';
							inputForm += '</div>';
							inputReady = true;
						});
						break;
					case "container_size":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
							for(var [key, val] of Object.entries(['20','20-OT','40','40-HQ','45','50'])){
								if(val == value){ inputForm += '<option value="'+val+'" selected="selected">'+val+'</option>'; } else { inputForm += '<option value="'+val+'">'+val+'</option>'; }
							}
							inputForm += '</select>';
						inputForm += '</div>';
						inputReady = true;
						break;
					case "carrier":
						inputForm += '<div class="input-group" data-key="'+index+'">';
						inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
						Engine.request('carriers','read',function(result){
							var dataset = JSON.parse(result);
							inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
							for(var [key, val] of Object.entries(dataset.output.raw)){
								if(key == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.code+' - '+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.code+' - '+val.name+'</option>'; }
							}
							inputForm += '</select>';
							inputForm += '</div>';
							inputReady = true;
						});
						break;
					case "customs_office":
						inputForm += '<div class="input-group" data-key="'+index+'">';
						inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
						Engine.request('customs_offices','read',function(result){
							var dataset = JSON.parse(result);
							inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
							for(var [key, val] of Object.entries(dataset.output.raw)){
								if(key == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.code+' - '+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.code+' - '+val.name+'</option>'; }
							}
							inputForm += '</select>';
							inputForm += '</div>';
							inputReady = true;
						});
						break;
					case "sub_location":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
						Engine.request('sub_locations','read',function(result){
							var dataset = JSON.parse(result);
							inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
							for(var [key, val] of Object.entries(dataset.output.raw)){
								if(key == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.code+' - '+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.code+' - '+val.name+'</option>'; }
							}
							inputForm += '</select>';
							inputForm += '</div>';
							inputReady = true;
						});
						break;
					case "category":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							if(typeof Engine.Contents.data.dom.categories !== 'undefined'){
								inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(Engine.Contents.data.dom.categories)){
									if(plugin == val.relationship){
										if(key == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.name+'</option>'; }
									}
								};
								inputForm += '</select>';
								inputForm += '</div>';
								inputReady = true;
							} else {
								Engine.request('categories','read',function(result){
									var dataset = JSON.parse(result);
									inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
									for(var [key, val] of Object.entries(dataset.output.dom)){
										Engine.Helper.set(Engine.Contents,['data','dom','clients',val.id],val);
										if(plugin == val.relationship){
											if(key == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.name+'</option>'; }
										}
									}
									for(var [key, val] of Object.entries(dataset.output.raw)){ Engine.Helper.set(Engine.Contents,['data','raw','clients',val.id],val); }
									inputForm += '</select>';
									inputForm += '</div>';
									inputReady = true;
								});
							}
						break;
					case "sub_category":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							if(typeof Engine.Contents.data.dom.sub_categories !== 'undefined'){
								inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(Engine.Contents.data.dom.sub_categories)){
									if(plugin == val.relationship){
										if(key == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.name+'</option>'; }
									}
								};
								inputForm += '</select>';
								inputForm += '</div>';
								inputReady = true;
							} else {
								Engine.request('sub_categories','read',function(result){
									var dataset = JSON.parse(result);
									inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
									for(var [key, val] of Object.entries(dataset.output.dom)){
										Engine.Helper.set(Engine.Contents,['data','dom','clients',val.id],val);
										if(plugin == val.relationship){
											if(key == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.name+'</option>'; }
										}
									}
									for(var [key, val] of Object.entries(dataset.output.raw)){ Engine.Helper.set(Engine.Contents,['data','raw','clients',val.id],val); }
									inputForm += '</select>';
									inputForm += '</div>';
									inputReady = true;
								});
							}
						break;
					case "relationship":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
							$.each(Engine.Contents.Plugins, function(key, val){
								if(val == value){ inputForm += '<option value="'+key+'" selected="selected">'+key+'</option>'; } else { inputForm += '<option value="'+key+'">'+key+'</option>'; }
							});
							inputForm += '</select>';
						inputForm += '</div>';
						inputReady = true;
						break;
					case "job_title":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
							$.each(Engine.Contents.Jobs, function(key, val){
								if(val == value){ inputForm += '<option value="'+val+'" selected="selected">'+val+'</option>'; } else { inputForm += '<option value="'+val+'">'+val+'</option>'; }
							});
							inputForm += '</select>';
						inputForm += '</div>';
						inputReady = true;
						break;
					case "issues":
					case "issue":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							if(typeof Engine.Contents.data.dom.issues !== 'undefined'){
								inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(Engine.Contents.data.dom.issues)){
									if(typeof val.name === 'undefined'){ val.name = ''; }
									if((value.split(';').includes(val.id.toString()))||(val.default == 'on')){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.id+' - '+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.id+' - '+val.name+'</option>'; }
								};
								inputForm += '</select>';
								inputForm += '</div>';
								inputReady = true;
							} else {
								Engine.request('issues','read',function(result){
									var dataset = JSON.parse(result);
									for(var [key, val] of Object.entries(dataset.output.dom)){ Engine.Helper.set(Engine.Contents,['data','dom','issues',val.id],val); }
									for(var [key, val] of Object.entries(dataset.output.raw)){ Engine.Helper.set(Engine.Contents,['data','raw','issues',val.id],val); }
									if(!Engine.Helper.isSet(Engine.Contents,['data','dom','issues'])){ Engine.Helper.set(Engine.Contents,['data','dom','issues'],{}); }
									if(!Engine.Helper.isSet(Engine.Contents,['data','raw','issues'])){ Engine.Helper.set(Engine.Contents,['data','raw','issues'],{}); }
									inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
									for(var [key, val] of Object.entries(Engine.Contents.data.dom.issues)){
										if(typeof val.name === 'undefined'){ val.name = ''; }
										if((value.split(';').includes(val.id.toString()))||(val.default == 'on')){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.id+' - '+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.id+' - '+val.name+'</option>'; }
									};
									inputForm += '</select>';
									inputForm += '</div>';
									inputReady = true;
								});
							}
						break;
					case "services":
					case "service":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							if(typeof Engine.Contents.data.dom.services !== 'undefined'){
								inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(Engine.Contents.data.dom.services)){
									if(typeof val.name === 'undefined'){ val.name = ''; }
									if((value.split(';').includes(val.id.toString()))||(val.default == 'on')){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.name+'</option>'; }
								};
								inputForm += '</select>';
								inputForm += '</div>';
								inputReady = true;
							} else {
								Engine.request('services','read',function(result){
									var dataset = JSON.parse(result);
									for(var [key, val] of Object.entries(dataset.output.dom)){ Engine.Helper.set(Engine.Contents,['data','dom','services',val.id],val); }
									for(var [key, val] of Object.entries(dataset.output.raw)){ Engine.Helper.set(Engine.Contents,['data','raw','services',val.id],val); }
									if(!Engine.Helper.isSet(Engine.Contents,['data','dom','services'])){ Engine.Helper.set(Engine.Contents,['data','dom','services'],{}); }
									if(!Engine.Helper.isSet(Engine.Contents,['data','raw','services'])){ Engine.Helper.set(Engine.Contents,['data','raw','services'],{}); }
									inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
									for(var [key, val] of Object.entries(Engine.Contents.data.dom.services)){
										if(typeof val.name === 'undefined'){ val.name = ''; }
										if((value.split(';').includes(val.id.toString()))||(val.default == 'on')){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.name+'</option>'; }
									};
									inputForm += '</select>';
									inputForm += '</div>';
									inputReady = true;
								});
							}
						break;
					case "tags":
					case "tag":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							if(typeof Engine.Contents.data.dom.tags !== 'undefined'){
								inputForm += '<select data-key="'+index+'" multiple="" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(Engine.Contents.data.dom.tags)){
									if(val.name != ''){
										if(value.split(';').includes(val.name)){ inputForm += '<option value="'+val.name+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.name+'">'+val.name+'</option>'; }
									}
								};
								inputForm += '</select>';
								inputForm += '</div>';
								inputReady = true;
							} else {
								Engine.request('tags','read',function(result){
									var dataset = JSON.parse(result);
									for(var [key, val] of Object.entries(dataset.output.dom)){ Engine.Helper.set(Engine.Contents,['data','dom','tags',val.name],val); }
									for(var [key, val] of Object.entries(dataset.output.raw)){ Engine.Helper.set(Engine.Contents,['data','raw','tags',val.name],val); }
									inputForm += '<select data-key="'+index+'" multiple="" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
									if(typeof Engine.Contents.data.dom.tags !== 'undefined'){
										for(var [key, val] of Object.entries(Engine.Contents.data.dom.tags)){
											if(val.name != ''){
												if(value.split(';').includes(val.name)){ inputForm += '<option value="'+val.name+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.name+'">'+val.name+'</option>'; }
											}
										};
									}
									inputForm += '</select>';
									inputForm += '</div>';
									inputReady = true;
								});
							}
						break;
					case "toll_free":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
			      	inputForm += '<input type="text" class="form-control" data-key="'+index+'" name="'+index+'" value="'+value+'" placeholder="'+title+'" title="'+title+'" data-inputmask="\'mask\': \'+9 (999) 999-9999 [x999999999]\'" data-mask="">';
						inputForm += '</div>';
						inputReady = true;
						break;
					case "phone":
					case"office_num":
					case"other_num":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
			      	inputForm += '<input type="text" class="form-control" data-key="'+index+'" name="'+index+'" value="'+value+'" placeholder="'+title+'" title="'+title+'" data-inputmask="\'mask\': \'(999) 999-9999 [x999999999]\'" data-mask="">';
						inputForm += '</div>';
						inputReady = true;
						break;
					case "mobile":
					case "fax":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
			      	inputForm += '<input type="text" class="form-control" data-key="'+index+'" name="'+index+'" value="'+value+'" placeholder="'+title+'" title="'+title+'" data-inputmask="\'mask\': \'(999) 999-9999\'" data-mask="">';
						inputForm += '</div>';
						inputReady = true;
						break;
					case "password":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
				      inputForm += '<input type="password" class="form-control" data-key="'+index+'" name="'+index+'" placeholder="'+title+'" title="'+title+'">';
							inputForm += '<input type="password" class="form-control" data-key="'+index+'2" name="'+index+'2" placeholder="'+Engine.Contents.Language['Confirm password']+'" title="'+Engine.Contents.Language['Confirm password']+'">';
							if(typeof Engine.Contents.Language['Confirm password'] === 'undefined'){ console.log('Confirm password'); }
						inputForm += '</div>';
						inputReady = true;
						break;
					case "time":
						inputForm += '<div class="timepicker" style="width:100%" id="'+Engine.Builder.counts.input+index+'" data-target-input="nearest" data-target="#'+Engine.Builder.counts.input+index+'" data-toggle="datetimepicker">';
							inputForm += '<div class="input-group date">';
								inputForm += '<div class="input-group-prepend">';
									inputForm += '<span class="input-group-text">';
										inputForm += '<i class="icon icon-time mr-2"></i>'+Engine.Helper.ucfirst(Engine.Contents.Language[index]);
									inputForm += '</span>';
								inputForm += '</div>';
								inputForm += '<input type="text" class="form-control datetimepicker-input" data-key="'+index+'" data-target="#'+Engine.Builder.counts.input+index+'" name="'+index+'" value="'+value+'" placeholder="'+Engine.Helper.ucfirst(Engine.Contents.Language[index])+'">';
							inputForm += '</div>';
						inputForm += '</div>';
						inputReady = true;
						break;
					case"isLocked":
						if(value){ var checked = 'checked' } else { var checked = '' }
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="icon icon-lock mr-1"></i>Lock</span></div>';
							inputForm += '<input type="text" class="form-control switch-spacer" disabled>';
							inputForm += '<div class="input-group-append">';
								inputForm += '<div class="input-group-text p-1">';
									inputForm += '<input type="checkbox" class="form-control" data-key="'+index+'" name="'+index+'" title="'+title+'" '+checked+'>';
								inputForm += '</div>';
							inputForm += '</div>';
						inputForm += '</div>';
						inputReady = true;
						break;
					default:
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
			      	inputForm += '<input type="text" class="form-control" data-key="'+index+'" name="'+index+'" value="'+value+'" placeholder="'+title+'" title="'+title+'">';
						inputForm += '</div>';
						inputReady = true;
						break;
				}
			}
			var checkLoaded = setInterval(function() {
				if(inputReady){
					clearInterval(checkLoaded);
					if(cancelReady){
						element.append(inputForm);
						var input = element.find('.input-group').last();
						if(typeof options.type !== 'undefined'){
							switch(options.type){
								case "textarea":
									input.find('.form-control').summernote({
				            toolbar: [
			                ['font', ['fontname', 'fontsize']],
			                ['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
			                ['color', ['color']],
			                ['paragraph', ['style', 'ul', 'ol', 'paragraph', 'height']],
				            ],
				            height: 250,
					        });
									break;
								case "select":
									input.find('select').select2({ theme: 'bootstrap4' });
									break;
								case "switch":
									input.find('input').last().bootstrapSwitch();
									break;
							}
						} else {
							switch(index){
								case"isLocked":
									input.find('input[data-key="'+index+'"]').bootstrapSwitch('state', $(this).prop('checked'));
									break;
								case "about":
								case "content":
									input.find('.form-control').summernote({
				            toolbar: [
			                ['font', ['fontname', 'fontsize']],
			                ['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
			                ['color', ['color']],
			                ['paragraph', ['style', 'ul', 'ol', 'paragraph', 'height']],
				            ],
				            height: 250,
					        });
									break;
								case "delivery_appointment":
								case "datetime":
									input.find('input').daterangepicker({
										autoApply: true,
										singleDatePicker: true,
										showDropdowns: true,
										minYear: 1950,
										timePicker: true,
										timePickerIncrement: 5,
										locale: {
												"format": "YYYY-MM-DD HH:mm",
										},
									});
									break;
								case "time":
									input = input.parent();
									input.datetimepicker({
										stepping: 15,
										format: 'HH:mm',
									});
									break;
								case "date":
								case "ETD":
								case "ETA_port":
								case "returned":
								case "detention_date":
								case "storage_date":
								case "last_free_day":
								case "custom_clearance":
								case "started_working_on":
								case "birthday":
									input.find('input').daterangepicker({
										singleDatePicker: true,
										showDropdowns: true,
										minYear: 1980,
										locale: {
												"format": "YYYY-MM-DD",
										},
									});
									break;
								case "country":
								case "state":
								case "relationship":
								case "port":
								case "priority":
								case "carrier":
								case "customs_office":
								case "sub_category":
								case "category":
								case "sub_location":
								case "container_size":
								case "group":
								case "user":
								case "supervisor":
								case "assigned_to":
								case "contact":
								case "contacts":
								case "status":
								case "organizations":
								case "divisions":
								case "division":
								case "issues":
								case "issue":
								case "services":
								case "service":
									input.find('select').select2({ theme: 'bootstrap4' });
									break;
								case "assigned_to":
									input.find('select').select2({ theme: 'bootstrap4' });
									input.find('select').select2('val', '');
									break;
								case "job_title":
								case "lead":
								case "client":
								case "organization":
								case "tag":
								case "tags":
									input.find('select').select2({
									  theme: 'bootstrap4',
									  tags: true,
									  createTag: function (params) {
									    return {
									      id: params.term,
									      text: params.term,
									      newOption: true
									    }
									  },
									  templateResult: function (data) {
									    var $result = $("<span></span>");
									    $result.text(data.text);
									    if (data.newOption) {
									      $result.append(" <em>(new)</em>");
									    }
									    return $result;
									  }
									});
									input.find('select').on("select2:select", function (evt) {
										var element = evt.params.data.element;
										var $element = $(element);

										$element.detach();
										$(this).append($element);
										$(this).trigger("change");
									});
									break;
								case "mobile":
								case "toll_free":
								case "phone":
								case"office_num":
								case"other_num":
								case "fax":
						      input.find('input').inputmask();
									break;
							}
						}
						if(callback != null){ callback(input); }
					}
				}
			}, 100);
		},
	},
	CRUD:{
		hide:{
			element:{
				modal:{},
				form:{},
				table:{},
			},
			show:function(element, options = null, callback = null){
				var url = new URL(window.location.href);
				if(typeof options.id !== 'undefined'){ var id = options.id; } else { var id = element.attr('id'); }
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = Engine.Contents.SettingsLandingPage; }
				if(url.searchParams.get("v") != undefined){ var view = url.searchParams.get("v"); } else { var view = 'index'; }
				switch($(element).prop("tagName")){
					case"TABLE":
						var type = 'table';
						break;
					case"FORM":
						var type = 'form';
						break;
				}
				if(Engine.Helper.isSet(Engine,['Contents','Auth','Options','hide',plugin,view,'any',type,id])){
					hide = Engine.Contents.Auth.Options.hide[plugin][view].any[type][id];
				} else { hide = {}; }
				if((options != null)&&(options instanceof Function)){ callback = options; options = {}; }
				if(typeof options.hide === 'undefined'){ options.hide = hide; }
				if(typeof options.keys === 'undefined'){ options.keys = {}; }
				if(typeof options.plugin === 'undefined'){ options.plugin = plugin; }
				if(typeof options.view === 'undefined'){ options.view = view; }
				if(typeof options.css === 'undefined'){ options.css = {}; }
				if(typeof options.css.table === 'undefined'){ options.css.table = 'table-hover table-bordered'; }
				if(typeof options.css.thead === 'undefined'){ options.css.thead = 'thead-dark'; }
				Engine.Builder.modal($('body'), {
					title:'Hide',
					icon:'hide',
					zindex:'top',
					css:{ header: "bg-info"},
				}, function(modal){
					var dialog = modal.find('.modal-dialog');
					var header = modal.find('.modal-header');
					var body = modal.find('.modal-body');
					var footer = modal.find('.modal-footer');
					header.find('button[data-control="hide"]').remove();
					header.find('button[data-control="update"]').remove();
					footer.append('<button type="submit" class="btn btn-info"><i class="icon icon-hide mr-1"></i>'+Engine.Contents.Language['Hide']+'</button>');
					Engine.Builder.form(modal,{},function(form){
						modal.on('hide.bs.modal',function(){ form.remove(); });
						var html = '<div class="table-responsive"><table class="table dt-responsive '+options.css.table+'" style="width:100%"><thead class="'+options.css.thead+'"></thead></table></div>';
						var cols = [], hide = [];
						body.html(html);
						var table = body.find('table');
						for(var [key, value] of Object.entries(options.hide)){ hide.push(key); }
						cols.push({ name: "select", title: "", data: "select", width: "25px", defaultContent: '', targets: 0, orderable: false, className: 'select-checkbox'});
						cols.push({ name: "Column", title: "Column", data: "column", defaultContent: '', targets: 1 });
						cols.push({ name: "Key", title: "Key", data: "key", defaultContent: '', targets: 2, visible: false });
						table.DataTable({
							searching: true,
							paging: true,
							pageLength: 10,
							lengthChange: true,
							lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
							ordering: true,
							info: true,
							autoWidth: true,
							processing: true,
							scrolling: false,
							buttons: [
								{ extend: 'selectAll' },
								{ extend: 'selectNone' },
							],
							language: {
								buttons: {
									selectAll: Engine.Contents.Language["All"],
									selectNone: Engine.Contents.Language["None"],
								},
								info: ", Total _TOTAL_ entries",
							},
							dom: '<"dtbl-toolbar"Bf>rt<"dtbl-btoolbar"lip>',
							columnDefs: cols,
							select: {
								style: 'multi',
								selector: 'td:first-child'
							},
							order: [[ 1, "asc" ]]
						});
						for(var [key, value] of Object.entries(options.keys)){
							if(key !== "undefined"){
								if(!Engine.Helper.isSet(Engine.Contents.Language,[Engine.Helper.ucfirst(Engine.Helper.clean(key))])){ console.log(Engine.Helper.ucfirst(Engine.Helper.clean(key))); }
								if(hide.includes(key)){
									var row = table.DataTable().row.add({ key:key, column:Engine.Contents.Language[Engine.Helper.ucfirst(Engine.Helper.clean(key))] }).select().draw(false);
								} else {
									var row = table.DataTable().row.add({ key:key, column:Engine.Contents.Language[Engine.Helper.ucfirst(Engine.Helper.clean(key))] }).draw(false);
								}
							}
						}
						form.off();
						form.submit(function(action){
							var records = [], tr = '';
							action.preventDefault();
							switch($(element).prop("tagName")){
								case"TABLE":
									element.DataTable().columns().visible(true);
									tr = 'table';
									break;
								case"FORM":
									element.find('.col-md-6').show();
									tr = 'form';
									break;
							}
							if(Engine.Helper.isSet(Engine,['Contents','Auth','Options','hide',plugin,view,'any',tr,id])){
								Engine.Helper.set(Engine.Contents,['Auth','Options','hide',plugin,view,'any',tr,id],{});
							}
							table.DataTable().rows( { selected: true } ).every(function(){
								var key = this.data().key;
								records.push({
									name:key,
									type:'hide',
									relationship:tr,
									link_to:id,
									user:Engine.Contents.Auth.User.id,
									plugin:plugin,
									view:view,
									record:'any',
								});
								switch($(element).prop("tagName")){
									case"TABLE":
										element.DataTable().column(key+':name').visible(false);
										break;
									case"FORM":
										element.find('[data-key="'+key+'"]').parent().parent().hide();
										break;
								}
							});
							Engine.request('options','update',{
								data:{records:records,type:'hide',plugin:plugin,view:view,link_to:id,record:'any'},
							},function(result){
								var dataset = JSON.parse(result);
								if(typeof dataset.success !== 'undefined'){
									for(var [key, value] of Object.entries(dataset.output.dom)){
										Engine.Helper.set(Engine.Contents,['Auth','Options','hide',value.plugin,value.view,value.record,value.relationship,value.link_to,value.name],null);
									}
									if(callback != undefined){ callback(element); }
								}
							});
							modal.modal('hide');
						});
						modal.modal('show');
					});
				});
			},
		},
		filter:{
			element:{
				modal:{},
				form:{},
			},
			show:function(element, options = null, callback = null){
				var url = new URL(window.location.href);
				if(typeof options.id !== 'undefined'){ var id = options.id; } else { var id = element.attr('id'); }
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = Engine.Contents.SettingsLandingPage; }
				if(url.searchParams.get("v") != undefined){ var view = url.searchParams.get("v"); } else { var view = 'index'; }
				if(options != null){
					if(options instanceof Function){
						callback = options;
						options = {
							keys:{}, plugin:plugin, view:view,
						};
					} else {
						if(typeof options.keys === 'undefined'){ options.keys = {}; }
						if(typeof options.plugin === 'undefined'){ options.plugin = plugin; }
						if(typeof options.view === 'undefined'){ options.view = view; }
					}
				} else {
					options = {
						keys:{}, plugin:plugin, view:view,
					};
				}
				Engine.Builder.modal($('body'), {
					title:'Filter',
					icon:'filter',
					zindex:'top',
					css:{ dialog: "modal-lg",
					header: "bg-warning"},
				}, function(modal){
					var dialog = modal.find('.modal-dialog');
					var header = modal.find('.modal-header');
					var body = modal.find('.modal-body');
					var footer = modal.find('.modal-footer');
					header.find('button[data-control="hide"]').remove();
					header.find('button[data-control="update"]').remove();
					footer.append('<button type="submit" class="btn btn-warning"><i class="icon icon-filter mr-1"></i>'+Engine.Contents.Language['Filter']+'</button>');
					Engine.Builder.form(modal,{},function(form){
						modal.on('hide.bs.modal',function(){ form.remove(); });
						var cols = [], input = '', title = '';
						cols.push({ name: "select", title: "", data: "select", width: "25px", defaultContent: '', targets: 0, orderable: false, className: 'select-checkbox'});
						cols.push({ name: "Key", title: "Key", data: "key", defaultContent: '', targets: 1 });
						body.addClass('pb-2');
						body.html('');
						for(var [key, value] of Object.entries(options.keys)){
							title = Engine.Contents.Language[Engine.Helper.ucfirst(Engine.Helper.clean(key))];
							if(Engine.Helper.isSet(Engine,['Contents','Auth','Options','filter',plugin,view,'any',id,key])){
								input = '<div class="input-group row pl-2 pt-2">';
								input += '<div class="input-group-prepend col-4 pr-0"><span class="input-group-text" style="width:100%;"><i class="icon icon-'+key+' mr-1"></i>'+title+'</span></div>';
								input += '<select data-key="'+key+'" class="form-control select2bs4 select2-hidden-accessible col-4" name="relationship">';
								input += '<option value="none">'+Engine.Contents.Language['None']+'</option>';
								if(Engine.Contents.Auth.Options.filter[plugin][view].any[id][key].relationship == 'like'){
									input += '<option value="like" selected="selected">'+Engine.Contents.Language['Like']+'</option>';
								} else {
									input += '<option value="like">'+Engine.Contents.Language['Like']+'</option>';
								}
								if(Engine.Contents.Auth.Options.filter[plugin][view].any[id][key].relationship == 'unlike'){
									input += '<option value="unlike" selected="selected">'+Engine.Contents.Language['Unlike']+'</option>';
								} else {
									input += '<option value="unlike">'+Engine.Contents.Language['Unlike']+'</option>';
								}
								if(Engine.Contents.Auth.Options.filter[plugin][view].any[id][key].relationship == 'equal'){
									input += '<option value="equal" selected="selected">'+Engine.Contents.Language['Equal']+'</option>';
								} else {
									input += '<option value="equal">'+Engine.Contents.Language['Equal']+'</option>';
								}
								if(Engine.Contents.Auth.Options.filter[plugin][view].any[id][key].relationship == 'greater'){
									input += '<option value="greater" selected="selected">'+Engine.Contents.Language['Greater']+'</option>';
								} else {
									input += '<option value="greater">'+Engine.Contents.Language['Greater']+'</option>';
								}
								if(Engine.Contents.Auth.Options.filter[plugin][view].any[id][key].relationship == 'smaller'){
									input += '<option value="smaller" selected="selected">'+Engine.Contents.Language['Smaller']+'</option>';
								} else {
									input += '<option value="smaller">'+Engine.Contents.Language['Smaller']+'</option>';
								}
								input += '</select>';
								input += '<input type="text" class="form-control col-4" data-key="'+key+'" name="value" value="'+Engine.Contents.Auth.Options.filter[plugin][view].any[id][key].value+'" placeholder="'+title+'">';
								input += '</div>';
							} else {
								input = '<div class="input-group row pl-2 pt-2">';
								input += '<div class="input-group-prepend col-4 pr-0"><span class="input-group-text" style="width:100%;"><i class="icon icon-'+key+' mr-1"></i>'+title+'</span></div>';
								input += '<select data-key="'+key+'" class="form-control select2bs4 select2-hidden-accessible col-4" name="relationship">';
								input += '<option value="none">'+Engine.Contents.Language['None']+'</option>';
								input += '<option value="like">'+Engine.Contents.Language['Like']+'</option>';
								input += '<option value="unlike">'+Engine.Contents.Language['Unlike']+'</option>';
								input += '<option value="equal">'+Engine.Contents.Language['Equal']+'</option>';
								input += '<option value="greater">'+Engine.Contents.Language['Greater']+'</option>';
								input += '<option value="smaller">'+Engine.Contents.Language['Smaller']+'</option>';
								input += '</select>';
								input += '<input type="text" class="form-control col-4" data-key="'+key+'" name="value" value="'+value+'" placeholder="'+title+'">';
								input += '</div>';
							}
							body.append(input);
							body.find('select').last().select2({ theme: 'bootstrap4' });
						}
						form.off();
						form.submit(function(action){
							var records = [];
							action.preventDefault();
							body.find('input[data-key]').each(function(){
								var relationship = $(this).prev().prev().select2('data')[0].element.value;
								var value = $(this).val();
								if((relationship != 'none')&&(value != '')){
									records.push({
										name:$(this).attr('data-key'),
										type:'filter',
										value:value,
										relationship:relationship,
										link_to:id,
										user:Engine.Contents.Auth.User.id,
										plugin:plugin,
										view:view,
										record:'any',
									});
								}
							});
							Engine.request('options','update',{
								data:{records:records,type:'filter',plugin:plugin,view:view,link_to:id,record:'any'},
							},function(result){
								var dataset = JSON.parse(result);
								if(typeof dataset.success !== 'undefined'){
									if(Engine.Helper.isSet(Engine,['Contents','Auth','Options','filter',plugin,view,'any',id])){
										Engine.Helper.set(Engine.Contents,['Auth','Options','filter',plugin,view,'any',id],{});
									}
									if(dataset.output.dom.length > 0){
										var results = dataset.output.dom;
										for(var [key, value] of Object.entries(results)){
											Engine.Helper.set(Engine.Contents,['Auth','Options','filter',value.plugin,value.view,value.record,value.link_to,value.name],{ value:value.value, relationship:value.relationship });
										}
									}
									Engine.CRUD.filter.element.modal.modal('hide');
									if(callback != undefined){ callback(element); }
								}
							});
						});
						modal.modal('show');
					});
				});
			},
		},
		create:{
			element:{
				modal:{},
				form:{},
			},
			show:function(options = null, callback = null){
				var url = new URL(window.location.href);
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = Engine.Contents.SettingsLandingPage; }
				if(url.searchParams.get("v") != undefined){ var view = url.searchParams.get("v"); } else { var view = 'index'; }
				if((options != null)&&(options instanceof Function)){ callback = options; options = {}; }
				if(typeof options.hide === 'undefined'){ options.hide = {} }
				if(typeof options.keys === 'undefined'){ options.keys = {} }
				if(typeof options.set === 'undefined'){ options.set = {} }
				if(typeof options.data === 'undefined'){ options.data = {} }
				if(typeof options.plugin === 'undefined'){ options.plugin = plugin }
				Engine.Builder.modal($('body'), {
					title:'Create',
					icon:'create',
					zindex:'top',
					css:{ dialog: "modal-lg", header: "bg-success"},
				}, function(modal){
					var header = modal.find('.modal-header');
					var body = modal.find('.modal-body');
					var footer = modal.find('.modal-footer');
					header.find('[data-control="update"]').remove();
					footer.append('<button type="submit" class="btn btn-success"><i class="icon icon-create mr-1"></i>'+Engine.Contents.Language['Create']+'</button>');
					Engine.Builder.form(modal,{},function(form){
						modal.on('hide.bs.modal',function(){ form.remove(); });
						if((jQuery.isEmptyObject(options.hide))
							&&(Engine.Helper.isSet(Engine,['Contents','Auth','Options','hide',options.plugin,view,'any','form',form.attr('id')]))){
								options.hide = Engine.Contents.Auth.Options.hide[options.plugin][view].any.form[form.attr('id')];
						}
						var skip = ['id','created','modified','owner','updated_by'];
						if(Engine.Helper.isSet(Engine.Plugins,[options.plugin,'options','create','skip'])){
							for (var [key, value] of Object.entries(Engine.Plugins[options.plugin].options.create.skip)) {
								if(!skip.includes(value)){ skip.push(value); }
							}
						}
						body.html('');
						if(Engine.Helper.isSet(Engine.Plugins,[options.plugin,'forms','create'])){
							var fieldCount = 0, count = 0;
							for (var [key, value] of Object.entries(Engine.Plugins[options.plugin].forms.create)) {
								if(jQuery.type(value) === "string"){ ++fieldCount; }
							}
							body.append('<div class="col-md-12 p-2"><div class="row"></div></div>');
							for(var [key, value] of Object.entries(Engine.Plugins[options.plugin].forms.create)){
								var val = '';
								if(typeof options.set[value] !== 'undefined'){ val = options.set[value]; }
								if(!jQuery.isPlainObject(value)){
									Engine.Builder.input(body.find('.col-md-12').first().find('.row'), value, val,{plugin:options.plugin}, function(input){
										input.find('input').attr('data-form',form.attr('id'));
										input.find('select').attr('data-form',form.attr('id'));
										input.find('textarea').attr('data-form',form.attr('id'));
										if(input.find('select').length > 0){
											if(typeof options.data[value] !== 'undefined'){
												input.find('select').find('option').remove();
												for(var [skey, sval] of Object.entries(options.data[value])){
													// Create a DOM Option and pre-select by default
													var newOption = new Option(sval, skey);
													// Append it to the select
													input.find('select').append(newOption).trigger('change');
												}
												input.find('select').val(val).trigger('change');
											}
										}
										++count;
										if((fieldCount <= 2)||((fieldCount == count)&&(Engine.Helper.isOdd(count)))){
											input.wrap('<div class="col-md-12 p-2"></div>');
										} else { input.wrap('<div class="col-md-6 p-2"></div>'); }
										for(var [key, value] of Object.entries(options.hide)){
											form.find('[data-key="'+key+'"]').parent().parent().hide();
										}
									});
								} else {
									Engine.Builder.card(body,{
										title: Engine.Helper.ucfirst(Engine.Helper.clean(key)),
										icon: key,
										css:"card-secondary",
										extra: key,
									},function(card){
										var key = card.attr('data-extra');
										var value = Engine.Plugins[options.plugin].forms.create[key];
										var subfieldCount = 0, subcount = 0;
										for (var [subkey, subvalue] of Object.entries(value)) {
											if(jQuery.type(subvalue) === "string"){ ++subfieldCount; }
										}
										card.wrap('<div class="col-md-12 p-2"></div>');
										card.find('.card-body').addClass('p-2');
										card.find('.card-body').append('<div class="row"></div>');
										for(var [subkey, subvalue] of Object.entries(value)){
											var val = '';
											if(typeof options.set[subvalue] !== 'undefined'){ val = options.set[subvalue]; }
											if(!jQuery.isPlainObject(subvalue)){
												Engine.Builder.input(card.find('.card-body').find('.row'), subvalue, val,{plugin:options.plugin}, function(input){
													input.find('input').attr('data-form',form.attr('id'));
													input.find('select').attr('data-form',form.attr('id'));
													input.find('textarea').attr('data-form',form.attr('id'));
													if(input.find('select').length > 0){
														if(typeof options.data[subvalue] !== 'undefined'){
															input.find('select').find('option').remove();
															for(var [skey, sval] of Object.entries(options.data[subvalue])){
																// Create a DOM Option and pre-select by default
																var newOption = new Option(sval, skey);
																// Append it to the select
																input.find('select').append(newOption).trigger('change');
															}
															input.find('select').val(val).trigger('change');
														}
													}
													++subcount;
													if((subfieldCount <= 2)||((subfieldCount == subcount)&&(Engine.Helper.isOdd(subcount)))){
														input.wrap('<div class="col-md-12 p-2"></div>');
													} else { input.wrap('<div class="col-md-6 p-2"></div>'); }
													for(var [key, value] of Object.entries(options.hide)){
														form.find('[data-key="'+key+'"]').parent().parent().hide();
													}
												});
											}
										}
									});
								}
							}
						} else {
							var fieldCount = 0, count = 0;
							for (var [key, value] of Object.entries(options.keys)) {
								if(!skip.includes(key)){ ++fieldCount; }
							}
							for (var [key, value] of Object.entries(options.keys)) {
								if(!skip.includes(key)){
									var val = value;
									if(typeof options.set[key] !== 'undefined'){ val = options.set[key]; }
									Engine.Builder.input(body, key, val,{plugin:options.plugin}, function(input){
										input.find('input').attr('data-form',form.attr('id'));
										input.find('select').attr('data-form',form.attr('id'));
										input.find('textarea').attr('data-form',form.attr('id'));
										if(input.find('select').length > 0){
											if(typeof options.data[value] !== 'undefined'){
												input.find('select').find('option').remove();
												for(var [skey, sval] of Object.entries(options.data[value])){
													// Create a DOM Option and pre-select by default
													var newOption = new Option(sval, skey);
													// Append it to the select
													input.find('select').append(newOption).trigger('change');
												}
												input.find('select').val(val).trigger('change');
											}
										}
										++count;
										if((fieldCount <= 2)||((fieldCount == count)&&(Engine.Helper.isOdd(count)))){
											input.wrap('<div class="col-md-12 p-2"></div>');
										} else { input.wrap('<div class="col-md-6 p-2"></div>'); }
										for (var [key, value] of Object.entries(options.hide)) {
											form.find('[data-key="'+key+'"]').parent().parent().hide();
										}
									});
								}
							}
						}
						form.off().submit(function(action){
							action.preventDefault();
							var record = {}, dataKey = '';
							$('[data-form="'+form.attr('id')+'"][data-key]').each(function(){
								dataKey = $(this).attr('data-key');
								switch($(this).prop("tagName")){
									case"TEXTAREA":
										record[dataKey] = $(this).summernote('code');
										break;
									case"SELECT":
										var data = $(this).select2('data');
										if(data.length > 0){
											record[dataKey] = '';
											for (var [key, value] of Object.entries(data)){
												record[dataKey] += value.element.value+';';
											}
											record[dataKey] = record[dataKey].replace(/^;|;$/g,'');
										}
										break;
									default:
										record[dataKey] = $(this).val();
								}
							});
							for(var [key, value] of Object.entries(options.set)){ record[key] = value; }
							var required = true;
							if(typeof options.required !== 'undefined'){
								for(var [key, value] of Object.entries(options.required)){
									if(value in record && record[value] != ''){ required = true; }
									else { $('[data-form="'+form.attr('id')+'"][data-key="'+value+'"]').find('input-group').addClass('is-invalid');required = false; }
								}
							}
							if(required){
								if(Engine.Helper.isSet(Engine.Plugins,['tasks']) && Engine.Auth.validate('plugin', 'tasks', 1)){
									Engine.Plugins.tasks.GUI.add({
										title:Engine.Contents.Language['Creating']+' '+Engine.Helper.ucfirst(options.plugin),
										value:0,
										max:1,
										plugin:options.plugin,
										extra:''
									},function(opt,task,divider){
										modal.modal('hide');
										form.trigger("reset");
										Engine.request(options.plugin,'create',{data:record,report:true},function(result){
											if(result.charAt(0) == '{'){
												var dataset = JSON.parse(result);
												if(typeof dataset.success !== 'undefined'){
													if((Engine.Helper.isSet(record,['job_title']))&&(!Engine.Contents.Jobs.includes(record.job_title))){
														Engine.Contents.Jobs.push(record.job_title);
													}
													if(Engine.Helper.isSet(record,['tags'])){
														var tagID = 0;
														for(var [ztag, zdetails] of Object.entries(Engine.Contents.data.dom.tags)){ tagID = zdetails.id; }
														for(var [tag, details] of Object.entries(record.tags)){
															if(!Engine.Helper.isSet(Engine.Contents.data.dom.tags,[details.name])){
																++tagID;
																Engine.Helper.set(Engine.Contents.data.dom.tags,[details.name],{
																	id:tagID,
																	created:dataset.output.dom.created,
																	modified:dataset.output.dom.modified,
																	owner:dataset.output.dom.owner,
																	updated_by:dataset.output.dom.updated_by,
																	name:details.name
																});
															}
														}
													}
													if(typeof options.table !== 'undefined'){
														var row = options.table.DataTable().row.add(dataset.output.dom).draw(false);
														options.table.find('button').each(function(){
															var control = $(this).attr('data-control');
															var rowdata = options.table.DataTable().row($(this).parents('tr')).data();
															$(this).off().click(function(){
																var lcontrol = control.toLowerCase();
																href = '?p='+options.plugin;
																href += '&v='+lcontrol;
																if(typeof options.key !== 'undefined'){
																	href += '&id='+rowdata[options.key];
																	thref = rowdata[options.key];
																} else {
																	href += '&id='+rowdata.id;
																	thref = rowdata.id;
																}
																switch(control){
																	case"Details":
																		Engine.GUI.Breadcrumbs.add(thref, href, { key:options.key, keys:rowdata });
																		if((typeof options.modal !== 'undefined')&&(options.modal)){
																			Engine.CRUD.read.show({ table:element, keys:rowdata, key:options.key, href:href });
																		} else {
																			Engine.GUI.load($('#ContentFrame'),href, { keys:rowdata });
																		}
																		break;
																	case"Edit":
																		Engine.CRUD.update.show({ table:options.table, row:$(this).parents('tr'), keys:rowdata, key:options.key });
																		break;
																	default:
																		if((typeof Engine.CRUD[lcontrol] !== 'undefined')&&(typeof Engine.CRUD[lcontrol].show !== 'undefined')){
																			Engine.CRUD[lcontrol].show({ table:options.table, row:$(this).parents('tr'), keys:rowdata, key:options.key });
																		} else {
																			Engine.GUI.Breadcrumbs.add(thref, href, { key:options.key, keys:rowdata });
																			Engine.GUI.load($('#ContentFrame'),href, { keys:rowdata });
																		}
																		break;
																}
															});
														});
													}
													Engine.Plugins.tasks.GUI.update(task.attr('data-task'), 1);
													if((callback != undefined)&&(callback != null)){ callback(true, {dom:dataset.output.dom,raw:dataset.output.raw}); }
												} else {
													if((callback != undefined)&&(callback != null)){ callback(false, {}); }
												}
											} else {
												var report = task.find('div.row').last().find('span.float-left');
												task.addClass('bg-light-danger');
												report.html('<a class="badge bg-danger px-2"><i class="icon icon-report mr-1"></i>'+Engine.Contents.Language['Report']+'</a>');
												report.find('a').click(function(){
													var message = '<p style="font-size: 18px; color: #2d2d2d line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;">'+Engine.Contents.Auth.User.username+Engine.Contents.Language[' is reporting']+'</p>';
													message += '<p style="font-size: 12px; color: #6c6c6c line-height: 1.5; word-break: break-word; text-align: justify; mso-line-height-alt: 18px; margin: 0;">'+result.replace(/\n/g, "<br />")+'</p>'
													Engine.request('smtp','send',{
														data:{
															email:Engine.Contents.Settings.Contacts.reporting,
															message:message,
														}
													});
												});
												if((callback != undefined)&&(callback != null)){ callback(false, {}); }
											}
										});
									});
								} else {
									modal.modal('hide');
									form.trigger("reset");
									Engine.request(options.plugin,'create',{data:record,report:true},function(result){
										if(result.charAt(0) == '{'){
											var dataset = JSON.parse(result);
											if(typeof dataset.success !== 'undefined'){
												if((Engine.Helper.isSet(record,['job_title']))&&(!Engine.Contents.Jobs.includes(record.job_title))){
													Engine.Contents.Jobs.push(record.job_title);
												}
												if(Engine.Helper.isSet(record,['tags'])){
													var tagID = 0;
													for(var [ztag, zdetails] of Object.entries(Engine.Contents.data.dom.tags)){ tagID = zdetails.id; }
													for(var [tag, details] of Object.entries(record.tags)){
														if(!Engine.Helper.isSet(Engine.Contents.data.dom.tags,[details.name])){
															++tagID;
															Engine.Helper.set(Engine.Contents.data.dom.tags,[details.name],{
																id:tagID,
																created:dataset.output.dom.created,
																modified:dataset.output.dom.modified,
																owner:dataset.output.dom.owner,
																updated_by:dataset.output.dom.updated_by,
																name:details.name
															});
														}
													}
												}
												if(typeof options.table !== 'undefined'){
													var row = options.table.DataTable().row.add(dataset.output.dom).draw(false);
													options.table.find('button').each(function(){
														var control = $(this).attr('data-control');
														var rowdata = options.table.DataTable().row($(this).parents('tr')).data();
														$(this).off().click(function(){
															var lcontrol = control.toLowerCase();
															href = '?p='+options.plugin;
															href += '&v='+lcontrol;
															if(typeof options.key !== 'undefined'){
																href += '&id='+rowdata[options.key];
																thref = rowdata[options.key];
															} else {
																href += '&id='+rowdata.id;
																thref = rowdata.id;
															}
															switch(control){
																case"Details":
																	Engine.GUI.Breadcrumbs.add(thref, href, { key:options.key, keys:rowdata });
																	if((typeof options.modal !== 'undefined')&&(options.modal)){
																		Engine.CRUD.read.show({ table:element, keys:rowdata, key:options.key, href:href });
																	} else {
																		Engine.GUI.load($('#ContentFrame'),href, { keys:rowdata });
																	}
																	break;
																case"Edit":
																	Engine.CRUD.update.show({ table:options.table, row:$(this).parents('tr'), keys:rowdata, key:options.key });
																	break;
																default:
																	if((typeof Engine.CRUD[lcontrol] !== 'undefined')&&(typeof Engine.CRUD[lcontrol].show !== 'undefined')){
																		Engine.CRUD[lcontrol].show({ table:options.table, row:$(this).parents('tr'), keys:rowdata, key:options.key });
																	} else {
																		Engine.GUI.Breadcrumbs.add(thref, href, { key:options.key, keys:rowdata });
																		Engine.GUI.load($('#ContentFrame'),href, { keys:rowdata });
																	}
																	break;
															}
														});
													});
												}
												if((callback != undefined)&&(callback != null)){ callback(true, {dom:dataset.output.dom,raw:dataset.output.raw}); }
											} else {
												if((callback != undefined)&&(callback != null)){ callback(false, {}); }
											}
										}
									});
								}
							} else {
								alert("You are missing data.")
							}
						});
						modal.modal('show');
					});
				});
			},
		},
		read:{
			element:{
				modal:{},
			},
			show:function(options = null, callback = null){
				var origin = new URL(window.location.href);
				if(typeof options.href !== 'undefined'){
					var url = new URL(origin.origin+options.href);
				} else {
					var url = new URL(window.location.href);
				}
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = Engine.Contents.SettingsLandingPage; }
				if(url.searchParams.get("v") != undefined){ var view = url.searchParams.get("v"); } else { var view = 'details'; }
				if(options != null){
					if(options instanceof Function){
						callback = options;
						options = { keys:{}, key:'id', plugin:plugin, view:view };
					} else {
						if(typeof options.keys === 'undefined'){ options.keys = {} }
						if(typeof options.key === 'undefined'){ options.key = 'id' }
						if(typeof options.plugin === 'undefined'){ options.plugin = plugin }
						if(typeof options.view === 'undefined'){ options.view = view }
					}
				} else {
					options = { keys:{}, key:'id', plugin:plugin, view:view };
				}
				if((typeof options.modal !== 'undefined')&&(options.modal)){
					Engine.Builder.modal($('body'), {
						title:'Read',
						icon:'read',
						zindex:'top',
						css:{ dialog:"modal-full", header: "bg-primary", body: "p-4"},
					}, function(modal){
						modal.find('.modal-header').find('.btn-group').find('[data-control="hide"]').remove();
						var header = modal.find('.modal-header');
						var title = header.find('.modal-title');
						var body = modal.find('.modal-body');
						var dialog = modal.find('.modal-dialog');
						var footer = modal.find('.modal-footer');
						var modalt = options.keys[options.key];
						if(typeof options.title !== 'undefined'){ var modalt = options.title; }
						if(typeof options.modalWidth !== 'undefined'){
							dialog.removeClass('modal-full');
							dialog.addClass(options.modalWidth);
						}
						title.html('<i class="mr-1 icon icon-'+options.plugin+'"></i>'+modalt);
						body.html('');
						if((typeof options.load !== 'undefined' && options.load)||(typeof options.load === 'undefined')){Engine.GUI.load(body,options.href, { keys:options.keys });}
						else {Engine.GUI.load(body,options.href);}
						modal.off('hide').modal('show');
						modal.on('hide.bs.modal',function(e){
							if($(e.target).attr('id') == $(this).attr('id')){
								$(this).find('.modal-body').html('');
								$('a[href^="?p"]').removeClass('active');
								$('a[href^="?p='+origin.searchParams.get("p")+'"]').addClass('active');
								window.history.pushState({page: 1},Engine.Helper.ucfirst(origin.searchParams.get("p")), origin.href);
							}
							modal.remove();
						});
					});
				} else {
					if((typeof options.load !== 'undefined' && options.load)||(typeof options.load === 'undefined')){Engine.GUI.load($('#ContentFrame'),options.href, { keys:options.keys });}
					else {Engine.GUI.load($('#ContentFrame'),options.href);}
				}
			},
		},
		update:{
			element:{
				modal:{},
				form:{},
			},
			show:function(options = null, callback = null){
				var url = new URL(window.location.href);
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = Engine.Contents.SettingsLandingPage; }
				if(url.searchParams.get("v") != undefined){ var view = url.searchParams.get("v"); } else { var view = 'index'; }
				if(options != null){
					if(options instanceof Function){
						callback = options;
						options = { hide:{}, data:{}, keys:{}, plugin:plugin };
					} else {
						if(typeof options.hide === 'undefined'){ options.hide = {} }
						if(typeof options.keys === 'undefined'){ options.keys = {} }
						if(typeof options.data === 'undefined'){ options.data = plugin }
						if(typeof options.plugin === 'undefined'){ options.plugin = plugin }
					}
				} else {
					options = { hide:{}, data:{}, keys:{}, plugin:plugin };
				}
				Engine.Builder.modal($('body'), {
					title:'Update',
					icon:'edit',
					zindex:'top',
					css:{ dialog: "modal-lg", header: "bg-warning"},
				}, function(modal){
					var dialog = modal.find('.modal-dialog');
					var header = modal.find('.modal-header');
					var body = modal.find('.modal-body');
					var footer = modal.find('.modal-footer');
					header.find('button[data-control="update"]').remove();
					footer.append('<button type="submit" class="btn btn-warning"><i class="icon icon-edit mr-1"></i>'+Engine.Contents.Language['Update']+'</button>');
					Engine.Builder.form(modal,{},function(form){
						modal.on('hide.bs.modal',function(){ form.remove(); });
						var skip = ['id','created','modified','owner','updated_by'];
						if((jQuery.isEmptyObject(options.hide))
							&&(Engine.Helper.isSet(Engine,['Contents','Auth','Options','hide',plugin,view,'any','form',form.attr('id')]))){
								options.hide = Engine.Contents.Auth.Options.hide[plugin][view].any.form[form.attr('id')];
						}
						body.html('');
						if(Engine.Helper.isSet(Engine.Plugins,[options.plugin,'options','update','skip'])){
							for (var [key, value] of Object.entries(Engine.Plugins[options.plugin].options.update.skip)) {
								if(!skip.includes(value)){ skip.push(value); }
							}
						}
						if(Engine.Helper.isSet(Engine.Plugins,[options.plugin,'forms','update'])){
							var fieldCount = 0, count = 0;
							for (var [key, value] of Object.entries(Engine.Plugins[options.plugin].forms.update)) {
								if(jQuery.type(value) === "string"){ ++fieldCount; }
							}
							body.append('<div class="col-md-12 p-2"><div class="row"></div></div>');
							for(var [key, value] of Object.entries(Engine.Plugins[options.plugin].forms.update)){
								var val = options.keys[value];
								if(!jQuery.isPlainObject(value)){
									Engine.Builder.input(body.find('.col-md-12').first().find('.row'), value, val,{plugin:options.plugin}, function(input){
										input.find('input').attr('data-form',form.attr('id'));
										input.find('select').attr('data-form',form.attr('id'));
										input.find('textarea').attr('data-form',form.attr('id'));
										if(input.find('select').length > 0){
											if(typeof options.data[value] !== 'undefined'){
												input.find('select').find('option').remove();
												for(var [skey, sval] of Object.entries(options.data[value])){
													// Create a DOM Option and pre-select by default
													var newOption = new Option(sval, skey);
													// Append it to the select
													input.find('select').append(newOption).trigger('change');
												}
												input.find('select').val(val).trigger('change');
											}
										}
										++count;
										if((fieldCount <= 2)||((fieldCount == count)&&(Engine.Helper.isOdd(count)))){
											input.wrap('<div class="col-md-12 p-2"></div>');
										} else { input.wrap('<div class="col-md-6 p-2"></div>'); }
										for(var [key, value] of Object.entries(options.hide)){
											form.find('[data-key="'+key+'"]').parent().parent().hide();
										}
									});
								} else {
									Engine.Builder.card(body,{
										title: Engine.Helper.ucfirst(Engine.Helper.clean(key)),
										icon: key,
										css:"card-secondary",
									},function(card){
										var subfieldCount = 0, subcount = 0;
										for (var [subkey, subvalue] of Object.entries(value)) {
											if(jQuery.type(subvalue) === "string"){ ++subfieldCount; }
										}
										card.wrap('<div class="col-md-12 p-2"></div>');
										card.find('.card-body').addClass('p-2');
										card.find('.card-body').append('<div class="row"></div>');
										for(var [subkey, subvalue] of Object.entries(value)){
											var val = options.keys[subvalue];
											if(!jQuery.isPlainObject(subvalue)){
												Engine.Builder.input(card.find('.card-body').find('.row'), subvalue, val,{plugin:options.plugin}, function(input){
													input.find('input').attr('data-form',form.attr('id'));
													input.find('select').attr('data-form',form.attr('id'));
													input.find('textarea').attr('data-form',form.attr('id'));
													if(input.find('select').length > 0){
														if(typeof options.data[subvalue] !== 'undefined'){
															input.find('select').find('option').remove();
															for(var [skey, sval] of Object.entries(options.data[subvalue])){
																// Create a DOM Option and pre-select by default
																var newOption = new Option(sval, skey);
																// Append it to the select
																input.find('select').append(newOption).trigger('change');
															}
															input.find('select').val(val).trigger('change');
														}
													}
													++subcount;
													if((subfieldCount <= 2)||((subfieldCount == subcount)&&(Engine.Helper.isOdd(subcount)))){
														input.wrap('<div class="col-md-12 p-2"></div>');
													} else { input.wrap('<div class="col-md-6 p-2"></div>'); }
													for(var [key, value] of Object.entries(options.hide)){
														form.find('[data-key="'+key+'"]').parent().parent().hide();
													}
												});
											}
										}
									});
								}
							}
						} else {
							var fieldCount = 0, count = 0;
							for (var [key, value] of Object.entries(options.keys)) {
								if(!skip.includes(key)){ ++fieldCount; }
							}
							for (var [key, value] of Object.entries(options.keys)) {
								if(!skip.includes(key)){
									var val = value;
									if((typeof options.set !== 'undefined')&&(typeof options.set[key] !== 'undefined')){ val = options.set[key]; }
									Engine.Builder.input(body, key, val,{plugin:options.plugin}, function(input){
										input.find('input').attr('data-form',form.attr('id'));
										input.find('select').attr('data-form',form.attr('id'));
										input.find('textarea').attr('data-form',form.attr('id'));
										if(input.find('select').length > 0){
											if(typeof options.data[value] !== 'undefined'){
												input.find('select').find('option').remove();
												for(var [skey, sval] of Object.entries(options.data[value])){
													// Create a DOM Option and pre-select by default
													var newOption = new Option(sval, skey);
													// Append it to the select
													input.find('select').append(newOption).trigger('change');
												}
												input.find('select').val(val).trigger('change');
											}
										}
										++count;
										if((fieldCount <= 2)||((fieldCount == count)&&(Engine.Helper.isOdd(count)))){
											input.wrap('<div class="col-md-12 p-2"></div>');
										} else { input.wrap('<div class="col-md-6 p-2"></div>'); }
										for (var [key, value] of Object.entries(options.hide)) {
											form.find('[data-key="'+key+'"]').parent().parent().hide();
										}
									});
								}
							}
						}
						for (var [key, value] of Object.entries(options.hide)) {
							form.children('[data-key="'+key+'"]').hide();
						}
						form.off();
						form.submit(function(action){
							action.preventDefault();
							var record = options.keys, dataKey = '';
							delete record.created;
							delete record.modified;
							delete record.owner;
							delete record.updated_by;
							$('[data-form="'+form.attr('id')+'"][data-key]').each(function(){
								dataKey = $(this).attr('data-key');
								switch($(this).prop("tagName")){
									case"TEXTAREA":
										record[dataKey] = $(this).summernote('code');
										break;
									case"SELECT":
										var data = $(this).select2('data');
										if(data.length > 0){
											record[dataKey] = '';
											for (var [key, value] of Object.entries(data)){
												record[dataKey] += value.element.value+';';
											}
											record[dataKey] = record[dataKey].replace(/^;|;$/g,'');
										}
										break;
									default:
										record[dataKey] = $(this).val();
								}
							});
							if(Engine.Helper.isSet(Engine.Plugins,['tasks']) && Engine.Auth.validate('plugin', 'tasks', 1)){
								Engine.Plugins.tasks.GUI.add({
									title:Engine.Contents.Language['Updating']+' '+Engine.Helper.ucfirst(options.plugin),
									value:0,
									max:1,
									plugin:options.plugin,
									extra:''
								},function(opt,task,divider){
									modal.modal('hide');
									Engine.request(options.plugin,'update',{
										data:record,
										report:true,
									},function(result){
										if(result.charAt(0) == '{'){
											var dataset = JSON.parse(result);
											if(typeof dataset.success !== 'undefined'){
												if((Engine.Helper.isSet(record,['job_title']))&&(!Engine.Contents.Jobs.includes(record.job_title))){
													Engine.Contents.Jobs.push(record.job_title);
												}
												if(Engine.Helper.isSet(record,['tags'])){
													var tagID = 0;
													for(var [tag, details] of Object.entries(record.tags)){
														if(Engine.Helper.isSet(Engine.Contents.data.dom,["tags",tag])){
															for(var [ztag, zdetails] of Object.entries(Engine.Contents.data.dom.tags)){ tagID = zdetails.id; }
														}
														++tagID;
														Engine.Helper.set(Engine.Contents.data.dom,["tags",tag],{
															id:tagID,
															created:dataset.output.dom.modified,
															modified:dataset.output.dom.modified,
															owner:dataset.output.dom.owner,
															updated_by:dataset.output.dom.updated_by,
															name:tag
														});
														Engine.Helper.set(Engine.Contents.data.raw,["tags",tag],{
															id:tagID,
															created:dataset.output.dom.modified,
															modified:dataset.output.dom.modified,
															owner:dataset.output.dom.owner,
															updated_by:dataset.output.dom.updated_by,
															name:tag
														});
													}
												}
												if((typeof options.table !== 'undefined')&&(typeof options.row !== 'undefined')){
													var row = options.table.DataTable().row(options.row).data(dataset.output.dom).draw(false);
													options.table.find('button').each(function(){
														var control = $(this).attr('data-control');
														var rowdata = options.table.DataTable().row($(this).parents('tr')).data();
														$(this).off();
														$(this).click(function(){
															var lcontrol = control.toLowerCase();
															href = '?p='+options.plugin;
															href += '&v='+lcontrol;
															if(typeof options.key !== 'undefined'){
																href += '&id='+rowdata[options.key];
																thref = rowdata[options.key];
															} else {
																href += '&id='+rowdata.id;
																thref = rowdata.id;
															}
															switch(control){
																case"Details":
																	Engine.GUI.Breadcrumbs.add(thref, href, { key:options.key, keys:rowdata });
																	if((typeof options.modal !== 'undefined')&&(options.modal)){
																		Engine.CRUD.read.show({ table:element, keys:rowdata, key:options.key, href:href });
																	} else {
																		Engine.GUI.load($('#ContentFrame'),href, { keys:rowdata });
																	}
																	break;
																case"Edit":
																	Engine.CRUD.update.show({ table:options.table, row:$(this).parents('tr'), keys:rowdata, key:options.key });
																	break;
																default:
																	if((typeof Engine.CRUD[lcontrol] !== 'undefined')&&(typeof Engine.CRUD[lcontrol].show !== 'undefined')){
																		Engine.CRUD[lcontrol].show({ table:options.table, row:$(this).parents('tr'), keys:rowdata, key:options.key });
																	} else {
																		Engine.GUI.Breadcrumbs.add(thref, href, { key:options.key, keys:rowdata });
																		Engine.GUI.load($('#ContentFrame'),href, { keys:rowdata });
																	}
																	break;
															}
														});
													});
												}
												if(typeof options.container !== 'undefined'){ Engine.GUI.insert(dataset.output.dom); }
												Engine.Plugins.tasks.GUI.update(task.attr('data-task'), 1);
												if(callback != undefined){ callback({dom:dataset.output.dom,raw:dataset.output.raw}); }
											}
										} else {
											var report = task.find('div.row').last().find('span.float-left');
											task.addClass('bg-light-danger');
											report.html('<a class="badge bg-danger px-2"><i class="icon icon-report mr-1"></i>'+Engine.Contents.Language['Report']+'</a>');
											report.find('a').click(function(){
												var message = '<p style="font-size: 18px; color: #2d2d2d line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;">'+Engine.Contents.Auth.User.username+Engine.Contents.Language[' is reporting']+'</p>';
												message += '<p style="font-size: 12px; color: #6c6c6c line-height: 1.5; word-break: break-word; text-align: justify; mso-line-height-alt: 18px; margin: 0;">'+result.replace(/\n/g, "<br />")+'</p>'
												Engine.request('smtp','send',{
													data:{
														email:Engine.Contents.Settings.Contacts.reporting,
														message:message,
													}
												});
											});
										}
									});
								});
							} else {
								modal.modal('hide');
								Engine.request(options.plugin,'update',{
									data:record,
									report:true,
								},function(result){
									if(result.charAt(0) == '{'){
										var dataset = JSON.parse(result);
										if(typeof dataset.success !== 'undefined'){
											if((Engine.Helper.isSet(record,['job_title']))&&(!Engine.Contents.Jobs.includes(record.job_title))){
												Engine.Contents.Jobs.push(record.job_title);
											}
											if(Engine.Helper.isSet(record,['tags'])){
												var tagID = 0;
												for(var [tag, details] of Object.entries(record.tags)){
													if(Engine.Helper.isSet(Engine.Contents.data.dom,["tags",tag])){
														for(var [ztag, zdetails] of Object.entries(Engine.Contents.data.dom.tags)){ tagID = zdetails.id; }
													}
													++tagID;
													Engine.Helper.set(Engine.Contents.data.dom,["tags",tag],{
														id:tagID,
														created:dataset.output.dom.modified,
														modified:dataset.output.dom.modified,
														owner:dataset.output.dom.owner,
														updated_by:dataset.output.dom.updated_by,
														name:tag
													});
													Engine.Helper.set(Engine.Contents.data.raw,["tags",tag],{
														id:tagID,
														created:dataset.output.dom.modified,
														modified:dataset.output.dom.modified,
														owner:dataset.output.dom.owner,
														updated_by:dataset.output.dom.updated_by,
														name:tag
													});
												}
											}
											if((typeof options.table !== 'undefined')&&(typeof options.row !== 'undefined')){
												var row = options.table.DataTable().row(options.row).data(dataset.output.dom).draw(false);
												options.table.find('button').each(function(){
													var control = $(this).attr('data-control');
													var rowdata = options.table.DataTable().row($(this).parents('tr')).data();
													$(this).off();
													$(this).click(function(){
														var lcontrol = control.toLowerCase();
														href = '?p='+options.plugin;
														href += '&v='+lcontrol;
														if(typeof options.key !== 'undefined'){
															href += '&id='+rowdata[options.key];
															thref = rowdata[options.key];
														} else {
															href += '&id='+rowdata.id;
															thref = rowdata.id;
														}
														switch(control){
															case"Details":
																Engine.GUI.Breadcrumbs.add(thref, href, { key:options.key, keys:rowdata });
																if((typeof options.modal !== 'undefined')&&(options.modal)){
																	Engine.CRUD.read.show({ table:element, keys:rowdata, key:options.key, href:href });
																} else {
																	Engine.GUI.load($('#ContentFrame'),href, { keys:rowdata });
																}
																break;
															case"Edit":
																Engine.CRUD.update.show({ table:options.table, row:$(this).parents('tr'), keys:rowdata, key:options.key });
																break;
															default:
																if((typeof Engine.CRUD[lcontrol] !== 'undefined')&&(typeof Engine.CRUD[lcontrol].show !== 'undefined')){
																	Engine.CRUD[lcontrol].show({ table:options.table, row:$(this).parents('tr'), keys:rowdata, key:options.key });
																} else {
																	Engine.GUI.Breadcrumbs.add(thref, href, { key:options.key, keys:rowdata });
																	Engine.GUI.load($('#ContentFrame'),href, { keys:rowdata });
																}
																break;
														}
													});
												});
											}
											if(typeof options.container !== 'undefined'){ Engine.GUI.insert(dataset.output.dom); }
											if(callback != undefined){ callback({dom:dataset.output.dom,raw:dataset.output.raw}); }
										}
									}
								});
							}
						});
						modal.modal('show');
					});
				});
			},
		},
		delete:{
			element:{
				modal:{},
				form:{},
			},
			show:function(options = null, callback = null){
				var url = new URL(window.location.href);
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = Engine.Contents.SettingsLandingPage; }
				if(options != null){
					if(options instanceof Function){
						callback = options;
						options = { keys:{}, plugin:plugin, key:'id' };
					} else {
						if(typeof options.keys === 'undefined'){ options.keys = {} }
						if(typeof options.plugin === 'undefined'){ options.plugin = plugin }
						if(typeof options.key === 'undefined'){ options.key = 'id' }
					}
				} else {
					options = { keys:{}, plugin:plugin, key:'id' };
				}
				// Delete
				Engine.Builder.modal($('body'), {
					title:'Delete',
					icon:'delete',
					zindex:'top',
					css:{ header: "bg-danger", body: "p-3"},
				}, function(modal){
					var dialog = modal.find('.modal-dialog');
					var header = modal.find('.modal-header');
					var body = modal.find('.modal-body');
					var footer = modal.find('.modal-footer');
					header.find('button[data-control="hide"]').remove();
					header.find('button[data-control="update"]').remove();
					footer.append('<button type="submit" class="btn btn-danger"><i class="icon icon-delete mr-1"></i>'+Engine.Contents.Language['Delete']+'</button>');
					Engine.Builder.form(modal,{},function(form){
						modal.on('hide.bs.modal',function(){ form.remove(); });
						body.html(Engine.Contents.Language['You are about to delete: ']+'<strong class="ml-1">'+options.keys[options.key]+'</strong>');
						form.off();
						form.submit(function(action){
							action.preventDefault();
							if(Engine.Helper.isSet(Engine.Plugins,['tasks']) && Engine.Auth.validate('plugin', 'tasks', 1)){
								Engine.Plugins.tasks.GUI.add({
									title:Engine.Contents.Language['Deleting']+' '+Engine.Helper.ucfirst(options.plugin),
									value:0,
									max:1,
									plugin:options.plugin,
									extra:''
								},function(opt,task,divider){
									modal.modal('hide');
									Engine.request(options.plugin,'delete',{data:options.keys,report:true},function(result){
										if(result.charAt(0) == '{'){
											var dataset = JSON.parse(result);
											if(typeof dataset.success !== 'undefined'){
												if((typeof options.table !== 'undefined')&&(typeof options.row !== 'undefined')){
													var row = options.table.DataTable().row(options.row).remove().draw(false);
												}
												Engine.Plugins.tasks.GUI.update(task.attr('data-task'), 1);
												if(callback != undefined){ callback(dataset.output.raw); }
											}
										} else {
											var report = task.find('div.row').last().find('span.float-left');
											task.addClass('bg-light-danger');
											report.html('<a class="badge bg-danger px-2"><i class="icon icon-report mr-1"></i>'+Engine.Contents.Language['Report']+'</a>');
											report.find('a').click(function(){
												var message = '<p style="font-size: 18px; color: #2d2d2d line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;">'+Engine.Contents.Auth.User.username+Engine.Contents.Language[' is reporting']+'</p>';
												message += '<p style="font-size: 12px; color: #6c6c6c line-height: 1.5; word-break: break-word; text-align: justify; mso-line-height-alt: 18px; margin: 0;">'+result.replace(/\n/g, "<br />")+'</p>'
												Engine.request('smtp','send',{
													data:{
														email:Engine.Contents.Settings.Contacts.reporting,
														message:message,
													}
												});
											});
										}
									});
								});
							} else {
								modal.modal('hide');
								Engine.request(options.plugin,'delete',{data:options.keys,report:true},function(result){
									if(result.charAt(0) == '{'){
										var dataset = JSON.parse(result);
										if(typeof dataset.success !== 'undefined'){
											if((typeof options.table !== 'undefined')&&(typeof options.row !== 'undefined')){
												var row = options.table.DataTable().row(options.row).remove().draw(false);
											}
											if(callback != undefined){ callback(dataset.output.raw); }
										}
									}
								});
							}
						});
						modal.modal('show');
					});
				});
			},
		},
		deleteAll:{
			element:{
				modal:{},
				form:{},
			},
			show:function(element, options = null, callback = null){
				var url = new URL(window.location.href);
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = Engine.Contents.SettingsLandingPage; }
				if(options != null){
					if(options instanceof Function){
						callback = options;
						options = { keys:{}, plugin:plugin, key:'id' };
					} else {
						if(typeof options.keys === 'undefined'){ options.keys = {} }
						if(typeof options.plugin === 'undefined'){ options.plugin = plugin }
						if(typeof options.key === 'undefined'){ options.key = 'id' }
					}
				} else {
					options = { keys:{}, plugin:plugin, key:'id' };
				}
				Engine.Builder.modal($('body'), {
					title:'Delete',
					icon:'delete',
					zindex:'top',
					css:{ header: "bg-danger", body: "p-3"},
				}, function(modal){
					var dialog = modal.find('.modal-dialog');
					var header = modal.find('.modal-header');
					var body = modal.find('.modal-body');
					var footer = modal.find('.modal-footer');
					header.find('button[data-control="hide"]').remove();
					header.find('button[data-control="update"]').remove();
					footer.append('<button type="submit" class="btn btn-danger"><i class="icon icon-delete mr-1"></i>'+Engine.Contents.Language['Delete']+'</button>');
					Engine.Builder.form(modal,{},function(form){
						modal.on('hide.bs.modal',function(){ form.remove(); });
						body.html(Engine.Contents.Language['Are you sure you want to delete these rows?']);
						form.off();
						form.submit(function(action){
							action.preventDefault();
							var count = element.DataTable().rows( { selected: true } ).count(), ct = 0, executed = 0, readystate = false, stat = true;
							modal.modal('hide');
							if(Engine.Helper.isSet(Engine.Plugins,['tasks']) && Engine.Auth.validate('plugin', 'tasks', 1)){
								Engine.Plugins.tasks.GUI.add({
									title:Engine.Contents.Language['Deleting']+' '+Engine.Helper.ucfirst(options.plugin),
									value:0,
									max:count,
									plugin:plugin,
									extra:''
								},function(opt,task,divider){
									var id = task.attr('data-task');
									var message = '<p style="font-size: 18px; color: #2d2d2d line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;">'+Engine.Contents.Auth.User.username+Engine.Contents.Language[' is reporting']+'</p>';
									element.DataTable().rows( { selected: true } ).every(function(){
										var row = this, rowData = this.data();
										Engine.request(options.plugin,'delete',{
											data:rowData,
											pace:false,
											toast:false,
											report:true,
										},function(result){
											if(result.charAt(0) == '{'){
												var dataset = JSON.parse(result);
												if(typeof dataset.success !== 'undefined'){
													element.DataTable().row('#'+dataset.output.record.id).remove().draw(false);
												} else { stat = false; }
												++ct;
												Engine.Plugins.tasks.GUI.update(id,ct);
											} else {
												message += '<p style="font-size: 12px; color: #6c6c6c line-height: 1.5; word-break: break-word; text-align: justify; mso-line-height-alt: 18px; margin: 0;">'+result.replace(/\n/g, "<br />")+'</p>'
												var report = task.find('div.row').last().find('span.float-left');
												if(!task.hasClass('bg-light-danger')){ task.addClass('bg-light-danger'); }
												report.html('<a class="badge bg-danger px-2"><i class="icon icon-report mr-1"></i>'+Engine.Contents.Language['Report']+'</a>');
												report.find('a').off();
												report.find('a').click(function(){
													Engine.request('smtp','send',{
														data:{
															email:Engine.Contents.Settings.Contacts.reporting,
															message:message,
														}
													});
												});
											}
											if(ct == count){ readystate = true; }
											++executed;
										});
									});
									var checkExist = setInterval(function(){
										if(executed == count){
											clearInterval(checkExist);
											if(readystate){
												if(stat){
													Engine.Toast.show.fire({ type: 'success', text: Engine.Contents.Language['Records successfully deleted'] });
												} else {
													Engine.Toast.show.fire({ type: 'error', text: Engine.Contents.Language['Unable to complete the request'] });
												}
											}
											if(callback != undefined){ callback(element); }
										}
									}, 100);
								});
							} else {
								var message = '<p style="font-size: 18px; color: #2d2d2d line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;">'+Engine.Contents.Auth.User.username+Engine.Contents.Language[' is reporting']+'</p>';
								element.DataTable().rows( { selected: true } ).every(function(){
									var row = this, rowData = this.data();
									Engine.request(options.plugin,'delete',{
										data:rowData,
										pace:false,
										toast:false,
										report:true,
									},function(result){
										if(result.charAt(0) == '{'){
											var dataset = JSON.parse(result);
											if(typeof dataset.success !== 'undefined'){
												element.DataTable().row('#'+dataset.output.record.id).remove().draw(false);
											} else { stat = false; }
											++ct;
										}
										if(ct == count){ readystate = true; }
										++executed;
									});
								});
								var checkExist = setInterval(function(){
									if(executed == count){
										clearInterval(checkExist);
										if(readystate){
											if(stat){
												Engine.Toast.show.fire({ type: 'success', text: Engine.Contents.Language['Records successfully deleted'] });
											} else {
												Engine.Toast.show.fire({ type: 'error', text: Engine.Contents.Language['Unable to complete the request'] });
											}
										}
										if(callback != undefined){ callback(element); }
									}
								}, 100);
							}
						});
						modal.modal('show');
					});
				});
			},
		},
		assign:{
			element:{
				modal:{},
				form:{},
			},
			show:function(table, options = {}, callback = null){
				var url = new URL(window.location.href);
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = Engine.Contents.SettingsLandingPage; }
				if(options instanceof Function){ callback = options; options = {}; }
				if(typeof options.plugin === 'undefined'){ options.plugin = plugin }
				var count = table.DataTable().rows( { selected: true } ).count(), started = 0, executed = 0, ready = false, completed = true;
				Engine.Builder.modal($('body'), {
					title:'Assign',
					icon:'assign',
					zindex:'top',
					css:{ header: "bg-info"},
				}, function(modal){
					modal.on('hide.bs.modal',function(){ modal.remove(); });
					var header = modal.find('.modal-header');
					var body = modal.find('.modal-body');
					var footer = modal.find('.modal-footer');
					header.find('.btn-group').find('[data-control="hide"]').remove();
					header.find('.btn-group').find('[data-control="update"]').remove();
					footer.append('<a class="btn btn-info text-light"><i class="icon icon-assign mr-1"></i>'+Engine.Contents.Language['Assign']+'</a>');
					Engine.Builder.input(body, 'user', Engine.Contents.Auth.User.id,{plugin:options.plugin},function(input){});
					footer.find('a').click(function(){
						if(Engine.Helper.isSet(Engine.Plugins,['tasks']) && Engine.Auth.validate('plugin', 'tasks', 1)){
							Engine.Plugins.tasks.GUI.add({
								title:Engine.Contents.Language['Assigning']+' '+Engine.Helper.ucfirst(options.plugin),
								value:0,
								max:count,
								plugin:options.plugin,
								extra:'',
							},function(opt,task,divider){
								var id = task.attr('data-task');
								var message = '<p style="font-size: 18px; color: #2d2d2d line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;">'+Engine.Contents.Auth.User.username+Engine.Contents.Language[' is reporting']+'</p>';
								table.DataTable().rows( { selected: true } ).every(function(){
									var row = this, rowData = this.data();
									var user = body.find("select").select2("data")[0].text;
									var users = '';
									for(var [key, value] of Object.entries(rowData.assigned_to.split(';'))){ if(value != user){ users += ';'+value; } }
									users += ';'+user;
									rowData.assigned_to = users.replace(/^;|;$/g,'');
									Engine.request(options.plugin,'update',{
										data:rowData,
										toast:false,
										report:true,
									},function(result){
										if(result.charAt(0) == '{'){
											var dataset = JSON.parse(result);
											if(typeof dataset.success !== 'undefined'){
												table.DataTable().row('#'+dataset.output.dom.id).data(dataset.output.dom).draw(false);
											} else { completed = false; }
											++started;
											Engine.Plugins.tasks.GUI.update(id,started);
										} else {
											message += '<p style="font-size: 12px; color: #6c6c6c line-height: 1.5; word-break: break-word; text-align: justify; mso-line-height-alt: 18px; margin: 0;">'+result.replace(/\n/g, "<br />")+'</p>'
											var report = task.find('div.row').last().find('span.float-left');
											if(!task.hasClass('bg-light-danger')){ task.addClass('bg-light-danger'); }
											report.html('<a class="badge bg-danger px-2"><i class="icon icon-report mr-1"></i>'+Engine.Contents.Language['Report']+'</a>');
											report.find('a').off();
											report.find('a').click(function(){
												Engine.request('smtp','send',{
													data:{
														email:Engine.Contents.Settings.Contacts.reporting,
														message:message,
													}
												});
											});
										}
										if(started == count){ ready = true; }
										++executed;
									});
								});
								var isDone = setInterval(function(){
									if(executed == count){
										clearInterval(isDone);
										if(ready){
											if(completed){
												Engine.Toast.show.fire({ type: 'success', text: Engine.Contents.Language['User successfully assigned'] });
											} else {
												Engine.Toast.show.fire({ type: 'error', text: Engine.Contents.Language['Unable to complete the request'] });
											}
										}
										if((callback != undefined)&&(callback != null)){ callback(element); }
									}
								}, 100);
							});
						} else {
							var message = '<p style="font-size: 18px; color: #2d2d2d line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;">'+Engine.Contents.Auth.User.username+Engine.Contents.Language[' is reporting']+'</p>';
							table.DataTable().rows( { selected: true } ).every(function(){
								var row = this, rowData = this.data();
								var user = body.find("select").select2("data")[0].text;
								var users = '';
								for(var [key, value] of Object.entries(rowData.assigned_to.split(';'))){ if(value != user){ users += ';'+value; } }
								users += ';'+user;
								rowData.assigned_to = users.replace(/^;|;$/g,'');
								Engine.request(options.plugin,'update',{
									data:rowData,
									toast:false,
									report:true,
								},function(result){
									if(result.charAt(0) == '{'){
										var dataset = JSON.parse(result);
										if(typeof dataset.success !== 'undefined'){
											table.DataTable().row('#'+dataset.output.dom.id).data(dataset.output.dom).draw(false);
										} else { completed = false; }
										++started;
									}
									if(started == count){ ready = true; }
									++executed;
								});
							});
							var isDone = setInterval(function(){
								if(executed == count){
									clearInterval(isDone);
									if(ready){
										if(completed){
											Engine.Toast.show.fire({ type: 'success', text: Engine.Contents.Language['User successfully assigned'] });
										} else {
											Engine.Toast.show.fire({ type: 'error', text: Engine.Contents.Language['Unable to complete the request'] });
										}
									}
									if((callback != undefined)&&(callback != null)){ callback(element); }
								}
							}, 100);
						}
						modal.modal('hide');
					});
					modal.modal('show');
				});
			},
		},
		unassign:{
			element:{
				modal:{},
				form:{},
			},
			show:function(table, options = {}, callback = null){
				var url = new URL(window.location.href);
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = Engine.Contents.SettingsLandingPage; }
				if(options instanceof Function){ callback = options; options = {}; }
				if(typeof options.plugin === 'undefined'){ options.plugin = plugin }
				var count = table.DataTable().rows( { selected: true } ).count(), started = 0, executed = 0, ready = false, completed = true;
				Engine.Builder.modal($('body'), {
					title:'Unassign',
					icon:'unassign',
					zindex:'top',
					css:{ header: "bg-info"},
				}, function(modal){
					modal.on('hide.bs.modal',function(){ modal.remove(); });
					var header = modal.find('.modal-header');
					var body = modal.find('.modal-body');
					var footer = modal.find('.modal-footer');
					header.find('.btn-group').find('[data-control="hide"]').remove();
					header.find('.btn-group').find('[data-control="update"]').remove();
					footer.append('<a class="btn btn-info text-light"><i class="icon icon-unassign mr-1"></i>'+Engine.Contents.Language['Unassign']+'</a>');
					Engine.Builder.input(body, 'user', Engine.Contents.Auth.User.id,{plugin:options.plugin},function(input){});
					footer.find('a').click(function(){
						if(Engine.Helper.isSet(Engine.Plugins,['tasks']) && Engine.Auth.validate('plugin', 'tasks', 1)){
							Engine.Plugins.tasks.GUI.add({
								title:Engine.Contents.Language['Unassigning']+' '+Engine.Helper.ucfirst(options.plugin),
								value:0,
								max:count,
								plugin:options.plugin,
								extra:'',
							},function(opt,task,divider){
								var id = task.attr('data-task');
								var message = '<p style="font-size: 18px; color: #2d2d2d line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;">'+Engine.Contents.Auth.User.username+Engine.Contents.Language[' is reporting']+'</p>';
								table.DataTable().rows( { selected: true } ).every(function(){
									var row = this, rowData = this.data();
									var user = body.find("select").select2("data")[0].text;
									var users = '';
									if(rowData.assigned_to != user){
										for(var [key, value] of Object.entries(rowData.assigned_to.split(';'))){ if(value != user){ users += ';'+value; } }
									}
									rowData.assigned_to = users.replace(/^;|;$/g,'')
									Engine.request(options.plugin,'update',{
										data:rowData,
										toast:false,
										report:true,
									},function(result){
										if(result.charAt(0) == '{'){
											var dataset = JSON.parse(result);
											if(typeof dataset.success !== 'undefined'){
												table.DataTable().row('#'+dataset.output.dom.id).data(dataset.output.dom).draw(false);
											} else { completed = false; }
											++started;
											Engine.Plugins.tasks.GUI.update(id,started);
										} else {
											message += '<p style="font-size: 12px; color: #6c6c6c line-height: 1.5; word-break: break-word; text-align: justify; mso-line-height-alt: 18px; margin: 0;">'+result.replace(/\n/g, "<br />")+'</p>'
											var report = task.find('div.row').last().find('span.float-left');
											if(!task.hasClass('bg-light-danger')){ task.addClass('bg-light-danger'); }
											report.html('<a class="badge bg-danger px-2"><i class="icon icon-report mr-1"></i>'+Engine.Contents.Language['Report']+'</a>');
											report.find('a').off();
											report.find('a').click(function(){
												Engine.request('smtp','send',{
													data:{
														email:Engine.Contents.Settings.Contacts.reporting,
														message:message,
													}
												});
											});
										}
										if(started == count){ ready = true; }
										++executed;
									});
								});
								var isDone = setInterval(function(){
									if(executed == count){
										clearInterval(isDone);
										if(ready){
											if(completed){
												Engine.Toast.show.fire({ type: 'success', text: Engine.Contents.Language['User successfully unassigned'] });
											} else {
												Engine.Toast.show.fire({ type: 'error', text: Engine.Contents.Language['Unable to complete the request'] });
											}
										}
										if((callback != undefined)&&(callback != null)){ callback(element); }
									}
								}, 100);
							});
						} else {
							var message = '<p style="font-size: 18px; color: #2d2d2d line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;">'+Engine.Contents.Auth.User.username+Engine.Contents.Language[' is reporting']+'</p>';
							table.DataTable().rows( { selected: true } ).every(function(){
								var row = this, rowData = this.data();
								var user = body.find("select").select2("data")[0].text;
								var users = '';
								if(rowData.assigned_to != user){
									for(var [key, value] of Object.entries(rowData.assigned_to.split(';'))){ if(value != user){ users += ';'+value; } }
								}
								rowData.assigned_to = users.replace(/^;|;$/g,'')
								Engine.request(options.plugin,'update',{
									data:rowData,
									toast:false,
									report:true,
								},function(result){
									if(result.charAt(0) == '{'){
										var dataset = JSON.parse(result);
										if(typeof dataset.success !== 'undefined'){
											table.DataTable().row('#'+dataset.output.dom.id).data(dataset.output.dom).draw(false);
										} else { completed = false; }
										++started;
									}
									if(started == count){ ready = true; }
									++executed;
								});
							});
							var isDone = setInterval(function(){
								if(executed == count){
									clearInterval(isDone);
									if(ready){
										if(completed){
											Engine.Toast.show.fire({ type: 'success', text: Engine.Contents.Language['User successfully unassigned'] });
										} else {
											Engine.Toast.show.fire({ type: 'error', text: Engine.Contents.Language['Unable to complete the request'] });
										}
									}
									if((callback != undefined)&&(callback != null)){ callback(element); }
								}
							}, 100);
						}
						modal.modal('hide');
					});
					modal.modal('show');
				});
			},
		},
		lock:{
			element:{
				modal:{},
				form:{},
			},
			show:function(table, options = {}, callback = null){
				var url = new URL(window.location.href);
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = Engine.Contents.SettingsLandingPage; }
				if(options instanceof Function){ callback = options; options = {}; }
				if(typeof options.plugin === 'undefined'){ options.plugin = plugin }
				var count = table.DataTable().rows( { selected: true } ).count(), started = 0, executed = 0, ready = false, completed = true;
				Engine.Builder.modal($('body'), {
					title:'Lock',
					icon:'lock',
					zindex:'top',
					css:{ header: "bg-info"},
				}, function(modal){
					modal.on('hide.bs.modal',function(){ modal.remove(); });
					var header = modal.find('.modal-header');
					var body = modal.find('.modal-body');
					var footer = modal.find('.modal-footer');
					header.find('.btn-group').find('[data-control="hide"]').remove();
					header.find('.btn-group').find('[data-control="update"]').remove();
					body.html(Engine.Contents.Language['Are you sure you want to lock these records?']);
					footer.append('<a class="btn btn-info text-light"><i class="icon icon-lock mr-1"></i>'+Engine.Contents.Language['Lock']+'</a>');
					footer.find('a').click(function(){
						if(Engine.Helper.isSet(Engine.Plugins,['tasks']) && Engine.Auth.validate('plugin', 'tasks', 1)){
							Engine.Plugins.tasks.GUI.add({
								title:Engine.Contents.Language['Locking']+' '+Engine.Helper.ucfirst(options.plugin),
								value:0,
								max:count,
								plugin:options.plugin,
								extra:'',
							},function(opt,task,divider){
								var id = task.attr('data-task');
								var message = '<p style="font-size: 18px; color: #2d2d2d line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;">'+Engine.Contents.Auth.User.username+Engine.Contents.Language[' is reporting']+'</p>';
								table.DataTable().rows( { selected: true } ).every(function(){
									var row = this, rowData = this.data();
									rowData.isLocked = true;
									Engine.request(options.plugin,'update',{
										data:rowData,
										toast:false,
										report:true,
									},function(result){
										if(result.charAt(0) == '{'){
											var dataset = JSON.parse(result);
											if(typeof dataset.success !== 'undefined'){
												table.DataTable().row('#'+dataset.output.dom.id).data(dataset.output.dom).draw(false);
											} else { completed = false; }
											++started;
											Engine.Plugins.tasks.GUI.update(id,started);
										} else {
											message += '<p style="font-size: 12px; color: #6c6c6c line-height: 1.5; word-break: break-word; text-align: justify; mso-line-height-alt: 18px; margin: 0;">'+result.replace(/\n/g, "<br />")+'</p>'
											var report = task.find('div.row').last().find('span.float-left');
											if(!task.hasClass('bg-light-danger')){ task.addClass('bg-light-danger'); }
											report.html('<a class="badge bg-danger px-2"><i class="icon icon-report mr-1"></i>'+Engine.Contents.Language['Report']+'</a>');
											report.find('a').off();
											report.find('a').click(function(){
												Engine.request('smtp','send',{
													data:{
														email:Engine.Contents.Settings.Contacts.reporting,
														message:message,
													}
												});
											});
										}
										if(started == count){ ready = true; }
										++executed;
									});
								});
								var isDone = setInterval(function(){
									if(executed == count){
										clearInterval(isDone);
										if(ready){
											if(completed){
												Engine.Toast.show.fire({ type: 'success', text: Engine.Contents.Language['Record successfully locked'] });
											} else {
												Engine.Toast.show.fire({ type: 'error', text: Engine.Contents.Language['Unable to complete the request'] });
											}
										}
										if((callback != undefined)&&(callback != null)){ callback(element); }
									}
								}, 100);
							});
						} else {
							var message = '<p style="font-size: 18px; color: #2d2d2d line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;">'+Engine.Contents.Auth.User.username+Engine.Contents.Language[' is reporting']+'</p>';
							table.DataTable().rows( { selected: true } ).every(function(){
								var row = this, rowData = this.data();
								rowData.isLocked = true;
								Engine.request(options.plugin,'update',{
									data:rowData,
									toast:false,
									report:true,
								},function(result){
									if(result.charAt(0) == '{'){
										var dataset = JSON.parse(result);
										if(typeof dataset.success !== 'undefined'){
											table.DataTable().row('#'+dataset.output.dom.id).data(dataset.output.dom).draw(false);
										} else { completed = false; }
										++started;
									}
									if(started == count){ ready = true; }
									++executed;
								});
							});
							var isDone = setInterval(function(){
								if(executed == count){
									clearInterval(isDone);
									if(ready){
										if(completed){
											Engine.Toast.show.fire({ type: 'success', text: Engine.Contents.Language['Record successfully locked'] });
										} else {
											Engine.Toast.show.fire({ type: 'error', text: Engine.Contents.Language['Unable to complete the request'] });
										}
									}
									if((callback != undefined)&&(callback != null)){ callback(element); }
								}
							}, 100);
						}
						modal.modal('hide');
					});
					modal.modal('show');
				});
			},
		},
		unlock:{
			element:{
				modal:{},
				form:{},
			},
			show:function(table, options = {}, callback = null){
				var url = new URL(window.location.href);
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = Engine.Contents.SettingsLandingPage; }
				if(options instanceof Function){ callback = options; options = {}; }
				if(typeof options.plugin === 'undefined'){ options.plugin = plugin }
				var count = table.DataTable().rows( { selected: true } ).count(), started = 0, executed = 0, ready = false, completed = true;
				Engine.Builder.modal($('body'), {
					title:'Unlock',
					icon:'unlock',
					zindex:'top',
					css:{ header: "bg-info"},
				}, function(modal){
					modal.on('hide.bs.modal',function(){ modal.remove(); });
					var header = modal.find('.modal-header');
					var body = modal.find('.modal-body');
					var footer = modal.find('.modal-footer');
					header.find('.btn-group').find('[data-control="hide"]').remove();
					header.find('.btn-group').find('[data-control="update"]').remove();
					body.html(Engine.Contents.Language['Are you sure you want to unlock these records?']);
					footer.append('<a class="btn btn-info text-light"><i class="icon icon-unlock mr-1"></i>'+Engine.Contents.Language['Unlock']+'</a>');
					footer.find('a').click(function(){
						if(Engine.Helper.isSet(Engine.Plugins,['tasks']) && Engine.Auth.validate('plugin', 'tasks', 1)){
							Engine.Plugins.tasks.GUI.add({
								title:Engine.Contents.Language['Unlocking']+' '+Engine.Helper.ucfirst(options.plugin),
								value:0,
								max:count,
								plugin:options.plugin,
								extra:'',
							},function(opt,task,divider){
								var id = task.attr('data-task');
								var message = '<p style="font-size: 18px; color: #2d2d2d line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;">'+Engine.Contents.Auth.User.username+Engine.Contents.Language[' is reporting']+'</p>';
								table.DataTable().rows( { selected: true } ).every(function(){
									var row = this, rowData = this.data();
									rowData.isLocked = false
									Engine.request(options.plugin,'update',{
										data:rowData,
										toast:false,
										report:true,
									},function(result){
										if(result.charAt(0) == '{'){
											var dataset = JSON.parse(result);
											if(typeof dataset.success !== 'undefined'){
												table.DataTable().row('#'+dataset.output.dom.id).data(dataset.output.dom).draw(false);
											} else { completed = false; }
											++started;
											Engine.Plugins.tasks.GUI.update(id,started);
										} else {
											message += '<p style="font-size: 12px; color: #6c6c6c line-height: 1.5; word-break: break-word; text-align: justify; mso-line-height-alt: 18px; margin: 0;">'+result.replace(/\n/g, "<br />")+'</p>'
											var report = task.find('div.row').last().find('span.float-left');
											if(!task.hasClass('bg-light-danger')){ task.addClass('bg-light-danger'); }
											report.html('<a class="badge bg-danger px-2"><i class="icon icon-report mr-1"></i>'+Engine.Contents.Language['Report']+'</a>');
											report.find('a').off();
											report.find('a').click(function(){
												Engine.request('smtp','send',{
													data:{
														email:Engine.Contents.Settings.Contacts.reporting,
														message:message,
													}
												});
											});
										}
										if(started == count){ ready = true; }
										++executed;
									});
								});
								var isDone = setInterval(function(){
									if(executed == count){
										clearInterval(isDone);
										if(ready){
											if(completed){
												Engine.Toast.show.fire({ type: 'success', text: Engine.Contents.Language['Record successfully unlocked'] });
											} else {
												Engine.Toast.show.fire({ type: 'error', text: Engine.Contents.Language['Unable to complete the request'] });
											}
										}
										if((callback != undefined)&&(callback != null)){ callback(element); }
									}
								}, 100);
							});
						} else {
							var message = '<p style="font-size: 18px; color: #2d2d2d line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;">'+Engine.Contents.Auth.User.username+Engine.Contents.Language[' is reporting']+'</p>';
							table.DataTable().rows( { selected: true } ).every(function(){
								var row = this, rowData = this.data();
								rowData.isLocked = false
								Engine.request(options.plugin,'update',{
									data:rowData,
									toast:false,
									report:true,
								},function(result){
									if(result.charAt(0) == '{'){
										var dataset = JSON.parse(result);
										if(typeof dataset.success !== 'undefined'){
											table.DataTable().row('#'+dataset.output.dom.id).data(dataset.output.dom).draw(false);
										} else { completed = false; }
										++started;
									}
									if(started == count){ ready = true; }
									++executed;
								});
							});
							var isDone = setInterval(function(){
								if(executed == count){
									clearInterval(isDone);
									if(ready){
										if(completed){
											Engine.Toast.show.fire({ type: 'success', text: Engine.Contents.Language['Record successfully unlocked'] });
										} else {
											Engine.Toast.show.fire({ type: 'error', text: Engine.Contents.Language['Unable to complete the request'] });
										}
									}
									if((callback != undefined)&&(callback != null)){ callback(element); }
								}
							}, 100);
						}
						modal.modal('hide');
					});
					modal.modal('show');
				});
			},
		},
	},
}

// Init API
Engine.init();

// Set Preferences
var maxit = 25, start = 0;
var checkSettings = setInterval(function() {
	++start;
	if(Engine.Helper.isSet(Engine,['Contents','Auth','Options'])){
		clearInterval(checkSettings);
		if(Engine.Helper.isSet(Engine,['Contents','Auth','Options','application'])){
			for(var [key, value] of Object.entries(Engine.Contents.Auth.Options.application)){
				switch(key){
					case'swalPosition':
						Engine.Toast.set.position = value.value;
						Engine.Toast.show = Swal.mixin({
						  toast: Engine.Toast.set.toast,
						  position: Engine.Toast.set.position,
						  showConfirmButton: Engine.Toast.set.showConfirmButton,
						  timer: Engine.Toast.set.timer,
						});
						break;
					case'swalTimer':
						Engine.Toast.set.timer = value.value;
						Engine.Toast.show = Swal.mixin({
						  toast: Engine.Toast.set.toast,
						  position: Engine.Toast.set.position,
						  showConfirmButton: Engine.Toast.set.showConfirmButton,
						  timer: Engine.Toast.set.timer,
						});
						break;
					case'breadcrumbsMax':
						Engine.GUI.Breadcrumbs.set(value.value);
						break;
				}
			}
		}
	}
	if(start == maxit){ clearInterval(checkSettings); }
}, 100);

// Create SideMenu Headers
Engine.GUI.Sidebar.Header.add('MAIN_NAVIGATION',function(){Engine.GUI.Sidebar.Header.add('HELP',function(){Engine.GUI.Sidebar.Header.add('ADMINISTRATION',function(){Engine.GUI.Sidebar.Header.add('DEVELOPMENT');});});});
