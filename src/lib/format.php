<?php

// Import Librairies
require_once dirname(__FILE__,3) . '/src/lib/api.php';

class Format extends API{

  public function config($name, $content, $plugin = null){
    switch ($name) {
      case "state":
        $config['type'] = 'text';
				$config['content'] = $this->States[$content];
        break;
      case "country":
        $config['type'] = 'text';
				$config['content'] = $this->Countries[$content];
        break;
			case "division":
				$config['type'] = 'text';
				$divisions = explode(',',trim($content,','));
				$config['content'] = '';
				if((isset($content))&&(!empty($content))){
					foreach($divisions as $division){
						$result = $this->Database->get('divisions',$division)->fetchArray()->all();
						if((isset($result['name']))&&(!empty($result['name']))){
							$config['content'] = trim($config['content'].', '.$result['name'],',');
						}
					}
				}
				break;
      case "assigned_to":
      case "supervisor":
      case "user":
      case "users":
      case "owner":
      case "updated_by":
				$config['type'] = 'text';
				if( strpos($content, ',') !== false ) {
					$list='';
					foreach(explode(',',trim($content,',')) as $user){
						$result = $this->Database->get('users',$user)->fetchArray()->all();
						if(!empty($result)){
							$list .= ucwords(str_replace('_',' ',str_replace('.',' ',$result['username']))).',';
						}
						$config['content']=trim($list,',');
					}
				} else {
					$result = $this->Database->get('users',$content)->fetchArray()->all();
					if((!empty($content))&&(!empty($result))){
						$config['content'] = ucwords(str_replace('_',' ',str_replace('.',' ',$result['username'])));
					} else {
						$config['content'] = '';
					}
				}
        break;
      case "client_id":
      case "client":
      case "clients":
        $config['type'] = 'text';
				$result = $this->Database->get('clients',$content)->fetchArray()->all();
				if(!empty($result)){
					$config['content'] = ucwords(str_replace('_',' ',str_replace('.',' ',$result['name'])));
				} else {
					$config['content'] = '';
				}
        break;
      case "divisions":
			case "division":
        $config['type'] = 'text';
				$result = $this->Database->get('divisions',$content)->fetchArray()->all();
				if(!empty($result)){
					$config['content'] = ucwords(str_replace('_',' ',str_replace('.',' ',$result['name'])));
				} else {
					$config['content'] = '';
				}
        break;
			case "email":
				$config['type'] = 'text';
				$config['allowHTML']=TRUE;
				break;
			case "tags":
        $config['type'] = 'text';
				$config['content']='';
				$config['allowHTML']=TRUE;
				$tags=explode(';',$content);
				foreach($tags as $tag){
					if($tag != ''){
						$config['content'].='<span class="badge bg-primary mr-1"><i class="fas fa-tag mr-1"></i>'.$tag.'</span>';
					}
				}
        break;
			case "content":
        $config['type'] = 'text';
				$config['allowHTML']=TRUE;
        break;
      case "contact_id":
      case "contact":
      case "contacts":
        $config['type'] = 'text';
				$result = $this->Database->get('contacts',$content)->fetchArray()->all();
				if(!empty($content)){
					$config['content'] = ucwords(str_replace('_',' ',str_replace('.',' ',$result['first_name'].' '.$result['last_name'])));
				} else {
					$config['content'] = '';
				}
        break;
      case "color":
        $config['type'] = 'color';
        break;
			case "priority":
				if($content != ""){
					$config['type'] = 'status';
					$config['list'] = $this->Priority[$plugin];
				} else {
					$config['type'] = 'text';
				}
        break;
      case "status":
				if($plugin == 'my_clients'){ $plugin='clients'; }
				if($content != ""){
					$config['type'] = 'status';
					$config['list'] = $this->Status[$plugin];
				} else {
					$config['type'] = 'text';
				}
        break;
      case "icon":
        $config['type'] = 'icon';
        break;
      default:
        $config['type'] = 'text';
        break;
    }
    return $config;
  }

  public function switch($content,$config){
		$checked = '';
		if(($content == 'TRUE')||($content == '1')||($content == 'on')||($content == 'enable')||($content == 'enabled')){ $checked = 'checked'; }
    $build = '<input type="checkbox" autocomplete="off" data-bootstrap-switch '.$checked.'>';
    return $build;
  }

  public function text($content,$config){
		if((isset($config['allowHTML']))&&($config['allowHTML'])){
    	$build = ''.$content.'';
		} else {
			$build = ''.htmlspecialchars($content).'';
		}
    return $build;
  }

  public function color($content,$config){
		$build = '<h5><span class="badge bg-'.$content.'">'.$content.'</span></h5>';
    return $build;
  }

  public function icon($content,$config){
		$build = '<i class="'.$content.'"></i>';
    return $build;
  }

  public function status($content,$config){
		$build = '<h5><span class="badge bg-'.$config['list'][$content]['color'].'"><i class="'.$config['list'][$content]['icon'].' mr-1"></i>'.$config['list'][$content]['name'].'</span></h5>';
    return $build;
  }

  public function field($name, $content, $plugin = null){
		if($plugin == null){
			$plugin = $this->Controller->Controller;
		}
		if($this->Auth->test('field',$name,1,$plugin)){
      $config = $this->config($name, $content, $plugin);
			$type = $config['type'];
			if((isset($config['content']))&&(!empty($config['content']))){
				$content = $config['content'];
			}
			$build = $this->$type($content,$config);
			return $build;
		}
  }
}
