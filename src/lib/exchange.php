<?php

class EXCHANGE {

	public $Rates;
	public $Rate;

	public function __construct(){
		$this->Rates = $this->fetchAllRates();
		foreach($this->Rates as $currency => $rate){
			$this->Rate[$currency] = $rate['latest'];
		}
		$this->Rate["CAD"] = 1;
	}

	public function fetchAllRates(){
		$currencies = ["AUD","BRL","CNY","EUR","HKD","INR","IDR","JPY","MXN","NZD","NOK","PEN","RUB","SAR","SGD","ZAR","KRW","SEK","CHF","TWD","TRY","GBP","USD"];
		$cURL = curl_init();
		curl_setopt($cURL, CURLOPT_URL, "https://www.bankofcanada.ca/valet/observations/group/FX_RATES_DAILY/json?start_date=2010-01-01");
		curl_setopt($cURL, CURLOPT_RETURNTRANSFER, 1);
		$rates = curl_exec($cURL);
		curl_close($cURL);
		$AllRates = [];
		if($rates != null){
			$rates = json_decode($rates,true)['observations'];
			foreach($currencies as $currency){
				if(is_array($rates)){
					foreach($rates as $rate){
						$AllRates[$currency][$rate['d']] = $rate['FX'.$currency.'CAD']['v'];
						$AllRates[$currency]['latest'] = $rate['FX'.$currency.'CAD']['v'];
					}
				}
			}
		}
		return $AllRates;
	}

	public function convert($value,$from,$to){
		return ($value*$this->Rate[$from])/$this->Rate[$to];
	}

}
