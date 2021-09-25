<?php

// Import Librairies
require_once dirname(__FILE__,3) . '/src/lib/api.php';

class Form extends API{

  private $Count = 0;

	public function getCount(){
		return $this->Count;
	}
  public function config($name){
		$config['name'] = $name;
		$config['list'] = [];
		$config['POST'] = '';
    switch ($name) {
      case "code":
        $config['icon'] = 'fas fa-barcode';
        $config['type'] = 'varchar';
        break;
      case "address":
        $config['icon'] = 'fas fa-map-marker-alt';
        $config['type'] = 'varchar';
        break;
      case "content":
        $config['icon'] = 'fas fa-align-left';
        $config['type'] = 'text';
        break;
      case "description":
			$config['icon'] = 'fas fa-i-cursor';
        $config['type'] = 'text';
        break;
      case "city":
        $config['icon'] = 'fas fa-city';
        $config['type'] = 'varchar';
        break;
      case "zipcode":
        $config['icon'] = 'fas fa-mail-bulk';
        $config['type'] = 'varchar';
        break;
      case "state":
        $config['icon'] = 'fas fa-map-pin';
        $config['type'] = 'select';
        foreach($this->States as $key => $item) {
          $config['list'][$key] = $key . " - " . ucwords($item);
        }
        break;
      case "country":
        $config['icon'] = 'far fa-flag';
        $config['type'] = 'select';
        foreach($this->Countries as $key => $item) {
          $config['list'][$key] = $key . " - " . ucwords($item);
        }
        break;
      case "ip":
        $config['icon'] = 'fas fa-ethernet';
        $config['type'] = 'varchar';
				$config['mask'] = '"alias": "ip"';
        break;
			case "office_num":
			case "other_num":
      case "phone":
        $config['icon'] = 'fas fa-phone';
        $config['type'] = 'varchar';
				$config['mask'] = '"mask": "(999) 999-9999 [x99999]"';
        break;
      case "mobile":
        $config['icon'] = 'fas fa-mobile-alt';
        $config['type'] = 'varchar';
				$config['mask'] = '"mask": "(999) 999-9999"';
        break;
      case "toll_free":
        $config['icon'] = 'fas fa-phone';
        $config['type'] = 'varchar';
				$config['mask'] = '"mask": "+9 (999) 999-9999 [x99999]"';
        break;
      case "original_hs":
			case "requested_hs":
        $config['icon'] = 'fas fa-barcode';
        $config['type'] = 'varchar';
				$config['mask'] = '"mask": "[9999][.99][.99][.99]"';
        break;
      case "fax":
        $config['icon'] = 'fas fa-fax';
        $config['type'] = 'varchar';
				$config['mask'] = '"mask": "(999) 999-9999"';
        break;
      case "email":
        $config['icon'] = 'fas fa-at';
        $config['type'] = 'varchar';
        break;
      case "website":
        $config['icon'] = 'fas fa-globe';
        $config['type'] = 'varchar';
        break;
      case "password":
        $config['icon'] = 'fas fa-key';
        $config['type'] = 'password';
        break;
      case "assigned_to":
				$config['POST'] = $this->Auth->User['id'];
      case "user":
      case "users":
        $config['icon'] = 'fas fa-user';
        $config['type'] = 'select';
        foreach($this->Database->get('users')->fetchAll()->all() as $key => $item) {
          $config['list'][$item['id']] = ucwords(str_replace('.',' ',$item['username']));
        }
        break;
      case "to":
        $config['icon'] = 'fas fa-user';
        $config['type'] = 'select_multi';
        foreach($this->Database->get('users')->fetchAll()->all() as $key => $item) {
					if($item['first_name'].$item['middle_name'].$item['last_name'] != ''){
						if($item['middle_name'] != ''){
							$config['list'][$item['id']] = $item['first_name'].' '.$item['middle_name'].' '.$item['last_name'];
						} else {
							$config['list'][$item['id']] = $item['first_name'].' '.$item['last_name'];
						}
					} else {
          	$config['list'][$item['id']] = ucwords(str_replace('.',' ',$item['username']));
					}
					if($item['relationship'] != ''){
						$relation=$this->Database->get($item['relationship'],$item['link_to'])->fetchArray()->all();
						$config['list'][$item['id']].=' ('.$relation['relationship'].')';
					}
        }
        break;
      case "supervisor":
        $config['icon'] = 'fas fa-crosshairs';
        $config['type'] = 'select';
        foreach($this->Database->get('users')->fetchAll()->all() as $key => $item) {
					if($item['first_name'].$item['middle_name'].$item['last_name'] != ''){
						if($item['middle_name'] != ''){
							$config['list'][$item['id']] = $item['first_name'].' '.$item['middle_name'].' '.$item['last_name'];
						} else {
							$config['list'][$item['id']] = $item['first_name'].' '.$item['last_name'];
						}
					} else {
						$config['list'][$item['id']] = ucwords(str_replace('.',' ',$item['username']));
					}
        }
        break;
      case "client_id":
      case "client":
      case "clients":
        $config['icon'] = 'fas fa-building';
        $config['type'] = 'select';
        foreach($this->Database->get('clients')->fetchAll()->all() as $key => $item) {
          $config['list'][$key] = ucwords(str_replace('.',' ',$item['name']));
        }
        break;
      case "decision":
			case "decisions":
        $config['icon'] = 'fas fa-university';
        $config['type'] = 'select';
        foreach($this->Database->get('decisions')->fetchAll()->all() as $key => $item) {
          $config['list'][$key] = ucwords(str_replace('.',' ',$item['trs']));
        }
        break;
      case "contact":
        $config['icon'] = 'fas fa-address-card';
        $config['type'] = 'select';
        break;
      case "group":
        $config['icon'] = 'fas fa-users';
        $config['type'] = 'select';
        break;
      case "default":
        $config['icon'] = 'fas fa-toggle-on';
        $config['type'] = 'switch';
        break;
      case "first_name":
      case "middle_name":
      case "last_name":
      case "initials":
        $config['icon'] = 'fas fa-user-tag';
        $config['type'] = 'varchar';
        break;
      case "username":
        $config['icon'] = 'fas fa-user-edit';
        $config['type'] = 'varchar';
        break;
      case "office":
        $config['icon'] = 'fas fa-building';
        $config['type'] = 'varchar';
        break;
      case "about":
        $config['icon'] = 'fas fa-id-card';
        $config['type'] = 'text';
        break;
      case "division":
			case "divisions":
        $config['icon'] = 'fas fa-building';
        $config['type'] = 'select_multi';
				$config['POST'] = $this->Auth->User['division'];
				foreach($this->Database->get('divisions')->fetchAll()->all() as $item) {
					if((in_array($item['id'],explode(',',$this->Auth->User['division'])))||(($this->Auth->test('custom','all-divisions',1)))){
          	$config['list'][$item['id']] = $item['name'];
					}
        }
        break;
      case "issue":
			case "issues":
        $config['icon'] = 'fas fa-gavel';
        $config['type'] = 'select_multi';
				$config['POST']=[];
				foreach($this->Database->get('issues')->fetchAll()->all() as $item) {
					$config['list'][$item['id']] = $item['id'].' - '.$item['name'];
					if($item['default'] != ''){
						array_push($config['POST'],$item['id']);
					}
        }
        break;
      case "job_title":
        $config['icon'] = 'fas fa-user-tie';
        $config['type'] = 'select_create';
				foreach($this->Database->get('job_titles')->fetchAll()->all() as $item) {
					$config['list'][$item['name']] = $item['name'];
        }
        break;
      case "tags":
        $config['icon'] = 'fas fa-tags';
        $config['type'] = 'select_multi_create';
				foreach($this->Database->get('tags')->fetchAll()->all() as $item) {
					$config['list'][$item['name']] = $item['name'];
        }
        break;
      case "effective_date":
			case "started_working_on":
			case "date":
			case "date_issued":
        $config['icon'] = 'far fa-calendar-alt';
        $config['type'] = 'date';
        break;
			case "birthday":
        $config['icon'] = 'fas fa-birthday-cake';
        $config['type'] = 'date';
        break;
			case "time":
        $config['icon'] = 'far fa-clock';
        $config['type'] = 'time';
        break;
			case "status":
        $config['icon'] = 'fas fa-thermometer-half';
        $config['type'] = 'custom_select';
        break;
			case "priority":
        $config['icon'] = 'fas fa-sort-numeric-up';
        $config['type'] = 'select';
        break;
      default:
        $config['icon'] = 'fas fa-i-cursor';
        $config['type'] = 'varchar';
        break;
    }
    return $config;
  }
  public function datetime($header, $POST = '', $config = []){
		$init = $this->config($header);
		if(empty($config)){ $config = $init; } else {
		  foreach($init as $setting => $value){
		    if(!isset($config[$setting])){
		      $config[$setting] = $init[$setting];
		    }
		  }
		}
		if(empty($POST)){ $POST = $config['POST']; }
		$display='';
		if((isset($config['hidden']))&&($config['hidden'] == 'TRUE')){
			$display='display:none;';
		}
    $build = '
      <div class="form-group row" style="'.$display.'">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <i class="'.$config['icon'].' mr-2"></i>'.ucwords($this->Language->_ARRAY[$config['name']]).'
            </span>
          </div>
          <input type="text" class="form-control datetimepicker" value="'.$POST.'" name="'.$header.'" id="'.$header.'" placeholder="'.ucwords($this->Language->_ARRAY[$header]).'">
        </div>
      </div>
    ';
    return $build;
  }
  public function date($header, $POST = '', $config = []){
		$init = $this->config($header);
		if(empty($config)){ $config = $init; } else {
		  foreach($init as $setting => $value){
		    if(!isset($config[$setting])){
		      $config[$setting] = $init[$setting];
		    }
		  }
		}
		if(empty($POST)){ $POST = $config['POST']; }
		$display='';
		if((isset($config['hidden']))&&($config['hidden'] == 'TRUE')){
			$display='display:none;';
		}
    $build = '
      <div class="form-group row" style="'.$display.'">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <i class="'.$config['icon'].' mr-2"></i>'.ucwords($this->Language->_ARRAY[$config['name']]).'
            </span>
          </div>
          <input type="text" class="form-control datepicker" value="'.$POST.'" name="'.$header.'" id="'.$header.'" placeholder="'.ucwords($this->Language->_ARRAY[$header]).'">
        </div>
      </div>
    ';
    return $build;
  }
  public function time($header, $POST = '', $config = []){
		$init = $this->config($header);
		if(empty($config)){ $config = $init; } else {
		  foreach($init as $setting => $value){
		    if(!isset($config[$setting])){
		      $config[$setting] = $init[$setting];
		    }
		  }
		}
		if(empty($POST)){ $POST = $config['POST']; }
		$display='';
		if((isset($config['hidden']))&&($config['hidden'] == 'TRUE')){
			$display='display:none;';
		}
    $build = '
      <div class="form-group row timepicker" style="'.$display.'" id="'.$this->Count.$header.'" data-target-input="nearest" data-target="#'.$this->Count.$header.'" data-toggle="datetimepicker">
        <div class="input-group date">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <i class="'.$config['icon'].' mr-2"></i>'.ucwords($this->Language->_ARRAY[$config['name']]).'
            </span>
          </div>
          <input type="text" class="form-control datetimepicker-input" data-target="#'.$this->Count.$header.'" value="'.$POST.'" name="'.$header.'" placeholder="'.ucwords($this->Language->_ARRAY[$header]).'">
        </div>
      </div>
    ';
    return $build;
  }
  public function text($header, $POST = '', $config = []){
		$init = $this->config($header);
		if(empty($config)){ $config = $init; } else {
		  foreach($init as $setting => $value){
		    if(!isset($config[$setting])){
		      $config[$setting] = $init[$setting];
		    }
		  }
		}
		if(empty($POST)){ $POST = $config['POST']; }
		$display='';
		if((isset($config['hidden']))&&($config['hidden'] == 'TRUE')){
			$display='display:none;';
		}
    $build = '
      <div class="form-group" style="'.$display.'">
        <textarea name="'.$header.'" class="form-control wysihtml5-alt" placeholder="'.ucwords($this->Language->_ARRAY[$header]).'">'.$POST.'</textarea>
      </div>
    ';
    return $build;
  }
  public function varchar($header, $POST = '', $config = []){
		$init = $this->config($header);
		if(empty($config)){ $config = $init; } else {
		  foreach($init as $setting => $value){
		    if(!isset($config[$setting])){
		      $config[$setting] = $init[$setting];
		    }
		  }
		}
		if(empty($POST)){ $POST = $config['POST']; }
		$mask = '';
		if((isset($config['mask']))&&(!empty($config['mask']))){
			$mask = 'data-inputmask=\''.$config['mask'].'\' data-mask';
		}
		$display='';
		if((isset($config['hidden']))&&($config['hidden'] == 'TRUE')){
			$display='display:none;';
		}
    $build = '
      <div class="form-group row" style="'.$display.'">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <i class="'.$config['icon'].' mr-2"></i>'.ucwords($this->Language->_ARRAY[$config['name']]).'
            </span>
          </div>
          <input type="text" class="form-control" value="'.$POST.'" name="'.$header.'" id="'.$header.'" placeholder="'.ucwords($this->Language->_ARRAY[$header]).'" '.$mask.'>
        </div>
      </div>
    ';
    return $build;
  }
  public function switch($header, $POST = '', $config = []){
		$init = $this->config($header);
		if(empty($config)){ $config = $init; } else {
		  foreach($init as $setting => $value){
		    if(!isset($config[$setting])){
		      $config[$setting] = $init[$setting];
		    }
		  }
		}
		if(empty($POST)){ $POST = $config['POST']; }
		if(!empty($POST)){ $POST = 'checked'; }
		$display='';
		if((isset($config['hidden']))&&($config['hidden'] == 'TRUE')){
			$display='display:none;';
		}
    $build = '
      <div class="form-group row" style="'.$display.'">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <i class="'.$config['icon'].' mr-2"></i>'.ucwords($this->Language->_ARRAY[$config['name']]).'
            </span>
          </div>
					<div class="border p-1 pl-5">
						<input type="checkbox" name="'.$header.'" id="'.$header.'" '.$POST.' data-bootstrap-switch>
					</div>
        </div>
      </div>
    ';
    return $build;
  }
  public function password($header, $POST = '', $config = []){
		$init = $this->config($header);
		if(empty($config)){ $config = $init; } else {
		  foreach($init as $setting => $value){
		    if(!isset($config[$setting])){
		      $config[$setting] = $init[$setting];
		    }
		  }
		}
		if(empty($POST)){ $POST = $config['POST']; }
		$display='';
		if((isset($config['hidden']))&&($config['hidden'] == 'TRUE')){
			$display='display:none;';
		}
    $build = '
      <div class="form-group row" style="'.$display.'">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <i class="'.$config['icon'].' mr-2"></i>'.ucwords($this->Language->_ARRAY[$config['name']]).'
            </span>
          </div>
          <input type="password" class="form-control" value="'.$POST.'" name="'.$header.'" id="'.$header.'" placeholder="'.ucwords($this->Language->_ARRAY[$header]).'">
          <input type="password" class="form-control" name="'.$header.'2" id="'.$header.'2" placeholder="Confirm '.ucwords($this->Language->_ARRAY[$header]).'">
        </div>
      </div>
    ';
    return $build;
  }
  public function select($header, $POST = '', $config = []){
    $init = $this->config($header);
		if(empty($config)){ $config = $init; } else {
		  foreach($init as $setting => $value){
		    if(!isset($config[$setting])){
		      $config[$setting] = $init[$setting];
		    }
		  }
		}
		if(empty($POST)){ $POST = $config['POST']; }
		$display='';
		if((isset($config['hidden']))&&($config['hidden'] == 'TRUE')){
			$display='display:none;';
		}
    $build = '
      <div class="form-group row" style="'.$display.'">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <i class="'.$config['icon'].' mr-2"></i>'.ucwords($this->Language->_ARRAY[$config['name']]).'
            </span>
          </div>
          <select class="form-control select2bs4" name="'.$header.'">
    ';
    foreach($config['list'] as $key => $item){
      $selected = "";
      if($key == $POST){ $selected='selected'; }
      $build .='<option value="'.$key.'" '.$selected.'>'.$item.'</option>';
    }
    $build .='
          </select>
        </div>
      </div>
    ';
    return $build;
  }
  public function select_create($header, $POST = '', $config = []){
    $init = $this->config($header);
		if(empty($config)){ $config = $init; } else {
		  foreach($init as $setting => $value){
		    if(!isset($config[$setting])){
		      $config[$setting] = $init[$setting];
		    }
		  }
		}
		if(empty($POST)){ $POST = $config['POST']; }
		$display='';
		if((isset($config['hidden']))&&($config['hidden'] == 'TRUE')){
			$display='display:none;';
		}
    $build = '
      <div class="form-group row" style="'.$display.'">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <i class="'.$config['icon'].' mr-2"></i>'.ucwords($this->Language->_ARRAY[$config['name']]).'
            </span>
          </div>
          <select class="form-control select2bs4tags" name="'.$header.'">
    ';
    foreach($config['list'] as $key => $item){
      $selected = "";
      if($key == $POST){ $selected='selected'; }
      $build .='<option value="'.$key.'" '.$selected.'>'.$item.'</option>';
    }
    $build .='
          </select>
        </div>
      </div>
    ';
    return $build;
  }
  public function select_multi($header, $POST = '', $config = []){
    $init = $this->config($header);
		if(empty($config)){ $config = $init; } else {
		  foreach($init as $setting => $value){
		    if(!isset($config[$setting])){
		      $config[$setting] = $init[$setting];
		    }
		  }
		}
		if(empty($POST)){ $POST = $config['POST']; }
		$display='';
		if((isset($config['hidden']))&&($config['hidden'] == 'TRUE')){
			$display='display:none;';
		}
    $build = '
      <div class="form-group row" style="'.$display.'">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <i class="'.$config['icon'].' mr-2"></i>'.ucwords($this->Language->_ARRAY[$config['name']]).'
            </span>
          </div>
          <select class="form-control select2bs4 select2-hidden-accessible" multiple="" data-placeholder="Select '.ucwords($header).'" tabindex="-1" aria-hidden="true" id="select'.$header.$this->Count.'" name="'.$header.'[]">';
		foreach($config['list'] as $key => $item){
			if(!is_array($POST)){
				$POST = explode(',',$POST);
			}
      $selected = "";
      if(in_array($key,$POST)){ $selected='selected'; }
      $build .='<option value="'.$key.'" '.$selected.'>'.$item.'</option>';
    }
    $build .='
          </select>
        </div>
      </div>
		';
		if((isset($config['selectall']))&&($config['selectall'] == 'TRUE')){
			$build .='
				<div class="form-group row" style="'.$display.'">
					<div class="icheck-primary">
						<input type="checkbox" id="check'.$header.$this->Count.'" name="check'.$header.$this->Count.'">
						<label for="check'.$header.$this->Count.'">Select All</label>
					</div>
				</div>
				<script type="text/javascript">
					$(document).ready(function() {
				    $("#check'.$header.$this->Count.'").click(function(){
			        if($("#check'.$header.$this->Count.'").is(":checked")){
		            $("#select'.$header.$this->Count.' > option").prop("selected", "selected");
		            $("#select'.$header.$this->Count.'").trigger("change");
			        } else {
		            $("#select'.$header.$this->Count.' > option").removeAttr("selected");
		            $("#select'.$header.$this->Count.'").trigger("change");
			        }
				    });
					});
				</script>
	    ';
		}
    return $build;
  }
  public function select_multi_create($header, $POST = '', $config = []){
    $init = $this->config($header);
		if(empty($config)){ $config = $init; } else {
		  foreach($init as $setting => $value){
		    if(!isset($config[$setting])){
		      $config[$setting] = $init[$setting];
		    }
		  }
		}
		if(empty($POST)){ $POST = $config['POST']; }
		$display='';
		if((isset($config['hidden']))&&($config['hidden'] == 'TRUE')){
			$display='display:none;';
		}
    $build = '
      <div class="form-group row" style="'.$display.'">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <i class="'.$config['icon'].' mr-2"></i>'.ucwords($this->Language->_ARRAY[$config['name']]).'
            </span>
          </div>
          <select class="form-control select2bs4tags select2-hidden-accessible" multiple="" data-placeholder="Select '.ucwords($header).'" tabindex="-1" aria-hidden="true" id="select'.$header.$this->Count.'" name="'.$header.'[]">';
		foreach($config['list'] as $key => $item){
			if(!is_array($POST)){
				$POST = explode(',',$POST);
			}
      $selected = "";
      if(in_array($key,$POST)){ $selected='selected'; }
      $build .='<option value="'.$key.'" '.$selected.'>'.$item.'</option>';
    }
    $build .='
          </select>
        </div>
      </div>
    ';
		if((isset($config['selectall']))&&($config['selectall'] == 'TRUE')){
			$build .='
				<div class="form-group row" style="'.$display.'">
					<div class="icheck-primary">
						<input type="checkbox" id="check'.$header.$this->Count.'" name="check'.$header.$this->Count.'">
						<label for="check'.$header.$this->Count.'">Select All</label>
					</div>
				</div>
				<script type="text/javascript">
					$(document).ready(function() {
				    $("#check'.$header.$this->Count.'").click(function(){
			        if($("#check'.$header.$this->Count.'").is(":checked")){
		            $("#select'.$header.$this->Count.' > option").prop("selected", "selected");
		            $("#select'.$header.$this->Count.'").trigger("change");
			        } else {
		            $("#select'.$header.$this->Count.' > option").removeAttr("selected");
		            $("#select'.$header.$this->Count.'").trigger("change");
			        }
				    });
					});
				</script>
	    ';
		}
    return $build;
  }
  public function field($header, $POST = '', $config = []){
		$this->Count++;
		$init = $this->config($header);
    if(empty($config)){ $config = $init; } else {
			foreach($init as $setting => $value){
				if((!isset($config[$setting]))||((isset($config[$setting]))&&(empty($config[$setting])))){
					$config[$setting] = $init[$setting];
				}
			}
		}
		$type = $config['type'];
    switch ($type) {
			case "select":
        $build = $this->select($header, $POST, $config);
        break;
			case "select_create":
        $build = $this->select_create($header, $POST, $config);
        break;
			case "select_multi":
        $build = $this->select_multi($header, $POST, $config);
        break;
			case "select_multi_create":
        $build = $this->select_multi_create($header, $POST, $config);
        break;
			case "switch":
        $build = $this->switch($header, $POST, $config);
        break;
      case "time":
        $build = $this->time($header, $POST, $config);
        break;
      case "date":
        $build = $this->date($header, $POST, $config);
        break;
      case "text":
        $build = $this->text($header, $POST, $config);
        break;
      case "password":
        $build = $this->password($header, $POST, $config);
        break;
      default:
        $build = $this->varchar($header, $POST, $config);
        break;
    }
    return $build;
  }
}
