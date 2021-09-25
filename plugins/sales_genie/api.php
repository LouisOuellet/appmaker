<?php
class sales_genieAPI extends CRUDAPI {
	public function importLeads($request, $data = null){
		$leads=json_decode(file_get_contents(dirname(__FILE__,3) . '/tmp/import/leads.json'),true);
		foreach($leads['records'] as $lead){
			// Create Lead
			$client = $this->Auth->read('clients', $lead['businessName'], 'name');
			if($client == null){
				$newLead = [
					"name" => $lead['businessName'],
					"website" => $lead['website'],
					"tags" => $lead['primarySicDescription'],
					"city" => $lead['city'],
					"state" => $lead['stateProvince'],
					"zipcode" => $lead['postalCode'],
					"address" => $lead['address'],
					"phone" => $lead['phone'],
					"country" => "CA",
				];
				$id = $this->Auth->create('clients', $newLead);
				$client = $this->Auth->read('clients', $id)->all()[0];
			} else {
				$client = $client->all()[0];
			}
			// Create Contacts
			foreach($lead['contacts'] as $contact){
				$newcontact = [
					"first_name" => $contact['firstName'],
					"last_name" => $contact['lastName'],
					"job_title" => $contact['title'],
					"relationship" => 'clients',
					"link_to" => $client['id'],
				];
				$contactid = $this->Auth->create('contacts', $newcontact);
			}
			// Create Sales Genie Data
			$genie = [
				"businessStatusCode" => $lead['businessStatusCode'],
				"corporateSalesVolume" => $lead['corporateSalesVolume'],
				"corporateSalesVolumeRange" => $lead['corporateSalesVolumeRange'],
				"locationSalesVolumeRange" => $lead['locationSalesVolumeRange'],
				"locationSalesVolumeRangeCode" => $lead['locationSalesVolumeRangeCode'],
				"locationSalesVolumeActual " => $lead['locationSalesVolumeActual'],
				"salesVolumeActual" => $lead['salesVolumeActual'],
				"salesVolumeRange" => $lead['salesVolumeRange'],
				"salesVolumeCode" => $lead['salesVolumeCode'],
				"salesVolume" => $lead['salesVolume'],
				"corporateEmployeeSizeActual" => $lead['corporateEmployeeSizeActual'],
				"corporateEmployeeSizeRange" => $lead['corporateEmployeeSizeRange'],
				"locationEmployeeSizeActual" => $lead['locationEmployeeSizeActual'],
				"locationEmployeeSizeRange" => $lead['locationEmployeeSizeRange'],
				"locationEmployeeSizeRangeCode" => $lead['locationEmployeeSizeRangeCode'],
				"employeeSizeActual" => $lead['employeeSizeActual'],
				"employeeSizeRange" => $lead['employeeSizeRange'],
				"employeeSizeCode" => $lead['employeeSizeCode'],
				"employeeSize" => $lead['employeeSize'],
				"cma" => $lead['cma'],
				"locationType" => $lead['locationType'],
				"primarySic" => $lead['primarySic'],
				"primarySicDescription" => $lead['primarySicDescription'],
				"parentInfogroupId" => $lead['parentInfogroupId'],
				"isVerified" => $lead['isVerified'],
				"primarySicFormatted" => $lead['primarySicFormatted'],
				"businessName" => $lead['businessName'],
				"latitude" => $lead['latitude'],
				"longitude" => $lead['longitude'],
				"msa" => $lead['msa'],
				"unitNumber" => $lead['unitNumber'],
				"streetSuffix" => $lead['streetSuffix'],
				"latitudeFromatted" => $lead['latitudeFromatted'],
				"longitudeFromatted" => $lead['longitudeFromatted'],
				"infogroupId" => $lead['infogroupId'],
				"isCallablePhone" => $lead['isCallablePhone'],
				"isLinkageUp" => $lead['isLinkageUp'],
				"relationship" => 'clients',
				"link_to" => $id,
			];
			$id = $this->Auth->create('sales_genie', $genie);
			$genie = $this->Auth->read('sales_genie', $id)->all()[0];
		}
	}
}
