var BaseRestClient = require('./k_rest_client');
var $q = require('q');

function ERP_Rest (options) {
	var base_rest = BaseRestClient(options.base_url);

	/*
	*	SEND TO SERVER 
	*/

	this.get_all_invoice_line = function() {
		return base_rest.get('dataar/ar/invoiceline/');
	}

	// http://192.168.10.42:8080/apex/datahr/hr/vendor_customers/
	var push_customer = function(data) {
		return base_rest.post('datahr/hr/vendor_customers/', data);
	}

	var push_invoice = function() {

	}

	var push_item = function(data){
		return base_rest.post('datainv/inv/', data);
	}

	var push_items = function(items){
		var q = $q.defer();
		var result = {num_success: 0, num_total: items.length};
		(function pushOne() {
            var item = items.splice(0, 1)[0]; // get the first record of coll and reduce coll by one
           	
            var data = {
            	OLD_ITEM_NUMBER: item.ITEM_ID,
            	OLD_ITEM_NUMBER2: parseInt(item.ITEM_CODE),
            	PRIMARY_UOM: item.UOM ? item.UOM : 'none',
            	ITEM_NAME1: item.ITEM_NAME
            };

           	push_item(data).then(function(response) {
           		console.log(response.data)
           		response.data = JSON.parse(response.data);
           		if(response.data.APEX_STATUS == 'success'){
           			++result.num_success;
           			if(items.length > 0) {
           				pushOne();
           			} else {
           				q.resolve(result);
           			}
           		} else {
           			q.reject({error: 'Error', result: result});
           		}
           	},function(error) {
           		q.reject({error: error, result: result});
           	});
           
        })();	
        return q.promise;
	}


	/*
	*	PROCESSS 
	*/

	this.push_customer = function(header) {
		var data = { 
			VS_NAME: null, 
			ADDRESS: null, 
			CUS_NUMBER1: null,
			CUS_CHAR20: null, 
			S_PHONE: null,
			S_VS_SITE_NAME: null,
			S_ADDRESS_LINE1: null,
		};
		if(header.insurer) {
			data.VS_NAME = header.insurer.insurer_name;
			data.ADDRESS = header.insurer.address;
			data.S_PHONE = header.insurer.phone;
			data.CUS_NUMBER1 = header.insurer.id;
			data.CUS_CHAR20 = 'insurer';
		} else if(header.company) {
			data.VS_NAME = header.company.Company_name;
			data.ADDRESS = header.company.Addr;
			data.S_PHONE = header.company.Phone //? header.company.Phone : '';
			data.CUS_NUMBER1 = header.company.id;
			data.CUS_CHAR20 = 'company';
		} else {
			var p = header.patient;
			data.VS_NAME = p.Title + '. ' +  p.First_name + ' ' + p.Sur_name;
			data.ADDRESS = p.Address1;
			data.S_PHONE = p.Mobile //? p.Mobile: '';
			data.CUS_NUMBER1 = header.company.Patient_id;
			data.CUS_CHAR20 = 'patient';
		}
		data.S_VS_SITE_NAME = header.site.Site_name;
		data.S_ADDRESS_LINE1 = data.ADDRESS;

		return push_customer(data);
	}

	this.push_items = function(header) {
		var items = [];
		header.lines.forEach(function(line){
			items.push(line.invItem);
		});
		return push_items(items);
	}

	return this;
}

var ERP = new ERP_Rest({
	base_url: '192.168.10.42:8080/apex/'
});

module.exports = ERP;