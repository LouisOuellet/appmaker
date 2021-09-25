<?php
class groupsAPI extends CRUDAPI {

	public function unlink($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			// Return
			$return = [
				"error" => $this->Language->Field["Unable to complete the request"],
				"request" => $request,
				"data" => $data,
				"output" => [
					'relationship' => $data['relationship']['relationship'],
					'id' => $data['relationship']['link_to'],
				],
			];
			$relationships = $this->getRelationships($request,$data['id']);
			foreach($relationships as $id => $relationship){
				foreach($relationship as $relation){
					if(($relation['relationship'] == $data['relationship']['relationship'])&&($relation['link_to'] == $data['relationship']['link_to'])){
						$this->Auth->delete('relationships',$id);
						// Return
						$return = [
							"success" => $this->Language->Field["Record successfully updated"],
							"request" => $request,
							"data" => $data,
							"output" => [
								'relationship' => $data['relationship']['relationship'],
								'id' => $data['relationship']['link_to'],
							],
						];
					}
				}
			}
			return $return;
		}
	}

	public function link($request = null, $data = null){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			// Return
			$return = [
				"error" => $this->Language->Field["Unable to complete the request"],
				"request" => $request,
				"data" => $data,
				"output" => [
					'relationship' => $data['relationship']['relationship'],
					'id' => $data['relationship']['link_to'],
				],
			];
			$found = true;
			$relationships = $this->getRelationships($request,$data['id']);
			foreach($relationships as $id => $relationship){
				foreach($relationship as $relation){
					if(($relation['relationship'] == $data['relationship']['relationship'])&&($relation['link_to'] == $data['relationship']['link_to'])){
						$found = false;
					}
				}
			}
			if($found){
				$new = [
					'relationship_1' => $request,
					'link_to_1' => $data['id'],
					'relationship_2' => $data['relationship']['relationship'],
					'link_to_2' => $data['relationship']['link_to'],
				];
				$id = $this->Auth->create('relationships',$new);
				$relation = $this->Auth->read($data['relationship']['relationship'],$data['relationship']['link_to']);
				if($relation != null){
					$relation = $relation->all()[0];
					$rel = $this->Auth->read('relationships',$id);
					if($rel != null){
						$rel = $rel->all()[0];
						$rel = $this->convertToDOM($rel);
						// Return
						$return = [
							"success" => $this->Language->Field["Record successfully updated"],
							"request" => $request,
							"data" => $data,
							"output" => [
								'relationship' => $data['relationship']['relationship'],
								'id' => $data['relationship']['link_to'],
								'dom' => $this->convertToDOM($relation),
								'raw' => $relation,
								'timeline' => [
									'relationship' => $data['relationship']['relationship'],
									'link_to' => $data['relationship']['link_to'],
									'created' => $rel['created'],
									'owner' => $rel['owner'],
								],
							],
						];
						if(isset($new['relationship_3'],$new['link_to_3'])){ $return['output']['timeline'][$new['relationship_3']] = $new['link_to_3']; }
					}
				}
			}
			return $return;
		}
	}
}
