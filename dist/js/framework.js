// DatePicker in modal fix
var enforceModalFocusFn = $.fn.modal.Constructor.prototype._enforceFocus;
$.fn.modal.Constructor.prototype._enforceFocus = function() {};

var API = {
	initiated:false,
	debug:true,
	init:function(){
		API.request('api','initialize',{
			toast: false,
			pace: false,
			required: true,
		}).then(function(result){
			var dataset = JSON.parse(result);
			if(typeof dataset.error === 'undefined'){
				API.Contents.Auth = dataset.Auth;
				API.Contents.Settings = dataset.Settings;
				API.Contents.Language = dataset.Lists.Language;
				API.Contents.Countries = dataset.Lists.Countries;
				API.Contents.States = dataset.Lists.States;
				API.Contents.Plugins = dataset.Lists.Plugins;
				API.Contents.Views = dataset.Lists.Views;
				API.Contents.Tables = dataset.Lists.Tables;
				API.Contents.Timezones = dataset.Lists.Timezones;
				API.Contents.Jobs = dataset.Lists.Jobs;
				API.Contents.Tags = dataset.Lists.Tags;
				API.Contents.Statuses = dataset.Lists.Statuses;
				API.Contents.Priorities = dataset.Lists.Priorities;
				API.Contents.data = {dom:{},raw:{}};
				API.debug = API.Contents.Settings.Debug;
				API.initiated = true;
				API.GUI.init();
			}
		});
	},
	request:function(request, type, options = {},callback = null){
		if(options instanceof Function){ callback = options; options = {}; }
		if(typeof options.data === 'undefined'){ options.data = null; }
		if(typeof options.toast === 'undefined'){ options.toast = true; }
		if(typeof options.pace === 'undefined'){ options.pace = true; }
		if(typeof options.report === 'undefined'){ options.report = false; }
		if(typeof options.required === 'undefined'){ options.required = false; }
		if(API.debug){ options.toast = true;options.report = true; }
		if(!options.required){
			var checkAPI = setInterval(function() {
				if(API.initiated){
					clearInterval(checkAPI);
					var xhr = new XMLHttpRequest();
					var params = API.Helper.formatURL({
						method:'session',
						request:request,
						type:type,
						data:btoa(JSON.stringify(options.data)),
					});
					console.log(options.data);
					console.log(request);
					xhr.open('POST', 'api.php', true);
					xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
					xhr.onload = function(){
						if(this.status == 200 && this.responseText !== ''){
							try {
								var decodedResult = atob(this.responseText);
								if(decodedResult.charAt(0) == '{'){
									try {
										var response = JSON.parse(decodedResult);
										if((typeof response.error !== 'undefined')&&(options.toast)){
											API.Toast.show.fire({
												type: 'error',
												text: response.error
											});
										}
										if((typeof response.success !== 'undefined')&&(options.toast)){
											API.Toast.show.fire({
												type: 'success',
												text: response.success
											});
										}
										if(callback instanceof Function){
											try { callback(decodedResult); } catch (error5) {
												if(error5){
													if(options.report){
														if(options.toast){
															var text = 'An error occured in the execution of this API request. See the console(F12) for more details.';
															if(typeof API.Contents.Language !== 'undefined' && typeof API.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'] !== 'undefined'){
																text = API.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'];
															} else { text = 'An error occured in the execution of this API request. See the console(F12) for more details.'; }
															API.Toast.show.fire({
																type: 'error',
																text: text,
																showConfirmButton: true,
																timer: 0
															});
														}
														console.log(error5);
													}
												}
											}
										}
									} catch (error1) {
										if(error1){
											if(options.report){
												if(options.toast){
													var text = 'An error occured in the execution of this API request. See the console(F12) for more details.';
													if(typeof API.Contents.Language !== 'undefined' && typeof API.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'] !== 'undefined'){
														text = API.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'];
													} else { text = 'An error occured in the execution of this API request. See the console(F12) for more details.'; }
													API.Toast.show.fire({
														type: 'error',
														text: text,
														showConfirmButton: true,
														timer: 0
													});
												}
												console.log(error1);
												console.log(this.status+' : '+decodedResult);
											}
										}
									}
								} else {
									if(options.report){
										if(options.toast){
											var text = 'An error occured in the execution of this API request. See the console(F12) for more details.';
											if(typeof API.Contents.Language !== 'undefined' && typeof API.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'] !== 'undefined'){
												text = API.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'];
											} else { text = 'An error occured in the execution of this API request. See the console(F12) for more details.'; }
											API.Toast.show.fire({
												type: 'error',
												text: text,
												showConfirmButton: true,
												timer: 0
											});
										}
										console.log(" Uncaught SyntaxError: JSON.parse: unexpected character at line 1 column 1 of the JSON data");
										console.log(this.status+' : '+decodedResult);
									}
								}
							} catch (error2) {
								if(error2){
									if(options.report){
										if(options.toast){
											var text = 'An error occured in the execution of this API request. See the console(F12) for more details.';
											if(typeof API.Contents.Language !== 'undefined' && typeof API.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'] !== 'undefined'){
												text = API.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'];
											} else { text = 'An error occured in the execution of this API request. See the console(F12) for more details.'; }
											API.Toast.show.fire({
												type: 'error',
												text: text,
												showConfirmButton: true,
												timer: 0
											});
										}
										console.log(error2);
										console.log(this.status+' : '+this.responseText);
									}
								}
							}
						} else {
							if(this.status != 200 && options.report){
								if(options.toast){
									var text = 'An error occured in the execution of this API request. See the console(F12) for more details.';
									if(typeof API.Contents.Language !== 'undefined' && typeof API.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'] !== 'undefined'){
										text = API.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'];
									} else { text = 'An error occured in the execution of this API request. See the console(F12) for more details.'; }
									API.Toast.show.fire({
										type: 'error',
										text: text,
										showConfirmButton: true,
										timer: 0
									});
								}
								console.log(this.status+' : '+this.responseText);
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
				var params = API.Helper.formatURL({
					method:'session',
					request:request,
					type:type,
					data:btoa(JSON.stringify(options.data)),
				});
				xhr.open('POST', 'api.php', true);
				xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				xhr.onerror = reject;
				xhr.onload = function(){
					if(this.status == 200 && this.responseText !== ''){
						try {
							var decodedResult = atob(this.responseText);
							if(decodedResult.charAt(0) == '{'){
								try {
									var response = JSON.parse(decodedResult);
									if((typeof response.error !== 'undefined')&&(options.toast)){
										API.Toast.show.fire({
											type: 'error',
											text: response.error
										});
									}
									if((typeof response.success !== 'undefined')&&(options.toast)){
										API.Toast.show.fire({
											type: 'success',
											text: response.success
										});
									}
									try { resolve(decodedResult); } catch (error6) {
										if(error6){
											if(options.report){
												if(options.toast){
													var text = 'An error occured in the execution of this API request. See the console(F12) for more details.';
													if(typeof API.Contents.Language !== 'undefined' && typeof API.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'] !== 'undefined'){
														text = API.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'];
													} else { text = 'An error occured in the execution of this API request. See the console(F12) for more details.'; }
													API.Toast.show.fire({
														type: 'error',
														text: text,
														showConfirmButton: true,
														timer: 0
													});
												}
												console.log(error6);
											}
										}
									}
								} catch (error3) {
									if(error3){
										if(options.report){
											if(options.toast){
												var text = 'An error occured in the execution of this API request. See the console(F12) for more details.';
												if(typeof API.Contents.Language !== 'undefined' && typeof API.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'] !== 'undefined'){
													text = API.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'];
												} else { text = 'An error occured in the execution of this API request. See the console(F12) for more details.'; }
												API.Toast.show.fire({
													type: 'error',
													text: text,
													showConfirmButton: true,
													timer: 0
												});
											}
											console.log(error3);
											console.log(this.status+' : '+decodedResult);
										}
									}
								}
							} else {
								if(options.report){
									if(options.toast){
										var text = 'An error occured in the execution of this API request. See the console(F12) for more details.';
										if(typeof API.Contents.Language !== 'undefined' && typeof API.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'] !== 'undefined'){
											text = API.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'];
										} else { text = 'An error occured in the execution of this API request. See the console(F12) for more details.'; }
										API.Toast.show.fire({
											type: 'error',
											text: text,
											showConfirmButton: true,
											timer: 0
										});
									}
									console.log(" Uncaught SyntaxError: JSON.parse: unexpected character at line 1 column 1 of the JSON data");
									console.log(this.status+' : '+decodedResult);
								}
							}
						} catch (error4) {
							if(error4){
								if(options.report){
									if(options.toast){
										var text = 'An error occured in the execution of this API request. See the console(F12) for more details.';
										if(typeof API.Contents.Language !== 'undefined' && typeof API.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'] !== 'undefined'){
											text = API.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'];
										} else { text = 'An error occured in the execution of this API request. See the console(F12) for more details.'; }
										API.Toast.show.fire({
											type: 'error',
											text: text,
											showConfirmButton: true,
											timer: 0
										});
									}
									console.log(error4);
									console.log(this.status+' : '+this.responseText);
								}
							}
						}
					} else {
						if(this.status != 200 && options.report){
							if(options.toast){
								var text = 'An error occured in the execution of this API request. See the console(F12) for more details.';
								if(typeof API.Contents.Language !== 'undefined' && typeof API.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'] !== 'undefined'){
									text = API.Contents.Language['An error occured in the execution of this API request. See the console(F12) for more details.'];
								} else { text = 'An error occured in the execution of this API request. See the console(F12) for more details.'; }
								API.Toast.show.fire({
									type: 'error',
									text: text,
									showConfirmButton: true,
									timer: 0
								});
							}
							console.log(this.status+' : '+this.responseText);
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
	},
	Contents:{},
	Auth:{
		validate:function(type, name, level, table =''){
			switch(type){
				case"field":
					if((API.Helper.isSet(API,['Contents','Auth','Permissions',type,table,name]))||(API.Contents.Auth.Permissions[type][table][name] >= level)){
						return true;
					} else {
						return false;
					}
					break;
				case"view":
					if((API.Helper.isSet(API,['Contents','Auth','Permissions',type,table,name]))&&(API.Contents.Auth.Permissions[type][table][name] >= level)){
						return true;
					} else {
						return false;
					}
					break;
				default:
					if((API.Helper.isSet(API,['Contents','Auth','Permissions',type,name]))&&(API.Contents.Auth.Permissions[type][name] >= level)){
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
				if((API.initiated)&&(API.Helper.isSet(API,['Contents','Settings','LandingPage']))){
					clearInterval(checkExist);
					if(origin.plugin == null){
						if((API.Helper.isSet(API,['Contents','Auth','Options','application','landingPage','value']))&&(API.Contents.Auth.Options.application.landingPage.value != null)&&(API.Contents.Auth.Options.application.landingPage.value != '')){
							origin.plugin = API.Contents.Auth.Options.application.landingPage.value;
						} else { origin.plugin = API.Contents.Settings.LandingPage; }
					}
					if(origin.view == null){ origin.view = 'index'; }
					if((API.Helper.isSet(API.Plugins,[origin.plugin,'load',origin.view]))&&(API.Plugins[origin.plugin].load[origin.view] instanceof Function)){
						API.Plugins[origin.plugin].load[origin.view]();
					}
					for(var [key, init] of Object.entries(API.Plugins)){
						if((key != 'init')&&(API.Helper.isSet(init,['extend',origin.plugin,'init']))&&(init.extend[origin.plugin].init instanceof Function)) {
							init.extend[origin.plugin].init();
						}
					}
				}
			}, 100);
		},
	},
	GUI:{
		load:function(element, href, options = null, callback = null){
			var windowLocation = new URL(window.location.href);
			var url = new URL(windowLocation.origin+href);
			if((options != null)&&(options instanceof Function)){ callback = options; options = {}; }
			title = API.Helper.ucfirst(API.Helper.clean(url.searchParams.get("p")));
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
			if((API.Auth.validate('plugin', url.searchParams.get("p"), 1))&&(API.Auth.validate('view', fview, 1, url.searchParams.get("p")))){
				$.ajax({
			    url: view,
			    type: 'HEAD',
			    error: function(){ element.load('./src/views/404.php'); },
			    success: function(){
						element.first().html('');
		        element.first().load(view,null,function(response,status){
							if(status == 'success'){
								if((options != null)&&(typeof options.keys !== 'undefined')){ API.GUI.insert(options.keys); }
								API.Plugins.init();
								if(callback != null){ callback(element); }
							} else { element.load('./src/views/500.php'); }
						});
			    }
				});
			} else { element.load('./src/views/403.php'); }
		},
		init:function(){
			var checkExist = setInterval(function() {
				if((API.initiated)&&($('.breadcrumb-item').length)){
					clearInterval(checkExist);
					$('a[href^="?p="]').off().click(function(action){
						action.preventDefault();
						API.GUI.load($('#ContentFrame'),action.currentTarget.attributes.href.value);
						API.GUI.Breadcrumbs.add(action.currentTarget.textContent, action.currentTarget.attributes.href.value);
					});
					if(!API.Contents.Auth.User.isWelcomed){
						API.Builder.modal($('body'), {
							title:'Welcome',
							icon:'welcome',
							zindex:'top',
							css:{ header: "bg-info",dialog: "modal-lg", body: ""},
						}, function(modal){
							modal.on('hide.bs.modal',function(){ modal.remove(); });
							var dialog = modal.find('.modal-dialog');
							var header = modal.find('.modal-header');
							var body = modal.find('.modal-body');
							var footer = modal.find('.modal-footer');
							header.find('button[data-control="hide"]').remove();
							header.find('button[data-control="update"]').remove();
							footer.find('button').remove();
							var html = '';
							html += '<div class="welcome">';
								html += '<div class="row">';
	                html += '<div class="col-12">';
										html += '<div class="jumbotron m-0 switch-spacer text-center">';
										  html += '<h1 class="display-4">'+API.Contents.Language['welcome_title']+'</h1>';
										  html += '<p class="lead">'+API.Contents.Language['welcome_message']+'</p>';
										html += '</div>';
									html += '</div>';
								html += '</div>';
								html += '<div class="row mx-3 mr-50">';
									if((JSON.stringify(API.Contents.Auth.Groups)==JSON.stringify(API.Contents.Auth.Roles))&&(JSON.stringify(API.Contents.Auth.Groups)==JSON.stringify(['Users']))){
										html += '<div class="col-2 my-1 p-0 text-center pt-2">';
											html += '<i class="fas fa-user-lock fa-2x"></i>';
										html += '</div>';
										html += '<div class="col-10 my-1 p-0 pt-1">';
											html += '<h4>Limited Access</h4>';
											html += '<p class="text-justify">You currently have limited access. Please contact your administrator to gain additional access.</p>';
										html += '</div>';
									}
									html += '<div class="col-2 my-1 p-0 text-center pt-2">';
										html += '<i class="fas fa-user-tie fa-2x"></i>';
									html += '</div>';
									html += '<div class="col-sm-10 col-md-4 my-1 p-0 pt-1">';
										html += '<h4>Personalization</h4>';
	                  html += '<p class="text-justify">The profile page gives you full control over your user and related information. Visit your <a href="?p=profile">profile page</a>.</p>';
	                html += '</div>';
									html += '<div class="col-2 my-1 p-0 text-center pt-2">';
										html += '<i class="fas fa-moon fa-2x"></i>';
									html += '</div>';
									html += '<div class="col-sm-10 col-md-4 my-1 p-0 pt-1">';
										html += '<h4>Dark Mode</h4>';
	                  html += '<p class="text-justify">Dark mode is great whenever you are working in a low light environment. Visit the <a href="?p=profile">profile page</a> and activate "Dark mode".</p>';
	                html += '</div>';
									if(API.Auth.validate('custom', 'organizations_calls', 1)){
										html += '<div class="col-2 my-1 p-0 text-center pt-2">';
											html += '<i class="fas fa-phone fa-2x"></i>';
										html += '</div>';
										html += '<div class="col-sm-10 col-md-4 my-1 p-0 pt-1">';
											html += '<h4>Inline Controls</h4>';
		                  html += '<p class="text-justify">Inline call controls are usefull if you do not want to open the call details everytime to access your call\'s controls. Visit the <a href="?p=profile">profile page</a> and activate "Inline call controls".</p>';
		                html += '</div>';
										html += '<div class="col-2 my-1 p-0 text-center pt-2">';
											html += '<i class="fas fa-window-restore fa-2x"></i>';
										html += '</div>';
		                html += '<div class="col-sm-10 col-md-4 my-1 p-0 pt-1">';
											html += '<h4>Call Widget</h4>';
		                  html += '<p class="text-justify">The call widget gives you quick access to any active calls. Visit the <a href="?p=profile">profile page</a> and activate "Show call widget".</p>';
		                html += '</div>';
									}
	              html += '</div>';
							html += '</div>';
							body.append(html);
							body.find('a[href^="?p="]').off().click(function(action){
								action.preventDefault();
								var text = action.currentTarget.textContent
								if(action.currentTarget.attributes.href.value == '?p=profile'){ text = 'Profile'; }
								API.GUI.Breadcrumbs.add(text, action.currentTarget.attributes.href.value);
								API.GUI.load($('#ContentFrame'),action.currentTarget.attributes.href.value);
								modal.modal('hide');
							});
							modal.modal('show');
						});
					}
				}
			}, 100);
			API.GUI.Navbar.init();
		},
		Navbar:{
			element:{},
			init:function(){
				var maxit = 25, start = 0;
				var checkExist = setInterval(function() {
					++start;
					if((API.initiated)&&($('nav').length > 0)){
						clearInterval(checkExist);
						API.GUI.Navbar.element.left = $('#navbar-left');
						API.GUI.Navbar.element.right = $('#navbar-right');
						API.GUI.Navbar.Notification.init();
						API.GUI.Navbar.Task.init();
					}
					if(start == maxit){ clearInterval(checkExist); }
				}, 100);
			},
			Task:{
				count:0,
				element:{
					list:{},
					badge:{},
				},
				init:function(){
					var checkExist = setInterval(function() {
						if((API.initiated)&&(typeof API.GUI.Navbar.element.left !== "undefined")&&(typeof API.GUI.Navbar.element.right !== "undefined")){
							clearInterval(checkExist);
							var html = '';
							html += '<li class="nav-item dropdown">';
							  html += '<a class="nav-link" data-toggle="dropdown" data-display="static">';
							    html += '<i class="fas fa-tasks"></i>';
									html += '<span class="badge badge-primary navbar-badge">'+API.GUI.Navbar.Task.count+'</span>';
							  html += '</a>';
								html += '<div class="dropdown-menu dropdown-menu-mobile dropdown-menu-task scrollable-menu">';
									html += '<span class="dropdown-item dropdown-header">'+API.GUI.Navbar.Task.count+' '+API.Contents.Language['Tasks']+'</span>';
								html += '</div>';
							html += '</li>';
							API.GUI.Navbar.element.right.prepend(html);
							API.GUI.Navbar.Task.element.list = API.GUI.Navbar.element.right.find('.dropdown-menu').first();
							API.GUI.Navbar.Task.element.badge = API.GUI.Navbar.element.right.find('.badge').first();
						}
					}, 100);
				},
				add:function(options = {}, callback = null){
					if(options instanceof Function){ callback = options; options = {}; }
					var url = new URL(window.location.href);
					var checkExist = setInterval(function() {
						if((API.initiated)&&(typeof API.GUI.Navbar.Task.element.list !== "undefined")&&(typeof API.GUI.Navbar.Task.element.badge !== "undefined")){
							clearInterval(checkExist);
							var html = '';
							++API.GUI.Navbar.Task.count;
							options.id = API.GUI.Navbar.Task.count;
							if(typeof options.title === 'undefined'){ options.title = 'Task '+options.id; }
							if(typeof options.created === 'undefined'){ options.created = API.Helper.now('ISO_8601'); }
							if(typeof options.plugin === 'undefined'){
								if(typeof url.searchParams.get("p") !== 'undefined'){ options.plugin = url.searchParams.get("p"); } else { options.plugin = options.title; }
							}
							if(typeof options.icon === 'undefined'){ options.icon = 'icon icon-'+options.plugin; } else {
								if(options.icon.substring(0, 2) == 'fa'){ options.icon = options.icon+' mr-2'; } else {
									options.icon = 'icon icon-'+options.icon;
								}
							}
							if(typeof options.extra === 'undefined'){ options.extra = API.Helper.ucfirst(options.plugin); }
							if(typeof options.value === 'undefined'){ options.value = 0; }
							if(typeof options.max === 'undefined'){ options.max = 1; }
							var value = ((options.value / options.max) * 100);
							if(0 <= value &&  value < 25){ var bg = 'warning'; }
							else if (25 <= value &&  value < 50){ var bg = 'info'; }
							else if (50 <= value &&  value < 75){ var bg = 'info'; }
							else if (75 <= value &&  value < 100){ var bg = 'primary'; }
							else if (100 == value){ var bg = 'success'; }
							API.GUI.Navbar.Task.element.badge.html(options.id);
							API.GUI.Navbar.Task.element.list.find('.dropdown-header').first().remove();
							html += '<div data-task="'+options.id+'" class="dropdown-divider"></div>';
							html += '<a data-task="'+options.id+'" class="dropdown-item">';
								html += '<div class="row"><div class="col-md-12">'+options.title+'</div></div>';
								html += '<div class="row">';
									html += '<div class="col-md-1"><i class="'+options.icon+'"></i></div>';
									html += '<div class="col-md-11 p-2"><div class="progress progress-sm"><div class="progress-bar bg-'+bg+' progress-bar-striped" role="progressbar" aria-valuenow="'+options.value+'" aria-valuemin="0" aria-valuemax="'+options.max+'" style="width: '+((options.value / options.max) * 100)+'%">'+Math.trunc((options.value / options.max) * 100)+'%</div></div></div>';
								html += '</div>';
								html += '<div class="row">';
									html += '<div class="col-md-12">';
										html += '<span class="float-left text-muted text-sm">'+options.extra+'</span>';
										html += '<span class="float-right text-muted text-sm"><time class="timeago" datetime="'+options.created+'"></time></span>';
									html += '</div>';
								html += '</div>';
							html += '</a>';
							API.GUI.Navbar.Task.element.list.prepend(html);
							API.GUI.Navbar.Task.element.list.prepend('<span class="dropdown-item dropdown-header">'+options.id+' '+API.Contents.Language['Tasks']+'</span>');
							$('[data-task="'+options.id+'"]').last().find('time').timeago();
							if(callback != undefined){ callback(options, $('[data-task="'+options.id+'"]').last(), $('[data-task="'+options.id+'"]').first()); }
						}
					}, 100);
				},
				update:function(id, value, options = null){
					var task = API.GUI.Navbar.Task.element.list.find('[data-task="'+id+'"]').last();
					var progress = task.find('.progress-bar');
					var width = (value / progress.attr('aria-valuemax') * 100)
					progress.attr('aria-valuenow', value);
					progress.width(width+'%');
					progress.html(Math.trunc(width)+'%');
					progress.removeClass('bg-info');
					progress.removeClass('bg-warning');
					progress.removeClass('bg-primary');
					progress.removeClass('bg-success');
					if(0 <= width &&  width < 25){ var bg = 'warning'; }
					else if (25 <= width &&  width < 50){ var bg = 'info'; }
					else if (50 <= width &&  width < 75){ var bg = 'info'; }
					else if (75 <= width &&  width < 100){ var bg = 'primary'; }
					else if (100 == width){ var bg = 'success'; }
					progress.addClass('bg-'+bg);
					if(value == progress.attr('aria-valuemax')){
						setTimeout(function() { API.GUI.Navbar.Task.remove(id); }, 5000);
					}
				},
				remove:function(id){
					--API.GUI.Navbar.Task.count;
					API.GUI.Navbar.Task.element.list.find('[data-task="'+id+'"]').remove();
					API.GUI.Navbar.Task.element.list.find('.dropdown-header').first().remove();
					API.GUI.Navbar.Task.element.list.prepend('<span class="dropdown-item dropdown-header">'+API.GUI.Navbar.Task.count+' '+API.Contents.Language['Tasks']+'</span>');
					API.GUI.Navbar.Task.element.badge.html(API.GUI.Navbar.Task.count);
				},
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
						if((API.initiated)&&(typeof API.GUI.Navbar.element.left !== "undefined")&&(typeof API.GUI.Navbar.element.right !== "undefined")){
							clearInterval(checkExist);
							var html = '';
							html += '<li class="nav-item dropdown">';
							  html += '<a class="nav-link" data-toggle="dropdown" data-display="static">';
							    html += '<i class="fas fa-bell"></i>';
									html += '<span class="badge badge-danger navbar-badge">'+API.GUI.Navbar.Notification.count+'</span>';
							  html += '</a>';
								html += '<div class="dropdown-menu dropdown-menu-mobile dropdown-menu-notification scrollable-menu">';
									html += '<span class="dropdown-item dropdown-header">'+API.GUI.Navbar.Notification.count+' '+API.Contents.Language['Notifications']+'</span>';
									html += '<div class="dropdown-divider"></div>';
									html += '<a class="dropdown-item dropdown-header">'+API.Contents.Language['Dismiss All']+'</a>';
								html += '</div>';
							html += '</li>';
							API.GUI.Navbar.element.right.prepend(html);
							API.GUI.Navbar.Notification.element.list = API.GUI.Navbar.element.right.find('.dropdown-menu').first();
							API.GUI.Navbar.Notification.element.badge = API.GUI.Navbar.element.right.find('.badge').first();
							API.GUI.Navbar.Notification.element.dismiss = API.GUI.Navbar.Notification.element.list.find('.dropdown-header').last();
							API.GUI.Navbar.Notification.element.dismiss.click(function(){
								API.GUI.Navbar.Notification.dismissAll();
							});
						}
					}, 100);
					API.GUI.Navbar.Notification.fetch();
					var checkNotifs = setInterval(function() {
						if(API.initiated){API.GUI.Navbar.Notification.fetch();}
					}, 30000);
				},
				fetch:function(){
					API.request('notifications','read',{
						data:{filters:[
							{ relationship:'equal', name:'user', value:API.Contents.Auth.User.id},
							{ relationship:'equal', name:'dissmissed', value:1},
						]},
						toast:false,
						pace:false,
					},function(result){
						var dataset = JSON.parse(result), html = '', etoast = false;
						if(typeof dataset.success !== 'undefined'){
							for(var [key, value] of Object.entries(dataset.output.results)){
								if($('[data-notification="'+value.id+'"]').length == 0){
									value.create = false;
									etoast = true;
									API.GUI.Navbar.Notification.add(value);
								}
							}
							if(etoast){ API.Toast.show.fire({ type: 'info', text: API.Contents.Language['You have new notifications'] }); }
						}
					});
				},
				add:function(options = {}, callback = null){
					if(options instanceof Function){ callback = options; options = {}; }
					var url = new URL(window.location.href);
					if(typeof options.href !== 'undefined'){ var url = new URL(url.origin+options.href); }
					options.href = '';
					if((typeof url.searchParams.get("p") !== 'undefined')&&(url.searchParams.get("p") != null)){ options.href += '?p='+url.searchParams.get("p"); } else {
						options.href += '?p='+API.Contents.Settings.LandingPage;
					}
					if((typeof url.searchParams.get("v") !== 'undefined')&&(url.searchParams.get("v") != null)){
						options.href += '\&v='+url.searchParams.get("v");
						if((typeof url.searchParams.get("id") !== 'undefined')&&(url.searchParams.get("id") != null)){
							options.href += '\&id='+url.searchParams.get("id");
						}
					}
					if(typeof options.subject === 'undefined'){ options.subject = 'Notification '+(API.GUI.Navbar.Notification.count + 1); }
					if(typeof options.dissmissed === 'undefined'){ options.dissmissed = 1; }
					if(typeof options.user === 'undefined'){ options.user = API.Contents.Auth.User.id; }
					if(typeof options.icon === 'undefined'){ options.icon = 'icon icon-'+url.searchParams.get("p")+' mr-2'; } else {
						if(options.icon.substring(0, 2) == 'fa'){ options.icon = options.icon+' mr-2'; } else {
							options.icon = 'icon icon-'+options.icon+' mr-2';
						}
					}
					if(typeof options.create === 'undefined'){ options.create = true; }
					var maxit = 25, start = 0;
					var checkExist = setInterval(function() {
						++start;
						if((typeof API.GUI.Navbar.Notification.element.list !== "undefined")&&(typeof API.GUI.Navbar.Notification.element.badge !== "undefined")){
							clearInterval(checkExist);
							if(options.create){
								API.request('notifications','create',{
									data:options,
									toast:false,
									pace:false,
								},function(result){
									var dataset = JSON.parse(result), html = '';
									if(typeof dataset.success !== 'undefined'){
										var nurl = new URL(url.origin+dataset.output.results.href);
										++API.GUI.Navbar.Notification.count;
										API.GUI.Navbar.Notification.element.badge.html(API.GUI.Navbar.Notification.count);
										API.GUI.Navbar.Notification.element.list.find('.dropdown-header').first().remove();
										html += '<div data-notification="'+dataset.output.results.id+'" class="dropdown-divider"></div>';
										html += '<a data-notification="'+dataset.output.results.id+'" href="'+dataset.output.results.href+'" class="dropdown-item">';
											html += '<i class="'+dataset.output.results.icon+'"></i>'+dataset.output.results.subject;
											html += '<span class="float-right text-muted text-sm"><time class="timeago" datetime="'+dataset.output.results.created.replace(/ /g, "T")+'">'+dataset.output.results.created+'</time></span>';
										html += '</a>';
										API.GUI.Navbar.Notification.element.list.prepend(html);
										API.GUI.Navbar.Notification.element.list.prepend('<span class="dropdown-item dropdown-header">'+API.GUI.Navbar.Notification.count+' '+API.Contents.Language['Notifications']+'</span>');
										$('[data-notification="'+dataset.output.results.id+'"]').find('time').timeago();
										var element = $('[data-notification="'+dataset.output.results.id+'"]').last();
										element.click(function(action){
											action.preventDefault();
											var id = $(this).attr('data-notification');
											var burl = new URL(url.origin+action.currentTarget.attributes.href.value);
											var textContent = '';
											if((typeof burl.searchParams.get("p") !== 'undefined')&&(burl.searchParams.get("p") != null)){ textContent = API.Contents.Language[API.Helper.ucfirst(burl.searchParams.get("p"))]; }
											if((typeof burl.searchParams.get("id") !== 'undefined')&&(burl.searchParams.get("id") != null)){ textContent = burl.searchParams.get("id"); }
											API.GUI.Breadcrumbs.add(textContent, action.currentTarget.attributes.href.value);
											API.GUI.load($('#ContentFrame'),action.currentTarget.attributes.href.value);
											API.GUI.Navbar.Notification.dismiss(id);
											API.GUI.Navbar.Notification.element.list.find('a').removeClass('active');
										});
										if(callback != undefined){ callback(options, dataset.output.results, element, $('[data-notification="'+dataset.output.results.id+'"]').first()); }
									}
								});
							} else {
								var nurl = new URL(url.origin+options.href), html = '';
								++API.GUI.Navbar.Notification.count;
								API.GUI.Navbar.Notification.element.badge.html(API.GUI.Navbar.Notification.count);
								API.GUI.Navbar.Notification.element.list.find('.dropdown-header').first().remove();
								html += '<div data-notification="'+options.id+'" class="dropdown-divider"></div>';
								html += '<a data-notification="'+options.id+'" href="'+options.href+'" class="dropdown-item">';
									html += '<i class="'+options.icon+'"></i>'+options.subject;
									html += '<span class="float-right text-muted text-sm"><time class="timeago" datetime="'+options.created.replace(/ /g, "T")+'">'+options.created+'</time></span>';
								html += '</a>';
								API.GUI.Navbar.Notification.element.list.prepend(html);
								API.GUI.Navbar.Notification.element.list.prepend('<span class="dropdown-item dropdown-header">'+API.GUI.Navbar.Notification.count+' '+API.Contents.Language['Notifications']+'</span>');
								$('[data-notification="'+options.id+'"]').find('time').timeago();
								var element = $('[data-notification="'+options.id+'"]').last();
								element.click(function(action){
									action.preventDefault();
									var id = $(this).attr('data-notification');
									var burl = new URL(url.origin+action.currentTarget.attributes.href.value);
									var textContent = '';
									if((typeof burl.searchParams.get("p") !== 'undefined')&&(burl.searchParams.get("p") != null)){ textContent = API.Contents.Language[API.Helper.ucfirst(burl.searchParams.get("p"))]; }
									if((typeof burl.searchParams.get("id") !== 'undefined')&&(burl.searchParams.get("id") != null)){ textContent = burl.searchParams.get("id"); }
									API.GUI.Breadcrumbs.add(textContent, action.currentTarget.attributes.href.value);
									API.GUI.load($('#ContentFrame'),action.currentTarget.attributes.href.value);
									API.GUI.Navbar.Notification.dismiss(id);
									API.GUI.Navbar.Notification.element.list.find('a').removeClass('active');
								});
								if(callback != undefined){ callback(options, options, element, $('[data-notification="'+options.id+'"]').first()); }
							}
						}
						if(start == maxit){ clearInterval(checkExist); }
					}, 100);
				},
				dismiss:function(id, callback = null){
					var notification = API.GUI.Navbar.Notification.element.list.find('[data-notification="'+id+'"]').last();
					var notif = {};
					notif.id = id;
					notif.dissmissed = 2;
					API.request('notifications','update',{
						data:notif,
						toast: false,
						pace: false,
					},function(result){
						var dataset = JSON.parse(result), html = '';
						if(typeof dataset.success !== 'undefined'){
							notification.addClass('text-muted');
							notification.css("background-color", "#f8f9fa");
							setTimeout(function() {
								--API.GUI.Navbar.Notification.count;
								API.GUI.Navbar.Notification.element.list.find('.dropdown-header').first().remove();
								API.GUI.Navbar.Notification.element.badge.html(API.GUI.Navbar.Notification.count);
								API.GUI.Navbar.Notification.element.list.prepend('<span class="dropdown-item dropdown-header">'+API.GUI.Navbar.Notification.count+' '+API.Contents.Language['Notifications']+'</span>');
								API.GUI.Navbar.Notification.element.list.find('[data-notification="'+dataset.output.results.id+'"]').remove();
							}, 5000);
							if(callback != undefined){ callback(notification); }
						}
					});
				},
				dismissAll:function(){
					API.GUI.Navbar.Notification.element.list.find('a[data-notification]').each(function(){
						API.GUI.Navbar.Notification.dismiss($(this).attr('data-notification'));
					});
					API.GUI.Navbar.Notification.count = API.GUI.Navbar.Notification.element.list.find('a[data-notification]').length;
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
						if((API.Helper.isSet(API,['Contents','Auth','Permissions']))&&(typeof API.Contents.Language !== 'undefined')){
							clearInterval(checkExist);
							if((API.Auth.validate('nav-header', txt.toLowerCase(), 1))&&($('#sidenav-'+txt.toLowerCase()).length == 0)){
								++API.GUI.Sidebar.Header.count;
								$('.sidebar nav .nav-sidebar').append('<li data-order="'+(API.GUI.Sidebar.Header.count * 1000)+'" data-header="'+txt.toLowerCase()+'" id="sidenav-'+txt.toLowerCase()+'" class="nav-header bg-'+color+'" style="padding:8px;">'+API.Contents.Language[txt].toUpperCase()+'</li>');
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
						if((API.Helper.isSet(API,['Contents','Auth','Permissions']))&&(typeof API.Contents.Language !== 'undefined')){
							if(API.Auth.validate('nav-header', location, 1)){
								if($('#sidenav-'+location).length){
									clearInterval(checkExist);
									if(API.Auth.validate('nav-item', lwr_txt, 1)){
										++API.GUI.Sidebar.Nav.count;
										$('#sidenav-'+location).after('<li data-order="'+($('#sidenav-'+location).attr('data-order') + API.GUI.Sidebar.Nav.count)+'" data-header="'+location.toLowerCase()+'" class="nav-item"><a href="?p='+lwr_txt+'" class="nav-link"><i class="nav-icon '+icon+' mr-1"></i><p>'+API.Contents.Language[API.Helper.ucfirst(API.Helper.clean(txt))]+'</p></a></li>');
										$('.nav-item a[href^="?p='+lwr_txt+'"]').off("click");
										$('.nav-item a[href^="?p='+lwr_txt+'"]').click(function(action){
											action.preventDefault();
											API.GUI.load($('#ContentFrame'),action.currentTarget.attributes.href.value);
											API.GUI.Breadcrumbs.add(action.currentTarget.textContent, action.currentTarget.attributes.href.value);
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
				API.GUI.Breadcrumbs.max = max;
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
					if((API.Helper.isSet(API,['Contents','Auth','Permissions']))&&(typeof API.Contents.Language !== 'undefined')){
						clearInterval(checkExist);
						if($('.breadcrumb li').length >= API.GUI.Breadcrumbs.max){ $('.breadcrumb li:last-child').remove(); }
						if(url.searchParams.get("id") != undefined){ var crumbtitle = API.Helper.ucfirst(API.Helper.clean(url.searchParams.get("id"))); } else { var crumbtitle = API.Contents.Language[API.Helper.ucfirst(API.Helper.clean(title))]; }
						if((options != null)&&(API.Helper.isSet(options,['breadcrumb','title']))){ crumbtitle = options.breadcrumb.title }
						if((options != null)&&(typeof options.keys !== 'undefined')){
							$('#crumbs').prepend('<li class="breadcrumb-item"><a href="'+href+'"><i class="icon icon-'+url.searchParams.get("p")+' mr-1"></i>'+crumbtitle+'</a></li>');
						} else {
							$('#crumbs').prepend('<li class="breadcrumb-item"><a href="'+href+'"><i class="icon icon-'+url.searchParams.get("p")+' mr-1"></i>'+crumbtitle+'</a></li>');
						}
						$('.breadcrumb li:first-child a[href^="?p="]').click(function(action){
							action.preventDefault();
							if($(this).attr('data-keys') != undefined){
								var keys = JSON.parse($(this).attr('data-keys'));
								API.GUI.Breadcrumbs.add(action.currentTarget.textContent, action.currentTarget.attributes.href.value, { keys:keys });
								API.GUI.load($('#ContentFrame'),action.currentTarget.attributes.href.value, { keys:keys });
							} else {
								API.GUI.Breadcrumbs.add(action.currentTarget.textContent, action.currentTarget.attributes.href.value);
								API.GUI.load($('#ContentFrame'),action.currentTarget.attributes.href.value);
							}
						});
					}
					if(start == maxit){ clearInterval(checkExist); }
				}, 100);
			},
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
							if(API.Helper.isSet(API,['Contents',data.relationship,value])){
								API.GUI.Breadcrumbs.add(value, '?p='+data.relationship+'&v=details&id='+value, { keys:API.Contents.data[data.relationship][value] });
								API.CRUD.read.show({ keys:API.Contents.data[data.relationship][value], title:value, href:'?p='+data.relationship+'&v=details&id='+value, modal:true });
							} else {
								API.GUI.Breadcrumbs.add(value, '?p='+data.relationship+'&v=details&id='+value);
								API.CRUD.read.show({ href:'?p='+data.relationship+'&v=details&id='+value, title:value, modal:true });
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
	},
	Helper:{
		ucfirst:function(s){ if (typeof s !== 'string') return s; return s.charAt(0).toUpperCase() + s.slice(1); },
		formatURL:function(params){
			return Object.keys(params).map(function(key){ return key+"="+encodeURIComponent(params[key]) }).join("&");
		},
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
		pad:function(str, max){
		  str = str.toString();
		  return str.length < max ? pad("0" + str, max) : str;
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
		now:function(type = 'text'){
			var currentDate = new Date();
			switch(type){
				case'ISO_8601':
					var datetime = currentDate.getFullYear() + "-"
		        + (currentDate.getMonth()+1)  + "-"
		        + currentDate.getDate() + "T"
		        + API.Helper.addZero(currentDate.getHours()) + ":"
		        + API.Helper.addZero(currentDate.getMinutes()) + ":"
		        + API.Helper.addZero(currentDate.getSeconds());
					break;
				default:
					var datetime = currentDate.getFullYear() + "-"
		        + (currentDate.getMonth()+1)  + "-"
		        + currentDate.getDate() + " "
		        + API.Helper.addZero(currentDate.getHours()) + ":"
		        + API.Helper.addZero(currentDate.getMinutes()) + ":"
		        + API.Helper.addZero(currentDate.getSeconds());
					break;
			}
			return datetime;
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
				if((API.Helper.isSet(API,['Contents','Auth','User']))&&(typeof API.Contents.Language !== 'undefined')){
					clearInterval(checkExist);
					// Insert card in DOM
					var html = '', title = options.title, icon = options.icon, css = options.css;
					if(typeof API.Contents.Language[title] === 'undefined'){ console.log(title); }
					title = API.Contents.Language[API.Helper.ucfirst(API.Helper.clean(title))];
					if(typeof options.extra !== 'undefined'){ html += '<div class="card '+css+'" data-extra="'+options.extra+'">'; }
					else { html += '<div class="card '+css+'">'; }
					html += '<div class="card-header "><h3 class="card-title"><i class="icon icon-'+icon+' mr-1"></i>'+title+'</h3><div class="card-tools"></div></div><div class="card-body"></div></div>';
					element.append(html);
					var card = element.find('.card').last();
					++API.Builder.counts.card;
					card.attr('id','card_'+API.Builder.counts.card);
					if(callback != null){ callback(card); }
				}
				if(start == maxit){ clearInterval(checkExist); }
			}, 100);
		},
		Timeline:{
			add:{
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
					API.Builder.Timeline.add.date(timeline,item.created);
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
					API.Builder.Timeline.add.date(timeline,item.created);
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
		                        html += '<i class="fas fa-file-download mr-1"></i>'+API.Helper.getFileSize(file.size,true,2);
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
					API.Builder.Timeline.add.date(timeline,item.created);
					var checkExist = setInterval(function() {
						if(timeline.find('div.time-label[data-dateus="'+dateUS+'"]').length > 0){
							clearInterval(checkExist);
							if(typeof item.id !== 'undefined'){
								var html = '';
								status = '<span class="mr-1 badge bg-'+API.Contents.Statuses.calls[item.status].color+'"><i class="'+API.Contents.Statuses.calls[item.status].icon+' mr-1" aria-hidden="true"></i>'+API.Contents.Language[API.Contents.Statuses.calls[item.status].name]+'</span>';
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
										if(API.Auth.validate('custom', 'timeline_calls_phone', 1)){
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
						plugin = timeline.parent().attr('id');
						API.Builder.Timeline.add.date(timeline,item.created);
						var checkExist = setInterval(function() {
							if(timeline.find('div.time-label[data-dateus="'+dateUS+'"]').length > 0){
								clearInterval(checkExist);
								if(typeof item.id !== 'undefined'){
									var html = '';
									if(typeof item.order !== 'undefined') { var status = item.order; }
									else if(typeof item.status_id !== 'undefined') { var status = item.status_id; }
									else if(typeof item.status !== 'undefined') { var status = item.status; }
									else { var status = 1; }
									status = '<span class="badge bg-'+API.Contents.Statuses[plugin][status].color+'"><i class="'+API.Contents.Statuses[plugin][status].icon+' mr-1" aria-hidden="true"></i>'+API.Contents.Language[API.Contents.Statuses[plugin][status].name]+'</span>';
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
					API.Builder.Timeline.add.date(timeline,item.created);
					var checkExist = setInterval(function() {
						if(timeline.find('div.time-label[data-dateus="'+dateUS+'"]').length > 0){
							clearInterval(checkExist);
							if(typeof item.id !== 'undefined'){
								var html = '';
								if(typeof item.order !== 'undefined') { var priority = item.order; }
								else if(typeof item.priority !== 'undefined') { var priority = item.priority; }
								else { var priority = 1; }
								priority = '<span class="badge bg-'+API.Contents.Priorities[url.searchParams.get("p")][priority].color+'"><i class="'+API.Contents.Priorities[url.searchParams.get("p")][priority].icon+' mr-1" aria-hidden="true"></i>'+API.Contents.Language[API.Contents.Priorities[url.searchParams.get("p")][priority].name]+'</span>';
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
					API.Builder.Timeline.add.date(timeline,item.created);
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
					API.Builder.Timeline.add.date(timeline,item.created);
					var checkExist = setInterval(function() {
						if(timeline.find('div.time-label[data-dateus="'+dateUS+'"]').length > 0){
							clearInterval(checkExist);
							if(typeof item.id !== 'undefined'){
								var html = '';
								if(!API.Helper.isSet(API.Contents.Language,[API.Contents.Statuses.issues[item.status].name])){ console.log(API.Contents.Statuses.issues[item.status].name); }
								status = '<span class="mx-1 badge bg-'+API.Contents.Statuses.issues[item.status].color+'"><i class="'+API.Contents.Statuses.issues[item.status].icon+' mr-1" aria-hidden="true"></i>'+API.Contents.Language[API.Contents.Statuses.issues[item.status].name]+'</span>';
								html += '<div data-type="'+icon+'" data-id="'+item.id+'" data-date="'+dateItem.getTime()+'">';
									html += '<i class="fas fa-'+icon+' bg-'+color+'"></i>';
									html += '<div class="timeline-item">';
										html += '<span class="time"><i class="fas fa-clock mr-2"></i><time class="timeago" datetime="'+item.created.replace(/ /g, "T")+'">'+item.created+'</time></span>';
										html += '<h3 class="timeline-header">Issue '+item.id+' - '+item.name+' was linked and set to'+status+'</h3>';
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
					API.Builder.Timeline.add.date(timeline,item.created);
					var checkExist = setInterval(function() {
						if(timeline.find('div.time-label[data-dateus="'+dateUS+'"]').length > 0){
							clearInterval(checkExist);
							if(typeof item.id !== 'undefined'){
								var html = '';
								html += '<div data-type="'+icon+'" data-id="'+item.id+'" data-date="'+dateItem.getTime()+'">';
									html += '<i class="fas fa-'+icon+' bg-'+color+'"></i>';
									html += '<div class="timeline-item">';
										html += '<span class="time"><i class="fas fa-clock mr-2"></i><time class="timeago" datetime="'+item.created.replace(/ /g, "T")+'">'+item.created+'</time></span>';
										html += '<h3 class="timeline-header">'+item.email+' was subscribed</h3>';
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
					API.Builder.Timeline.add.client(timeline, item, icon, color, callback = null);
				},
				client:function(timeline, item, icon = 'building', color = 'secondary', callback = null){
					var url = new URL(window.location.href);
					var id = url.searchParams.get("id"), html = '';
					var dateItem = new Date(item.created);
					var dateUS = dateItem.toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, '-').replace(/,/g, '');
					API.Builder.Timeline.add.date(timeline,item.created);
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
				contact:function(timeline, item, icon = 'address-card', color = 'secondary', callback = null){
					var url = new URL(window.location.href);
					var id = url.searchParams.get("id"), html = '';
					var dateItem = new Date(item.created);
					var dateUS = dateItem.toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, '-').replace(/,/g, '');
					API.Builder.Timeline.add.date(timeline,item.created);
					var checkExist = setInterval(function() {
						if(timeline.find('div.time-label[data-dateus="'+dateUS+'"]').length > 0){
							clearInterval(checkExist);
							if(typeof item.id !== 'undefined'){
								var html = '';
								html += '<div data-type="'+icon+'" data-id="'+item.id+'" data-organization="'+item.organization+'" data-isEmployee="'+item.isEmployee+'" data-isContact="'+item.isContact+'" data-name="'+item.name+'" data-date="'+dateItem.getTime()+'">';
									html += '<i class="fas fa-'+icon+' bg-'+color+'"></i>';
									html += '<div class="timeline-item">';
										html += '<span class="time"><i class="fas fa-clock mr-2"></i><time class="timeago" datetime="'+item.created.replace(/ /g, "T")+'">'+item.created+'</time></span>';
										html += '<h3 class="timeline-header">'+item.name+' was created</h3>';
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
				user:function(timeline, item, icon = 'user', color = 'lightblue', callback = null){
					var url = new URL(window.location.href);
					var id = url.searchParams.get("id"), html = '';
					var dateItem = new Date(item.created);
					var dateUS = dateItem.toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, '-').replace(/,/g, '');
					API.Builder.Timeline.add.date(timeline,item.created);
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
				if(API.Auth.validate('plugin', options.plugin, 1)){ options.buttons.push({name: "Details", text: "Details", color: "primary" }); }
				if(API.Auth.validate('plugin', options.plugin, 3)){ options.buttons.push({name: "Edit", text: "", color: "warning" }); }
				if(API.Auth.validate('plugin', options.plugin, 4)){ options.buttons.push({name: "Delete", text: "", color: "danger" }); }
			}
			if(typeof options.controls === 'undefined'){ options.controls = {}; }
			if(typeof options.controls.label === 'undefined'){ options.controls.label = true; }
			if(typeof options.controls.disable === 'undefined'){ options.controls.disable = []; }
			if(typeof options.controls.add === 'undefined'){ options.controls.add = []; }
			var checkExist = setInterval(function() {
				if((API.Helper.isSet(API,['Contents','Auth','User']))&&(typeof API.Contents.Language !== 'undefined')){
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
							if(typeof btn.text !== 'undefined'){ text = btn.text; } else { text = API.Contents.Language[btn.name]; }
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
							cols.push({ name: value.toLowerCase(), title: API.Contents.Language[API.Helper.ucfirst(API.Helper.clean(value))], data: value.toLowerCase(), defaultContent: '', targets: colsct });
							if(typeof API.Contents.Language[API.Helper.ucfirst(API.Helper.clean(value))] === 'undefined'){ console.log(API.Helper.ucfirst(API.Helper.clean(value))); }
						}
					} else {
						for (var [key, value] of Object.entries(data[0])) {
							if(key == 'assigned_to'){ canAssign = true; }
							if(key == 'isLocked'){ canLock = true; }
							++colsct;
							cols.push({ name: key, title: API.Contents.Language[API.Helper.ucfirst(API.Helper.clean(key))], data: key, defaultContent: '', targets: colsct });
							if(typeof API.Contents.Language[API.Helper.ucfirst(API.Helper.clean(key))] === 'undefined'){ console.log(API.Helper.ucfirst(API.Helper.clean(key))); }
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
									return API.Contents.States[data];
								};
								break;
							case"country":
								cols[key].render = function(data, type, row, meta){
									return API.Contents.Countries[data];
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
										var references = JSON.parse(data);
										for (var [index, reference] of Object.entries(references)) {
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
									if((data != '')&&(typeof API.Contents.Statuses[options.clickable.plugin][data] !== 'undefined')){
										var html = '<span class="badge bg-'+API.Contents.Statuses[options.clickable.plugin][data].color+'">';
											html += '<i class="'+API.Contents.Statuses[options.clickable.plugin][data].icon+' mr-1"></i>';
											html += API.Contents.Language[API.Contents.Statuses[options.clickable.plugin][data].name];
										html += '</span>';
										return html;
									} else {
										return data;
									}
								};
								break;
							case"status":
								cols[key].render = function(data, type, row, meta){
									if((data != '')&&(API.Helper.isSet(API.Contents.Statuses,[options.clickable.plugin,data]))){
										if(API.Contents.Language[API.Contents.Statuses[options.clickable.plugin][data].name] == undefined){ console.log(API.Contents.Statuses[options.clickable.plugin][data].name); }
										var html = '<h4><span class="badge bg-'+API.Contents.Statuses[options.clickable.plugin][data].color+'">';
											html += '<i class="'+API.Contents.Statuses[options.clickable.plugin][data].icon+' mr-1"></i>';
											html += API.Contents.Language[API.Contents.Statuses[options.clickable.plugin][data].name];
										html += '</span></h4>';
										return html;
									} else {
										return data;
									}
								};
								break;
							case"priority":
								cols[key].render = function(data, type, row, meta){
									if((data != '')&&(API.Helper.isSet(API,['Contents','Priorities',options.clickable.plugin,data]))){
										var html = '<h4><span class="badge bg-'+API.Contents.Priorities[options.clickable.plugin][data].color+'">';
											html += '<i class="'+API.Contents.Priorities[options.clickable.plugin][data].icon+' mr-1"></i>';
											html += API.Contents.Language[API.Contents.Priorities[options.clickable.plugin][data].name];
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
										return '<h4><span class="badge bg-success"><i class="fas fa-check mr-1"></i>'+API.Helper.ucfirst(row.isSigned)+'</span></h4>';
									} else {
										row.isSigned = "inactive";
										return '<h4><span class="badge bg-danger"><i class="fas fa-ban mr-1"></i>'+API.Helper.ucfirst(row.isSigned)+'</span></h4>';
									}
								};
								break;
							case"isLocked":
							case"islocked":
							case"isDefault":
							case"isdefault":
								cols[key].render = function(data, type, row, meta){
									if((row[value.name])||(row[value.name] == "true")){
										return '<h4><span class="badge bg-success"><i class="fas fa-check mr-1"></i>'+API.Helper.ucfirst(row[value.name])+'</span></h4>';
									} else {
										row[value.name] = "false";
										return '<h4><span class="badge bg-danger"><i class="fas fa-ban mr-1"></i>'+API.Helper.ucfirst(row[value.name])+'</span></h4>';
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
						if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = API.Contents.SettingsLandingPage; }
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
									if((options != null)&&(API.Helper.isSet(options,['breadcrumb','title']))){ API.Helper.set(breadcrumbOpts,['breadcrumb','title'],data[options.breadcrumb.title]); }
									if(typeof options.clickable.key !== 'undefined'){
										href += '&id='+data[options.clickable.key];
										API.GUI.Breadcrumbs.add(data[options.clickable.key], href, breadcrumbOpts);
									} else {
										href += '&id='+data.id;
										API.GUI.Breadcrumbs.add(data.id, href, breadcrumbOpts);
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
									API.CRUD.read.show(tableOptions);
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
			          selectAll: API.Contents.Language["All"],
			          selectNone: API.Contents.Language["None"],
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
					if(ohref.plugin == null){ ohref.plugin = API.Contents.SettingsLandingPage; }
					if(ohref.view == null){ ohref.view = 'index'; }
					if(API.Helper.isSet(API,['Contents','Auth','Options','hide',ohref.plugin,ohref.view,'any','table',ohref.id])){
						hide = API.Contents.Auth.Options.hide[ohref.plugin][ohref.view].any.table[ohref.id];
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
						if((API.Auth.validate('button', 'hide', 1))&&(!options.controls.disable.includes('hide'))){ buttons.push({ text: '<i class="icon icon-hide mr-1"></i>'+API.Contents.Language['Hide'], action: function(){ API.CRUD.hide.show(table, { keys:inputs, id:dtid }); } }); }
						if((API.Auth.validate('button', 'filter', 1))&&(!options.controls.disable.includes('filter'))){ buttons.push({ text: '<i class="icon icon-filter mr-1"></i>'+API.Contents.Language['Filter'], action: function(){ API.CRUD.filter.show(table, { keys:inputs, id:dtid }); } }); }
						if((typeof options.controls.add !== 'undefined')&&(options.controls.add.length > 0)){
							for(var [key, value] of Object.entries(options.controls.add)){
								if((API.Auth.validate('button', value.name, 1))&&(typeof value.menu !== 'undefined')&&(value.menu == 'view')){ buttons.push({ text: value.text, action: value.action, table:table }); }
							}
						}
						dt.button().add(0,{
							extend: 'collection',
							text: API.Contents.Language['View'],
							autoClose: true,
							buttons:buttons,
						});
						buttons = [];
						if((API.Auth.validate('button', 'selectAll', 1))&&(!options.controls.disable.includes('selectAll'))){ buttons.push({ text: '<i class="icon icon-all mr-1"></i>'+API.Contents.Language['Select All'], extend: 'selectAll' }); }
						if((API.Auth.validate('button', 'selectNone', 1))&&(!options.controls.disable.includes('selectNone'))){ buttons.push({ text: '<i class="icon icon-none mr-1"></i>'+API.Contents.Language['Select None'], extend: 'selectNone' }); }
						if(typeof options.canAssign !== 'undefined'){ canAssign = options.canAssign; }
						if(canAssign){
							if((API.Auth.validate('plugin', options.plugin, 3))&&(API.Auth.validate('button', 'assign', 1))&&(!options.controls.disable.includes('assign'))){ buttons.push({ text: '<i class="icon icon-assign mr-1"></i>'+API.Contents.Language['Assign'], action: function(){ API.CRUD.assign.show(table,{plugin:options.plugin}); } }); }
							if((API.Auth.validate('plugin', options.plugin, 3))&&(API.Auth.validate('button', 'unassign', 1))&&(!options.controls.disable.includes('unassign'))){ buttons.push({ text: '<i class="icon icon-unassign mr-1"></i>'+API.Contents.Language['Unassign'], action: function(){ API.CRUD.unassign.show(table,{plugin:options.plugin}); } }); }
						}
						if(typeof options.canLock !== 'undefined'){ canLock = options.canLock; }
						if(canLock){
							if((API.Auth.validate('plugin', options.plugin, 3))&&(API.Auth.validate('button', 'lock', 1))&&(!options.controls.disable.includes('lock'))){ buttons.push({ text: '<i class="icon icon-lock mr-1"></i>'+API.Contents.Language['Lock'], action: function(){ API.CRUD.lock.show(table,{plugin:options.plugin}); } }); }
							if((API.Auth.validate('plugin', options.plugin, 3))&&(API.Auth.validate('button', 'unlock', 1))&&(!options.controls.disable.includes('unlock'))){ buttons.push({ text: '<i class="icon icon-unlock mr-1"></i>'+API.Contents.Language['Unlock'], action: function(){ API.CRUD.unlock.show(table,{plugin:options.plugin}); } }); }
						}
						if((API.Auth.validate('plugin', options.plugin, 4))&&(API.Auth.validate('button', 'delete', 1))&&(!options.controls.disable.includes('delete'))){ buttons.push({ text: '<i class="icon icon-delete mr-1"></i>'+API.Contents.Language['Delete'], action: function(){ API.CRUD.deleteAll.show(table,{plugin:options.plugin}); } }); }
						if((typeof options.controls.add !== 'undefined')&&(options.controls.add.length > 0)){
							for(var [key, value] of Object.entries(options.controls.add)){
								if((API.Auth.validate('button', value.name, 1))&&(typeof value.menu !== 'undefined')&&(value.menu == 'edit')){ buttons.push({ text: value.text, action: value.action, table:table }); }
							}
						}
						dt.button().add(0,{
							extend: 'collection',
							text: API.Contents.Language['Edit'],
							autoClose: true,
							buttons:buttons,
						});
						buttons = [];
						if((API.Auth.validate('plugin', options.plugin, 2))&&(API.Auth.validate('button', 'create', 1))&&(!options.controls.disable.includes('create'))){ buttons.push({ text: '<i class="icon icon-create mr-1"></i>'+API.Contents.Language['Create'], action: function(){ API.CRUD.create.show({ plugin:options.plugin, table:table, keys:inputs, key:options.key, set:options.set }); } }); }
						if((typeof options.controls.add !== 'undefined')&&(options.controls.add.length > 0)){
							for(var [key, value] of Object.entries(options.controls.add)){
								if((API.Auth.validate('button', value.name, 1))&&(typeof value.menu !== 'undefined')&&(value.menu == 'file')){ buttons.push({ text: value.text, action: value.action, table:table }); }
							}
						}
						if((API.Auth.validate('plugin', options.plugin, 3))&&(API.Auth.validate('button', 'import', 1))&&(!options.controls.disable.includes('import'))){
							buttons.push({ text: '<i class="icon icon-import mr-1"></i>'+API.Contents.Language['Import'], action: function(){
								if(API.Helper.isSet(options,['import','key'])){
									API.CRUD.import.show(table, { keys:inputs, id:dtid, key:options.key, import:{ key:options.import.key }, });
								} else {
									API.CRUD.import.show(table, { keys:inputs, id:dtid, key:options.key });
								}
							} });
						}
						dt.button().add(0,{
							extend: 'collection',
							text: API.Contents.Language['File'],
							autoClose: true,
							buttons:buttons,
						});
					} else {
						if((API.Auth.validate('plugin', options.plugin, 3))&&(API.Auth.validate('button', 'assign', 1))&&(!options.controls.disable.includes('assign'))){
							if((typeof options.controls.label !== 'undefined')&&(options.controls.label)){
								ctrlTxt = '<i class="icon icon-assign mr-1"></i>'+API.Contents.Language['Assign'];
							} else { ctrlTxt = '<i class="icon icon-assign"></i>'; }
							dt.button().add(0,{ text: ctrlTxt, action: function(){ API.CRUD.assign.show(table,{plugin:options.plugin}); } });
						}
						if((API.Auth.validate('plugin', options.plugin, 3))&&(API.Auth.validate('button', 'unassign', 1))&&(!options.controls.disable.includes('unassign'))){
							if((typeof options.controls.label !== 'undefined')&&(options.controls.label)){
								ctrlTxt = '<i class="icon icon-unassign mr-1"></i>'+API.Contents.Language['Unassign'];
							} else { ctrlTxt = '<i class="icon icon-unassign"></i>'; }
							dt.button().add(0,{ text: ctrlTxt, action: function(){ API.CRUD.unassign.show(table,{plugin:options.plugin}); } });
						}
						if((API.Auth.validate('plugin', options.plugin, 4))&&(API.Auth.validate('button', 'delete', 1))&&(!options.controls.disable.includes('delete'))){
							if((typeof options.controls.label !== 'undefined')&&(options.controls.label)){
								ctrlTxt = '<i class="icon icon-delete mr-1"></i>'+API.Contents.Language['Delete'];
							} else { ctrlTxt = '<i class="icon icon-delete"></i>'; }
							dt.button().add(0,{ text: ctrlTxt, action: function(){ API.CRUD.deleteAll.show(table,{plugin:options.plugin}); } });
						}
						if((API.Auth.validate('button', 'selectNone', 1))&&(!options.controls.disable.includes('selectNone'))){
							if((typeof options.controls.label !== 'undefined')&&(options.controls.label)){
								ctrlTxt = '<i class="icon icon-none mr-1"></i>'+API.Contents.Language['None'];
							} else { ctrlTxt = '<i class="icon icon-none"></i>'; }
							dt.button().add(0,{ text: ctrlTxt, extend: 'selectNone' });
						}
						if((API.Auth.validate('button', 'selectAll', 1))&&(!options.controls.disable.includes('selectAll'))){
							if((typeof options.controls.label !== 'undefined')&&(options.controls.label)){
								ctrlTxt = '<i class="icon icon-all mr-1"></i>'+API.Contents.Language['All'];
							} else { ctrlTxt = '<i class="icon icon-all"></i>'; }
							dt.button().add(0,{ text: ctrlTxt, extend: 'selectAll' });
						}
						if((API.Auth.validate('plugin', options.plugin, 3))&&(API.Auth.validate('button', 'import', 1))&&(!options.controls.disable.includes('import'))){
							if((typeof options.controls.label !== 'undefined')&&(options.controls.label)){
								ctrlTxt = '<i class="icon icon-import mr-1"></i>'+API.Contents.Language['Import'];
							} else { ctrlTxt = '<i class="icon icon-import"></i>'; }
							dt.button().add(0,{ text: ctrlTxt, action: function(){ API.CRUD.import.show(table, { keys:inputs, id:dtid, key:options.key }); } });
						}
						if((API.Auth.validate('button', 'filter', 1))&&(!options.controls.disable.includes('filter'))){
							if((typeof options.controls.label !== 'undefined')&&(options.controls.label)){
								ctrlTxt = '<i class="icon icon-filter mr-1"></i>'+API.Contents.Language['Filter'];
							} else { ctrlTxt = '<i class="icon icon-filter"></i>'; }
							dt.button().add(0,{ text: ctrlTxt, action: function(){ API.CRUD.filter.show(table, { keys:inputs, id:dtid }); } });
						}
						if((API.Auth.validate('button', 'hide', 1))&&(!options.controls.disable.includes('hide'))){
							if((typeof options.controls.label !== 'undefined')&&(options.controls.label)){
								ctrlTxt = '<i class="icon icon-hide mr-1"></i>'+API.Contents.Language['Hide'];
							} else { ctrlTxt = '<i class="icon icon-hide"></i>'; }
							dt.button().add(0,{ text: ctrlTxt, action: function(){ API.CRUD.hide.show(table, { keys:inputs, id:dtid }); } });
						}
						if((API.Auth.validate('plugin', options.plugin, 2))&&(API.Auth.validate('button', 'create', 1))&&(!options.controls.disable.includes('create'))){
							if((typeof options.controls.label !== 'undefined')&&(options.controls.label)){
								ctrlTxt = '<i class="icon icon-create mr-1"></i>'+API.Contents.Language['Create'];
							} else { ctrlTxt = '<i class="icon icon-create"></i>'; }
							dt.button().add(0,{ text: ctrlTxt, action: function(){ API.CRUD.create.show({ plugin:options.plugin, table:table, keys:inputs, key:options.key, set:options.set }); } });
						}
						if((typeof options.controls.add !== 'undefined')&&(options.controls.add.length > 0)){
							for(var [key, value] of Object.entries(options.controls.add)){
								if(API.Auth.validate('button', value.name, 1)){ dt.button().add(0,{ text: value.text, action: value.action, table:table }); }
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
									API.GUI.Breadcrumbs.add(thref, href, { key:options.key, keys:rowdata });
									tableOptions = {
										table:element,
										keys:data,
										key:options.key,
										href:href,
									};
									if(typeof options.load !== 'undefined'){ tableOptions.load = options.load; }
									if(typeof options.modal !== 'undefined'){ tableOptions.modal = options.modal; }
									if(typeof options.modalWidth !== 'undefined'){ tableOptions.modalWidth = options.modalWidth; }
									API.CRUD.read.show(tableOptions);
									break;
								case"Edit":
									API.CRUD.update.show({ table:table, row:$(this).parents('tr'), keys:rowdata, key:options.key, modal:options.modal, plugin:options.plugin });
									break;
								case"Delete":
									API.CRUD.delete.show({ table:table, row:$(this).parents('tr'), keys:rowdata, key:options.key, modal:options.modal, plugin:options.plugin });
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
				if((API.Helper.isSet(API,['Contents','Auth','User']))&&(typeof API.Contents.Language !== 'undefined')){
					clearInterval(checkExist);
					// Insert modal in DOM
					var html = '';
					++API.Builder.counts.modal;
					html += '<div id="modal_'+API.Builder.counts.modal+'" class="modal fade '+options.css.modal+'" tabindex="-1" aria-modal="true" role="dialog" aria-hidden="true"	>';
						html += '<div class="modal-dialog '+options.css.dialog+'">';
			        html += '<div class="modal-content">';
								html += '<div class="modal-header '+options.css.header+'">';
			            html += '<h4 class="modal-title"><i class="icon icon-'+options.icon+' mr-1"></i>'+API.Contents.Language[options.title]+'</h4>';
									if(typeof API.Contents.Language[options.title] === 'undefined'){ console.log(options.title); }
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
			            html += '<button type="button" class="btn btn-default" data-dismiss="modal"><i class="icon icon-cancel mr-1"></i>'+API.Contents.Language['Cancel']+'</button>';
			          html += '</div>';
			        html += '</div>';
			      html += '</div>';
			    html += '</div>';
					if((typeof options.zindex !== 'undefined')&&(options.zindex == "top")){
						element.append(html);
						var modal = element.find('#modal_'+API.Builder.counts.modal);
					} else if((typeof options.after !== 'undefined')&&(typeof options.after.after !== 'undefined')) {
						console.log(options.after);
						options.after.after(html);
						var modal = options.after.parent().find('#modal_'+API.Builder.counts.modal);
					} else if((typeof options.before !== 'undefined')&&(typeof options.before.before !== 'undefined')) {
						console.log(options.before);
						options.before.before(html);
						var modal = options.after.parent().find('#modal_'+API.Builder.counts.modal);
					} else {
						element.prepend(html);
						var modal = element.find('#modal_'+API.Builder.counts.modal);
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
									API.CRUD.hide.show(form, { keys:keys, id:formid });
									break;
								case"update":
									var keys = {}, key = '', plugin = null;
									modal.find('[data-plugin][data-key]').each(function(){
										if(plugin == null){ plugin = $(this).attr('data-plugin'); }
										if($(this).attr('data-plugin') == plugin){ key = $(this).attr('data-key'); keys[key] = $(this).text(); }
									});
									API.CRUD.update.show({ container:element, keys:keys });
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
				if((API.Helper.isSet(API,['Contents','Auth','User']))&&(typeof API.Contents.Language !== 'undefined')){
					clearInterval(checkExist);
					// Insert modal in DOM
					++API.Builder.counts.form;
					element.wrap('<form id="form_'+API.Builder.counts.form+'"></form>');
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
						API.Builder.input(formCTN, key, value,{plugin:options.plugin}, function(input){
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
			++API.Builder.counts.input;
			var title = API.Helper.ucfirst(API.Helper.clean(index));
			if(typeof API.Contents.Language[title] === 'undefined'){ console.log(title); }
			title = API.Contents.Language[title];
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
						if(API.Helper.isSet(options,['list',index])){
							inputForm += '<div class="input-group" data-key="'+index+'">';
								inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
								inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(options.list[index])){
									if(val == value){ inputForm += '<option value="'+val+'" selected="selected">'+API.Helper.ucfirst(API.Helper.clean(val))+'</option>'; } else { inputForm += '<option value="'+val+'">'+API.Helper.ucfirst(API.Helper.clean(val))+'</option>'; }
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
							$.each(API.Contents.Countries, function(key, val){
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
							$.each(API.Contents.Statuses[plugin], function(key, val){
								if(key == value){ inputForm += '<option value="'+key+'" selected="selected">'+API.Contents.Statuses[plugin][key].name+'</option>'; } else { inputForm += '<option value="'+key+'">'+API.Contents.Statuses[plugin][key].name+'</option>'; }
							});
							inputForm += '</select>';
						inputForm += '</div>';
						inputReady = true;
						break;
					case "priority":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
							$.each(API.Contents.Priorities[plugin], function(key, val){
								if(key == value){ inputForm += '<option value="'+key+'" selected="selected">'+API.Contents.Priorities[plugin][key].name+'</option>'; } else { inputForm += '<option value="'+key+'">'+API.Contents.Priorities[plugin][key].name+'</option>'; }
							});
							inputForm += '</select>';
						inputForm += '</div>';
						inputReady = true;
						break;
					case "state":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
							$.each(API.Contents.States, function(key, val){
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
							if(API.Helper.isSet(API,['Contents','data','dom','users'])){
								inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(API.Contents.data.dom.users)){
									if(val.username == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.username+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.username+'</option>'; }
								};
								inputForm += '</select>';
								inputForm += '</div>';
								inputReady = true;
							} else {
								API.request('users','read',function(result){
									var dataset = JSON.parse(result);
									for(var [key, val] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','dom','users',val.username],val); }
									for(var [key, val] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','users',val.id],val); }
									inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
									for(var [key, val] of Object.entries(API.Contents.data.dom.users)){
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
							if(API.Helper.isSet(API,['Contents','data','dom','organizations'])){
								inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(API.Contents.data.dom.organizations)){
									if(val.name == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.name+'</option>'; }
								};
								inputForm += '</select>';
								inputForm += '</div>';
								inputReady = true;
							} else {
								API.request('organizations','read',function(result){
									var dataset = JSON.parse(result);
									for(var [key, val] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','dom','organizations',val.id],val); }
									for(var [key, val] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','organizations',val.id],val); }
									inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
									for(var [key, val] of Object.entries(API.Contents.data.dom.organizations)){
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
							if(API.Helper.isSet(API,['Contents','data','dom','groups'])){
								inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(API.Contents.data.dom.groups)){
									if(val.name == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.name+'</option>'; }
								};
								inputForm += '</select>';
								inputForm += '</div>';
								inputReady = true;
							} else {
								API.request('groups','read',function(result){
									var dataset = JSON.parse(result);
									for(var [key, val] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','dom','groups',val.name],val); }
									for(var [key, val] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','groups',val.id],val); }
									inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
									for(var [key, val] of Object.entries(API.Contents.data.dom.groups)){
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
							if(API.Helper.isSet(API,['Contents','data','form',plugin,view,index])){
								inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(API.Contents.data.form[plugin][view][index])){
									if(key == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.name+'</option>'; }
								};
								inputForm += '</select>';
								inputForm += '</div>';
								inputReady = true;
							} else {
								API.request('organizations','read',function(result){
									var dataset = JSON.parse(result);
									for(var [key, val] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','form',plugin,view,index,val.name],val); }
									for(var [key, val] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','form',plugin,view,index,val.name],val); }
									inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
									for(var [key, val] of Object.entries(API.Contents.data.form[plugin][view][index])){
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
							if(API.Helper.isSet(options,['list','contacts'])){
								inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(options.list.contacts)){
									if(key == value){ inputForm += '<option value="'+key+'" selected="selected">'+val+'</option>'; } else { inputForm += '<option value="'+key+'">'+val+'</option>'; }
								};
								inputForm += '</select>';
								inputForm += '</div>';
								inputReady = true;
							} else {
								if(typeof API.Contents.data.dom.contacts !== 'undefined'){
									inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
									for(var [key, val] of Object.entries(API.Contents.data.dom.contacts)){
										if(key == value){ inputForm += '<option value="'+val.id+'" data-client="'+val.link_to+'" selected="selected">'+val.first_name+' '+val.last_name+'</option>'; } else { inputForm += '<option value="'+val.id+'" data-client="'+val.link_to+'">'+val.first_name+' '+val.last_name+'</option>'; }
									};
									inputForm += '</select>';
									inputForm += '</div>';
									inputReady = true;
								} else {
									API.request('contacts','read',function(result){
										var dataset = JSON.parse(result);
										for(var [key, val] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','dom','clients',val.id],val); }
										for(var [key, val] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','clients',val.id],val); }
										inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
										for(var [key, val] of Object.entries(API.Contents.data.dom.contacts)){
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
						API.request('ports','read',function(result){
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
						API.request('carriers','read',function(result){
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
						API.request('customs_offices','read',function(result){
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
						API.request('sub_locations','read',function(result){
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
							if(typeof API.Contents.data.dom.categories !== 'undefined'){
								inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(API.Contents.data.dom.categories)){
									if(plugin == val.relationship){
										if(key == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.name+'</option>'; }
									}
								};
								inputForm += '</select>';
								inputForm += '</div>';
								inputReady = true;
							} else {
								API.request('categories','read',function(result){
									var dataset = JSON.parse(result);
									inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
									for(var [key, val] of Object.entries(dataset.output.results)){
										API.Helper.set(API.Contents,['data','dom','clients',val.id],val);
										if(plugin == val.relationship){
											if(key == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.name+'</option>'; }
										}
									}
									for(var [key, val] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','clients',val.id],val); }
									inputForm += '</select>';
									inputForm += '</div>';
									inputReady = true;
								});
							}
						break;
					case "sub_category":
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							if(typeof API.Contents.data.dom.sub_categories !== 'undefined'){
								inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(API.Contents.data.dom.sub_categories)){
									if(plugin == val.relationship){
										if(key == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.name+'</option>'; }
									}
								};
								inputForm += '</select>';
								inputForm += '</div>';
								inputReady = true;
							} else {
								API.request('sub_categories','read',function(result){
									var dataset = JSON.parse(result);
									inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
									for(var [key, val] of Object.entries(dataset.output.results)){
										API.Helper.set(API.Contents,['data','dom','clients',val.id],val);
										if(plugin == val.relationship){
											if(key == value){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.name+'</option>'; }
										}
									}
									for(var [key, val] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','clients',val.id],val); }
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
							$.each(API.Contents.Plugins, function(key, val){
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
							$.each(API.Contents.Jobs, function(key, val){
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
							if(typeof API.Contents.data.dom.issues !== 'undefined'){
								inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(API.Contents.data.dom.issues)){
									if(typeof val.name === 'undefined'){ val.name = ''; }
									if((value.split(';').includes(val.id.toString()))||(val.default == 'on')){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.id+' - '+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.id+' - '+val.name+'</option>'; }
								};
								inputForm += '</select>';
								inputForm += '</div>';
								inputReady = true;
							} else {
								API.request('issues','read',function(result){
									var dataset = JSON.parse(result);
									for(var [key, val] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','dom','issues',val.id],val); }
									for(var [key, val] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','issues',val.id],val); }
									inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
									for(var [key, val] of Object.entries(API.Contents.data.dom.issues)){
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
							if(typeof API.Contents.data.dom.services !== 'undefined'){
								inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(API.Contents.data.dom.services)){
									if(typeof val.name === 'undefined'){ val.name = ''; }
									if((value.split(';').includes(val.id.toString()))||(val.default == 'on')){ inputForm += '<option value="'+val.id+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.id+'">'+val.name+'</option>'; }
								};
								inputForm += '</select>';
								inputForm += '</div>';
								inputReady = true;
							} else {
								API.request('services','read',function(result){
									var dataset = JSON.parse(result);
									for(var [key, val] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','dom','services',val.id],val); }
									for(var [key, val] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','services',val.id],val); }
									inputForm += '<select data-key="'+index+'" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
									for(var [key, val] of Object.entries(API.Contents.data.dom.services)){
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
						inputForm += '<div class="input-group" data-key="'+index+'">';
							inputForm += '<div class="input-group-prepend"><span class="input-group-text"><i class="'+icon+' mr-1"></i>'+title+'</span></div>';
							if(typeof API.Contents.data.dom.tags !== 'undefined'){
								inputForm += '<select data-key="'+index+'" multiple="" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
								for(var [key, val] of Object.entries(API.Contents.data.dom.tags)){
									if(val.name != ''){
										if(value.split(';').includes(val.name)){ inputForm += '<option value="'+val.name+'" selected="selected">'+val.name+'</option>'; } else { inputForm += '<option value="'+val.name+'">'+val.name+'</option>'; }
									}
								};
								inputForm += '</select>';
								inputForm += '</div>';
								inputReady = true;
							} else {
								API.request('tags','read',function(result){
									var dataset = JSON.parse(result);
									for(var [key, val] of Object.entries(dataset.output.results)){ API.Helper.set(API.Contents,['data','dom','tags',val.name],val); }
									for(var [key, val] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','tags',val.name],val); }
									inputForm += '<select data-key="'+index+'" multiple="" title="'+title+'" class="form-control select2bs4 select2-hidden-accessible" name="'+index+'">';
									if(typeof API.Contents.data.dom.tags !== 'undefined'){
										for(var [key, val] of Object.entries(API.Contents.data.dom.tags)){
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
							inputForm += '<input type="password" class="form-control" data-key="'+index+'2" name="'+index+'2" placeholder="'+API.Contents.Language['Confirm password']+'" title="'+API.Contents.Language['Confirm password']+'">';
							if(typeof API.Contents.Language['Confirm password'] === 'undefined'){ console.log('Confirm password'); }
						inputForm += '</div>';
						inputReady = true;
						break;
					case "time":
						inputForm += '<div class="timepicker" style="width:100%" id="'+API.Builder.counts.input+index+'" data-target-input="nearest" data-target="#'+API.Builder.counts.input+index+'" data-toggle="datetimepicker">';
							inputForm += '<div class="input-group date">';
								inputForm += '<div class="input-group-prepend">';
									inputForm += '<span class="input-group-text">';
										inputForm += '<i class="icon icon-time mr-2"></i>'+API.Helper.ucfirst(API.Contents.Language[index]);
									inputForm += '</span>';
								inputForm += '</div>';
								inputForm += '<input type="text" class="form-control datetimepicker-input" data-key="'+index+'" data-target="#'+API.Builder.counts.input+index+'" name="'+index+'" value="'+value+'" placeholder="'+API.Helper.ucfirst(API.Contents.Language[index])+'">';
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
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = API.Contents.SettingsLandingPage; }
				if(url.searchParams.get("v") != undefined){ var view = url.searchParams.get("v"); } else { var view = 'index'; }
				switch($(element).prop("tagName")){
					case"TABLE":
						var type = 'table';
						break;
					case"FORM":
						var type = 'form';
						break;
				}
				if(API.Helper.isSet(API,['Contents','Auth','Options','hide',plugin,view,'any',type,id])){
					hide = API.Contents.Auth.Options.hide[plugin][view].any[type][id];
				} else { hide = {}; }
				if((options != null)&&(options instanceof Function)){ callback = options; options = {}; }
				if(typeof options.hide === 'undefined'){ options.hide = hide; }
				if(typeof options.keys === 'undefined'){ options.keys = {}; }
				if(typeof options.plugin === 'undefined'){ options.plugin = plugin; }
				if(typeof options.view === 'undefined'){ options.view = view; }
				if(typeof options.css === 'undefined'){ options.css = {}; }
				if(typeof options.css.table === 'undefined'){ options.css.table = 'table-hover table-bordered'; }
				if(typeof options.css.thead === 'undefined'){ options.css.thead = 'thead-dark'; }
				API.Builder.modal($('body'), {
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
					footer.append('<button type="submit" class="btn btn-info"><i class="icon icon-hide mr-1"></i>'+API.Contents.Language['Hide']+'</button>');
					API.Builder.form(modal,{},function(form){
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
									selectAll: API.Contents.Language["All"],
									selectNone: API.Contents.Language["None"],
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
								if(!API.Helper.isSet(API.Contents.Language,[API.Helper.ucfirst(API.Helper.clean(key))])){ console.log(API.Helper.ucfirst(API.Helper.clean(key))); }
								if(hide.includes(key)){
									var row = table.DataTable().row.add({ key:key, column:API.Contents.Language[API.Helper.ucfirst(API.Helper.clean(key))] }).select().draw(false);
								} else {
									var row = table.DataTable().row.add({ key:key, column:API.Contents.Language[API.Helper.ucfirst(API.Helper.clean(key))] }).draw(false);
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
							if(API.Helper.isSet(API,['Contents','Auth','Options','hide',plugin,view,'any',tr,id])){
								API.Helper.set(API.Contents,['Auth','Options','hide',plugin,view,'any',tr,id],{});
							}
							table.DataTable().rows( { selected: true } ).every(function(){
								var key = this.data().key;
								records.push({
									name:key,
									type:'hide',
									relationship:tr,
									link_to:id,
									user:API.Contents.Auth.User.id,
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
							API.request('options','update',{
								data:{records:records,type:'hide',plugin:plugin,view:view,link_to:id,record:'any'},
							},function(result){
								var dataset = JSON.parse(result);
								if(typeof dataset.success !== 'undefined'){
									for(var [key, value] of Object.entries(dataset.output.results)){
										API.Helper.set(API.Contents,['Auth','Options','hide',value.plugin,value.view,value.record,value.relationship,value.link_to,value.name],null);
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
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = API.Contents.SettingsLandingPage; }
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
				API.Builder.modal($('body'), {
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
					footer.append('<button type="submit" class="btn btn-warning"><i class="icon icon-filter mr-1"></i>'+API.Contents.Language['Filter']+'</button>');
					API.Builder.form(modal,{},function(form){
						modal.on('hide.bs.modal',function(){ form.remove(); });
						var cols = [], input = '', title = '';
						cols.push({ name: "select", title: "", data: "select", width: "25px", defaultContent: '', targets: 0, orderable: false, className: 'select-checkbox'});
						cols.push({ name: "Key", title: "Key", data: "key", defaultContent: '', targets: 1 });
						body.addClass('pb-2');
						body.html('');
						for(var [key, value] of Object.entries(options.keys)){
							title = API.Contents.Language[API.Helper.ucfirst(API.Helper.clean(key))];
							if(API.Helper.isSet(API,['Contents','Auth','Options','filter',plugin,view,'any',id,key])){
								input = '<div class="input-group row pl-2 pt-2">';
								input += '<div class="input-group-prepend col-4 pr-0"><span class="input-group-text" style="width:100%;"><i class="icon icon-'+key+' mr-1"></i>'+title+'</span></div>';
								input += '<select data-key="'+key+'" class="form-control select2bs4 select2-hidden-accessible col-4" name="relationship">';
								input += '<option value="none">'+API.Contents.Language['None']+'</option>';
								if(API.Contents.Auth.Options.filter[plugin][view].any[id][key].relationship == 'like'){
									input += '<option value="like" selected="selected">'+API.Contents.Language['Like']+'</option>';
								} else {
									input += '<option value="like">'+API.Contents.Language['Like']+'</option>';
								}
								if(API.Contents.Auth.Options.filter[plugin][view].any[id][key].relationship == 'unlike'){
									input += '<option value="unlike" selected="selected">'+API.Contents.Language['Unlike']+'</option>';
								} else {
									input += '<option value="unlike">'+API.Contents.Language['Unlike']+'</option>';
								}
								if(API.Contents.Auth.Options.filter[plugin][view].any[id][key].relationship == 'equal'){
									input += '<option value="equal" selected="selected">'+API.Contents.Language['Equal']+'</option>';
								} else {
									input += '<option value="equal">'+API.Contents.Language['Equal']+'</option>';
								}
								if(API.Contents.Auth.Options.filter[plugin][view].any[id][key].relationship == 'greater'){
									input += '<option value="greater" selected="selected">'+API.Contents.Language['Greater']+'</option>';
								} else {
									input += '<option value="greater">'+API.Contents.Language['Greater']+'</option>';
								}
								if(API.Contents.Auth.Options.filter[plugin][view].any[id][key].relationship == 'smaller'){
									input += '<option value="smaller" selected="selected">'+API.Contents.Language['Smaller']+'</option>';
								} else {
									input += '<option value="smaller">'+API.Contents.Language['Smaller']+'</option>';
								}
								input += '</select>';
								input += '<input type="text" class="form-control col-4" data-key="'+key+'" name="value" value="'+API.Contents.Auth.Options.filter[plugin][view].any[id][key].value+'" placeholder="'+title+'">';
								input += '</div>';
							} else {
								input = '<div class="input-group row pl-2 pt-2">';
								input += '<div class="input-group-prepend col-4 pr-0"><span class="input-group-text" style="width:100%;"><i class="icon icon-'+key+' mr-1"></i>'+title+'</span></div>';
								input += '<select data-key="'+key+'" class="form-control select2bs4 select2-hidden-accessible col-4" name="relationship">';
								input += '<option value="none">'+API.Contents.Language['None']+'</option>';
								input += '<option value="like">'+API.Contents.Language['Like']+'</option>';
								input += '<option value="unlike">'+API.Contents.Language['Unlike']+'</option>';
								input += '<option value="equal">'+API.Contents.Language['Equal']+'</option>';
								input += '<option value="greater">'+API.Contents.Language['Greater']+'</option>';
								input += '<option value="smaller">'+API.Contents.Language['Smaller']+'</option>';
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
										user:API.Contents.Auth.User.id,
										plugin:plugin,
										view:view,
										record:'any',
									});
								}
							});
							API.request('options','update',{
								data:{records:records,type:'filter',plugin:plugin,view:view,link_to:id,record:'any'},
							},function(result){
								var dataset = JSON.parse(result);
								if(typeof dataset.success !== 'undefined'){
									if(API.Helper.isSet(API,['Contents','Auth','Options','filter',plugin,view,'any',id])){
										API.Helper.set(API.Contents,['Auth','Options','filter',plugin,view,'any',id],{});
									}
									if(dataset.output.results.length > 0){
										var results = dataset.output.results;
										for(var [key, value] of Object.entries(results)){
											API.Helper.set(API.Contents,['Auth','Options','filter',value.plugin,value.view,value.record,value.link_to,value.name],{ value:value.value, relationship:value.relationship });
										}
									}
									API.CRUD.filter.element.modal.modal('hide');
									if(callback != undefined){ callback(element); }
								}
							});
						});
						modal.modal('show');
					});
				});
			},
		},
		import:{
			element:{
				modal:{},
				form:{},
			},
			show:function(element, options = null, callback = null){
				var url = new URL(window.location.href);
				if(typeof options.id !== 'undefined'){ var id = options.id; } else { var id = element.attr('id'); }
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = API.Contents.SettingsLandingPage; }
				if(url.searchParams.get("v") != undefined){ var view = url.searchParams.get("v"); } else { var view = 'index'; }
				if(options instanceof Function){ callback = options; options = {}; }
				if(typeof options.keys === 'undefined'){ options.keys = {}; }
				if(typeof options.plugin === 'undefined'){ options.plugin = plugin; }
				if(typeof options.view === 'undefined'){ options.view = view; }
				if(typeof options.css === 'undefined'){ options.css = {} }
				if(typeof options.css.table === 'undefined'){ options.css.table = 'table-hover table-bordered'; }
				if(typeof options.css.thead === 'undefined'){ options.css.thead = 'thead-dark'; }
				API.Builder.modal($('body'), {
					title:'Import',
					icon:'import',
					zindex:'top',
					css:{ dialog: "modal-lg", header: "bg-primary"},
				}, function(modal){
					var html = '';
					var header = modal.find('.modal-header');
					var body = modal.find('.modal-body');
					var footer = modal.find('.modal-footer');
					header.find('button[data-control="hide"]').remove();
					header.find('button[data-control="update"]').remove();
					body.addClass('p-2');
					html += '<divc class="col-12">';
						html += '<div class="input-group">';
							html += '<div class="input-group-prepend">';
								html += '<span class="input-group-text">';
									html += '<i class="fas fa-file-csv mr-2"></i>';
									html += API.Contents.Language['CSV File'];
								html += '</span>';
							html += '</div>';
							html += '<div class="custom-file">';
								html += '<input type="file" class="custom-file-input" name="fileCSV" id="fileCSV">';
								html += '<label class="custom-file-label" for="fileCSV">';
									html += API.Contents.Language['Choose file'];
								html += '</label>';
							html += '</div>';
						html += '</div>';
					html += '</div>';
					html += '<div id="ImportSettings"></div>';
					body.html(html);
					html = '';
					footer.append('<button type="submit" class="btn btn-primary"><i class="icon icon-import mr-1"></i>'+API.Contents.Language['Import']+'</button>');
					API.Builder.form(modal,{},function(form){
						modal.on('hide.bs.modal',function(){ form.remove(); });
						var settings = $('#ImportSettings'), file = $('#fileCSV');
						var readFile = function(){
							html = '<div id="ImportCustomize">';
								html += '<div id="ImportAdvancedSettings" class="row mt-3 mx-2" style="display:none;"></div>';
								html += '<button type="button" class="btn btn-primary btn-block mt-3">';
									html += '<i class="fas fa-cogs mr-1"></i>';
									html += API.Contents.Language['Advanced'];
								html += '</button>';
							html += '</div>';
							settings.html(html);
							var advanced = $('#ImportAdvancedSettings'), reader = new FileReader();
							$('#ImportCustomize button').click(function(){ advanced.slideToggle(); });
							reader.onload = function(){
								frow = reader.result.split(/\n/)[0].split(/,/);
								srow = reader.result.split(/\n/)[1].split(/,/);
								html = '<div class="col-12"><h4>';
									html += API.Contents.Language['Advanced settings'];
								html += '</h4></div>';
								html += '<div class="col-12">';
									html += '<div class="row border-bottom border-dark mb-1">';
										html += '<div class="col-4"><strong>'+API.Contents.Language['Column']+'</strong></div>';
										html += '<div class="col-4"><strong>'+API.Contents.Language['Associate to']+'</strong></div>';
										html += '<div class="col-4"><strong>'+API.Contents.Language['Options']+'</strong></div>';
									html += '</div>';
								html += '</div>';
								$.each(frow, function(index, value){
									html += '<div class="form-group col-12 my-1">';
										html += '<div class="input-group">';
											html += '<div class="input-group-prepend col-4 p-0">';
												html += '<span class="input-group-text w-100">';
													html += '<i class="fas fa-i-cursor mr-2"></i>';
													html += value+' : '+srow[index];
												html += '</span>';
											html += '</div>';
											html += '<select data-key="'+index+'" data-type="header" class="col-4">';
												$.each(API.Contents.Settings.Structure[options.plugin], function(column, object){
													if(typeof API.Contents.Language[column] === "undefined"){ console.log(column); }
													if(object.order == index+1){
														html += '<option value="'+column+'" selected="selected">'+API.Contents.Language[column]+'</option>';
													} else {
														html += '<option value="'+column+'">'+API.Contents.Language[column]+'</option>';
													}
												});
											html += '</select>';
											html += '<select data-key="'+index+'" data-type="options" class="col-4">';
												html += '<option value="None">None</option>';
												html += '<option value="Skip">Skip</option>';
												html += '<option value="Exist">Must not exist</option>';
												html += '<option value="Update">Update if exist</option>';
											html += '</select>';
										html += '</div>';
									html += '</div>';
								});
								advanced.html(html);
							};
							reader.readAsBinaryString(file[0].files[0]);
						};
						file.change(readFile);
						form.off();
						form.submit(function(action){
							action.preventDefault();
							var records = [];
							var reader = new FileReader(), rows = null, opts = [], headers = [], data = {}, stat = true, ct = 0, readystate = false, executed = 0;
							reader.onload = function (){
								rows = reader.result.split(/\n/);
								$('#ImportAdvancedSettings [data-type="header"]').each(function(){
									headers.push($(this).val());
								});
								$('#ImportAdvancedSettings [data-type="options"]').each(function(){
									opts.push($(this).val());
								});
								modal.modal('hide');
								API.GUI.Navbar.Task.add({
										title:API.Contents.Language['Importing']+' '+API.Helper.ucfirst(options.plugin),
										value:0,
										max:(rows.length -2),
										plugin:options.plugin,
										extra:''
								},function(opt,task,divider){
									var count = (rows.length -2);
									var id = task.attr('data-task');
									var message = '<p style="font-size: 18px; color: #2d2d2d line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;">'+API.Contents.Auth.User.username+API.Contents.Language[' is reporting']+'</p>';
									$.each(rows, function(key, value){
										if((value.split(/,/).length == headers.length)&&(key != 0)){
											data = { values: value.split(/,/), headers: headers, options: opts }
											API.request(options.plugin,'import', {
												data:data,
												toast:false,
												report:true,
											},function(result){
												if(result.charAt(0) == '{'){
													var dataset = JSON.parse(result);
													if(typeof dataset.error !== 'undefined'){ stat = false; } else {
														if(API.Helper.isSet(options,['import','key'])){ var reckey = options.import.key; } else { var reckey = 'id'; }
														API.Helper.set(API.Contents,['data','dom',options.plugin,dataset.output.record[reckey]],dataset.output.record);
														API.Helper.set(API.Contents,['data','raw',options.plugin,dataset.output.record[reckey]],dataset.output.raw);
														if(element.DataTable().row('#'+dataset.output.record.id).data() == undefined){
															element.DataTable().row.add(dataset.output.record).node().id = dataset.output.record.id;
														} else {
															element.DataTable().row('#'+dataset.output.record.id).data(dataset.output.record);
														}
														element.DataTable().draw(false);
													}
													++ct;
													API.GUI.Navbar.Task.update(id, ct);
												} else {
													message += '<p style="font-size: 12px; color: #6c6c6c line-height: 1.5; word-break: break-word; text-align: justify; mso-line-height-alt: 18px; margin: 0;">'+result.replace(/\n/g, "<br />")+'</p>'
													var report = task.find('div.row').last().find('span.float-left');
													if(!task.hasClass('bg-light-danger')){ task.addClass('bg-light-danger'); }
													report.html('<a class="badge bg-danger px-2"><i class="icon icon-report mr-1"></i>'+API.Contents.Language['Report']+'</a>');
													report.find('a').off();
													report.find('a').click(function(){
														API.request('smtp','send',{
															data:{
																email:API.Contents.Settings.Contacts.reporting,
																message:message,
															}
														});
													});
												}
												if(ct == (rows.length -2)){ readystate = true; }
												++executed;
											});
										}
									});
									var checkExist = setInterval(function() {
										if(executed == count){
											clearInterval(checkExist);
											if(readystate){
												if(stat){
													API.Toast.show.fire({ type: 'success', text: API.Contents.Language['Records successfully imported'] });
												} else {
													API.Toast.show.fire({ type: 'error', text: API.Contents.Language['Unable to complete the request'] });
												}
												element.find('button').each(function(){
													var control = $(this).attr('data-control');
													var rowdata = element.DataTable().row($(this).parents('tr')).data();
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
																API.GUI.Breadcrumbs.add(thref, href, { key:options.key, keys:rowdata });
																if((typeof options.modal !== 'undefined')&&(options.modal)){
																	API.CRUD.read.show({ table:element, keys:rowdata, key:options.key, href:href });
																} else {
																	API.GUI.load($('#ContentFrame'),href, { keys:rowdata });
																}
																break;
															case"Edit":
																API.CRUD.update.show({ table:element, row:$(this).parents('tr'), keys:rowdata, key:options.key });
																break;
															default:
																if((typeof API.CRUD[lcontrol] !== 'undefined')&&(typeof API.CRUD[lcontrol].show !== 'undefined')){
																	API.CRUD[lcontrol].show({ table:element, row:$(this).parents('tr'), keys:rowdata, key:options.key });
																} else {
																	API.GUI.Breadcrumbs.add(thref, href, { key:options.key, keys:rowdata });
																	API.GUI.load($('#ContentFrame'),href, { keys:rowdata });
																}
																break;
														}
													});
												});
											}
											if(callback != undefined){ callback(element); }
										}
									}, 100);
								});
								$('#ImportAdvancedSettings').html(html);
					    };
							reader.readAsBinaryString(file[0].files[0]);
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
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = API.Contents.SettingsLandingPage; }
				if(url.searchParams.get("v") != undefined){ var view = url.searchParams.get("v"); } else { var view = 'index'; }
				if((options != null)&&(options instanceof Function)){ callback = options; options = {}; }
				if(typeof options.hide === 'undefined'){ options.hide = {} }
				if(typeof options.keys === 'undefined'){ options.keys = {} }
				if(typeof options.set === 'undefined'){ options.set = {} }
				if(typeof options.data === 'undefined'){ options.data = {} }
				if(typeof options.plugin === 'undefined'){ options.plugin = plugin }
				API.Builder.modal($('body'), {
					title:'Create',
					icon:'create',
					zindex:'top',
					css:{ dialog: "modal-lg", header: "bg-success"},
				}, function(modal){
					var header = modal.find('.modal-header');
					var body = modal.find('.modal-body');
					var footer = modal.find('.modal-footer');
					header.find('[data-control="update"]').remove();
					footer.append('<button type="submit" class="btn btn-success"><i class="icon icon-create mr-1"></i>'+API.Contents.Language['Create']+'</button>');
					API.Builder.form(modal,{},function(form){
						modal.on('hide.bs.modal',function(){ form.remove(); });
						if((jQuery.isEmptyObject(options.hide))
							&&(API.Helper.isSet(API,['Contents','Auth','Options','hide',options.plugin,view,'any','form',form.attr('id')]))){
								options.hide = API.Contents.Auth.Options.hide[options.plugin][view].any.form[form.attr('id')];
						}
						var skip = ['id','created','modified','owner','updated_by'];
						if(API.Helper.isSet(API.Plugins,[options.plugin,'options','create','skip'])){
							for (var [key, value] of Object.entries(API.Plugins[options.plugin].options.create.skip)) {
								if(!skip.includes(value)){ skip.push(value); }
							}
						}
						body.html('');
						if(API.Helper.isSet(API.Plugins,[options.plugin,'forms','create'])){
							var fieldCount = 0, count = 0;
							for (var [key, value] of Object.entries(API.Plugins[options.plugin].forms.create)) {
								if(jQuery.type(value) === "string"){ ++fieldCount; }
							}
							body.append('<div class="col-md-12 p-2"><div class="row"></div></div>');
							for(var [key, value] of Object.entries(API.Plugins[options.plugin].forms.create)){
								var val = '';
								if(typeof options.set[value] !== 'undefined'){ val = options.set[value]; }
								if(!jQuery.isPlainObject(value)){
									API.Builder.input(body.find('.col-md-12').first().find('.row'), value, val,{plugin:options.plugin}, function(input){
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
										if((fieldCount <= 2)||((fieldCount == count)&&(API.Helper.isOdd(count)))){
											input.wrap('<div class="col-md-12 p-2"></div>');
										} else { input.wrap('<div class="col-md-6 p-2"></div>'); }
										for(var [key, value] of Object.entries(options.hide)){
											form.find('[data-key="'+key+'"]').parent().parent().hide();
										}
									});
								} else {
									API.Builder.card(body,{
										title: API.Helper.ucfirst(API.Helper.clean(key)),
										icon: key,
										css:"card-secondary",
										extra: key,
									},function(card){
										var key = card.attr('data-extra');
										var value = API.Plugins[options.plugin].forms.create[key];
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
												API.Builder.input(card.find('.card-body').find('.row'), subvalue, val,{plugin:options.plugin}, function(input){
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
													if((subfieldCount <= 2)||((subfieldCount == subcount)&&(API.Helper.isOdd(subcount)))){
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
									API.Builder.input(body, key, val,{plugin:options.plugin}, function(input){
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
										if((fieldCount <= 2)||((fieldCount == count)&&(API.Helper.isOdd(count)))){
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
								API.GUI.Navbar.Task.add({
									title:API.Contents.Language['Creating']+' '+API.Helper.ucfirst(options.plugin),
									value:0,
									max:1,
									plugin:options.plugin,
									extra:''
									},function(opt,task,divider){
										modal.modal('hide');
										form.trigger("reset");
										console.log(record);
										console.log(options.plugin);
										API.request(options.plugin,'create',{data:record,report:true},function(result){
											if(result.charAt(0) == '{'){
												console.log(result);
												var dataset = JSON.parse(result);
												if(typeof dataset.success !== 'undefined'){
													console.log(dataset);
													if((API.Helper.isSet(record,['job_title']))&&(!API.Contents.Jobs.includes(record.job_title))){
														API.Contents.Jobs.push(record.job_title);
													}
													if(API.Helper.isSet(record,['tags'])){
														var tagID = 0;
														for(var [tag, details] of Object.entries(API.Contents.data.dom.tags)){ tagID = details.id; }
														for(var [tag, details] of Object.entries(record.tags)){
															if(!API.Helper.isSet(API.Contents.data.dom.tags,[details.name])){
																++tagID;
																API.Helper.set(API.Contents.data.dom.tags,[details.name],{
																	id:tagID,
																	created:dataset.output.results.created,
																	modified:dataset.output.results.modified,
																	owner:dataset.output.results.owner,
																	updated_by:dataset.output.results.updated_by,
																	name:details.name
																});
															}
														}
													}
													if(typeof options.table !== 'undefined'){
														var row = options.table.DataTable().row.add(dataset.output.results).draw(false);
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
																		API.GUI.Breadcrumbs.add(thref, href, { key:options.key, keys:rowdata });
																		if((typeof options.modal !== 'undefined')&&(options.modal)){
																			API.CRUD.read.show({ table:element, keys:rowdata, key:options.key, href:href });
																		} else {
																			API.GUI.load($('#ContentFrame'),href, { keys:rowdata });
																		}
																		break;
																	case"Edit":
																		API.CRUD.update.show({ table:options.table, row:$(this).parents('tr'), keys:rowdata, key:options.key });
																		break;
																	default:
																		if((typeof API.CRUD[lcontrol] !== 'undefined')&&(typeof API.CRUD[lcontrol].show !== 'undefined')){
																			API.CRUD[lcontrol].show({ table:options.table, row:$(this).parents('tr'), keys:rowdata, key:options.key });
																		} else {
																			API.GUI.Breadcrumbs.add(thref, href, { key:options.key, keys:rowdata });
																			API.GUI.load($('#ContentFrame'),href, { keys:rowdata });
																		}
																		break;
																}
															});
														});
													}
													API.GUI.Navbar.Task.update(task.attr('data-task'), 1);
													if((callback != undefined)&&(callback != null)){ callback(true, {dom:dataset.output.results,raw:dataset.output.raw}); }
												} else {
													if((callback != undefined)&&(callback != null)){ callback(false, {}); }
												}
											} else {
												var report = task.find('div.row').last().find('span.float-left');
												task.addClass('bg-light-danger');
												report.html('<a class="badge bg-danger px-2"><i class="icon icon-report mr-1"></i>'+API.Contents.Language['Report']+'</a>');
												report.find('a').click(function(){
													var message = '<p style="font-size: 18px; color: #2d2d2d line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;">'+API.Contents.Auth.User.username+API.Contents.Language[' is reporting']+'</p>';
													message += '<p style="font-size: 12px; color: #6c6c6c line-height: 1.5; word-break: break-word; text-align: justify; mso-line-height-alt: 18px; margin: 0;">'+result.replace(/\n/g, "<br />")+'</p>'
													API.request('smtp','send',{
														data:{
															email:API.Contents.Settings.Contacts.reporting,
															message:message,
														}
													});
												});
												if((callback != undefined)&&(callback != null)){ callback(false, {}); }
											}
									});
								});
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
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = API.Contents.SettingsLandingPage; }
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
					API.Builder.modal($('body'), {
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
						if((typeof options.load !== 'undefined' && options.load)||(typeof options.load === 'undefined')){API.GUI.load(body,options.href, { keys:options.keys });}
						else {API.GUI.load(body,options.href);}
						modal.off('hide').modal('show');
						modal.on('hide.bs.modal',function(e){
							if($(e.target).attr('id') == $(this).attr('id')){
								$(this).find('.modal-body').html('');
								$('a[href^="?p"]').removeClass('active');
								$('a[href^="?p='+origin.searchParams.get("p")+'"]').addClass('active');
								window.history.pushState({page: 1},API.Helper.ucfirst(origin.searchParams.get("p")), origin.href);
							}
							modal.remove();
						});
					});
				} else {
					if((typeof options.load !== 'undefined' && options.load)||(typeof options.load === 'undefined')){API.GUI.load($('#ContentFrame'),options.href, { keys:options.keys });}
					else {API.GUI.load($('#ContentFrame'),options.href);}
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
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = API.Contents.SettingsLandingPage; }
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
				API.Builder.modal($('body'), {
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
					footer.append('<button type="submit" class="btn btn-warning"><i class="icon icon-edit mr-1"></i>'+API.Contents.Language['Update']+'</button>');
					API.Builder.form(modal,{},function(form){
						modal.on('hide.bs.modal',function(){ form.remove(); });
						var skip = ['id','created','modified','owner','updated_by'];
						if((jQuery.isEmptyObject(options.hide))
							&&(API.Helper.isSet(API,['Contents','Auth','Options','hide',plugin,view,'any','form',form.attr('id')]))){
								options.hide = API.Contents.Auth.Options.hide[plugin][view].any.form[form.attr('id')];
						}
						body.html('');
						if(API.Helper.isSet(API.Plugins,[options.plugin,'options','update','skip'])){
							for (var [key, value] of Object.entries(API.Plugins[options.plugin].options.update.skip)) {
								if(!skip.includes(value)){ skip.push(value); }
							}
						}
						if(API.Helper.isSet(API.Plugins,[options.plugin,'forms','update'])){
							var fieldCount = 0, count = 0;
							for (var [key, value] of Object.entries(API.Plugins[options.plugin].forms.update)) {
								if(jQuery.type(value) === "string"){ ++fieldCount; }
							}
							body.append('<div class="col-md-12 p-2"><div class="row"></div></div>');
							for(var [key, value] of Object.entries(API.Plugins[options.plugin].forms.update)){
								var val = options.keys[value];
								if(!jQuery.isPlainObject(value)){
									API.Builder.input(body.find('.col-md-12').first().find('.row'), value, val,{plugin:options.plugin}, function(input){
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
										if((fieldCount <= 2)||((fieldCount == count)&&(API.Helper.isOdd(count)))){
											input.wrap('<div class="col-md-12 p-2"></div>');
										} else { input.wrap('<div class="col-md-6 p-2"></div>'); }
										for(var [key, value] of Object.entries(options.hide)){
											form.find('[data-key="'+key+'"]').parent().parent().hide();
										}
									});
								} else {
									API.Builder.card(body,{
										title: API.Helper.ucfirst(API.Helper.clean(key)),
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
												API.Builder.input(card.find('.card-body').find('.row'), subvalue, val,{plugin:options.plugin}, function(input){
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
													if((subfieldCount <= 2)||((subfieldCount == subcount)&&(API.Helper.isOdd(subcount)))){
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
									API.Builder.input(body, key, val,{plugin:options.plugin}, function(input){
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
										if((fieldCount <= 2)||((fieldCount == count)&&(API.Helper.isOdd(count)))){
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
							API.GUI.Navbar.Task.add({
								title:API.Contents.Language['Updating']+' '+API.Helper.ucfirst(options.plugin),
								value:0,
								max:1,
								plugin:options.plugin,
								extra:''
							},function(opt,task,divider){
								modal.modal('hide');
								API.request(options.plugin,'update',{
									data:record,
									report:true,
								},function(result){
									if(result.charAt(0) == '{'){
										var dataset = JSON.parse(result);
										if(typeof dataset.success !== 'undefined'){
											if((API.Helper.isSet(record,['job_title']))&&(!API.Contents.Jobs.includes(record.job_title))){
												API.Contents.Jobs.push(record.job_title);
											}
											if(API.Helper.isSet(record,['tags'])){
												var tagID = 0;
												for(var [tag, details] of Object.entries(record.tags)){
													if(API.Helper.isSet(API.Contents.data.dom,["tags",tag])){
														for(var [tag, details] of Object.entries(API.Contents.data.dom.tags)){ tagID = details.id; }
													}
													++tagID;
													API.Helper.set(API.Contents.data.dom,["tags",tag],{
														id:tagID,
														created:dataset.output.results.modified,
														modified:dataset.output.results.modified,
														owner:dataset.output.results.owner,
														updated_by:dataset.output.results.updated_by,
														name:tag
													});
													API.Helper.set(API.Contents.data.raw,["tags",tag],{
														id:tagID,
														created:dataset.output.results.modified,
														modified:dataset.output.results.modified,
														owner:dataset.output.results.owner,
														updated_by:dataset.output.results.updated_by,
														name:tag
													});
												}
											}
											if((typeof options.table !== 'undefined')&&(typeof options.row !== 'undefined')){
												var row = options.table.DataTable().row(options.row).data(dataset.output.results).draw(false);
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
																API.GUI.Breadcrumbs.add(thref, href, { key:options.key, keys:rowdata });
																if((typeof options.modal !== 'undefined')&&(options.modal)){
																	API.CRUD.read.show({ table:element, keys:rowdata, key:options.key, href:href });
																} else {
																	API.GUI.load($('#ContentFrame'),href, { keys:rowdata });
																}
																break;
															case"Edit":
																API.CRUD.update.show({ table:options.table, row:$(this).parents('tr'), keys:rowdata, key:options.key });
																break;
															default:
																if((typeof API.CRUD[lcontrol] !== 'undefined')&&(typeof API.CRUD[lcontrol].show !== 'undefined')){
																	API.CRUD[lcontrol].show({ table:options.table, row:$(this).parents('tr'), keys:rowdata, key:options.key });
																} else {
																	API.GUI.Breadcrumbs.add(thref, href, { key:options.key, keys:rowdata });
																	API.GUI.load($('#ContentFrame'),href, { keys:rowdata });
																}
																break;
														}
													});
												});
											}
											if(typeof options.container !== 'undefined'){ API.GUI.insert(dataset.output.results); }
											API.GUI.Navbar.Task.update(task.attr('data-task'), 1);
											if(callback != undefined){ callback({dom:dataset.output.results,raw:dataset.output.raw}); }
										}
									} else {
										var report = task.find('div.row').last().find('span.float-left');
										task.addClass('bg-light-danger');
										report.html('<a class="badge bg-danger px-2"><i class="icon icon-report mr-1"></i>'+API.Contents.Language['Report']+'</a>');
										report.find('a').click(function(){
											var message = '<p style="font-size: 18px; color: #2d2d2d line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;">'+API.Contents.Auth.User.username+API.Contents.Language[' is reporting']+'</p>';
											message += '<p style="font-size: 12px; color: #6c6c6c line-height: 1.5; word-break: break-word; text-align: justify; mso-line-height-alt: 18px; margin: 0;">'+result.replace(/\n/g, "<br />")+'</p>'
											API.request('smtp','send',{
												data:{
													email:API.Contents.Settings.Contacts.reporting,
													message:message,
												}
											});
										});
									}
								});
							});
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
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = API.Contents.SettingsLandingPage; }
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
				API.Builder.modal($('body'), {
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
					footer.append('<button type="submit" class="btn btn-danger"><i class="icon icon-delete mr-1"></i>'+API.Contents.Language['Delete']+'</button>');
					API.Builder.form(modal,{},function(form){
						modal.on('hide.bs.modal',function(){ form.remove(); });
						body.html(API.Contents.Language['You are about to delete: ']+'<strong class="ml-1">'+options.keys[options.key]+'</strong>');
						form.off();
						form.submit(function(action){
							action.preventDefault();
							API.GUI.Navbar.Task.add({
								title:API.Contents.Language['Deleting']+' '+API.Helper.ucfirst(options.plugin),
								value:0,
								max:1,
								plugin:options.plugin,
								extra:''
							},function(opt,task,divider){
								modal.modal('hide');
								API.request(options.plugin,'delete',{data:options.keys,report:true},function(result){
									if(result.charAt(0) == '{'){
										var dataset = JSON.parse(result);
										if(typeof dataset.success !== 'undefined'){
											if((typeof options.table !== 'undefined')&&(typeof options.row !== 'undefined')){
												var row = options.table.DataTable().row(options.row).remove().draw(false);
											}
											API.GUI.Navbar.Task.update(task.attr('data-task'), 1);
											if(callback != undefined){ callback(dataset.output.raw); }
										}
									} else {
										var report = task.find('div.row').last().find('span.float-left');
										task.addClass('bg-light-danger');
										report.html('<a class="badge bg-danger px-2"><i class="icon icon-report mr-1"></i>'+API.Contents.Language['Report']+'</a>');
										report.find('a').click(function(){
											var message = '<p style="font-size: 18px; color: #2d2d2d line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;">'+API.Contents.Auth.User.username+API.Contents.Language[' is reporting']+'</p>';
											message += '<p style="font-size: 12px; color: #6c6c6c line-height: 1.5; word-break: break-word; text-align: justify; mso-line-height-alt: 18px; margin: 0;">'+result.replace(/\n/g, "<br />")+'</p>'
											API.request('smtp','send',{
												data:{
													email:API.Contents.Settings.Contacts.reporting,
													message:message,
												}
											});
										});
									}
								});
							});
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
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = API.Contents.SettingsLandingPage; }
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
				API.Builder.modal($('body'), {
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
					footer.append('<button type="submit" class="btn btn-danger"><i class="icon icon-delete mr-1"></i>'+API.Contents.Language['Delete']+'</button>');
					API.Builder.form(modal,{},function(form){
						modal.on('hide.bs.modal',function(){ form.remove(); });
						body.html(API.Contents.Language['Are you sure you want to delete these rows?']);
						form.off();
						form.submit(function(action){
							action.preventDefault();
							var count = element.DataTable().rows( { selected: true } ).count(), ct = 0, executed = 0, readystate = false, stat = true;
							modal.modal('hide');
							API.GUI.Navbar.Task.add({
								title:API.Contents.Language['Deleting']+' '+API.Helper.ucfirst(options.plugin),
								value:0,
								max:count,
								plugin:plugin,
								extra:''
							},function(opt,task,divider){
								var id = task.attr('data-task');
								var message = '<p style="font-size: 18px; color: #2d2d2d line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;">'+API.Contents.Auth.User.username+API.Contents.Language[' is reporting']+'</p>';
								element.DataTable().rows( { selected: true } ).every(function(){
									var row = this, rowData = this.data();
									API.request(options.plugin,'delete',{
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
											API.GUI.Navbar.Task.update(id,ct);
										} else {
											message += '<p style="font-size: 12px; color: #6c6c6c line-height: 1.5; word-break: break-word; text-align: justify; mso-line-height-alt: 18px; margin: 0;">'+result.replace(/\n/g, "<br />")+'</p>'
											var report = task.find('div.row').last().find('span.float-left');
											if(!task.hasClass('bg-light-danger')){ task.addClass('bg-light-danger'); }
											report.html('<a class="badge bg-danger px-2"><i class="icon icon-report mr-1"></i>'+API.Contents.Language['Report']+'</a>');
											report.find('a').off();
											report.find('a').click(function(){
												API.request('smtp','send',{
													data:{
														email:API.Contents.Settings.Contacts.reporting,
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
												API.Toast.show.fire({ type: 'success', text: API.Contents.Language['Records successfully deleted'] });
											} else {
												API.Toast.show.fire({ type: 'error', text: API.Contents.Language['Unable to complete the request'] });
											}
										}
										if(callback != undefined){ callback(element); }
									}
								}, 100);
							});
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
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = API.Contents.SettingsLandingPage; }
				if(options instanceof Function){ callback = options; options = {}; }
				if(typeof options.plugin === 'undefined'){ options.plugin = plugin }
				var count = table.DataTable().rows( { selected: true } ).count(), started = 0, executed = 0, ready = false, completed = true;
				API.Builder.modal($('body'), {
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
					footer.append('<a class="btn btn-info text-light"><i class="icon icon-assign mr-1"></i>'+API.Contents.Language['Assign']+'</a>');
					API.Builder.input(body, 'user', API.Contents.Auth.User.id,{plugin:options.plugin},function(input){});
					footer.find('a').click(function(){
						API.GUI.Navbar.Task.add({
							title:API.Contents.Language['Assigning']+' '+API.Helper.ucfirst(options.plugin),
							value:0,
							max:count,
							plugin:options.plugin,
							extra:'',
						},function(opt,task,divider){
							var id = task.attr('data-task');
							var message = '<p style="font-size: 18px; color: #2d2d2d line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;">'+API.Contents.Auth.User.username+API.Contents.Language[' is reporting']+'</p>';
							table.DataTable().rows( { selected: true } ).every(function(){
								var row = this, rowData = this.data();
								var user = body.find("select").select2("data")[0].text;
								var users = '';
								for(var [key, value] of Object.entries(rowData.assigned_to.split(';'))){ if(value != user){ users += ';'+value; } }
								users += ';'+user;
								rowData.assigned_to = users.replace(/^;|;$/g,'');
								API.request(options.plugin,'update',{
									data:rowData,
									toast:false,
									report:true,
								},function(result){
									if(result.charAt(0) == '{'){
										var dataset = JSON.parse(result);
										if(typeof dataset.success !== 'undefined'){
											table.DataTable().row('#'+dataset.output.results.id).data(dataset.output.results).draw(false);
										} else { completed = false; }
										++started;
										API.GUI.Navbar.Task.update(id,started);
									} else {
										message += '<p style="font-size: 12px; color: #6c6c6c line-height: 1.5; word-break: break-word; text-align: justify; mso-line-height-alt: 18px; margin: 0;">'+result.replace(/\n/g, "<br />")+'</p>'
										var report = task.find('div.row').last().find('span.float-left');
										if(!task.hasClass('bg-light-danger')){ task.addClass('bg-light-danger'); }
										report.html('<a class="badge bg-danger px-2"><i class="icon icon-report mr-1"></i>'+API.Contents.Language['Report']+'</a>');
										report.find('a').off();
										report.find('a').click(function(){
											API.request('smtp','send',{
												data:{
													email:API.Contents.Settings.Contacts.reporting,
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
											API.Toast.show.fire({ type: 'success', text: API.Contents.Language['User successfully assigned'] });
										} else {
											API.Toast.show.fire({ type: 'error', text: API.Contents.Language['Unable to complete the request'] });
										}
									}
									if((callback != undefined)&&(callback != null)){ callback(element); }
								}
							}, 100);
						});
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
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = API.Contents.SettingsLandingPage; }
				if(options instanceof Function){ callback = options; options = {}; }
				if(typeof options.plugin === 'undefined'){ options.plugin = plugin }
				var count = table.DataTable().rows( { selected: true } ).count(), started = 0, executed = 0, ready = false, completed = true;
				API.Builder.modal($('body'), {
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
					footer.append('<a class="btn btn-info text-light"><i class="icon icon-unassign mr-1"></i>'+API.Contents.Language['Unassign']+'</a>');
					API.Builder.input(body, 'user', API.Contents.Auth.User.id,{plugin:options.plugin},function(input){});
					footer.find('a').click(function(){
						API.GUI.Navbar.Task.add({
							title:API.Contents.Language['Unassigning']+' '+API.Helper.ucfirst(options.plugin),
							value:0,
							max:count,
							plugin:options.plugin,
							extra:'',
						},function(opt,task,divider){
							var id = task.attr('data-task');
							var message = '<p style="font-size: 18px; color: #2d2d2d line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;">'+API.Contents.Auth.User.username+API.Contents.Language[' is reporting']+'</p>';
							table.DataTable().rows( { selected: true } ).every(function(){
								var row = this, rowData = this.data();
								var user = body.find("select").select2("data")[0].text;
								var users = '';
								if(rowData.assigned_to != user){
									for(var [key, value] of Object.entries(rowData.assigned_to.split(';'))){ if(value != user){ users += ';'+value; } }
								}
								rowData.assigned_to = users.replace(/^;|;$/g,'')
								API.request(options.plugin,'update',{
									data:rowData,
									toast:false,
									report:true,
								},function(result){
									if(result.charAt(0) == '{'){
										var dataset = JSON.parse(result);
										if(typeof dataset.success !== 'undefined'){
											table.DataTable().row('#'+dataset.output.results.id).data(dataset.output.results).draw(false);
										} else { completed = false; }
										++started;
										API.GUI.Navbar.Task.update(id,started);
									} else {
										message += '<p style="font-size: 12px; color: #6c6c6c line-height: 1.5; word-break: break-word; text-align: justify; mso-line-height-alt: 18px; margin: 0;">'+result.replace(/\n/g, "<br />")+'</p>'
										var report = task.find('div.row').last().find('span.float-left');
										if(!task.hasClass('bg-light-danger')){ task.addClass('bg-light-danger'); }
										report.html('<a class="badge bg-danger px-2"><i class="icon icon-report mr-1"></i>'+API.Contents.Language['Report']+'</a>');
										report.find('a').off();
										report.find('a').click(function(){
											API.request('smtp','send',{
												data:{
													email:API.Contents.Settings.Contacts.reporting,
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
											API.Toast.show.fire({ type: 'success', text: API.Contents.Language['User successfully unassigned'] });
										} else {
											API.Toast.show.fire({ type: 'error', text: API.Contents.Language['Unable to complete the request'] });
										}
									}
									if((callback != undefined)&&(callback != null)){ callback(element); }
								}
							}, 100);
						});
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
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = API.Contents.SettingsLandingPage; }
				if(options instanceof Function){ callback = options; options = {}; }
				if(typeof options.plugin === 'undefined'){ options.plugin = plugin }
				var count = table.DataTable().rows( { selected: true } ).count(), started = 0, executed = 0, ready = false, completed = true;
				API.Builder.modal($('body'), {
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
					body.html(API.Contents.Language['Are you sure you want to lock these records?']);
					footer.append('<a class="btn btn-info text-light"><i class="icon icon-lock mr-1"></i>'+API.Contents.Language['Lock']+'</a>');
					footer.find('a').click(function(){
						API.GUI.Navbar.Task.add({
							title:API.Contents.Language['Locking']+' '+API.Helper.ucfirst(options.plugin),
							value:0,
							max:count,
							plugin:options.plugin,
							extra:'',
						},function(opt,task,divider){
							var id = task.attr('data-task');
							var message = '<p style="font-size: 18px; color: #2d2d2d line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;">'+API.Contents.Auth.User.username+API.Contents.Language[' is reporting']+'</p>';
							table.DataTable().rows( { selected: true } ).every(function(){
								var row = this, rowData = this.data();
								rowData.isLocked = true;
								API.request(options.plugin,'update',{
									data:rowData,
									toast:false,
									report:true,
								},function(result){
									if(result.charAt(0) == '{'){
										var dataset = JSON.parse(result);
										if(typeof dataset.success !== 'undefined'){
											table.DataTable().row('#'+dataset.output.results.id).data(dataset.output.results).draw(false);
										} else { completed = false; }
										++started;
										API.GUI.Navbar.Task.update(id,started);
									} else {
										message += '<p style="font-size: 12px; color: #6c6c6c line-height: 1.5; word-break: break-word; text-align: justify; mso-line-height-alt: 18px; margin: 0;">'+result.replace(/\n/g, "<br />")+'</p>'
										var report = task.find('div.row').last().find('span.float-left');
										if(!task.hasClass('bg-light-danger')){ task.addClass('bg-light-danger'); }
										report.html('<a class="badge bg-danger px-2"><i class="icon icon-report mr-1"></i>'+API.Contents.Language['Report']+'</a>');
										report.find('a').off();
										report.find('a').click(function(){
											API.request('smtp','send',{
												data:{
													email:API.Contents.Settings.Contacts.reporting,
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
											API.Toast.show.fire({ type: 'success', text: API.Contents.Language['Record successfully locked'] });
										} else {
											API.Toast.show.fire({ type: 'error', text: API.Contents.Language['Unable to complete the request'] });
										}
									}
									if((callback != undefined)&&(callback != null)){ callback(element); }
								}
							}, 100);
						});
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
				if(url.searchParams.get("p") != undefined){ var plugin = url.searchParams.get("p"); } else { var plugin = API.Contents.SettingsLandingPage; }
				if(options instanceof Function){ callback = options; options = {}; }
				if(typeof options.plugin === 'undefined'){ options.plugin = plugin }
				var count = table.DataTable().rows( { selected: true } ).count(), started = 0, executed = 0, ready = false, completed = true;
				API.Builder.modal($('body'), {
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
					body.html(API.Contents.Language['Are you sure you want to unlock these records?']);
					footer.append('<a class="btn btn-info text-light"><i class="icon icon-unlock mr-1"></i>'+API.Contents.Language['Unlock']+'</a>');
					footer.find('a').click(function(){
						API.GUI.Navbar.Task.add({
							title:API.Contents.Language['Unlocking']+' '+API.Helper.ucfirst(options.plugin),
							value:0,
							max:count,
							plugin:options.plugin,
							extra:'',
						},function(opt,task,divider){
							var id = task.attr('data-task');
							var message = '<p style="font-size: 18px; color: #2d2d2d line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 22px; margin: 0;">'+API.Contents.Auth.User.username+API.Contents.Language[' is reporting']+'</p>';
							table.DataTable().rows( { selected: true } ).every(function(){
								var row = this, rowData = this.data();
								rowData.isLocked = false
								API.request(options.plugin,'update',{
									data:rowData,
									toast:false,
									report:true,
								},function(result){
									if(result.charAt(0) == '{'){
										var dataset = JSON.parse(result);
										if(typeof dataset.success !== 'undefined'){
											table.DataTable().row('#'+dataset.output.results.id).data(dataset.output.results).draw(false);
										} else { completed = false; }
										++started;
										API.GUI.Navbar.Task.update(id,started);
									} else {
										message += '<p style="font-size: 12px; color: #6c6c6c line-height: 1.5; word-break: break-word; text-align: justify; mso-line-height-alt: 18px; margin: 0;">'+result.replace(/\n/g, "<br />")+'</p>'
										var report = task.find('div.row').last().find('span.float-left');
										if(!task.hasClass('bg-light-danger')){ task.addClass('bg-light-danger'); }
										report.html('<a class="badge bg-danger px-2"><i class="icon icon-report mr-1"></i>'+API.Contents.Language['Report']+'</a>');
										report.find('a').off();
										report.find('a').click(function(){
											API.request('smtp','send',{
												data:{
													email:API.Contents.Settings.Contacts.reporting,
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
											API.Toast.show.fire({ type: 'success', text: API.Contents.Language['Record successfully unlocked'] });
										} else {
											API.Toast.show.fire({ type: 'error', text: API.Contents.Language['Unable to complete the request'] });
										}
									}
									if((callback != undefined)&&(callback != null)){ callback(element); }
								}
							}, 100);
						});
						modal.modal('hide');
					});
					modal.modal('show');
				});
			},
		},
	},
}

// Init API
API.init();

// Set Preferences
var maxit = 25, start = 0;
var checkSettings = setInterval(function() {
	++start;
	if(API.Helper.isSet(API,['Contents','Auth','Options'])){
		clearInterval(checkSettings);
		if(API.Helper.isSet(API,['Contents','Auth','Options','application'])){
			for(var [key, value] of Object.entries(API.Contents.Auth.Options.application)){
				switch(key){
					case'swalPosition':
						API.Toast.set.position = value.value;
						API.Toast.show = Swal.mixin({
						  toast: API.Toast.set.toast,
						  position: API.Toast.set.position,
						  showConfirmButton: API.Toast.set.showConfirmButton,
						  timer: API.Toast.set.timer,
						});
						break;
					case'swalTimer':
						API.Toast.set.timer = value.value;
						API.Toast.show = Swal.mixin({
						  toast: API.Toast.set.toast,
						  position: API.Toast.set.position,
						  showConfirmButton: API.Toast.set.showConfirmButton,
						  timer: API.Toast.set.timer,
						});
						break;
					case'breadcrumbsMax':
						API.GUI.Breadcrumbs.set(value.value);
						break;
				}
			}
		}
	}
	if(start == maxit){ clearInterval(checkSettings); }
}, 100);

// Create SideMenu Headers
API.GUI.Sidebar.Header.add('MAIN_NAVIGATION',function(){API.GUI.Sidebar.Header.add('HELP',function(){API.GUI.Sidebar.Header.add('ADMINISTRATION',function(){API.GUI.Sidebar.Header.add('DEVELOPMENT');});});});
