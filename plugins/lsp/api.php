<?php
class lspAPI extends API{
	public function generate($request, $data){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			if(isset($data['type'])){
				switch($data['type']){
					case"structure":
						return $this->LSP->createStructure(dirname(__FILE__,3).'/config/structure.json');
						break;
					case"skeleton":
						return $this->LSP->createRecords(dirname(__FILE__,3).'/config/skeleton.json',["tables" => ['users','groups','roles','permissions','relationships','priorities','statuses','categories','sub_categories'], "maxID" => 99999]);
						break;
					case"sample":
						return $this->LSP->createRecords(dirname(__FILE__,3).'/config/sample.json');
						break;
				}
			}
		}
	}

	public function load($request, $data){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
			if(isset($data['type'])){
				switch($data['type']){
					case"structure":
						return $this->LSP->updateStructure(dirname(__FILE__,3).'/config/structure.json');
						break;
					case"skeleton":
						return $this->LSP->insertRecords(dirname(__FILE__,3).'/config/skeleton.json');
						break;
					case"sample":
						return $this->LSP->insertRecords(dirname(__FILE__,3).'/config/sample.json');
						break;
				}
			}
		}
	}
}
