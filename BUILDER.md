# ALB Connect - Builder

## Attributes
 * data-plugin => Plugin linked to element
 * data-key => Plugin Key linked to element
 * data-keys => Plugin Keys linked to element
 * data-language => Language field of element
 * data-form => Form linked to element
 * data-control => Name of the control a button will trigger

## Components
 * counts => Array of variables containing counts of various components.
 * card => Builder.card(element, options, callback);
   * element => The builder will replace the html in this DOM element.
	 * options => { title:'Users', icon:'users', css:'card-danger' } (Not Required)
	   * title => The title of the card
		 * icon => Icon of the card
		 * css => Additionnal CSS classes to add to the .card element
	 * callback => function(card){ console.log(card); } (Not Required)
	   * The card component will return the inserted card element for further processing after it is inserted into the DOM.
