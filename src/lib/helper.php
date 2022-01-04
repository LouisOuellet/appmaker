<?php
class Helper{

	protected $Settings; // Stores settings loaded from manifest.json and conf.json
  protected $Auth; // This contains the Auth class & the Database class for MySQL queries

  public function __construct($Auth){
    $this->Auth = $Auth;
    $this->Settings = $this->Auth->Settings;
  }

	protected function getRelationships($table,$id){
		// Init Relationships
		$relationships = [];
		// Fetch Relationships
		$relations = $this->Auth->query('SELECT * FROM `relationships` WHERE (`relationship_1` = ? AND `link_to_1` = ?) OR (`relationship_2` = ? AND `link_to_2` = ?) OR (`relationship_3` = ? AND `link_to_3` = ?)',[
			$table,
			$id,
			$table,
			$id,
			$table,
			$id,
		])->fetchAll();
		$relations = $relations->all();
		// Creating Relationships Array
		if(!empty($relations)){
			foreach($relations as $relation){
				$relationships[$relation['id']] = [];
				if(($relation['relationship_1'] != '')&&($relation['relationship_1'] != null)&&(($relation['relationship_1'] != $table)||(($relation['relationship_1'] == $table)&&($relation['link_to_1'] != $id)))){
					$new = [
						'relationship' => $relation['relationship_1'],
						'link_to' => $relation['link_to_1'],
					];
					array_push($relationships[$relation['id']],$new);
				}
				if(($relation['relationship_2'] != '')&&($relation['relationship_2'] != null)&&(($relation['relationship_2'] != $table)||(($relation['relationship_2'] == $table)&&($relation['link_to_2'] != $id)))){
					$new = [
						'relationship' => $relation['relationship_2'],
						'link_to' => $relation['link_to_2'],
					];
					array_push($relationships[$relation['id']],$new);
				}
				foreach($relationships[$relation['id']] as $key => $value){
					$relationships[$relation['id']][$key]['created'] = $relation['created'];
					$relationships[$relation['id']][$key]['owner'] = $relation['owner'];
					$relationships[$relation['id']][$key]['meta'] = $relation['meta'];
					// 3rd Relation
					if(($relation['relationship_3'] != '')||($relation['relationship_3'] != null)){
						$relationships[$relation['id']][$key][$relation['relationship_3']] = $relation['link_to_3'];
					}
					// MetaData
					if($relationships[$relation['id']][$key]['meta'] != '' && $relationships[$relation['id']][$key]['meta'] != null && !is_array($relationships[$relation['id']][$key]['meta'])){
						$relationships[$relation['id']][$key]['meta'] = json_decode($relationships[$relation['id']][$key]['meta'], true);
					} else { $relationships[$relation['id']][$key]['meta'] = []; }
				}
			}
		}
		// Return
		return $relationships;
	}
}
