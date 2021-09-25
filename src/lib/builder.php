<?php

// Import Librairies
require_once dirname(__FILE__,3) . '/src/lib/api.php';
require_once dirname(__FILE__,3) . '/src/lib/format.php';
require_once dirname(__FILE__,3) . '/src/lib/form.php';
require_once dirname(__FILE__,3) . '/src/lib/table.php';

class Builder extends API{

  public $Form;
  public $Table;
  public $Format;
  public $Count;

  public function __construct(){

		// Initialise API
    parent::__construct();

		// Initialise SubClasses
    $this->Form = new Form();
    $this->Table = new Table();
    $this->Format = new Format();

		// Initialise Counts
    $this->Count['datatables'] = 0;
    $this->Count['controls'] = 0;
    $this->Count['card'] = 0;
    $this->Count['modal'] = 0;
    $this->Count['views'] = 0;
    $this->Count['widget'] = 0;
  }

	public function datatables($listing, $settings = null){
		$this->Count['datatables']++;
		$defaults['datatable'] = [
			'css' => [
				'table' => 'table-hover table-bordered',
				'thead' => 'thead-dark',
			],
			'id' => 'datatable-%count%',
			'clickable-row' => FALSE,
			'buttons' => [
				'Details' => [
					'status' => TRUE,
					'action' => 'link',
					'function' => '',
					'controller' => '',
					'view' => '',
					'field' => 'id',
					'url' => '',
				],
			],
			'action' => [],
			'hide' => [],
		];
		if((isset($settings))&&(!empty($settings))){
			$defaults = array_replace_recursive($defaults,$settings);
		}
		$dtid = str_replace('%count%',$this->Count['datatables'],$defaults['datatable']['id']);
		$build = '<div class="table-responsive"><table id="'.$dtid.'" class="table '.$defaults['datatable']['css']['table'].' dt-responsive" style="width:100%">';
		$build .= '<thead class="'.$defaults['datatable']['css']['thead'].'"><tr><th id="'.$dtid.'selectAll" data-toggle="false" style="cursor:pointer;" onclick="api.dtSelectAll(\''.$dtid.'\')"></th>';
		foreach(current($listing) as $key => $item){
			if (!in_array($key, $defaults['datatable']['hide'])) {
				$build .= '<th>'.ucwords($this->Language->Field[$key]).'</th>';
			}
		}
		$build .= '<th style="width:150px;">'.$this->Language->Field['Action'].'</th></tr></thead><tbody>';
		$trigger = '';
		foreach($listing as $id => $cols){
			if($defaults['datatable']['buttons']['Details']['action'] == 'link'){
				if(!empty($defaults['datatable']['buttons']['Details']['url'])){
					$href = $defaults['datatable']['buttons']['Details']['url'];
				} else {
					$href ='/'.$defaults['datatable']['buttons']['Details']['controller'].'/'.$defaults['datatable']['buttons']['Details']['view'].'/'.$cols[$defaults['datatable']['buttons']['Details']['field']];
				}
			} else {
				$funtion = str_replace('%key%',$id,str_replace('%id%',$cols[$defaults['datatable']['buttons']['Details']['field']],str_replace('%view%',$defaults['datatable']['buttons']['Details']['view'],str_replace('%controller%',$defaults['datatable']['buttons']['Details']['controller'],$defaults['datatable']['buttons']['Details']['function']))));
				$href = $defaults['datatable']['buttons']['Details']['action'].'="'.$funtion.'"';
			}
			if($defaults['datatable']['clickable-row']){
				if($this->Auth->valid('button','Details',1)){
					if($defaults['datatable']['buttons']['Details']['action'] == 'link'){
						$trigger='clickable-row" data-href="'.$href;
					} else {
						$trigger='" '.$href.' style="cursor:pointer;';
					}
				}
			}
			$build .= '<tr id="'.$defaults['datatable']['buttons']['Details']['controller'].'-'.$id.'"><td class="text-center"></td>';
			foreach($cols as $key => $item){
				if (!in_array($key, $defaults['datatable']['hide'])) {
					$build .= '<td data-type="'.$key.'" class="'.$trigger.'">';
					// $build .= $this->Table->field($key, $item, $table);
					$build .= $item;
					$build .= '</td>';
				}
			}
			$build .= '<td><div class="btn-group">';
			if($this->Auth->valid('button','Details',1)){
				if($defaults['datatable']['buttons']['Details']['action'] == 'link'){
					$build .= '<a class="btn btn-primary btn-sm" href="'.$href.'"><i class="fas fa-info-circle mr-1"></i>'.$this->Language->Field['Details'].'</a>';
				} else {
					$build .= '<button type=button class="btn btn-primary btn-sm" '.$href.'><i class="fas fa-info-circle mr-1"></i>'.$this->Language->Field['Details'].'</button>';
				}
			}
			if(!empty($defaults['datatable']['buttons'])){
				foreach($defaults['datatable']['buttons'] as $nav => $opt){
					if($nav != 'Details'){
						$display = FALSE;
						if((isset($opt['condition']))&&(!empty($opt['condition']))){
							foreach($opt['condition'] as $condition => $parm){
								switch ($parm['condition']) {
									case "in_array":
										$array = explode(',',trim($cols[$condition],','));
										foreach($array as $element){
											if(in_array(trim($element,' '),$parm['value'])){
												$display = TRUE;
											}
										}
										break;
									case "not_in_array":
										$display = TRUE;
										$array = explode(',',trim($cols[$condition],','));
										foreach($array as $element){
											if(in_array(trim($element,' '),$parm['value'])){
												$display = FALSE;
											}
										}
										break;
									case "not_equal":
										if($cols[$condition] != $parm['value']){
											$display = TRUE;
										}
										break;
									default:
										if($cols[$condition] == $parm['value']){
											$display = TRUE;
										}
										break;
								}
							}
						} else {
							$display = TRUE;
						}
						$text = "";
						if((isset($opt['text']))&&(!empty($opt['text']))){
							$text = $this->Language->Field[$opt['text']];
						}
						$css='btn-default';
						if((isset($opt['css']))&&(!empty($opt['css']))){
							$css=$opt['css'];
						}
						$icon='';
						if((isset($opt['icon']))&&(!empty($opt['icon']))){
							if($text != ''){
								$icon='<i class="'.$opt['icon'].' mr-1"></i>';
							} else {
								$icon='<i class="'.$opt['icon'].'"></i>';
							}
						}
						if($opt['action'] == 'link'){
							if(!empty($opt['url'])){
								$href = $opt['url'];
							} else {
								$href ='/'.$opt['controller'].'/'.$opt['view'].'/'.$cols[$opt['field']];
							}
						} else {
							$funtion = str_replace('%key%',$id,str_replace('%id%',$cols[$defaults['datatable']['buttons']['Details']['field']],str_replace('%view%',$defaults['datatable']['buttons']['Details']['view'],str_replace('%controller%',$defaults['datatable']['buttons']['Details']['controller'],$opt['function']))));
							$href = $opt['action'].'="'.$funtion.'"';
						}
						if($display){
							if($this->Auth->valid('button',$nav,1)){
								if($opt['action'] == 'link'){
									$build .= '<a class="btn btn-sm '.$css.'" href="'.$href.'">'.$icon.$text.'</a>';
								} else {
									$build .= '<button type=button class="btn btn-sm '.$css.'" '.$href.'>'.$icon.$text.'</button>';
								}
							}
						}
					}
				}
			}
			$build .= '</div></td>';
		}
		$build .= '</tr></tbody></table></div>';
		$build .= '<script>
								api.setViews(\'datatable\', \''.$dtid.'\');
							</script>';
		return $build;
	}

	public function controls($settings = null){
		$this->Count['controls']++;
		$defaults['controls'] = [
			'css' => [
				'group' => '',
				'button' => '',
			],
			'table' => null,
			'buttons' => [],
		];
		if((isset($settings))&&(!empty($settings))){
			$defaults = array_replace_recursive($defaults,$settings);
		}
		$build = '<div class="btn-group '.$defaults['controls']['css']['group'].'">';
		if(!empty($defaults['controls']['buttons'])){
			foreach($defaults['controls']['buttons'] as $nav => $opt){
				if(isset($opt['css'])){
					$css = $defaults['controls']['css']['button'].' '.$opt['css'];
				} else {
					$css = $defaults['controls']['css']['button'];
				}
				if(isset($opt['icon'])){
					$icon = '<i class="'.$opt["icon"].' mr-1"></i>';
				} else {
					$icon = '';
				}
				if($opt["action"] == 'link'){
					if((isset($opt["url"]))&&(!empty($opt["url"]))){
						$href = $opt["url"];
					} else {
						$href = '/'.$opt['controller'].'/'.$opt['view'].'/'.$opt["id"];
					}
				} else {
					$href = $opt['action'].'="'.$opt['function'].'"';
				}
				if($this->Auth->valid('button',$nav,1)){
					$display = FALSE;
					if(($defaults['controls']['table'] != null)&&(in_array($nav,['create','read','update','delete']))){
						switch($nav){
							case'read':
								$level=1;
								;;
							case'create':
								$level++;
								;;
							case'update':
								$level++;
								;;
							case'delete':
								$level++;
								;;
						}
						if($this->Auth->valid('plugin',$default['controls']['table'],$level)){ $display = TRUE; }
					} else {
						$display = TRUE;
					}
					if($display){
						if((isset($opt['action']))&&($opt['action'] != "link")){
							$build .= '<button type="button" class="btn '.$css.'" '.$href.'>'.$icon.$this->Language->Field[$nav].'</button>';
						} else {
							$build .= '<a href="'.$href.'" class="btn '.$css.'">'.$icon.$this->Language->Field[$nav].'</a>';
						}
					}
				}
			}
		}
		$build .= '</div>';
		return $build;
	}

	public function card($settings){
		$this->Count['card']++;
		$defaults['card'] = [
			'css' => [
				'card' => '',
				'header' => '',
				'body' => '',
				'footer' => '',
			],
			'header' => [
				'title' => '',
				'icon' => '',
				'tools' => '',
			],
			'body' => '',
			'footer' => '',
		];
		if((isset($settings))&&(!empty($settings))){
			$defaults = array_replace_recursive($defaults,$settings);
		}
		$build = '<div class="card '.$defaults['card']['css']['card'].'">';
		if($defaults['card']['header']['title'].$defaults['card']['header']['icon'].$defaults['card']['header']['tools'] != ''){
			$build .= '<div class="card-header '.$defaults['card']['css']['header'].'">';
			if($defaults['card']['header']['title'] != ''){
				$build .= '<h3 class="card-title">';
				if($defaults['card']['header']['icon'] != ''){
					$build .= '<i class="'.$defaults['card']['header']['icon'].' mr-2"></i>';
				}
				$build .= $defaults['card']['header']['title'].'</h3>';
			}
			if($defaults['card']['header']['tools'] != ''){
				$build .= '<div class="card-tools">';
				$build .= $defaults['card']['header']['tools'];
				$build .= '</div>';
			}
			$build .= '</div>';
		}
		if($defaults['card']['body'] != ''){
			$build .= '<div class="card-body '.$defaults['card']['css']['body'].'">';
			$build .= $defaults['card']['body'];
			$build .= '</div>';
		}
		if($defaults['card']['footer'] != ''){
			$build .= '<div class="card-footer '.$defaults['card']['css']['footer'].'">';
			$build .= $defaults['card']['footer'];
			$build .= '</div>';
		}
		$build .= '</div>';
		return $build;
	}

	public function modal($settings, $listing = []){
		$this->Count['modal']++;
		$defaults['modal'] = [
			'css' => [
				'modal' => '',
				'modal-dialog' => '',
				'header' => '',
				'body' => '',
				'footer' => '',
				'group' => '',
				'button' => '',
			],
			'header' => [
				'title' => '',
				'icon' => '',
			],
			'body' => '',
			'template' => '',
			'footer' => [],
			'id' => 'modal-%count%',
			'relationship' => '',
			'link_to' => '',
		];
		if((isset($settings))&&(!empty($settings))){
			$defaults = array_replace_recursive($defaults,$settings);
		}
		$id = str_replace('%count%',$this->Count['modal'],$defaults['modal']['id']);
		if(isset($defaults['modal']['header']['icon'])){
			$title_icon = '<i class="'.$defaults['modal']['header']['icon'].' mr-1"></i>';
		} else {
			$title_icon = '';
		}
		if((isset($defaults['modal']['template']))&&(!empty($defaults['modal']['template']))){
			switch($defaults['modal']['template']){
				case "views":
					if(!empty($listing)){
						$defaults['modal']['css']['modal'] .= ' modalViews';
						$defaults['modal']['body'] = $this->views($listing,$settings);
					}
					break;
			}
		}
		$build = '<div class="modal fade '.$defaults['modal']['css']['modal'].'" id="'.$id.'" role="dialog" aria-hidden="true">';
		$build .= '<div class="modal-dialog '.$defaults['modal']['css']['modal-dialog'].'" role="document">';
		$build .= '<div class="modal-content">';
		$build .= '<div class="modal-header '.$defaults['modal']['css']['header'].'">';
		$build .= '<h5 class="modal-title text-light">'.$title_icon.$defaults['modal']['header']['title'].'</h5>';
		$build .= '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
		$build .= '</div><div class="modal-body '.$defaults['modal']['css']['body'].'">';
		$build .= $defaults['modal']['body'];
		$build .= '</div><div class="modal-footer justify-content-between '.$defaults['modal']['css']['footer'].'">';
		$build .= '<button type="button" class="btn btn-default '.$defaults['modal']['css']['button'].'" data-dismiss="modal">'.$this->Language->Field['Close'].'</button>';
		$build .= '<div class="btn-group '.$defaults['modal']['css']['group'].'">';
		if(!empty($defaults['modal']['footer'])){
			foreach($defaults['modal']['footer'] as $nav => $opt){
				if(isset($opt['css'])){
					$css = $defaults['modal']['css']['button'].' '.$opt['css'];
				} else {
					$css = $defaults['modal']['css']['button'];
				}
				if(isset($opt['icon'])){
					$icon = '<i class="'.$opt["icon"].' mr-1"></i>';
				} else {
					$icon = '';
				}
				if($opt["action"] == 'link'){
					if((isset($opt["url"]))&&(!empty($opt["url"]))){
						$href = $opt["url"];
					} else {
						$href = '/'.$opt['controller'].'/'.$opt['view'].'/'.$opt["id"];
					}
				} else {
					$href = $opt['action'].'="'.$opt['function'].'"';
				}
				if($this->Auth->valid('button',$nav,1)){
					if((isset($opt['action']))&&($opt['action'] != "link")){
						$build .= '<button type="button" class="btn '.$css.'" '.$href.'>'.$icon.$this->Language->Field[$nav].'</button>';
					} else {
						$build .= '<a href="'.$href.'" class="btn '.$css.'">'.$icon.$this->Language->Field[$nav].'</a>';
					}
				}
			}
		}
		$build .= '</div></div></div></div></div>';
		return $build;
	}

	public function views($listing,$settings){
		$this->Count['views']++;
		$defaults['views'] = [
			'css' => [
				'input' => '',
				'label' => 'pull-right',
			],
			'relationship' => '',
			'link_to' => '',
			'id' => '',
		];
		if((isset($settings))&&(!empty($settings))){
			$defaults = array_replace_recursive($defaults,$settings);
		}
		$results=$this->Auth->query('SELECT * FROM options WHERE relationship = ? AND link_to = ? AND user = ?', $defaults['views']['relationship'], $defaults['views']['link_to'], $this->Auth->User['id'])->fetchAll()->all();
    $views = [];
    foreach($results as $result){
      array_push($views, $result['name']);
    }
		$build = '<div class="table-responsive"><table id="'.$defaults['views']['id'].'" class="table table-sm table-hover table-bordered dt-responsive" style="width:100%">';
		$build .= '<thead class="thead-dark"><tr><th id="'.$defaults['views']['id'].'selectAll" data-toggle="false" style="cursor:pointer;" onclick="api.dtSelectAll(\''.$defaults['views']['id'].'\')"></th><th>'.$this->Language->Field['Column'].'</th></tr></thead>';
		foreach(current($listing) as $key => $item){
			$id = 'views-'.$this->Count['views'].'-'.$key;
			if(in_array($key, $views)){ $status = "checked"; } else { $status = ''; }
			$build .= '<tr><td class="text-center"><input type="checkbox" name="'.$key.'" style="display:none;"></td>';
			$build .= '<td>'.ucwords($this->Language->Field[$key]).'</td></tr>';
		}
		$build .= '</table></div>';
		$build .= '<script>
								api.setViewsSelection(\''.$defaults['views']['relationship'].'\', \''.$defaults['views']['link_to'].'\', \''.$defaults['views']['id'].'\');
							</script>';
		return $build;
	}

	public function widget($name, $settings){
		$this->Count['widget']++;
		$build = '';
		$defaults = [
			'widget' => [
				'loadContent' => '',
				'listing' => '',
				'refresh' => '',
				'controller' => '',
				'view' => '',
				'field' => '',
			],
		];
		switch($name){
			case "cardListing":
				$defaults = array_replace_recursive($defaults,$settings);
				$default = [
					'card' => [
						'css' => [
							'card' => 'm-3 card-primary card-outline',
							'body' => ' p-0',
						],
						'header' => [
							'title' => '',
							'icon' => '',
						],
					],
					'modal' => [
						'css' => [
							'header' => 'bg-info',
							'body' => 'p-0',
						],
						'header' => [
							'title' => $this->Language->Field['Hide columns'],
							'icon' => 'fas fa-eye',
						],
						'template' => 'views',
						'footer' => [
							'Save' => [
								'icon' => 'fas fa-eye',
								'css' => 'btn-info',
								'action' => 'onclick',
								'function' => 'api.saveViews(\'datatable-views-widget'.$this->Count['widget'].'\',\'datatable\',\'datatable-widget'.$this->Count['widget'].'\')',
								'url' => '/',
							],
						],
						'id' => 'modal-views-widget'.$this->Count['widget'],
						'relationship' => 'datatable',
						'link_to' => 'datatable-widget'.$this->Count['widget'],
					],
					'views' => [
						'id' => 'datatable-views-widget'.$this->Count['widget'],
						'relationship' => 'datatable',
						'link_to' => 'datatable-widget'.$this->Count['widget'],
					],
					'controls' => [
						'css' => [
							'button' => 'btn-sm',
						],
						'buttons' => [
							'Create' => [
								'icon' => 'fas fa-plus-circle',
								'css' => 'btn-success',
								'action' => 'onclick',
								'function' => 'openModalCreate(\''.str_replace('"','&quot;',json_encode(current($defaults['widget']['listing']))).'\',\''.$defaults['widget']['controller'].'\')',
							],
							'Refresh' => [
								'icon' => 'fas fa-spinner',
								'css' => 'btn-primary',
								'action' => 'onclick',
								'function' => 'api.loadContent('.$defaults['widget']['refresh'].')',
							],
							'Hide' => [
								'icon' => 'fas fa-eye',
								'css' => 'btn-info',
								'action' => 'onclick',
								'function' => 'api.openModal(\'modal-views-widget'.$this->Count['widget'].'\')',
							],
							'Filters' => [
								'icon' => 'fas fa-filter',
								'css' => 'btn-warning',
								'action' => 'onclick',
								'function' => 'openModalFilter(\''.str_replace('"','&quot;',json_encode(current($defaults['widget']['listing']))).'\',\''.$defaults['widget']['controller'].'\')',
							],
							'Import' => [
								'icon' => 'fas fa-upload',
								'css' => 'btn-secondary',
								'action' => 'onclick',
								'function' => 'openModalImport(\''.$defaults['widget']['controller'].'\')',
							],
						],
					],
					'datatable' => [
						'id' => 'datatable-widget'.$this->Count['widget'],
						'css' => [
							'table' => 'table-hover table-bordered',
							'thead' => 'thead-dark',
						],
						'clickable-row' => TRUE,
						'buttons' => [
							'Details' => [
								'status' => TRUE,
								'action' => 'onclick',
								'controller' => $defaults['widget']['controller'],
								'view' => $defaults['widget']['view'],
								'field' => $defaults['widget']['field'],
								'function' => 'api.loadContent('.$defaults['widget']['loadContent'].')',
							],
							'Trash' => [
								'status' => TRUE,
								'action' => 'onclick',
								'css' => 'btn-danger',
								'icon' => 'fas fa-trash-alt',
								'function' => 'openModalTrash(\'%id%\',\''.$defaults['widget']['controller'].'\',\''.$defaults['widget']['controller'].'-%key%\')',
							],
						],
						'action' => [],
						'hide' => [],
					],
				];
				$defaults = array_replace_recursive($default,$defaults);
				$defaults['card']['header']['tools'] = $this->controls($defaults);
				$defaults['card']['body'] = $this->datatables($defaults['widget']['listing'], $defaults);
				$build .= $this->card($defaults);
				$build .= $this->modal($defaults, $defaults['widget']['listing']);
				break;
		}
		return $build;
	}











  private function getFilters($table,$controller){
    $filters['filters']['likes'] = $this->Auth->query('SELECT * FROM options WHERE controller = ? AND type = ? AND `table` = ?', $controller, 'filter-like', $table)->fetchAll()->all();
    $filters['filters']['unlikes'] = $this->Auth->query('SELECT * FROM options WHERE controller = ? AND type = ? AND `table` = ?', $controller, 'filter-unlike', $table)->fetchAll()->all();
    $filters['likes'] = [];
    $filters['unlikes'] = [];
    foreach($filters['filters']['likes'] as $like){
      array_push($filters['likes'], '%'.$like['value'].'%');
    }
    foreach($filters['filters']['unlikes'] as $unlike){
      array_push($filters['unlikes'], '%'.$unlike['value'].'%');
    }
    return $filters;
  }

  private function getViews($table,$controller){
    $results=$this->Auth->query('SELECT * FROM options WHERE controller = ? AND type = ? AND `table` = ? AND user = ?', $controller, 'view', $table, $this->Auth->User['id'])->fetchAll()->all();
    $views = [];
    foreach($results as $result){
      array_push($views, $result['name']);
    }
    return $views;
  }

		public function modalImport($table, $id, $settings = null){
			$name = $table;
			$defaults['datatable']['hide'] = [];
			$title = $this->Language->Import;
			$result = $id;
			if($settings != null){
			}
			if($this->Auth->valid('plugin',$table,3)){
				$build = '
					<form action="'.$this->Controller->URL.'" method="post" role="form" enctype="multipart/form-data">
						<div class="modal fade" id="modal-import-'.$table.'" role="dialog" aria-hidden="true">
							<div class="modal-dialog" role="document">
								<div class="modal-content">
									<div class="modal-header bg-primary">
										<h5 class="modal-title text-light">'.$title.'</h5>
										<button type="button" class="close" data-dismiss="modal" aria-label="Close">
											<span aria-hidden="true">&times;</span>
										</button>
									</div>
									<div class="modal-body">
										<div class="form-group row">
											<div class="input-group">
												<div class="input-group-prepend">
													<span class="input-group-text">
														<i class="fas fa-file-csv mr-2"></i>'.$this->Language->_ARRAY['CSV File'].'
													</span>
												</div>
												<div class="custom-file">
													<input type="file" class="custom-file-input" name="fileCSV" id="fileCSV">
													<label class="custom-file-label" for="fileCSV">'.$this->Language->_ARRAY['Choose file'].'</label>
												</div>
											</div>
										</div>
										<div class="form-group row">
											<div class="input-group">
												<div class="input-group-prepend">
													<span class="input-group-text">
														<i class="fas fa-heading mr-2"></i>'.$this->Language->_ARRAY['Has headers'].'
													</span>
												</div>
												<div class="icheck-primary d-inline ml-4">
	                        <input type="checkbox" id="asHeaders" name="asHeaders" checked="">
	                        <label for="asHeaders"></label>
	                      </div>
											</div>
										</div>
										<div class="form-group row">
											<div class="input-group">
												<div class="input-group-prepend">
													<span class="input-group-text">
														<i class="far fa-hand-point-up mr-2"></i>'.$this->Language->_ARRAY['Identification Column'].'
													</span>
												</div>
												<select class="form-control select2bs4 select2-hidden-accessible" name="identify" aria-hidden="true">
				';
				$count = 0;
				foreach($this->Auth->getHeaders($table) as $header){
					$selected = '';
					if($header == 'id'){ $selected = 'selected="selected"'; }
					$build .= '<option value="'.$header.'" '.$selected.'>'.ucwords(str_replace('_',' ',$header)).'</option>';
					$count++;
				}
				$build .= '
		                  	</select>
											</div>
										</div>
									</div>
									<div class="modal-footer">
										<button type="button" class="btn btn-secondary" data-dismiss="modal">'.$this->Language->Close.'</button>
										<button type="submit" name="importCSV" class="btn btn-primary">
											<i class="fas fa-file-import mr-1"></i>
											'.$this->Language->Import.'
										</button>
									</div>
								</div>
							</div>
						</div>
					</form>
				';
				$build .= '
					<script>
						$(document).ready(function(){
							$("#btn-import-'.$table.'").click(function(){
									$("#modal-import-'.$table.'").modal();
							});
						});
					</script>
				';
				return $build;
			}
		}

    public function modalDelete($table, $id, $settings = null){
        $name = $table;
        $defaults['datatable']['hide'] = [];
        $title = $this->Language->Are_You_Sure;
        $result = $id;
        if($settings != null){
            if(isset($settings["name"])){
                $name = $settings["name"];
            }
            if(isset($settings["title"]['delete'])){
                $title = $settings["title"]['delete'];
            }
            if(isset($settings["hide"]['delete'])){
                $defaults['datatable']['hide'] = $settings["hide"]['delete'];
            }
            if(isset($settings["relationship"])){
                $results = $this->Auth->get($settings["relationship"]['id']['table'], $id, $settings["relationship"]['id']['match'])->fetchArray()->all();
                $result = $results[$settings["relationship"]['id']['return']];
            }
        }
				if($this->Auth->valid('plugin',$table,4)){
            $build = '
                <form action="'.$this->Controller->URL.'" method="post" role="form">
                  <div class="modal fade" id="modal-delete-'.$table.'-'.$id.'" role="dialog" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header bg-danger">
                          <h5 class="modal-title text-light">'.$title.'</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                            '.$this->Language->You_are_about_to_delete_the_following.' '.$name.': <b>'.$result.'</b>.
                            <input type="text" style="display:none;" value="'.$id.'" name="id">
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-dismiss="modal">'.$this->Language->Close.'</button>
                          <button type="submit" name="Delete-'.$table.'" class="btn btn-danger"><i class="fas fa-trash-alt mr-1"></i>'.$this->Language->Delete.'</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
            ';
            $build .= '
                <script>
                    $(document).ready(function(){
                        $("#btn-delete-'.$table.'-'.$id.'").click(function(){
                            $("#modal-delete-'.$table.'-'.$id.'").modal();
                        });
                    });
                </script>
            ';
            return $build;
        }
    }

    public function modalColumns($table, $settings = null){
        $name = $table;
        $defaults['datatable']['hide'] = [];
        $title = $this->Language->Select_the_columns_you_want_to_hide;
        if($settings != null){
            if(isset($settings["name"])){
                $name = $settings["name"];
            }
            if(isset($settings["title"]['columns'])){
                $title = $settings["title"]['columns'];
            }
            if(isset($settings["hide"]['read'])){
                $defaults['datatable']['hide'] = $settings["hide"]['read'];
            }
        }
        $views = $this->getViews($table,$this->Plugin);
				if($this->Auth->valid('plugin','options',1)){
            $build = '<form action="'.$this->Controller->URL.'" method="post">
                        <div class="modal fade" id="modal-columns-'.$table.'" role="dialog" aria-hidden="true">
                          <div class="modal-dialog" role="document">
                            <div class="modal-content">
                              <div class="modal-header bg-info">
                                <h5 class="modal-title text-light"><i class="fas fa-eye mr-1"></i>'.$title.'</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <div class="modal-body">';
            foreach($this->Auth->getHeadersAll($table) as $header) {
                if (!in_array($header['COLUMN_NAME'], $this->skip)) {
                    if (!in_array($header['COLUMN_NAME'], $defaults['datatable']['hide'])) {
                        if (in_array($header['COLUMN_NAME'], $views)) { $CHECK = " checked"; } else { $CHECK = ''; }
                        $build .= '     <div class="form-check">
                                            <input class="form-check-input" type="checkbox" value="true" id="ColView-'.$table.'-'.$header['ORDINAL_POSITION'].'" name="'.$header['COLUMN_NAME'].'"'.$CHECK.'>
                                            <label class="form-check-label" for="ColView-'.$table.'-'.$header['ORDINAL_POSITION'].'">
                                                '.ucwords($this->Language->_ARRAY[$header['COLUMN_NAME']]).'
                                            </label>
                                        </div>
                        ';
                    }
                }
            }
            $build .= '       </div>
                              <div class="modal-footer">
                                <input type="hidden" style="display:none" name="table" value="'.$table.'">
                                <input type="hidden" style="display:none" name="controller" value="'.$this->Plugin.'">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">'.$this->Language->Close.'</button>
                                <button type="submit" name="ColViews" class="btn btn-info"><i class="fas fa-eye mr-1"></i>'.$this->Language->Hide.'</button>
                              </div>
                            </div>
                          </div>
                        </div>
                    </form>
            ';
            $build .= ' <script>
                            $(document).ready(function(){
                                $("#btn-columns-'.$table.'").click(function(){
                                    $("#modal-columns-'.$table.'").modal();
                                });
                            });
                        </script>
            ';
            return $build;
        }
    }

    public function modalFilters($table, $settings = null){
        $name = $table;
        $title = $this->Language->Select_your_filters;
        $defaults['datatable']['hide'] = [];
        $filters = $this->getFilters($table,$this->Plugin);
        $views = $this->getViews($table,$this->Plugin);
        if($settings != null){
            if(isset($settings["name"])){
                $name = $settings["name"];
            }
            if(isset($settings["title"]['filters'])){
                $title = $settings["title"]['filters'];
            }
            if(isset($settings["hide"]['read'])){
                $defaults['datatable']['hide'] = $settings["hide"]['read'];
            }
        }
				if($this->Auth->valid('plugin','options',1)){
            $build = '<form action="'.$this->Controller->URL.'" method="post">
                        <div class="modal fade" id="modal-filters-'.$table.'" role="dialog" aria-hidden="true">
                          <div class="modal-dialog" role="document">
                            <div class="modal-content">
                              <div class="modal-header bg-warning">
                                <h5 class="modal-title text-light"><i class="fas fa-filter mr-1"></i>'.$title.'</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <div class="modal-body">';
            foreach($this->Auth->getHeadersAll($table) as $header) {
                if (!in_array($header['COLUMN_NAME'], $this->skip)) {
                    if (!in_array($header['COLUMN_NAME'], $views)) {
                        if (!in_array($header['COLUMN_NAME'], $defaults['datatable']['hide'])) {
                            $apply_like_filter = "";
                            foreach($filters['filters']['likes'] as $like_filter) {
                                if($like_filter['name'] == $header['COLUMN_NAME']){
                                    $apply_like_filter = $like_filter['value'];
                                }
                            }
                            $apply_unlike_filter = "";
                            foreach($filters['filters']['unlikes'] as $unlike_filter) {
                                if($unlike_filter['name'] == $header['COLUMN_NAME']){
                                    $apply_unlike_filter = $unlike_filter['value'];
                                }
                            }
                            $build .= '         <div class="input-group">
                                                    <div class="input-group-prepend">
                                                        <span class="input-group-text" style="width:110px;" id="ColFilter'.$header['ORDINAL_POSITION'].'">'.ucwords($this->Language->_ARRAY[$header['COLUMN_NAME']]).'</span>
                                                    </div>';
                            if($header['DATA_TYPE'] == "int"){
                                $build .= '             <input name="like-'.$header['COLUMN_NAME'].'" type="number" placeholder="GREATER THEN" class="form-control col" aria-label="'.ucwords($this->Language->_ARRAY[$header['COLUMN_NAME']]).'" aria-describedby="ColFilter'.$header['ORDINAL_POSITION'].'" value="'.$apply_like_filter.'">
                                                        <input name="unlike-'.$header['COLUMN_NAME'].'" type="number" placeholder="SMALLER THEN" class="form-control col" aria-label="'.ucwords($this->Language->_ARRAY[$header['COLUMN_NAME']]).'" aria-describedby="ColFilter'.$header['ORDINAL_POSITION'].'" value="'.$apply_unlike_filter.'">';
                            } else {
                                $build .= '             <input name="like-'.$header['COLUMN_NAME'].'" type="text" placeholder="LIKE" class="form-control col" aria-label="'.ucwords($this->Language->_ARRAY[$header['COLUMN_NAME']]).'" aria-describedby="ColFilter'.$header['ORDINAL_POSITION'].'" value="'.$apply_like_filter.'">
                                                        <input name="unlike-'.$header['COLUMN_NAME'].'" type="text" placeholder="UNLIKE" class="form-control col" aria-label="'.ucwords($this->Language->_ARRAY[$header['COLUMN_NAME']]).'" aria-describedby="ColFilter'.$header['ORDINAL_POSITION'].'" value="'.$apply_unlike_filter.'">';
                            }
                            $build .= '             </div>';
                        }
                    }
                }
            }
            $build .= '       </div>
                              <div class="modal-footer">
                                <input type="hidden" style="display:none" name="table" value="'.$table.'">
                                <input type="hidden" style="display:none" name="controller" value="'.$this->Plugin.'">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">'.$this->Language->Close.'</button>
                                <button type="submit" name="ColFilters" class="btn btn-warning text-light"><i class="fas fa-filter mr-1"></i>'.$this->Language->Filter.'</button>
                              </div>
                            </div>
                          </div>
                        </div>
                    </form>
            ';
            $build .= ' <script>
                            $(document).ready(function(){
                                $("#btn-filters-'.$table.'").click(function(){
                                    $("#modal-filters-'.$table.'").modal();
                                });
                            });
                        </script>
            ';
            return $build;
        }
    }

    public function modalNew($table, $settings = null){
      $fa = "";
      $name = $table;
      $defaults['datatable']['hide'] = [];
      if($settings != null){
        if(isset($settings["icon"])){
          $fa = '<i class="'.$settings["icon"].' mr-1"></i>';
        }
        if(isset($settings["name"])){
          $name = $settings["name"];
        }
        if(isset($settings["hide"]['create'])){
          $defaults['datatable']['hide'] = $settings["hide"]['create'];
        }
      }
      $title = $this->Language->Create_a_new.' '.$name;
      if($settings != null){
        if(isset($settings["title"]['create'])){
          $title = $settings["title"]['create'];
        }
      }
			if($this->Auth->valid('plugin',$table,2)){
        $build = '
					<form action="'.$this->Controller->URL.'" method="post" role="form">
            <div class="modal fade" id="modal-new-'.$table.'" role="dialog" aria-hidden="true">
              <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                  <div class="modal-header bg-success">
                    <h5 class="modal-title text-light">'.$fa.$title.'</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body"><div class="col-md-12"><div class="row">';
        $fieldcount=0;
        $fieldheaders=$this->Auth->getHeadersAll($table);
        $headercount=0;
        foreach($fieldheaders as $header) {
          if (!in_array($header['COLUMN_NAME'], $this->skip)) {
            if (!in_array($header['COLUMN_NAME'], $defaults['datatable']['hide'])) {
              $headercount++;
            }
          }
        }
        foreach($fieldheaders as $header) {
					$config = [];
          if (!in_array($header['COLUMN_NAME'], $this->skip)) {
            if ((!in_array($header['COLUMN_NAME'], $defaults['datatable']['hide']))&&($header['COLUMN_NAME'] != 'id')) {
              if((isset($_POST['Create-'.$table]))&&(isset($_POST[$header['COLUMN_NAME']]))){ $POST = $_POST[$header['COLUMN_NAME']]; } else { $POST = ''; }
              $fieldcount++;
              if((($fieldcount % 2 != 0)&&($fieldcount == $headercount))||($headercount < 3)){
                $build .= '<div class="col-md-12">';
              } else {
                $build .= '<div class="col-md-6">';
              }
							if((isset($settings['list'][$header['COLUMN_NAME']]))&&(!empty($settings['list'][$header['COLUMN_NAME']]))){
								$config['list'] = $settings['list'][$header['COLUMN_NAME']];
							}
							$build .= $this->Form->field($header['COLUMN_NAME'], $POST, $config);
              $build .= '</div>';
            }
          }
        }
        $build .= '</div></div>';
        if((isset($settings['form']))&&(!empty($settings['form']))){
          if((isset($settings['form']['create']))&&(!empty($settings['form']['create']))){
            foreach($settings['form']['create'] as $title => $form){
              $build .= '
                <div class="row">
                  <div class="col-md-12">
                    <div class="card card-secondary">
                      <div class="card-header">
                        <h3 class="card-title">'.ucwords($title).'</h3>
                      </div>
                      <div class="card-body">
              ';
              $build .= '<div class="col-md-12"><div class="row">';
              $fieldcount = 0;
              $headercount = count($form);
              foreach($form as $field){
                $fieldcount++;
                if((($fieldcount % 2 != 0)&&($fieldcount == $headercount))||($headercount < 3)){
                  $build .= '<div class="col-md-12">';
                } else {
                  $build .= '<div class="col-md-6">';
                }
                if(isset($_POST['Create-'.$table],$_POST[$field])){ $POST = $_POST[$field]; } else { $POST = ''; }
                $header['COLUMN_NAME'] = $field;
                if((isset($settings['list'][$field]))&&(!empty($settings['list'][$field]))){
                  $list = $settings['list'][$field];
                } else {
                  $list = [];
                }
                $build .= $this->Form->field($header['COLUMN_NAME'], $POST, ['list' => $list]);
                $build .= '</div>';
              }
              $build .= '</div></div>';
              $build .= '
                      </div>
                    </div>
                  </div>
                </div>
              ';
            }
          }
        }
        $build .= '
					</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">'.$this->Language->Close.'</button>
            <button type="submit" name="Create-'.$table.'" class="btn btn-success">'.$fa.$this->Language->Create.'</button>
          </div>
        </div>
      </div>
    </div>
  </form>';
        $build .= ' <script>
                        $(document).ready(function(){
                            $("#btn-new-'.$table.'").click(function(){
                                $("#modal-new-'.$table.'").modal();
                            });
                        });
                    </script>
        ';
        return $build;
      }
    }
    public function modalCustom($name, $btn, $color, $size, $type, $settings = null){
        $fa = "";
        $defaults['datatable']['hide'] = [];
        if($settings != null){
          if(isset($settings["icon"])){
            $fa = '<i class="'.$settings["icon"].' mr-1"></i>';
          }
          if(isset($settings["name"])){
            $name = $settings["name"];
          }
          if(isset($settings["hide"]['custom'])){
            $defaults['datatable']['hide'] = $settings["hide"]['custom'];
          }
        }
        if(($settings != null)&&(isset($settings["title"][$name]))){
          $title = $settings["title"][$name];
        } else {
          $title = $this->Language->$name;
        }
        $build = '  <form action="'.$this->Controller->URL.'" method="post" role="form">
                      <div class="modal fade" id="'.$name.'" role="dialog" aria-hidden="true">
                        <div class="modal-dialog modal-'.$size.'" role="document">
                          <div class="modal-content">
                            <div class="modal-header bg-'.$color.'">
                              <h5 class="modal-title text-light">'.$fa.$title.'</h5>
                              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div class="modal-body">
        ';
        if($type == "form"){
            if((isset($settings['form']))&&(!empty($settings['form']))){
                if((isset($settings['form']['custom']))&&(!empty($settings['form']['custom']))){
                    $build .= '<div class="col-md-12"><div class="row">';
                    $fieldcount = 0;
                    $headercount = count($settings['form']['custom']);
										$fieldopt=[];
                    foreach($settings['form']['custom'] as $field => $opt){
                        $fieldcount++;
                        if((($fieldcount % 2 != 0)&&($fieldcount == $headercount))||($headercount < 3)){
                            $build .= '<div class="col-md-12">';
                        } else {
                            $build .= '<div class="col-md-6">';
                        }
                        if(isset($_POST['Custom-'.$name])){ $POST = $_POST[$field]; } else { $POST = ''; }
                        $header['COLUMN_NAME'] = $field;
                        if(isset($settings['list'][$field])){
                            if(!empty($settings['list'][$field])){
                                $list = $settings['list'][$field];
                            } else {
                                $list[""] = $this->Language->_ARRAY['No Record'];
                            }
                        } else {
                            $list = [];
                        }
												if((isset($opt['selectall']))&&(!empty($opt['selectall']))){
													$fieldopt['selectall']=$opt['selectall'];
												}
												if((isset($list))&&(!empty($list))){
													$fieldopt['list']=$list;
												}
												if((isset($opt['type']))&&(!empty($opt['type']))&&(method_exists($this->Form, $opt['type']))){
													$method=$opt['type'];
													$build .= $this->Form->$method($header['COLUMN_NAME'], $POST, $fieldopt);
												} else {
													$build .= $this->Form->field($header['COLUMN_NAME'], $POST, $fieldopt);
												}
                        $build .= '</div>';
                    }
                    $build .= '</div></div>';
                }
            }
        } elseif($type == "warning"){
            $build .= $settings['text'];
        }
        if((isset($settings['hidden']))&&(!empty($settings['hidden']))){
            foreach($settings['hidden'] as $input => $value){
                $build .= '<input type="hidden" style="display:none;" name="'.$input.'" value="'.$value.'">';
            }
        }
        $build .= '         </div>
                            <div class="modal-footer">
                              <button type="button" class="btn btn-secondary" data-dismiss="modal">'.$this->Language->Close.'</button>
        ';
        if((isset($settings['submit']))&&(!empty($settings['submit']))){
            $subname = $settings['submit'];
        } else {
            $subname = 'Custom-'.$name;
        }
        if($type == "form"){
            $build .= '<button type="submit" name="'.$subname.'" class="btn btn-'.$color.'">'.$fa.$this->Language->Save.'</button>';
        }
        if($type == "warning"){
            $build .= '<button type="submit" name="'.$subname.'" class="btn btn-'.$color.'">'.$fa.$this->Language->Confirm.'</button>';
        }
        $build .= '</div>
                          </div>
                        </div>
                      </div>
                    </form>';
        $build .= ' <script>
                        $(document).ready(function(){
                            $("#'.$btn.'").click(function(){
                                $("#'.$name.'").modal();
                            });
                        });
                    </script>
        ';
        return $build;
    }

	public function listingCustom($listing, $table, $settings = null){
		$fa = "";
		$defaults['datatable']['hide'] = [];
		if($settings != null){
				if(isset($settings["icon"])){
						$fa = '<i class="'.$settings["icon"].' mr-1"></i>';
				}
				if(isset($settings["hide"]['read'])){
						$defaults['datatable']['hide'] = $settings["hide"]['read'];
				}
		}
		$build = '<div class="row"><div class="col-12">';
        if((isset($settings['controls']['buttons']))&&(!empty($settings['controls']['buttons']))){
          $build .= '<div class="btn-group btn-block">';
          foreach($settings['controls']['buttons'] as $nav => $opt){
            if((isset($opt['text']))&&(!empty($opt['text']))){
              $text = $opt['text'];
              $text = $this->Language->$text;
            } else {
              $text = "";
            }
						if($this->Auth->valid('button',$nav,1)){
              if((isset($opt['target']))&&($opt['target'] == "modal")){
                $build .= '<button type="button" class="btn btn-'.$opt['color'].' btn-flat" id="'.$opt["targetid"].'"><i class="'.$opt["icon"].' mr-1"></i>'.ucwords($text).'</button>';
              } else {
                $build .= '<a href="'.$opt['targetid'].'" class="btn btn-'.$opt['color'].' btn-flat"><i class="'.$opt["icon"].' mr-1"></i>'.ucwords($text).'</a>';
              }
            }
          }
          $build .= '</div>';
        }
				$striped = 'table-striped';
				if((isset($settings['background']))&&(!empty($settings['background']))){ $striped = ''; }
        $build .= '
					<div class="table-responsive">
						<table class="table table-hover '.$striped.' table-bordered display dt-responsive" style="width:100%">
							<thead class="thead-dark">
								<tr>';
		if(!empty($listing)){
			foreach(current($listing) as $key => $item){
				if (!in_array($key, $defaults['datatable']['hide'])) {
					if($this->Auth->valid('field',$key,1,$table)){
						$build .= '<th>'.ucwords($this->Language->_ARRAY[$key]).'</th>';
					}
				}
			}
		}
		$build .= '
						<th style="width:150px;">'.$this->Language->Action.'</th>
					</tr>
				</thead>
				<tbody>
		';
		if(!empty($listing)){
			foreach($listing as $id => $cols){
				$bgcolor = '';
				if((isset($settings['background']))&&(!empty($settings['background']))){
					foreach($settings['background'] as $bgkey => $bg){
						if((empty($bg))||(!isset($bg['condition']))){
							$bgcolor = $bgkey;
						} else {
							foreach($bg['condition'] as $condition => $parm){
								switch ($parm['condition']) {
									case "in_array":
										$array = explode(',',trim($item[$condition],','));
										foreach($array as $element){
												if(in_array($element,$parm['value'])){
														$bgcolor = $bgkey;
												}
										}
										break;
									case "not_in_array":
										$display = TRUE;
										$array = explode(',',trim($item[$condition],','));
										foreach($array as $element){
												if(in_array($element,$parm['value'])){
														$bgcolor = $bgkey;
												}
										}
										break;
									case "not_equal":
										if($item[$condition] != $parm['value']){
												$bgcolor = $bgkey;
										}
										break;
									default:
										if($item[$condition] == $parm['value']){
												$bgcolor = $bgkey;
										}
										break;
								}
							}
						}
					}
				}
				$clickable = '';
				if($settings != null){
					if(isset($settings["field"])){
						$url = '/'.$table.'/view/'.$cols[$settings["field"]];
					} else {
						$url = '/'.$table.'/view/'.$id;
					}
					if(isset($settings["url"])){
						$url = $settings["url"];
					}
				}
				if((isset($settings["clickable-row"]))&&($settings['clickable-row'])){
					if($this->Auth->valid('button','details',1)){
						if((isset($settings["details"]))&&($settings["details"]=='modal')){
							$clickable='btn-view-'.$table.'-'.$item["id"].'" style="cursor:pointer;';
						} else {
							$clickable='clickable-row" data-href="'.$url;
						}
					}
				}
				$build .= '<tr class="'.$bgcolor.'">';
				foreach($cols as $key => $item){
					if (!in_array($key, $defaults['datatable']['hide'])) {
						$build .= '<td class=" '.$clickable.'">';
						$build .= $this->Table->field($key, $item, $table);
						$build .= '</td>';
					}
				}
        $build .= '<td>';
        $build .= '<div class="btn-group">';
				if($this->Auth->valid('button','details',1)){
  				if((isset($settings["details"]))&&($settings["details"]=='modal')){
  					$build .= '<button type=button class="btn btn-primary btn-sm btn-view-'.$table.'-'.$item["id"].'"><i class="fas fa-info-circle mr-1"></i>'.$this->Language->Details.'</button>';
  				} else {
  					$build .= '<a class="btn btn-primary btn-sm" href="'.$url.'"><i class="fas fa-info-circle mr-1"></i>'.$this->Language->Details.'</a>';
  				}
        }
        if((isset($defaults['datatable']['action']))&&(!empty($defaults['datatable']['action']))){
          foreach($defaults['datatable']['action'] as $nav => $opt){
            if((isset($opt['text']))&&(!empty($opt['text']))){
              $text = $opt['text'];
              $text = $this->Language->$text;
              $margin = 'mr-1';
            } else {
              $text = "";
              $margin = '';
            }
            $display = FALSE;
            if((isset($opt['condition']))&&(!empty($opt['condition']))){
              foreach($opt['condition'] as $condition => $parm){
                switch ($parm['condition']) {
                  case "in_array":
										$array = explode(',',trim($cols[$condition],','));
                    foreach($array as $element){
                      if(in_array(trim($element,' '),$parm['value'])){
                        $display = TRUE;
                      }
                    }
                    break;
                  case "not_in_array":
                    $display = TRUE;
                    $array = explode(',',trim($cols[$condition],','));
                    foreach($array as $element){
                      if(in_array(trim($element,' '),$parm['value'])){
                        $display = FALSE;
                      }
                    }
                    break;
                  case "not_equal":
                    if($cols[$condition] != $parm['value']){
                      $display = TRUE;
                    }
                    break;
                  default:
                    if($cols[$condition] == $parm['value']){
                      $display = TRUE;
                    }
                    break;
                }
              }
            } else {
              $display = TRUE;
            }
						$class='';
						if((isset($opt['class']))&&(!empty($opt['class']))){
							$class=$opt['class'];
						}
						$value='';
						if((isset($opt['value']))&&(!empty($opt['value']))&&($opt['value'])){
							$value=$id;
						}
						if($display){
							if($this->Auth->valid('button',$nav,1)){
								if((isset($opt['target']))&&($opt['target'] == "modal")){
									$build .= '<button type="button" value="'.$value.'" class="btn btn-'.$opt['color'].' btn-sm '.$class.'" id="'.$opt["targetid"].$id.'"><i class="'.$opt["icon"].' '.$margin.'"></i>'.ucwords($text).'</button>';
								} else {
									$build .= '<a href="'.$opt['targetid'].$id.'" class="btn btn-'.$opt['color'].' btn-sm '.$class.'"><i class="'.$opt["icon"].' '.$margin.'"></i>'.ucwords($text).'</a>';
								}
							}
						}
          }
        }
        $build .= '</div>';
        $build .= '</td>';
			}
		}
		$build .= '
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		';
		return $build;
	}

    public function listingSub($listing, $table = null, $of, $settings = null){
        $fa = "";
        $defaults['datatable']['hide'] = [];
        if($settings != null){
            if(isset($settings["icon"])){
                $fa = '<i class="'.$settings["icon"].' mr-1"></i>';
            }
            if(isset($settings["hide"]['read'])){
                $defaults['datatable']['hide'] = $settings["hide"]['read'];
            }
        }
        $build = '
            <div class="row">
                <div class="col-12">
                    <div class="btn-group btn-block">
        ';
				if((isset($settings['controls']['buttons']))&&(!empty($settings['controls']['buttons']))){
          foreach($settings['controls']['buttons'] as $nav => $opt){
            if((isset($opt['text']))&&(!empty($opt['text']))){
              $text = $opt['text'];
              $text = $this->Language->$text;
            } else {
              $text = "";
            }
						if($this->Auth->valid('button',$nav,1)){
              if((isset($opt['target']))&&($opt['target'] == "modal")){
                $build .= '<button type="button" class="btn btn-'.$opt['color'].' btn-flat" id="'.$opt["targetid"].'"><i class="'.$opt["icon"].' mr-1"></i>'.ucwords($text).'</button>';
              } else {
                $build .= '<a href="'.$opt['targetid'].'" class="btn btn-'.$opt['color'].' btn-flat"><i class="'.$opt["icon"].' mr-1"></i>'.ucwords($text).'</a>';
              }
            }
          }
        }
				if(((isset($settings["hide"]['buttons']))&&(!in_array('create',$settings["hide"]['buttons'])))||(!isset($settings["hide"]['buttons']))){
					if($this->Auth->valid('button','create',1)){
						if($this->Auth->valid('plugin',$table,2)){
              $build .= '
                <button type="button" class="btn btn-success btn-flat" id="btn-new-'.$table.'">
                  '.$fa.$this->Language->Create.'
                </button>
              ';
            }
	        }
				}
				if(((isset($settings["hide"]['buttons']))&&(!in_array('columns',$settings["hide"]['buttons'])))||(!isset($settings["hide"]['buttons']))){
					if($this->Auth->valid('button','columns',1)){
            $build .= '
              <button type="button" class="btn bg-info btn-flat" id="btn-columns-'.$table.'">
                <i class="fas fa-eye mr-1"></i>
                '.$this->Language->Columns.'
              </button>
            ';
	        }
				}
				if(((isset($settings["hide"]['buttons']))&&(!in_array('filters',$settings["hide"]['buttons'])))||(!isset($settings["hide"]['buttons']))){
					if($this->Auth->valid('button','filters',1)){
	          $build .= '
	            <button type="button" class="btn bg-warning btn-flat" id="btn-filters-'.$table.'">
	              <i class="fas fa-filter mr-1"></i>
	              '.$this->Language->Filters.'
	            </button>
	          ';
	        }
				}
        $build .= '</div>';
				if(((isset($settings["hide"]['buttons']))&&(!in_array('columns',$settings["hide"]['buttons'])))||(!isset($settings["hide"]['buttons']))){
	        $build .= $this->modalColumns($table, $settings);
				}
				if(((isset($settings["hide"]['buttons']))&&(!in_array('filters',$settings["hide"]['buttons'])))||(!isset($settings["hide"]['buttons']))){
	        $build .= $this->modalFilters($table, $settings);
				}
				if(((isset($settings["hide"]['buttons']))&&(!in_array('create',$settings["hide"]['buttons'])))||(!isset($settings["hide"]['buttons']))){
	        $build .= $this->modalNew($table, $settings);
				}
				$striped = 'table-striped';
				if((isset($settings['background']))&&(!empty($settings['background']))){ $striped = ''; }
        $build .= '<div class="table-responsive"><table class="table table-hover '.$striped.' table-bordered display dt-responsive" style="width:100%"><thead class="thead-dark"><tr>';
        $views = $this->getViews($table,$this->Plugin);
        foreach($this->Auth->getHeadersAll($table) as $header) {
          if (!in_array($header['COLUMN_NAME'], $this->skip)) {
            if (!in_array($header['COLUMN_NAME'], $views)) {
              if (!in_array($header['COLUMN_NAME'], $defaults['datatable']['hide'])) {
                $build .= '<th>'.ucwords($this->Language->_ARRAY[$header['COLUMN_NAME']]).'</th>';
              }
            }
          }
        }
        $build .= '<th style="width:150px;">'.$this->Language->Action.'</th></tr></thead><tbody>';
				if($this->Auth->valid('table',$table,1)){
            foreach($listing as $item) {
							$bgcolor = '';
							if((isset($settings['background']))&&(!empty($settings['background']))){
								foreach($settings['background'] as $bgkey => $bg){
									if((empty($bg))||(!isset($bg['condition']))){
										$bgcolor = $bgkey;
									} else {
										foreach($bg['condition'] as $condition => $parm){
											switch ($parm['condition']) {
												case "in_array":
													$array = explode(',',trim($item[$condition],','));
													foreach($array as $element){
															if(in_array($element,$parm['value'])){
																	$bgcolor = $bgkey;
															}
													}
													break;
												case "not_in_array":
													$display = TRUE;
													$array = explode(',',trim($item[$condition],','));
													foreach($array as $element){
															if(in_array($element,$parm['value'])){
																	$bgcolor = $bgkey;
															}
													}
													break;
												case "not_equal":
													if($item[$condition] != $parm['value']){
															$bgcolor = $bgkey;
													}
													break;
												default:
													if($item[$condition] == $parm['value']){
															$bgcolor = $bgkey;
													}
													break;
											}
										}
									}
								}
							}
								$clickable = '';
                $url = '/'.$table.'/view/'.$item["id"];
                if($settings != null){
                    if(isset($settings["field"])){
                        $url = '/'.$table.'/view/'.$item[$settings["field"]];
                    }
                    if(isset($settings["url"])){
                        $url = $settings["url"];
                    }
                }
								if((isset($settings["clickable-row"]))&&($settings['clickable-row'])){
									if($this->Auth->valid('button','details',1)){
										if((isset($settings["details"]))&&($settings["details"]=='modal')){
											$clickable='btn-view-'.$table.'-'.$item["id"].'" style="cursor:pointer;';
										} else {
											$clickable='clickable-row" data-href="'.$url;
										}
									}
								}
								$build .= '<tr class="'.$bgcolor.'">';
                foreach($this->Auth->getHeadersAll($table) as $header) {
                  if (!in_array($header['COLUMN_NAME'], $this->skip)) {
                    if (!in_array($header['COLUMN_NAME'], $views)) {
                      if (!in_array($header['COLUMN_NAME'], $defaults['datatable']['hide'])) {
												$build .= '<td class=" '.$clickable.'">';
												$build .= $this->Table->field($header['COLUMN_NAME'], $item[$header['COLUMN_NAME']], $table);
												$build .= '</td>';
                      }
                    }
                  }
                }
                $build .= '<td>';
								$build .= '<div class="btn-group">';
								if($this->Auth->valid('button','details',1)){
			    				if((isset($settings["details"]))&&($settings["details"]=='modal')){
			    					$build .= '<button type=button class="btn btn-primary btn-sm btn-view-'.$table.'-'.$item["id"].'"><i class="fas fa-info-circle mr-1"></i>'.$this->Language->Details.'</button>';
			    				} else {
			    					$build .= '<a class="btn btn-primary btn-sm" href="'.$url.'"><i class="fas fa-info-circle mr-1"></i>'.$this->Language->Details.'</a>';
			    				}
                }
                if((isset($defaults['datatable']['action']))&&(!empty($defaults['datatable']['action']))){
                  foreach($defaults['datatable']['action'] as $nav => $opt){
                    if((isset($opt['text']))&&(!empty($opt['text']))){
                      $text = $opt['text'];
                      $text = $this->Language->$text;
                      $margin = 'mr-1';
                    } else {
                      $text = "";
                      $margin = '';
                    }
                    $display = FALSE;
                    if((isset($opt['condition']))&&(!empty($opt['condition']))){
                      foreach($opt['condition'] as $condition => $parm){
                        switch ($parm['condition']) {
                          case "in_array":
														$array = explode(',',trim($cols[$condition],','));
                            foreach($array as $element){
                              if(in_array(trim($element,' '),$parm['value'])){
                                $display = TRUE;
                              }
                            }
                            break;
                          case "not_in_array":
                            $display = TRUE;
                            $array = explode(',',trim($cols[$condition],','));
                            foreach($array as $element){
                              if(in_array(trim($element,' '),$parm['value'])){
                                $display = FALSE;
                              }
                            }
                            break;
                          case "not_equal":
                            if($cols[$condition] != $parm['value']){
                              $display = TRUE;
                            }
                            break;
                          default:
                            if($cols[$condition] == $parm['value']){
                              $display = TRUE;
                            }
                            break;
                        }
                      }
                    } else {
                      $display = TRUE;
                    }
										$class='';
										if((isset($opt['class']))&&(!empty($opt['class']))){
											$class=$opt['class'];
										}
										$value='';
										if((isset($opt['value']))&&(!empty($opt['value']))&&($opt['value'])){
											$value=$item["id"];
										}
                    if($display){
											if($this->Auth->valid('button',$nav,1)){
                        if((isset($opt['target']))&&($opt['target'] == "modal")){
                          $build .= '<button type="button" value="'.$value.'" class="btn btn-'.$opt['color'].' btn-sm '.$class.'" id="'.$opt["targetid"].$item["id"].'"><i class="'.$opt["icon"].' '.$margin.'"></i>'.ucwords($text).'</button>';
                        } else {
                          $build .= '<a href="'.$opt['targetid'].$item["id"].'" class="btn btn-'.$opt['color'].' btn-sm '.$class.'"><i class="'.$opt["icon"].' '.$margin.'"></i>'.ucwords($text).'</a>';
                        }
                      }
                    }
                  }
                }
								if(((isset($settings["hide"]['buttons']))&&(!in_array('delete',$settings["hide"]['buttons'])))||(!isset($settings["hide"]['buttons']))){
									if($this->Auth->valid('plugin',$table,4)){
										if($this->Auth->valid('button','delete',1)){
	                    $build .= '<button type=button class="btn btn-danger btn-sm" id="btn-delete-'.$table.'-'.$item["id"].'"><i class="fas fa-trash-alt"></i></button>';
	                  }
	                }
								}
                $build .= '</div>';
                $build .= $this->modalDelete($table, $item["id"], $settings);
                $build .= '</td></tr>';
            }
        }
        $build .= '
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        ';
        return $build;
    }

    public function listingFull($listing, $settings = null){
        $fa = "";
        $defaults['datatable']['hide'] = [];
				$table = $this->Plugin;
        if($settings != null){
            if(isset($settings["icon"])){
              $fa = '<i class="'.$settings["icon"].' mr-1"></i>';
            }
            if(isset($settings["hide"]['read'])){
              $defaults['datatable']['hide'] = $settings["hide"]['read'];
            }
            if(isset($settings["table"])){
              $table = $settings["table"];
            }
            if(isset($settings["plugin"])){
              $this->Plugin = $settings["plugin"];
            }
        }
        $filters = $this->getFilters($table,$this->Plugin);
        $views = $this->getViews($table,$this->Plugin);
        $build = '
          <div class="col-md-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">'.$fa.$this->Language->Listing.'</h3>
                <div class="card-tools">
                    <div class="btn-group">';
				if((isset($settings['controls']['buttons']))&&(!empty($settings['controls']['buttons']))){
          foreach($settings['controls']['buttons'] as $nav => $opt){
            if((isset($opt['text']))&&(!empty($opt['text']))){
              $text = $opt['text'];
              $text = $this->Language->$text;
            } else {
              $text = "";
            }
						if($this->Auth->valid('button',$nav,1)){
              if((isset($opt['target']))&&($opt['target'] == "modal")){
                $build .= '<button type="button" class="btn btn-'.$opt['color'].' btn-flat" id="'.$opt["targetid"].'"><i class="'.$opt["icon"].' mr-1"></i>'.ucwords($text).'</button>';
              } else {
                $build .= '<a href="'.$opt['targetid'].'" class="btn btn-'.$opt['color'].' btn-flat"><i class="'.$opt["icon"].' mr-1"></i>'.ucwords($text).'</a>';
              }
            }
          }
        }
				if($this->Auth->valid('button','create',1)){
					if((!isset($settings["hide"]['buttons']))||(!in_array('create',$settings["hide"]['buttons']))){
						if($this->Auth->valid('plugin',$table,2)){
	            $build .= '
	              <button type="button" class="btn btn-success btn-sm" id="btn-new-'.$table.'">
	                '.$fa.$this->Language->Create.'
	              </button>
	            ';
	          }
	        }
				}
				if($this->Auth->valid('plugin','options',1)){
					if((!isset($settings["hide"]['buttons']))||(!in_array('columns',$settings["hide"]['buttons']))){
						if($this->Auth->valid('button','columns',1)){
	            $build .= '
	              <button type="button" class="btn btn-info btn-sm" id="btn-columns-'.$table.'">
	                <i class="fas fa-eye mr-1"></i>
	                '.$this->Language->Columns.'
	              </button>
	            ';
	          }
					}
					if((!isset($settings["hide"]['buttons']))||(!in_array('filters',$settings["hide"]['buttons']))){
						if($this->Auth->valid('button','filters',1)){
	            $build .= '
	              <button type="button" class="btn btn-warning btn-sm" id="btn-filters-'.$table.'">
	                <i class="fas fa-filter mr-1"></i>
	                '.$this->Language->Filters.'
	              </button>
	            ';
	          }
					}
					if((!isset($settings["hide"]['buttons']))||(!in_array('import',$settings["hide"]['buttons']))){
						if($this->Auth->valid('button','import',1)){
	            $build .= '
	              <button type="button" class="btn btn-primary btn-sm" id="btn-import-'.$table.'">
	                <i class="fas fa-file-import mr-1"></i>
	                '.$this->Language->Import.'
	              </button>
	            ';
	          }
					}
        }
        $build .= ' </div>';
        $build .= $this->modalColumns($table, $settings);
        $build .= $this->modalFilters($table, $settings);
        $build .= $this->modalNew($table, $settings);
        $build .= $this->modalImport($table, $settings);
				$striped = 'table-striped';
				if((isset($settings['background']))&&(!empty($settings['background']))){ $striped = ''; }
        $build .= '</div>
              </div>
              <div class="card-body table-responsive p-0">
                  <table class="table table-hover '.$striped.' table-bordered display dt-responsive" style="width:100%">
                      <thead class="thead-dark">
                          <tr>';
        foreach($this->Auth->getHeadersAll($table) as $header){
					if (!in_array($header['COLUMN_NAME'], $this->skip)) {
            if (!in_array($header["COLUMN_NAME"], $views)) {
                if (!in_array($header['COLUMN_NAME'], $defaults['datatable']['hide'])) {
                  $th = ucwords($this->Language->_ARRAY[$header['COLUMN_NAME']]);
                	$build .= '<th>'.$th.'</th>';
                }
            }
					}
        }
        $build .= '         <th style="width:150px;">'.$this->Language->Action.'</th>
                          </tr>
                      </thead>
                      <tbody>';
				if($this->Auth->valid('table',$table,1)){
            foreach($listing as $item) {
							$bgcolor = '';
							if((isset($settings['background']))&&(!empty($settings['background']))){
								foreach($settings['background'] as $bgkey => $bg){
									if((empty($bg))||(!isset($bg['condition']))){
										$bgcolor = $bgkey;
									} else {
										foreach($bg['condition'] as $condition => $parm){
											switch ($parm['condition']) {
												case "in_array":
													$array = explode(',',trim($item[$condition],','));
													foreach($array as $element){
															if(in_array($element,$parm['value'])){
																	$bgcolor = $bgkey;
															}
													}
													break;
												case "not_in_array":
													$display = TRUE;
													$array = explode(',',trim($item[$condition],','));
													foreach($array as $element){
															if(in_array($element,$parm['value'])){
																	$bgcolor = $bgkey;
															}
													}
													break;
												case "not_equal":
													if($item[$condition] != $parm['value']){
															$bgcolor = $bgkey;
													}
													break;
												default:
													if($item[$condition] == $parm['value']){
															$bgcolor = $bgkey;
													}
													break;
											}
										}
									}
								}
							}
							$clickable = '';
							$url = '/'.$table.'/view/'.$item["id"];
							if($settings != null){
									if(isset($settings["field"])){
											$url = '/'.$table.'/view/'.$item[$settings["field"]];
									}
									if(isset($settings["url"])){
											$url = $settings["url"];
									}
							}
							if((isset($settings["clickable-row"]))&&($settings['clickable-row'])){
								if($this->Auth->valid('button','details',1)){
									if((isset($settings["details"]))&&($settings["details"]=='modal')){
										$clickable='btn-view-'.$table.'-'.$item["id"].'" style="cursor:pointer;';
									} else {
										$clickable='clickable-row" data-href="'.$url;
									}
								}
							}
							$build .= '<tr class="'.$bgcolor.'">';
							foreach($this->Auth->getHeadersAll($table) as $header) {
								if (!in_array($header['COLUMN_NAME'], $this->skip)) {
									if (!in_array($header['COLUMN_NAME'], $views)) {
										if (!in_array($header['COLUMN_NAME'], $defaults['datatable']['hide'])) {
											$build .= '<td class=" '.$clickable.'">';
											$build .= $this->Table->field($header['COLUMN_NAME'], $item[$header['COLUMN_NAME']], $table);
											$build .= '</td>';
										}
									}
								}
							}
							$build .= '<td>';
							$build .= '<div class="btn-group">';
							if($this->Auth->valid('button','details',1)){
								if((isset($settings["details"]))&&($settings["details"]=='modal')){
									$build .= '<button type=button class="btn btn-primary btn-sm btn-view-'.$table.'-'.$item["id"].'"><i class="fas fa-info-circle mr-1"></i>'.$this->Language->Details.'</button>';
								} else {
									$build .= '<a class="btn btn-primary btn-sm" href="'.$url.'"><i class="fas fa-info-circle mr-1"></i>'.$this->Language->Details.'</a>';
								}
							}
							if((isset($defaults['datatable']['action']))&&(!empty($defaults['datatable']['action']))){
								foreach($defaults['datatable']['action'] as $nav => $opt){
									if((isset($opt['text']))&&(!empty($opt['text']))){
										$text = $opt['text'];
										$text = $this->Language->$text;
										$margin = 'mr-1';
									} else {
										$text = "";
										$margin = '';
									}
									$display = FALSE;
									if((isset($opt['condition']))&&(!empty($opt['condition']))){
										foreach($opt['condition'] as $condition => $parm){
											switch ($parm['condition']) {
												case "in_array":
													$array = explode(',',trim($cols[$condition],','));
													foreach($array as $element){
														if(in_array(trim($element,' '),$parm['value'])){
															$display = TRUE;
														}
													}
													break;
												case "not_in_array":
													$display = TRUE;
													$array = explode(',',trim($cols[$condition],','));
													foreach($array as $element){
														if(in_array(trim($element,' '),$parm['value'])){
															$display = FALSE;
														}
													}
													break;
												case "not_equal":
													if($cols[$condition] != $parm['value']){
														$display = TRUE;
													}
													break;
												default:
													if($cols[$condition] == $parm['value']){
														$display = TRUE;
													}
													break;
											}
										}
									} else {
										$display = TRUE;
									}
									$class='';
									if((isset($opt['class']))&&(!empty($opt['class']))){
										$class=$opt['class'];
									}
									$value='';
									if((isset($opt['value']))&&(!empty($opt['value']))&&($opt['value'])){
										$value=$item["id"];
									}
									if($display){
										if($this->Auth->valid('button',$nav,1)){
											if((isset($opt['target']))&&($opt['target'] == "modal")){
												$build .= '<button type="button" value="'.$value.'" class="btn btn-'.$opt['color'].' btn-sm '.$class.'" id="'.$opt["targetid"].$item["id"].'"><i class="'.$opt["icon"].' '.$margin.'"></i>'.ucwords($text).'</button>';
											} else {
												$build .= '<a href="'.$opt['targetid'].$item["id"].'" class="btn btn-'.$opt['color'].' btn-sm '.$class.'"><i class="'.$opt["icon"].' '.$margin.'"></i>'.ucwords($text).'</a>';
											}
										}
									}
								}
							}
							if(((isset($settings["hide"]['buttons']))&&(!in_array('delete',$settings["hide"]['buttons'])))||(!isset($settings["hide"]['buttons']))){
								if($this->Auth->valid('plugin',$table,4)){
									if($this->Auth->valid('button','delete',1)){
										$build .= '<button type=button class="btn btn-danger btn-sm" id="btn-delete-'.$table.'-'.$item["id"].'"><i class="fas fa-trash-alt"></i></button>';
									}
								}
							}
							$build .= '</div>';
							$build .= $this->modalDelete($table, $item["id"], $settings);
							$build .= '</td></tr>';
            }
        }
        $build .= ' </tbody>
                  </table>
              </div>
            </div>
          </div>';
        return $build;
    }
}
