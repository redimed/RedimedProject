var BaseRestClient = require('./k_rest_client');
var $q = require('q');

var _ = require('lodash');

function ERP_Rest (options) {
	var base_rest = new BaseRestClient(options.base_url);

	/*
	*	SEND TO SERVER 
	*/

	this.get_all_invoice_line = function() {
		return base_rest.get('dataar/ar/invoiceline/');
	}

	var push_customer = function(data) {
		return base_rest.post('ar/SYNCUSTOMERS/', data);
		//return base_rest.post('datahr/hr/vendor_customers/', data);
	}

	var push_item = function(data){
		return base_rest.post('ar/SYNITEMS/', data);
		//return base_rest.post('datainv/inv/', data);
	}

	var push_invoice_line = function(data) {
		return base_rest.post2('ar/INSERTBILLING/', data);
		//return base_rest.post2('dataar/ar/inv/', data);
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

	var push_invoice = function(header, lines) {
		var q = $q.defer();
		var result = {num_success: 0, num_total: lines.length};
		(function pushOne() {
            var line = lines.splice(0, 1)[0]; // get the first record of coll and reduce coll by one
            var data = _.assign(header, line);

           	push_invoice_line(data).then(function(response) {
           		console.log(response.data)
           		response.data = JSON.parse(response.data);
           		if(response.data && response.data.APEX_STATUS == 'success'){
           			++result.num_success;
           			if(lines.length > 0) {
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
			data.CUS_NUMBER1 = header.Patient_id;
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
	},

	this.push_invoice = function (header) {
		var p = header.patient;
		var header_info = {
			HEADER_ID : header.header_id,
			PATIENT_ID: header.Patient_id,
			PATIENT_NAME: p.Title + '. ' +  p.First_name + ' ' + p.Sur_name,
			COMPANY_ID: header.Company_id ? header.Company_id : 0,
			INSURER_ID: header.Insurer_id ? header.Insurer_id : 0,
		}

		var lines = []
		header.lines.forEach(function(line){
			lines.push({
				LINE_ID: line.line_id,
				ITEM_ID: line.ITEM_ID,
				PRICE : line.PRICE,
			    QUANTITY: line.QUANTITY,
				AMOUNT : line.PRICE * line.QUANTITY
			});
		});

		return push_invoice(header_info, lines);
	}

	return this;
}

var ERP = new ERP_Rest({
	base_url: '192.168.40.12:8080/apex/'
});

module.exports = ERP;