var BaseRestClient = require('./k_rest_client');


function ERP_Rest () {
	var base_rest = BaseRestClient('192.168.10.42:8080/apex/dataar/ar/');


	this.get_all_invoice_line = function() {
		return base_rest.get('invoiceline/');
	}

	this.push_invoice = function() {

	}

	return this;
}

var ERP = new ERP_Rest();

module.exports = ERP;