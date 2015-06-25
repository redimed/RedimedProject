angular.module('app.loggedIn.invoice.services', [])

.factory('InvoiceService', function(Restangular){
	var mdtService = {}
	var mdtApi = Restangular.all("api/erm/v2");
	var api = Restangular.all('api');

	mdtService.headerDetail = function(id){
		var funcApi = mdtApi.all('invoice/detail');
		return funcApi.post({header_id: id});
	}

	mdtService.save = function(id, postData){
		var funcApi = mdtApi.all('invoice/save');
		return funcApi.post({ header_id: id, status:postData.STATUS, lines: postData.lines, service_id: postData.SERVICE_ID,postData:postData});
	}

	mdtService.update = function(id, postData){
		var funcApi = mdtApi.all('invoice/update');
		return funcApi.post({ header_id: id, data: postData});
	}

	mdtService.add = function(postData){
		var funcApi = mdtApi.all('invoice/add');
		return funcApi.post({data: postData});
	}

	/**
	 * tannv.dts@gmail.com
	 * 
	 */
	mdtService.removeInvoiceLine = function(data){
		var funcApi = mdtApi.all('invoice/remove_invoice_line');
		return funcApi.post({data: data});
	}

	/**
	 * tannv.dts@gmail.com
	 */
	mdtService.getInvoiceHeader=function(invoiceHeaderId)
	{
		var result = api.all('invoice/vn/get-invoice-header');
        return result.post({invoiceHeaderId:invoiceHeaderId});
	}

	/**
	 * tannv.dts@gmail.com
	 */
	mdtService.getInvoiceListLines=function(invoiceHeaderId)
	{
		var result=api.all("invoice/vn/get-invoice-list-lines");
		return result.post({invoiceHeaderId:invoiceHeaderId});
	}

	/**
	 * tannv.dts@gmail.com
	 * add new invoice line
	 */
	mdtService.createInvoiceLine=function(postData)
	{
		var result=mdtApi.all("invoice/create_invoice_line");
		return result.post({postData:postData});
	}

	/**
	 * tannv.dts@gmail.com
	 * update invoice line
	 */
	mdtService.updateInvoiceLine=function(postData)
	{
		var result=mdtApi.all('invoice/update_invoice_line');
		return result.post({postData:postData});
	}


	 // instanceService.invoiceDetail = function(header_id) {
  //       var funcApi = khankAPI.all('invoice/detail');
  //       return funcApi.post({header_id: header_id});
  //   }

    // instanceService.invoiceSave = function(header_id) {
    //     var funcApi = khankAPI.all('invoice/save');
    //     return funcApi.post({header_id: header_id});
    // }


	
	
	
	mdtService.search = function(option){
		var funcApi = mdtApi.all('search');
		return funcApi.post(option);
	}
	return mdtService;
})