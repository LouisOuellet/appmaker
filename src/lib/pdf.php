<?php

// Import Librairies
require dirname(__FILE__,3) . '/config/tcpdf.php';
require dirname(__FILE__,3) . '/vendor/tcpdf/tcpdf.php';
require dirname(__FILE__,3) . '/vendor/php-pdf-merge/src/Jurosh/PDFMerge/PDFMerger.php';
require dirname(__FILE__,3) . '/vendor/php-pdf-merge/src/Jurosh/PDFMerge/PDFObject.php';

class PDFMail extends TCPDF{
	//Page header
	public function Header() {
		$this->SetY(10);
		$details=explode(', ',$this->keywords);
		$html = '
			<div>
				<strong>Subject:</strong> '.$this->subject.'<br />
				<strong>From:</strong> '.$this->author.'<br />
				<strong>Date:</strong> '.$details[0].'<br />
				<strong>To:</strong> '.$details[1].'
			</div>';
		$this->writeHTML($html, true, false, true, false, '');
		// print an ending header line
		$this->SetLineStyle(array('width' => 0.85 / $this->k, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => '007BFF'));
		$this->SetY((2.835 / $this->k) + $this->y);
		if ($this->rtl) {
			$this->SetX($this->original_rMargin);
		} else {
			$this->SetX($this->original_lMargin);
		}
		$this->Cell(($this->w - $this->original_lMargin - $this->original_rMargin), 0, '', 'T', 0, 'C');
	}
}

class PDF {
	public $TCPDF;
	public $PDFMail;

	public function __construct(){
		$this->TCPDF = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
		$this->PDFMail = new PDFMail(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
	}

	public function Combine($files=[],$destination = "tmp"){
		$pdf = new PDFMerger();
		foreach($files as $file){ $pdf->addPDF($file, 'all'); }
		$output = trim($destination,'/').'/'.time().'.pdf';
		$pdf->merge('file', $output);
		return $output;
	}

	public function Mail($msg){
		$this->PDFMail->SetAuthor($msg['from']);
		$this->PDFMail->SetTitle('Message '.$msg['id']);
		$this->PDFMail->SetSubject($msg['subject']);
		$this->PDFMail->SetKeywords($msg['created'].', '.$msg['to']);

		// set default header data
		$this->PDFMail->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE.' '.$msg['id'], PDF_HEADER_STRING);

		// set header and footer fonts
		$this->PDFMail->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
		$this->PDFMail->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

		// set default monospaced font
		$this->PDFMail->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

		// set margins
		$this->PDFMail->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
		$this->PDFMail->SetHeaderMargin(PDF_MARGIN_HEADER);
		$this->PDFMail->SetFooterMargin(PDF_MARGIN_FOOTER);

		// set auto page breaks
		$this->PDFMail->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

		// set image scale factor
		$this->PDFMail->setImageScale(PDF_IMAGE_SCALE_RATIO);

		// set font
		$this->PDFMail->SetFont('dejavusans', '', 10);

		// add a page
		$this->PDFMail->AddPage();

		// create some HTML content
		$html = '<div>'.$msg['body'].'</div>';

		// output the HTML content
		$this->PDFMail->writeHTML($html, true, false, true, false, '');

		// reset pointer to the last page
		$this->PDFMail->lastPage();

		//Close and output PDF document
		$this->PDFMail->Output('message'.$msg['id'].'.pdf', 'I');
	}
}
